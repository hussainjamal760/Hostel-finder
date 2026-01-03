import { NextFunction, Request, Response } from "express";
import jwt, { Secret } from "jsonwebtoken";
import path from "path";
import ejs from "ejs";

import userModel, { IUser } from "../models/user.model";
import { CatchAsyncError } from "../middlewares/CatchAsyncErrorMiddleware";
import ErrorHandler from "../utils/ErrorHandler";
import sendMail from "../utils/sendmail";

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
    const { name, email, phone, password, avatar } =
      req.body as IRegistrationBody;

    if (!name || !email || !phone || !password) {
      return next(new ErrorHandler("All fields are required", 400));
    }

    const existingUser = await userModel.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return next(new ErrorHandler("Email already exists", 400));
    }

    const user: IUser = await userModel.create({
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

    await sendMail({
      email: user.email,
      subject: "Activate your account",
      template: "activation-mail.ejs",
      data,
    });

    res.status(201).json({
      success: true,
      message: `Please check ${user.email} to activate your account`,
      activationToken: token,
    });
  }
);


const createActivationToken = (user: IUser) => {
  const activationCode = Math.floor(1000 + Math.random() * 9000).toString();

  const token = jwt.sign(
    {
      userId: user._id.toString(),
      activationCode,
    },
    process.env.ACTIVATION_SECRET as Secret,
    { expiresIn: "5m" }
  );

  return { token, activationCode };
};


export const activateUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { activation_token, activation_code } =
      req.body as IActivationRequest;

    if (!activation_token || !activation_code) {
      return next(new ErrorHandler("Invalid activation request", 400));
    }

    let payload: IActivationPayload;

    try {
      payload = jwt.verify(
        activation_token,
        process.env.ACTIVATION_SECRET as string
      ) as IActivationPayload;
    } catch (error) {
      return next(new ErrorHandler("Activation token expired or invalid", 400));
    }

    const user = await userModel.findById(payload.userId);

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    if (user.isActive) {
      return next(new ErrorHandler("Account already activated", 400));
    }

    if (payload.activationCode !== activation_code) {
      return next(new ErrorHandler("Invalid activation code", 400));
    }

    user.isActive = true;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Account activated successfully",
    });
  }
);
