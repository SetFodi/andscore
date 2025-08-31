import { NextRequest, NextResponse } from "next/server";
import type { LeagueCode } from "@/lib/constants";

// Mapping Football-Data.org league codes to API-Football numeric IDs
const AF_LEAGUE_IDS: Record<LeagueCode, number> = {
  PL: 39,   // Premier League
  PD: 140,  // LaLiga
  SA: 135,  // Serie A
  BL1: 78,  // Bundesliga
  FL1: 61,  // Ligue 1
  CL: 2,    // UEFA Champions League
};

// Minimal typings for API-Football responses we use
interface AFTeamRef { name?: string }
interface AFFixtureInfo { id: number; date: string }
interface AFLeagueRef { id?: number }
interface AFFixture {
  fixture?: AFFixtureInfo;
  teams?: { home?: AFTeamRef; away?: AFTeamRef };
  league?: AFLeagueRef;
}
interface AFFixturesResponse { response?: AFFixture[] }

interface AFEventTime { elapsed?: number; extra?: number }
interface AFEventItem {
  type?: string;
  time?: AFEventTime;
  team?: AFTeamRef;
  player?: { name?: string };
  assist?: { name?: string };
  detail?: string;
}
interface AFEventsResponse { response?: AFEventItem[] }

interface AFTeamInfo { id?: number; name?: string }
interface AFTeamItem { team?: AFTeamInfo }
interface AFTeamsResponse { response?: AFTeamItem[] }

function computeAFSeason(d: Date) {
  const m = d.getUTCMonth() + 1; // 1-12
  const y = d.getUTCFullYear();
  // Most European seasons start in July/August
  return m >= 7 ? y : y - 1;
}

