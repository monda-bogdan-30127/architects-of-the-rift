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
} as const;
