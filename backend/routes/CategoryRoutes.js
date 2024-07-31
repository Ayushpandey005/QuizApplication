import express from 'express'
import { createCategory } from '../controller/CategoryController.js'
import {isAuthenticated} from '../middleware/authMiddleware.js'

const categoryRouter = express.Router()

categoryRouter.post('/create-category', isAuthenticated ,createCategory)

export default categoryRouter