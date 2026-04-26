import { Platform } from 'react-native';

// ====================================
// COLOR PALETTE
// ====================================
export const COLORS = {
  // Primary & Accent
  accent: '#C77A3B',           // Warm brown/terracotta
  accentLight: '#E8A870',      // Light warm accent
  accentSurface: '#FBF6F1',    // Light surface with accent tone
  accentBorder: '#E8D0C0',     // Subtle border with accent tone
  
  // Text Colors
  textPrimary: '#1F2937',      // Main text - dark charcoal
  textSecondary: '#6B7280',    // Secondary text - gray
  textMuted: '#9CA3AF',        // Muted text - lighter gray
  textLight: '#D1D5DB',        // Light text - very light gray
  
  // Background & Surface
  background: '#FEFDFB',       // Off-white background
  surface: '#FFFFFF',          // White surface
  surfaceAlt: '#F3F4F6',       // Alternative surface - light gray
  surfaceHover: '#F9FAFB',     // Hover state surface
  
  // Borders & Dividers
  border: '#E5E7EB',           // Standard border
  borderLight: '#F3F4F6',      // Light border
  borderDark: '#D1D5DB',       // Dark border
  
  // Neutral
  white: '#FFFFFF',
  black: '#000000',
  
  // Tab colors
  tabBg: '#FFFFFF',
  tabActive: '#C77A3B',        // Same as accent
  tabInactive: '#9CA3AF',      // Same as textMuted

  // Testament colors
  oldTestament: '#8B4513',     // Saddle brown
  oldTestamentBg: '#FBF1E8',   // Light brown
  oldTestamentBorder: '#D4A574', // Medium brown
  newTestament: '#1E4D8B',     // Dark blue
  newTestamentBg: '#E8F0F8',   // Light blue
  newTestamentBorder: '#7BA8D1', // Medium blue
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
  
  // Border radius
  radius: 8,
  radiusSm: 4,
  radiusMd: 12,
  radiusLg: 16,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  strong: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 12,
    elevation: 8,
  },
};
