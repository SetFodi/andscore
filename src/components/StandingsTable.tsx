import type { StandingTable } from "@/lib/fd";

export default function StandingsTable({ table }: { table: StandingTable[] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border/50 glass-card">
      <table className="w-full text-sm">
        <thead className="bg-muted/50">
          <tr className="text-muted-foreground text-xs font-semibold">
            <th className="px-4 py-3 text-left">#</th>
            <th className="px-4 py-3 text-left">Team</th>
            <th className="px-4 py-3 text-right">P</th>
            <th className="px-4 py-3 text-right">W</th>
            <th className="px-4 py-3 text-right">D</th>
            <th className="px-4 py-3 text-right">L</th>
            <th className="px-4 py-3 text-right">GD</th>
            <th className="px-4 py-3 text-right">Pts</th>
          </tr>
        </thead>
        <tbody>
          {table.map((row, index) => (
            <tr 
              key={row.team.id} 
              className={`border-t border-border/30 hover:bg-muted/20 transition-colors ${
                index < 4 ? "bg-green-50/50" : 
                index < 6 ? "bg-blue-50/50" : 
                index >= table.length - 3 ? "bg-red-50/50" : ""
              }`}
            >
              <td className="px-4 py-3 text-left">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  index < 4 ? "bg-green-500 text-white" :
                  index < 6 ? "bg-blue-500 text-white" :
                  index >= table.length - 3 ? "bg-red-500 text-white" :
                  "bg-muted text-muted-foreground"
                }`}>
                  {row.position}
                </div>
              </td>
              <td className="px-4 py-3 text-left">
                <div className="flex items-center gap-3 min-w-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={row.team.crest} alt="" className="h-6 w-6 object-contain rounded" />
                  <span className="truncate font-medium">{row.team.name}</span>
                </div>
              </td>
              <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">{row.playedGames}</td>
              <td className="px-4 py-3 text-right tabular-nums text-green-600 font-medium">{row.won}</td>
              <td className="px-4 py-3 text-right tabular-nums text-amber-600 font-medium">{row.draw}</td>
              <td className="px-4 py-3 text-right tabular-nums text-red-600 font-medium">{row.lost}</td>
              <td className="px-4 py-3 text-right tabular-nums font-medium">{row.goalDifference > 0 ? '+' : ''}{row.goalDifference}</td>
              <td className="px-4 py-3 text-right tabular-nums font-bold text-lg">{row.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


