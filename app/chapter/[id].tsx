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
            <Ionicons name="arrow-back" size={24} color={COLORS.white} />
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
          <Ionicons name="arrow-back" size={24} color={COLORS.white} />
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
          <Ionicons name="information-circle-outline" size={24} color={COLORS.white} />
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
    backgroundColor: COLORS.primary,
    paddingHorizontal: SIZES.s3,
    paddingVertical: SIZES.s2,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  navIconBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: SIZES.radiusMd,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  navCenter: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: SIZES.s1,
  },
  navBook: {
    fontSize: SIZES.xs,
    color: COLORS.accent,
    fontWeight: '600',
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
    color: COLORS.white,
    fontWeight: '700',
    marginTop: 2,
  },

  verseList: { paddingBottom: 24 },

  chapterBanner: {
    alignItems: 'center',
    paddingVertical: SIZES.s5,
    paddingHorizontal: SIZES.s4,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  bannerBook: {
    fontSize: SIZES.xs,
    color: COLORS.primary,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  bannerChapter: {
    fontSize: SIZES.xxxl,
    color: COLORS.textPrimary,
    fontWeight: '700',
  },
  bannerLine: {
    width: 40,
    height: 2,
    backgroundColor: COLORS.accent,
    borderRadius: 1,
    marginVertical: SIZES.s3,
  },
  bannerHint: {
    fontSize: SIZES.xs,
    color: COLORS.textMuted,
    textAlign: 'center',
    fontWeight: '400',
  },



  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SIZES.s6,
  },
  errorTitle: {
    fontSize: SIZES.xl,
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
    backgroundColor: COLORS.primary,
    paddingHorizontal: SIZES.s5,
    paddingVertical: SIZES.s3,
    borderRadius: SIZES.radiusLg,
  },
  errorBtnText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: SIZES.md,
  },
});
