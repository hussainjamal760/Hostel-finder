import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import userModel, { IUser } from "../models/user.model";
import { CatchAsyncError } from "../middlewares/CatchAsyncErrorMiddleware";
import ErrorHandler from "../utils/ErrorHandler";
import sendMail from "../utils/sendmail";
import { accessTokenOptions, refreshTokenOptions, sendToken } from "../utils/jwt";
import { redis } from "../config/redis";
import { getUserById } from "../services/user.service";

interface IRegistrationBody {
  name: string;
  email: string;
  phone: string;
  password: string;
  avatar?: {
    public_id?: string;
    url?: string;
  };
}

interface IActivationPayload {
  userId: string;
  activationCode: string;
}

interface IActivationRequest {
  activation_token: string;
  activation_code: string;
}


export const registrationUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, phone, password, avatar } = req.body;

    const existingUser = await userModel.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return next(new ErrorHandler("Email already exists", 400));
    }

    const user = {
      name,
      email: email.toLowerCase(),
      phone,
      password,
      avatar,
    };

    const activationToken = createActivationToken(user); 

    const data = { user: { name: user.name }, activationCode: activationToken.activationCode };

    await sendMail({
      email: user.email,
      subject: "Activate your account",
      template: "activation-mail.ejs",
      data,
    });

    res.status(201).json({
      success: true,
      message: `Please check ${user.email} to activate your account`,
      activationToken: activationToken.token,
    });
  }
);


const createActivationToken = (user: any) => {
  const activationCode = Math.floor(1000 + Math.random() * 9000).toString();

  const token = jwt.sign(
    {
      user, 
      activationCode,
    },
    process.env.ACTIVATION_SECRET as Secret,
    { expiresIn: "5m" }
  );

  return { token, activationCode };
};


export const activateUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { activation_token, activation_code } = req.body as IActivationRequest;

    if (!activation_token || !activation_code) {
      return next(new ErrorHandler("Invalid activation request", 400));
    }

    let payload: any; 
    try {
      payload = jwt.verify(
        activation_token,
        process.env.ACTIVATION_SECRET as string
      );
    } catch (error) {
      return next(new ErrorHandler("Activation token expired or invalid", 400));
    }

    if (payload.activationCode !== activation_code) {
      return next(new ErrorHandler("Invalid activation code", 400));
    }

    const { name, email, phone, password, avatar } = payload.user;

    const existUser = await userModel.findOne({ email });
    if (existUser) {
      return next(new ErrorHandler("Email already exists", 400));
    }

    await userModel.create({
      name,
      email,
      phone,
      password,
      avatar,
      isActive: true, 
      role: "user",
      hostelRequestStatus: "none",
    });

    res.status(200).json({
      success: true,
      message: "Account activated successfully",
    });
  }
);


interface ILoginRequest {
  email:string,
  password:string
}

export const loginUser = CatchAsyncError(async (req:Request,res:Response , next :NextFunction)=>{
  try {
    
    const {email , password} = req.body as ILoginRequest

    if(!email || !password) {
      return next(new ErrorHandler("Please enter email and password" , 400))
    }

    const user = await userModel.findOne({email}).select("+password")

    if(!user){
      return next(new ErrorHandler("Invalid email or password" , 400))
    }

    const isPasswordMatch = await user.comparePassword(password)

    if(!isPasswordMatch){
      return next(new ErrorHandler("Invalid email or password" , 400))
    }

    sendToken(user , 200 , res)

  } catch (error:any) {
    return next(new ErrorHandler(error.message ,400))
  }
})

export const logoutUser = CatchAsyncError(async (req:Request, res:Response , next:NextFunction)=>{
  try {
    res.cookie("access_token" , "" , {maxAge : 1})
    res.cookie("refresh_token" , "" , {maxAge : 1})

   const userId = (req.user?._id || "").toString(); 
    
    if (userId) {
        await redis.del(userId);
    }
    res.status(200).json({
      status:true,
      message:"Logged out successfully"
    })
  } catch (error:any) {
    return next(new ErrorHandler(error.message , 400))
  }
})

export const updateAccessToken = CatchAsyncError(async(req:Request, res:Response, next:NextFunction)=>{
    try {
        const refresh_token = req.cookies.refresh_token;
        
        if (!refresh_token) {
            return next(new ErrorHandler("Please login to access this resource", 400));
        }

        let decoded: JwtPayload;
        try {
            decoded = jwt.verify(
                refresh_token, 
                process.env.REFRESH_TOKEN as string
            ) as JwtPayload;
        } catch (error: any) {
            return next(new ErrorHandler("Invalid or expired refresh token", 400));
        }

        if (!decoded || !decoded.id) {
            return next(new ErrorHandler("Invalid token structure", 400));
        }

        const session = await redis.get(decoded.id);
        
        if (!session) {
            return next(new ErrorHandler("Please login to access this resource", 400));
        }

        const user = JSON.parse(session);
        
        if (!user || !user._id) {
            return next(new ErrorHandler("Invalid session data", 400));
        }

        const accessToken = jwt.sign(
            {id: user._id}, 
            process.env.ACCESS_TOKEN as string,
            {expiresIn: '3d'}
        );

        const refreshToken = jwt.sign(
            {id: user._id}, 
            process.env.REFRESH_TOKEN as string,
            {expiresIn: '7d'}
        );


        req.user=user;

        res.cookie('access_token', accessToken, accessTokenOptions);
        res.cookie('refresh_token', refreshToken, refreshTokenOptions);

        await redis.set(user._id , JSON.stringify(user), "EX" , 604800)

        res.status(200).json({
            success: true,
            status: "Success",
            accessToken
        });

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});


export const getUserInfo = CatchAsyncError(async (req:Request,res:Response,next:NextFunction)=>{
    try{
        const userId = req.user?._id.toString();
        if (!userId) {
        return next(new ErrorHandler("User not found", 400));
        }
        getUserById(userId,res)

    }catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
})


interface ISocialAuth{
    name:string,
    email:string,
    avatar?:string,
}

export const socialAuth = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, email, avatar } = req.body as ISocialAuth;
        const user = await userModel.findOne({ email });

        if (!user) {
            const newUser = await userModel.create({
                name,
                email,
                avatar: {
                    url: avatar,
                    public_id: "social_auth_avatar" 
                },
            });
            sendToken(newUser, 200, res);
        } else {
            sendToken(user, 200, res);
        }
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});
