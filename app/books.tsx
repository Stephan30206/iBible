// app/books.tsx
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import EmptyState from '../components/EmptyState';
import LoadingSpinner from '../components/LoadingSpinner';
import { COLORS, FONTS, SHADOW, SIZES } from '../constants/theme';
import { useBible } from '../hooks/useBible';
import { Book } from '../types/bible';

export default function BooksScreen() {
  const { books, isLoaded } = useBible();
  const params = useLocalSearchParams<{ testament?: string }>();
  const [tab, setTab] = useState<'AT' | 'NT'>(
    params.testament === 'NT' ? 'NT' : 'AT'
  );
  const router = useRouter();

  const filtered = books.filter((b) => b.testament === tab);

  const renderBook = ({ item, index }: { item: Book; index: number }) => {
    const isAT = item.testament === 'AT';
    return (
      <TouchableOpacity
        style={[styles.card, SHADOW.soft]}
        onPress={() => router.push({ pathname: '/books/[id]', params: { id: item.id } })}
        activeOpacity={0.8}
      >
        <View
          style={[
            styles.badge,
            {
              backgroundColor: isAT ? COLORS.oldTestamentBg : COLORS.newTestamentBg,
              borderColor: isAT ? COLORS.oldTestamentBorder : COLORS.newTestamentBorder,
            },
          ]}
        >
          <Text
            style={[
              styles.badgeText,
              { color: isAT ? COLORS.oldTestament : COLORS.newTestament },
            ]}
          >
            {String(index + 1).padStart(2, '0')}
          </Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.bookName}>{item.name}</Text>
          <Text style={styles.bookMeta}>
            {item.abbreviation} · {item.chapters?.length ?? '?'} chapitres
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={COLORS.accent} />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Livres</Text>
        <View style={styles.tabRow}>
          {(['AT', 'NT'] as const).map((t) => (
            <TouchableOpacity
              key={t}
              style={[styles.tabBtn, tab === t && styles.tabBtnActive]}
              onPress={() => setTab(t)}
            >
              <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>
                {t === 'AT' ? 'Ancien Testament' : 'Nouveau Testament'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {!isLoaded ? (
        <View style={styles.center}>
          <LoadingSpinner size="large" color={COLORS.primary} />
          <Text style={styles.loadText}>Chargement des livres…</Text>
        </View>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon="library-outline"
          title="Aucun livre"
          subtitle="Ajoutez bible_fr.json dans le dossier data/ pour accéder à tous les livres."
        />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id?.toString() ?? item.name}
          renderItem={renderBook}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <Text style={styles.listHeader}>
              {filtered.length} livre{filtered.length > 1 ? 's' : ''}
            </Text>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },

  header: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SIZES.s4,
    paddingTop: SIZES.s5,
    paddingBottom: SIZES.s4,
  },
  title: {
    fontSize: SIZES.xxl,
    color: COLORS.white,
    fontWeight: '700',
    marginBottom: SIZES.s4,
  },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: SIZES.radiusMd,
    padding: 4,
    gap: SIZES.s1,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: SIZES.s2,
    borderRadius: SIZES.radiusSm,
    alignItems: 'center',
  },
  tabBtnActive: { backgroundColor: COLORS.white },
  tabText: { fontSize: SIZES.sm, color: 'rgba(255,255,255,0.7)', fontWeight: '600' },
  tabTextActive: { color: COLORS.primary },

  list: { padding: SIZES.s4, gap: SIZES.s3 },
  listHeader: {
    fontSize: SIZES.xs,
    color: COLORS.textMuted,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: SIZES.s3,
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusLg,
    padding: SIZES.s3,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: SIZES.s3,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  badge: {
    width: 48,
    height: 48,
    borderRadius: SIZES.radiusMd,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0,
  },
  badgeText: { fontSize: SIZES.sm, fontWeight: '700' },
  info: { flex: 1 },
  bookName: {
    fontSize: SIZES.md,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  bookMeta: { fontSize: SIZES.xs, color: COLORS.textMuted, marginTop: 3, fontWeight: '400' },

  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: SIZES.s5 },
  loadText: { fontSize: SIZES.md, color: COLORS.textMuted, fontWeight: '500', marginTop: SIZES.s3 },
});
