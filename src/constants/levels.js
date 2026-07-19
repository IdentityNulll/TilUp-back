// Certificate levels ordered from the lowest starting point to the highest goal.
export const LEVELS = ['C', 'C+', 'B', 'B+', 'A', 'A+'];

export const levelIndex = (code) => LEVELS.indexOf(code);

export const isValidLevel = (code) => LEVELS.includes(code);

// Human-readable descriptions (Uzbek) used across roadmap/onboarding.
export const LEVEL_META = {
  C: { title: 'C daraja', hint: 'Boshlang‘ich poydevor' },
  'C+': { title: 'C+ daraja', hint: 'Ishonchli asos' },
  B: { title: 'B daraja', hint: 'O‘rta bosqich' },
  'B+': { title: 'B+ daraja', hint: 'Kuchli o‘rta' },
  A: { title: 'A daraja', hint: 'Ilg‘or bosqich' },
  'A+': { title: 'A+ daraja', hint: 'Eng yuqori cho‘qqi' },
};
