import { LEAGUES, TOP_LEAGUE_CODES } from "@/lib/constants";
import { getMatchesByDateRange, getTodayRange } from "@/lib/fd";
import MatchCard from "@/components/MatchCard";
import Link from "next/link";

export default async function Home() {
  const { from, to } = getTodayRange(0);
  let matches: Awaited<ReturnType<typeof getMatchesByDateRange>> = [];
  let hasApiKey = false;
  
  try {
    matches = await getMatchesByDateRange(TOP_LEAGUE_CODES, from, to);
    hasApiKey = true;
  } catch {
    // When no API key or rate-limited, we show static content instead
    matches = [];
  }

  return (
    <div className="flex flex-col gap-12">
      {/* Hero Section */}
      <section className="text-center py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-6">
            <span className="gradient-text animate-gradient bg-gradient-to-r from-gradient-from via-gradient-via to-gradient-to">
              Football, beautifully simple
            </span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Live scores, fixtures and standings for the top European leagues and Champions League. 
            Clean, fast, and focused on what matters.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/leagues" 
              className="inline-flex items-center justify-center px-8 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:scale-105 transition-all duration-200 shadow-lg shadow-primary/25"
            >
              Explore Leagues
            </Link>
            {!hasApiKey && (
              <a 
                href="https://www.football-data.org/client/register" 
            target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center px-8 py-3 rounded-xl glass-card border border-border hover:scale-105 transition-all duration-200"
              >
                Get API Key
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Live Matches Section (if API key is available) */}
      {hasApiKey && matches.length > 0 && (
        <section>
          <div className="flex items-end justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Today&apos;s matches</h2>
              <p className="text-muted-foreground">Live scores and fixtures</p>
            </div>
            <Link href="/leagues" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {matches.slice(0, 6).map((m) => (
              <MatchCard key={m.id} match={m} />
            ))}
          </div>
        </section>
      )}

      {/* Leagues Grid */}
      <section>
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
            Top European Leagues
          </h2>
          <p className="text-muted-foreground">
            Premier League • LaLiga • Serie A • Bundesliga • Ligue 1 • Champions League
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {LEAGUES.map((league) => (
            <Link
              key={league.code}
              href={`/league/${league.code}`}
              className="group relative overflow-hidden rounded-2xl glass-card p-6 hover:scale-[1.02] transition-all duration-300 border border-border/50"
            >
              {/* League accent gradient */}
              <div 
                className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-300"
                style={{ 
                  background: `linear-gradient(135deg, ${league.accent}22, transparent 70%)` 
                }}
              />
              
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: league.accent }}
                  />
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">
                    {league.country}
                  </div>
                </div>
                
                <h3 
                  className="text-xl font-bold mb-2 group-hover:scale-105 transition-transform duration-200"
                  style={{ color: league.accent }}
                >
                  {league.name}
                </h3>
                
                <p className="text-sm text-muted-foreground mb-4">
                  View fixtures, results and standings
                </p>
                
                <div className="flex items-center text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                  <span>Explore</span>
                  <svg className="ml-1 w-3 h-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
            Why andscore?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Built for football fans who want clean, fast access to what matters most
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gradient-from to-gradient-via mx-auto mb-4 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="font-semibold mb-2">Lightning Fast</h3>
            <p className="text-sm text-muted-foreground">
              Built with Next.js and optimized for speed. Get your scores instantly.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gradient-via to-gradient-to mx-auto mb-4 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="font-semibold mb-2">Clean Design</h3>
            <p className="text-sm text-muted-foreground">
              No clutter, no ads. Just beautiful, focused football data.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gradient-to to-gradient-from mx-auto mb-4 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="font-semibold mb-2">Top Leagues Only</h3>
            <p className="text-sm text-muted-foreground">
              Focused on the Premier League, LaLiga, Serie A, Bundesliga, Ligue 1, and UCL.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
