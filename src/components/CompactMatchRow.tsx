"use client";
import { memo, useState, useEffect } from "react";
import type { Match } from "@/lib/fd";
import { getLiveMinute, getDisplayedScore, formatKickoffTime } from "@/lib/fd";
import { motion } from "framer-motion";
import { StarIcon as StarSolidIcon } from "@heroicons/react/24/solid";
import { StarIcon as StarOutlineIcon } from "@heroicons/react/24/outline";

interface CompactMatchRowProps {
  match: Match;
  onClick?: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

function CompactMatchRowCmp({ match, onClick, isFavorite, onToggleFavorite }: CompactMatchRowProps) {
  const [mounted, setMounted] = useState(false);
  
  // Prevent hydration mismatch by only showing dynamic content after mount
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const isLive = ["IN_PLAY", "PAUSED", "LIVE"].includes(match.status);
  const isFinished = ["FINISHED", "AWARDED"].includes(match.status);
  const homeWinner = match.score.winner === "HOME_TEAM";
  const awayWinner = match.score.winner === "AWAY_TEAM";
  
  // Calculate scores only after mount to prevent hydration mismatch
  const getScores = () => {
    if (!mounted) {
      return { home: "-", away: "-" };
    }
    const scores = getDisplayedScore(match);
    return {
      home: typeof scores.home === "number" ? scores.home : "-",
      away: typeof scores.away === "number" ? scores.away : "-"
    };
  };
  
  const { home: displayHomeScore, away: displayAwayScore } = getScores();

  return (
    <motion.div
      className="group relative flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2.5 md:py-3 hover:bg-muted/30 active:bg-muted/40 transition-colors cursor-pointer border-b border-border/30 last:border-b-0"
      onClick={onClick}
      whileHover={{ x: 2 }}
      whileTap={{ scale: 0.995 }}
      transition={{ duration: 0.15 }}
      suppressHydrationWarning
    >
      {/* Time / Status */}
      <div className="w-12 md:w-16 shrink-0 text-center">
        {isLive ? (
          <div className="flex flex-col items-center">
            <span className="text-[10px] md:text-xs font-bold text-red-500 animate-pulse">LIVE</span>
            <span className="text-[9px] md:text-[10px] text-red-500 font-semibold tabular-nums">
              {getLiveMinute(match) || ""}
            </span>
          </div>
        ) : isFinished ? (
          <span className="text-[10px] md:text-xs font-semibold text-emerald-600">FT</span>
        ) : (
          <span className="text-[10px] md:text-xs font-medium text-muted-foreground tabular-nums">
            {formatKickoffTime(match.utcDate)}
          </span>
        )}
      </div>

      {/* Teams and Scores */}
      <div className="flex-1 min-w-0">
        {/* Home Team */}
        <div className="flex items-center justify-between gap-1.5 md:gap-2 mb-0.5 md:mb-1">
          <div className="flex items-center gap-1.5 md:gap-2 min-w-0 flex-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={match.homeTeam.crest}
              alt=""
              className="w-4 md:w-5 h-4 md:h-5 object-contain shrink-0"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
            <span className={`text-xs md:text-sm truncate ${homeWinner ? "font-bold" : "font-medium"}`}>
              {match.homeTeam.name}
            </span>
          </div>
          <span 
            className={`text-xs md:text-sm font-bold tabular-nums w-5 md:w-6 text-right ${
              homeWinner ? "text-primary" : ""
            }`}
            suppressHydrationWarning
          >
            {displayHomeScore}
          </span>
        </div>

        {/* Away Team */}
        <div className="flex items-center justify-between gap-1.5 md:gap-2">
          <div className="flex items-center gap-1.5 md:gap-2 min-w-0 flex-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={match.awayTeam.crest}
              alt=""
              className="w-4 md:w-5 h-4 md:h-5 object-contain shrink-0"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
            <span className={`text-xs md:text-sm truncate ${awayWinner ? "font-bold" : "font-medium"}`}>
              {match.awayTeam.name}
            </span>
          </div>
          <span 
            className={`text-xs md:text-sm font-bold tabular-nums w-5 md:w-6 text-right ${
              awayWinner ? "text-primary" : ""
            }`}
            suppressHydrationWarning
          >
            {displayAwayScore}
          </span>
        </div>
      </div>

      {/* Favorite Star */}
      {onToggleFavorite && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite();
          }}
          className="shrink-0 p-1.5 md:p-1 hover:scale-110 active:scale-95 transition-transform touch-manipulation"
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          {isFavorite ? (
            <StarSolidIcon className="w-4 h-4 md:w-5 md:h-5 text-yellow-500" />
          ) : (
            <StarOutlineIcon className="w-4 h-4 md:w-5 md:h-5 text-muted-foreground hover:text-yellow-500" />
          )}
        </button>
      )}

      {/* Live indicator bar */}
      {isLive && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500" />
      )}
    </motion.div>
  );
}

export const CompactMatchRow = memo(CompactMatchRowCmp);

