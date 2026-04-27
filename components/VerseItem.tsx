import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Alert, Modal, Share, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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
  highlightColor?: string | null;
  onSetHighlight?: (color: string) => void;
  onRemoveHighlight?: () => void;
}

const HIGHLIGHT_COLORS = [
  { name: 'Jaune', color: '#FDE047' },
  { name: 'Rose', color: '#F472B6' },
  { name: 'Bleu', color: '#60A5FA' },
  { name: 'Vert', color: '#86EFAC' },
];

const VerseItem = React.memo(function VerseItem({
  verse,
  bookId,
  chapter,
  bookName,
  isBookmarked,
  onToggleBookmark,
  highlightParts,
  highlightColor,
  onSetHighlight,
  onRemoveHighlight,
}: Props) {
  const [showMenu, setShowMenu] = useState(false);

  const verseData: Omit<Bookmark, 'savedAt'> = {
    bookId,
    chapter,
    verse: verse.verse,
    text: verse.text,
    bookName,
    reference: `${bookName} ${chapter}:${verse.verse}`,
  };

  const handleVersePress = () => {
    setShowMenu(true);
  };

  const handleHighlight = (colorName: string, colorValue: string) => {
    onSetHighlight?.(colorValue);
    setShowMenu(false);
  };

  const handleRemoveHighlight = () => {
    onRemoveHighlight?.();
    setShowMenu(false);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `"${verse.text}"\n\n— ${bookName} ${chapter}:${verse.verse}`,
        title: 'Partager le verset',
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
    setShowMenu(false);
  };

  return (
    <>
      <TouchableOpacity
        style={[
          styles.row,
          isBookmarked && styles.rowBookmarked,
          highlightColor && { backgroundColor: highlightColor + '20' },
        ]}
        onPress={handleVersePress}
        activeOpacity={0.75}
      >
        <View style={[styles.numBox, isBookmarked && styles.numBoxActive]}>
          <Text style={[styles.num, isBookmarked && styles.numActive]}>
            {verse.verse}
          </Text>
        </View>

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

      <Modal
        visible={showMenu}
        transparent
        animationType="fade"
        onRequestClose={() => setShowMenu(false)}
      >
        <TouchableOpacity
          style={styles.menuOverlay}
          activeOpacity={1}
          onPress={() => setShowMenu(false)}
        >
          <View style={styles.menuContent}>
            <Text style={styles.menuTitle}>Options du verset</Text>

            <View style={styles.highlightSection}>
              <Text style={styles.sectionLabel}>Couleur de surligneur</Text>
              <View style={styles.colorGrid}>
                {HIGHLIGHT_COLORS.map((hc) => (
                  <TouchableOpacity
                    key={hc.name}
                    style={[
                      styles.colorBtn,
                      { backgroundColor: hc.color },
                      highlightColor === hc.color && styles.colorBtnActive,
                    ]}
                    onPress={() => handleHighlight(hc.name, hc.color)}
                  >
                    <Text style={styles.colorBtnText}>{hc.name}</Text>
                    {highlightColor === hc.color && (
                      <Ionicons name="checkmark-circle" size={18} color="white" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
              {highlightColor && (
                <TouchableOpacity
                  style={styles.removeHighlightBtn}
                  onPress={handleRemoveHighlight}
                >
                  <Ionicons name="close-circle-outline" size={16} color={COLORS.textLight} />
                  <Text style={styles.removeHighlightText}>Retirer le surligneur</Text>
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.actionSection}>
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => {
                  onToggleBookmark(verseData);
                  setShowMenu(false);
                }}
              >
                <Ionicons
                  name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
                  size={20}
                  color={COLORS.accent}
                />
                <Text style={styles.actionBtnText}>
                  {isBookmarked ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionBtn}
                onPress={handleShare}
              >
                <Ionicons name="share-social-outline" size={20} color={COLORS.primary} />
                <Text style={styles.actionBtnText}>Partager</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setShowMenu(false)}
            >
              <Text style={styles.closeBtnText}>Fermer</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
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

  menuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  menuContent: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: SIZES.radiusLg,
    borderTopRightRadius: SIZES.radiusLg,
    padding: SIZES.s4,
    paddingBottom: SIZES.s5,
  },
  menuTitle: {
    fontSize: SIZES.lg,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SIZES.s3,
  },
  highlightSection: {
    marginBottom: SIZES.s4,
  },
  sectionLabel: {
    fontSize: SIZES.sm,
    fontWeight: '600',
    color: COLORS.textMuted,
    marginBottom: SIZES.s2,
    textTransform: 'uppercase',
  },
  colorGrid: {
    flexDirection: 'row',
    gap: SIZES.s2,
    flexWrap: 'wrap',
  },
  colorBtn: {
    flex: 1,
    minWidth: '48%',
    paddingVertical: SIZES.s3,
    borderRadius: SIZES.radiusMd,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorBtnActive: {
    borderColor: COLORS.textPrimary,
  },
  colorBtnText: {
    fontSize: SIZES.sm,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  removeHighlightBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SIZES.s2,
    paddingHorizontal: SIZES.s2,
    marginTop: SIZES.s2,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    gap: SIZES.s2,
  },
  removeHighlightText: {
    fontSize: SIZES.sm,
    fontWeight: '500',
    color: COLORS.textMuted,
  },
  actionSection: {
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    paddingTop: SIZES.s3,
    marginBottom: SIZES.s3,
    gap: SIZES.s2,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SIZES.s3,
    paddingHorizontal: SIZES.s2,
    borderRadius: SIZES.radiusMd,
    backgroundColor: COLORS.surfaceAlt,
    gap: SIZES.s2,
  },
  actionBtnText: {
    fontSize: SIZES.md,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  closeBtn: {
    paddingVertical: SIZES.s3,
    alignItems: 'center',
    borderRadius: SIZES.radiusMd,
    backgroundColor: COLORS.primary,
  },
  closeBtnText: {
    fontSize: SIZES.md,
    fontWeight: '700',
    color: COLORS.white,
  },
});
