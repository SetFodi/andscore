import { notFound } from "next/navigation";
import { LEAGUES, type LeagueCode } from "@/lib/constants";
import { getMatchesByDateRange, getTodayRange, getNextNDaysRange, getStandings } from "@/lib/fd";
import StandingsTable from "@/components/StandingsTable";
import MatchCard from "@/components/MatchCard";

export default async function LeaguePage({ params }: { params: Promise<{ code: LeagueCode }> }) {
  const { code } = await params;
  const league = LEAGUES.find((l) => l.code === code);
  if (!league) return notFound();

  const season = new Date().getMonth() >= 6 ? new Date().getFullYear() : new Date().getFullYear() - 1;
  const { from, to } = getTodayRange(0);
  const nx = getNextNDaysRange(7);

  const [standings, matches, upcoming] = await Promise.all([
    getStandings(league.code, season).catch(() => null),
    getMatchesByDateRange([league.code], from, to).catch(() => []),
    getMatchesByDateRange([league.code], nx.from, nx.to).catch(() => []),
  ]);

  return (
    <div className="flex flex-col gap-10">
      {/* League Header */}
      <div className="text-center py-8">
        <div className="text-sm text-muted-foreground uppercase tracking-wider mb-2">{league.country}</div>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4" style={{ color: league.accent }}>
          {league.name}
        </h1>
        <div 
          className="w-16 h-1 rounded-full mx-auto"
          style={{ backgroundColor: league.accent }}
        />
      </div>

      {/* Today's Matches */}
      {matches && matches.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-2xl font-bold tracking-tight">Today&apos;s Matches</h2>
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {matches.map((m) => (
              <MatchCard key={m.id} match={m} />
            ))}
          </div>
        </section>
      )}

      {/* League Table */}
      {standings && (
        <section>
          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight mb-2">League Table</h2>
            <p className="text-muted-foreground">Season {standings.season.startDate.slice(0, 4)}/{standings.season.endDate.slice(2, 4)} • Matchday {standings.season.currentMatchday}</p>
          </div>
          <StandingsTable table={standings.table} />
          
          {/* Table Legend */}
          <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span>Champions League</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span>Europa League</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span>Relegation</span>
            </div>
          </div>
        </section>
      )}

      {/* Upcoming fixtures */}
      {upcoming && upcoming.length > 0 && (
        <section>
          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight">Upcoming fixtures</h2>
            <p className="text-muted-foreground">Next 7 days</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcoming.map((m) => (
              <MatchCard key={m.id} match={m} />
            ))}
          </div>
        </section>
      )}

      {/* API Key CTA */}
      {!standings && matches.length === 0 && (
        <div className="text-center py-12">
          <div className="glass-card rounded-2xl p-8 border border-border/50 max-w-md mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gradient-from to-gradient-via mx-auto mb-4 flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-3.586l4.293-4.293a1 1 0 01.707-.293h2.414l1.06-1.06A6 6 0 1121 9z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Connect Your API Key</h3>
            <p className="text-muted-foreground mb-6">
              Get live data for {league.name} by adding your free API key from football-data.org
            </p>
            <a 
              href="https://www.football-data.org/client/register" 
              target="_blank" 
              rel="noreferrer"
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:scale-105 transition-all duration-200"
            >
              Get Free API Key
            </a>
          </div>
        </div>
      )}
    </div>
  );
}


