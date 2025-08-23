"use client";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { useMatchModal } from "@/components/MatchModalProvider";
import type { Match } from "@/lib/fd";
import { TOP_LEAGUE_CODES, type LeagueCode } from "@/lib/constants";
import { getLiveMinute } from "@/lib/fd";

function isLive(status: string) {
  return ["IN_PLAY", "PAUSED", "LIVE"].includes(status);
}

export default function LiveTicker({
  leagues = TOP_LEAGUE_CODES,
  className,
  refreshMs = 30000,
}: {
  leagues?: LeagueCode[];
  className?: string;
  refreshMs?: number;
}) {
  const { openMatchModal } = useMatchModal();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchLive() {
    try {
      setLoading(true);
      const now = new Date();
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const q = new URLSearchParams({
        competitions: (leagues || TOP_LEAGUE_CODES).join(","),
        dateFrom: now.toISOString().slice(0, 10),
        dateTo: tomorrow.toISOString().slice(0, 10),
      });
      const res = await fetch(`/api/fd/matches?${q.toString()}`, { cache: "no-store" });
      if (!res.ok) throw new Error("failed");
      const data = await res.json();
      const live = (data.matches as Match[]).filter(m => isLive(m.status));
      setMatches(live);
    } catch {
      setMatches([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchLive();
    const id = setInterval(fetchLive, refreshMs);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(leagues), refreshMs]);

  const hasLive = matches.length > 0;

  const content = useMemo(() => (
    <div className="relative overflow-hidden">
      {/* Edge fades */}
      <div className="pointer-events-none absolute left-0 top-0 h-full w-8 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-background to-transparent" />

      <div className="flex gap-3 overflow-x-auto no-scrollbar px-2" role="list" aria-label="Live matches">
        {matches.map((m) => {
          const homeScore = m.score.fullTime.home ?? "-";
          const awayScore = m.score.fullTime.away ?? "-";
          const aria = `Open match details: ${m.homeTeam.name} ${homeScore}-${awayScore} ${m.awayTeam.name}`;
          return (
            <motion.button
              key={m.id}
              role="listitem"
              aria-label={aria}
              onClick={() => openMatchModal(m)}
              className="flex items-center gap-2 rounded-xl px-3 py-2 glass-card border border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 whitespace-nowrap"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
              </span>
              <span className="text-xs font-semibold text-red-500">LIVE</span>
              {(() => {
                const min = getLiveMinute(m);
                return min ? (
                  <>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs font-semibold">{min}</span>
                  </>
                ) : null;
              })()}
              <span className="text-xs text-muted-foreground">•</span>
              <span className="text-sm font-medium truncate max-w-[14ch]">{m.homeTeam.name}</span>
              <span className="text-xs text-muted-foreground">•</span>
              <span className="tabular-nums text-sm font-bold">{homeScore}</span>
              <span className="text-xs text-muted-foreground">-</span>
              <span className="tabular-nums text-sm font-bold">{awayScore}</span>
              <span className="text-xs text-muted-foreground">•</span>
              <span className="text-sm font-medium truncate max-w-[14ch]">{m.awayTeam.name}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  ), [matches, openMatchModal]);

  if (loading && !hasLive) {
    return (
      <div className={`glass-card border border-border/50 rounded-2xl p-3 ${className ?? ""}`} role="status" aria-live="polite" aria-busy="true">
        <div className="flex items-center gap-3">
          <Badge variant="live" className="px-2 py-1 text-xs font-semibold">Live Now</Badge>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-primary" />
            <span>Checking live games…</span>
          </div>
        </div>
      </div>
    );
  }

  if (!hasLive) return null;

  return (
    <AnimatePresence>
      <motion.div
        className={`glass-card border border-border/50 rounded-2xl p-3 ${className ?? ""}`}
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.25 }}
        role="region"
        aria-label="Live match ticker"
        aria-live="polite"
        aria-busy={loading}
      >
        <div className="flex items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <Badge variant="live" className="px-2 py-1 text-xs font-semibold">Live Now</Badge>
            <span className="text-xs text-muted-foreground">{matches.length} matches</span>
          </div>
          <span className="text-[10px] text-muted-foreground">Auto-updating</span>
        </div>
        {content}
      </motion.div>
    </AnimatePresence>
  );
}
