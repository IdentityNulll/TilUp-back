import mongoose from 'mongoose';

const roadmapSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    levelPath: [{ type: String, enum: ['C', 'C+', 'B', 'B+', 'A', 'A+'] }],
    currentPosition: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model('Roadmap', roadmapSchema);
