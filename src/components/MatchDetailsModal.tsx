"use client";
import { motion, AnimatePresence } from "framer-motion";
import { XMarkIcon, ClockIcon, MapPinIcon, TvIcon } from "@heroicons/react/24/outline";
import { PlayIcon as PlaySolidIcon, CheckCircleIcon } from "@heroicons/react/24/solid";
import { Badge } from "./ui/badge";
import { TeamAvatar } from "./ui/avatar";
import type { Match } from "@/lib/fd";
import { format } from "date-fns";

interface MatchDetailsModalProps {
  match: Match | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function MatchDetailsModal({ match, isOpen, onClose }: MatchDetailsModalProps) {
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
          LIVE • {Math.floor(Math.random() * 90) + 1}'
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

  // Mock data for demonstration - in real app, this would come from API
  const mockStats = {
    possession: { home: 65, away: 35 },
    shots: { home: 12, away: 8 },
    shotsOnTarget: { home: 5, away: 3 },
    corners: { home: 7, away: 4 },
    fouls: { home: 11, away: 14 },
    yellowCards: { home: 2, away: 3 },
    redCards: { home: 0, away: 1 }
  };

  const mockEvents = [
    { minute: 23, type: "goal", team: "home", player: "M. Salah", description: "Right footed shot from the centre of the box" },
    { minute: 34, type: "yellow", team: "away", player: "K. De Bruyne", description: "Unsporting behaviour" },
    { minute: 67, type: "goal", team: "away", player: "E. Haaland", description: "Header from very close range" },
    { minute: 78, type: "substitution", team: "home", player: "D. Núñez → R. Firmino", description: "Tactical substitution" }
  ];

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
                      <h3 className="font-semibold text-lg">{match.homeTeam.name}</h3>
                      <p className="text-sm text-muted-foreground">Home</p>
                    </div>
                  </div>

                  <div className="text-center px-8">
                    <div className="text-4xl font-bold mb-2">
                      {match.score.fullTime.home ?? "-"} - {match.score.fullTime.away ?? "-"}
                    </div>
                    {isLive && (
                      <div className="text-sm text-muted-foreground">
                        {Math.floor(Math.random() * 90) + 1}' minute
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <h3 className="font-semibold text-lg">{match.awayTeam.name}</h3>
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
                  <LiveMatchContent stats={mockStats} events={mockEvents} />
                )}
                
                {isFinished && (
                  <FinishedMatchContent stats={mockStats} events={mockEvents} />
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
function LiveMatchContent({ stats, events }: { stats: any; events: any[] }) {
  return (
    <div className="space-y-6">
      {/* Live Stats */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <PlaySolidIcon className="w-5 h-5 text-live" />
          Live Statistics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <StatBar label="Possession" homeValue={stats.possession.home} awayValue={stats.possession.away} unit="%" />
          <StatBar label="Shots" homeValue={stats.shots.home} awayValue={stats.shots.away} />
          <StatBar label="Shots on Target" homeValue={stats.shotsOnTarget.home} awayValue={stats.shotsOnTarget.away} />
          <StatBar label="Corners" homeValue={stats.corners.home} awayValue={stats.corners.away} />
        </div>
      </div>

      {/* Live Events */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Match Events</h3>
        <div className="space-y-3">
          {events.map((event, i) => (
            <EventItem key={i} event={event} />
          ))}
        </div>
      </div>
    </div>
  );
}

// Finished Match Content Component  
function FinishedMatchContent({ stats, events }: { stats: any; events: any[] }) {
  return (
    <div className="space-y-6">
      {/* Final Stats */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <CheckCircleIcon className="w-5 h-5 text-success" />
          Final Statistics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <StatBar label="Possession" homeValue={stats.possession.home} awayValue={stats.possession.away} unit="%" />
          <StatBar label="Shots" homeValue={stats.shots.home} awayValue={stats.shots.away} />
          <StatBar label="Shots on Target" homeValue={stats.shotsOnTarget.home} awayValue={stats.shotsOnTarget.away} />
          <StatBar label="Corners" homeValue={stats.corners.home} awayValue={stats.corners.away} />
          <StatBar label="Fouls" homeValue={stats.fouls.home} awayValue={stats.fouls.away} />
          <StatBar label="Yellow Cards" homeValue={stats.yellowCards.home} awayValue={stats.yellowCards.away} />
        </div>
      </div>

      {/* Match Events */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Match Events</h3>
        <div className="space-y-3">
          {events.map((event, i) => (
            <EventItem key={i} event={event} />
          ))}
        </div>
      </div>
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
        
        <div className="glass-card p-6 rounded-xl border border-border/50">
          <div className="text-2xl font-bold mb-2">
            Kicks off in
          </div>
          <div className="text-4xl font-bold text-primary mb-4">
            {format(ko, "HH:mm")}
          </div>
          <div className="text-muted-foreground">
            {format(ko, "EEEE, MMMM d, yyyy")}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-4 rounded-xl border border-border/50">
          <h4 className="font-semibold mb-2">Recent Form</h4>
          <div className="flex gap-1 justify-center">
            {["W", "W", "D", "L", "W"].map((result, i) => (
              <div key={i} className={`w-6 h-6 rounded text-xs flex items-center justify-center font-bold ${
                result === "W" ? "bg-success text-white" :
                result === "D" ? "bg-warning text-white" :
                "bg-error text-white"
              }`}>
                {result}
              </div>
            ))}
          </div>
        </div>
        
        <div className="glass-card p-4 rounded-xl border border-border/50">
          <h4 className="font-semibold mb-2">Head to Head</h4>
          <div className="text-sm text-muted-foreground">
            Last 5 meetings: 3W - 1D - 1L
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper Components
function StatBar({ label, homeValue, awayValue, unit = "" }: {
  label: string;
  homeValue: number;
  awayValue: number;
  unit?: string;
}) {
  const total = homeValue + awayValue;
  const homePercentage = (homeValue / total) * 100;
  
  return (
    <div className="glass-card p-4 rounded-xl border border-border/50">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium">{homeValue}{unit}</span>
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
        <span className="text-sm font-medium">{awayValue}{unit}</span>
      </div>
      <div className="relative h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          className="absolute left-0 top-0 h-full bg-primary rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${homePercentage}%` }}
          transition={{ duration: 1, delay: 0.2 }}
        />
        <motion.div
          className="absolute right-0 top-0 h-full bg-secondary rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${100 - homePercentage}%` }}
          transition={{ duration: 1, delay: 0.2 }}
        />
      </div>
    </div>
  );
}

function EventItem({ event }: { event: any }) {
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
      <div className="text-sm font-bold w-8 text-center">{event.minute}'</div>
      <div className="text-lg">{getEventIcon(event.type)}</div>
      <div className="flex-1">
        <div className="font-medium">{event.player}</div>
        <div className="text-sm text-muted-foreground">{event.description}</div>
      </div>
    </motion.div>
  );
}
