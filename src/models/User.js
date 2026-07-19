import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    telegramId: { type: String, required: true, unique: true, index: true },
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    username: { type: String, trim: true },
    photoUrl: { type: String },
    languageCode: { type: String },

    targetLevel: {
      type: String,
      enum: ['C', 'C+', 'B', 'B+', 'A', 'A+'],
      default: null,
    },
    timeframe: { type: String, default: null },
    currentLevel: {
      type: String,
      enum: ['C', 'C+', 'B', 'B+', 'A', 'A+'],
      default: null,
    },
    onboardingCompleted: { type: Boolean, default: false },

    xp: { type: Number, default: 0 },
    streakCount: { type: Number, default: 0 },
    lastActivityDate: { type: Date, default: null },

    hearts: { type: Number, default: 5 },
    maxHearts: { type: Number, default: 5 },
    dailyGoalXp: { type: Number, default: 50 },
    dailyXp: { type: Number, default: 0 },

    roadmap: { type: mongoose.Schema.Types.ObjectId, ref: 'Roadmap', default: null },
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);
