export const colors = {
  blue: '#1E88E5',
  blueSoft: '#E2EDFF',
  black: '#000000',
  white: '#FFFFFF',
  gray: '#969696',
  green: '#009F06',
  red: '#FF0000',
};
export const spacing = (n: number) => n * 8;
export const radius = { xs: 6, sm: 8, md: 10, lg: 16, xl: 28 };
export const shadows = {
  light: { shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 6, elevation: 2 },
};
export const fonts = {
  h1: { fontFamily: 'Inter_700Bold', fontSize: 30, color: colors.black },
  h2: { fontFamily: 'Inter_600SemiBold', fontSize: 19, color: colors.black },
  body: { fontFamily: 'Inter_400Regular', fontSize: 14, color: colors.black },
  secondary: { fontFamily: 'Inter_400Regular', fontSize: 13, color: colors.gray },
  caption: { fontFamily: 'Inter_400Regular', fontSize: 12, color: colors.gray },
  rating: { fontFamily: 'Inter_600SemiBold', fontSize: 16, color: colors.black },
  date: { fontFamily: 'Inter_700Bold', fontSize: 14, color: colors.black },
  input: { fontSize: 16, fontFamily: 'Inter_400Regular', color: colors.black },
};
export const icon = { size: 27 };
export const techBadge = { size: 55, bg: colors.blueSoft };
