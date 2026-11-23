import { Region } from "../types/region"
import type { Player } from "@/app/types/player";

export const regions: Region[] = [
  {
    id: "lck",
    name: "League of Legends Champions Korea",
    server: "Korean Server",
    teams: 10,
    logo: "/region-logos/League_of_Legends_Champions_Korea_logo.svg"
  },

  {
    id: "lec",
    name: "League of Legends EMEA Championship",
    server: "EU Server",
    teams: 10,
    logo: "/region-logos/lec.png"
  },

  {
    id: "lpl",
    name: "League of Legends Pro League",
    server: "China Server",
    teams: 14,
    logo: "/region-logos/League_of_legends_pro_league_logo.svg"
  },

  {
    id: "lcs",
    name: "League Championship Series",
    server: "NA Server",
    teams: 8,
    logo: "/region-logos/League_championship_series_logo.svg"
  },
]

// ─── ROSTER_IMPORTS_AND_INFO §1.2 — regula de import ──────────────────────────
// Ca în LoL (regulile Riot din 2026): în lineup-ul de 5 al echipei userului pot fi cel mult MAX_IMPORTS jucători de
// import. Un jucător e de import dacă niciuna dintre naționalitățile lui nu aparține regiunii echipei și nici nu e
// rezident în ea (`residentRegions`). Rosterele AI nu sunt verificate.

export type LeagueRegion = "lck" | "lpl" | "lec" | "lcs";

export const LEAGUE_REGIONS: readonly LeagueRegion[] = ["lck", "lpl", "lec", "lcs"];

export const MAX_IMPORTS = 2;

/** Europa (inclusiv UK, Ucraina, Balcani, microstatele), coduri ISO 3166-1 alpha-2. */
const EUROPE = [
  "AD", "AL", "AT", "BA", "BE", "BG", "CH", "CY", "CZ", "DE", "DK", "EE", "ES", "FI", "FO", "FR", "GB", "GI", "GR",
  "HR", "HU", "IE", "IS", "IT", "LI", "LT", "LU", "LV", "MC", "ME", "MK", "MT", "NL", "NO", "PL", "PT", "RO", "RS",
  "SE", "SI", "SK", "SM", "UA", "VA", "XK",
];
/** CIS. */
const CIS = ["RU", "BY", "KZ", "AM", "AZ", "GE", "KG", "TJ", "TM", "UZ", "MD"];
/** Orientul Mijlociu și Africa de Nord. */
const MENA = ["AE", "SA", "QA", "KW", "BH", "OM", "JO", "LB", "IL", "EG", "MA", "DZ", "TN", "IQ", "IR", "SY", "YE", "LY", "PS"];
/** America Latină fără Brazilia: Mexic, America Centrală și de Sud, Caraibe. */
const LATAM = [
  "MX", "BZ", "CR", "SV", "GT", "HN", "NI", "PA",
  "AR", "BO", "CL", "CO", "EC", "GY", "PY", "PE", "SR", "UY", "VE",
  "AG", "BS", "BB", "CU", "DM", "DO", "GD", "HT", "JM", "KN", "LC", "VC", "TT", "PR",
];

export const REGION_HOME_COUNTRIES: Record<LeagueRegion, ReadonlySet<string>> = {
  lck: new Set(["KR"]),
  // Jucătorii din Taiwan, Hong Kong și Macao nu ocupă loc de import în LPL.
  lpl: new Set(["CN", "TW", "HK", "MO"]),
  // Din 2023, LEC e liga EMEA: Turcia, CIS și MENA nu sunt import.
  lec: new Set([...EUROPE, "TR", ...CIS, ...MENA]),
  // OCE nu e import în LCS din 2021; în 2026–2027, LATAM (fără Brazilia) e rezident și în LCS.
  lcs: new Set(["US", "CA", "AU", "NZ", ...LATAM]),
};

export function isLeagueRegion(value: string): value is LeagueRegion {
  return (LEAGUE_REGIONS as readonly string[]).includes(value);
}

export function isImportForRegion(player: Pick<Player, "nationalities" | "residentRegions">, region: LeagueRegion): boolean {
  if (player.residentRegions?.includes(region)) return false;
  const home = REGION_HOME_COUNTRIES[region];
  return !player.nationalities.some((code) => home.has(code));
}

export function countImports(players: Pick<Player, "nationalities" | "residentRegions">[], region: LeagueRegion): number {
  return players.filter((player) => isImportForRegion(player, region)).length;
}

const countryNames = typeof Intl !== "undefined" && "DisplayNames" in Intl ? new Intl.DisplayNames(["en"], { type: "region" }) : null;

/** Numele țării în engleză („KR” → „South Korea”); codul, dacă nu se poate traduce. */
export function getCountryName(code: string): string {
  try {
    return countryNames?.of(code) ?? code;
  } catch {
    return code;
  }
}

/** Cod ISO 3166-1 alpha-2 valid (două litere mari, cunoscut de Intl). XK (Kosovo) e acceptat explicit. */
export function isValidCountryCode(code: string): boolean {
  if (!/^[A-Z]{2}$/.test(code)) return false;
  if (code === "XK") return true;
  return getCountryName(code) !== code;
}