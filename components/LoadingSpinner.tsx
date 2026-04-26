import React, { useEffect } from 'react';
import {
  View,
  Animated,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { COLORS, SIZES } from '@/constants/theme';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  style?: ViewStyle;
}

export default function LoadingSpinner({
  size = 'medium',
  color = COLORS.primary,
  style,
}: LoadingSpinnerProps) {
  const spinValue = new Animated.Value(0);

  const sizeMap = {
    small: 32,
    medium: 48,
    large: 64,
  };

  const actualSize = sizeMap[size];

  useEffect(() => {
    const spin = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      })
    );
    spin.start();
  }, [spinValue]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={[styles.container, style]}>
      <Animated.View
        style={[
          styles.spinner,
          {
            width: actualSize,
            height: actualSize,
            transform: [{ rotate: spin }],
          },
        ]}
      >
        {/* Outer ring */}
        <View
          style={[
            styles.ring,
            {
              width: actualSize,
              height: actualSize,
              borderColor: color,
              borderWidth: actualSize / 8,
              opacity: 0.2,
            },
          ]}
        />

        {/* Inner rotating ring */}
        <View
          style={[
            styles.ring,
            {
              width: actualSize * 0.7,
              height: actualSize * 0.7,
              borderColor: color,
              borderTopColor: color,
              borderRightColor: color,
              borderBottomColor: 'transparent',
              borderLeftColor: 'transparent',
              borderWidth: actualSize / 10,
            },
          ]}
        />
      </Animated.View>

      {/* Center dot */}
      <View
        style={[
          styles.dot,
          {
            width: actualSize * 0.2,
            height: actualSize * 0.2,
            backgroundColor: color,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinner: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  ring: {
    borderRadius: SIZES.radiusFull,
    position: 'absolute',
  },
  dot: {
    borderRadius: SIZES.radiusFull,
    zIndex: 10,
  },
});
