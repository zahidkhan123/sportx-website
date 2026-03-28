/**
 * Client-safe helpers for blog keyword fields (no server-only imports).
 */

export function parseSecondaryKeywordPhrases(text: string | undefined): string[] {
  if (!text?.trim()) return [];
  const parts = text.split(/[\n,]+/);
  const seen = new Set<string>();
  const out: string[] = [];
  for (const p of parts) {
    const t = p.trim();
    if (!t || seen.has(t.toLowerCase())) continue;
    seen.add(t.toLowerCase());
    out.push(t);
  }
  return out;
}
