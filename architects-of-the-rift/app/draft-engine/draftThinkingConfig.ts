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

  // §2 — duo-uri bot
  duo: {
    /** Primul pick de bot din cel mai bun duo disponibil. */
    bestMustWithBonus: 3.0,
    bestSynergyBonus: 1.5,
    /** Candidatul e în alt duo valid. */
    otherDuoBonus: 1.0,
    /** Ancoră mustWith fără partener eligibil (banat, luat, jucătorul < C). */
    orphanAnchorPenalty: 2.0,
    orphanSelfSufficientPenalty: 0.75,
    /** §2.3 — partener synergy ≥ 4 pentru o ancoră deja luată, fără partener mustWith. */
    fallbackPartnerBonus: 2.5,
    /** … plus atât pe fiecare treaptă de grad peste C (ordonați după grad). */
    fallbackGradeStep: 0.15,
    /** Scorul duo-ului: GRADE_RANK adc + support + meta mediu × metaWeight + mustWith. */
    metaWeight: 0.3,
    mustWithScoreBonus: 2,
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
  },

  // §4 — planul ancorat pe priority pick
  plan: {
    /** Ponderea potrivirii pick-urilor proprii cu planul (≥ 1 pick propriu). */
    anchorWeight: 0.45,
    /** … când primul pick propriu e priority pick. */
    priorityAnchorWeight: 0.6,
    /** Priority pick: meta de la atât în sus (sau SS/S, sau favorit de sezon). */
    priorityMetaMin: 7.5,
    /** Planul se blochează după atâtea pick-uri proprii. */
    lockAfterOwnPicks: 3,
    /** Multiplicatorul alinierii cu planul pe pick-ul propriu 1..5. */
    commitmentByPick: [1.0, 1.0, 1.1, 1.25, 1.4],
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
    /** split: runnerUp ≥ splitRatio × dominant. */
    splitRatio: 0.8,
  },
} as const;
