import { catchAsyncError } from "../middleware/catchAsyncError.js";
import ErrorHandler from "../middleware/error.js";
import CategoryModel from "../model/CategoryModel.js";


export const createCategory = catchAsyncError(async(req ,res, next) => {
    const {role} = req.user
    if(role === "student"){
        return next(new ErrorHandler("Student is not allowed to access this resources!"))
    }
    const {name, description} = req.body
    if(!name){
        return next(new ErrorHandler("Category name is required!", 400))
    }
    const category = await CategoryModel.create({name, description})
    res.status(200).json({
        success: true,
        message: "Category created successfully",
        category
    })
})