import { FD_BASE_URL, LEAGUES, type LeagueCode } from "@/lib/constants";

type FetchOptions = {
  next?: RequestInit["next"];
};

export async function fdFetch<T>(path: string, { next }: FetchOptions = {}): Promise<T> {
  const url = `${FD_BASE_URL}${path}`;
  const headers: HeadersInit = {};
  const apiKey = process.env.FOOTBALL_DATA_API_KEY;
  if (apiKey) {
    headers["X-Auth-Token"] = apiKey;
  }

  const res = await fetch(url, {
    headers,
    // Cache friendly by default on the server
    next,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Football API error ${res.status}: ${text}`);
  }
  return (await res.json()) as T;
}

export type StandingTable = {
  position: number;
  team: { id: number; name: string; crest: string };
  playedGames: number;
  won: number;
  draw: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
};

export async function getStandings(league: LeagueCode, season?: number) {
  const params = new URLSearchParams();
  if (season) params.set("season", String(season));
  const data = await fdFetch<{
    competition: { code: LeagueCode; name: string };
    season: { startDate: string; endDate: string; currentMatchday: number };
    standings: Array<{
      type: string;
      table: StandingTable[];
    }>;
  }>(`/competitions/${league}/standings?${params.toString()}`);

  const table = data.standings.find((s) => s.type === "TOTAL")?.table ?? [];
  return { meta: data.competition, season: data.season, table };
}

export type Match = {
  id: number;
  utcDate: string;
  status: string;
  minute?: string;
  competition: { code: LeagueCode; name: string };
  homeTeam: { id: number; name: string; crest: string };
  awayTeam: { id: number; name: string; crest: string };
  score: {
    winner: "HOME_TEAM" | "AWAY_TEAM" | "DRAW" | null;
    duration: string;
    fullTime: { home: number | null; away: number | null };
    halfTime: { home: number | null; away: number | null };
  };
};

export async function getMatchesByDateRange(
  leagueCodes: LeagueCode[] | LeagueCode,
  dateFrom: string,
  dateTo: string
) {
  const codes = Array.isArray(leagueCodes) ? leagueCodes.join(",") : leagueCodes;
  const params = new URLSearchParams({ competitions: codes, dateFrom, dateTo });
  const data = await fdFetch<{ matches: Match[] }>(`/matches?${params.toString()}`, {
    next: { revalidate: 60 },
  });
  return data.matches;
}

export function getTodayRange(offsetDays = 0) {
  const today = new Date();
  today.setDate(today.getDate() + offsetDays);
  const d = today.toISOString().slice(0, 10);
  return { from: d, to: d };
}

export function getNextNDaysRange(n: number) {
  const start = new Date();
  const end = new Date();
  end.setDate(end.getDate() + n);
  const dateFrom = start.toISOString().slice(0, 10);
  const dateTo = end.toISOString().slice(0, 10);
  return { from: dateFrom, to: dateTo };
}

export const TOP_LEAGUE_CODES: LeagueCode[] = LEAGUES.map((l) => l.code);