function normalizeName(name: string) {
  return name
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "") // strip diacritics
    .toLowerCase()
    .replace(/[-–—']/g, " ")
    .replace(/\./g, " ")
    .replace(/\b(fc|cf|afc|sc|club|cd|ac|calcio|deportivo|ud|sd|real)\b/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function isTeamMatch(a: string, b: string) {
  const na = normalizeName(a);
  const nb = normalizeName(b);
  return na === nb || na.includes(nb) || nb.includes(na);
}

async function getTeamIdBySearch(name: string, leagueId: number, season: number, init: RequestInit & { next?: { revalidate?: number } }): Promise<number | null> {
  const url = new URL("https://v3.football.api-sports.io/teams");
  url.searchParams.set("search", name);
  url.searchParams.set("league", String(leagueId));
  url.searchParams.set("season", String(season));
  const res = await fetch(url, init);
  if (!res.ok) return null;
  const data: AFTeamsResponse = await res.json();
  const items = data?.response ?? [];
  // pick the best match by normalized name
  for (const it of items) {
    const tname = it?.team?.name;
    if (tname && isTeamMatch(tname, name)) {
      return it.team?.id ?? null;
    }
  }
  // fallback to first if present
  return items[0]?.team?.id ?? null;
}

export async function GET(req: NextRequest) {
  try {
    const apiKey = process.env.APISPORTS_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "APISPORTS_KEY missing" }, { status: 500 });
    }

    const url = new URL(req.url);
    const comp = url.searchParams.get("comp") as LeagueCode | null;
    const utcDate = url.searchParams.get("utcDate");
    const home = url.searchParams.get("home");
    const away = url.searchParams.get("away");
    const wantDebug = url.searchParams.get("debug") === "1";

    if (!comp || !utcDate || !home || !away) {
      return NextResponse.json({ error: "Missing required query params: comp, utcDate, home, away" }, { status: 400 });
    }

    const leagueId = AF_LEAGUE_IDS[comp];
    if (!leagueId) {
      return NextResponse.json({ error: `Unsupported league code: ${comp}` }, { status: 400 });
    }

    const date = new Date(utcDate);
    if (isNaN(date.getTime())) {
      return NextResponse.json({ error: "Invalid utcDate" }, { status: 400 });
    }

    const ymd = date.toISOString().slice(0, 10); // YYYY-MM-DD
    const season = computeAFSeason(date);

    const fixturesUrl = new URL("https://v3.football.api-sports.io/fixtures");
    fixturesUrl.searchParams.set("date", ymd);
    fixturesUrl.searchParams.set("league", String(leagueId));
    fixturesUrl.searchParams.set("season", String(season));
    fixturesUrl.searchParams.set("timezone", "UTC");

    const commonInit: RequestInit & { next?: { revalidate?: number } } = {
      headers: { "x-apisports-key": apiKey },
      // light caching to reduce API usage while keeping data fresh
      next: { revalidate: 20 },
    };

    const fxRes = await fetch(fixturesUrl, commonInit);
    if (!fxRes.ok) {
      const t = await fxRes.text().catch(() => "");
      return NextResponse.json({ error: `AF fixtures error ${fxRes.status}: ${t}` }, { status: fxRes.status });
    }
    const fxData: AFFixturesResponse = await fxRes.json();
    let fixtures: AFFixture[] = fxData?.response ?? [];

    // Find the matching fixture by teams and close kickoff time
    let matchFixture = fixtures.find((f) => {
      const fh = f?.teams?.home?.name as string | undefined;
      const fa = f?.teams?.away?.name as string | undefined;
      if (!fh || !fa) return false;
      const homeOk = isTeamMatch(fh, home);
      const awayOk = isTeamMatch(fa, away);
      if (!homeOk || !awayOk) return false;
      const fDateStr = f?.fixture?.date as string | undefined;
      if (!fDateStr) return false;
      const fDate = new Date(fDateStr);
      const diffMin = Math.abs((fDate.getTime() - date.getTime()) / 60000);
      return diffMin <= 180; // within 3 hours window
    });

    // Fallback: broaden search to ±1 day window using from/to
    if (!matchFixture) {
      const from = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() - 1));
      const to = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + 1));
      const fmt = (d: Date) => d.toISOString().slice(0, 10);
      const alt = new URL("https://v3.football.api-sports.io/fixtures");
      alt.searchParams.set("from", fmt(from));
      alt.searchParams.set("to", fmt(to));
      alt.searchParams.set("league", String(leagueId));
      alt.searchParams.set("season", String(season));
      alt.searchParams.set("timezone", "UTC");
      const altRes = await fetch(alt, commonInit);
      if (altRes.ok) {
        const altData: AFFixturesResponse = await altRes.json();
        fixtures = altData?.response ?? [];
        matchFixture = fixtures.find((f) => {
          const fh = f?.teams?.home?.name as string | undefined;
          const fa = f?.teams?.away?.name as string | undefined;
          if (!fh || !fa) return false;
          const homeOk = isTeamMatch(fh, home);
          const awayOk = isTeamMatch(fa, away);
          if (!homeOk || !awayOk) return false;
          return true;
        });
      }
    }

    let fixtureId: number | null = matchFixture?.fixture?.id ?? null;

    // Fallback: resolve by team ID search if not found by simple date+league
    if (!fixtureId) {
      const homeId = await getTeamIdBySearch(home, leagueId, season, commonInit);
      if (homeId) {
        const altUrl = new URL("https://v3.football.api-sports.io/fixtures");
        altUrl.searchParams.set("date", ymd);
        altUrl.searchParams.set("league", String(leagueId));
        altUrl.searchParams.set("season", String(season));
        altUrl.searchParams.set("team", String(homeId));
        altUrl.searchParams.set("timezone", "UTC");
        const altRes = await fetch(altUrl, commonInit);
        if (altRes.ok) {
          const altData: AFFixturesResponse = await altRes.json();
          const altFixtures: AFFixture[] = altData?.response ?? [];
          const f = altFixtures.find((f) => isTeamMatch(f?.teams?.away?.name ?? "", away));
          fixtureId = f?.fixture?.id ?? null;
        }
      }

      if (!fixtureId) {
        const awayId = await getTeamIdBySearch(away, leagueId, season, commonInit);
        if (awayId) {
          const altUrl = new URL("https://v3.football.api-sports.io/fixtures");
          altUrl.searchParams.set("date", ymd);
          altUrl.searchParams.set("league", String(leagueId));
          altUrl.searchParams.set("season", String(season));
          altUrl.searchParams.set("team", String(awayId));
          altUrl.searchParams.set("timezone", "UTC");
          const altRes = await fetch(altUrl, commonInit);
          if (altRes.ok) {
            const altData: AFFixturesResponse = await altRes.json();
            const altFixtures: AFFixture[] = altData?.response ?? [];
            const f = altFixtures.find((f) => isTeamMatch(f?.teams?.home?.name ?? "", home));
            fixtureId = f?.fixture?.id ?? null;
          }
        }
      }

      // H2H-based fallback using both team IDs, filtered by league and closest date
      if (!fixtureId) {
        const homeId2 = await getTeamIdBySearch(home, leagueId, season, commonInit);
        const awayId2 = await getTeamIdBySearch(away, leagueId, season, commonInit);
        if (homeId2 && awayId2) {
          const h2hUrl = new URL("https://v3.football.api-sports.io/fixtures");
          h2hUrl.searchParams.set("h2h", `${homeId2}-${awayId2}`);
          h2hUrl.searchParams.set("from", ymd);
          h2hUrl.searchParams.set("to", ymd);
          h2hUrl.searchParams.set("season", String(season));
          h2hUrl.searchParams.set("timezone", "UTC");
          const hRes = await fetch(h2hUrl, commonInit);
          if (hRes.ok) {
            const hData: AFFixturesResponse = await hRes.json();
            const hFixtures: AFFixture[] = hData?.response ?? [];
            const filtered = hFixtures.filter((f) => (typeof f?.league?.id === 'number' ? f.league!.id === leagueId : true));
            let best: AFFixture | undefined;
            let bestDiff = Infinity;
            for (const f of filtered) {
              const ds = f?.fixture?.date;
              if (!ds) continue;
              const dt = new Date(ds);
              const diff = Math.abs(dt.getTime() - date.getTime());
              if (diff < bestDiff) {
                best = f;
                bestDiff = diff;
              }
            }
            fixtureId = best?.fixture?.id ?? null;
          }
        }
      }
    }

    if (!fixtureId) {
      return NextResponse.json({ events: [], note: "No matching fixture found" }, { status: 200 });
    }

    const eventsUrl = new URL("https://v3.football.api-sports.io/fixtures/events");
    eventsUrl.searchParams.set("fixture", String(fixtureId));

    const evRes = await fetch(eventsUrl, commonInit);
    if (!evRes.ok) {
      const t = await evRes.text().catch(() => "");
      return NextResponse.json({ error: `AF events error ${evRes.status}: ${t}` }, { status: evRes.status });
    }
    const evData: AFEventsResponse = await evRes.json();
    const afEvents: AFEventItem[] = evData?.response ?? [];

    // Normalize and filter to goals only for now (expandable if needed)
    const normalized = afEvents
      .filter((e) => e?.type === "Goal")
      .map((e) => {
        const elapsed: number | undefined = e?.time?.elapsed;
        const extra: number | undefined = e?.time?.extra;
        const minuteStr = typeof elapsed === "number"
          ? (typeof extra === "number" && extra > 0 ? `${elapsed}+${extra}'` : `${elapsed}'`)
          : null;
        const teamName: string | undefined = e?.team?.name;
        const isHome = teamName ? isTeamMatch(teamName, home) : undefined;
        return {
          minute: minuteStr,
          type: "goal" as const,
          team: isHome === undefined ? null : (isHome ? "home" : "away"),
          player: e?.player?.name ?? null,
          assist: e?.assist?.name ?? null,
          detail: e?.detail ?? null,
        };
      });

    const body: Record<string, unknown> = { events: normalized, fixtureId };
    if (wantDebug) {
      body.debug = {
        comp,
        ymd,
        season,
        matched: Boolean(fixtureId),
        count: afEvents.length,
      };
    }
    return NextResponse.json(
      body,
      { status: 200, headers: { "cache-control": "public, max-age=15" } }
    );
  } catch (err) {
    console.error("AF events route error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
