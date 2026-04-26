// hooks/useBible.ts
import { useCallback, useEffect, useState } from 'react';
import { DEMO_BIBLE, FALLBACK_DAILY_VERSES } from '../data/fallback';
import { Book, Chapter, DailyVerse } from '../types/bible';
import { getDayBasedIndex } from '../utils/helpers';

// 📦 IMPORT PROPRE (IMPORTANT pour Expo)
import bibleJson from '../data/bible_fr.json';

let rawBibleData = bibleJson;

/* =========================
   NORMALISATION BIBLE
========================= */
function normalizeBible(raw: any): Book[] {
  if (!raw) {
    console.warn('❌ Bible data is null or undefined');
    return [];
  }

  console.log('📦 Raw Bible data type:', typeof raw);
  console.log('📦 Is array?', Array.isArray(raw));

  if (Array.isArray(raw)) {
    console.log('📦 Array length:', raw.length);
    if (raw.length > 0) {
      console.log('📦 First item keys:', Object.keys(raw[0]).slice(0, 5));
    }
  }

  // 📌 CAS 1 : format versets plats (TON JSON ACTUEL)
  if (Array.isArray(raw) && raw[0]?.book_name && raw[0]?.chapter) {
    console.log('✅ Detected flat verses format');
    const grouped: Record<string, any> = {};

    raw.forEach((v: any) => {
      const bookName = v.book_name;

      if (!grouped[bookName]) {
        grouped[bookName] = {
          id: Object.keys(grouped).length + 1,
          name: bookName,
          abbreviation: bookName.slice(0, 3).toUpperCase(),
          testament: v.book <= 39 ? 'AT' : 'NT',
          chapters: {},
        };
      }

      if (!grouped[bookName].chapters[v.chapter]) {
        grouped[bookName].chapters[v.chapter] = [];
      }

      grouped[bookName].chapters[v.chapter].push({
        verse: v.verse,
        text: v.text,
      });
    });

    const books = Object.values(grouped).map((book: any) => ({
      ...book,
      chapters: Object.entries(book.chapters).map(([ch, verses]: any) => ({
        chapter: Number(ch),
        verses,
      })),
    }));

    console.log(`✅ Parsed ${books.length} books from flat format`);
    return books;
  }

  // 📌 CAS 2 : format déjà structuré
  if (Array.isArray(raw)) {
    if (raw[0]?.chapters) {
      console.log('✅ Detected structured format');
      const books = raw.map((b: any, i: number) => {
        // Chapters are directly arrays of strings, not objects!
        const chapters = (b.chapters || []).map((ch: any, chIndex: number) => {
          // ch is either an array of strings (verses) or an object
          let versesArray: any[] = [];

          if (Array.isArray(ch)) {
            // Direct array format: ['Verse 1 text', 'Verse 2 text', ...]
            versesArray = ch;
          } else if (ch.verses && Array.isArray(ch.verses)) {
            // Object with verses property
            versesArray = ch.verses;
          }

          const mappedVerses = versesArray.map((v: any, vIndex: number) => {
            // If v is a string, it's the verse text
            // If v is an object, use v.text or v.t
            const text = typeof v === 'string' ? v : (v.text ?? v.t ?? '');
            const verseNum = typeof v === 'string' ? vIndex + 1 : (v.verse ?? v.v ?? vIndex + 1);

            return {
              verse: verseNum,
              text,
            };
          });

          return {
            chapter: ch.chapter ?? chIndex + 1,
            verses: mappedVerses,
          };
        });

        if (i === 0) {
          // Log Genesis as example
          console.log('📚 Sample book structure (Genesis):', {
            name: b.name,
            chaptersCount: chapters.length,
            firstChapterVersesCount: chapters[0]?.verses?.length,
            firstVerse: chapters[0]?.verses?.[0],
          });
        }

        return {
          id: b.id ?? i + 1,
          name: b.name,
          abbreviation: b.abbrev || b.abbreviation || b.name?.slice(0, 3).toUpperCase(),
          testament: i < 39 ? 'AT' : 'NT',
          category: i < 39 ? getCategoryAT(i) : getCategoryNT(i - 39),
          chapters,
        };
      });

      return books;
    }

    console.log('✅ Converting raw array to book format');
    return raw.map((b: any, i: number) => ({
      id: i + 1,
      name: b.name || `Livre ${i + 1}`,
      abbreviation: b.abbrev || b.name?.slice(0, 3).toUpperCase(),
      testament: i < 39 ? 'AT' : 'NT',
      category: i < 39 ? getCategoryAT(i) : getCategoryNT(i - 39),
      chapters: b.chapters || [],
    }));
  }

  console.error('❌ Could not parse Bible data - unknown format');
  return [];
}

