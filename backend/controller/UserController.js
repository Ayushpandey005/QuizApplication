import { catchAsyncError } from '../middleware/catchAsyncError.js'
import ErrorHandler from '../middleware/error.js'
import UserModel from'../model/UserModel.js'
import jwt from 'jsonwebtoken'
import { sendToken } from '../utils/jwtToken.js'


export const RegisterUser = catchAsyncError(async(req, res, next) => {
    const {name, email, password, role} = req.body
    if(!name || !email || !password || !role){
        return next(new ErrorHandler("Please provide all fields!"))
    } 
    const isEmail = await UserModel.findOne({email})
    if(isEmail){
        return next(new ErrorHandler("Email already exists!"))
    }
    const user = await UserModel.create({
        name, email, password, role
    })
    sendToken(user, 201, res, "User registered successfully!")
})


export const getUser = catchAsyncError(async(req, res, next) => {
    const user = req.user
    res.status(200).json({
        success: true,
        user
    })
})

export const loginUser = catchAsyncError(async(req ,res, next) => {
    const {email, password, role} = req.body
    if(!email || !password || !role){
        return next(new ErrorHandler("Please provide all fields!", 400))
    }
    const user = await UserModel.findOne({email}).select("+password")
    if(!user){
        return next(new ErrorHandler("Invalid Email or Password!", 400))
    }
    const isPasswordMatched = await user.comparePassword(password)
    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid Email or Password!", 400))
    }
    if(user.role !== role){
        return next(new ErrorHandler("User with this, not found", 400))
    }
    sendToken(user, 200, res, "User logged in successfully!")
})


export const logoutUser = catchAsyncError(async(req ,res, next) => {
    res.status(201).cookie("token", "", {
        httpOnly: true,
        expires: new Date(Date.now())
    }).json({
        success: true,
        message : "User logged out successfully!"
    })
})

