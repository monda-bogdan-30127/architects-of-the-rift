# Ghid date campioni

Cum sunt organizate datele campionilor și cum le modifici de mână. Căile sunt relative la folderul cu `package.json`.

## Unde stă fiecare lucru

| Ce | Unde |
|---|---|
| Tot ce ține de un campion: identitate, compoziție, statistici globale, date pe rol | `app/data/champions/<id>.ts` — un fișier per campion |
| Ordinea campionilor + post-procesarea (`carryProfileOverrides`, merge `synergyWith`) | `app/data/champions/index.ts` |
| `createChampion`, `mergeWeaknesses` | `app/data/champions/_helpers.ts` |
| Sinergii (`synergyWith`) și anti-sinergii (`badSynergyWith`): global pe campion, nu pe rol | în fișierul campionului; penalizarea pe `level` în `app/draft-engine/badSynergy.ts` |
| Gradele de mastery ale jucătorilor (SS…F) | `app/data/championMasteryOverrides.ts` |
| Corecții manuale ale profilului pe rol (abilități, threat, identitate pe faze…) | `roleData[rol].profile` în fișierul campionului |
| Cum se derivă profilul automat | `app/draft-engine/championProfileSystem.ts` |
| Imaginea campionului | `public/champions/<id>.png` |
| Definițiile matchup-urilor (`level`, `phase`), ponderile și curbele | `app/draft-engine/matchupGrades.ts` |

Numele fișierului e `id`-ul campionului (`jarvan-iv.ts`, `kaisa.ts`). Exportul e `id`-ul în camelCase (`jarvanIv`, `missFortune`). Importurile rămân `@/app/data/champions`, iar folderul se rezolvă prin `index.ts`.

Engine-ul citește datele pe rol **doar** prin getter-e:

- `getRoleMatchups` / `getMustWith` / `getMustWithPartners` din `app/draft-engine/championMatchups.ts`;
- `getChampionStatsForRole` din `app/draft-engine/championRoleStatsSystem.ts`;
- `getChampionRoleProfile` din `app/draft-engine/championProfileSystem.ts`;
- anti-sinergiile (`badSynergyWith`, global) prin `getBadSynergy` / `getTotalBadSynergy` din `app/draft-engine/badSynergy.ts`.

Nimic altceva nu citește `champion.roleData` direct, cu excepția validatorului.

## Formatul unui fișier

```ts
import { createChampion } from "./_helpers";

export const poppy = createChampion({
  id: "poppy",
  name: "Poppy",
  image: "/champions/poppy.png",
  roles: ["support", "jungle", "top"],
  damageProfile: ["AD"],
  attackType: "melee",              // "melee" | "ranged": atacul de bază

  synergyWith: [
    { championId: "sivir", score: 4 },
  ],

  // opțional, doar dacă există
  badSynergyWith: [
    { championId: "pyke", level: 3, note: "…" },
  ],

  offers: [
    { type: "antiDive", strength: 5 },
  ],

  needs: [
    { type: "followUp", priority: 1 }
  ],

  weaknesses: [
    { exposedTo: "disengage", severity: 2 },
  ],

  playerScaling: { mac: 4, tfg: 3, con: 4, iq: 4 },

  stats: { picks: 1, bans: 5, /* … statisticile globale … */ },

  roleData: {
    support: {
      goodVs: [
        { championId: "camille", level: 3, phase: "all", note: "W stops Camille's E" },
      ],
      stats: null,
    },
    jungle: { goodVs: [/* … */], stats: null },
    top: { goodVs: [/* … */], stats: { /* … */ } },
  },
});
```

Reguli de formatare, la fel în toate fișierele:

- **Ordinea câmpurilor:** identitate (`id`, `name`, `image`, `roles`, `damageProfile`, `attackType`) → compoziție (`synergyWith`, `badSynergyWith` dacă există, `offers`, `needs`, `weaknesses`, `playerScaling`, `carryProfile` dacă e explicit) → `stats` → `roleData`.
- **`roleData` are exact cheile din `roles`, în aceeași ordine.** Într-un rol: `goodVs`, `mustWith` (opțional, doar dacă există), `stats`, apoi `profile` (opțional).
- **Nu se scrie `weakVs`** (e generat automat, vezi mai jos) și **nici `mustWith: []`**. Validatorul dă eroare la ambele.
- `synergyWith` e global pe campion, nu pe rol.
- `attackType` (`"melee"` / `"ranged"`) e range-ul atacului de bază și dă tag-ul `melee` / `ranged` din profilul derivat. La formele schimbătoare (Jayce, Nidalee, Elise, Gnar, Kayle) se trece forma dominantă în pro. Dacă scrii `tags` într-un `profile` manual, tag-ul de range trebuie să fie același.

