import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, SHADOW, SIZES } from '../../constants/theme';
import { useBible } from '../../hooks/useBible';

export default function BookDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getBook } = useBible();
  const book = getBook(id);

  if (!book) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Livre introuvable</Text>
        </View>
      </SafeAreaView>
    );
  }

  const isAT = book.testament === 'AT';

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>{book.name}</Text>
          <Text style={styles.headerSub}>{book.category}</Text>
        </View>
        <View style={styles.testamentBadge}>
          <Text
            style={[
              styles.testamentBadgeText,
              { color: isAT ? COLORS.oldTestament : COLORS.newTestament },
            ]}
          >
            {isAT ? 'AT' : 'NT'}
          </Text>
        </View>
      </View>

      <FlatList
        data={book.chapters}
        keyExtractor={(item, index) => (item.chapter ?? index).toString()}
        numColumns={4}
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.bookInfo}>
            <View
              style={[
                styles.bookBanner,
                {
                  backgroundColor: isAT ? COLORS.oldTestamentBg : COLORS.newTestamentBg,
                  borderColor: isAT ? COLORS.oldTestamentBorder : COLORS.newTestamentBorder,
                },
              ]}
            >
              <Text
                style={[
                  styles.bookBannerName,
                  { color: isAT ? COLORS.oldTestament : COLORS.newTestament },
                ]}
              >
                {book.name}
              </Text>
              <Text
                style={[
                  styles.bookBannerMeta,
                  { color: isAT ? COLORS.oldTestament : COLORS.newTestament },
                ]}
              >
                {book.chapters.length} chapitres · {book.category}
              </Text>
            </View>
            <Text style={styles.gridTitle}>Choisir un chapitre</Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.chapterBtn, SHADOW.soft]}
            onPress={() =>
              router.push({
                pathname: '/chapter/[id]',
                params: {
                  id: `${book.id}-${item.chapter}`,
                  bookId: book.id,
                  chapterNum: item.chapter,
                },
              })
            }
            activeOpacity={0.75}
          >
            <Text style={styles.chapterNum}>{item.chapter}</Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingHorizontal: SIZES.s4,
    paddingVertical: SIZES.s3,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: SIZES.s3,
  },
  backBtn: { padding: SIZES.s1 },
  headerCenter: { flex: 1 },
  headerTitle: {
    fontSize: SIZES.lg,
    fontFamily: FONTS.serif,
    color: COLORS.textPrimary,
    fontWeight: '700',
  },
  headerSub: { fontSize: SIZES.xs, color: COLORS.textMuted, marginTop: 1 },
  testamentBadge: {
    paddingHorizontal: SIZES.s2,
    paddingVertical: 3,
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  testamentBadgeText: { fontSize: SIZES.xs, fontWeight: '800' },

  grid: { padding: SIZES.s4, paddingBottom: 32 },

  bookInfo: { marginBottom: SIZES.s5 },
  bookBanner: {
    borderRadius: SIZES.radiusLg,
    padding: SIZES.s4,
    borderWidth: 1,
    marginBottom: SIZES.s4,
    alignItems: 'center',
  },
  bookBannerName: {
    fontSize: SIZES.xxl,
    fontFamily: FONTS.serif,
    fontWeight: '700',
    fontStyle: 'italic',
  },
  bookBannerMeta: { fontSize: SIZES.sm, marginTop: 4, opacity: 0.8 },
  gridTitle: {
    fontSize: SIZES.xs,
    color: COLORS.textMuted,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },

  chapterBtn: {
    flex: 1,
    margin: SIZES.s1,
    aspectRatio: 1,
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusMd,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.2,
    borderColor: COLORS.borderLight,
  },
  chapterNum: {
    fontSize: SIZES.md,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
});
