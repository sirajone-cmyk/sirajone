const CANVAS = { width: 600, height: 900 };

const CATEGORY_THEMES = {
  Storybooks: {
    gradient: ['#14532D', '#166534'],
    accent: '#86EFAC',
    motifOpacity: 0.11,
  },
  'Dua Books': {
    gradient: ['#0F3C4C', '#155E75'],
    accent: '#BAE6FD',
    motifOpacity: 0.12,
  },
  'Fiqh Books': {
    gradient: ['#4A2A0E', '#78350F'],
    accent: '#FCD34D',
    motifOpacity: 0.12,
  },
  'Qaidah Books': {
    gradient: ['#3B1A68', '#5B21B6'],
    accent: '#DDD6FE',
    motifOpacity: 0.11,
  },
  'Tajweed Books': {
    gradient: ['#0C3D4D', '#0E7490'],
    accent: '#A5F3FC',
    motifOpacity: 0.12,
  },
  Others: {
    gradient: ['#1E293B', '#334155'],
    accent: '#CBD5E1',
    motifOpacity: 0.1,
  },
};

const FALLBACK_THEME = CATEGORY_THEMES.Others;

function escapeXml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function normalizeText(value = '') {
  return String(value).replace(/\s+/g, ' ').trim();
}

function shorten(value = '', max = 80) {
  if (value.length <= max) return value;
  return `${value.slice(0, max - 1).trimEnd()}...`;
}

function wrapText(text, maxLineLength, maxLines) {
  const words = normalizeText(text).split(' ').filter(Boolean);
  if (!words.length) return [];
  const lines = [];
  let current = '';

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length <= maxLineLength) {
      current = candidate;
      continue;
    }
    if (current) lines.push(current);
    current = word;
    if (lines.length === maxLines) break;
  }

  if (current && lines.length < maxLines) lines.push(current);
  if (lines.length > maxLines) lines.length = maxLines;

  const consumedWords = lines.join(' ').split(' ').filter(Boolean).length;
  if (consumedWords < words.length && lines.length) {
    lines[lines.length - 1] = shorten(lines[lines.length - 1], Math.max(8, maxLineLength - 1));
  }
  return lines;
}

function pickTheme(mainCategory = 'Others') {
  return CATEGORY_THEMES[mainCategory] || FALLBACK_THEME;
}

function computeTitleStyle(title = '') {
  const len = normalizeText(title).length;
  if (len <= 18) return { size: 62, maxLineLength: 14, maxLines: 2, lineHeight: 72 };
  if (len <= 32) return { size: 52, maxLineLength: 17, maxLines: 3, lineHeight: 61 };
  if (len <= 54) return { size: 44, maxLineLength: 20, maxLines: 3, lineHeight: 52 };
  return { size: 38, maxLineLength: 24, maxLines: 4, lineHeight: 46 };
}

function deriveSubtitle(mainCategory, subcategory, description) {
  const byCategory = normalizeText(subcategory || mainCategory || '');
  const byDescription = shorten(normalizeText(description), 74);
  return byDescription || byCategory;
}

function toInitials(value = '') {
  const words = normalizeText(value).split(' ').filter(Boolean).slice(0, 3);
  if (!words.length) return 'BK';
  return words.map((word) => word[0]).join('').toUpperCase();
}

function renderLines(lines, startY, lineHeight, fontSize, color, fontWeight = 700) {
  return lines
    .map(
      (line, idx) => `
    <text
      x="72"
      y="${startY + idx * lineHeight}"
      fill="${color}"
      font-size="${fontSize}"
      font-family="Inter, Arial, sans-serif"
      font-weight="${fontWeight}"
    >${escapeXml(line)}</text>`
    )
    .join('');
}

export function generateBookCoverDataUrl({
  title = '',
  mainCategory = 'Others',
  subcategory = '',
  description = '',
  author = '',
} = {}) {
  const cleanTitle = normalizeText(title);
  if (!cleanTitle) return '';

  const theme = pickTheme(mainCategory);
  const titleStyle = computeTitleStyle(cleanTitle);
  const titleLines = wrapText(cleanTitle, titleStyle.maxLineLength, titleStyle.maxLines);
  const subtitle = deriveSubtitle(mainCategory, subcategory, description);
  const subtitleLines = wrapText(subtitle, 36, 2);
  const authorLine = normalizeText(author || 'SirajOne Library');
  const initials = toInitials(cleanTitle);

  const titleStartY = 360;
  const subtitleStartY = titleStartY + titleLines.length * titleStyle.lineHeight + 34;
  const authorY = subtitleStartY + subtitleLines.length * 34 + 58;

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${CANVAS.width}" height="${CANVAS.height}" viewBox="0 0 ${CANVAS.width} ${CANVAS.height}">
  <defs>
    <linearGradient id="bgGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${theme.gradient[0]}" />
      <stop offset="100%" stop-color="${theme.gradient[1]}" />
    </linearGradient>
    <linearGradient id="glassGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="rgba(255,255,255,0.08)" />
      <stop offset="100%" stop-color="rgba(255,255,255,0.02)" />
    </linearGradient>
  </defs>

  <rect width="${CANVAS.width}" height="${CANVAS.height}" fill="#06140D" />
  <rect x="20" y="20" width="${CANVAS.width - 40}" height="${CANVAS.height - 40}" rx="30" fill="url(#bgGrad)" />
  <rect x="24" y="24" width="${CANVAS.width - 48}" height="${CANVAS.height - 48}" rx="28" fill="none" stroke="#22C55E" stroke-opacity="0.25" />

  <g opacity="${theme.motifOpacity}">
    <circle cx="520" cy="120" r="120" fill="${theme.accent}" />
    <circle cx="90" cy="790" r="110" fill="${theme.accent}" />
  </g>

  <rect x="46" y="46" width="${CANVAS.width - 92}" height="${CANVAS.height - 92}" rx="24" fill="url(#glassGrad)" stroke="rgba(255,255,255,0.08)" />

  <circle cx="${CANVAS.width / 2}" cy="170" r="86" fill="rgba(0,0,0,0.16)" stroke="${theme.accent}" stroke-opacity="0.5" stroke-width="2.2" />
  <text
    x="${CANVAS.width / 2}"
    y="190"
    text-anchor="middle"
    fill="#F0FDF4"
    font-size="68"
    font-family="Inter, Arial, sans-serif"
    font-weight="700"
  >${escapeXml(initials)}</text>

  <text x="72" y="286" fill="${theme.accent}" font-size="18" font-family="Inter, Arial, sans-serif" font-weight="700" letter-spacing="1.8">
    ${escapeXml((subcategory || mainCategory || 'Library').toUpperCase())}
  </text>

  ${renderLines(titleLines, titleStartY, titleStyle.lineHeight, titleStyle.size, '#F0FDF4', 700)}
  ${renderLines(subtitleLines, subtitleStartY, 34, 28, 'rgba(226,251,236,0.92)', 500)}

  <line x1="72" y1="${authorY - 26}" x2="${CANVAS.width - 72}" y2="${authorY - 26}" stroke="rgba(255,255,255,0.3)" />
  <text x="72" y="${authorY}" fill="#C8F9DE" font-size="22" font-family="Inter, Arial, sans-serif" font-weight="600">
    ${escapeXml(shorten(authorLine, 36))}
  </text>

  <text x="72" y="${CANVAS.height - 62}" fill="rgba(226,251,236,0.75)" font-size="16" font-family="Inter, Arial, sans-serif">
    SirajOne • Auto-generated cover
  </text>
</svg>`;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}


