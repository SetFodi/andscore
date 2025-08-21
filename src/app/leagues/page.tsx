"use client";
import { LEAGUES } from "@/lib/constants";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
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
        className="text-center py-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex justify-center mb-6">
          <Badge variant="success" className="px-4 py-2 text-sm font-semibold">
            <TrophyIcon className="w-4 h-4 mr-2" />
            Top European Leagues
          </Badge>
        </div>

        <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-6">
          <span className="gradient-text animate-gradient bg-gradient-to-r from-gradient-from via-gradient-via to-gradient-to">
            Football Leagues
          </span>
        </h1>

        <p className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Explore the top European leagues and Champions League.
          <br className="hidden sm:block" />
          <span className="text-primary font-semibold">Live standings, fixtures, and results.</span>
        </p>
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
              className="group relative overflow-hidden rounded-2xl glass-card p-8 border border-border/50 block h-full"
            >
              {/* Enhanced League accent gradient */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500"
                style={{
                  background: `linear-gradient(135deg, ${league.accent}44, transparent 70%)`
                }}
              />

              {/* Top accent line */}
              <div
                className="absolute top-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ backgroundColor: league.accent }}
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
                  className="text-2xl font-bold mb-4 group-hover:scale-105 transition-transform duration-300 flex-grow"
                  style={{ color: league.accent }}
                >
                  {league.name}
                </h2>

                {/* Description */}
                <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
                  View live scores, fixtures, results and league standings for the {league.name}
                </p>

                {/* CTA */}
                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-center text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors duration-300">
                    <TrophyIcon className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                    <span>Explore League</span>
                  </div>
                  <ArrowRightIcon className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}


