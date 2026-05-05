// ─── utils/championMasteryValidation.ts ─────────────────────────────────────
//
// Validation utilities for the championMasteryOverrides data file.
//
// Run validate(players, championMasteryOverrides) during dev / in tests
// to catch typos and partial-override bugs before they ship.
//
// ─────────────────────────────────────────────────────────────────────────────

import type {
  ChampionMasteryOverrides,
  ChampionMasteryGrade,
} from "../types/championMastery";
import { championMasteryOverrides } from "../data/championMasteryOverrides";
import { isMasteryGrade } from "./championMasteryUtils";
import type { Player } from "../types/player";

export type IssueSeverity = "error" | "warning" | "info";

export interface ValidationIssue {
  severity: IssueSeverity;
  playerId: string;
  champion?: string;
  message: string;
}

export interface ValidationResult {
  issues: ValidationIssue[];
  errorCount: number;
  warningCount: number;
  infoCount: number;
  ok: boolean;
}

// ─── Internal helpers ────────────────────────────────────────────────────────

const collectAllChampionsFromPlayers = (players: Player[]): Set<string> => {
  const all = new Set<string>();
  for (const p of players) {
    for (const c of p.bestChampions) all.add(c);
    if (p.championPool) for (const c of p.championPool) all.add(c);
  }
  return all;
};

const isWeakSlug = (slug: string): boolean => {
  // Empty / whitespace
  if (!slug || slug.trim() !== slug || slug.length === 0) return true;
  // Uppercase letters (slugs are kebab-case lowercase)
  if (slug !== slug.toLowerCase()) return true;
  // Spaces
  if (/\s/.test(slug)) return true;
  return false;
};

// ─── Main validator ──────────────────────────────────────────────────────────

/**
 * Validates the mastery override data against the player roster.
 *
 * Detects:
 *   E1  Override block uses a player ID that doesn't exist in players.ts
 *   E2  Grade value is not one of SS/S/A/B/C/D/F (typos like "S+" or lowercase "ss")
 *   E3  Champion slug is empty or malformed
 *   W1  Champion in override block doesn't appear in ANY player's bestChampions
 *       across the whole roster (likely typo in champion slug)
 *   W2  Override block has fewer champions than the player's bestChampions —
 *       partial overrides silently turn the rest into F (often unintended)
 *   W3  Override block declares F explicitly (functionally identical to omitting)
 *   I1  Player listed in players.ts but missing from overrides entirely
 */
export const validateMasteryOverrides = (
  players: Player[],
  overrides: ChampionMasteryOverrides = championMasteryOverrides,
): ValidationResult => {
  const issues: ValidationIssue[] = [];
  const playerIndex = new Map(players.map((p) => [p.id, p]));
  const allKnownChampions = collectAllChampionsFromPlayers(players);

  // ── Check every override block ─────────────────────────────────────────────
  for (const [playerId, masteryBlock] of Object.entries(overrides)) {
    const player = playerIndex.get(playerId);

    // E1 — unknown player ID
    if (!player) {
      issues.push({
        severity: "error",
        playerId,
        message: `Unknown player ID — not found in players.ts roster.`,
      });
      continue;
    }

    const entries = Object.entries(masteryBlock ?? {});

    // W2 — partial override (covers fewer champs than bestChampions)
    const playableCount = entries.filter(([, g]) => g !== "F").length;
    if (entries.length > 0 && playableCount < player.bestChampions.length) {
      issues.push({
        severity: "warning",
        playerId,
        message:
          `Override block has ${playableCount} playable champions but ` +
          `bestChampions has ${player.bestChampions.length}. ` +
          `Champions not listed will silently become F (unplayable).`,
      });
    }

    for (const [champion, grade] of entries) {
      // E3 — bad slug
      if (isWeakSlug(champion)) {
        issues.push({
          severity: "error",
          playerId,
          champion,
          message: `Malformed champion slug — must be lowercase kebab-case with no spaces.`,
        });
        continue;
      }

      // E2 — invalid grade value
      if (!isMasteryGrade(grade)) {
        issues.push({
          severity: "error",
          playerId,
          champion,
          message: `Invalid grade "${grade}" — expected one of SS, S, A, B, C, D, F.`,
        });
        continue;
      }

      // W3 — F written explicitly (redundant, omit instead)
      if (grade === "F") {
        issues.push({
          severity: "warning",
          playerId,
          champion,
          message: `Explicit "F" is equivalent to omitting the entry — consider removing.`,
        });
      }

      // W1 — champion slug not seen anywhere in roster (likely typo)
      if (!allKnownChampions.has(champion)) {
        issues.push({
          severity: "warning",
          playerId,
          champion,
          message:
            `Champion slug "${champion}" doesn't appear in any player's ` +
            `bestChampions or championPool — possible typo.`,
        });
      }
    }
  }

  // I1 — players without override block at all
  for (const player of players) {
    if (!Object.prototype.hasOwnProperty.call(overrides, player.id)) {
      issues.push({
        severity: "info",
        playerId: player.id,
        message: `Player has no entry in championMasteryOverrides (using auto fallback).`,
      });
    }
  }

  const errorCount = issues.filter((i) => i.severity === "error").length;
  const warningCount = issues.filter((i) => i.severity === "warning").length;
  const infoCount = issues.filter((i) => i.severity === "info").length;

  return {
    issues,
    errorCount,
    warningCount,
    infoCount,
    ok: errorCount === 0,
  };
};

// ─── Pretty printer for terminal / dev console ───────────────────────────────

const SEVERITY_TAG: Record<IssueSeverity, string> = {
  error: "[ERROR]",
  warning: "[WARN] ",
  info: "[INFO] ",
};

export const formatValidationResult = (result: ValidationResult): string => {
  const lines: string[] = [];
  lines.push(
    `Champion Mastery Validation: ` +
    `${result.errorCount} errors · ${result.warningCount} warnings · ${result.infoCount} info`,
  );
  lines.push("─".repeat(72));

  for (const issue of result.issues) {
    const tag = SEVERITY_TAG[issue.severity];
    const target = issue.champion
      ? `${issue.playerId} → ${issue.champion}`
      : issue.playerId;
    lines.push(`${tag} ${target.padEnd(36)} ${issue.message}`);
  }

  if (result.ok) {
    lines.push("─".repeat(72));
    lines.push("✓ No errors found.");
  }

  return lines.join("\n");
};