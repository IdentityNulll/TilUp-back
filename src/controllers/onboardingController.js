import User from '../models/User.js';
import OnboardingQuestion from '../models/OnboardingQuestion.js';

// GET /api/onboarding/test — the short placement test (answers stripped).
export const getOnboardingTest = async (req, res) => {
  const questions = await OnboardingQuestion.find().sort({ order: 1, createdAt: 1 }).lean();
  res.json({
    questions: questions.map((q) => ({ id: String(q._id), prompt: q.prompt, options: q.options })),
  });
};

// POST /api/onboarding/complete — { answers?: {id:index}, skipped?: bool }
// Scores the answers (if not skipped) and marks onboarding done.
export const completeOnboarding = async (req, res) => {
  const { answers, skipped } = req.body;

  let score = null;
  if (!skipped && answers && typeof answers === 'object') {
    const questions = await OnboardingQuestion.find().lean();
    let correct = 0;
    for (const q of questions) {
      if (Number(answers[String(q._id)]) === q.answer) correct += 1;
    }
    score = questions.length ? Math.round((correct / questions.length) * 100) : 0;
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { onboardingCompleted: true, placementScore: score, placementSkipped: Boolean(skipped) },
    { new: true }
  );

  res.json({ user, score, skipped: Boolean(skipped) });
};
