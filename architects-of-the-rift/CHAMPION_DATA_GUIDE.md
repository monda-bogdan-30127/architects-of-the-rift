# Ghid date campioni

Cum sunt organizate datele campionilor și cum le modifici de mână. Căile sunt relative la folderul cu `package.json`.

## Unde stă fiecare lucru

| Ce | Unde |
|---|---|
| Tot ce ține de un campion: identitate, compoziție, statistici globale, date pe rol | `app/data/champions/<id>.ts` — un fișier per campion |
| Ordinea campionilor + post-procesarea (`carryProfileOverrides`, merge `synergyWith`) | `app/data/champions/index.ts` |
| `createChampion`, `mergeWeaknesses` | `app/data/champions/_helpers.ts` |
| Gradele de mastery ale jucătorilor (SS…F) | `app/data/championMasteryOverrides.ts` |
| Override-uri de profil pe rol (kit, scaling etc.) | `app/data/championProfileOverrides.ts` |
| Imaginea campionului | `public/champions/<id>.png` |
| Definițiile matchup-urilor (`level`, `phase`), ponderile și curbele | `app/draft-engine/matchupGrades.ts` |

Numele fișierului e `id`-ul campionului (`jarvan-iv.ts`, `kaisa.ts`). Exportul e `id`-ul în camelCase (`jarvanIv`, `missFortune`). Importurile rămân `@/app/data/champions`, iar folderul se rezolvă prin `index.ts`.

Engine-ul citește datele pe rol **doar** prin două getter-e: `getRoleMatchups` / `getMustWith` / `getMustWithPartners` din `app/draft-engine/championMatchups.ts` și `getChampionStatsForRole` din `app/draft-engine/championRoleStatsSystem.ts`. Nimic altceva nu citește `champion.roleData` direct, cu excepția validatorului.

## Formatul unui fișier

```ts
import { createChampion } from "./_helpers";

export const poppy = createChampion({
  id: "poppy",
  name: "Poppy",
  image: "/champions/poppy.png",
  roles: ["support", "jungle", "top"],
  damageProfile: ["AD"],

  synergyWith: [
    { championId: "sivir", score: 4 },
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
        { championId: "camille", level: 2, phase: "all", note: "W oprește E-ul Camillei" },
      ],
      weakVs: [
        { championId: "shen", level: 2, phase: "lane" },
      ],
      mustWith: [],
      stats: null,
    },
    jungle: { goodVs: [], weakVs: [/* … */], mustWith: [], stats: null },
    top: { goodVs: [/* … */], weakVs: [/* … */], mustWith: [], stats: null },
  },
});
```

Reguli de formatare, la fel în toate fișierele:

- **Ordinea câmpurilor:** identitate (`id`, `name`, `image`, `roles`, `damageProfile`) → compoziție (`synergyWith`, `offers`, `needs`, `weaknesses`, `playerScaling`, `carryProfile` dacă e explicit) → `stats` → `roleData`.
- **`roleData` are exact cheile din `roles`, în aceeași ordine.**
- `synergyWith` e global pe campion, nu pe rol.

## Matchup-uri (`roleData[rol].goodVs` / `weakVs`)

O relație: `{ championId, level, phase, vsRole?, note? }`. `level` și `phase` sunt obligatorii.

La fiecare relație pune două întrebări: **„cât de tare?” → `level`** și **„când?” → `phase`**.

### `level`: cât de tare

| level | goodVs (noi câștigăm) | weakVs (noi pierdem) |
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

```ts
top: {
  goodVs: [
    { championId: "kayle", level: 2, phase: "lane" },   // o domină pe linie...
  ],
  weakVs: [
    { championId: "kayle", level: 2, phase: "late" },   // ...dar Kayle scalează și câștigă late
  ],
  mustWith: [],
  stats: null,
},
```

### Reguli

- **Scrie fiecare relație o singură dată.** `A weakVs B {level, phase}` generează automat `B goodVs A {level, phase}` (și invers). O intrare explicită pe partea cealaltă câștigă, dar dacă `level` sau `phase` diferă e eroare de validare.
- **Același inamic în `goodVs` și `weakVs`** pe același rol e permis doar cu faze opuse: `lane` într-o listă și `late` în cealaltă. Cu `all` nu poate apărea în ambele.
- **Același inamic nu apare de două ori în aceeași listă** pe același rol.
- **`level: 1` vine aproape mereu cu `phase: "all"`.** `lane`/`late` sunt permise, dar validatorul dă warning.
- **`vsRole` lipsă** = matchup de linie: același rol ca al tău. Pentru `adc`/`support` = botlane 2v2 (inamicul pe adc **sau** support). Pune `vsRole` doar pentru cazuri cross-role reale.
- `note` e recomandat la `level` 3 și la `level` 2 cu `phase: "all"`.

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

## `mustWith` (`roleData[rol].mustWith`)

- Doar id-uri, fără notă; ordinea = preferința.
- Pe `adc` partenerul trebuie să aibă rolul `support` (și invers).
- **Botlane = override:** dacă echipa are deja ancora pe adc/support, următorul pick e partenerul eligibil. Eligibil = liber, rolul complementar liber, iar jucătorul de pe acel rol are grad **≥ C** pe partener. Pe alte roluri e un bonus mare, nu override.
- **Atenție la mastery:** dacă un jucător are override-uri în `championMasteryOverrides.ts`, orice campion lipsă din lista lui contează ca **F**. Partenerii trebuie trecuți acolo, altfel combo-ul nu se declanșează niciodată.
- Perechile slabe (bonus mic, nu „must”) merg în `synergyWith`, nu în `mustWith`.

## Statistici pe rol (`roleData[rol].stats`)

- `stats: null` = fără date pe rol; se folosește `stats`-ul global al campionului.
- Poți completa doar o parte din câmpuri: scrie obiectul complet și lasă `null` unde lipsesc datele. Fiecare câmp `null` cade pe valoarea globală.
- **Sursa:** gol.gg (sau ceva echivalent) filtrat pe turneu **și** pe rol, același eșantion ca statistica globală (Worlds 2026).
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
2. Completează `goodVs` / `weakVs` / `mustWith` pentru rolul nou (pot fi goale) și `stats: null`.
3. Verifică mastery-ul jucătorilor de pe acel rol în `championMasteryOverrides.ts`.

**Campion nou**
1. Creează `app/data/champions/<id>.ts` după formatul de mai sus, cu câte o intrare în `roleData` pentru fiecare rol.
2. În `app/data/champions/index.ts`: adaugă importul **și** campionul în `baseChampions`, pe poziția dorită. Ordinea influențează tie-break-urile din draft.
3. Adaugă imaginea în `public/champions/<id>.png`.
4. Adaugă gradele de mastery în `championMasteryOverrides.ts` (manual sau cu scriptul Python de mai jos).
5. Dacă e un ADC cu `carryProfile` special, adaugă-l în `carryProfileOverrides` din `index.ts`.

**După orice modificare de date**

```bash
npm run validate:matchups          # structura roleData, level/phase, contradicții, mustWith
npx tsc --noEmit
npm run lint
npx tsx scripts/draft-scenarios.ts # comportamentul mustWith / matchup în draft
```

Pentru o mutare de date care **nu** trebuie să schimbe nimic, compară snapshot-urile:

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
