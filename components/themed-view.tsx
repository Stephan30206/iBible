import { View, type ViewProps } from 'react-native';
import { COLORS } from '../constants/theme';

export type ThemedViewProps = ViewProps;

export function ThemedView({ style, ...otherProps }: ThemedViewProps) {
  return <View style={[{ backgroundColor: COLORS.background }, style]} {...otherProps} />;
}
