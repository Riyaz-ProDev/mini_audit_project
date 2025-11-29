import { diffTexts, VersionEntry } from "./diff";

class VersionStore {
  private versions: VersionEntry[] = [];
  private currentText = "";

  getVersions() {
    return [...this.versions].reverse();
  }

  saveVersion(nextText: string): VersionEntry {
    const diff = diffTexts(this.currentText, nextText);

    const entry: VersionEntry = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      addedWords: diff.addedWords,
      removedWords: diff.removedWords,
      oldLength: diff.oldLength,
      newLength: diff.newLength,
      oldWordCount: diff.oldWordCount,
      newWordCount: diff.newWordCount,
      summary: diff.summary,
      newText: nextText,
    };

    this.versions.push(entry);
    this.currentText = nextText;
    return entry;
  }
}

export const store = new VersionStore();