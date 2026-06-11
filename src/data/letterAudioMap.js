export const LETTER_AUDIO_FOLDER = 'letters audio/letters';

export const LETTER_AUDIO_MAP = {
  hamzah: 'hamzah.m4a',
  alif: 'alif.m4a',
  ba: 'ba.m4a',
  ta: 'ta.m4a',
  tha: 'tha.m4a',
  jeem: 'jeem.m4a',
  jim: 'jeem.m4a',
  haa: 'haa.m4a',
  kha: 'kha.m4a',
  dal: 'dal.m4a',
  dhal: 'dhal.m4a',
  ra: 'ra.m4a',
  zay: 'zay.m4a',
  seen: 'seen.m4a',
  sheen: 'sheen.m4a',
  saad: 'saad.m4a',
  daad: 'daad.m4a',
  taa: 'taa.m4a',
  zaa: 'zaa.m4a',
  ayn: 'ayn.m4a',
  ghayn: 'ghayn.m4a',
  fa: 'fa.m4a',
  qaf: 'qaf.m4a',
  kaf: 'kaf.m4a',
  laam: 'laam.m4a',
  meem: 'meem.m4a',
  noon: 'noon.m4a',
  waw: 'waw.m4a',
  ha: 'ha.m4a',
  ya: 'ya.m4a',
};

export const ARABIC_LETTER_AUDIO_MAP = {
  'ء': 'hamzah.m4a',
  'أ': 'hamzah.m4a',
  'إ': 'hamzah.m4a',
  'ا': 'alif.m4a',
  'ب': 'ba.m4a',
  'ت': 'ta.m4a',
  'ث': 'tha.m4a',
  'ج': 'jeem.m4a',
  'ح': 'haa.m4a',
  'خ': 'kha.m4a',
  'د': 'dal.m4a',
  'ذ': 'dhal.m4a',
  'ر': 'ra.m4a',
  'ز': 'zay.m4a',
  'س': 'seen.m4a',
  'ش': 'sheen.m4a',
  'ص': 'saad.m4a',
  'ض': 'daad.m4a',
  'ط': 'taa.m4a',
  'ظ': 'zaa.m4a',
  'ع': 'ayn.m4a',
  'غ': 'ghayn.m4a',
  'ف': 'fa.m4a',
  'ق': 'qaf.m4a',
  'ك': 'kaf.m4a',
  'ل': 'laam.m4a',
  'م': 'meem.m4a',
  'ن': 'noon.m4a',
  'و': 'waw.m4a',
  'ه': 'ha.m4a',
  'ي': 'ya.m4a',
};

const LETTER_NAME_ALIASES = {
  hamza: 'hamzah',
  hamzah: 'hamzah',
  alif: 'alif',
  alef: 'alif',
  ba: 'ba',
  baa: 'ba',
  ta: 'ta',
  taa: 'ta',
  tha: 'tha',
  thaa: 'tha',
  jim: 'jeem',
  jeem: 'jeem',
  ha: 'ha',
  haa: 'haa',
  kha: 'kha',
  khaa: 'kha',
  dal: 'dal',
  dhal: 'dhal',
  thal: 'dhal',
  ra: 'ra',
  raa: 'ra',
  zay: 'zay',
  zai: 'zay',
  seen: 'seen',
  sin: 'seen',
  sheen: 'sheen',
  shin: 'sheen',
  saad: 'saad',
  sad: 'saad',
  daad: 'daad',
  dad: 'daad',
  tah: 'taa',
  taheavy: 'taa',
  dha: 'zaa',
  zha: 'zaa',
  za: 'zaa',
  zaa: 'zaa',
  ayn: 'ayn',
  ain: 'ayn',
  ghayn: 'ghayn',
  ghain: 'ghayn',
  fa: 'fa',
  faa: 'fa',
  qaf: 'qaf',
  qaaf: 'qaf',
  kaf: 'kaf',
  kaaf: 'kaf',
  lam: 'laam',
  laam: 'laam',
  mim: 'meem',
  meem: 'meem',
  nun: 'noon',
  noon: 'noon',
  waw: 'waw',
  waaw: 'waw',
  ya: 'ya',
  yaa: 'ya',
};

const DIACRITIC_REGEX = /[\u064B-\u065F\u0670\u06D6-\u06ED]/g;

export function normalizeLetterAudioKey(value = '') {
  return String(value)
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[ʿʻ‘’'`ʼ]/g, '')
    .replace(/[āâ]/gi, 'a')
    .replace(/[īî]/gi, 'i')
    .replace(/[ūû]/gi, 'u')
    .replace(/[ḥ]/gi, 'h')
    .replace(/[ḍ]/gi, 'd')
    .replace(/[ṣ]/gi, 's')
    .replace(/[ṭ]/gi, 't')
    .replace(/[ẓ]/gi, 'z')
    .replace(DIACRITIC_REGEX, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

export function getLetterAudioFilename(letter) {
  if (!letter) return null;

  if (typeof letter === 'string') {
    const directArabic = ARABIC_LETTER_AUDIO_MAP[letter.replace(DIACRITIC_REGEX, '')];
    if (directArabic) return directArabic;

    const key = LETTER_NAME_ALIASES[normalizeLetterAudioKey(letter)] || normalizeLetterAudioKey(letter);
    return LETTER_AUDIO_MAP[key] || null;
  }

  const arabic = String(letter.arabic || letter.letter || '').replace(DIACRITIC_REGEX, '');
  if (ARABIC_LETTER_AUDIO_MAP[arabic]) return ARABIC_LETTER_AUDIO_MAP[arabic];

  const key = LETTER_NAME_ALIASES[normalizeLetterAudioKey(letter.name || letter.transliteration || letter.id || '')];
  return key ? LETTER_AUDIO_MAP[key] : null;
}

export default LETTER_AUDIO_MAP;
