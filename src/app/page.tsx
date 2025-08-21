import { LEAGUES, TOP_LEAGUE_CODES } from "@/lib/constants";
import { getMatchesByDateRange, getTodayRange, getNextNDaysRange } from "@/lib/fd";
import MatchCard from "@/components/MatchCard";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { MatchCardSkeleton } from "@/components/ui/skeleton";
import {
  PlayIcon,
  CalendarDaysIcon,
  TrophyIcon,
  ArrowRightIcon,
  SparklesIcon
} from "@heroicons/react/24/outline";
import { PlayIcon as PlaySolidIcon } from "@heroicons/react/24/solid";

export default async function Home() {
  const { from, to } = getTodayRange(0);
  const nx = getNextNDaysRange(7);
  let matches: Awaited<ReturnType<typeof getMatchesByDateRange>> = [];
  let upcoming: Awaited<ReturnType<typeof getMatchesByDateRange>> = [];
  let hasApiKey = false;
  
  try {
    matches = await getMatchesByDateRange(TOP_LEAGUE_CODES, from, to);
    upcoming = await getMatchesByDateRange(TOP_LEAGUE_CODES, nx.from, nx.to);
    hasApiKey = true;
  } catch {
    // When no API key or rate-limited, we show static content instead
    matches = [];
    upcoming = [];
  }

  return (
    <div className="flex flex-col gap-12">
      {/* Enhanced Hero Section */}
      <section className="relative text-center py-16 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 field-pattern opacity-5" />

        <div className="relative max-w-6xl mx-auto">
          {/* Status Badge */}
          <div className="flex justify-center mb-6">
            <Badge variant={hasApiKey ? "success" : "warning"} className="px-4 py-2 text-sm font-semibold">
              {hasApiKey ? (
                <>
                  <PlaySolidIcon className="w-4 h-4 mr-2" />
                  Live Matches Available
                </>
              ) : (
                <>
                  <SparklesIcon className="w-4 h-4 mr-2" />
                  Demo Mode - Get API Key for Live Data
                </>
              )}
            </Badge>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl sm:text-7xl font-bold tracking-tight mb-8">
            <span className="gradient-text animate-gradient bg-gradient-to-r from-gradient-from via-gradient-via to-gradient-to">
              Football, beautifully simple
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl sm:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
            Live scores, fixtures and standings for the top European leagues and Champions League.
            <br className="hidden sm:block" />
            <span className="text-primary font-semibold">Clean, fast, and focused on what matters.</span>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              href="/leagues"
              className="group inline-flex items-center justify-center px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold text-lg hover:bg-primary-hover transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-primary/25 hover:-translate-y-1"
            >
              <TrophyIcon className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              Explore Leagues
              <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>

            {!hasApiKey ? (
              <a
                href="https://www.football-data.org/client/register"
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center justify-center px-8 py-4 rounded-xl glass-card border border-border/50 font-semibold text-lg hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 hover:-translate-y-1"
              >
                <SparklesIcon className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Get API Key
                <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </a>
            ) : (
              <Link
                href="/matches"
                className="group inline-flex items-center justify-center px-8 py-4 rounded-xl glass-card border border-border/50 font-semibold text-lg hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 hover:-translate-y-1"
              >
                <CalendarDaysIcon className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                View All Fixtures
                <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            )}
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">5+</div>
              <div className="text-sm text-muted-foreground">Top Leagues</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">Live</div>
              <div className="text-sm text-muted-foreground">Real-time Updates</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">Free</div>
              <div className="text-sm text-muted-foreground">Always Free</div>
            </div>
          </div>
        </div>
      </section>

      {/* Today's Matches Section */}
      {hasApiKey && matches.length > 0 && (
        <section className="relative">
          <div className="flex items-end justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Badge variant="live" className="px-3 py-1">
                  <PlaySolidIcon className="w-3 h-3 mr-1" />
                  Live
                </Badge>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Today&apos;s Matches</h2>
              </div>
              <p className="text-lg text-muted-foreground">Live scores and fixtures from top leagues</p>
            </div>
            <Link
              href="/matches"
              className="group flex items-center gap-2 px-4 py-2 rounded-lg glass-card border border-border/50 text-sm font-medium hover:border-primary/50 hover:bg-primary/5 transition-all duration-300"
            >
              View all matches
              <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {matches.slice(0, 6).map((m) => (
              <MatchCard key={m.id} match={m} />
            ))}
          </div>
        </section>
      )}

      {/* Upcoming fixtures */}
      {hasApiKey && upcoming.length > 0 && (
        <section>
          <div className="flex items-end justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Upcoming fixtures</h2>
              <p className="text-muted-foreground">Next 7 days across top leagues</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcoming.slice(0, 6).map((m) => (
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
              <div className="relative">
                <div className="flex items-center justify-between mb-4 logo-invert-dark">
                  <div className="flex items-center gap-3">
                    <Image
                      src={
                        league.code === "PL" ? "/premier-league-1.svg" :
                        league.code === "PD" ? "/LaLiga_logo_2023.svg.png" :
                        league.code === "SA" ? "/Serie_A_logo_2022.svg.png" :
                        league.code === "BL1" ? "/Bundesliga_logo_(2017).svg.png" :
                        league.code === "FL1" ? "/Ligue_1_Uber_Eats_logo.svg.png" :
                        "/UEFA_Champions_League.svg.png"
                      }
                      alt=""
                      width={26}
                      height={26}
                      className="object-contain"
                    />
                    <div className="text-xs text-muted-foreground uppercase tracking-wider">
                      {league.country}
                    </div>
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
