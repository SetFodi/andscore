"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { XMarkIcon, ClockIcon, HeartIcon } from "@heroicons/react/24/outline";
import { PlayIcon as PlaySolidIcon, CheckCircleIcon, HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";
import { Badge } from "./ui/badge";
import { TeamAvatar } from "./ui/avatar";
import { useFavorites } from "@/hooks/useFavorites";
import type { Match } from "@/lib/fd";
import { getLiveMinute } from "@/lib/fd";
import { format } from "date-fns";

interface MatchDetailsModalProps {
  match: Match | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function MatchDetailsModal({ match, isOpen, onClose }: MatchDetailsModalProps) {
  const { isFavoriteTeam, toggleFavoriteTeam } = useFavorites();

  type AFEvent = {
    minute: string | null;
    type: "goal";
    team: "home" | "away" | null;
    player: string | null;
    assist: string | null;
    detail: string | null;
  };

  const [events, setEvents] = useState<AFEvent[] | null>(null);
  const [eventsLoading, setEventsLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function loadEvents() {
      if (!isOpen || !match) return;
      try {
        setEventsLoading(true);
        const q = new URLSearchParams({
          comp: String(match.competition.code),
          utcDate: match.utcDate,
          home: match.homeTeam.name,
          away: match.awayTeam.name,
        });
        const res = await fetch(`/api/af/events?${q.toString()}`, { cache: "no-store" });
        if (!res.ok) throw new Error(`events ${res.status}`);
        const data = await res.json();
        if (!cancelled) setEvents(Array.isArray(data?.events) ? (data.events as AFEvent[]) : []);
      } catch {
        if (!cancelled) setEvents([]);
      } finally {
        if (!cancelled) setEventsLoading(false);
      }
    }
    loadEvents();
    return () => { cancelled = true; };
  }, [isOpen, match]);

  if (!match) return null;

  const isLive = ["IN_PLAY", "PAUSED", "LIVE"].includes(match.status);
  const isFinished = ["FINISHED", "AWARDED"].includes(match.status);
  const ko = new Date(match.utcDate);

  const getStatusBadge = () => {
    if (isLive) {
      const min = getLiveMinute(match);
      return (
        <Badge variant="live" className="px-3 py-1 text-sm font-bold animate-pulse">
          <PlaySolidIcon className="w-4 h-4 mr-2" />
          {min ? `LIVE • ${min}` : "LIVE"}
        </Badge>
      );
    }
    
    if (isFinished) {
      return (
        <Badge variant="success" className="px-3 py-1 text-sm font-semibold">
          <CheckCircleIcon className="w-4 h-4 mr-2" />
          FULL TIME
        </Badge>
      );
    }
    
    return (
      <Badge variant="outline" className="px-3 py-1 text-sm font-medium">
        <ClockIcon className="w-4 h-4 mr-2" />
        {format(ko, "MMM d, HH:mm")}
      </Badge>
    );
  };



  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className="glass-card rounded-2xl border border-border/50 w-full max-w-4xl max-h-[90vh] overflow-hidden">
              {/* Header */}
              <div className="relative p-6 border-b border-border/50">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-bold">Match Details</h2>
                    {getStatusBadge()}
                  </div>
                  
                  <motion.button
                    onClick={onClose}
                    className="p-2 rounded-lg hover:bg-muted/50 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </motion.button>
                </div>

                {/* Match Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <TeamAvatar
                      teamName={match.homeTeam.name}
                      logoUrl={match.homeTeam.crest}
                      size="lg"
                    />
                    <div className="text-center">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg">{match.homeTeam.name}</h3>
                        <button
                          onClick={() => toggleFavoriteTeam({
                            id: match.homeTeam.id,
                            name: match.homeTeam.name,
                            crest: match.homeTeam.crest
                          })}
                          className="p-1 rounded-full hover:bg-accent transition-colors"
                        >
                          {isFavoriteTeam(match.homeTeam.id) ? (
                            <HeartSolidIcon className="w-5 h-5 text-red-500" />
                          ) : (
                            <HeartIcon className="w-5 h-5 text-muted-foreground hover:text-red-500" />
                          )}
                        </button>
                      </div>
                      <p className="text-sm text-muted-foreground">Home</p>
                    </div>
                  </div>

                  <div className="text-center px-8">
                    <div className="text-4xl font-bold mb-2">
                      {match.score.fullTime.home ?? "-"} - {match.score.fullTime.away ?? "-"}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleFavoriteTeam({
                            id: match.awayTeam.id,
                            name: match.awayTeam.name,
                            crest: match.awayTeam.crest
                          })}
                          className="p-1 rounded-full hover:bg-accent transition-colors"
                        >
                          {isFavoriteTeam(match.awayTeam.id) ? (
                            <HeartSolidIcon className="w-5 h-5 text-red-500" />
                          ) : (
                            <HeartIcon className="w-5 h-5 text-muted-foreground hover:text-red-500" />
                          )}
                        </button>
                        <h3 className="font-semibold text-lg">{match.awayTeam.name}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">Away</p>
                    </div>
                    <TeamAvatar
                      teamName={match.awayTeam.name}
                      logoUrl={match.awayTeam.crest}
                      size="lg"
                    />
                  </div>
                </div>

                {/* Match Info */}
                <div className="flex items-center justify-center gap-6 mt-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <ClockIcon className="w-4 h-4" />
                    {format(ko, "EEEE, MMMM d, yyyy • HH:mm")}
                  </div>
                </div>
              </div>

              {/* Events: Only render if real data exists */}
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                {eventsLoading ? (
                  <div className="text-center text-sm text-muted-foreground">Loading events…</div>
                ) : null}

                {!eventsLoading && events && events.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold">Goals</h3>
                    <div className="space-y-2">
                      {events.map((e, i) => {
                        const teamName = e.team === "home" ? match.homeTeam.name : e.team === "away" ? match.awayTeam.name : "";
                        return (
                          <motion.div
                            key={`${e.minute}-${e.player}-${i}`}
                            className="flex items-center gap-3 p-3 glass-card rounded-lg border border-border/50"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                          >
                            <span className="w-10 text-center tabular-nums text-sm font-semibold">{e.minute ?? ""}</span>
                            <span className="text-lg">⚽</span>
                            <div className="flex-1 text-sm">
                              <div className="font-medium truncate">
                                {teamName}{e.player ? ` • ${e.player}` : ""}
                              </div>
                              {(e.assist || e.detail) && (
                                <div className="text-xs text-muted-foreground truncate">
                                  {[
                                    e.assist ? `Assist: ${e.assist}` : null,
                                    e.detail || null,
                                  ].filter(Boolean).join(" • ")}
                                </div>
                              )}
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {!eventsLoading && Array.isArray(events) && events.length === 0 && (
                  <div className="text-center text-sm text-muted-foreground">
                    No goal events available.
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
