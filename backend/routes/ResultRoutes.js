import express from 'express'
import { isAuthenticated } from '../middleware/authMiddleware.js'
import { getStudentQuizResult } from '../controller/ResultController.js'

const resultRouter = express.Router()

resultRouter.get('/teacher-created-quiz/:quizId', isAuthenticated, getStudentQuizResult)

export default resultRouter