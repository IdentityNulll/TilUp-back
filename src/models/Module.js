import mongoose from 'mongoose';

const moduleSchema = new mongoose.Schema(
  {
    level: { type: mongoose.Schema.Types.ObjectId, ref: 'Level', required: true },
    title: { type: String, required: true },
    order: { type: Number, required: true },
    description: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model('Module', moduleSchema);
