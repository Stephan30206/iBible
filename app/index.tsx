// app/index.tsx
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DemoNotice from '../components/DemoNotice';
import { COLORS, FONTS, SHADOW, SIZES } from '../constants/theme';
import { useBible } from '../hooks/useBible';
import { useBookmarks } from '../hooks/useBookmarks';

interface QuickLink {
  bookId: number;
  chapter: number;
  label: string;
  sub: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const QUICK_LINKS: QuickLink[] = [
  { bookId: 1,  chapter: 1,  label: 'Genèse 1',    sub: 'La Création',     icon: 'earth-outline' },
  { bookId: 19, chapter: 23, label: 'Psaumes 23',  sub: 'Mon Berger',      icon: 'leaf-outline' },
  { bookId: 40, chapter: 5,  label: 'Matthieu 5',  sub: 'Les Béatitudes',  icon: 'sunny-outline' },
  { bookId: 43, chapter: 3,  label: 'Jean 3',      sub: 'La Nouvelle Naissance', icon: 'heart-outline' },
];

export default function HomeScreen() {
  const router = useRouter();
  const { isLoaded, getDailyVerse, books, usingDemo } = useBible();
  const { bookmarks, lastPosition } = useBookmarks();

  const dailyVerse = useMemo(() => {
    if (!isLoaded) return null;
    return getDailyVerse();
  }, [isLoaded, getDailyVerse]);

  const goChapter = (bookId: number, chapterNum: number) => {
    router.push({
      pathname: '/chapter/[id]',
      params: { id: `${bookId}-${chapterNum}`, bookId, chapterNum },
    });
  };

  const atCount = books.filter((b) => b.testament === 'AT').length || 39;
  const ntCount = books.filter((b) => b.testament === 'NT').length || 27;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      {/* ── Header ── */}
      <View style={styles.header}>
        <View>
          <Text style={styles.appName}>iBible</Text>
          <Text style={styles.appSub}>La Parole de Dieu</Text>
        </View>
        <TouchableOpacity
          style={styles.bookmarkBadge}
          onPress={() => router.push('/bookmarks')}
        >
          <Ionicons name="heart" size={16} color={COLORS.accent} />
          <Text style={styles.bookmarkBadgeText}>{bookmarks.length}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {usingDemo && <DemoNotice />}

        {/* ── Verset du jour ── */}
        <View style={[styles.verseCard, SHADOW.strong]}>
          <View style={styles.verseCardHeader}>
            <View style={styles.verseCardTagRow}>
              <Ionicons name="sunny" size={14} color="rgba(255,255,255,0.85)" />
              <Text style={styles.verseCardTag}>Verset du jour</Text>
            </View>
            {isLoaded && !usingDemo && (
              <Text style={styles.verseCardCount}>{books.length} livres</Text>
            )}
          </View>

          {!isLoaded ? (
            <ActivityIndicator color={COLORS.white} style={{ marginVertical: 24 }} />
          ) : dailyVerse ? (
            <TouchableOpacity
              onPress={() => goChapter(dailyVerse.bookId, dailyVerse.chapter)}
              activeOpacity={0.85}
            >
              <Text style={styles.verseText}>« {dailyVerse.text} »</Text>
              <View style={styles.verseFooter}>
                <Text style={styles.verseRef}>{dailyVerse.reference}</Text>
                <View style={styles.readBtn}>
                  <Text style={styles.readBtnText}>Lire</Text>
                  <Ionicons name="arrow-forward" size={13} color={COLORS.accent} />
                </View>
              </View>
            </TouchableOpacity>
          ) : null}
        </View>

        {/* ── Continuer la lecture ── */}
        {lastPosition && (
          <TouchableOpacity
            style={[styles.continueCard, SHADOW.soft]}
            onPress={() => goChapter(lastPosition.bookId, lastPosition.chapter)}
            activeOpacity={0.8}
          >
            <View style={styles.continueIcon}>
              <Ionicons name="play" size={20} color={COLORS.accent} />
            </View>
            <View style={styles.continueInfo}>
              <Text style={styles.continueLabel}>Continuer la lecture</Text>
              <Text style={styles.continueRef}>
                {lastPosition.bookName} — Chapitre {lastPosition.chapter}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.accent} />
          </TouchableOpacity>
        )}

