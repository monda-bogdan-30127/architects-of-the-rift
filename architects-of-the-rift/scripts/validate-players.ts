// ROSTER_IMPORTS_AND_INFO §1.3 — validatorul datelor de jucător: fiecare jucător are cel puțin o naționalitate,
// codurile sunt ISO 3166-1 alpha-2 valide, iar `residentRegions` conține doar regiuni de ligă. Rulat de `npm run check`.

import { players } from "@/app/data/players";
import { isLeagueRegion, isValidCountryCode } from "@/app/data/regions";

const errors: string[] = [];
for (const player of players) {
  if (!player.nationalities?.length) errors.push(`${player.id}: fără naționalitate`);
  for (const code of player.nationalities ?? []) {
    if (!isValidCountryCode(code)) errors.push(`${player.id}: cod de țară invalid „${code}”`);
  }
  if (new Set(player.nationalities).size !== player.nationalities.length) errors.push(`${player.id}: naționalitate duplicată`);
  for (const region of player.residentRegions ?? []) {
    if (!isLeagueRegion(region)) errors.push(`${player.id}: regiune de rezidență invalidă „${region}”`);
  }
}

if (errors.length) {
  console.error(`Jucători: ${errors.length} erori`);
  for (const error of errors) console.error(`  ${error}`);
  process.exit(1);
}
console.log(`Jucători: ${players.length}, naționalitățile valide`);
