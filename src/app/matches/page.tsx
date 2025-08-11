"use client";
import { LEAGUES, TOP_LEAGUE_CODES, type LeagueCode } from "@/lib/constants";
import { getMatchesByDateRange } from "@/lib/fd";
import MatchCard from "@/components/MatchCard";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type MatchType = Awaited<ReturnType<typeof getMatchesByDateRange>>[number];
type Grouped = Record<string, Record<LeagueCode, MatchType[]>>;

function getLocalRange(days: number, anchor: Date) {
  const start = new Date(anchor);
  const end = new Date(anchor);
  end.setDate(end.getDate() + days);
  const from = start.toISOString().slice(0, 10);
  const to = end.toISOString().slice(0, 10);
  return { from, to };
}

export default function MatchesPage() {
  const [dateAnchor, setDateAnchor] = useState<Date>(new Date());
  const [tab, setTab] = useState<"live" | "today" | "upcoming">("today");
  const [favoriteLeagues, setFavoriteLeagues] = useState<LeagueCode[]>(() => {
    try {
      const saved = localStorage.getItem("fav_leagues");
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  const range = useMemo(() => {
    if (tab === "live") return getLocalRange(0, new Date());
    if (tab === "today") return getLocalRange(0, dateAnchor);
    return getLocalRange(7, dateAnchor);
  }, [tab, dateAnchor]);

  const [matches, setMatches] = useState<MatchType[]>([]);
  useEffect(() => {
    let ignore = false;
    getMatchesByDateRange(TOP_LEAGUE_CODES, range.from, range.to)
      .then((m) => {
        if (!ignore) setMatches(m);
      })
      .catch(() => setMatches([]));
    return () => {
      ignore = true;
    };
  }, [range.from, range.to]);

  const grouped = useMemo(() => {
    const g: Grouped = {} as Grouped;
    for (const m of matches) {
      if (tab === "live" && !["IN_PLAY", "PAUSED", "LIVE"].includes(m.status)) continue;
      if (tab === "today") {
        const todayKey = new Date(dateAnchor).toISOString().slice(0, 10);
        if (m.utcDate.slice(0, 10) !== todayKey) continue;
      }
      const dateKey = m.utcDate.slice(0, 10);
      const league = m.competition.code as LeagueCode;
      g[dateKey] = g[dateKey] || ({} as Grouped[string]);
      g[dateKey][league] = g[dateKey][league] || [];
      g[dateKey][league].push(m);
    }
    return g;
  }, [matches, tab, dateAnchor]);

  const sortedDates = useMemo(() => Object.keys(grouped).sort(), [grouped]);

  function toggleFavorite(code: LeagueCode) {
    setFavoriteLeagues((prev) => {
      const exists = prev.includes(code);
      const next = exists ? prev.filter((c) => c !== code) : [...prev, code];
      localStorage.setItem("fav_leagues", JSON.stringify(next));
      return next;
    });
  }

  // build day pills: 14-day window centered on anchor (±6 days)
  const dayPills = useMemo(() => {
    const days: Date[] = [];
    const start = new Date(dateAnchor);
    start.setDate(start.getDate() - 6);
    for (let i = 0; i < 14; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      days.push(d);
    }
    return days;
  }, [dateAnchor]);

  function setAnchorAndFocus(d: Date) {
    setDateAnchor(d);
    setTab("today");
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Controls bar */}
      <div className="sticky top-16 z-40 glass-card border border-border/50 rounded-2xl p-3 flex flex-wrap items-center gap-3 justify-between">
        {/* Tabs */}
        <div className="flex items-center gap-2">
          {(["live", "today", "upcoming"] as const).map((t) => (
            <button
              key={t}
              className={`px-3 py-1.5 rounded-xl text-sm font-medium ${
                tab === t ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}
              onClick={() => setTab(t)}
            >
              {t === "live" ? "Live" : t === "today" ? "Today" : "Upcoming"}
            </button>
          ))}
        </div>

        {/* Date controls */}
        <div className="flex items-center gap-2">
          <button
            className="px-3 py-1.5 rounded-xl bg-muted text-sm"
            onClick={() => setAnchorAndFocus(new Date(dateAnchor.getTime() - 24 * 60 * 60 * 1000))}
            aria-label="Previous day"
          >
            ◀
          </button>
          <input
            type="date"
            className="px-3 py-1.5 rounded-xl bg-muted text-sm"
            value={new Date(dateAnchor).toISOString().slice(0, 10)}
            onChange={(e) => setAnchorAndFocus(new Date(e.target.value))}
          />
          <button
            className="px-3 py-1.5 rounded-xl bg-muted text-sm"
            onClick={() => setAnchorAndFocus(new Date(dateAnchor.getTime() + 24 * 60 * 60 * 1000))}
            aria-label="Next day"
          >
            ▶
          </button>
        </div>
      </div>

      {/* Day pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
        {dayPills.map((d) => {
          const isActive = d.toDateString() === dateAnchor.toDateString();
          return (
            <button
              key={d.toISOString()}
              onClick={() => setAnchorAndFocus(d)}
              className={`whitespace-nowrap px-3 py-1.5 rounded-xl text-sm ${
                isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}
            >
              {d.toLocaleDateString(undefined, { month: "short", day: "numeric" })}
            </button>
          );
        })}
      </div>

      {/* Days */}
      {sortedDates.length === 0 && (
        <div className="text-center py-16">
          <div className="glass-card rounded-2xl p-8 border border-border/50 max-w-md mx-auto">
            <div className="text-lg font-semibold mb-2">No data</div>
            <p className="text-muted-foreground">Adjust filters or pick another date.</p>
          </div>
        </div>
      )}

      {sortedDates.map((date) => (
        <section key={date} className="flex flex-col gap-6">
          <div className="sticky top-28 z-10 py-2 -mx-4 px-4 sm:mx-0 sm:px-0 bg-background/80 backdrop-blur border-b border-border/50">
            <h2 className="text-xl font-bold">{new Date(date).toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" })}</h2>
          </div>

          {(() => {
            const leaguesOrdered = [
              ...LEAGUES.filter((l) => favoriteLeagues.includes(l.code)),
              ...LEAGUES.filter((l) => !favoriteLeagues.includes(l.code)),
            ];
            return leaguesOrdered.map((l) => {
            const list = grouped[date]?.[l.code] || [];
            if (list.length === 0) return null;
              const fav = favoriteLeagues.includes(l.code);
              return (
                <div key={`${date}-${l.code}`} className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold" style={{ color: l.accent }}>{l.name}</h3>
                      <button
                        className={`text-xs px-2 py-1 rounded-full border ${fav ? "bg-primary text-primary-foreground border-transparent" : "text-muted-foreground"}`}
                        onClick={() => toggleFavorite(l.code)}
                      >
                        {fav ? "Favorited" : "Favorite"}
                      </button>
                    </div>
                    <Link href={`/league/${l.code}`} className="text-sm text-muted-foreground hover:text-foreground">Open →</Link>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {list.map((m) => (
                      <MatchCard key={m.id} match={m} showLeague={false} />
                    ))}
                  </div>
                </div>
              );
            });
          })()}
        </section>
      ))}
    </div>
  );
}


