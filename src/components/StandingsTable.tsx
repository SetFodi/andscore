import type { StandingTable } from "@/lib/fd";

export default function StandingsTable({ table }: { table: StandingTable[] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur-md">
      <table className="w-full text-sm">
        <thead className="text-foreground/60 text-xs">
          <tr>
            <th className="px-3 py-2 text-left">#</th>
            <th className="px-3 py-2 text-left">Team</th>
            <th className="px-3 py-2 text-right">P</th>
            <th className="px-3 py-2 text-right">W</th>
            <th className="px-3 py-2 text-right">D</th>
            <th className="px-3 py-2 text-right">L</th>
            <th className="px-3 py-2 text-right">GD</th>
            <th className="px-3 py-2 text-right">Pts</th>
          </tr>
        </thead>
        <tbody>
          {table.map((row) => (
            <tr key={row.team.id} className="border-t border-black/5 dark:border-white/5">
              <td className="px-3 py-2 text-left tabular-nums">{row.position}</td>
              <td className="px-3 py-2 text-left">
                <div className="flex items-center gap-2 min-w-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={row.team.crest} alt="" className="h-5 w-5 object-contain" />
                  <span className="truncate">{row.team.name}</span>
                </div>
              </td>
              <td className="px-3 py-2 text-right tabular-nums">{row.playedGames}</td>
              <td className="px-3 py-2 text-right tabular-nums">{row.won}</td>
              <td className="px-3 py-2 text-right tabular-nums">{row.draw}</td>
              <td className="px-3 py-2 text-right tabular-nums">{row.lost}</td>
              <td className="px-3 py-2 text-right tabular-nums">{row.goalDifference}</td>
              <td className="px-3 py-2 text-right tabular-nums font-semibold">{row.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


