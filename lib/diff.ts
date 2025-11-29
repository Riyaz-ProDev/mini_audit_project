export type VersionEntry = {
  id: string;
  timestamp: string;
  addedWords: string[];
  removedWords: string[];
  oldLength: number;
  newLength: number;
  oldWordCount: number;
  newWordCount: number;
  summary: string;
  newText: string;
};

const tokenize = (text: string): string[] => {
  return (text.toLowerCase().match(/[a-z0-9]+(?:'[a-z0-9]+)?/g) ?? []);
};

export function diffTexts(prev: string, next: string) {
  const prevTokens = tokenize(prev);
  const nextTokens = tokenize(next);

  const prevSet = new Set(prevTokens);
  const nextSet = new Set(nextTokens);

  const addedWords: string[] = [];
  const removedWords: string[] = [];

  for (const w of nextSet) if (!prevSet.has(w)) addedWords.push(w);
  for (const w of prevSet) if (!nextSet.has(w)) removedWords.push(w);

  const base = {
    addedWords,
    removedWords,
    oldLength: prev.length,
    newLength: next.length,
    oldWordCount: prevTokens.length,
    newWordCount: nextTokens.length,
  };

  const summary = buildSummary(base);
  return { ...base, summary };
}

function buildSummary({
  addedWords,
  removedWords,
  oldLength,
  newLength,
  oldWordCount,
  newWordCount,
}: {
  addedWords: string[];
  removedWords: string[];
  oldLength: number;
  newLength: number;
  oldWordCount: number;
  newWordCount: number;
}) {
  const lenDelta = newLength - oldLength;
  const wcDelta = newWordCount - oldWordCount;

  const parts: string[] = [];
  parts.push(`Chars: ${oldLength} → ${newLength} (${lenDelta >= 0 ? "+" : ""}${lenDelta})`);
  parts.push(`Words: ${oldWordCount} → ${newWordCount} (${wcDelta >= 0 ? "+" : ""}${wcDelta})`);
  if (addedWords.length) parts.push(`Added: ${addedWords.join(", ")}`);
  if (removedWords.length) parts.push(`Removed: ${removedWords.join(", ")}`);

  return parts.join(" | ");
}