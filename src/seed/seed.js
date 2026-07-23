import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import Course from '../models/Course.js';
import Module from '../models/Module.js';
import Lesson from '../models/Lesson.js';
import OnboardingQuestion from '../models/OnboardingQuestion.js';

const CURRICULUM = [
  { title: 'Imlo qoidalari', lessons: ['Imlo qoidalari'] },
  { title: 'Leksikologiya', lessons: ['Leksikologiya'] },
  { title: 'Morfemika', lessons: ['Morfemika'] },
  { title: 'Ot soʻz turkumi', lessons: ['Ot soʻz turkumi'] },
  { title: 'Sifat soʻz turkumi', lessons: ['Sifat soʻz turkumi'] },
  { title: 'Olmosh soʻz turkumi', lessons: ['Olmosh soʻz turkumi'] },
  { title: 'Feʼl', lessons: ['Feʼl: maʼnosi va yasalishi', 'Feʼl zamonlari', 'Feʼl mayllari'] },
  { title: 'Ravish', lessons: ['Ravish'] },
  { title: 'Yordamchi soʻzlar', lessons: ['Yordamchi soʻzlar'] },
  {
    title: 'Sintaksis',
    lessons: ['Soʻz birikmasi', 'Gap boʻlaklari', 'Sodda gap', 'Qoʻshma gap', 'Tinish belgilari'],
  },
  {
    title: 'Gʻazal tahlili',
    lessons: [
      'Gʻazal janri haqida',
      'Navoiy gʻazallari',
      'Bobur gʻazallari',
      'Gʻazal vazni va qofiya',
      'Gʻazal tahlili amaliyoti',
    ],
  },
  { title: 'Matn bilan ishlash', lessons: ['Matn tahlili', 'Matn mazmunini anglash'] },
  { title: 'Esse darsi', lessons: ['Esse yozish'] },
];

const ONBOARDING_QUESTIONS = [
  { prompt: '"Kitob" soʻzi qaysi soʻz turkumiga kiradi?', options: ['Ot', 'Sifat', 'Feʼl', 'Ravish'], answer: 0 },
  { prompt: '"Men" soʻzi qaysi soʻz turkumiga kiradi?', options: ['Olmosh', 'Ot', 'Feʼl', 'Sifat'], answer: 0 },
  { prompt: '"Tez" soʻzi qaysi soʻz turkumiga kiradi?', options: ['Ravish', 'Ot', 'Sifat', 'Olmosh'], answer: 0 },
  { prompt: 'Darak gap oxirida qanday tinish belgisi qoʻyiladi?', options: ['Nuqta', 'Vergul', 'Ikki nuqta', 'Tire'], answer: 0 },
  { prompt: 'Qaysi soʻz toʻgʻri yozilgan?', options: ['maktab', 'makatab', 'maktub', 'magtab'], answer: 0 },
];

const seedCourse = async () => {
  const slug = 'ona-tili-va-adabiyot';
  let course = await Course.findOne({ slug });
  if (course) {
    console.log('Course already exists:', course.title);
    return;
  }
  course = await Course.create({
    title: 'Ona tili va adabiyot',
    slug,
    description: 'Oʻzbek milliy sertifikatiga tayyorgarlik: imlo, grammatika, sintaksis, gʻazal tahlili va esse.',
    category: 'Milliy sertifikat',
    emoji: '📗',
    order: 0,
  });

  for (let mi = 0; mi < CURRICULUM.length; mi += 1) {
    const m = CURRICULUM[mi];
    const mod = await Module.create({ course: course._id, title: m.title, order: mi });
    await Lesson.insertMany(
      m.lessons.map((title, li) => ({ course: course._id, module: mod._id, title, order: li }))
    );
  }
  const lessons = await Lesson.countDocuments({ course: course._id });
  console.log(`Seeded course "${course.title}" — ${CURRICULUM.length} modules, ${lessons} lessons`);
};

const seedOnboarding = async () => {
  const count = await OnboardingQuestion.countDocuments();
  if (count > 0) {
    console.log(`Onboarding questions already exist (${count})`);
    return;
  }
  await OnboardingQuestion.insertMany(ONBOARDING_QUESTIONS.map((q, i) => ({ ...q, order: i })));
  console.log(`Seeded ${ONBOARDING_QUESTIONS.length} onboarding questions`);
};

const run = async () => {
  await connectDB();
  await seedCourse();
  await seedOnboarding();
  await mongoose.disconnect();
  console.log('Seed complete.');
};

run().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
