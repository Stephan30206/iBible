// app/search.tsx
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import EmptyState from '../components/EmptyState';
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
          <ActivityIndicator color={COLORS.accent} size="large" />
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
    backgroundColor: COLORS.surface,
    paddingHorizontal: SIZES.s4,
    paddingTop: SIZES.s5,
    paddingBottom: SIZES.s2,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: SIZES.s3,
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
  },

  searchWrap: {
    paddingHorizontal: SIZES.s4,
    paddingVertical: SIZES.s3,
    backgroundColor: COLORS.surface,
  },

  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.s4,
    paddingBottom: SIZES.s3,
    gap: SIZES.s2,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  filterBtn: {
    paddingHorizontal: SIZES.s3,
    paddingVertical: SIZES.s1 + 1,
    borderRadius: SIZES.radiusFull,
    backgroundColor: COLORS.surfaceAlt,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterBtnActive: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
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
    gap: SIZES.s3,
  },
  loadingText: { fontSize: SIZES.md, color: COLORS.textMuted },

  list: { padding: SIZES.s4, gap: SIZES.s3 },

  resultCard: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    padding: SIZES.s4,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SIZES.s2,
  },
  refBadge: {
    backgroundColor: COLORS.accentSurface,
    paddingHorizontal: SIZES.s2,
    paddingVertical: 3,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.accentBorder,
  },
  refText: { fontSize: SIZES.xs, color: COLORS.accent, fontWeight: '800' },
  testamentDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  resultText: {
    fontSize: SIZES.md,
    fontFamily: FONTS.serif,
    color: COLORS.textPrimary,
    lineHeight: 24,
  },
  highlight: {
    backgroundColor: '#F5D776',
    borderRadius: 3,
    color: COLORS.textPrimary,
  },
  resultFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: SIZES.s2,
    paddingTop: SIZES.s2,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  resultFooterText: { fontSize: SIZES.xs, color: COLORS.textMuted },
});
