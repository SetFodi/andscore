"use client";
import { LeagueBadge } from "@/components/LeagueBadge";
import { Badge } from "@/components/ui/badge";
import { TeamAvatar } from "@/components/ui/avatar";
import type { LeagueCode } from "@/lib/constants";
import type { Match } from "@/lib/fd";
import { motion } from "framer-motion";
import {
  PlayIcon as PlaySolidIcon,
  ClockIcon,
  CheckCircleIcon
} from "@heroicons/react/24/solid";

function TeamRow({ name, crest, score, highlight = false, isWinner = false }: {
  name: string;
  crest?: string;
  score?: number | null;
  highlight?: boolean;
  isWinner?: boolean;
}) {
  return (
    <motion.div
      className={`flex items-center justify-between gap-4 p-3 rounded-lg transition-all duration-300 ${
        highlight ? "bg-primary/5 border border-primary/20" : "hover:bg-muted/50"
      }`}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <TeamAvatar
          teamName={name}
          logoUrl={crest}
          size="md"
        />
        <div className="min-w-0 flex-1">
          <span className={`truncate block text-sm font-medium ${
            highlight ? "text-primary font-semibold" : "text-foreground"
          }`}>
            {name}
          </span>
          {isWinner && (
            <div className="flex items-center gap-1 mt-1">
              <CheckCircleIcon className="w-3 h-3 text-success" />
              <span className="text-xs text-success font-medium">Winner</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className={`tabular-nums text-right font-bold text-lg ${
          highlight ? "text-primary" : "text-foreground"
        }`}>
          {score ?? "-"}
        </span>
      </div>
    </motion.div>
  );
}

export default function MatchCard({
  match,
  showLeague = true,
  timeZone = "local",
  onClick
}: {
  match: Match;
  showLeague?: boolean;
  timeZone?: "local" | "utc" | string;
  onClick?: () => void;
}) {
  const status = match.status;
  const isLive = ["IN_PLAY", "PAUSED", "LIVE"].includes(status);
  const isFinished = ["FINISHED", "AWARDED"].includes(status);
  const ko = new Date(match.utcDate);

  const getStatusBadge = () => {
    if (isLive) {
      return (
        <Badge variant="live" className="px-3 py-1 text-xs font-bold">
          <PlaySolidIcon className="w-3 h-3 mr-1" />
          LIVE
        </Badge>
      );
    }

    if (isFinished) {
      return (
        <Badge variant="success" className="px-3 py-1 text-xs font-semibold">
          <CheckCircleIcon className="w-3 h-3 mr-1" />
          FT
        </Badge>
      );
    }

    return (
      <Badge variant="outline" className="px-3 py-1 text-xs font-medium">
        <ClockIcon className="w-3 h-3 mr-1" />
        {ko.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: timeZone === "local" ? undefined : timeZone === "utc" ? "UTC" : timeZone,
        })}
      </Badge>
    );
  };

  return (
    <motion.div
      className="group match-card rounded-2xl glass-card border border-border/50 p-6 hover:shadow-xl transition-all duration-300 cursor-pointer"
      whileHover={{
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      {/* Header with league and status */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          {showLeague && <LeagueBadge code={match.competition.code as LeagueCode} />}
        </div>
        {getStatusBadge()}
      </div>

      {/* Match Details */}
      <div className="space-y-3">
        <TeamRow
          name={match.homeTeam.name}
          crest={match.homeTeam.crest}
          score={match.score.fullTime.home}
          highlight={match.score.winner === "HOME_TEAM"}
          isWinner={match.score.winner === "HOME_TEAM" && isFinished}
        />

        {/* VS Divider */}
        <div className="flex items-center justify-center py-2">
          <div className="flex items-center gap-3">
            <div className="h-px bg-border flex-1 w-8" />
            <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-full">
              VS
            </span>
            <div className="h-px bg-border flex-1 w-8" />
          </div>
        </div>

        <TeamRow
          name={match.awayTeam.name}
          crest={match.awayTeam.crest}
          score={match.score.fullTime.away}
          highlight={match.score.winner === "AWAY_TEAM"}
          isWinner={match.score.winner === "AWAY_TEAM" && isFinished}
        />
      </div>

      {/* Match Date/Time Footer */}
      <div className="mt-4 pt-4 border-t border-border/50">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            {ko.toLocaleDateString([], {
              weekday: "short",
              month: "short",
              day: "numeric"
            })}
          </span>
          <span>
            {ko.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              timeZone: timeZone === "local" ? undefined : timeZone === "utc" ? "UTC" : timeZone,
            })}
          </span>
        </div>
      </div>
    </motion.div>
  );
}


