// app/bookmarks.tsx
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    Alert,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import EmptyState from '../components/EmptyState';
import { COLORS, FONTS, SHADOW, SIZES } from '../constants/theme';
import { useBookmarks } from '../hooks/useBookmarks';
import { Bookmark } from '../types/bible';
import { formatDate, truncate } from '../utils/helpers';

export default function BookmarksScreen() {
  const router = useRouter();
  const { bookmarks, removeBookmark } = useBookmarks();

  const confirmRemove = (bm: Bookmark) => {
    Alert.alert(
      'Supprimer le favori',
      `Retirer ${bm.reference} de vos favoris ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => removeBookmark(bm.bookId, bm.chapter, bm.verse),
        },
      ]
    );
  };

  const goChapter = (bm: Bookmark) => {
    router.push({
      pathname: '/chapter/[id]',
      params: {
        id: `${bm.bookId}-${bm.chapter}`,
        bookId: bm.bookId,
        chapterNum: bm.chapter,
      },
    });
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Favoris</Text>
          <Text style={styles.sub}>
            {bookmarks.length} verset{bookmarks.length !== 1 ? 's' : ''} sauvegardé{bookmarks.length !== 1 ? 's' : ''}
          </Text>
        </View>
        {bookmarks.length > 0 && (
          <View style={styles.countBadge}>
            <Ionicons name="heart" size={14} color={COLORS.accent} />
            <Text style={styles.countBadgeText}>{bookmarks.length}</Text>
          </View>
        )}
      </View>

      {bookmarks.length === 0 ? (
        <EmptyState
          icon="heart-outline"
          title="Aucun favori"
          subtitle="Lors de la lecture, appuyez longuement sur un verset pour l'ajouter ici."
        />
      ) : (
        <FlatList
          data={bookmarks}
          keyExtractor={(item, i) =>
            `${item.bookId}-${item.chapter}-${item.verse}-${i}`
          }
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.card, SHADOW.soft]}
              onPress={() => goChapter(item)}
              activeOpacity={0.8}
            >
              {/* Top bar */}
              <View style={styles.cardTop}>
                <View style={styles.refRow}>
                  <View style={styles.refBadge}>
                    <Text style={styles.refText}>{item.reference}</Text>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => confirmRemove(item)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  style={styles.removeBtn}
                >
                  <Ionicons name="trash-outline" size={16} color={COLORS.textLight} />
                </TouchableOpacity>
              </View>

              {/* Texte */}
              <Text style={styles.verseText}>
                « {truncate(item.text, 120)} »
              </Text>

              {/* Footer */}
              <View style={styles.cardFooter}>
                {item.savedAt && (
                  <View style={styles.dateRow}>
                    <Ionicons name="calendar-outline" size={12} color={COLORS.textLight} />
                    <Text style={styles.dateText}>{formatDate(item.savedAt)}</Text>
                  </View>
                )}
                <View style={styles.readLink}>
                  <Text style={styles.readLinkText}>Lire le contexte</Text>
                  <Ionicons name="arrow-forward" size={12} color={COLORS.accent} />
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },

  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    paddingHorizontal: SIZES.s4,
    paddingTop: SIZES.s5,
    paddingBottom: SIZES.s3,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    fontSize: SIZES.xxl,
    fontFamily: FONTS.serif,
    color: COLORS.textPrimary,
    fontWeight: '700',
  },
  sub: {
    fontSize: SIZES.sm,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  countBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.accentSurface,
    paddingHorizontal: SIZES.s3,
    paddingVertical: SIZES.s2,
    borderRadius: SIZES.radiusFull,
    borderWidth: 1,
    borderColor: COLORS.accentBorder,
  },
  countBadgeText: {
    fontSize: SIZES.sm,
    fontWeight: '800',
    color: COLORS.accent,
  },

  list: { padding: SIZES.s4, gap: SIZES.s3 },

  card: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusLg,
    padding: SIZES.s4,
    borderWidth: 1,
    borderColor: COLORS.accentBorder,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.accent,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SIZES.s3,
  },
  refRow: { flexDirection: 'row', alignItems: 'center', gap: SIZES.s2 },
  refBadge: {
    backgroundColor: COLORS.accentSurface,
    paddingHorizontal: SIZES.s2,
    paddingVertical: 3,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.accentBorder,
  },
  refText: { fontSize: SIZES.xs, color: COLORS.accent, fontWeight: '800' },
  removeBtn: {
    padding: SIZES.s1,
  },

  verseText: {
    fontSize: SIZES.md,
    fontFamily: FONTS.serif,
    color: COLORS.textPrimary,
    lineHeight: 26,
    fontStyle: 'italic',
  },

  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: SIZES.s3,
    paddingTop: SIZES.s2,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dateText: { fontSize: SIZES.xs, color: COLORS.textLight },
  readLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  readLinkText: { fontSize: SIZES.xs, color: COLORS.accent, fontWeight: '700' },
});
