import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middlewares/CatchAsyncErrorMiddleware";
import userModel,{IUser} from "../models/user.model";
import ErrorHandler from "../utils/ErrorHandler";
import jwt from "jsonwebtoken"
require('dotenv').config();
import { Secret } from "jsonwebtoken";
import path from "node:path";
import ejs from "ejs"



interface IRegistrationBody{
    name : string , 
    email:string , 
    phone:string,
    password:string,
    avatar?:string
}

export const registrationUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {

    const { name, email, phone, password, avatar } = req.body;

    if (!name || !email || !phone || !password) {
      return next(new ErrorHandler("All fields are required", 400));
    }

    const isEmailExists = await userModel.findOne({
      email: email.toLowerCase()
    });

    if (isEmailExists) {
      return next(new ErrorHandler("Email already exists", 400));
    }

    const user = await userModel.create({
      name,
      email: email.toLowerCase(),
      phone,
      password,
      avatar,
      isActive: false,
      role: "user",
      hostelRequestStatus: "none",
    });

    const { token, activationCode } = createActivationToken(user);

    const data = {
      user: { name: user.name },
      activationCode,
    };

    const html = await ejs.renderFile(
      path.join(__dirname, "../mails/activation-mail.ejs"),
      data
    );

    

    res.status(201).json({
      success: true,
      message: "User registered successfully. Please verify your account.",
      activationToken: token,
    });
});



interface IActivationToken {
  token: string;
  activationCode: string;
}

export const createActivationToken = (user: IUser): IActivationToken => {
  const activationCode = Math.floor(1000 + Math.random() * 9000).toString();

  const token = jwt.sign(
    {
      userId: user._id,
      activationCode,
    },
    process.env.ACTIVATION_SECRET as Secret,
    { expiresIn: "5m" }
  );

  return { token, activationCode };
};
