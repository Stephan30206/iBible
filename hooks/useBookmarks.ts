// hooks/useBookmarks.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';
import { Bookmark, LastPosition } from '../types/bible';

const KEYS = {
  bookmarks: '@ibible:bookmarks',
  lastPosition: '@ibible:last_position',
} as const;

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [lastPosition, setLastPositionState] = useState<LastPosition | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [bm, pos] = await Promise.all([
          AsyncStorage.getItem(KEYS.bookmarks),
          AsyncStorage.getItem(KEYS.lastPosition),
        ]);
        if (bm) setBookmarks(JSON.parse(bm));
        if (pos) setLastPositionState(JSON.parse(pos));
      } catch (e) {
        console.error('Erreur chargement:', e);
      } finally {
        setIsLoaded(true);
      }
    })();
  }, []);

  const isBookmarked = useCallback(
    (bookId: number, chapter: number, verse: number): boolean => {
      return bookmarks.some(
        (b) => b.bookId === bookId && b.chapter === chapter && b.verse === verse
      );
    },
    [bookmarks]
  );

  const toggleBookmark = useCallback(
    async (verseData: Omit<Bookmark, 'savedAt'>) => {
      const { bookId, chapter, verse } = verseData;
      let updated: Bookmark[];

      if (isBookmarked(bookId, chapter, verse)) {
        updated = bookmarks.filter(
          (b) => !(b.bookId === bookId && b.chapter === chapter && b.verse === verse)
        );
      } else {
        const newBm: Bookmark = { ...verseData, savedAt: new Date().toISOString() };
        updated = [newBm, ...bookmarks];
      }

      setBookmarks(updated);
      await AsyncStorage.setItem(KEYS.bookmarks, JSON.stringify(updated));
    },
    [bookmarks, isBookmarked]
  );

  const saveLastPosition = useCallback(async (position: LastPosition) => {
    setLastPositionState(position);
    await AsyncStorage.setItem(KEYS.lastPosition, JSON.stringify(position));
  }, []);

  const removeBookmark = useCallback(
    async (bookId: number, chapter: number, verse: number) => {
      const updated = bookmarks.filter(
        (b) => !(b.bookId === bookId && b.chapter === chapter && b.verse === verse)
      );
      setBookmarks(updated);
      await AsyncStorage.setItem(KEYS.bookmarks, JSON.stringify(updated));
    },
    [bookmarks]
  );

  return {
    bookmarks,
    lastPosition,
    isLoaded,
    isBookmarked,
    toggleBookmark,
    saveLastPosition,
    removeBookmark,
  };
}
