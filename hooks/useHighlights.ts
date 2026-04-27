import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';
import { Highlight } from '../types/bible';

const HIGHLIGHTS_KEY = '@ibible:highlights';

export function useHighlights() {
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await AsyncStorage.getItem(HIGHLIGHTS_KEY);
        if (data) {
          setHighlights(JSON.parse(data));
        }
      } catch (e) {
        console.error('Erreur chargement surlignages:', e);
      } finally {
        setIsLoaded(true);
      }
    })();
  }, []);

  const getHighlightColor = useCallback(
    (bookId: number, chapter: number, verse: number): string | null => {
      const highlight = highlights.find(
        (h) => h.bookId === bookId && h.chapter === chapter && h.verse === verse
      );
      return highlight?.color ?? null;
    },
    [highlights]
  );

  const setHighlight = useCallback(
    async (bookId: number, chapter: number, verse: number, color: string) => {
      const existing = highlights.find(
        (h) => h.bookId === bookId && h.chapter === chapter && h.verse === verse
      );

      let updated: Highlight[];
      if (existing) {
        updated = highlights.map((h) =>
          h.bookId === bookId && h.chapter === chapter && h.verse === verse
            ? { ...h, color }
            : h
        );
      } else {
        updated = [...highlights, { bookId, chapter, verse, color }];
      }

      setHighlights(updated);
      await AsyncStorage.setItem(HIGHLIGHTS_KEY, JSON.stringify(updated));
    },
    [highlights]
  );

  const removeHighlight = useCallback(
    async (bookId: number, chapter: number, verse: number) => {
      const updated = highlights.filter(
        (h) => !(h.bookId === bookId && h.chapter === chapter && h.verse === verse)
      );
      setHighlights(updated);
      await AsyncStorage.setItem(HIGHLIGHTS_KEY, JSON.stringify(updated));
    },
    [highlights]
  );

  return {
    highlights,
    isLoaded,
    getHighlightColor,
    setHighlight,
    removeHighlight,
  };
}
