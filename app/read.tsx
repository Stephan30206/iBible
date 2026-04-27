import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import { useBookmarks } from '../hooks/useBookmarks';

export default function ReadScreen() {
  const router = useRouter();
  const { lastPosition, isLoaded } = useBookmarks();

  useEffect(() => {
    if (!isLoaded) return;
    const pos = lastPosition ?? { bookId: 1, chapter: 1, bookName: 'Genèse' };
    const timer = setTimeout(() => {
      router.replace({
        pathname: '/chapter/[id]',
        params: {
          id: `${pos.bookId}-${pos.chapter}`,
          bookId: pos.bookId,
          chapterNum: pos.chapter,
        },
      });
    }, 80);
    return () => clearTimeout(timer);
  }, [isLoaded, lastPosition]);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.center}>
        <Text style={styles.cross}>✝</Text>
        <Text style={styles.label}>Ouverture de la lecture…</Text>
        <ActivityIndicator color={COLORS.accent} style={{ marginTop: 16 }} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  cross: { fontSize: 48, color: COLORS.accent, marginBottom: SIZES.s3 },
  label: { fontSize: SIZES.md, color: COLORS.textMuted, fontFamily: FONTS.serif },
});
