import { useCallback, useEffect, useRef, useState } from 'react';
import { Book } from '../types/bible';

export interface SearchResult {
  bookId: number;
  bookName: string;
  testament: 'AT' | 'NT';
  chapter: number;
  verse: number;
  text: string;
  reference: string;
}

export type SearchFilter = 'ALL' | 'AT' | 'NT';

export function useSearch(books: Book[]) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [filter, setFilter] = useState<SearchFilter>('ALL');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      performSearch(query, filter);
    }, 350);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, filter, books]);

  const performSearch = useCallback(
    (searchQuery: string, currentFilter: SearchFilter) => {
      const normalized = searchQuery.toLowerCase().trim();
      const found: SearchResult[] = [];

      for (const book of books) {
        if (currentFilter === 'AT' && book.testament !== 'AT') continue;
        if (currentFilter === 'NT' && book.testament !== 'NT') continue;

        for (const chapter of book.chapters) {
          for (const verse of chapter.verses) {
            if (verse.text.toLowerCase().includes(normalized)) {
              found.push({
                bookId: book.id,
                bookName: book.name,
                testament: book.testament,
                chapter: chapter.chapter,
                verse: verse.verse,
                text: verse.text,
                reference: `${book.name} ${chapter.chapter}:${verse.verse}`,
              });
              if (found.length >= 150) break;
            }
          }
          if (found.length >= 150) break;
        }
        if (found.length >= 150) break;
      }

      setResults(found);
      setIsSearching(false);
    },
    [books]
  );

  const clearSearch = useCallback(() => {
    setQuery('');
    setResults([]);
    setFilter('ALL');
  }, []);

  return { query, setQuery, results, isSearching, filter, setFilter, clearSearch };
}
