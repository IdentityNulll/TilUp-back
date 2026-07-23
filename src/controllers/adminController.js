import Course from '../models/Course.js';
import Module from '../models/Module.js';
import Lesson from '../models/Lesson.js';
import Enrollment from '../models/Enrollment.js';
import User from '../models/User.js';
import OnboardingQuestion from '../models/OnboardingQuestion.js';
import { buildCourseRoadmap } from '../services/roadmapService.js';

const slugify = (s) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9Ѐ-ӿ]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);

// ---- Overview / progress (admin + teacher) ------------------------------
export const overview = async (req, res) => {
  const [courses, students, enrollments] = await Promise.all([
    Course.countDocuments(),
    User.countDocuments({ role: 'student' }),
    Enrollment.countDocuments(),
  ]);
  res.json({ courses, students, enrollments });
};

export const listEnrollments = async (req, res) => {
  const enrollments = await Enrollment.find()
    .populate('user', 'name email avatarUrl role')
    .populate('course', 'title emoji')
    .sort({ createdAt: -1 })
    .lean();

  const rows = [];
  for (const e of enrollments) {
    if (!e.course || !e.user) continue;
    const roadmap = await buildCourseRoadmap(e.course, e.completedLessonIds);
    rows.push({
      id: String(e._id),
      student: { name: e.user.name, email: e.user.email, avatarUrl: e.user.avatarUrl },
      course: { id: String(e.course._id), title: e.course.title, emoji: e.course.emoji },
      completed: roadmap.totals.completed,
      total: roadmap.totals.nodes,
      percent: roadmap.totals.nodes
        ? Math.round((roadmap.totals.completed / roadmap.totals.nodes) * 100)
        : 0,
      startedAt: e.startedAt,
    });
  }
  res.json({ enrollments: rows });
};

// ---- Users / roles (admin only) -----------------------------------------
export const listUsers = async (req, res) => {
  const users = await User.find().select('name email role avatarUrl createdAt').sort({ createdAt: -1 }).lean();
  res.json({ users });
};

export const updateUserRole = async (req, res) => {
  const { role } = req.body;
  if (!['student', 'teacher', 'admin'].includes(role)) {
    res.status(400);
    throw new Error("Rol noto'g'ri");
  }
  const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
  if (!user) {
    res.status(404);
    throw new Error('Foydalanuvchi topilmadi');
  }
  res.json({ user });
};

// ---- Courses (admin only) -----------------------------------------------
export const listAllCourses = async (req, res) => {
  const courses = await Course.find().sort({ order: 1, createdAt: 1 }).lean();
  const counts = await Lesson.aggregate([{ $group: { _id: '$course', c: { $sum: 1 } } }]);
  const byId = new Map(counts.map((x) => [String(x._id), x.c]));
  res.json({
    courses: courses.map((c) => ({ ...c, id: String(c._id), lessonCount: byId.get(String(c._id)) || 0 })),
  });
};

export const createCourse = async (req, res) => {
  const { title, description, category, emoji, accent, isPublished } = req.body;
  if (!title) {
    res.status(400);
    throw new Error('Kurs nomi talab qilinadi');
  }
  const course = await Course.create({
    title,
    slug: slugify(title),
    description,
    category,
    emoji,
    accent,
    isPublished: isPublished !== false,
    createdBy: req.user._id,
  });
  res.status(201).json({ course });
};

export const updateCourse = async (req, res) => {
  const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!course) {
    res.status(404);
    throw new Error('Kurs topilmadi');
  }
  res.json({ course });
};

export const deleteCourse = async (req, res) => {
  await Lesson.deleteMany({ course: req.params.id });
  await Module.deleteMany({ course: req.params.id });
  await Enrollment.deleteMany({ course: req.params.id });
  await Course.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
};

// ---- Modules (admin only) -----------------------------------------------
export const createModule = async (req, res) => {
  const { course, title, order, description } = req.body;
  const mod = await Module.create({ course, title, order, description });
  res.status(201).json({ module: mod });
};

export const updateModule = async (req, res) => {
  const mod = await Module.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json({ module: mod });
};

export const deleteModule = async (req, res) => {
  await Lesson.deleteMany({ module: req.params.id });
  await Module.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
};

// ---- Lessons (admin only) -----------------------------------------------
export const createLesson = async (req, res) => {
  const { module: moduleId, title, order, content, estimatedMinutes } = req.body;
  const mod = await Module.findById(moduleId);
  if (!mod) {
    res.status(400);
    throw new Error('Modul topilmadi');
  }
  const lesson = await Lesson.create({
    module: moduleId,
    course: mod.course,
    title,
    order,
    content,
    estimatedMinutes,
  });
  res.status(201).json({ lesson });
};

export const updateLesson = async (req, res) => {
  const lesson = await Lesson.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json({ lesson });
};

export const deleteLesson = async (req, res) => {
  await Lesson.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
};

// ---- Onboarding test questions (admin only) -----------------------------
export const listOnboardingQuestions = async (req, res) => {
  const questions = await OnboardingQuestion.find().sort({ order: 1, createdAt: 1 }).lean();
  res.json({ questions });
};

export const createOnboardingQuestion = async (req, res) => {
  const q = await OnboardingQuestion.create(req.body);
  res.status(201).json({ question: q });
};

export const updateOnboardingQuestion = async (req, res) => {
  const q = await OnboardingQuestion.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json({ question: q });
};

export const deleteOnboardingQuestion = async (req, res) => {
  await OnboardingQuestion.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
};
