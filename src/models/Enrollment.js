import mongoose from 'mongoose';

const enrollmentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
    startedAt: { type: Date, default: Date.now },
    currentPosition: { type: Number, default: 0 },
    // IDs are the synthetic node ids (e.g. "<lessonId>") the roadmap emits.
    completedLessonIds: [{ type: String }],
  },
  { timestamps: true }
);

enrollmentSchema.index({ user: 1, course: 1 }, { unique: true });

export default mongoose.model('Enrollment', enrollmentSchema);
