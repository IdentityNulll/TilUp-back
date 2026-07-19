import mongoose from 'mongoose';

const streakSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    currentStreak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    lastActiveDate: { type: Date, default: null },
    history: [{ date: Date, active: Boolean }],
  },
  { timestamps: true }
);

export default mongoose.model('Streak', streakSchema);
