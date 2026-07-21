import User from '../models/User.js';
import Roadmap from '../models/Roadmap.js';
import { LEVELS, isValidLevel, levelIndex } from '../constants/levels.js';

const TIMEFRAMES = ['1_oy', '2_oy', '3_oy'];

export const completeOnboarding = async (req, res) => {
  const { targetLevel, timeframe } = req.body;

  if (!isValidLevel(targetLevel)) {
    res.status(400);
    throw new Error("Maqsadli daraja notoʻgʻri");
  }
  if (!TIMEFRAMES.includes(timeframe)) {
    res.status(400);
    throw new Error("Tayyorgarlik muddati notoʻgʻri");
  }

  // Grades from the lowest up to the chosen target — kept for record/badges.
  const levelPath = LEVELS.slice(0, levelIndex(targetLevel) + 1);

  const roadmap = await Roadmap.findOneAndUpdate(
    { user: req.user._id },
    { user: req.user._id, levelPath, currentPosition: 0 },
    { new: true, upsert: true }
  );

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      targetLevel,
      timeframe,
      currentLevel: targetLevel,
      onboardingCompleted: true,
      roadmap: roadmap._id,
    },
    { new: true }
  );

  res.status(200).json({ user, roadmap });
};
