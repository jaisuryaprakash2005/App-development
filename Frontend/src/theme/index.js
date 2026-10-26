// Design tokens extracted from the Figma file.

export const colors = {
  background: '#f6f3ec',
  surface: '#ffffff',
  surfaceMuted: '#f1eee7',
  primary: '#153c35',
  primaryDark: '#002620',
  textPrimary: '#1c1c18',
  textSecondary: '#414846',
  textMuted: '#717976',
  sage: '#d8e8c7',
  sageText: '#5a694e',
  amber: '#ffdea7',
  amberText: '#5b4310',
  onDarkMuted: '#7fa69d',
  white: '#ffffff',
};

export const fonts = {
  manrope: {
    regular: 'Manrope_400Regular',
    semibold: 'Manrope_600SemiBold',
    bold: 'Manrope_700Bold',
    extrabold: 'Manrope_800ExtraBold',
  },
  inter: {
    medium: 'Inter_500Medium',
    semibold: 'Inter_600SemiBold',
    bold: 'Inter_700Bold',
  },
};

export const spacing = {
  screen: 20, // horizontal page padding used throughout the design
};

export const radius = { sm: 8, md: 12, pill: 9999 };

export const shadows = {
  // shadow-sm
  soft: {
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  // shadow-md
  card: {
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  // shadow-lg
  raised: {
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
};
