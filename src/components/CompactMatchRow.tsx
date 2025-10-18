"use client";
import { memo } from "react";
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
  const isLive = ["IN_PLAY", "PAUSED", "LIVE"].includes(match.status);
  const isFinished = ["FINISHED", "AWARDED"].includes(match.status);
  const scores = getDisplayedScore(match);
  const homeScore = typeof scores.home === "number" ? scores.home : "-";
  const awayScore = typeof scores.away === "number" ? scores.away : "-";
  const homeWinner = match.score.winner === "HOME_TEAM";
  const awayWinner = match.score.winner === "AWAY_TEAM";

  return (
    <motion.div
      className="group relative flex items-center gap-3 px-4 py-3 hover:bg-muted/30 transition-colors cursor-pointer border-b border-border/30 last:border-b-0"
      onClick={onClick}
      whileHover={{ x: 2 }}
      transition={{ duration: 0.15 }}
    >
      {/* Time / Status */}
      <div className="w-16 shrink-0 text-center">
        {isLive ? (
          <div className="flex flex-col items-center">
            <span className="text-xs font-bold text-red-500 animate-pulse">LIVE</span>
            <span className="text-[10px] text-red-500 font-semibold tabular-nums">
              {getLiveMinute(match) || ""}
            </span>
          </div>
        ) : isFinished ? (
          <span className="text-xs font-semibold text-emerald-600">FT</span>
        ) : (
          <span className="text-xs font-medium text-muted-foreground tabular-nums">
            {formatKickoffTime(match.utcDate)}
          </span>
        )}
      </div>

      {/* Teams and Scores */}
      <div className="flex-1 min-w-0">
        {/* Home Team */}
        <div className="flex items-center justify-between gap-2 mb-1">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={match.homeTeam.crest}
              alt=""
              className="w-5 h-5 object-contain shrink-0"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
            <span className={`text-sm truncate ${homeWinner ? "font-bold" : "font-medium"}`}>
              {match.homeTeam.name}
            </span>
          </div>
          <span className={`text-sm font-bold tabular-nums w-6 text-right ${
            homeWinner ? "text-primary" : ""
          }`}>
            {homeScore}
          </span>
        </div>

        {/* Away Team */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={match.awayTeam.crest}
              alt=""
              className="w-5 h-5 object-contain shrink-0"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
            <span className={`text-sm truncate ${awayWinner ? "font-bold" : "font-medium"}`}>
              {match.awayTeam.name}
            </span>
          </div>
          <span className={`text-sm font-bold tabular-nums w-6 text-right ${
            awayWinner ? "text-primary" : ""
          }`}>
            {awayScore}
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
          className="shrink-0 p-1 hover:scale-110 transition-transform"
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          {isFavorite ? (
            <StarSolidIcon className="w-4 h-4 text-yellow-500" />
          ) : (
            <StarOutlineIcon className="w-4 h-4 text-muted-foreground hover:text-yellow-500" />
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

