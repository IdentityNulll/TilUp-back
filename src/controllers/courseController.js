import Course from '../models/Course.js';
import Module from '../models/Module.js';
import Lesson from '../models/Lesson.js';
import Enrollment from '../models/Enrollment.js';
import { buildCourseRoadmap } from '../services/roadmapService.js';

const notFound = (res, msg = 'Kurs topilmadi') => {
  res.status(404);
  throw new Error(msg);
};

// GET /api/courses — published courses with the user's enrollment flag + counts.
export const listCourses = async (req, res) => {
  const courses = await Course.find({ isPublished: true }).sort({ order: 1, createdAt: 1 }).lean();
  const enrollments = await Enrollment.find({ user: req.user._id }).lean();
  const enrolledIds = new Set(enrollments.map((e) => String(e.course)));

  const lessonCounts = await Lesson.aggregate([
    { $group: { _id: '$course', count: { $sum: 1 } } },
  ]);
  const countByCourse = new Map(lessonCounts.map((c) => [String(c._id), c.count]));

  res.json({
    courses: courses.map((c) => ({
      ...c,
      id: String(c._id),
      lessonCount: countByCourse.get(String(c._id)) || 0,
      enrolled: enrolledIds.has(String(c._id)),
    })),
  });
};

// GET /api/courses/:id — course with its modules + lessons.
export const getCourse = async (req, res) => {
  const course = await Course.findById(req.params.id).lean();
  if (!course) return notFound(res);
  const modules = await Module.find({ course: course._id }).sort({ order: 1 }).lean();
  const lessons = await Lesson.find({ course: course._id }).sort({ order: 1 }).lean();
  res.json({ course: { ...course, id: String(course._id) }, modules, lessons });
};

// GET /api/courses/:id/roadmap — auto-enrolls (marks "started") and returns the
// roadmap with the learner's progress + their global stats.
export const getCourseRoadmap = async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) return notFound(res);

  const enrollment = await Enrollment.findOneAndUpdate(
    { user: req.user._id, course: course._id },
    { $setOnInsert: { startedAt: new Date() } },
    { new: true, upsert: true }
  );

  const roadmap = await buildCourseRoadmap(course, enrollment.completedLessonIds);
  res.json({
    ...roadmap,
    stats: {
      xp: req.user.xp,
      streak: req.user.streakCount,
      hearts: req.user.hearts,
      maxHearts: req.user.maxHearts,
      dailyXp: req.user.dailyXp,
      dailyGoalXp: req.user.dailyGoalXp,
    },
  });
};

// POST /api/courses/:id/enroll
export const enroll = async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) return notFound(res);
  const enrollment = await Enrollment.findOneAndUpdate(
    { user: req.user._id, course: course._id },
    { $setOnInsert: { startedAt: new Date() } },
    { new: true, upsert: true }
  );
  res.status(201).json({ enrollment });
};

// POST /api/courses/:id/nodes/:nodeId/complete — persist progress.
export const completeNode = async (req, res) => {
  const enrollment = await Enrollment.findOneAndUpdate(
    { user: req.user._id, course: req.params.id },
    { $addToSet: { completedLessonIds: req.params.nodeId }, $setOnInsert: { startedAt: new Date() } },
    { new: true, upsert: true }
  );
  res.json({ enrollment });
};

// GET /api/me/enrollments — the user's courses + progress %.
export const myEnrollments = async (req, res) => {
  const enrollments = await Enrollment.find({ user: req.user._id }).populate('course').lean();
  const result = [];
  for (const e of enrollments) {
    if (!e.course) continue;
    const roadmap = await buildCourseRoadmap(e.course, e.completedLessonIds);
    result.push({
      course: { id: String(e.course._id), title: e.course.title, emoji: e.course.emoji },
      completed: roadmap.totals.completed,
      total: roadmap.totals.nodes,
      startedAt: e.startedAt,
    });
  }
  res.json({ enrollments: result });
};
