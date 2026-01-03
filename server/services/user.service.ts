import { NextFunction, Response , Request } from "express"
import {redis} from "../config/redis"
import userModel from "../models/user.model";

export const getUserById = async(id:string , res:Response)=>{
    const user =await userModel.findById(id)
   
        res.status(201).json({
            status:true,
            user,
        })

}