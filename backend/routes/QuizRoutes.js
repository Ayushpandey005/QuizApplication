import express from 'express'
import { createQuiz, getQuizzes, enrollStudent, getQuizResults, submitQuiz, updateQuiz, deleteQuiz, getMyQuiz, getSingleQuiz } from '../controller/QuizController.js'
import { isAuthenticated } from '../middleware/authMiddleware.js'
// import {protect} from '../middleware/authMiddleware.js'

const quizRouter = express.Router()

quizRouter.post('/create-quiz', isAuthenticated ,createQuiz)
quizRouter.get('/all-quiz', getQuizzes),
quizRouter.get('/my-quiz', isAuthenticated, getMyQuiz),
quizRouter.get("/:id", isAuthenticated, getSingleQuiz),
quizRouter.put('/update-quiz/:id', isAuthenticated, updateQuiz),
quizRouter.delete("/delete-quiz/:id", isAuthenticated, deleteQuiz)
quizRouter.post('/enroll-student', enrollStudent)
quizRouter.get('/get-quiz-result/:quizId', getQuizResults)
quizRouter.post('/submit-quiz', submitQuiz)

export default quizRouter