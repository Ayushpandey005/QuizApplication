import mongoose from 'mongoose';

const resultSchema = new mongoose.Schema({
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  score: { type: Number, required: true },
  completed_at: { type: Date, default: Date.now }
});

const ResultModel = mongoose.model('Result', resultSchema);

export default ResultModel;
