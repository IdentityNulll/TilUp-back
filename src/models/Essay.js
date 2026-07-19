import mongoose from 'mongoose';

const essaySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    prompt: { type: String, required: true },
    content: { type: String, required: true },
    status: { type: String, enum: ['pending', 'graded'], default: 'pending' },
    score: { type: Number, default: null },
    feedback: { type: String, default: null },
    aiGraded: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model('Essay', essaySchema);
