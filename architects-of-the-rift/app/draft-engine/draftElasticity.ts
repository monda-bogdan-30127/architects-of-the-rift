
import type { Champion } from "@/app/types/champion";

const HIGH_ELASTIC_IDS = new Set([
  "azir","orianna","ryze","varus","rumble","ahri","taliyah"
]);

export function getDraftElasticityScore(candidate:Champion){
  let score = 0;

  if(candidate.roles.length >=2) score += 3.5;
  if(HIGH_ELASTIC_IDS.has(candidate.id)) score += 3;

  const blindRate = candidate.stats.blindPickRate ?? 0;
  score += blindRate * 0.03;

  return Math.min(score,10);
}
