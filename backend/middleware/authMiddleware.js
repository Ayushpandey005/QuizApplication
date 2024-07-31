import jwt from 'jsonwebtoken'
import { catchAsyncError } from './catchAsyncError.js'
import ErrorHandler from './error.js'
import UserModel from '../model/UserModel.js'

export const isAuthenticated = catchAsyncError(async(req ,res, next) => {
    const {token} = req.cookies
    if(!token){
        return next(new ErrorHandler("User not authenticated", 401))
    }
    //user details will store in decoded
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
    req.user = await UserModel.findById(decoded.id)
    next()
})