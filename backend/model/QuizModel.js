import mongoose from "mongoose"

const questionSchema = new mongoose.Schema({
    question: {type: String, required: true},
    options: {type: [String], required: true},
    correctAnswer : {type: String, required: true}
})

const quizSchema = new mongoose.Schema({
    title: {type: String, required: true},
    category: {type: String, required: true},
    questions : [questionSchema],
    scheduleDate : {type: Date},
    createdBy : {type:mongoose.Schema.Types.ObjectId, ref: "User"},
    enrolledStudents : [{type: mongoose.Schema.Types.ObjectId, ref: "User"}]
})

const QuizModel = mongoose.model('Quiz', quizSchema)

export default QuizModel    