// TilUp curriculum for the Uzbek national certificate (Ona tili va adabiyot).
// 13 modules, 24 lessons total. The same curriculum is taught in every
// timeframe (1/2/3 oy); only pacing and quiz frequency change (see roadmapService).
export const CURRICULUM = [
  {
    code: 'imlo',
    title: 'Imlo qoidalari',
    lessons: ['Imlo qoidalari'],
  },
  {
    code: 'leksikologiya',
    title: 'Leksikologiya',
    lessons: ['Leksikologiya'],
  },
  {
    code: 'morfemika',
    title: 'Morfemika',
    lessons: ['Morfemika'],
  },
  {
    code: 'ot',
    title: 'Ot soʻz turkumi',
    lessons: ['Ot soʻz turkumi'],
  },
  {
    code: 'sifat',
    title: 'Sifat soʻz turkumi',
    lessons: ['Sifat soʻz turkumi'],
  },
  {
    code: 'olmosh',
    title: 'Olmosh soʻz turkumi',
    lessons: ['Olmosh soʻz turkumi'],
  },
  {
    code: 'fel',
    title: 'Feʼl',
    lessons: ['Feʼl: maʼnosi va yasalishi', 'Feʼl zamonlari', 'Feʼl mayllari'],
  },
  {
    code: 'ravish',
    title: 'Ravish',
    lessons: ['Ravish'],
  },
  {
    code: 'yordamchilar',
    title: 'Yordamchi soʻzlar',
    lessons: ['Yordamchi soʻzlar'],
  },
  {
    code: 'sintaksis',
    title: 'Sintaksis',
    lessons: [
      'Soʻz birikmasi',
      'Gap boʻlaklari',
      'Sodda gap',
      'Qoʻshma gap',
      'Tinish belgilari',
    ],
  },
  {
    code: 'gazal',
    title: 'Gʻazal tahlili',
    lessons: [
      'Gʻazal janri haqida',
      'Navoiy gʻazallari',
      'Bobur gʻazallari',
      'Gʻazal vazni va qofiya',
      'Gʻazal tahlili amaliyoti',
    ],
  },
  {
    code: 'matn',
    title: 'Matn bilan ishlash',
    lessons: ['Matn tahlili', 'Matn mazmunini anglash'],
  },
  {
    code: 'esse',
    title: 'Esse darsi',
    lessons: ['Esse yozish'],
  },
];

export const TOTAL_LESSONS = CURRICULUM.reduce((sum, m) => sum + m.lessons.length, 0); // 24
