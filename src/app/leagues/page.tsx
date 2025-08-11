import { LEAGUES } from "@/lib/constants";
import Link from "next/link";

export default function LeaguesPage() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {LEAGUES.map((l) => (
        <Link
          key={l.code}
          href={`/league/${l.code}`}
          className="rounded-2xl p-6 border bg-white/70 dark:bg-white/5 backdrop-blur-md border-black/10 dark:border-white/10 hover:scale-[1.01] transition"
          style={{ boxShadow: `0 1px 0 ${l.accent}33 inset` }}
        >
          <div className="text-sm text-foreground/60">{l.country}</div>
          <div className="text-xl font-semibold" style={{ color: l.accent }}>{l.name}</div>
          <div className="mt-4 text-foreground/60 text-sm">Open →</div>
        </Link>
      ))}
    </div>
  );
}


