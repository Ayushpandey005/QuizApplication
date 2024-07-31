import { catchAsyncError } from "../middleware/catchAsyncError.js";
import ErrorHandler from "../middleware/error.js";
import QuizModel from "../model/QuizModel.js"
import ResultModel from "../model/ResultModel.js";
import UserModel from "../model/UserModel.js"
import nodemailer from "nodemailer";

export const createQuiz = catchAsyncError(async(req ,res, next) => {
  const {role} = req.user
  if(role === "student"){
    return next(new ErrorHandler("Student is not allowed to access this resources", 400))
  }
  const {title, category, questions, scheduleDate} = req.body
  if(!title || !category || !questions){
    return next(new ErrorHandler("Please provide all fields!"))
  }
  if (!Array.isArray(questions) || questions.length === 0) {
    return next(new ErrorHandler('Questions must be a non-empty array!', 400));
  }
  for (const question of questions) {
    if (!question.question || !Array.isArray(question.options) || !question.correctAnswer) {
      return next(new ErrorHandler('Each question must have a question text, options, and a correct answer!', 400));
    }
  }
  const createdBy = req.user._id
  const finalScheduleDate = scheduleDate || new Date();
  const quiz = await QuizModel.create({
    title, category, questions, createdBy, scheduleDate : finalScheduleDate
  })
  res.status(200).json({
    success: true,
    message: "Quiz created successfully!",
    quiz
  })
})

//get all quizzes
export const getQuizzes = catchAsyncError(async(req ,res, next) => {
  const quizzes = await QuizModel.find()
  res.status(200).json({
    success: true,
    quizzes
  })
})


//get only quiz which particular user posted
export const getMyQuiz = catchAsyncError(async(req, res, next) => {
  const {role} = req.user
  if(role === "student"){
    return next(new ErrorHandler("Student not allowed to access this resources!"))
  }
  const myQuiz = await QuizModel.find({createdBy: req.user._id})
  res.status(200).json({
    success: true,
    myQuiz
  })
})


//get single quiz by id
export const getSingleQuiz = catchAsyncError(async(req, res, next) => {
  const {id} = req.params
  try {
    const quiz = await QuizModel.findById(id)
    if(!quiz){
      return next(new ErrorHandler("Quiz not found!", 404))
    }
    res.status(200).json({
      success: true,
      quiz
    })
  } catch (error) {
    return next(new ErrorHandler("Invalid ID / Internal Server Error!", 500))
  }
})

//update quiz
export const updateQuiz = catchAsyncError(async(req, res, next) => {
  const {role} = req.user
  if(role === "student"){
    return next(new ErrorHandler("Student is not allowed to access this resources", 400))
  }
  const {id} = req.params
  let quiz = await QuizModel.findById(id)
  if(!quiz){
    return next(new ErrorHandler("Oops, quiz not found!"))
  }
  quiz = await QuizModel.findByIdAndUpdate(id, req.body, {
    new : true,
    runValidators: true,
    useFindAndModify: false 
  })
  res.status(200).json({
    success: true,
    quiz,
    message: "Quiz updated successfuly!"
  })
})


export const deleteQuiz = catchAsyncError(async(req, res, nect) => {
  const {role} = req.user
  if(role === "student"){
    return next(new ErrorHandler("Student is not allowed to access this resources!"))
  }
  const {id} = req.params
  let quiz = await QuizModel.findById(id)
  if(!quiz){
    return next(new ErrorHandler("Oops, Quiz not found!"))
  }
  await quiz.deleteOne()
  res.status(200).json({
    success: true,
    message: "Quiz deleted successfully!"
  })
})

export const enrollStudent = async (req, res) => {
  const { quizId } = req.body;
  try {
    const quiz = await QuizModel.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }
    quiz.enrolledStudents.push(req.user._id);
    await quiz.save();
    res.status(200).json({ message: "Student Enrolled Successfully", quiz });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getQuizResults = async (req, res) => {
  const { quizId } = req.params;

  try {
    const quiz = await QuizModel.findById(quizId).populate(
      // "enrolledStudents",
      "name email"
    );
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }
    res.status(200).json(quiz);
  } catch (error) {
    console.error(error); // Log the error for debugging purposes
    res.status(500).json({ message: "Internal server error", error });
  }
};

// //teacher can see result of students of the quiz which they created
// export const getStudentQuizResult = catchAsyncError(async(req, res, next) => {
//   const {quizId} = req.params
//   const userId = req.user._id
//   const result = await ResultModel.findOne({quiz: quizId, userId: userId})
//   .populate('quiz')
//   if(!result){
//     return next(new ErrorHandler("Result not found!"), 404)
//   }
//   res.status(200).json({
//     success: true,
//     message: "Result found!",
//     result
//   })
// })

export const submitQuiz = async (req, res) => {
  const [quizId, answers] = req.body;
  try {
    const quiz = await QuizModel.findById(quizId).populate(
      "createdBy",
      "email"
    );
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }
    let score = 0;
    quiz.questions.forEach((question, index) => {
      if (question.correctAnswer === answers[index])
        score += 1;
    });


    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.USER_EMAIL,
            pass: process.env.USER_PASS
        }
    })

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: req.user.email,
        subject: 'Quiz Result',
        text: `You scored ${score} out of ${quiz.questions.length}`
    }
    await transporter.sendMail(mailOptions)
    res.status(200).json({score})
  } 
  catch (error) {
    console.log(error)
    res.status(500).json({message: "Internal Server Error"})
  }
};



