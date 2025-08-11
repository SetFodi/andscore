import { LeagueBadge } from "@/components/LeagueBadge";
import type { LeagueCode } from "@/lib/constants";
import type { Match } from "@/lib/fd";

function TeamRow({ name, crest, score, highlight = false }: {
  name: string;
  crest?: string;
  score?: number | null;
  highlight?: boolean;
}) {
  return (
    <div className={`flex items-center justify-between gap-3 ${highlight ? "font-semibold" : ""}`}>
      <div className="flex items-center gap-2 min-w-0">
        {crest ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={crest} alt="" className="h-5 w-5 rounded-sm object-contain" />
        ) : (
          <div className="h-5 w-5 rounded-sm bg-black/10 dark:bg-white/10" />
        )}
        <span className="truncate">{name}</span>
      </div>
      <span className="tabular-nums text-right w-6">{score ?? "-"}</span>
    </div>
  );
}

export default function MatchCard({ match }: { match: Match }) {
  const status = match.status;
  const isLive = ["IN_PLAY", "PAUSED", "LIVE"].includes(status);
  const isFinished = ["FINISHED", "AWARDED"].includes(status);
  const ko = new Date(match.utcDate);

  return (
    <div className="rounded-2xl bg-white/70 dark:bg-white/5 backdrop-blur-md border border-black/10 dark:border-white/10 p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between gap-4">
        <LeagueBadge code={match.competition.code as LeagueCode} />
        <div className={`text-xs font-medium ${isLive ? "text-red-600" : "text-foreground/60"}`}>
          {isLive ? "LIVE" : isFinished ? "FT" : ko.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <TeamRow name={match.homeTeam.name} crest={match.homeTeam.crest} score={match.score.fullTime.home} highlight={match.score.winner === "HOME_TEAM"} />
        <TeamRow name={match.awayTeam.name} crest={match.awayTeam.crest} score={match.score.fullTime.away} highlight={match.score.winner === "AWAY_TEAM"} />
      </div>
    </div>
  );
}


