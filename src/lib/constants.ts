export type LeagueCode = "PL" | "FL1" | "BL1" | "PD" | "SA" | "CL";

export const LEAGUES: Array<{
  code: LeagueCode;
  name: string;
  country: string;
  accent: string;
}> = [
  { code: "PL", name: "Premier League", country: "England", accent: "#5C2D91" },
  { code: "PD", name: "LaLiga", country: "Spain", accent: "#C70C0C" },
  { code: "SA", name: "Serie A", country: "Italy", accent: "#1D9BF0" },
  { code: "BL1", name: "Bundesliga", country: "Germany", accent: "#E10600" },
  { code: "FL1", name: "Ligue 1", country: "France", accent: "#FFD300" },
  { code: "CL", name: "Champions League", country: "Europe", accent: "#003399" },
];

export const DEFAULT_LEAGUE: LeagueCode = "PL";

export const FD_BASE_URL = "https://api.football-data.org/v4";

export const ANDSCORE_BRAND_NAME = "AndScore";

export const TOP_LEAGUE_CODES: LeagueCode[] = LEAGUES.map((l) => l.code);