## Matchup-uri (`roleData[rol].goodVs`)

**Se scrie doar „pe cine bat eu”.** `weakVs` (pe cine pierd) e generat automat din `goodVs`-ul celorlalți: `A:rolA goodVs B` → `B weakVs A` (cu `vsRole` = rolA). Ca să spui că X pierde contra lui Y, scrii `goodVs X` **în fișierul lui Y**.

Ca să vezi listele efective ale unui campion (pe cine bate, de cine e bătut și din ce fișier vine fiecare relație): `npm run matchups -- <id> [rol]`. Combinațiile fără niciun counter (blind pick-uri perfect sigure pentru engine): `npm run matchups -- --uncountered`.

O relație: `{ championId, level, phase, vsRole?, note? }`. `level` și `phase` sunt obligatorii.

La fiecare relație pune două întrebări: **„cât de tare?” → `level`** și **„când?” → `phase`**.

### `level`: cât de tare

| level | goodVs (noi câștigăm) | weakVs generat (adversarul pierde) |
|---|---|---|
| **3** | **Hard counter**: îl bate mereu, indiferent de context | **Hard countered**: pierde mereu |
| **2** | **Counter**: îl bate, dar adversarul se poate juca dacă echipa îi acoperă slăbiciunile | **Countered**: pierde, dar poate câștiga dacă echipa îi acoperă slăbiciunile |
| **1** | **Skill matchup**, ușor avantaj: decide jucătorul | **Skill matchup**, ușor dezavantaj |

### `phase`: când

| phase | Sens |
|---|---|
| `"lane"` | Avantajul e în lane phase, se egalizează după |
| `"late"` | Linia e egală, avantajul vine din mid game încolo |
| `"all"` | Avantajul ține tot jocul |

### Exemplu: câștigă pe linie, pierde late

Se scrie ca **două `goodVs`, în două fișiere**:

```ts
// poppy.ts, top: o domină pe Kayle pe linie...
goodVs: [{ championId: "kayle", level: 2, phase: "lane" }]

// kayle.ts, top: ...dar Kayle scalează și câștigă late
goodVs: [{ championId: "poppy", level: 2, phase: "late" }]
```

### Reguli

- **Fiecare relație se scrie o singură dată**, în fișierul celui care câștigă.
- **Contradicție:** `A goodVs B` și `B goodVs A` pe roluri care se întâlnesc e permis doar cu faze opuse: `lane` într-un fișier și `late` în celălalt. Cu `all` sau cu aceeași fază în ambele sensuri e eroare.
- **Același inamic nu apare de două ori în `goodVs`** pe același rol (cu același `vsRole`).
- **`level: 1` vine aproape mereu cu `phase: "all"`.** `lane`/`late` sunt permise, dar validatorul dă warning.
- **`vsRole` lipsă** = matchup de linie: același rol ca al tău. Pentru `adc`/`support` = botlane 2v2 (inamicul pe adc **sau** support). Pune `vsRole` doar pentru cazuri cross-role reale.
- `note` e recomandat la `level` 3 și la `level` 2 cu `phase: "all"`.
- **`note` se scrie în engleză**: apare în joc (raport, tooltip-uri, explicațiile matchup-urilor). Scurt, în terminologia LoL („Vitals deal %HP true damage vs tanks”). Validatorul dă warning pentru o `note` cu diacritice românești.

### Cum se calculează

Valoarea în faza jocului `p` (early / mid / late) = `MATCHUP_LEVEL_WEIGHT[level] × MATCHUP_PHASE_CURVE[phase][p]`, apoi:

- **level 2:** dacă aliații celui countrat îi acoperă slăbiciunile (`needs` cu prioritate ≥ 2), efectul scade la ×0.5 (acoperire ≥ 50%) sau ×0.3 (acoperire 100%), **doar pe mid și late**. Pe linie echipa nu-l poate ajuta.
- **level 1:** se scalează cu diferența de `mec` dintre jucătorii de pe cele două roluri.
- **level 3:** fără modificatori.

Ca referință: un hard counter pe tot jocul valorează 9.5 în fiecare fază, iar `level 2, lane` valorează 3.8 în early și 0.69 în late.

### Conversie din formatul vechi (`score` 1–5)

