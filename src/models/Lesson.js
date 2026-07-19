import mongoose from 'mongoose';

const lessonSchema = new mongoose.Schema(
  {
    module: { type: mongoose.Schema.Types.ObjectId, ref: 'Module', required: true },
    title: { type: String, required: true },
    order: { type: Number, required: true },
    intro: { type: String },
    explanation: { type: String },
    examples: [{ type: String }],
    commonMistakes: [{ type: String }],
    estimatedMinutes: { type: Number, default: 10 },
  },
  { timestamps: true }
);

export default mongoose.model('Lesson', lessonSchema);
