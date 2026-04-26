import { Platform } from 'react-native';

// ====================================
// COLOR PALETTE
// ====================================
export const COLORS = {
  // Primary & Accent - Banking Style
  primary: '#5B3BD6',          // Deep purple - primary
  primaryLight: '#7B5FE8',     // Light purple
  primaryDark: '#4A2DB5',      // Dark purple
  accent: '#00C9D7',           // Cyan/Turquoise accent
  accentLight: '#4CDFE8',      // Light cyan
  accentSurface: '#E8F8FF',    // Light cyan surface
  accentBorder: '#A0E8F0',     // Cyan border

  // Text Colors - Professional
  textPrimary: '#1A1A2E',      // Main text - very dark
  textSecondary: '#6B7280',    // Secondary text - gray
  textMuted: '#9CA3AF',        // Muted text - lighter gray
  textLight: '#D1D5DB',        // Light text - very light gray
  textInverted: '#FFFFFF',     // White text for dark backgrounds

  // Background & Surface - Clean & Professional
  background: '#F8F9FB',       // Clean light background
  surface: '#FFFFFF',          // White surface
  surfaceAlt: '#F3F4F6',       // Alternative surface - light gray
  surfaceDark: '#2D2E3F',      // Dark surface for cards on dark bg
  surfaceHover: '#F9FAFB',     // Hover state surface

  // Borders & Dividers
  border: '#E5E7EB',           // Standard border
  borderLight: '#F3F4F6',      // Light border
  borderDark: '#D1D5DB',       // Dark border

  // Neutral
  white: '#FFFFFF',
  black: '#000000',

  // Tab colors - Banking style
  tabBg: '#FFFFFF',
  tabActive: '#5B3BD6',        // Primary purple
  tabInactive: '#9CA3AF',      // Muted gray

  // Testament colors - Modern professional
  oldTestament: '#5B3BD6',     // Purple
  oldTestamentBg: '#F3E8FF',   // Light purple
  oldTestamentBorder: '#D8B4FF', // Medium purple
  newTestament: '#00C9D7',     // Cyan
  newTestamentBg: '#E8F8FF',   // Light cyan
  newTestamentBorder: '#80E9F0', // Medium cyan

  // Status colors
  success: '#10B981',          // Green
  warning: '#F59E0B',          // Amber
  error: '#EF4444',            // Red
  info: '#3B82F6',             // Blue
};

// ====================================
// TYPOGRAPHY
// ====================================
export const FONTS = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

// ====================================
// SIZES & SPACING
// ====================================
export const SIZES = {
  // Spacing scale
  s0: 0,
  s1: 4,
  s2: 8,
  s3: 12,
  s4: 16,
  s5: 20,
  s6: 24,
  s7: 32,
  s8: 40,
  
  // Typography sizes
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  
  // Border radius - Modern banking style
  radiusSm: 4,
  radius: 8,
  radiusMd: 12,
  radiusLg: 16,
  radiusXl: 20,
  radiusFull: 999,
};

// ====================================
// SHADOWS
// ====================================
export const SHADOW = {
  none: {
    shadowColor: 'transparent',
    elevation: 0,
  },
  soft: {
    shadowColor: '#5B3BD6',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 2,
  },
  medium: {
    shadowColor: '#5B3BD6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 4,
  },
  large: {
    shadowColor: '#5B3BD6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  strong: {
    shadowColor: '#5B3BD6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
  },
};
