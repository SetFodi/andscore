// Shared API response types for consistent typing across routes

export type ApiResponse<T = unknown> = 
  | { success: true; data: T }
  | { success: false; error: string; status?: number };

export type MatchesApiResponse = {
  matches: Array<{
    id: number;
    utcDate: string;
    status: string;
    minute?: string;
    competition: { code: string; name: string };
    homeTeam: { id: number; name: string; crest: string };
    awayTeam: { id: number; name: string; crest: string };
    score: {
      winner: "HOME_TEAM" | "AWAY_TEAM" | "DRAW" | null;
      duration: string;
      fullTime: { home: number | null; away: number | null };
      halfTime: { home: number | null; away: number | null };
    };
  }>;
};

export type StandingsApiResponse = {
  competition: { code: string; name: string };
  season: { startDate: string; endDate: string; currentMatchday: number };
  standings: Array<{
    type: string;
    table: Array<{
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
    }>;
  }>;
};

export type EventsApiResponse = {
  events: Array<{
    minute: string | null;
    type: "goal";
    team: "home" | "away" | null;
    player: string | null;
    assist: string | null;
    detail: string | null;
  }>;
  fixtureId?: string | number;
  debug?: Record<string, unknown>;
};

// Error response helper
export function apiError(message: string, status = 500): Response {
  return Response.json(
    { success: false, error: message },
    { status, headers: { "cache-control": "no-store" } }
  );
}

// Success response helper
export function apiSuccess<T>(data: T, cacheSeconds = 30): Response {
  return Response.json(
    { success: true, data },
    {
      status: 200,
      headers: { "cache-control": `public, max-age=${cacheSeconds}` }
    }
  );
}

