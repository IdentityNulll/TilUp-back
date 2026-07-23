import mongoose from 'mongoose';

// The short, admin-editable placement test shown once during onboarding.
const onboardingQuestionSchema = new mongoose.Schema(
  {
    prompt: { type: String, required: true },
    options: [{ type: String, required: true }],
    answer: { type: Number, required: true }, // index into options
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model('OnboardingQuestion', onboardingQuestionSchema);
