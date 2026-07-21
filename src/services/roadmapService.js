import { CURRICULUM } from '../data/curriculum.js';

// How often extra practice quizzes are inserted between lessons, by timeframe.
// Module checkpoint quizzes are ALWAYS added at the end of each module; these
// rules only add EXTRA in-module quizzes so longer plans get more frequent
// testing (the 3-month plan quizzes after nearly every lesson).
const quizAfterLesson = (lessonIdx, lessonCount, timeframe) => {
  if (lessonIdx === lessonCount - 1) return false; // last lesson → module checkpoint covers it
  switch (timeframe) {
    case '3_oy':
      return true; // after every lesson — most frequent
    case '2_oy':
      return lessonIdx % 2 === 1; // after every 2nd lesson
    case '1_oy':
    default:
      return false; // checkpoints only — fewest
  }
};

/**
 * Builds the learner's roadmap from the fixed Uzbek curriculum. The same 13
 * modules / 24 lessons are taught in every timeframe; only the number of quiz
 * nodes changes. Node status (completed/current/locked) is derived from how
 * many nodes the learner has finished — a fresh user has the first node current
 * and the rest locked.
 */
export const buildRoadmapView = (user, roadmap, completedNodeIds = new Set()) => {
  const timeframe = user.timeframe || '2_oy';

  let currentAssigned = false;
  const assignStatus = (node) => {
    if (completedNodeIds.has(node.id)) {
      node.status = 'completed';
    } else if (!currentAssigned) {
      node.status = 'current';
      currentAssigned = true;
    } else {
      node.status = 'locked';
    }
    return node;
  };

  let quizCount = 0;
  let lessonCount = 0;

  const modules = CURRICULUM.map((mod, mi) => {
    const nodes = [];

    mod.lessons.forEach((title, li) => {
      lessonCount += 1;
      nodes.push(
        assignStatus({ id: `${mod.code}-l${li + 1}`, type: 'lesson', title })
      );

      if (quizAfterLesson(li, mod.lessons.length, timeframe)) {
        quizCount += 1;
        nodes.push(
          assignStatus({ id: `${mod.code}-q${li + 1}`, type: 'quiz', title: 'Mashq testi' })
        );
      }
    });

    // Module checkpoint exam — always present.
    quizCount += 1;
    nodes.push(assignStatus({ id: `${mod.code}-cp`, type: 'checkpoint', title: 'Nazorat testi' }));

    const completed = nodes.every((n) => n.status === 'completed');
    const hasCurrent = nodes.some((n) => n.status === 'current');

    return {
      code: mod.code,
      title: mod.title,
      order: mi + 1,
      status: completed ? 'completed' : hasCurrent ? 'current' : 'locked',
      nodes,
    };
  });

  return {
    modules,
    target: user.targetLevel || 'A+',
    timeframe,
    totals: { modules: modules.length, lessons: lessonCount, quizzes: quizCount },
    stats: {
      currentLevel: user.currentLevel || user.targetLevel || 'C',
      xp: user.xp,
      streak: user.streakCount,
      hearts: user.hearts,
      maxHearts: user.maxHearts,
      dailyXp: user.dailyXp,
      dailyGoalXp: user.dailyGoalXp,
    },
  };
};
