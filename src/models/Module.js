import mongoose from 'mongoose';

const moduleSchema = new mongoose.Schema(
  {
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
    title: { type: String, required: true },
    order: { type: Number, default: 0 },
    description: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model('Module', moduleSchema);