/* =========================
   CATEGORIES
========================= */
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

/* =========================
   HOOK PRINCIPAL
========================= */
export function useBible() {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [usingDemo, setUsingDemo] = useState(false);

  useEffect(() => {
    const loadBible = async () => {
      try {
        // Force reload by re-importing
        const normalized = normalizeBible(rawBibleData);

        if (normalized.length > 0) {
          setBooks(normalized);
          setUsingDemo(false);
          console.log(`✅ Bible chargée avec succès : ${normalized.length} livres`);
          console.log('📚 Livres:', normalized.map(b => `${b.name} (${b.chapters.length} ch.)`).join(', '));
        } else {
          console.error('❌ Pas de livres trouvés, utilisation des données de démonstration');
          setBooks(DEMO_BIBLE);
          setUsingDemo(true);
          console.warn('⚠️ Utilisation des données de démonstration');
        }
      } catch (error) {
        console.error('❌ Erreur lors du chargement de la Bible:', error);
        setBooks(DEMO_BIBLE);
        setUsingDemo(true);
      }

      setIsLoaded(true);
    };

    loadBible();
  }, []);

  /* =========================
     GET BOOK
  ========================= */
  const getBook = useCallback(
    (bookId: number | string): Book | null => {
      return books.find((b) => b.id === parseInt(String(bookId))) ?? null;
    },
    [books]
  );

  /* =========================
     GET CHAPTER
  ========================= */
  const getChapter = useCallback(
    (bookId: number | string, chapterNum: number | string): Chapter | null => {
      const book = getBook(bookId);
      if (!book) return null;

      const ch = book.chapters.find(
        (c) => c.chapter === parseInt(String(chapterNum))
      ) ?? null;

      if (ch) {
        console.log(`📖 Found chapter ${chapterNum} in ${book.name}:`, {
          versesCount: ch.verses?.length ?? 0,
          firstVerse: ch.verses?.[0],
        });
      }

      return ch;
    },
    [getBook]
  );

  /* =========================
     FILTER TESTAMENT
  ========================= */
  const getBooksByTestament = useCallback(
    (testament: 'AT' | 'NT'): Book[] => {
      return books.filter((b) => b.testament === testament);
    },
    [books]
  );

  /* =========================
     DAILY VERSE
  ========================= */
  const getDailyVerse = useCallback((): DailyVerse | null => {
    if (books.length > 0 && !usingDemo) {
      try {
        const idx = getDayBasedIndex(books.length);
        const book = books[idx];
        if (!book?.chapters?.length) return FALLBACK_DAILY_VERSES[0];

        const chapIdx = getDayBasedIndex(book.chapters.length);
        const chapter = book.chapters[chapIdx];

        if (!chapter?.verses?.length) return FALLBACK_DAILY_VERSES[0];

        const verseIdx = getDayBasedIndex(chapter.verses.length);
        const verse = chapter.verses[verseIdx];

        return {
          book: book.name,
          bookId: book.id,
          chapter: chapter.chapter,
          verse: verse.verse,
          text: verse.text,
          reference: `${book.name} ${chapter.chapter}:${verse.verse}`,
        };
      } catch {
        // fallback silencieux
      }
    }

    const idx = getDayBasedIndex(FALLBACK_DAILY_VERSES.length);
    return FALLBACK_DAILY_VERSES[idx];
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
