export const typography = {
  family: {
    regular: 'Inter-Regular',
    medium: 'Inter-Medium',
    bold: 'Inter-Bold',
  },
  size: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 32,
    '4xl': 40,
  },
  style: {
    hero: { fontSize: 40, fontFamily: 'Inter-Bold' },
    h1: { fontSize: 32, fontFamily: 'Inter-Bold' },
    h2: { fontSize: 24, fontFamily: 'Inter-Bold' },
    h3: { fontSize: 20, fontFamily: 'Inter-Medium' },
    body: { fontSize: 16, fontFamily: 'Inter-Regular' },
    caption: { fontSize: 14, fontFamily: 'Inter-Regular' },
    small: { fontSize: 12, fontFamily: 'Inter-Regular' },
    label: { fontSize: 11, fontFamily: 'Inter-Medium' },
  },
} as const;
