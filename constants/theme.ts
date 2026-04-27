import { Platform } from 'react-native';

export const COLORS = {
  primary: '#5B3BD6',          
  primaryLight: '#7B5FE8',     
  primaryDark: '#4A2DB5',      
  accent: '#00C9D7',           
  accentLight: '#4CDFE8',      
  accentSurface: '#E8F8FF',    
  accentBorder: '#A0E8F0',    
  
  textPrimary: '#1A1A2E',      
  textSecondary: '#6B7280',    
  textMuted: '#9CA3AF',       
  textLight: '#D1D5DB',        
  textInverted: '#FFFFFF',     

  background: '#F8F9FB',       
  surface: '#FFFFFF',          
  surfaceAlt: '#F3F4F6',       
  surfaceDark: '#2D2E3F',      
  surfaceHover: '#F9FAFB',     

  border: '#E5E7EB',          
  borderLight: '#F3F4F6',      
  borderDark: '#D1D5DB',     

  white: '#FFFFFF',
  black: '#000000',

  tabBg: '#FFFFFF',
  tabActive: '#5B3BD6',       
  tabInactive: '#9CA3AF',      

  oldTestament: '#5B3BD6',     
  oldTestamentBg: '#F3E8FF',   
  oldTestamentBorder: '#D8B4FF', 
  newTestament: '#00C9D7',     
  newTestamentBg: '#E8F8FF',   
  newTestamentBorder: '#80E9F0',

  success: '#10B981',          
  warning: '#F59E0B',          
  error: '#EF4444',           
  info: '#3B82F6',             
};

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

export const SIZES = {
  s0: 0,
  s1: 4,
  s2: 8,
  s3: 12,
  s4: 16,
  s5: 20,
  s6: 24,
  s7: 32,
  s8: 40,
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  radiusSm: 4,
  radius: 8,
  radiusMd: 12,
  radiusLg: 16,
  radiusXl: 20,
  radiusFull: 999,
};

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
