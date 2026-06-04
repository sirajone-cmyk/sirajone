export const STATS = [
  { id: 'arabic-letters', value: 28, suffix: '', label: 'Arabic Letters', sublabel: '' },
  { id: 'makharij-points', value: 17, suffix: '', label: 'Makharij Points', sublabel: '' },
  { id: 'sifaat-qualities', value: 20, suffix: '+', label: 'Sifat Qualities', sublabel: '' },
  { id: 'tools', value: 100, suffix: '%', label: 'Free Online Tools', sublabel: '' },
];

export const heroStats = [
  { id: 'letters', value: 28, suffix: '', label: 'Arabic Letters' },
  { id: 'makharij', value: 17, suffix: '', label: 'Makharij Points' },
  { id: 'sifaat', value: 20, suffix: '+', label: 'Sifat Qualities' },
  { id: 'tools', value: 100, suffix: '%', label: 'Free Online Tools' },
];

export const socialStats = STATS.map((item) => ({
  id: item.id,
  value: item.value,
  label: item.label,
}));
