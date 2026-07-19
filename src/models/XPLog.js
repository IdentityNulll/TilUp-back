import mongoose from 'mongoose';

const xpLogSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    source: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model('XPLog', xpLogSchema);
