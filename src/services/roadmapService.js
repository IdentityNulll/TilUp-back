import Module from '../models/Module.js';
import Lesson from '../models/Lesson.js';

/**
 * Builds a course's roadmap: its modules (ordered) each with their lesson nodes
 * (ordered) plus a checkpoint node, and node status derived from the learner's
 * completed set. The first not-completed node is "current", the rest "locked".
 */
export const buildCourseRoadmap = async (course, completedIds = []) => {
  const done = new Set(completedIds);
  const modules = await Module.find({ course: course._id }).sort({ order: 1, createdAt: 1 }).lean();
  const moduleIds = modules.map((m) => m._id);
  const lessons = await Lesson.find({ module: { $in: moduleIds } })
    .sort({ order: 1, createdAt: 1 })
    .lean();

  const lessonsByModule = new Map();
  for (const l of lessons) {
    const key = String(l.module);
    if (!lessonsByModule.has(key)) lessonsByModule.set(key, []);
    lessonsByModule.get(key).push(l);
  }

  let currentAssigned = false;
  const assign = (node) => {
    if (done.has(node.id)) node.status = 'completed';
    else if (!currentAssigned) {
      node.status = 'current';
      currentAssigned = true;
    } else node.status = 'locked';
    return node;
  };

  let lessonCount = 0;
  const outModules = modules.map((mod, mi) => {
    const modLessons = lessonsByModule.get(String(mod._id)) || [];
    const nodes = [];

    modLessons.forEach((l) => {
      lessonCount += 1;
      nodes.push(assign({ id: String(l._id), type: 'lesson', title: l.title }));
    });
    // Checkpoint per module (only if the module has lessons).
    if (modLessons.length > 0) {
      nodes.push(assign({ id: `cp-${mod._id}`, type: 'checkpoint', title: 'Nazorat testi' }));
    }

    const completed = nodes.length > 0 && nodes.every((n) => n.status === 'completed');
    const hasCurrent = nodes.some((n) => n.status === 'current');
    return {
      code: String(mod._id),
      title: mod.title,
      order: mi + 1,
      status: completed ? 'completed' : hasCurrent ? 'current' : 'locked',
      nodes,
    };
  });

  const allNodes = outModules.flatMap((m) => m.nodes);
  return {
    course: {
      id: String(course._id),
      title: course.title,
      description: course.description,
      emoji: course.emoji,
      category: course.category,
    },
    modules: outModules,
    totals: {
      modules: outModules.length,
      lessons: lessonCount,
      nodes: allNodes.length,
      completed: allNodes.filter((n) => n.status === 'completed').length,
    },
  };
};