        {/* ── Testaments ── */}
        <Text style={styles.sectionTitle}>PARCOURIR</Text>
        <View style={styles.testamentRow}>
          <TouchableOpacity
            style={[
              styles.testamentCard,
              { backgroundColor: COLORS.oldTestamentBg, borderColor: COLORS.oldTestamentBorder },
              SHADOW.soft,
            ]}
            onPress={() => router.push({ pathname: '/books', params: { testament: 'AT' } })}
            activeOpacity={0.8}
          >
            <Ionicons name="document-text-outline" size={30} color={COLORS.oldTestament} />
            <Text style={[styles.testamentTitle, { color: COLORS.oldTestament }]}>Ancien</Text>
            <Text style={[styles.testamentSub, { color: COLORS.oldTestament }]}>Testament</Text>
            <Text style={[styles.testamentCount, { color: COLORS.oldTestament }]}>
              {atCount} livres
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.testamentCard,
              { backgroundColor: COLORS.newTestamentBg, borderColor: COLORS.newTestamentBorder },
              SHADOW.soft,
            ]}
            onPress={() => router.push({ pathname: '/books', params: { testament: 'NT' } })}
            activeOpacity={0.8}
          >
            <Ionicons name="star-outline" size={30} color={COLORS.newTestament} />
            <Text style={[styles.testamentTitle, { color: COLORS.newTestament }]}>Nouveau</Text>
            <Text style={[styles.testamentSub, { color: COLORS.newTestament }]}>Testament</Text>
            <Text style={[styles.testamentCount, { color: COLORS.newTestament }]}>
              {ntCount} livres
            </Text>
          </TouchableOpacity>
        </View>

        {/* ── Lectures rapides ── */}
        <Text style={styles.sectionTitle}>COMMENCER PAR</Text>
        <View style={styles.quickGrid}>
          {QUICK_LINKS.map((item, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.quickCard, SHADOW.soft]}
              onPress={() => goChapter(item.bookId, item.chapter)}
              activeOpacity={0.8}
            >
              <View style={styles.quickIcon}>
                <Ionicons name={item.icon} size={22} color={COLORS.accent} />
              </View>
              <Text style={styles.quickLabel} numberOfLines={1}>{item.label}</Text>
              <Text style={styles.quickSub} numberOfLines={1}>{item.sub}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Stats ── */}
        <View style={[styles.statsCard, SHADOW.soft]}>
          {[
            { val: bookmarks.length.toString(), label: 'Favoris', icon: 'heart' as const },
            { val: books.length > 0 ? books.length.toString() : '66', label: 'Livres', icon: 'library' as const },
            { val: '31K+', label: 'Versets', icon: 'text' as const },
          ].map((stat, i) => (
            <React.Fragment key={i}>
              {i > 0 && <View style={styles.statDivider} />}
              <View style={styles.stat}>
                <Ionicons name={stat.icon} size={16} color={COLORS.accent} style={{ marginBottom: 4 }} />
                <Text style={styles.statVal}>{stat.val}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            </React.Fragment>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  scroll: { flex: 1 },
  content: { paddingBottom: 32 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.s4,
    paddingVertical: SIZES.s5,
    backgroundColor: COLORS.primary,
    borderBottomWidth: 0,
  },
  appName: {
    fontSize: 28,
    color: COLORS.white,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  appSub: {
    fontSize: SIZES.xs,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 4,
    letterSpacing: 0.5,
    fontWeight: '400',
  },
  bookmarkBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: SIZES.s3,
    paddingVertical: SIZES.s2,
    borderRadius: SIZES.radiusLg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  bookmarkBadgeText: {
    fontSize: SIZES.sm,
    fontWeight: '700',
    color: COLORS.white,
  },

  verseCard: {
    margin: SIZES.s4,
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radiusXl,
    padding: SIZES.s5,
    overflow: 'hidden',
  },
  verseCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.s4,
  },
  verseCardTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  verseCardTag: {
    fontSize: SIZES.xs,
    color: COLORS.white,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  verseCardCount: {
    fontSize: SIZES.xs,
    color: 'rgba(255,255,255,0.85)',
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: SIZES.radiusFull,
    fontWeight: '600',
  },
  verseText: {
    fontSize: SIZES.lg,
    color: COLORS.white,
    lineHeight: 28,
    fontStyle: 'italic',
    marginBottom: SIZES.s4,
    fontWeight: '400',
  },
  verseFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  verseRef: {
    fontSize: SIZES.xs,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  readBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.accent,
    paddingHorizontal: SIZES.s3,
    paddingVertical: SIZES.s2,
    borderRadius: SIZES.radiusMd,
  },
  readBtnText: {
    fontSize: SIZES.xs,
    color: COLORS.primary,
    fontWeight: '700',
    textTransform: 'uppercase',
  },

  continueCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    marginHorizontal: SIZES.s4,
    marginBottom: SIZES.s4,
    padding: SIZES.s4,
    borderRadius: SIZES.radiusLg,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: SIZES.s3,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  continueIcon: {
    width: 48,
    height: 48,
    backgroundColor: COLORS.accentSurface,
    borderRadius: SIZES.radiusMd,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueInfo: { flex: 1 },
  continueLabel: {
    fontSize: SIZES.xs,
    color: COLORS.textMuted,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  continueRef: {
    fontSize: SIZES.md,
    color: COLORS.textPrimary,
    fontWeight: '700',
    marginTop: 4,
  },

  sectionTitle: {
    fontSize: SIZES.xs,
    color: COLORS.primary,
    fontWeight: '700',
    letterSpacing: 1,
    marginHorizontal: SIZES.s4,
    marginBottom: SIZES.s3,
    marginTop: SIZES.s6,
    textTransform: 'uppercase',
  },

  testamentRow: {
    flexDirection: 'row',
    marginHorizontal: SIZES.s4,
    gap: SIZES.s3,
    marginBottom: SIZES.s5,
  },
  testamentCard: {
    flex: 1,
    borderRadius: SIZES.radiusLg,
    padding: SIZES.s4,
    borderWidth: 1,
    alignItems: 'center',
    gap: 8,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  testamentTitle: {
    fontSize: SIZES.md,
    fontWeight: '700',
    marginTop: SIZES.s2,
  },
  testamentSub: { fontSize: SIZES.sm, opacity: 0.85, fontWeight: '600' },
  testamentCount: { fontSize: SIZES.xs, fontWeight: '600', opacity: 0.75, marginTop: SIZES.s1 },

  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: SIZES.s4,
    gap: SIZES.s3,
    marginBottom: SIZES.s5,
  },
  quickCard: {
    width: '47.5%',
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusMd,
    padding: SIZES.s4,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  quickIcon: {
    width: 40,
    height: 40,
    borderRadius: SIZES.radiusMd,
    backgroundColor: COLORS.accentSurface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SIZES.s2,
  },
  quickLabel: {
    fontSize: SIZES.sm,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  quickSub: {
    fontSize: SIZES.xs,
    color: COLORS.textMuted,
    marginTop: 4,
  },

  statsCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    marginHorizontal: SIZES.s4,
    borderRadius: SIZES.radiusLg,
    padding: SIZES.s5,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  stat: { flex: 1, alignItems: 'center' },
  statVal: { fontSize: SIZES.xl, fontWeight: '700', color: COLORS.primary },
  statLabel: { fontSize: SIZES.xs, color: COLORS.textMuted, marginTop: 4, fontWeight: '500' },
  statDivider: { width: 1, backgroundColor: COLORS.border, marginVertical: SIZES.s2 },
});
