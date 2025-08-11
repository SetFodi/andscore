"use client";
import Link from "next/link";
import { LEAGUES, type LeagueCode } from "@/lib/constants";

export function LeagueBadge({ code, large = false }: { code: LeagueCode; large?: boolean }) {
  const league = LEAGUES.find((l) => l.code === code)!;
  const size = large ? "px-3 py-1.5 text-sm" : "px-2 py-0.5 text-xs";
  return (
    <Link
      href={`/league/${league.code}`}
      className={`inline-flex items-center gap-2 rounded-full ${size}`}
      style={{ border: `1px solid ${league.accent}55`, color: league.accent }}
    >
      <span className="font-semibold">{league.name}</span>
    </Link>
  );
}


