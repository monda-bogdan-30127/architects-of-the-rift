// Constantele din DRAFT_THINKING.md, într-un singur loc. Valorile sunt de pornire:
// ordinea relativă contează mai mult decât numărul exact.

export const DRAFT_THINKING_CONFIG = {
  // §1 — champion mastery: nu draftăm ce nu știm juca
  mastery: {
    /** F: candidat exclus (`mastery-f`). */
    hardBlockRank: 0,
    /** D: penalizat și intră în shortlist doar dacă e primul. */
    softBlockRank: 1,
    dPenalty: 3,
    /** Sub atâția campioni pe rolul lui în pool, gate-ul nu se aplică (date incomplete). */
    thinPoolMinEntries: 3,
    /** B+: intră mereu în pool-ul de scorare la pick. */
    rosterPoolMinRank: 3,
    /** Un campion blocat la pick se poate muta doar pe un rol unde jucătorul are ≥ C. */
    lockedMoveMinRank: 2,
    /** Costul mutării unui campion blocat, în DFS-ul de roluri. */
    lockedMoveCost: 50,
    /** Ajustarea din `getRoleAssignmentScore` după gradul jucătorului de pe rol. */
    assignmentPenalty: { F: 200, D: 30 },
    /** §1.4 — pick propriu mutat de candidat pe un jucător cu D. */
    reassignDPenalty: 4,
    /** §1.4 — pick propriu mutat pe un grad mai mic cu ≥ 2 trepte: × trepte. */
    reassignDropPenalty: 0.8,
  },

  // §2 — duo-uri bot (FEEDBACK_FIXES §10: doar combo-urile tier 1–2, bonusuri după focusul pe bot)
  duo: {
    /**
     * Primul pick de bot, după focus: cel mai bun combo tier 1 / tier 2, alt combo valid,
     * ancoră orfană (penalizare, pozitivă aici).
     */
    focusBonus: {
      bot: { bestTier1: 3.5, bestTier2: 2.5, otherCombo: 1.0, orphan: 3.0 },
      neutral: { bestTier1: 2.5, bestTier2: 1.75, otherCombo: 0.75, orphan: 2.0 },
      elsewhere: { bestTier1: 0, bestTier2: 0, otherCombo: 0, orphan: 0.75 },
    },
    /** „Jucăm prin bot” / „prio pe alte linii”: diferența de scor (scala duo-ului) față de celelalte roluri. */
    focusMargin: 1.5,
    /** Ancoră orfană care e un carry self-sufficient: penalizarea e cel mult atât. */
    orphanSelfSufficientPenalty: 0.75,
    /** §2.3 — partener synergy ≥ 4 pentru o ancoră deja luată, fără partener mustWith. */
    fallbackPartnerBonus: 2.5,
    /** … plus atât pe fiecare treaptă de grad peste C (ordonați după grad). */
    fallbackGradeStep: 0.15,
    /** Scorul duo-ului: GRADE_RANK adc + support + meta mediu × metaWeight + mustWith. */
    metaWeight: 0.3,
    mustWithScoreBonus: 2,
    /** Combo tier 2 (synergy 5) în scorul duo-ului. */
    comboTier2ScoreBonus: 1,
    /** §2.4 — cel mai bun duo propriu e protejat la ban în faza 1 dacă e cu atât peste al doilea. */
    protectMargin: 2,
    /** §2.4 — userul „joacă des” un duo: fiecare campion luat de cel puțin atâtea ori. */
    userDuoMinPicks: 2,
  },

  // §3 — identitatea compoziției (compIdentity.ts)
  identity: {
    /** Ponderea fit-ului de tag-uri (pe campion) în semnal, față de `offers`. */
    tagWeight: 0.5,
    /** Tag evitat: −atât la fit-ul de tag-uri. */
    avoidTagWeight: 1.2,
    /**
     * `offers` din identitate la fit-ul unui candidat: × strength. 0 = fit-ul e doar pe tag-uri
     * (ca vechiul `scoreChampionForPlan`); cu 0.25 distribuția se muta spre pick/dive (calibrare §3).
     */
    fitOfferWeight: 0,
    /** protect-carry: bonus brut dacă echipa are un carry `hard-protect`. */
    hardProtectCarryBonus: 4,
    /** Semnal = brut (scalat la 5 pick-uri) / signalScale (mediana unei comp finale ≈ 5). */
    signalScale: 5,
    /** Sub acest semnal: identitate neclară („balanced”) = vechiul prag de 7 brut pe 5 pick-uri. */
    threshold: 1.4,
    /** Semnalul la care `strength` ajunge la maxim (cu un dominant clar). */
    fullStrengthSignal: 7,
    /** FEEDBACK_FIXES §5.2: strength = (top / full) × (strengthBase + (1 − strengthBase) × clarity) + bonus. */
    strengthBase: 0.5,
    /** Runner-up compatibil cu dominantul și peste prag. */
    compatibleRunnerBonus: 0.1,
  },

  // §4 — planul ancorat pe priority pick
  plan: {
    /** Ponderea potrivirii pick-urilor proprii cu planul (≥ 1 pick propriu). */
    anchorWeight: 0.45,
    /** … când primul pick propriu e priority pick. */
    priorityAnchorWeight: 0.45, // FEEDBACK_FIXES §11: = anchorWeight (fără boost suplimentar; era 0.6)
    /** În media fit-ului pe pick-uri, priority pick-ul contează de atâtea ori. */
    priorityPickFitWeight: 2,
    /** Priority pick: meta de la atât în sus (sau SS/S, sau favorit de sezon). */
    priorityMetaMin: 7.5,
    /** Planul se blochează după atâtea pick-uri proprii. */
    lockAfterOwnPicks: 3,
    alignmentClamp: [-5, 4] as [number, number],
  },

  // §5 — coeziune (perechile incompatibile sunt folosite deja de `readCompIdentity().split`)
  cohesion: {
    incompatiblePairs: [
      ["dive", "poke"],
      ["dive", "protect-carry"],
      ["pick", "front-to-back"],
      ["poke", "teamfight"],
    ] as [string, string][],
    /** FEEDBACK_FIXES §5.2 — identități care se întăresc (clarity se măsoară fără ele). */
    compatiblePairs: [
      ["dive", "pick"],
      ["dive", "teamfight"],
      ["teamfight", "front-to-back"],
      ["front-to-back", "protect-carry"],
      ["teamfight", "protect-carry"],
      ["pick", "poke"],
    ] as [string, string][],
    /** split: runnerUp ≥ splitRatio × dominant. */
    splitRatio: 0.8,
    /** Compoziția devine split cu candidatul: pick-ul propriu 2 / 3–5. */
    splitPenalty: 2.0,
    splitPenaltyLate: 2.75,
    /** §5.1 — coerența: fit × factor × strength × commitment, în clamp. */
    coherenceFitFactor: 0.75,
    coherenceClamp: [-4, 3.5] as [number, number],
  },

  // §6 — comp counter + anti tunnel vision (compCounter.ts)
  compCounter: {
    /** Doar cu atâtea pick-uri inamice. */
    minEnemyPicks: 2,
    /** matrice × strength-ul identității inamice × weight. */
    weight: 1.5,
    /** Candidatul contrează comp-ul, dar pierde linia: × factor și −penalty. */
    tunnelVisionFactor: 0.25,
    tunnelVisionPenalty: 1.0,
    /** Bilanțul liniilor (early) sub care „pierdem liniile”. */
    losingLanesThreshold: -3,
    losingLanesPenalty: 1.25,
    /** Bilanț negativ și candidatul câștigă linia. */
    balancingBonus: 0.75,
    /** Ponderea `enemyCompMatchup` în alegerea planului (≥ 2 pick-uri inamice). */
    planWeight: 0.2,
    /** Ban: fit pe identitatea inamică × (banBase + avantajul lor pe matrice) × strength × banWeight. */
    banBase: 0.5,
    banWeight: 0.6,
    banCap: 2.5,
    /** Linie de explicație de la atâta valoare. */
    explainMin: 0.5,
  },

  // §7 — memoria sezonului (teamSeasonStorage.ts, seasonThreatSystem.ts)
  season: {
    /** Sub atâtea jocuri cu campionul, amenințarea echipei e 0. */
    minGames: 3,
    /** De la această amenințare: ban sau plan. */
    threatThreshold: 5.5,
    /** Amenințarea jucătorului (`getEnemySeasonSignatureThreat`) × factor. */
    playerThreatFactor: 0.8,
    /** Counter-ul nostru pentru „plan”: jucătorul îl are la ≥ B. */
    counterMinGradeRank: 3,
    /**
     * Ban: + min(threat × banWeight, banCap); nu se adună peste mastery / target ban (max).
     * Spec: 0.45 / 3.5 — prea puțin: un 6–1 (amenințare 5.5) rămânea cu ~4 puncte sub al 3-lea ban meta.
     */
    banWeight: 1.4,
    banCap: 8,
    /** Pick: counter pregătit (campionul lor e liber) / pedepsit (l-au luat). */
    counterReadyBonus: 1.0,
    counterPunishBonus: 2.0,
    /** Plan: identitatea cu cel mai bun winrate a inamicului în sezon (minim atâtea jocuri). */
    planWeight: 0.15,
    identityMinGames: 4,
    /** Campionii noștri de sezon: + min(threat × ownComfortWeight, ownComfortCap). */
    ownComfortWeight: 0.2,
    ownComfortCap: 1.5,
  },

  // DRAFT_REALISM §5 — ponderile bucket-urilor pe fază (după indexul din DRAFT_SEQUENCE).
  // `style` rămâne 1 (stilul acționează pe ponderi din §8); `hygiene` e mereu × 1.
  phases: {
    pick: {
      "pick1-open": { power: 1.3, comp: 0.6, counter: 0.4, comfort: 1.0, deny: 1.2, info: 1.2, style: 1 },
      "pick1-close": { power: 1.1, comp: 0.9, counter: 0.7, comfort: 1.0, deny: 1.0, info: 1.1, style: 1 },
      pick2: { power: 0.8, comp: 1.3, counter: 1.2, comfort: 1.0, deny: 0.7, info: 0.6, style: 1 },
      "last-pick": { power: 0.6, comp: 1.2, counter: 1.6, comfort: 1.0, deny: 0.2, info: 0.1, style: 1 },
    },
    ban: {
      ban1: { power: 1.2, target: 1.1, protect: 0.5, compDeny: 0.3, predict: 1.0, hygiene: 1 },
      ban2: { power: 0.4, target: 1.0, protect: 1.4, compDeny: 1.5, predict: 1.2, hygiene: 1 },
    },
    /** §5.3 — fostele scalări pe pick înlocuite de ponderile de fază. */
    flexAmbiguityBonus: 1.0,
    contestabilityAnswerWeight: 0.32,
  },

  // FEEDBACK_FIXES §5 — raportul de draft pe piloni (draftPillarReport.ts)
  report: {
    composition: {
      /**
       * Puncte din strength: ≥ [0] → 3, ≥ [1] → 2, ≥ [2] → 1, altfel 0 (fără dominant: 1).
       * Spec: 0.55 / 0.35 / 0.2; cu noul strength (medie 0.60) dădea A 44%. Calibrare pe 600 de comp-uri:
       * 0.67 / 0.42 / 0.2 → A 28.5% · B 40% · C 20.5% · D 11% (D nu coboară sub ~11% doar din aceste praguri).
       */
      strength: [0.67, 0.42, 0.2] as [number, number, number],
      noDominantPoints: 1,
      /** A ≥ [0] puncte, B ≥ [1], C ≥ [2], altfel D. */
      grades: [4, 3, 2] as [number, number, number],
      /**
       * Frontline / engage / disengage din vectorul compoziției sub atât = „lipsește” (−1).
       * Spec: pragul din getNeedRequirement(2) = 5; calibrare: cu 5, 41% din comp-uri n-aveau „frontline”
       * și 36% nici engage nici disengage (un singur frontliner cu ofertă 4 nu ajungea). Cu 4: 18% / 5%.
       */
      baseNeedMin: 4,
      /** „Damage pe un singur tip”: atâția campioni (din 5) cu același tip principal. */
      singleDamageMin: 4,
    },
    preparation: {
      /** handled / (handled + lost): A ≥ [0], B ≥ [1], C ≥ [2], altfel D. */
      grades: [0.75, 0.5, 0.25] as [number, number, number],
      /** Adversarul „vrea” campionul: un jucător pe un rol liber îl are la cel puțin acest grad (A). */
      enemyWantMinRank: 4,
    },
  },

  // §5.3 — win condition (winCondition.ts)
  winCondition: {
    /** Candidatul satisface o nevoie (prioritate ≥ 2) a win condition-ului cu o ofertă ≥ 3. */
    enableBonus: 1.5,
    minNeedPriority: 2,
    minOfferStrength: 3,
    /** Al doilea carry hard-protect fără protecție în echipă. */
    secondHardProtectPenalty: 1.5,
    /** Protecție (peel + antiDive + disengage pe pick-urile proprii) sub care echipa „nu are protecție”. */
    minProtectionSupply: 4,
    /** Contribuția la alegerea win condition-ului, peste fit: carry / carry hard-protect (oricare identitate). */
    carryBonus: 1,
    hardProtectBonus: 1.5,
  },
} as const;
