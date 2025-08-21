"use client";
import { motion, AnimatePresence } from "framer-motion";
import { XMarkIcon, ClockIcon, MapPinIcon, TvIcon, HeartIcon } from "@heroicons/react/24/outline";
import { PlayIcon as PlaySolidIcon, CheckCircleIcon, HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";
import { Badge } from "./ui/badge";
import { TeamAvatar } from "./ui/avatar";
import { useFavorites } from "@/hooks/useFavorites";
import type { Match } from "@/lib/fd";
import { format } from "date-fns";

interface MatchDetailsModalProps {
  match: Match | null;
  isOpen: boolean;
  onClose: () => void;
}

interface MatchEvent {
  minute: number;
  type: string;
  team: string;
  player: string;
  description: string;
}

export default function MatchDetailsModal({ match, isOpen, onClose }: MatchDetailsModalProps) {
  const { isFavoriteTeam, toggleFavoriteTeam } = useFavorites();

  if (!match) return null;

  const isLive = ["IN_PLAY", "PAUSED", "LIVE"].includes(match.status);
  const isFinished = ["FINISHED", "AWARDED"].includes(match.status);
  const isUpcoming = ["SCHEDULED", "TIMED"].includes(match.status);
  const ko = new Date(match.utcDate);

  const getStatusBadge = () => {
    if (isLive) {
      return (
        <Badge variant="live" className="px-3 py-1 text-sm font-bold animate-pulse">
          <PlaySolidIcon className="w-4 h-4 mr-2" />
          LIVE • {Math.floor(Math.random() * 90) + 1}&apos;
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

  // Sample events for demonstration - in real app, this would come from match API
  const sampleEvents = isLive || isFinished ? [
    { minute: 23, type: "goal", team: "home", player: "Goal scored", description: "Match event" },
    { minute: 67, type: "goal", team: "away", player: "Goal scored", description: "Match event" }
  ] : [];

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
                    {isLive && (
                      <div className="text-sm text-muted-foreground">
                        {Math.floor(Math.random() * 90) + 1}&apos; minute
                      </div>
                    )}
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
                  <div className="flex items-center gap-2">
                    <MapPinIcon className="w-4 h-4" />
                    {match.homeTeam.name} Stadium
                  </div>
                  <div className="flex items-center gap-2">
                    <TvIcon className="w-4 h-4" />
                    Live on TV
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                {isLive && (
                  <LiveMatchContent events={sampleEvents} />
                )}

                {isFinished && (
                  <FinishedMatchContent events={sampleEvents} />
                )}

                {isUpcoming && (
                  <UpcomingMatchContent match={match} />
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Live Match Content Component
function LiveMatchContent({ events }: { events: MatchEvent[] }) {
  return (
    <div className="space-y-6">
      {/* Live Status */}
      <div className="text-center">
        <div className="glass-card p-6 rounded-xl border border-border/50">
          <div className="flex items-center justify-center gap-2 mb-2">
            <PlaySolidIcon className="w-5 h-5 text-live animate-pulse" />
            <h3 className="text-lg font-semibold text-live">Match in Progress</h3>
          </div>
          <p className="text-muted-foreground">
            Follow the live action as it happens
          </p>
        </div>
      </div>

      {/* Live Events */}
      {events.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Recent Events</h3>
          <div className="space-y-3">
            {events.map((event, i) => (
              <EventItem key={i} event={event} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Finished Match Content Component
function FinishedMatchContent({ events }: { events: MatchEvent[] }) {
  return (
    <div className="space-y-6">
      {/* Final Result */}
      <div className="text-center">
        <div className="glass-card p-6 rounded-xl border border-border/50">
          <div className="flex items-center justify-center gap-2 mb-2">
            <CheckCircleIcon className="w-5 h-5 text-success" />
            <h3 className="text-lg font-semibold text-success">Match Completed</h3>
          </div>
          <p className="text-muted-foreground">
            Final result and match summary
          </p>
        </div>
      </div>

      {/* Match Events */}
      {events.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Key Events</h3>
          <div className="space-y-3">
            {events.map((event, i) => (
              <EventItem key={i} event={event} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Upcoming Match Content Component
function UpcomingMatchContent({ match }: { match: Match }) {
  const ko = new Date(match.utcDate);

  return (
    <div className="space-y-6 text-center">
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center justify-center gap-2">
          <ClockIcon className="w-5 h-5 text-primary" />
          Upcoming Match
        </h3>

        <div className="glass-card p-8 rounded-xl border border-border/50">
          <div className="text-2xl font-bold mb-4">
            Kicks off at
          </div>
          <div className="text-4xl font-bold text-primary mb-4">
            {format(ko, "HH:mm")}
          </div>
          <div className="text-lg text-muted-foreground mb-2">
            {format(ko, "EEEE, MMMM d, yyyy")}
          </div>
          <div className="text-sm text-muted-foreground">
            {match.competition.name}
          </div>
        </div>
      </div>

      <div className="glass-card p-6 rounded-xl border border-border/50">
        <h4 className="font-semibold mb-3">Match Information</h4>
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center justify-center gap-2">
            <MapPinIcon className="w-4 h-4" />
            <span>Stadium: {match.homeTeam.name} Home Ground</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <TvIcon className="w-4 h-4" />
            <span>Check local listings for broadcast information</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper Components
function EventItem({ event }: { event: MatchEvent }) {
  const getEventIcon = (type: string) => {
    switch (type) {
      case "goal": return "⚽";
      case "yellow": return "🟨";
      case "red": return "🟥";
      case "substitution": return "🔄";
      default: return "📝";
    }
  };

  return (
    <motion.div
      className="flex items-center gap-4 p-3 glass-card rounded-lg border border-border/50"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-sm font-bold w-8 text-center">{event.minute}&apos;</div>
      <div className="text-lg">{getEventIcon(event.type)}</div>
      <div className="flex-1">
        <div className="font-medium">{event.player}</div>
        <div className="text-sm text-muted-foreground">{event.description}</div>
      </div>
    </motion.div>
  );
}
