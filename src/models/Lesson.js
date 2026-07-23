import mongoose from 'mongoose';

const lessonSchema = new mongoose.Schema(
  {
    module: { type: mongoose.Schema.Types.ObjectId, ref: 'Module', required: true, index: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
    title: { type: String, required: true },
    order: { type: Number, default: 0 },
    content: { type: String, default: '' },
    estimatedMinutes: { type: Number, default: 10 },
  },
  { timestamps: true }
);

export default mongoose.model('Lesson', lessonSchema);
