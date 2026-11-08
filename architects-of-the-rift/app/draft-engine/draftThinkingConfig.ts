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
} as const;
