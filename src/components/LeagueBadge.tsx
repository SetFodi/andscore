"use client";
import Link from "next/link";
import { LEAGUES, type LeagueCode } from "@/lib/constants";
import Image from "next/image";

export function LeagueBadge({ code, large = false }: { code: LeagueCode; large?: boolean }) {
  const league = LEAGUES.find((l) => l.code === code)!;
  const size = large ? "px-3 py-1.5 text-sm" : "px-2 py-0.5 text-xs";
  const logoMap: Record<string, string> = {
    PL: "/premier-league-1.svg",
    PD: "/LaLiga_logo_2023.svg.png",
    SA: "/Serie_A_logo_2022.svg.png",
    BL1: "/Bundesliga_logo_(2017).svg.png",
    FL1: "/Ligue_1_Uber_Eats_logo.svg.png",
    CL: "/UEFA_Champions_League.svg.png",
  };
  return (
    <Link
      href={`/league/${league.code}`}
      className={`inline-flex items-center gap-2 rounded-full ${size}`}
      style={{ border: `1px solid ${league.accent}55`, color: league.accent }}
    >
      <Image src={logoMap[league.code]} alt="" width={14} height={14} className={`object-contain ${league.code === "CL" ? "ucl-logo" : ""}`} />
      <span className="font-semibold">{league.name}</span>
    </Link>
  );
}


