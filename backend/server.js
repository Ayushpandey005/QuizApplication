import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import {connectDb} from './model/Connectiondb.js'
import dotenv from 'dotenv'
import router from './routes/UserRoutes.js'
import quizRouter from './routes/QuizRoutes.js'
import { errorMiddleware } from './middleware/error.js'
import categoryRouter from './routes/CategoryRoutes.js'
import resultRouter from './routes/ResultRoutes.js'
dotenv.config()

const app = express()
app.use(express.json())

app.use(cors({
    origin: [process.env.FRONTEND_URL],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}))

app.use(cookieParser())
app.use(express.urlencoded({extended: true}))

app.use('/api/v1/user', router)
app.use('/api/v1/quiz', quizRouter)
app.use('/api/v1/category', categoryRouter)
app.use('/api/v1/result', resultRouter)


connectDb()

app.use(errorMiddleware)

const Port = process.env.PORT

app.listen(Port, ()=> {
    console.log(`server running at port ${Port}...`)
})

