export const LETTER_AUDIO_FOLDER = 'letters/audio';

export const LETTER_AUDIO_MAP = {
  hamzah: 'hamzah.mp3',
  alif: 'alif.mp3',
  ba: 'ba.mp3',
  ta: 'ta.mp3',
  tha: 'tha.mp3',
  jeem: 'jeem.mp3',
  jim: 'jeem.mp3',
  haa: 'haa.mp3',
  kha: 'kha.mp3',
  dal: 'dal.mp3',
  dhal: 'dhal.mp3',
  ra: 'ra.mp3',
  zay: 'zay.mp3',
  seen: 'seen.mp3',
  sheen: 'sheen.mp3',
  saad: 'saad.mp3',
  daad: 'daad.mp3',
  taa: 'taa.mp3',
  zaa: 'zaa.mp3',
  ayn: 'ayn.mp3',
  ghayn: 'ghayn.mp3',
  fa: 'fa.mp3',
  qaf: 'qaf.mp3',
  kaf: 'kaf.mp3',
  laam: 'laam.mp3',
  meem: 'meem.mp3',
  noon: 'noon.mp3',
  waw: 'waw.mp3',
  ha: 'ha.mp3',
  ya: 'ya.mp3',
};

export const ARABIC_LETTER_AUDIO_MAP = {
  'ء': 'hamzah.mp3',
  'أ': 'hamzah.mp3',
  'إ': 'hamzah.mp3',
  'ا': 'alif.mp3',
  'ب': 'ba.mp3',
  'ت': 'ta.mp3',
  'ث': 'tha.mp3',
  'ج': 'jeem.mp3',
  'ح': 'haa.mp3',
  'خ': 'kha.mp3',
  'د': 'dal.mp3',
  'ذ': 'dhal.mp3',
  'ر': 'ra.mp3',
  'ز': 'zay.mp3',
  'س': 'seen.mp3',
  'ش': 'sheen.mp3',
  'ص': 'saad.mp3',
  'ض': 'daad.mp3',
  'ط': 'taa.mp3',
  'ظ': 'zaa.mp3',
  'ع': 'ayn.mp3',
  'غ': 'ghayn.mp3',
  'ف': 'fa.mp3',
  'ق': 'qaf.mp3',
  'ك': 'kaf.mp3',
  'ل': 'laam.mp3',
  'م': 'meem.mp3',
  'ن': 'noon.mp3',
  'و': 'waw.mp3',
  'ه': 'ha.mp3',
  'ي': 'ya.mp3',
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