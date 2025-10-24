"use client";
import { motion, AnimatePresence } from "framer-motion";
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

  // Define status checks
  const isLive = match ? ["IN_PLAY", "PAUSED", "LIVE"].includes(match.status) : false;
  const isFinished = match ? ["FINISHED", "AWARDED"].includes(match.status) : false;

  if (!match) return null;
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

              {/* Match Information */}
              <div className="p-6 space-y-4">
                <h3 className="text-lg font-bold mb-4">Match Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Competition */}
                  <motion.div
                    className="p-4 glass-card rounded-lg border border-border/50"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-2xl">🏆</span>
                      <span className="text-xs font-semibold uppercase text-muted-foreground">Competition</span>
                    </div>
                    <div className="text-sm font-semibold">{match.competition.name}</div>
                  </motion.div>

                  {/* Status */}
                  <motion.div
                    className="p-4 glass-card rounded-lg border border-border/50"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-2xl">📊</span>
                      <span className="text-xs font-semibold uppercase text-muted-foreground">Status</span>
                    </div>
                    <div className="text-sm font-semibold">
                      {isLive ? "🔴 Live" : isFinished ? "✅ Finished" : "⏰ Scheduled"}
                    </div>
                  </motion.div>

                  {/* Date & Time */}
                  <motion.div
                    className="p-4 glass-card rounded-lg border border-border/50"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-2xl">📅</span>
                      <span className="text-xs font-semibold uppercase text-muted-foreground">Date & Time</span>
                    </div>
                    <div className="text-sm font-semibold">
                      {format(ko, "MMM d, yyyy")}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {format(ko, "HH:mm")} (Local time)
                    </div>
                  </motion.div>

                  {/* Score */}
                  <motion.div
                    className="p-4 glass-card rounded-lg border border-border/50"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-2xl">⚽</span>
                      <span className="text-xs font-semibold uppercase text-muted-foreground">Final Score</span>
                    </div>
                    <div className="text-2xl font-bold">
                      {match.score.fullTime.home ?? "-"} - {match.score.fullTime.away ?? "-"}
                    </div>
                    {match.score.halfTime.home !== null && (
                      <div className="text-xs text-muted-foreground">
                        HT: {match.score.halfTime.home} - {match.score.halfTime.away}
                      </div>
                    )}
                  </motion.div>
                </div>

                {/* Additional Info */}
                {(match.score.winner || isFinished) && (
                  <motion.div
                    className="p-4 glass-card rounded-lg border border-primary/30 bg-primary/5"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">🎯</span>
                      <div>
                        <div className="text-xs font-semibold uppercase text-muted-foreground mb-1">Result</div>
                        <div className="text-sm font-bold">
                          {match.score.winner === "HOME_TEAM" && `${match.homeTeam.name} wins!`}
                          {match.score.winner === "AWAY_TEAM" && `${match.awayTeam.name} wins!`}
                          {match.score.winner === "DRAW" && "Match ended in a draw"}
                          {!match.score.winner && isFinished && "Match completed"}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
