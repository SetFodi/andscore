"use client";
import { LEAGUES, TOP_LEAGUE_CODES, type LeagueCode } from "@/lib/constants";
import type { Match } from "@/lib/fd";
import { getLiveMinute } from "@/lib/fd";
import MatchCard from "@/components/MatchCard";
import LiveTicker from "@/components/LiveTicker";
import FiltersBar, { type FilterTab } from "@/components/FiltersBar";
import { Badge } from "@/components/ui/badge";
import { MatchLoadingState } from "@/components/ui/loading";
import { useMatchModal } from "@/components/MatchModalProvider";
import { useFavorites } from "@/hooks/useFavorites";
import { useEffect, useMemo, useState } from "react";
import { format, addDays, subDays, isSameDay, isToday, startOfDay, endOfDay, isWithinInterval } from "date-fns";
import { formatKickoffTime } from "@/lib/fd";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarDaysIcon,
  ViewColumnsIcon,
  ListBulletIcon,
  // PlayIcon as PlaySolidIcon,
  SparklesIcon
} from "@heroicons/react/24/outline";

type MatchType = Match;
type ViewMode = "cards" | "list";

export default function MatchesPage() {
  const { openMatchModal } = useMatchModal();
  const { favoriteTeams } = useFavorites();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [activeTab, setActiveTab] = useState<FilterTab>("today");
  const [viewMode, setViewMode] = useState<ViewMode>("cards");
  const [selectedLeague, setSelectedLeague] = useState<LeagueCode | null>(null);
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

  // Fetch matches based on a date range
  async function fetchMatches(fromDate: string, toDate: string) {
    const qs = new URLSearchParams({
      competitions: TOP_LEAGUE_CODES.join(","),
      dateFrom: fromDate,
      dateTo: toDate,
    });
    const res = await fetch(`/api/fd/matches?${qs.toString()}`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch matches");
    const data = await res.json();
    return (data.matches || []) as MatchType[];
  }

  // Centralized range selection per tab, decoupled from date logic
  function getRangeForTab(tab: FilterTab, date: Date) {
    switch (tab) {
      case "live": {
        const from = format(date, "yyyy-MM-dd");
        const to = format(addDays(date, 1), "yyyy-MM-dd");
        return { from, to };
      }
      case "today": {
        const from = format(date, "yyyy-MM-dd");
        const to = format(addDays(date, 1), "yyyy-MM-dd");
        return { from, to };
      }
      case "upcoming": {
        const from = format(date, "yyyy-MM-dd");
        const to = format(addDays(date, 14), "yyyy-MM-dd");
        return { from, to };
      }
      case "finished": {
        const from = format(subDays(date, 7), "yyyy-MM-dd");
        const to = format(addDays(date, 1), "yyyy-MM-dd");
        return { from, to };
      }
      case "favorites": {
        const from = format(subDays(date, 3), "yyyy-MM-dd");
        const to = format(addDays(date, 21), "yyyy-MM-dd");
        return { from, to };
      }
      default: {
        const from = format(subDays(date, 7), "yyyy-MM-dd");
        const to = format(addDays(date, 7), "yyyy-MM-dd");
        return { from, to };
      }
    }
  }

  useEffect(() => {
    setLoading(true);
    const { from, to } = getRangeForTab(activeTab, selectedDate);
    fetchMatches(from, to)
      .then((m) => setMatches(m))
      .catch(() => setMatches([]))
      .finally(() => setLoading(false));
  }, [activeTab, selectedDate]);

  // Filter and group matches with exact-day logic and league enablement
  const filteredMatches = useMemo(() => {
    const enabledSet = new Set(TOP_LEAGUE_CODES.filter(() => true));
    let base = matches.filter((m) => enabledSet.has(m.competition.code as LeagueCode));

    // Apply league filter if selected
    if (selectedLeague) {
      base = base.filter((m) => m.competition.code === selectedLeague);
    }

    // Check if selected date is different from today
    const isSelectedDateToday = isSameDay(selectedDate, new Date());

    if (activeTab === "live") {
      base = base.filter((m) => ["IN_PLAY", "PAUSED", "LIVE"].includes(m.status));
    } else if (activeTab === "today") {
      const start = startOfDay(selectedDate);
      const end = endOfDay(selectedDate);
      base = base.filter((m) => isWithinInterval(new Date(m.utcDate), { start, end }));
    } else if (activeTab === "upcoming") {
      const start = startOfDay(selectedDate);
      base = base.filter((m) => new Date(m.utcDate) >= start && !["FINISHED", "AWARDED"].includes(m.status));
    } else if (activeTab === "finished") {
      const weekAgo = startOfDay(subDays(selectedDate, 7));
      const todayEnd = endOfDay(selectedDate);
      base = base.filter((m) => ["FINISHED", "AWARDED"].includes(m.status) && isWithinInterval(new Date(m.utcDate), { start: weekAgo, end: todayEnd }));
    } else if (activeTab === "favorites") {
      const favoriteTeamIds = new Set(favoriteTeams.map(t => t.id));
      base = base.filter((m) =>
        favoriteTeamIds.has(m.homeTeam.id) || favoriteTeamIds.has(m.awayTeam.id)
      );
    }
    // For other cases, show all matches in the fetched range

    const grouped: Record<string, Record<LeagueCode, MatchType[]>> = {};
    base.forEach((match) => {
      const dateKey = format(new Date(match.utcDate), "yyyy-MM-dd");
      const leagueCode = match.competition.code as LeagueCode;
      (grouped[dateKey] ||= {} as Record<LeagueCode, MatchType[]>);
      (grouped[dateKey][leagueCode] ||= []).push(match);
    });
    return grouped;
  }, [matches, activeTab, selectedDate, favoriteTeams, selectedLeague]);

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
      {/* Enhanced Header */}
      <motion.div
        className="glass-card border-b border-border/50 mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="max-w-7xl mx-auto px-4 py-4 md:py-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
              <Badge variant="success" className="px-3 py-1 text-sm font-semibold self-start">
                <CalendarDaysIcon className="w-4 h-4 mr-2" />
                Fixtures & Results
              </Badge>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold gradient-text">
                Football Fixtures
              </h1>
            </div>

            <div className="flex items-center gap-3 self-start md:self-auto">
              <Badge variant="outline" className="text-xs">
                {Object.values(filteredMatches).reduce((acc, leagues) =>
                  acc + Object.values(leagues).reduce((sum, matches) => sum + matches.length, 0), 0
                )} matches
              </Badge>

              <motion.button
                onClick={() => setViewMode(viewMode === "cards" ? "list" : "cards")}
                className="flex items-center gap-2 px-3 py-2 rounded-xl glass-card border border-border/50 text-sm font-medium hover:border-primary/50 hover:bg-primary/5 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Toggle view"
              >
                {viewMode === "cards" ? (
                  <>
                    <ListBulletIcon className="w-4 h-4" />
                    List View
                  </>
                ) : (
                  <>
                    <ViewColumnsIcon className="w-4 h-4" />
                    Card View
                  </>
                )}
              </motion.button>
            </div>
          </div>

          {/* Live Ticker inline on desktop, stacked on mobile */}
          <div className="mt-4">
            <LiveTicker className="w-full" />
          </div>
        </div>
      </motion.div>

      {/* Main Content with Sidebar Layout */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Mobile Filters - Compact horizontal layout */}
        <div className="lg:hidden w-full mb-6">
          <div className="space-y-4">
            {/* Filter Tabs - Horizontal scroll on mobile */}
            <div className="overflow-x-auto">
              <div className="flex gap-2 pb-2 min-w-max">
                {[
                  { value: "finished", label: "Finished", icon: "🏁" },
                  { value: "live", label: "Live", icon: "🔴" },
                  { value: "today", label: "Today", icon: "📅" },
                  { value: "upcoming", label: "Upcoming", icon: "⏰" },
                  { value: "favorites", label: `Favorites${favoriteTeams.length > 0 ? ` (${favoriteTeams.length})` : ''}`, icon: "⭐" }
                ].map((tab) => (
                  <button
                    key={tab.value}
                    onClick={() => {
                      setActiveTab(tab.value as FilterTab);
                      if (tab.value === "today") setSelectedDate(new Date());
                    }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                      activeTab === tab.value
                        ? 'bg-primary text-primary-foreground shadow-lg'
                        : 'glass-card border border-border/50 text-muted-foreground hover:text-foreground hover:border-primary/50'
                    }`}
                  >
                    <span>{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Date Picker - Compact */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-muted-foreground">Date:</span>
              <button
                onClick={() => setSelectedDate(new Date())}
                className={`px-3 py-1.5 rounded-lg text-sm transition-all duration-300 ${
                  isSameDay(selectedDate, new Date())
                    ? 'bg-primary text-primary-foreground'
                    : 'glass-card border border-border/50 hover:border-primary/50'
                }`}
              >
                {format(selectedDate, "MMM d, yyyy")}
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Sidebar */}
          <motion.div
            className="hidden lg:block w-80 flex-shrink-0"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <div className="sticky top-24 space-y-4">
              <FiltersBar
                activeTab={activeTab}
                onTabChange={(t) => {
                  setActiveTab(t);
                  // If user chooses Today while a different date is selected, snap to today
                  if (t === "today") setSelectedDate(new Date());
                }}
                selectedDate={selectedDate}
                onDateChange={(d) => {
                  setSelectedDate(d);
                  if (activeTab === "today" && !isSameDay(d, new Date())) {
                    // If user picks a different day, switch to "finished" to avoid the logical mismatch
                    setActiveTab("finished");
                  }
                }}
                quickDates={quickDateButtons}
                isSidebar={true}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                selectedLeague={selectedLeague}
                onLeagueChange={setSelectedLeague}
              />
            </div>
          </motion.div>

          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="loading"
                  className="space-y-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <MatchLoadingState viewMode={viewMode} />
            </motion.div>
          ) : Object.keys(filteredMatches).length === 0 ? (
            <motion.div
              key="empty"
              className="text-center py-16"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <div className="glass-card rounded-2xl p-12 border border-border/50 max-w-lg mx-auto">
                <div className="text-8xl mb-6">
                  {activeTab === "favorites" ? "❤️" : "⚽"}
                </div>
                <h3 className="text-2xl font-bold mb-4">
                  {activeTab === "favorites" && favoriteTeams.length === 0
                    ? "No favorite teams yet"
                    : "No matches found"}
                </h3>
                <p className="text-muted-foreground text-lg mb-6">
                  {activeTab === "favorites" && favoriteTeams.length === 0
                    ? "Click the heart icon next to team names in match details to add them to your favorites."
                    : activeTab === "favorites" && favoriteTeams.length > 0
                    ? `No upcoming matches found for your ${favoriteTeams.length} favorite team${favoriteTeams.length > 1 ? 's' : ''} in the next 3 weeks.`
                    : "Try selecting a different date or filter to see more matches."}
                </p>
                <Badge variant="outline" className="px-4 py-2">
                  <SparklesIcon className="w-4 h-4 mr-2" />
                  {activeTab === "favorites" && favoriteTeams.length === 0
                    ? "Tip: Open any match to favorite teams"
                    : activeTab === "favorites" && favoriteTeams.length > 0
                    ? "Tip: Try the 'All Matches' or 'Upcoming' filters to see more games"
                    : "Tip: Use the filters above to explore different dates"}
                </Badge>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="content"
              className="space-y-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
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
                                <MatchCard
                                  key={match.id}
                                  match={match}
                                  showLeague={false}
                                  onClick={() => openMatchModal(match)}
                                />
                              ))}
                            </div>
                          ) : (
                            <div className="space-y-2">
                              {leagueMatches[league.code].map(match => (
                                <button
                                  key={match.id}
                                  onClick={() => openMatchModal(match)}
                                  className="w-full text-left glass-card rounded-xl p-4 border border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all duration-200"
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4 min-w-0">
                                      <div className="text-sm font-medium tabular-nums shrink-0">
                                        {formatKickoffTime(match.utcDate)}
                                      </div>
                                      <div className="flex items-center gap-2 min-w-0">
                                        <span className="truncate max-w-[18ch]" title={match.homeTeam.name}>{match.homeTeam.name}</span>
                                        <span className="text-muted-foreground">vs</span>
                                        <span className="truncate max-w-[18ch]" title={match.awayTeam.name}>{match.awayTeam.name}</span>
                                      </div>
                                    </div>
                                    <div className="text-xs">
                                      {match.status === "FINISHED" ? (
                                        <span className="px-2 py-1 rounded bg-emerald-600/15 text-emerald-500 font-semibold">FT</span>
                                      ) : ["IN_PLAY", "PAUSED", "LIVE"].includes(match.status) ? (
                                        <span className="px-2 py-1 rounded bg-red-600/10 text-red-500 font-semibold">
                                          {(() => { const m = getLiveMinute(match as Match); return m ? `LIVE • ${m}` : "LIVE"; })()}
                                        </span>
                                      ) : (
                                        <span className="px-2 py-1 rounded bg-muted text-muted-foreground">
                                          {formatKickoffTime(match.utcDate)}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                ))}
            </motion.div>
          )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}



