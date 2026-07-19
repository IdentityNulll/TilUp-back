import User from '../models/User.js';
import Roadmap from '../models/Roadmap.js';
import { isValidLevel } from '../constants/levels.js';
import { publicPlacementQuestions } from '../data/placementTest.js';
import { scorePlacement, buildRoadmap } from '../services/onboardingService.js';

const TIMEFRAMES = ['1_oy', '3_oy', '6_oy', '12_oy'];

export const getPlacementTest = async (req, res) => {
  res.status(200).json({ questions: publicPlacementQuestions() });
};

export const completeOnboarding = async (req, res) => {
  const { targetLevel, timeframe, placementAnswers } = req.body;

  if (!isValidLevel(targetLevel)) {
    res.status(400);
    throw new Error("Maqsadli daraja noto'g'ri");
  }
  if (!TIMEFRAMES.includes(timeframe)) {
    res.status(400);
    throw new Error("Tayyorgarlik muddati noto'g'ri");
  }

  const placement = scorePlacement(placementAnswers || {});
  const { levelPath, startingLevel } = buildRoadmap(placement.startingLevel, targetLevel);

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
      currentLevel: startingLevel,
      onboardingCompleted: true,
      roadmap: roadmap._id,
    },
    { new: true }
  );

  res.status(200).json({
    user,
    roadmap,
    placement: {
      startingLevel,
      correct: placement.correct,
      total: placement.total,
      score: placement.score,
    },
  });
};
