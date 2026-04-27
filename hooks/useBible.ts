import { useCallback, useEffect, useState } from 'react';
import bibleJson from '../data/bible_fr.json';
import { DEMO_BIBLE, FALLBACK_DAILY_VERSES } from '../data/fallback';
import { Book, Chapter, DailyVerse } from '../types/bible';
import { getDayBasedIndex } from '../utils/helpers';

const rawBibleData = bibleJson;

function normalizeBible(raw: any): Book[] {
  if (!raw) return [];

  if (Array.isArray(raw) && raw[0]?.book_name && raw[0]?.chapter) {
    const grouped: Record<string, any> = {};

    raw.forEach((v: any) => {
      const bookName = v.book_name;

      if (!grouped[bookName]) {
        const testament: 'AT' | 'NT' = v.book <= 39 ? 'AT' : 'NT';

        grouped[bookName] = {
          id: Object.keys(grouped).length + 1,
          name: bookName,
          abbreviation: bookName.slice(0, 3).toUpperCase(),
          testament,
          chapters: {},
        };
      }

      if (!grouped[bookName].chapters[v.chapter]) {
        grouped[bookName].chapters[v.chapter] = [];
      }

      grouped[bookName].chapters[v.chapter].push({
        verse: v.verse,
        text: v.text || '',
      });
    });

    return Object.values(grouped).map((book: any) => ({
      ...book,
      chapters: Object.entries(book.chapters).map(([ch, verses]: any) => ({
        chapter: Number(ch),
        verses,
      })),
    }));
  }

  if (Array.isArray(raw)) {
    if (raw[0]?.chapters) {
      return raw.map((b: any, i: number) => {
        const testament: 'AT' | 'NT' = i < 39 ? 'AT' : 'NT';

        const chapters = (b.chapters || []).map((ch: any, chIndex: number) => {
          let versesArray: any[] = [];

          if (Array.isArray(ch)) {
            versesArray = ch;
          } else if (ch.verses && Array.isArray(ch.verses)) {
            versesArray = ch.verses;
          }

          const verses = versesArray.map((v: any, vIndex: number) => ({
            verse:
              typeof v === 'string'
                ? vIndex + 1
                : v.verse ?? v.v ?? vIndex + 1,
            text:
              typeof v === 'string'
                ? v
                : v.text ?? v.t ?? '',
          }));

          return {
            chapter: ch.chapter ?? chIndex + 1,
            verses,
          };
        });

        return {
          id: b.id ?? i + 1,
          name: b.name,
          abbreviation:
            b.abbrev ||
            b.abbreviation ||
            b.name?.slice(0, 3).toUpperCase(),
          testament,
          category:
            i < 39 ? getCategoryAT(i) : getCategoryNT(i - 39),
          chapters,
        };
      });
    }

    return raw.map((b: any, i: number) => {
      const testament: 'AT' | 'NT' = i < 39 ? 'AT' : 'NT';

      return {
        id: i + 1,
        name: b.name || `Livre ${i + 1}`,
        abbreviation: b.abbrev || b.name?.slice(0, 3).toUpperCase(),
        testament,
        category:
          i < 39 ? getCategoryAT(i) : getCategoryNT(i - 39),
        chapters: b.chapters || [],
      };
    });
  }

  return [];
}

function getCategoryAT(i: number): string {
  if (i < 5) return 'Pentateuque';
  if (i < 17) return 'Livres historiques';
  if (i < 22) return 'Livres poétiques';
  if (i < 27) return 'Prophètes majeurs';
  return 'Prophètes mineurs';
}

function getCategoryNT(i: number): string {
  if (i < 4) return 'Évangiles';
  if (i < 5) return 'Histoire';
  if (i < 18) return 'Épîtres de Paul';
  if (i < 25) return 'Épîtres générales';
  return 'Prophétie';
}

export function useBible() {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [usingDemo, setUsingDemo] = useState(false);

  useEffect(() => {
    try {
      const normalized = normalizeBible(rawBibleData);

      if (normalized.length > 0) {
        setBooks(normalized);
        setUsingDemo(false);
      } else {
        setBooks(DEMO_BIBLE);
        setUsingDemo(true);
      }
    } catch {
      setBooks(DEMO_BIBLE);
      setUsingDemo(true);
    }

    setIsLoaded(true);
  }, []);

  const getBook = useCallback(
    (bookId: number | string): Book | null => {
      return books.find((b) => b.id === parseInt(String(bookId))) ?? null;
    },
    [books]
  );

  const getChapter = useCallback(
    (bookId: number | string, chapterNum: number | string): Chapter | null => {
      const book = getBook(bookId);
      if (!book) return null;

      return (
        book.chapters.find(
          (c) => c.chapter === parseInt(String(chapterNum))
        ) ?? null
      );
    },
    [getBook]
  );

  const getBooksByTestament = useCallback(
    (testament: 'AT' | 'NT'): Book[] => {
      return books.filter((b) => b.testament === testament);
    },
    [books]
  );

  const getDailyVerse = useCallback((): DailyVerse | null => {
    if (books.length > 0 && !usingDemo) {
      try {
        const book = books[getDayBasedIndex(books.length)];
        if (!book?.chapters?.length) return FALLBACK_DAILY_VERSES[0];

        const chapter =
          book.chapters[getDayBasedIndex(book.chapters.length)];
        if (!chapter?.verses?.length) return FALLBACK_DAILY_VERSES[0];

        const verse =
          chapter.verses[getDayBasedIndex(chapter.verses.length)];

        return {
          book: book.name,
          bookId: book.id,
          chapter: chapter.chapter,
          verse: verse.verse,
          text: verse.text || '',
          reference: `${book.name} ${chapter.chapter}:${verse.verse}`,
        };
      } catch {
        return FALLBACK_DAILY_VERSES[0];
      }
    }

    return FALLBACK_DAILY_VERSES[
      getDayBasedIndex(FALLBACK_DAILY_VERSES.length)
    ];
  }, [books, usingDemo]);

  return {
    books,
    isLoaded,
    usingDemo,
    getBook,
    getChapter,
    getBooksByTestament,
    getDailyVerse,
  };
}