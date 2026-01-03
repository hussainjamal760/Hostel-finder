import express, {Request , Response , NextFunction } from 'express'
import cors from 'cors'
require("dotenv").config()
import cookieParser from "cookie-parser"
import { ErrorMiddleware } from './middlewares/ErrorMiddleware';
import userRouter from './routes/user.route';
export const app = express();

app.use(cookieParser())
app.use(express.json({limit:"50mb"}))
app.use(express.urlencoded({ extended: true }));
app.use(cors(({
    origin:process.env.ORIGIN,
})))


app.use('/api/v1' , userRouter)

app.get('/api' , (req:Request , res:Response , next:NextFunction) =>{
    res.status(200).json({
        success:true,
        message:"API working"
    })
})


app.use((req:Request , res:Response , next:NextFunction) =>{
    const err = new Error(`Route ${req.originalUrl} not found`) as any
    err.statusCode = 404
    next(err)
})


app.use(ErrorMiddleware)