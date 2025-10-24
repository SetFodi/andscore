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

// Best-effort approximation when provider does not supply a minute.
// Handles first half, half-time pause, second half, and stoppage time.
function computeApproxMinute(status: string, utcDate: string): string | null {
  const kickoff = new Date(utcDate);
  if (Number.isNaN(kickoff.getTime())) return null;

  const now = new Date();
  const elapsedMs = now.getTime() - kickoff.getTime();
  if (elapsedMs < 0) return null; // not started yet

  const elapsedMin = Math.floor(elapsedMs / 60000);

  // If game is paused around half-time window, show HT
  if (status === "PAUSED") {
    if (elapsedMin >= 45 && elapsedMin <= 65) return "HT";
    // Other pauses (cooling break, VAR) – display last known minute approximation
  }

  if (status === "IN_PLAY" || status === "LIVE") {
    // Account for a typical half-time break ~15 min. If we've passed ~60 min since KO,
    // subtract 15 to approximate second-half clock.
    if (elapsedMin <= 45) return `${elapsedMin}'`;
    if (elapsedMin <= 60) return "45+'"; // stoppage + short into break window
    const secondHalf = elapsedMin - 15; // subtract half-time
    if (secondHalf <= 90) return `${secondHalf}'`;
    return `90+'`;
  }

  return null;
}

export function getLiveMinute(match: Match): string | null {
  // Prefer provider minute if present
  if (match.minute) {
    // Normalize common textual statuses
    const lower = match.minute.toLowerCase();
    if (lower.includes("ht")) return "HT";

    const minute = parseInt(match.minute, 10);
    if (!Number.isNaN(minute)) {
      if (minute <= 45) return `${minute}'`;
      if (minute <= 90) return `${minute}'`;
      if (minute > 90) return `90+'`;
    }
    return match.minute;
  }

  // Derive when not supplied by provider
  const derived = computeApproxMinute(match.status, match.utcDate);
  return derived;
}

export function getDisplayedScore(match: Match): { home: number | string; away: number | string } {
  // First, try fullTime scores (most reliable for finished matches)
  const ft = match.score?.fullTime;
  if (ft && (typeof ft.home === "number" || typeof ft.away === "number")) {
    return {
      home: typeof ft.home === "number" ? ft.home : (ft.home === 0 ? 0 : "-"),
      away: typeof ft.away === "number" ? ft.away : (ft.away === 0 ? 0 : "-"),
    };
  }

  // Fallback to halfTime if available (for matches in progress)
  const ht = match.score?.halfTime;
  if (ht && (typeof ht.home === "number" || typeof ht.away === "number")) {
    return {
      home: typeof ht.home === "number" ? ht.home : (ht.home === 0 ? 0 : "-"),
      away: typeof ht.away === "number" ? ht.away : (ht.away === 0 ? 0 : "-"),
    };
  }

  // Log for debugging if no scores found for finished matches
  if (["FINISHED", "AWARDED"].includes(match.status)) {
    console.warn(`No scores found for finished match: ${match.homeTeam.name} vs ${match.awayTeam.name}`, {
      status: match.status,
      score: match.score
    });
  }

  return { home: "-", away: "-" };
}

export function formatKickoffTime(utcIso: string, timeZone: "local" | "utc" | string = "local"): string {
  const ko = new Date(utcIso);
  const tz = timeZone === "local" ? undefined : timeZone === "utc" ? "UTC" : timeZone;
  try {
    return ko.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", timeZone: tz });
  } catch {
    // Fallback in rare TZ errors
    return ko.toISOString().slice(11, 16);
  }
}

export function formatKickoffDate(utcIso: string, localeOpts?: Intl.DateTimeFormatOptions): string {
  const ko = new Date(utcIso);
  try {
    return ko.toLocaleDateString([], localeOpts ?? { weekday: "short", month: "short", day: "numeric" });
  } catch {
    return ko.toISOString().slice(0, 10);
  }
}


