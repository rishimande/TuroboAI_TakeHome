/**
 * Design tokens extracted from Figma design
 * These values should match the Figma design exactly
 */

export const colors = {
  // Category colors
  randomThoughts: "#78aba8",
  randomThoughtsLight: "rgba(120, 171, 168, 0.5)",
  school: "#a8a378",
  schoolLight: "rgba(168, 163, 120, 0.5)",
  personal: "#a878ab",
  personalLight: "rgba(168, 120, 171, 0.5)",
  
  // Primary colors
  primary: "#957139",
  primaryText: "#88642a",
  
  // Background colors
  background: "#faf1e3",
  cardBorder: "#78aba8",
  
  // Text colors
  text: {
    primary: "#000000",
    secondary: "#949494",
  },
} as const;

export const fonts = {
  heading: "Inria Serif",
  body: "Inter",
} as const;

export const fontSize = {
  xs: "12px",
  sm: "14px",
  md: "16px",
  lg: "24px",
  xl: "48px",
} as const;

export const borderRadius = {
  sm: "6px",
  md: "11px",
  lg: "46px",
} as const;

export const spacing = {
  xs: "6px",
  sm: "8px",
  md: "12px",
  lg: "16px",
  xl: "24px",
} as const;

export const shadows = {
  card: "1px 1px 2px 0px rgba(0, 0, 0, 0.25)",
} as const;

export const getCategoryColor = (categoryName: string) => {
  const categoryColors: Record<string, { background: string; border: string }> = {
    "Random Thoughts": {
      background: colors.randomThoughtsLight,
      border: colors.randomThoughts,
    },
    "School": {
      background: colors.schoolLight,
      border: colors.school,
    },
    "Personal": {
      background: colors.personalLight,
      border: colors.personal,
    },
  };
  
  return categoryColors[categoryName] || {
    background: colors.randomThoughtsLight,
    border: colors.randomThoughts,
  };
};
