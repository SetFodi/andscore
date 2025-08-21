"use client";
import { LEAGUES, TOP_LEAGUE_CODES, type LeagueCode } from "@/lib/constants";
import type { Match } from "@/lib/fd";
import MatchCard from "@/components/MatchCard";
import FiltersBar, { type FilterTab } from "@/components/FiltersBar";
import { Badge } from "@/components/ui/badge";
import { MatchCardSkeleton } from "@/components/ui/skeleton";
import { useMatchModal } from "@/components/MatchModalProvider";
import { useEffect, useMemo, useState } from "react";
import { format, addDays, subDays, isSameDay, isToday, startOfDay, endOfDay, isWithinInterval } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarDaysIcon,
  ViewColumnsIcon,
  ListBulletIcon,
  PlayIcon as PlaySolidIcon,
  SparklesIcon
} from "@heroicons/react/24/outline";

type MatchType = Match;
type ViewMode = "cards" | "list";

export default function MatchesPage() {
  const { openMatchModal } = useMatchModal();
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

  useEffect(() => {
    setLoading(true);
    let fromDate: string, toDate: string;

    // Check if selected date is different from today
    const isSelectedDateToday = isSameDay(selectedDate, new Date());

    if (!isSelectedDateToday) {
      // If a specific date is selected, fetch matches around that date
      fromDate = format(subDays(selectedDate, 3), "yyyy-MM-dd");
      toDate = format(addDays(selectedDate, 3), "yyyy-MM-dd");
    } else {
      // Use original logic for today's date
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
          // For "all" matches, fetch a wider range around the selected date
          fromDate = format(subDays(selectedDate, 7), "yyyy-MM-dd");
          toDate = format(addDays(selectedDate, 7), "yyyy-MM-dd");
      }
    }

    fetchMatches(fromDate, toDate)
      .then((m) => setMatches(m))
      .catch(() => setMatches([]))
      .finally(() => setLoading(false));
  }, [activeTab, selectedDate]);

  // Filter and group matches with exact-day logic and league enablement
  const filteredMatches = useMemo(() => {
    const enabledSet = new Set(TOP_LEAGUE_CODES.filter((c) => true));
    let base = matches.filter((m) => enabledSet.has(m.competition.code as LeagueCode));

    // Check if selected date is different from today
    const isSelectedDateToday = isSameDay(selectedDate, new Date());

    if (activeTab === "live") {
      base = base.filter((m) => ["IN_PLAY", "PAUSED", "LIVE"].includes(m.status));
    } else if (activeTab === "today" || !isSelectedDateToday) {
      // If "today" tab OR a specific date is selected, show matches for that date
      const start = startOfDay(selectedDate);
      const end = endOfDay(selectedDate);
      base = base.filter((m) => isWithinInterval(new Date(m.utcDate), { start, end }));
    } else if (activeTab === "upcoming") {
      const start = startOfDay(selectedDate);
      base = base.filter((m) => new Date(m.utcDate) >= start);
    } else if (activeTab === "favorites") {
      base = base.filter((m) => favoriteLeagues.includes(m.competition.code as LeagueCode));
    }
    // For "all" tab with today's date, show all matches in the fetched range

    const grouped: Record<string, Record<LeagueCode, MatchType[]>> = {};
    base.forEach((match) => {
      const dateKey = format(new Date(match.utcDate), "yyyy-MM-dd");
      const leagueCode = match.competition.code as LeagueCode;
      (grouped[dateKey] ||= {} as Record<LeagueCode, MatchType[]>);
      (grouped[dateKey][leagueCode] ||= []).push(match);
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
      {/* Enhanced Header */}
      <motion.div
        className="glass-card border-b border-border/50 mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="max-w-7xl mx-auto px-4 py-4 md:py-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:mb-6">
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
                // If user picks a different day, switch to "all" to avoid the logical mismatch
                setActiveTab("all");
              }
            }}
            quickDates={quickDateButtons}
          />
        </div>
      </motion.div>
      {/* Enhanced Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              className="space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="text-center py-8">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  <span className="text-lg font-medium text-muted-foreground">Loading matches...</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <MatchCardSkeleton key={i} />
                ))}
              </div>
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
                <div className="text-8xl mb-6">⚽</div>
                <h3 className="text-2xl font-bold mb-4">No matches found</h3>
                <p className="text-muted-foreground text-lg mb-6">
                  Try selecting a different date or filter to see more matches.
                </p>
                <Badge variant="outline" className="px-4 py-2">
                  <SparklesIcon className="w-4 h-4 mr-2" />
                  Tip: Use the filters above to explore different dates
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
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}


