import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, sparse: true, lowercase: true, trim: true },
    description: { type: String, default: '' },
    category: { type: String, default: 'Umumiy' },
    emoji: { type: String, default: '📘' },
    accent: { type: String, default: '#15603a' },
    order: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { timestamps: true }
);

export default mongoose.model('Course', courseSchema);
