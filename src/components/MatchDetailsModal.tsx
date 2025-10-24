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

          {/* Modal - Mobile Optimized */}
          <motion.div
            className="fixed inset-x-0 bottom-0 md:inset-0 z-50 flex md:items-center md:justify-center p-0 md:p-4"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className="glass-card rounded-t-3xl md:rounded-2xl border-t border-border/50 md:border md:border-border/50 w-full max-w-4xl max-h-[85vh] md:max-h-[90vh] overflow-y-auto">
              {/* Header - Mobile Optimized */}
              <div className="sticky top-0 z-10 glass-card border-b border-border/50 backdrop-blur-xl">
                {/* Top bar with title and close */}
                <div className="flex items-center justify-between p-4 md:p-6 pb-3 md:pb-4">
                  <div className="flex items-center gap-2 md:gap-3">
                    <h2 className="text-base md:text-xl font-bold">Match Details</h2>
                    {getStatusBadge()}
                  </div>
                  
                  <motion.button
                    onClick={onClose}
                    className="p-2 rounded-full hover:bg-muted/50 transition-colors active:scale-95"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <XMarkIcon className="w-5 h-5 md:w-6 md:h-6" />
                  </motion.button>
                </div>

                {/* Match Header - Stacked for Mobile */}
                <div className="px-4 md:px-6 pb-4 md:pb-6">
                  {/* Teams - Side by Side on Mobile, More Spacious on Desktop */}
                  <div className="flex items-center justify-between gap-2 md:gap-4">
                    {/* Home Team */}
                    <div className="flex flex-col items-center flex-1 min-w-0">
                      <TeamAvatar
                        teamName={match.homeTeam.name}
                        logoUrl={match.homeTeam.crest}
                        size="lg"
                      />
                      <div className="mt-2 text-center w-full">
                        <h3 className="font-semibold text-sm md:text-base truncate px-1">
                          {match.homeTeam.name}
                        </h3>
                        <p className="text-xs text-muted-foreground">Home</p>
                        <button
                          onClick={() => toggleFavoriteTeam({
                            id: match.homeTeam.id,
                            name: match.homeTeam.name,
                            crest: match.homeTeam.crest
                          })}
                          className="mt-1 p-1.5 rounded-full hover:bg-accent transition-colors active:scale-95"
                        >
                          {isFavoriteTeam(match.homeTeam.id) ? (
                            <HeartSolidIcon className="w-5 h-5 text-red-500" />
                          ) : (
                            <HeartIcon className="w-5 h-5 text-muted-foreground" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Score - Centered */}
                    <div className="text-center px-2 md:px-6 flex-shrink-0">
                      <div className="text-3xl md:text-5xl font-bold leading-none">
                        {match.score.fullTime.home ?? "-"}
                      </div>
                      <div className="text-xs md:text-sm text-muted-foreground my-1 md:my-2">VS</div>
                      <div className="text-3xl md:text-5xl font-bold leading-none">
                        {match.score.fullTime.away ?? "-"}
                      </div>
                      {match.score.halfTime.home !== null && (
                        <div className="text-xs text-muted-foreground mt-2">
                          HT: {match.score.halfTime.home}-{match.score.halfTime.away}
                        </div>
                      )}
                    </div>

                    {/* Away Team */}
                    <div className="flex flex-col items-center flex-1 min-w-0">
                      <TeamAvatar
                        teamName={match.awayTeam.name}
                        logoUrl={match.awayTeam.crest}
                        size="lg"
                      />
                      <div className="mt-2 text-center w-full">
                        <h3 className="font-semibold text-sm md:text-base truncate px-1">
                          {match.awayTeam.name}
                        </h3>
                        <p className="text-xs text-muted-foreground">Away</p>
                        <button
                          onClick={() => toggleFavoriteTeam({
                            id: match.awayTeam.id,
                            name: match.awayTeam.name,
                            crest: match.awayTeam.crest
                          })}
                          className="mt-1 p-1.5 rounded-full hover:bg-accent transition-colors active:scale-95"
                        >
                          {isFavoriteTeam(match.awayTeam.id) ? (
                            <HeartSolidIcon className="w-5 h-5 text-red-500" />
                          ) : (
                            <HeartIcon className="w-5 h-5 text-muted-foreground" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Date/Time - Centered Below */}
                  <div className="flex items-center justify-center gap-2 mt-4 text-xs md:text-sm text-muted-foreground">
                    <ClockIcon className="w-4 h-4" />
                    <span className="hidden md:inline">{format(ko, "EEEE, MMMM d, yyyy • HH:mm")}</span>
                    <span className="md:hidden">{format(ko, "EEE, MMM d • HH:mm")}</span>
                  </div>
                </div>
              </div>

              {/* Match Information - Mobile Optimized */}
              <div className="p-4 md:p-6 space-y-3 md:space-y-4">
                <h3 className="text-base md:text-lg font-bold mb-3 md:mb-4">Match Information</h3>
                
                <div className="grid grid-cols-2 gap-3 md:gap-4">
                  {/* Competition */}
                  <motion.div
                    className="p-3 md:p-4 glass-card rounded-xl border border-border/50 col-span-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl md:text-2xl">🏆</span>
                      <span className="text-xs font-semibold uppercase text-muted-foreground">Competition</span>
                    </div>
                    <div className="text-sm md:text-base font-semibold">{match.competition.name}</div>
                  </motion.div>

                  {/* Status */}
                  <motion.div
                    className="p-3 md:p-4 glass-card rounded-xl border border-border/50"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl md:text-2xl">📊</span>
                      <span className="text-xs font-semibold uppercase text-muted-foreground">Status</span>
                    </div>
                    <div className="text-sm md:text-base font-semibold">
                      {isLive ? "🔴 Live" : isFinished ? "✅ Finished" : "⏰ Scheduled"}
                    </div>
                  </motion.div>

                  {/* Date & Time */}
                  <motion.div
                    className="p-3 md:p-4 glass-card rounded-xl border border-border/50"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl md:text-2xl">📅</span>
                      <span className="text-xs font-semibold uppercase text-muted-foreground">Date</span>
                    </div>
                    <div className="text-xs md:text-sm font-semibold leading-tight">
                      {format(ko, "MMM d, yyyy")}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {format(ko, "HH:mm")}
                    </div>
                  </motion.div>
                </div>

                {/* Result Banner - Full Width */}
                {(match.score.winner || isFinished) && (
                  <motion.div
                    className="p-4 glass-card rounded-xl border border-primary/30 bg-primary/5 mt-4"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl md:text-3xl">🎯</span>
                      <div>
                        <div className="text-xs font-semibold uppercase text-muted-foreground mb-1">Result</div>
                        <div className="text-sm md:text-base font-bold">
                          {match.score.winner === "HOME_TEAM" && `${match.homeTeam.name} wins!`}
                          {match.score.winner === "AWAY_TEAM" && `${match.awayTeam.name} wins!`}
                          {match.score.winner === "DRAW" && "Match ended in a draw"}
                          {!match.score.winner && isFinished && "Match completed"}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
                
                {/* Safe area for mobile bottom */}
                <div className="h-4 md:hidden" />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
