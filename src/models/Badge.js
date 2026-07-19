import mongoose from 'mongoose';

const badgeSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String },
    icon: { type: String },
    criteria: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true }
);

export default mongoose.model('Badge', badgeSchema);
