// Static placement-test question bank. Questions are ordered from easiest to
// hardest; `weight` reflects difficulty so stronger answers push the learner
// toward a higher starting level. `answer` is the index into `options`.
// The correct answers are never sent to the client — only id/prompt/options.
export const PLACEMENT_QUESTIONS = [
  {
    id: 'q1',
    prompt: 'She ___ a teacher.',
    options: ['is', 'are', 'am', 'be'],
    answer: 0,
    weight: 1,
  },
  {
    id: 'q2',
    prompt: 'They ___ to school every day.',
    options: ['goes', 'go', 'going', 'gone'],
    answer: 1,
    weight: 1,
  },
  {
    id: 'q3',
    prompt: 'I have lived here ___ 2015.',
    options: ['for', 'since', 'from', 'at'],
    answer: 1,
    weight: 2,
  },
  {
    id: 'q4',
    prompt: 'If it rains, we ___ at home.',
    options: ['stay', 'will stay', 'stayed', 'would stay'],
    answer: 1,
    weight: 2,
  },
  {
    id: 'q5',
    prompt: 'The report ___ by the manager yesterday.',
    options: ['was written', 'wrote', 'is writing', 'has written'],
    answer: 0,
    weight: 3,
  },
  {
    id: 'q6',
    prompt: 'He asked me where I ___ the previous night.',
    options: ['have been', 'had been', 'was being', 'am'],
    answer: 1,
    weight: 3,
  },
  {
    id: 'q7',
    prompt: 'Choose the closest meaning: "meticulous".',
    options: ['careless', 'very careful', 'quick', 'lazy'],
    answer: 1,
    weight: 4,
  },
  {
    id: 'q8',
    prompt: 'Hardly ___ the meeting started when the fire alarm rang.',
    options: ['have', 'had', 'has', 'did'],
    answer: 1,
    weight: 4,
  },
  {
    id: 'q9',
    prompt: 'Her argument was so ___ that no one could refute it.',
    options: ['cogent', 'vague', 'trivial', 'feeble'],
    answer: 0,
    weight: 5,
  },
  {
    id: 'q10',
    prompt: 'Choose the sentence with correct advanced usage.',
    options: [
      'Were it not for your help, I would have failed.',
      'If it not for your help, I will fail.',
      'Unless your help, I had failed.',
      'Had not your help, I fail.',
    ],
    answer: 0,
    weight: 5,
  },
];

// Client-facing version without the correct answers.
export const publicPlacementQuestions = () =>
  PLACEMENT_QUESTIONS.map(({ id, prompt, options }) => ({ id, prompt, options }));
