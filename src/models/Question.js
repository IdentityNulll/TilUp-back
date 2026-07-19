import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema(
  {
    lesson: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson', required: true },
    type: {
      type: String,
      enum: ['multiple_choice', 'fill_blank', 'matching', 'ordering', 'true_false', 'open_answer'],
      required: true,
    },
    prompt: { type: String, required: true },
    options: [{ type: mongoose.Schema.Types.Mixed }],
    correctAnswer: { type: mongoose.Schema.Types.Mixed },
    explanation: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model('Question', questionSchema);
