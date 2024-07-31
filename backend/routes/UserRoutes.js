import express from 'express'
import { RegisterUser, getUser, loginUser, logoutUser } from '../controller/UserController.js'
import { isAuthenticated } from '../middleware/authMiddleware.js'
const router = express.Router()

router.post('/register', RegisterUser)
router.post('/login', loginUser)
router.get('/get-user', isAuthenticated, getUser)
router.get('/logout', isAuthenticated, logoutUser)

export default router