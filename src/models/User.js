import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    // Identity — email/password and/or Google.
    // email/googleId are unique + sparse — do NOT default them, so accounts
    // that lack one leave the field absent (a sparse index skips missing
    // fields but still indexes explicit nulls, which would collide).
    email: { type: String, unique: true, sparse: true, lowercase: true, trim: true },
    passwordHash: { type: String, select: false },
    googleId: { type: String, unique: true, sparse: true },
    authProvider: { type: String, enum: ['local', 'google', 'both'], default: 'local' },

    name: { type: String, trim: true },
    avatarUrl: { type: String, default: null },

    // Learning profile.
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

    // Gamification.
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

// Never leak the password hash in JSON responses.
userSchema.set('toJSON', {
  transform: (_doc, ret) => {
    delete ret.passwordHash;
    return ret;
  },
});

export default mongoose.model('User', userSchema);
