import { LEAGUES } from "@/lib/constants";
import Link from "next/link";
import Image from "next/image";

export default function LeaguesPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="text-center">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
          <span className="gradient-text">European Football Leagues</span>
        </h1>
        <p className="text-muted-foreground text-lg">
          Explore the top 5 leagues and Champions League
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {LEAGUES.map((league) => (
          <Link
            key={league.code}
            href={`/league/${league.code}`}
            className="group relative overflow-hidden rounded-2xl glass-card p-8 hover:scale-[1.02] transition-all duration-300 border border-border/50"
          >
            {/* League accent gradient */}
            <div 
              className="absolute inset-0 opacity-5 group-hover:opacity-15 transition-opacity duration-300"
              style={{ 
                background: `linear-gradient(135deg, ${league.accent}33, transparent 60%)` 
              }}
            />
            
            <div className="relative">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3 logo-invert-dark">
                  <Image
                    src={
                      league.code === "PL" ? "/premier-league-1.svg" :
                      league.code === "PD" ? "/LaLiga_logo_2023.svg.png" :
                      league.code === "SA" ? "/Serie_A_logo_2022.svg.png" :
                      league.code === "BL1" ? "/Bundesliga_logo_(2017).svg.png" :
                      league.code === "FL1" ? "/Ligue_1_Uber_Eats_logo.svg.png" :
                      "/UEFA_Champions_League.svg.png"
                    }
                    alt=""
                    width={28}
                    height={28}
                    className="object-contain"
                  />
                  <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                    {league.country}
                  </div>
                </div>
              </div>
              
              <h2 
                className="text-2xl font-bold mb-3 group-hover:scale-105 transition-transform duration-200"
                style={{ color: league.accent }}
              >
                {league.name}
              </h2>
              
              <p className="text-muted-foreground mb-6">
                View live scores, fixtures, results and league standings
              </p>
              
              <div className="flex items-center text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                <span className="font-medium">Explore league</span>
                <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}


