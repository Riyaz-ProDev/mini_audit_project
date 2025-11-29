"use client";
import { useState, useEffect } from "react";

type VersionEntry = {
  id: string;
  timestamp: string;
  summary: string;
  addedWords: string[];
  removedWords: string[];
  newText: string;
};

export default function Home() {
  const [text, setText] = useState("");
  const [versions, setVersions] = useState<VersionEntry[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadVersions = async () => {
    try {
      const res = await fetch("/api/versions");
      const ct = res.headers.get("content-type") || "";
      if (!ct.includes("application/json")) throw new Error("Non-JSON response");
      const data = await res.json();
      setVersions(data);
    } catch (e: any) {
      setError(e.message);
    }
  };

  useEffect(() => {
    loadVersions();
  }, []);

  const saveVersion = async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/save-version", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const ct = res.headers.get("content-type") || "";
      if (!ct.includes("application/json")) throw new Error("Non-JSON response");
      if (!res.ok) {
        const e = await res.json();
        throw new Error(e?.error ?? "Failed to save");
      }
      await loadVersions();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container">
      <h1>Mini Audit Trail Generator</h1>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type and edit text here..."
      />

      <div className="actions">
        <button onClick={saveVersion} disabled={saving}>
          {saving ? "Saving..." : "Save Version"}
        </button>
        {error && <span className="error">Error: {error}</span>}
      </div>

      <h2>Version History</h2>
      <ul>
        {versions.map((v) => (
          <li key={v.id} className="version-item">
            <p><strong>Timestamp:</strong> {new Date(v.timestamp).toLocaleString()}</p>
            <p><strong>Summary:</strong> {v.summary}</p>
            <p><strong>Added:</strong> {v.addedWords.join(", ") || "—"}</p>
            <p><strong>Removed:</strong> {v.removedWords.join(", ") || "—"}</p>
            <details>
              <summary>Snapshot</summary>
              <pre>{v.newText}</pre>
            </details>
          </li>
        ))}
      </ul>
    </div>
  );
}