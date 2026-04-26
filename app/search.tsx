// app/search.tsx
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
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
import SearchBar from '../components/SearchBar';
import { COLORS, FONTS, SHADOW, SIZES } from '../constants/theme';
import { useBible } from '../hooks/useBible';
import { SearchFilter, SearchResult, useSearch } from '../hooks/useSearch';
import { highlightText } from '../utils/helpers';

const FILTERS: { key: SearchFilter; label: string }[] = [
  { key: 'ALL', label: 'Tout' },
  { key: 'AT',  label: 'Ancien T.' },
  { key: 'NT',  label: 'Nouveau T.' },
];

export default function SearchScreen() {
  const router = useRouter();
  const { books } = useBible();
  const {
    query, setQuery,
    results, isSearching,
    filter, setFilter,
    clearSearch,
  } = useSearch(books);

  const goChapter = (item: SearchResult) => {
    router.push({
      pathname: '/chapter/[id]',
      params: { id: `${item.bookId}-${item.chapter}`, bookId: item.bookId, chapterNum: item.chapter },
    });
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Recherche</Text>
        <Text style={styles.sub}>Dans {books.length > 0 ? books.length : 66} livres</Text>
      </View>

      {/* SearchBar */}
      <View style={styles.searchWrap}>
        <SearchBar
          value={query}
          onChangeText={setQuery}
          onClear={clearSearch}
          placeholder="Rechercher dans la Bible…"
        />
      </View>

      {/* Filtres */}
      <View style={styles.filterRow}>
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f.key}
            style={[styles.filterBtn, filter === f.key && styles.filterBtnActive]}
            onPress={() => setFilter(f.key)}
          >
            <Text style={[styles.filterText, filter === f.key && styles.filterTextActive]}>
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
        {results.length > 0 && (
          <Text style={styles.resultCount}>
            {results.length}{results.length >= 150 ? '+' : ''} résultats
          </Text>
        )}
      </View>

      {/* Résultats */}
      {isSearching ? (
        <View style={styles.loadingWrap}>
          <LoadingSpinner size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Recherche en cours…</Text>
        </View>
      ) : query.length === 0 ? (
        <EmptyState
          icon="search-outline"
          title="Rechercher"
          subtitle="Saisissez un mot ou une phrase pour parcourir les 31 000 versets de la Bible."
        />
      ) : results.length === 0 ? (
        <EmptyState
          icon="document-outline"
          title="Aucun résultat"
          subtitle={`Aucun verset trouvé pour « ${query} »`}
        />
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item, i) =>
            `${item.bookId}-${item.chapter}-${item.verse}-${i}`
          }
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const parts = highlightText(item.text, query);
            return (
              <TouchableOpacity
                style={[styles.resultCard, SHADOW.soft]}
                onPress={() => goChapter(item)}
                activeOpacity={0.8}
              >
                <View style={styles.resultHeader}>
                  <View style={styles.refBadge}>
                    <Text style={styles.refText}>{item.reference}</Text>
                  </View>
                  <View style={[
                    styles.testamentDot,
                    { backgroundColor: item.testament === 'AT' ? COLORS.oldTestament : COLORS.newTestament }
                  ]} />
                </View>
                <Text style={styles.resultText}>
                  {parts.map((part, i) => (
                    <Text key={i} style={part.highlight ? styles.highlight : undefined}>
                      {part.text}
                    </Text>
                  ))}
                </Text>
                <View style={styles.resultFooter}>
                  <Text style={styles.resultFooterText}>
                    {item.testament === 'AT' ? 'Ancien Testament' : 'Nouveau Testament'}
                  </Text>
                  <Ionicons name="chevron-forward" size={14} color={COLORS.accent} />
                </View>
              </TouchableOpacity>
            );
          }}
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
  },
  sub: {
    fontSize: SIZES.sm,
    color: 'rgba(255,255,255,0.85)',
    marginTop: SIZES.s1,
  },

  searchWrap: {
    paddingHorizontal: SIZES.s4,
    paddingVertical: SIZES.s3,
    backgroundColor: COLORS.background,
  },

  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.s4,
    paddingVertical: SIZES.s3,
    gap: SIZES.s2,
    backgroundColor: COLORS.background,
  },
  filterBtn: {
    paddingHorizontal: SIZES.s3,
    paddingVertical: SIZES.s2,
    borderRadius: SIZES.radiusMd,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterBtnActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterText: { fontSize: SIZES.sm, color: COLORS.textMuted, fontWeight: '600' },
  filterTextActive: { color: COLORS.white },
  resultCount: {
    marginLeft: 'auto',
    fontSize: SIZES.xs,
    color: COLORS.textMuted,
    fontWeight: '600',
  },

  loadingWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: SIZES.s5,
  },
  loadingText: { fontSize: SIZES.md, color: COLORS.textMuted, fontWeight: '500' },

  list: { padding: SIZES.s4, gap: SIZES.s3 },

  resultCard: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusLg,
    padding: SIZES.s4,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SIZES.s3,
  },
  refBadge: {
    backgroundColor: COLORS.accentSurface,
    paddingHorizontal: SIZES.s2,
    paddingVertical: 4,
    borderRadius: SIZES.radiusSm,
  },
  refText: { fontSize: SIZES.xs, color: COLORS.accent, fontWeight: '700', textTransform: 'uppercase' },
  testamentDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  resultText: {
    fontSize: SIZES.md,
    color: COLORS.textPrimary,
    lineHeight: 24,
  },
  highlight: {
    backgroundColor: '#FCD34D',
    borderRadius: 2,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  resultFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: SIZES.s3,
    paddingTop: SIZES.s3,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  resultFooterText: { fontSize: SIZES.xs, color: COLORS.textMuted, fontWeight: '500' },
});
