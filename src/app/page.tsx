import { LEAGUES, TOP_LEAGUE_CODES } from "@/lib/constants";
import { getMatchesByDateRange, getTodayRange } from "@/lib/fd";
import MatchCard from "@/components/MatchCard";
import Link from "next/link";

export default async function Home() {
  const { from, to } = getTodayRange(0);
  let matches: Awaited<ReturnType<typeof getMatchesByDateRange>> = [];
  try {
    matches = await getMatchesByDateRange(TOP_LEAGUE_CODES, from, to);
  } catch {
    // When no API key or rate-limited, we gracefully show a CTA
    matches = [];
  }

  return (
    <div className="flex flex-col gap-8">
      <section className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">Today’s football</h1>
          <p className="text-foreground/60 text-sm">Top 5 leagues + Champions League</p>
        </div>
        <Link href="/leagues" className="text-sm text-foreground/70 hover:text-foreground">All leagues →</Link>
      </section>

      {matches.length > 0 ? (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {matches.map((m) => (
            <MatchCard key={m.id} match={m} />
          ))}
        </section>
      ) : (
        <section className="rounded-2xl border border-dashed border-black/10 dark:border-white/10 p-6 text-center bg-white/50 dark:bg-white/5">
          <div className="text-lg font-semibold mb-1">Add your free API key</div>
          <p className="text-foreground/70 text-sm">
            Get a free key from <a className="underline" target="_blank" rel="noreferrer" href="https://www.football-data.org/client/register">football-data.org</a>
            , then set <code className="px-1 py-0.5 bg-black/5 dark:bg-white/10 rounded">FOOTBALL_DATA_API_KEY</code> in <code className="px-1 py-0.5 bg-black/5 dark:bg-white/10 rounded">.env.local</code> and restart the server.
          </p>
        </section>
      )}

      <section className="flex flex-wrap gap-3">
        {LEAGUES.map((l) => (
          <Link
            key={l.code}
            href={`/league/${l.code}`}
            className="rounded-full border px-3 py-1.5 text-sm"
            style={{ borderColor: `${l.accent}66`, color: l.accent }}
          >
            {l.name}
          </Link>
        ))}
      </section>
    </div>
  );
}
