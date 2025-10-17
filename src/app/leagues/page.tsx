"use client";
import { LEAGUES } from "@/lib/constants";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { LeagueCardSkeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import {
  TrophyIcon,
  ArrowRightIcon,
  // SparklesIcon,
  MapPinIcon
} from "@heroicons/react/24/outline";

export default function LeaguesPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0
    }
  };

  return (
    <div className="flex flex-col gap-12">
      {/* Enhanced Header */}
      <motion.div
        className="relative text-center py-16 px-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Background Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent rounded-3xl blur-3xl" />
        
        <div className="relative z-10">
          <div className="flex justify-center mb-6">
            <Badge variant="success" className="px-5 py-2.5 text-sm font-bold shadow-lg">
              <TrophyIcon className="w-5 h-5 mr-2" />
              Top European Competitions
            </Badge>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6">
            <span className="gradient-text animate-gradient bg-gradient-to-r from-gradient-from via-gradient-via to-gradient-to">
              Football Leagues
            </span>
          </h1>

          <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Follow Europe's elite competitions with
            <br className="hidden sm:block" />
            <span className="text-primary font-bold">live standings, fixtures & real-time results</span>
          </p>

          {/* Stats Row */}
          <div className="flex items-center justify-center gap-8 mt-10 flex-wrap">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{LEAGUES.length}</div>
              <div className="text-sm text-muted-foreground font-medium">Leagues</div>
            </div>
            <div className="w-px h-8 bg-border" />
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">380+</div>
              <div className="text-sm text-muted-foreground font-medium">Matches/Season</div>
            </div>
            <div className="w-px h-8 bg-border" />
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">Live</div>
              <div className="text-sm text-muted-foreground font-medium">Updates</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Enhanced League Cards Grid */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {LEAGUES.map((league) => (
          <motion.div
            key={league.code}
            variants={cardVariants}
            whileHover={{
              scale: 1.03,
              transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.98 }}
          >
            <Link
              href={`/league/${league.code}`}
              className="group relative overflow-hidden rounded-2xl glass-card p-8 border border-border/50 block h-full transition-all duration-300 hover:border-primary/30 hover:shadow-2xl"
            >
              {/* Enhanced League accent gradient with glow */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 blur-2xl"
                style={{
                  background: `radial-gradient(circle at top left, ${league.accent}, transparent 70%)`
                }}
              />

              {/* Top accent line - thicker and more prominent */}
              <div
                className="absolute top-0 left-0 right-0 h-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300"
                style={{ 
                  backgroundColor: league.accent,
                  boxShadow: `0 4px 12px ${league.accent}50`
                }}
              />

              <div className="relative h-full flex flex-col">
                {/* Header with logo and country */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Image
                        src={
                          league.code === "PL" ? "/premier-league-1.svg" :
                          league.code === "PD" ? "/LaLiga_logo_2023.svg.png" :
                          league.code === "SA" ? "/Serie_A_logo_2022.svg.png" :
                          league.code === "BL1" ? "/Bundesliga_logo_(2017).svg.png" :
                          league.code === "FL1" ? "/Ligue_1_Uber_Eats_logo.svg.png" :
                          "/UEFA_Champions_League.svg.png"
                        }
                        alt={`${league.name} logo`}
                        width={40}
                        height={40}
                        className={`object-contain group-hover:scale-110 transition-transform duration-300 ${league.code === "CL" ? "ucl-logo" : ""}`}
                      />
                    </div>
                    <div>
                      <Badge variant="outline" className="text-xs font-medium mb-1">
                        <MapPinIcon className="w-3 h-3 mr-1" />
                        {league.country}
                      </Badge>
                    </div>
                  </div>

                  <Badge variant="league" className="text-xs">
                    {league.code === "CL" ? "European" : "Domestic"}
                  </Badge>
                </div>

                {/* League name */}
                <h2
                  className="text-2xl sm:text-3xl font-extrabold mb-4 group-hover:scale-[1.02] transition-all duration-300 flex-grow leading-tight"
                  style={{ color: league.accent }}
                >
                  {league.name}
                </h2>

                {/* Description */}
                <p className="text-muted-foreground mb-6 text-sm leading-relaxed line-clamp-2">
                  Live scores, fixtures, standings and comprehensive match statistics
                </p>

                {/* CTA */}
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/30 group-hover:border-primary/30 transition-colors">
                  <div className="flex items-center text-sm font-semibold text-muted-foreground group-hover:text-primary transition-colors duration-300">
                    <TrophyIcon className="w-5 h-5 mr-2 group-hover:scale-110 group-hover:rotate-12 transition-all" />
                    <span>View Details</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ArrowRightIcon className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* Fallback skeletons when no API key or heavy layout shift */}
      <div className="sr-only" aria-hidden="true">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <LeagueCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}


