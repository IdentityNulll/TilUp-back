import mongoose from 'mongoose';

const levelSchema = new mongoose.Schema(
  {
    code: { type: String, enum: ['C', 'C+', 'B', 'B+', 'A', 'A+'], required: true, unique: true },
    order: { type: Number, required: true },
    title: { type: String, required: true },
    description: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model('Level', levelSchema);
