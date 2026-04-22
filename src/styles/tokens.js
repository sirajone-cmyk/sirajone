export const colors = {
  bg: {
    primary:    '#0A0F0D',
    surface:    '#111A15',
    surfaceAlt: '#0D1511',
    elevated:   '#162018',
    footer:     '#060D09',
  },
  border: {
    subtle:     '#1E2D24',
    green:      'rgba(34,197,94,0.20)',
    greenHover: 'rgba(34,197,94,0.45)',
    gold:       'rgba(212,168,67,0.20)',
  },
  green: {
    accent:  '#22C55E',
    dim:     '#16A34A',
    light:   '#4ADE80',
    xlight:  '#86EFAC',
    muted:   'rgba(74,222,128,0.40)',
    glow:    'rgba(34,197,94,0.15)',
    glowMd:  'rgba(34,197,94,0.30)',
  },
  gold: {
    accent:  '#D4A843',
    light:   '#F0C060',
    muted:   'rgba(212,168,67,0.40)',
    glow:    'rgba(212,168,67,0.15)',
  },
  text: {
    primary:   '#F0FDF4',
    secondary: '#86EFAC',
    muted:     'rgba(134,239,172,0.55)',
    dimmed:    'rgba(240,253,244,0.40)',
    inverse:   '#0A0F0D',
  },
};

export const fonts = {
  heading: "'Playfair Display', Georgia, serif",
  body:    "'Inter', 'Segoe UI', system-ui, sans-serif",
  arabic:  "'Amiri', 'Noto Naskh Arabic', serif",
};

export const fontSizes = {
  xs: '0.75rem', sm: '0.875rem', base: '1rem', lg: '1.125rem',
  xl: '1.25rem', '2xl': '1.5rem', '3xl': '1.875rem',
  '4xl': '2.25rem', '5xl': '3rem', '6xl': '3.75rem',
};

export const radius = {
  sm: '6px', md: '12px', lg: '16px', xl: '24px', '2xl': '32px', full: '9999px',
};

export const shadows = {
  glowGreen:   '0 0 0 1px rgba(34,197,94,0.20), 0 0 30px rgba(34,197,94,0.12)',
  glowGreenMd: '0 0 0 1px rgba(34,197,94,0.40), 0 0 40px rgba(34,197,94,0.22)',
  glowGold:    '0 0 0 1px rgba(212,168,67,0.20), 0 0 30px rgba(212,168,67,0.12)',
  card:        '0 4px 24px rgba(0,0,0,0.40)',
  elevated:    '0 8px 40px rgba(0,0,0,0.55)',
};

export const transitions = {
  fast:   'all 150ms ease',
  base:   'all 250ms ease',
  slow:   'all 400ms ease',
  spring: 'all 300ms cubic-bezier(0.34,1.56,0.64,1)',
};
