import express, {Request , Response , NextFunction } from 'express'
import cors from 'cors'
require("dotenv").config()
import cookieParser from "cookie-parser"
export const app = express();

app.use(cookieParser())
app.use(express.json({limit:"50mb"}))
app.use(cors(({
    origin:process.env.ORIGIN,
})))

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


