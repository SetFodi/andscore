"use client";
import { useState, useEffect, useMemo } from "react";
import { format, addDays, subDays, startOfDay, endOfDay, isWithinInterval, isToday } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { LEAGUES, TOP_LEAGUE_CODES, type LeagueCode } from "@/lib/constants";
import type { Match } from "@/lib/fd";
import { useMatchModal } from "@/components/MatchModalProvider";
import { useFavorites } from "@/hooks/useFavorites";
import { DateNavigation } from "@/components/DateNavigation";
import { CompactFilters, type CompactFilterTab } from "@/components/CompactFilters";
import { CompactMatchRow } from "@/components/CompactMatchRow";
import LiveTicker from "@/components/LiveTicker";
import { MatchLoadingState } from "@/components/ui/loading";

export default function MatchesPageNew() {
  const { openMatchModal } = useMatchModal();
  const { favoriteTeams, toggleFavorite } = useFavorites();
  
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [activeTab, setActiveTab] = useState<CompactFilterTab>("today");
  const [selectedLeague, setSelectedLeague] = useState<LeagueCode | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch matches based on date and tab
  useEffect(() => {
    setLoading(true);
    
    const fetchRange = () => {
      const today = format(selectedDate, "yyyy-MM-dd");
      const tomorrow = format(addDays(selectedDate, 1), "yyyy-MM-dd");
      
      switch (activeTab) {
        case "live":
        case "today":
        case "all":
          return { from: today, to: tomorrow };
        case "upcoming":
          return { from: today, to: format(addDays(selectedDate, 14), "yyyy-MM-dd") };
        case "finished":
          return { from: format(subDays(selectedDate, 7), "yyyy-MM-dd"), to: tomorrow };
        case "favorites":
          return { from: format(subDays(selectedDate, 3), "yyyy-MM-dd"), to: format(addDays(selectedDate, 21), "yyyy-MM-dd") };
        default:
          return { from: today, to: tomorrow };
      }
    };

    const { from, to } = fetchRange();
    const qs = new URLSearchParams({
      competitions: TOP_LEAGUE_CODES.join(","),
      dateFrom: from,
      dateTo: to,
    });

    fetch(`/api/fd/matches?${qs.toString()}`, { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => setMatches(data.matches || []))
      .catch(() => setMatches([]))
      .finally(() => setLoading(false));
  }, [activeTab, selectedDate]);

  // Filter matches
  const filteredMatches = useMemo(() => {
    let base = matches;

    // League filter
    if (selectedLeague) {
      base = base.filter((m) => m.competition.code === selectedLeague);
    }

    // Status filter
    const dayStart = startOfDay(selectedDate);
    const dayEnd = endOfDay(selectedDate);

    switch (activeTab) {
      case "live":
        base = base.filter((m) => ["IN_PLAY", "PAUSED", "LIVE"].includes(m.status));
        break;
      case "today":
        base = base.filter((m) => isWithinInterval(new Date(m.utcDate), { start: dayStart, end: dayEnd }));
        break;
      case "upcoming":
        base = base.filter((m) => new Date(m.utcDate) >= dayStart && !["FINISHED", "AWARDED"].includes(m.status));
        break;
      case "finished":
        base = base.filter((m) => ["FINISHED", "AWARDED"].includes(m.status));
        break;
      case "favorites":
        const favIds = new Set(favoriteTeams.map((t) => t.id));
        base = base.filter((m) => favIds.has(m.homeTeam.id) || favIds.has(m.awayTeam.id));
        break;
    }

    // Group by date and league
    const grouped: Record<string, Record<LeagueCode, Match[]>> = {};
    base.forEach((match) => {
      const dateKey = format(new Date(match.utcDate), "yyyy-MM-dd");
      const leagueCode = match.competition.code as LeagueCode;
      if (!grouped[dateKey]) grouped[dateKey] = {} as Record<LeagueCode, Match[]>;
      if (!grouped[dateKey][leagueCode]) grouped[dateKey][leagueCode] = [];
      grouped[dateKey][leagueCode].push(match);
    });

    return grouped;
  }, [matches, selectedDate, activeTab, selectedLeague, favoriteTeams]);

  const totalMatches = Object.values(filteredMatches).reduce(
    (acc, leagues) => acc + Object.values(leagues).reduce((sum, ms) => sum + ms.length, 0),
    0
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          {/* Title Row */}
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Fixtures & Results</h1>
            <div className="text-sm text-muted-foreground">
              {totalMatches} {totalMatches === 1 ? "match" : "matches"}
            </div>
          </div>

          {/* Date Navigation */}
          <DateNavigation
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            className="mb-4"
          />

          {/* Filters */}
          <CompactFilters
            activeTab={activeTab}
            onTabChange={setActiveTab}
            selectedLeague={selectedLeague}
            onLeagueChange={setSelectedLeague}
            favoriteCount={favoriteTeams.length}
          />

          {/* Live Ticker */}
          <div className="mt-4">
            <LiveTicker className="w-full" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <MatchLoadingState viewMode="list" />
            </motion.div>
          ) : totalMatches === 0 ? (
            <motion.div
              key="empty"
              className="text-center py-16"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <div className="text-6xl mb-4">⚽</div>
              <h3 className="text-xl font-bold mb-2">No matches found</h3>
              <p className="text-muted-foreground">
                Try selecting a different date or filter
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="content"
              className="space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {Object.entries(filteredMatches)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([date, leagueMatches]) => (
                  <div key={date} className="space-y-4">
                    {/* Date Header */}
                    <div className="sticky top-[220px] z-30 bg-muted/50 backdrop-blur-sm rounded-lg px-4 py-2">
                      <h2 className="text-sm font-bold">
                        {isToday(new Date(date)) ? "Today" : format(new Date(date), "EEEE, MMMM d")}
                      </h2>
                    </div>

                    {/* Matches by League */}
                    {LEAGUES
                      .filter((league) => leagueMatches[league.code]?.length > 0)
                      .map((league) => (
                        <div key={league.code} className="glass-card rounded-xl overflow-hidden border border-border/50">
                          {/* League Header */}
                          <div 
                            className="flex items-center gap-3 px-4 py-3 border-b border-border/30"
                            style={{ backgroundColor: `${league.accent}10` }}
                          >
                            <img
                              src={
                                league.code === "PL" ? "/premier-league-1.svg" :
                                league.code === "PD" ? "/LaLiga_logo_2023.svg.png" :
                                league.code === "SA" ? "/Serie_A_logo_2022.svg.png" :
                                league.code === "BL1" ? "/Bundesliga_logo_(2017).svg.png" :
                                league.code === "FL1" ? "/Ligue_1_Uber_Eats_logo.svg.png" :
                                "/UEFA_Champions_League.svg.png"
                              }
                              alt={league.name}
                              className="w-5 h-5 object-contain"
                            />
                            <h3 className="font-bold text-sm" style={{ color: league.accent }}>
                              {league.name}
                            </h3>
                            <span className="text-xs text-muted-foreground ml-auto">
                              {leagueMatches[league.code].length}
                            </span>
                          </div>

                          {/* Match Rows */}
                          <div>
                            {leagueMatches[league.code].map((match) => {
                              const isFav = favoriteTeams.some(
                                (t) => t.id === match.homeTeam.id || t.id === match.awayTeam.id
                              );
                              return (
                                <CompactMatchRow
                                  key={match.id}
                                  match={match}
                                  onClick={() => openMatchModal(match)}
                                  isFavorite={isFav}
                                  onToggleFavorite={() => {
                                    // Toggle first team found
                                    const teamToToggle = favoriteTeams.find(t => t.id === match.homeTeam.id || t.id === match.awayTeam.id);
                                    if (teamToToggle) {
                                      toggleFavorite(teamToToggle);
                                    } else {
                                      toggleFavorite(match.homeTeam);
                                    }
                                  }}
                                />
                              );
                            })}
                          </div>
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

