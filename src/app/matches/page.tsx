"use client";
import { LEAGUES, TOP_LEAGUE_CODES, type LeagueCode } from "@/lib/constants";
import { getMatchesByDateRange } from "@/lib/fd";
import MatchCard from "@/components/MatchCard";
import DatePicker from "@/components/DatePicker";
import { useEffect, useMemo, useState } from "react";
import { format, addDays, subDays, isSameDay, isToday } from "date-fns";

type MatchType = Awaited<ReturnType<typeof getMatchesByDateRange>>[number];
type ViewMode = "cards" | "list";
type FilterTab = "all" | "live" | "today" | "upcoming" | "favorites";

export default function MatchesPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [activeTab, setActiveTab] = useState<FilterTab>("today");
  const [viewMode, setViewMode] = useState<ViewMode>("cards");
  const [favoriteLeagues, setFavoriteLeagues] = useState<LeagueCode[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = localStorage.getItem("fav_leagues");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [matches, setMatches] = useState<MatchType[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch matches based on active tab and date
  useEffect(() => {
    setLoading(true);
    let fromDate: string, toDate: string;

    switch (activeTab) {
      case "live":
      case "today": {
        // Fetch a full 24h window to be safe with provider date boundaries
        fromDate = format(selectedDate, "yyyy-MM-dd");
        toDate = format(addDays(selectedDate, 1), "yyyy-MM-dd");
        break;
      }
      case "upcoming":
        fromDate = format(selectedDate, "yyyy-MM-dd");
        toDate = format(addDays(selectedDate, 7), "yyyy-MM-dd");
        break;
      default:
        fromDate = format(subDays(selectedDate, 1), "yyyy-MM-dd");
        toDate = format(addDays(selectedDate, 7), "yyyy-MM-dd");
    }

    getMatchesByDateRange(TOP_LEAGUE_CODES, fromDate, toDate)
      .then(setMatches)
      .catch(() => setMatches([]))
      .finally(() => setLoading(false));
  }, [activeTab, selectedDate]);

  // Filter and group matches
  const filteredMatches = useMemo(() => {
    let filtered = matches;

    // Apply tab filters
    switch (activeTab) {
      case "live":
        filtered = matches.filter(m => ["IN_PLAY", "PAUSED", "LIVE"].includes(m.status));
        break;
      case "today":
        filtered = matches.filter(m => isSameDay(new Date(m.utcDate), selectedDate));
        break;
      case "upcoming":
        filtered = matches.filter(m => new Date(m.utcDate) >= new Date(format(selectedDate, "yyyy-MM-dd")));
        break;
      case "favorites":
        filtered = matches.filter(m => favoriteLeagues.includes(m.competition.code as LeagueCode));
        break;
    }

    // Group by date then by league
    const grouped: Record<string, Record<LeagueCode, MatchType[]>> = {};
    
    filtered.forEach(match => {
      const dateKey = format(new Date(match.utcDate), "yyyy-MM-dd");
      const leagueCode = match.competition.code as LeagueCode;
      
      if (!grouped[dateKey]) grouped[dateKey] = {} as Record<LeagueCode, MatchType[]>;
      if (!grouped[dateKey][leagueCode]) grouped[dateKey][leagueCode] = [];
      
      grouped[dateKey][leagueCode].push(match);
    });

    return grouped;
  }, [matches, activeTab, selectedDate, favoriteLeagues]);

  const toggleFavorite = (code: LeagueCode) => {
    setFavoriteLeagues(prev => {
      const updated = prev.includes(code) 
        ? prev.filter(c => c !== code)
        : [...prev, code];
      localStorage.setItem("fav_leagues", JSON.stringify(updated));
      return updated;
    });
  };

  const quickDateButtons = useMemo(() => {
    const today = new Date();
    return [
      { label: "Yesterday", date: subDays(today, 1) },
      { label: "Today", date: today },
      { label: "Tomorrow", date: addDays(today, 1) },
    ];
  }, []);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="sticky top-16 z-40 glass-card border-b border-border/30 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col gap-4">
            {/* Top row: Title and view controls */}
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold gradient-text">Football Fixtures</h1>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode(viewMode === "cards" ? "list" : "cards")}
                  className="p-2 rounded-xl glass-card border border-border/50 hover:scale-105 transition-all"
                >
                  {viewMode === "cards" ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <line x1="8" y1="6" x2="21" y2="6"></line>
                      <line x1="8" y1="12" x2="21" y2="12"></line>
                      <line x1="8" y1="18" x2="21" y2="18"></line>
                      <line x1="3" y1="6" x2="3.01" y2="6"></line>
                      <line x1="3" y1="12" x2="3.01" y2="12"></line>
                      <line x1="3" y1="18" x2="3.01" y2="18"></line>
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <rect x="3" y="3" width="7" height="7"></rect>
                      <rect x="14" y="3" width="7" height="7"></rect>
                      <rect x="14" y="14" width="7" height="7"></rect>
                      <rect x="3" y="14" width="7" height="7"></rect>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Filter tabs */}
            <div className="flex flex-wrap gap-2">
              {([
                { key: "all", label: "All", icon: "🌐" },
                { key: "live", label: "Live", icon: "🔴" },
                { key: "today", label: "Today", icon: "📅" },
                { key: "upcoming", label: "Upcoming", icon: "⏭️" },
                { key: "favorites", label: "Favorites", icon: "⭐" },
              ] as const).map(({ key, label, icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                    activeTab === key
                      ? "bg-primary text-primary-foreground shadow-lg"
                      : "glass-card border border-border/50 hover:scale-105"
                  }`}
                >
                  <span>{icon}</span>
                  <span className="text-sm">{label}</span>
                </button>
              ))}
            </div>

            {/* Date controls */}
            <div className="flex items-center gap-3 flex-wrap">
              <DatePicker selected={selectedDate} onSelect={setSelectedDate} />
              
              <div className="flex gap-2">
                {quickDateButtons.map(({ label, date }) => (
                  <button
                    key={label}
                    onClick={() => setSelectedDate(date)}
                    className={`px-3 py-1.5 rounded-xl text-sm transition-all ${
                      isSameDay(selectedDate, date)
                        ? "bg-primary text-primary-foreground"
                        : "glass-card border border-border/50 hover:scale-105"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : Object.keys(filteredMatches).length === 0 ? (
          <div className="text-center py-16">
            <div className="glass-card rounded-2xl p-8 border border-border/50 max-w-md mx-auto">
              <div className="text-6xl mb-4">⚽</div>
              <div className="text-lg font-semibold mb-2">No matches found</div>
              <p className="text-muted-foreground">
                Try selecting a different date or filter.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(filteredMatches)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([date, leagueMatches]) => (
                <div key={date} className="space-y-6">
                  <div className="sticky top-40 z-30 glass-card rounded-xl p-3 border border-border/30">
                    <h2 className="text-lg font-bold">
                      {isToday(new Date(date)) ? "Today" : format(new Date(date), "EEEE, MMMM d")}
                    </h2>
                  </div>

                  {LEAGUES
                    .filter(league => leagueMatches[league.code]?.length > 0)
                    .sort((a, b) => {
                      const aFav = favoriteLeagues.includes(a.code);
                      const bFav = favoriteLeagues.includes(b.code);
                      if (aFav && !bFav) return -1;
                      if (!aFav && bFav) return 1;
                      return 0;
                    })
                    .map(league => (
                      <div key={league.code} className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <h3 className="text-lg font-semibold" style={{ color: league.accent }}>
                              {league.name}
                            </h3>
                            <button
                              onClick={() => toggleFavorite(league.code)}
                              className={`p-1 rounded-lg transition-all ${
                                favoriteLeagues.includes(league.code)
                                  ? "text-yellow-500"
                                  : "text-muted-foreground hover:text-yellow-500"
                              }`}
                            >
                              ⭐
                            </button>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {leagueMatches[league.code].length} matches
                          </span>
                        </div>

                        {viewMode === "cards" ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {leagueMatches[league.code].map(match => (
                              <MatchCard key={match.id} match={match} showLeague={false} />
                            ))}
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {leagueMatches[league.code].map(match => (
                              <div key={match.id} className="glass-card rounded-xl p-4 border border-border/50">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-4">
                                    <div className="text-sm font-medium">
                                      {format(new Date(match.utcDate), "HH:mm")}
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <span>{match.homeTeam.name}</span>
                                      <span className="text-muted-foreground">vs</span>
                                      <span>{match.awayTeam.name}</span>
                                    </div>
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    {match.status === "FINISHED" ? "FT" : 
                                     ["IN_PLAY", "PAUSED", "LIVE"].includes(match.status) ? "LIVE" : 
                                     format(new Date(match.utcDate), "HH:mm")}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}


