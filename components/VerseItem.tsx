// components/VerseItem.tsx
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import { Bookmark } from '../types/bible';
import { TextPart } from '../utils/helpers';

interface Props {
  verse: { verse: number; text: string };
  bookId: number;
  chapter: number;
  bookName: string;
  isBookmarked: boolean;
  onToggleBookmark: (data: Omit<Bookmark, 'savedAt'>) => void;
  highlightParts?: TextPart[];
}

const VerseItem = React.memo(function VerseItem({
  verse,
  bookId,
  chapter,
  bookName,
  isBookmarked,
  onToggleBookmark,
  highlightParts,
}: Props) {
  const verseData: Omit<Bookmark, 'savedAt'> = {
    bookId,
    chapter,
    verse: verse.verse,
    text: verse.text,
    bookName,
    reference: `${bookName} ${chapter}:${verse.verse}`,
  };

  return (
    <TouchableOpacity
      style={[styles.row, isBookmarked && styles.rowBookmarked]}
      onLongPress={() => onToggleBookmark(verseData)}
      activeOpacity={0.75}
    >
      {/* Numéro */}
      <View style={[styles.numBox, isBookmarked && styles.numBoxActive]}>
        <Text style={[styles.num, isBookmarked && styles.numActive]}>
          {verse.verse}
        </Text>
      </View>

      {/* Texte */}
      <View style={styles.textWrap}>
        {highlightParts ? (
          <Text style={styles.text}>
            {highlightParts.map((part, i) => (
              <Text key={i} style={part.highlight ? styles.highlight : undefined}>
                {part.text}
              </Text>
            ))}
          </Text>
        ) : (
          <Text style={styles.text}>{verse.text}</Text>
        )}
      </View>

      {/* Icône favori */}
      <TouchableOpacity
        onPress={() => onToggleBookmark(verseData)}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        style={styles.bookmarkBtn}
      >
        <Ionicons
          name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
          size={18}
          color={isBookmarked ? COLORS.accent : COLORS.textLight}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
});

export default VerseItem;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: SIZES.s4,
    paddingVertical: SIZES.s3,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
    backgroundColor: COLORS.surface,
  },
  rowBookmarked: {
    backgroundColor: COLORS.accentSurface,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.accent,
  },
  numBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: COLORS.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SIZES.s3,
    marginTop: 1,
    flexShrink: 0,
  },
  numBoxActive: {
    backgroundColor: COLORS.accent,
  },
  num: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
  numActive: {
    color: COLORS.white,
  },
  textWrap: {
    flex: 1,
  },
  text: {
    fontSize: SIZES.md,
    fontFamily: FONTS.serif,
    color: COLORS.textPrimary,
    lineHeight: 28,
    fontWeight: '400',
  },
  highlight: {
    backgroundColor: '#FDE047',
    borderRadius: 3,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  bookmarkBtn: {
    paddingLeft: SIZES.s3,
    paddingTop: 3,
  },
});
