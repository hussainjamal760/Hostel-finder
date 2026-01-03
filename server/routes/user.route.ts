import express from 'express'
import { activateUser, loginUser, logoutUser, registrationUser } from '../controllers/user.controllers'
import { authorizeRoles, isAuthenticated } from '../middlewares/auth'
const userRouter = express.Router()

userRouter.post('/registration' , registrationUser)
userRouter.post('/activate-user' , activateUser)
userRouter.post('/login' , loginUser)
userRouter.post('/logout', isAuthenticated  , logoutUser)

export default userRouter