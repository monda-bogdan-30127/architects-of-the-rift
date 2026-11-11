// Hash determinist pentru alegerile AI-ului (seed → 0..1). Alegerea finală e în draftDecision.ts (§10).
function hashString(value: string) {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return Math.abs(hash >>> 0);
}

export function roll(seed: string) {
  return (hashString(seed) % 10000) / 10000;
}