Formatul vechi (notă 1–5, din DRAFT_REWORK) a fost înlocuit de `level` + `phase`. Datele au fost migrate cu `scripts/migrate-matchups-to-level-phase.ts`:

| score vechi | level | phase |
|---|---|---|
| 5 | 3 | `"all"` |
| 4 | 2 | `"all"` |
| 3 | 2 | `"late"` |
| 2 | 2 | `"lane"` |
| 1 | 1 | `"all"` |

Combinațiile noi, imposibile înainte (de exemplu un hard counter doar pe linie, `level 3, lane`), se scriu direct.

## `mustWith` (`roleData[rol].mustWith`, opțional)

- **Direcțional:** „campionul X e construit în jurul lui Y”. `kogmaw.ts` (adc) are `mustWith: ["lulu"]`: Kog'Maw primul → Lulu e forțată; Lulu prima **nu** forțează Kog'Maw (Lulu nu are nevoie de Kog'Maw).
- **Se scrie doar când există.** Lipsă = fără partener; nu scrie `mustWith: []`.
- **Perechile reciproce** se scriu în **ambele** fișiere (Xayah ↔ Rakan: `xayah.ts` adc → `rakan`, `rakan.ts` support → `xayah`).
- Doar id-uri, fără notă; ordinea = preferința.
- `npm run validate:matchups` listează toate perechile, marcate „reciproc” sau „într-un sens”.
- Pe `adc` partenerul trebuie să aibă rolul `support` (și invers).
- **Botlane = override:** dacă echipa are deja ancora pe adc/support, următorul pick e partenerul eligibil din `mustWith`-ul ancorei. Eligibil = liber, rolul complementar liber, iar jucătorul de pe acel rol are grad **≥ C** pe partener. Pe alte roluri e un bonus mare, nu override.
- **Atenție la mastery:** dacă un jucător are override-uri în `championMasteryOverrides.ts`, orice campion lipsă din lista lui contează ca **F**. Partenerii trebuie trecuți acolo, altfel combo-ul nu se declanșează niciodată.
- Perechile slabe (bonus mic, nu „must”) merg în `synergyWith`, nu în `mustWith`.

## Anti-sinergii (`badSynergyWith`)

Perechi de campioni care pierd valoare **împreună în aceeași echipă**, din cauza kit-urilor. Global pe campion (lângă `synergyWith`), nu pe rol. O relație: `{ championId, level, note }`, toate obligatorii.

| level | Sens | Penalizare |
|---|---|---|
| **5** | **Se anulează reciproc**: kit-urile lucrează direct unul împotriva celuilalt | 4.0 |
| **4** | **Conflict major de plan**: vor lucruri opuse de la joc (ex. support roamer + ADC care are nevoie de lane) | 3.5 |
| **3** | **Conflict clar**: perechea pierde valoare vizibil, dar se poate juca | 3.0 |
| **2** | **Ușor incompatibil**: o parte din valoarea unuia se pierde | 2.5 |
| **1** | **Mic minus** | 2.0 |

Penalizarea se scade din sinergia candidatului la pick (`getCompSynergyScore`, ×0.55). Valorile sunt în `BAD_SYNERGY_PENALTY` (`app/draft-engine/badSynergy.ts`).

### Reguli

- **Simetric, scris o singură dată**, ca la `goodVs`: perechea apare doar într-unul dintre cele două fișiere (pe botlane în fișierul ADC-ului, altfel al primului din pereche). Validatorul dă eroare dacă apare în ambele.
- **Doar interacțiuni specifice perechii.** Probleme generice de compoziție (fără frontline, fără engage, double AP, prea mult scaling) **nu** se pun aici: le acoperă `offers` / `needs` și comp gate-ul.
- **`note` obligatoriu**: o propoziție cu motivul concret, **în engleză** (apare în joc).
- **Nu în ambele liste**: același partener nu poate fi și în `synergyWith`, și în `badSynergyWith`.
- `npm run validate:matchups` listează toate perechile, după `level`.

### Exemple

```ts
// kogmaw.ts: Pyke pleacă din lane, Kog'Maw nu are cum să se apere singur
badSynergyWith: [
  { championId: "pyke", level: 5, note: "Pyke roams; Kog'Maw is left alone in lane without peel" },
],

// kalista.ts: R-ul ei e valoros doar cu un support care are engage de livrat
badSynergyWith: [
  { championId: "nami", level: 2, note: "Kalista's R throws the support in, but Nami has no engage to deliver" },
],

// ziggs.ts: buff-urile Lului se pierd pe un mage
badSynergyWith: [
  { championId: "lulu", level: 3, note: "Lulu's buffs (W, E) are for auto-attackers; Ziggs is a mage" },
],
```

Ce **nu** se scrie aici: Syndra + Lillia („fără frontline”) sau Kayle + Master Yi („double scaling”). Sunt probleme de compoziție, nu de pereche.

## Profil pe rol (`roleData[rol].profile`)

Profilul (`ChampionRoleProfile`) descrie cum se joacă un campion pe un rol: tag-uri, abilități, tipul de damage, CC, peel, acces, threat, scaling pe faze, identitate pe faze, condiții, dependențe de combo, reguli de sinergie. Îl folosesc draftul și simularea.

**Profilul e generat automat** pentru orice campion × rol din `offers`, `needs`, `stats` și `playerScaling` (`deriveChampionRoleProfile`). Derivarea nu are cazuri speciale pe id de campion.

**`profile` e opțional.** Pune doar câmpurile pe care derivarea nu le prinde corect: abilități cu efecte speciale, threat/access, identitate pe faze, condiții, `special`, `comboDependency`, reguli de sinergie specifice campionului.

### Reguli de combinare cu profilul derivat

- **obiectele** (`special`, `accessProfile`, `threatProfile`, `comboDependency`, `scaling.early` etc.) se completează **câmp cu câmp**: scrii doar câmpurile pe care le schimbi;
- **`tags` și `abilities`** se **înlocuiesc** întregi;
- **regulile din `synergy`** (`wantsAllies`, `wantsTeam`, `goodWith`) se **adaugă** la cele derivate. O regulă cu același `id` ca una derivată o înlocuiește;
- nu scrie `profile.role`, rolul vine din cheia din `roleData`.

**Toate valorile numerice sunt pe scala 0–10.** Validatorul dă eroare în afara ei.

### Exemplu complet (Braum, support)

```ts
support: {
  goodVs: [/* … */],
  stats: null,
  profile: {
    tags: ["ranged", "warden", "peel", "anti-dive", "front-to-back"],
    abilities: [
      { key: "passive", name: "Concussive Blows", effects: [{ type: "mark", subtype: "ally-proc-cc", strength: 9, reliability: 9, priority: 9 }] },
      { key: "e", name: "Unbreakable", effects: [{ type: "projectile-block", strength: 10, reliability: 9, priority: 10 }, { type: "anti-engage", strength: 8, reliability: 8, priority: 8 }] },
      { key: "r", name: "Glacial Fissure", effects: [{ type: "knockup", strength: 8, reliability: 8, priority: 8 }, { type: "slow", strength: 7, reliability: 9, priority: 7 }] },
    ],
    special: { antiDash: 0, projectileBlock: 10, ground: 0, displacement: 6, visionControl: 4 },
    accessProfile: { engageRange: 5, targetAccess: 3, stickiness: 4 },
    threatProfile: { backlineThreat: 2, frontlineThreat: 5, pickThreat: 5, zoneThreat: 5, antiDiveThreat: 10 },
    phaseIdentity: { earlyRole: "peel", midRole: "peel", lateRole: "peel" },
  },
},
```

### Exemplu minimal (Cassiopeia, mid)

Restul profilului rămâne cel derivat; se corectează doar `ground` (W-ul o ține pe loc):

```ts
profile: {
  special: { ground: 10 },
},
```

### Unde merită completat

`npm run validate:matchups` afișează la final câte combinații campion:rol au `profile` manual, pe fiecare rol, plus lista celor fără, sortată după `presence` (cei mai jucați primii).

## Statistici pe rol (`roleData[rol].stats`)

- `stats: null` = fără date pe rol; se folosește `stats`-ul global al campionului.
- Poți completa doar o parte din câmpuri: scrie obiectul complet și lasă `null` unde lipsesc datele. Fiecare câmp `null` cade pe valoarea globală.
- **Sursa:** gol.gg (sau ceva echivalent) filtrat pe turneu **și** pe rol, același eșantion ca statistica globală (Worlds 2026).
- **Import automat:** pune tabelele gol.gg ca TSV în `data-sources/<turneu>/<rol>.tsv` (`top`, `jungle`, `mid`, `adc`, `support`) și rulează `npx tsx scripts/import-role-stats.ts data-sources/<turneu>`. Scriptul completează `roleData[rol].stats` și adaugă rolul în `roles` dacă un campion a fost jucat pe un rol pe care nu-l are. `bans` și `avgBanTurn` rămân `null` (ban-urile nu au rol), iar `presence` = pick-uri pe rol + ban-uri. Importul e idempotent; la final scriptul semnalează dacă pick-urile pe rol nu se adună la cele globale (alt eșantion).
- **Unde contează cel mai mult:** la campionii flex (Poppy, Seraphine, Senna, Taliyah…). La un campion cu un singur rol, statistica pe rol e practic cea globală.

| Câmp | Semnificație |
|---|---|
| `picks` / `bans` | număr de pick-uri / ban-uri pe acest rol (ban-urile nu au rol; lasă `null` dacă sursa nu le separă) |
| `presence` | **număr de jocuri** cu pick sau ban (≈ picks + bans), nu procent |
| `prioScore` | prioritate în draft, aceeași scală ca globalul (~0–100) |
| `wins` / `losses` | victorii / înfrângeri pe rol |
| `proWinRate` | winrate pro, **procent 0–100** (ex. `54`), nu fracție |
| `kda` | KDA mediu |
| `avgBanTurn` | tura medie de ban |
| `avgPickRound` | runda medie de pick (1 = primele pick-uri) |
| `blindPickRate` | % din pick-uri făcute fără adversarul de linie vizibil (0–100) |
| `averageGameTime` | durata medie, `"mm:ss"` |
| `csPerMinute`, `damagePerMinute`, `goldPerMinute` | pe minut |
| `csDiffAt15`, `goldDiffAt15`, `xpDiffAt15` | diferența față de adversarul de linie la 15:00 |
| `soloqKrChallengerWinRate` | winrate soloq KR Challenger, procent (ex. `52.4`) |

## Checklist-uri

**Rol nou pentru un campion existent**
1. Adaugă rolul în `roles` **și** cheia în `roleData`, în același fișier, pe aceeași poziție.
2. Completează `goodVs` pentru rolul nou (poate fi gol) și `stats: null`. `mustWith` doar dacă există o pereche strictă; `profile` doar dacă derivarea automată nu e suficientă. Pe cine pierde rolul nou se scrie ca `goodVs` în fișierele adversarilor.
3. Verifică mastery-ul jucătorilor de pe acel rol în `championMasteryOverrides.ts`.

**Campion nou**
1. Creează `app/data/champions/<id>.ts` după formatul de mai sus (inclusiv `attackType`), cu câte o intrare în `roleData` pentru fiecare rol.
2. În `app/data/champions/index.ts`: adaugă importul **și** campionul în `baseChampions`, pe poziția dorită. Ordinea influențează tie-break-urile din draft.
3. Adaugă imaginea în `public/champions/<id>.png`.
4. Adaugă gradele de mastery în `championMasteryOverrides.ts` (manual sau cu scriptul Python de mai jos).
5. Dacă e un ADC cu `carryProfile` special, adaugă-l în `carryProfileOverrides` din `index.ts`.

**După orice modificare de date**

```bash
npm run validate:matchups          # structura roleData, level/phase, contradicții, mustWith (+ perechi), badSynergyWith, profile + acoperire
npm run matchups -- jax            # Bate / E bătut de (cu fișierul sursă) / mustWith / synergyWith, toate rolurile
npm run matchups -- jax top        # un singur rol
npm run matchups -- --uncountered  # campion × rol fără niciun counter, după presence (lista de lucru)
npx tsc --noEmit
npm run lint
npx tsx scripts/draft-scenarios.ts # comportamentul mustWith / matchup în draft
```

Pentru o mutare de date care **nu** trebuie să schimbe nimic, compară snapshot-urile (pentru profile: `scripts/profile-snapshot.ts`, la fel):

```bash
npx tsx scripts/champion-data-snapshot.ts                              # înainte → scripts/.snapshot-before.json
npx tsx scripts/champion-data-snapshot.ts scripts/.snapshot-after.json # după
cmp scripts/.snapshot-before.json scripts/.snapshot-after.json
```

## Mastery din gol.gg (scriptul Python)

```bash
python fill_champion_mastery_from_golgg.py \
  --champions app/data/champions \
  --players app/data/players.ts \
  --overrides app/data/championMasteryOverrides.ts \
  --out app/data/championMasteryOverrides.updated.ts \
  --cache-dir .golgg_cache --report-csv report.csv
```

`--champions` e folderul: scriptul citește fiecare `<id>.ts` (ignoră `index.ts` și `_helpers.ts`) și ia `id`, `name` și `roles` din fișier. Cu `--calibrate` nu scrie nimic, doar compară gradele noi cu cele existente.
