// app/chapter/[id].tsx
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef } from 'react';
import {
    Alert,
    FlatList,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import VerseItem from '../../components/VerseItem';
import { COLORS, FONTS, SHADOW, SIZES } from '../../constants/theme';
import { useBible } from '../../hooks/useBible';
import { useBookmarks } from '../../hooks/useBookmarks';

export default function ChapterScreen() {
  const { bookId, chapterNum } = useLocalSearchParams<{
    id: string;
    bookId: string;
    chapterNum: string;
  }>();
  const router = useRouter();
  const { getBook, getChapter } = useBible();
  const { isBookmarked, toggleBookmark, saveLastPosition } = useBookmarks();
  const flatRef = useRef<FlatList>(null);

  const book = getBook(bookId ?? '1');
  const chapter = getChapter(bookId ?? '1', chapterNum ?? '1');
  const currentChapter = parseInt(chapterNum ?? '1');

  // Debug logging
  console.log('📖 Chapter loaded:', {
    bookId,
    chapterNum,
    bookName: book?.name,
    chapterFound: !!chapter,
    versesCount: chapter?.verses?.length ?? 0,
    firstVerse: chapter?.verses?.[0],
  });

  if (chapter) {
    console.log('🔥 FULL CHAPTER DATA:', JSON.stringify(chapter, null, 2).substring(0, 500));
  }

  // Sauvegarder la position
  useEffect(() => {
    if (book && chapter) {
      saveLastPosition({
        bookId: parseInt(bookId ?? '1'),
        bookName: book.name,
        chapter: currentChapter,
      });
    }
  }, [bookId, chapterNum]);

  const goToChapter = useCallback(
    (n: number) => {
      flatRef.current?.scrollToOffset({ offset: 0, animated: false });
      router.replace({
        pathname: '/chapter/[id]',
        params: { id: `${bookId}-${n}`, bookId: bookId ?? '1', chapterNum: n },
      });
    },
    [bookId, router]
  );

  // Écran d'erreur
  if (!book || !chapter) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.navBar}>
          <TouchableOpacity onPress={() => router.back()} style={styles.navIconBtn}>
            <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.navTitle}>Erreur</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={COLORS.textMuted} />
          <Text style={styles.errorTitle}>Chapitre introuvable</Text>
          <Text style={styles.errorSub}>
            Vérifiez que bible_fr.json est présent dans le dossier data/
          </Text>
          <TouchableOpacity style={styles.errorBtn} onPress={() => router.push('/books')}>
            <Text style={styles.errorBtnText}>Parcourir les livres</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const totalChapters = book.chapters.length;
  const bookIdNum = parseInt(bookId ?? '1');

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" />

      {/* ── Top Nav ── */}
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.navIconBtn}>
          <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navCenter}
          onPress={() => router.push({ pathname: '/books/[id]', params: { id: bookIdNum } })}
        >
          <Text style={styles.navBook}>{book.name}</Text>
          <Text style={styles.navChapter}>Chapitre {currentChapter}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navIconBtn}
          onPress={() => Alert.alert(
            `${book.name} ${currentChapter}`,
            `${chapter.verses.length} versets\n${book.category}`
          )}
        >
          <Ionicons name="information-circle-outline" size={24} color={COLORS.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* ── Versets ── */}
      <FlatList
        ref={flatRef}
        data={chapter.verses}
        keyExtractor={(item, index) => (item.verse ?? index).toString()}
        contentContainerStyle={styles.verseList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={{ padding: 20, alignItems: 'center' }}>
            <Text style={{ color: COLORS.textMuted }}>
              ⚠️ Pas de versets ({chapter.verses?.length ?? 0})
            </Text>
          </View>
        }
        ListHeaderComponent={
          <View style={styles.chapterBanner}>
            <Text style={styles.bannerBook}>{book.name.toUpperCase()}</Text>
            <Text style={styles.bannerChapter}>Chapitre {currentChapter}</Text>
            <View style={styles.bannerLine} />
            <Text style={styles.bannerHint}>
              <Ionicons name="hand-left-outline" size={11} color={COLORS.textMuted} />
              {' '}Appui long sur un verset pour le mettre en favori
            </Text>
          </View>
        }
        renderItem={({ item, index }) => {
          console.log(`🔤 Rendering verse ${index}:`, item);
          return (
            <VerseItem
              verse={item}
              bookId={bookIdNum}
              chapter={currentChapter}
              bookName={book.name}
              isBookmarked={isBookmarked(bookIdNum, currentChapter, item.verse)}
              onToggleBookmark={toggleBookmark}
            />
          );
        }}
      />


    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },

  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingHorizontal: SIZES.s3,
    paddingVertical: SIZES.s2,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  navIconBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.surfaceAlt,
  },
  navCenter: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: SIZES.s1,
  },
  navBook: {
    fontSize: SIZES.sm,
    color: COLORS.accent,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  navTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: SIZES.md,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  navChapter: {
    fontSize: SIZES.lg,
    fontFamily: FONTS.serif,
    color: COLORS.textPrimary,
    fontWeight: '700',
    marginTop: 1,
  },

  verseList: { paddingBottom: 24 },

  chapterBanner: {
    alignItems: 'center',
    paddingVertical: SIZES.s6,
    paddingHorizontal: SIZES.s4,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
    marginBottom: SIZES.s1,
  },
  bannerBook: {
    fontSize: SIZES.xs,
    color: COLORS.accent,
    fontWeight: '800',
    letterSpacing: 2.5,
    marginBottom: 6,
  },
  bannerChapter: {
    fontSize: SIZES.xxxl,
    fontFamily: FONTS.serif,
    color: COLORS.textPrimary,
    fontWeight: '700',
    fontStyle: 'italic',
  },
  bannerLine: {
    width: 36,
    height: 2,
    backgroundColor: COLORS.accent,
    borderRadius: 1,
    marginVertical: SIZES.s3,
  },
  bannerHint: {
    fontSize: SIZES.xs,
    color: COLORS.textMuted,
    textAlign: 'center',
  },



  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SIZES.s6,
  },
  errorTitle: {
    fontSize: SIZES.xl,
    fontFamily: FONTS.serif,
    color: COLORS.textPrimary,
    fontWeight: '700',
    marginTop: SIZES.s4,
    marginBottom: SIZES.s2,
  },
  errorSub: {
    fontSize: SIZES.md,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 24,
  },
  errorBtn: {
    marginTop: SIZES.s5,
    backgroundColor: COLORS.accent,
    paddingHorizontal: SIZES.s5,
    paddingVertical: SIZES.s3,
    borderRadius: SIZES.radiusFull,
  },
  errorBtnText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: SIZES.md,
  },
});
