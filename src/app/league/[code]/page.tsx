import { notFound } from "next/navigation";
import { LEAGUES, type LeagueCode } from "@/lib/constants";
import { getMatchesByDateRange, getTodayRange, getStandings } from "@/lib/fd";
import StandingsTable from "@/components/StandingsTable";
import MatchCard from "@/components/MatchCard";

export default async function LeaguePage({ params }: { params: Promise<{ code: LeagueCode }> }) {
  const { code } = await params;
  const league = LEAGUES.find((l) => l.code === code);
  if (!league) return notFound();

  const season = new Date().getMonth() >= 6 ? new Date().getFullYear() : new Date().getFullYear() - 1;
  const { from, to } = getTodayRange(0);

  const [standings, matches] = await Promise.all([
    getStandings(league.code, season).catch(() => null),
    getMatchesByDateRange([league.code], from, to).catch(() => []),
  ]);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <div className="text-sm text-foreground/60">{league.country}</div>
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight" style={{ color: league.accent }}>{league.name}</h1>
      </div>

      {matches && matches.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-3">Today</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {matches.map((m) => (
              <MatchCard key={m.id} match={m} />
            ))}
          </div>
        </section>
      )}

      {standings && (
        <section>
          <h2 className="text-lg font-semibold mb-3">Table</h2>
          <StandingsTable table={standings.table} />
        </section>
      )}

      {!standings && matches.length === 0 && (
        <div className="rounded-2xl border border-dashed border-black/10 dark:border-white/10 p-6 text-center bg-white/50 dark:bg-white/5">
          <div className="text-lg font-semibold mb-1">Connect a free API key</div>
          <p className="text-foreground/70 text-sm">
            Get a free key from <a className="underline" target="_blank" rel="noreferrer" href="https://www.football-data.org/client/register">football-data.org</a> and set <code className="px-1 py-0.5 bg-black/5 dark:bg-white/10 rounded">FOOTBALL_DATA_API_KEY</code> in <code className="px-1 py-0.5 bg-black/5 dark:bg-white/10 rounded">.env.local</code>.
          </p>
        </div>
      )}
    </div>
  );
}


