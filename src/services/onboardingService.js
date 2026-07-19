import { LEVELS, levelIndex } from '../constants/levels.js';
import { PLACEMENT_QUESTIONS } from '../data/placementTest.js';

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

/**
 * Scores the placement answers by summing the weights of correctly answered
 * questions, then maps the achieved fraction onto the level scale.
 *
 * @param {Object} answers - map of questionId -> selected option index
 * @returns {{ startingLevel: string, correct: number, total: number, score: number }}
 */
export const scorePlacement = (answers = {}) => {
  const total = PLACEMENT_QUESTIONS.length;
  const maxWeight = PLACEMENT_QUESTIONS.reduce((sum, q) => sum + q.weight, 0);

  let correct = 0;
  let earnedWeight = 0;

  for (const question of PLACEMENT_QUESTIONS) {
    const given = answers[question.id];
    if (given !== undefined && Number(given) === question.answer) {
      correct += 1;
      earnedWeight += question.weight;
    }
  }

  const fraction = maxWeight === 0 ? 0 : earnedWeight / maxWeight;
  const absoluteIndex = clamp(Math.round(fraction * (LEVELS.length - 1)), 0, LEVELS.length - 1);

  return {
    startingIndex: absoluteIndex,
    startingLevel: LEVELS[absoluteIndex],
    correct,
    total,
    score: Math.round(fraction * 100),
  };
};

/**
 * Builds the ordered level path a learner will follow, from their placed
 * starting level up to (and including) their chosen target. Starting level is
 * clamped so it never exceeds the target.
 *
 * @returns {{ levelPath: string[], startingLevel: string }}
 */
export const buildRoadmap = (startingLevel, targetLevel) => {
  const targetIdx = levelIndex(targetLevel);
  const startIdx = clamp(levelIndex(startingLevel), 0, targetIdx);
  const levelPath = LEVELS.slice(startIdx, targetIdx + 1);

  return { levelPath, startingLevel: LEVELS[startIdx] };
};
