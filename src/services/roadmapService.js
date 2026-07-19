import { LEVELS, levelIndex, LEVEL_META } from '../constants/levels.js';

const LESSONS_PER_LEVEL = 4;

// Grammar/skill topics (Uzbek) used to label lesson nodes until real lessons
// are authored and seeded. Deterministic by level + index so the roadmap is
// stable across requests.
const TOPIC_POOL = [
  'Zamonlar',
  'Artikllar',
  'Modal feʼllar',
  'Shart gaplar',
  'Predloglar',
  'Gap tuzilishi',
  'Soʻz boyligi',
  'Passiv nisbat',
  'Bogʻlovchilar',
  'Frazaviy feʼllar',
  'Sifat darajalari',
  'Bilvosita nutq',
];

const nodeStatus = (levelStatus, indexInLevel) => {
  if (levelStatus === 'completed') return 'completed';
  if (levelStatus === 'locked') return 'locked';
  // current level: first node is the active one, the rest are locked.
  return indexInLevel === 0 ? 'current' : 'locked';
};

/**
 * Assembles the learner's roadmap view: their ordered level path with lesson +
 * checkpoint nodes, each marked completed / current / locked based on where
 * their currentLevel sits within the path.
 */
export const buildRoadmapView = (user, roadmap) => {
  const levelPath =
    roadmap?.levelPath?.length > 0
      ? roadmap.levelPath
      : LEVELS.slice(0, levelIndex(user.currentLevel || 'C') + 1);

  const currentLevelIdx = Math.max(0, levelPath.indexOf(user.currentLevel || levelPath[0]));

  const levels = levelPath.map((code, i) => {
    const status = i < currentLevelIdx ? 'completed' : i === currentLevelIdx ? 'current' : 'locked';

    const lessons = Array.from({ length: LESSONS_PER_LEVEL }).map((_, j) => ({
      id: `${code}-l${j + 1}`,
      order: j + 1,
      type: 'lesson',
      title: TOPIC_POOL[(i * LESSONS_PER_LEVEL + j) % TOPIC_POOL.length],
      status: nodeStatus(status, j),
    }));

    lessons.push({
      id: `${code}-cp`,
      order: LESSONS_PER_LEVEL + 1,
      type: 'checkpoint',
      title: 'Daraja imtihoni',
      status: status === 'completed' ? 'completed' : 'locked',
    });

    return {
      code,
      title: LEVEL_META[code]?.title || code,
      hint: LEVEL_META[code]?.hint,
      status,
      lessons,
    };
  });

  return {
    levels,
    target: user.targetLevel || levelPath[levelPath.length - 1],
    stats: {
      currentLevel: user.currentLevel || levelPath[0],
      xp: user.xp,
      streak: user.streakCount,
      hearts: user.hearts,
      maxHearts: user.maxHearts,
      dailyXp: user.dailyXp,
      dailyGoalXp: user.dailyGoalXp,
    },
  };
};
