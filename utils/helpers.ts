export interface TextPart {
  text: string;
  highlight: boolean;
}

export function highlightText(text: string, query: string): TextPart[] {
  if (!query || query.trim() === '') return [{ text, highlight: false }];

  const parts: TextPart[] = [];
  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase().trim();
  let lastIndex = 0;
  let index = lowerText.indexOf(lowerQuery);

  while (index !== -1) {
    if (index > lastIndex) {
      parts.push({ text: text.slice(lastIndex, index), highlight: false });
    }
    parts.push({ text: text.slice(index, index + query.length), highlight: true });
    lastIndex = index + query.length;
    index = lowerText.indexOf(lowerQuery, lastIndex);
  }

  if (lastIndex < text.length) {
    parts.push({ text: text.slice(lastIndex), highlight: false });
  }

  return parts;
}

export function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function truncate(text: string | undefined, maxLength: number) {
  if (!text) return ''; 

  if (text.length <= maxLength) return text;

  return text.substring(0, maxLength) + '...';
}

export function getDayBasedIndex(arrayLength: number): number {
  const today = new Date();
  const seed =
    today.getFullYear() * 10000 +
    (today.getMonth() + 1) * 100 +
    today.getDate();
  return seed % arrayLength;
}
