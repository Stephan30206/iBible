// types/bible.ts

export interface Verse {
  verse: number;
  text: string;
}

export interface Chapter {
  chapter: number;
  verses: Verse[];
}

export interface Book {
  id: number;
  name: string;
  abbreviation: string;
  testament: 'AT' | 'NT';
  category: string;
  chapters: Chapter[];
}

export interface BibleData {
  books: Book[];
}

export interface Bookmark {
  bookId: number;
  bookName: string;
  chapter: number;
  verse: number;
  text: string;
  reference: string;
  savedAt: string;
}

export interface LastPosition {
  bookId: number;
  bookName: string;
  chapter: number;
}

export interface DailyVerse {
  book: string;
  bookId: number;
  chapter: number;
  verse: number;
  text: string;
  reference: string;
}
