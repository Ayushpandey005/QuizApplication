import { catchAsyncError } from "../middleware/catchAsyncError.js"
import ErrorHandler from "../middleware/error.js"
import ResultModel from "../model/ResultModel.js"

//teacher can see result of students of the quiz which they created
export const getStudentQuizResult = catchAsyncError(async(req, res, next) => {
    const {role} = req.user
    if(role === "student"){
        return next(new ErrorHandler("Student cannot access this resources!"), 400)
    }
    const {quizId} = req.params
    const userId = req.user._id
    const result = await ResultModel.findOne({quiz: quizId, userId: userId})
    .populate('quiz')
    if(!result){
      return next(new ErrorHandler("Result not found!"), 404)
    }
    res.status(200).json({
      success: true,
      message: "Result found!",
      result
    })
  })