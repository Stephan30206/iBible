import React from 'react';
import { StyleSheet, View } from 'react-native';

interface Props {
  children?: React.ReactNode;
}

export default function GradientBackground({ children }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.gradientLayer1} />
      <View style={styles.gradientLayer2} />
      <View style={styles.gradientLayer3} />
      <View style={styles.gradientLayer4} />

      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F3FF',
  },
  gradientLayer1: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '25%',
    backgroundColor: '#6D28D9',
  },
  gradientLayer2: {
    position: 'absolute',
    top: '20%',
    left: 0,
    right: 0,
    height: '25%',
    backgroundColor: '#7C3AED',
  },
  gradientLayer3: {
    position: 'absolute',
    top: '40%',
    left: 0,
    right: 0,
    height: '25%',
    backgroundColor: '#C4B5FD',
  },
  gradientLayer4: {
    position: 'absolute',
    top: '60%',
    left: 0,
    right: 0,
    height: '40%',
    backgroundColor: '#EDE9FE',
  },
  content: {
    flex: 1,
    zIndex: 10,
  },
});
