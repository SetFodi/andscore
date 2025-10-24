"use client";
import { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FireIcon,
  CalendarIcon, 
  ClockIcon,
  CheckCircleIcon,
  StarIcon,
  Squares2X2Icon,
  XMarkIcon
} from "@heroicons/react/24/outline";
import type { LeagueCode } from "@/lib/constants";
import { LEAGUES } from "@/lib/constants";
import Image from "next/image";

export type CompactFilterTab = "all" | "live" | "today" | "upcoming" | "finished" | "favorites";

interface CompactFiltersProps {
  activeTab: CompactFilterTab;
  onTabChange: (tab: CompactFilterTab) => void;
  selectedLeague: LeagueCode | null;
  onLeagueChange: (league: LeagueCode | null) => void;
  favoriteCount?: number;
  className?: string;
}

function CompactFiltersCmp({
  activeTab,
  onTabChange,
  selectedLeague,
  onLeagueChange,
  favoriteCount = 0,
  className = ""
}: CompactFiltersProps) {
  const tabs = [
    { value: "all" as const, label: "All", icon: Squares2X2Icon },
    { value: "live" as const, label: "Live", icon: FireIcon, highlight: true },
    { value: "today" as const, label: "Today", icon: CalendarIcon },
    { value: "upcoming" as const, label: "Upcoming", icon: ClockIcon },
    { value: "finished" as const, label: "Finished", icon: CheckCircleIcon },
    { 
      value: "favorites" as const, 
      label: "Favorites", 
      icon: StarIcon,
      badge: favoriteCount > 0 ? favoriteCount : undefined
    },
  ];

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Status Tabs - Enhanced Design */}
      <div className="relative">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.value;
            
            return (
              <motion.button
                key={tab.value}
                onClick={() => onTabChange(tab.value)}
                className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                    : "glass-card border border-border/50 hover:border-primary/30 text-muted-foreground hover:text-foreground hover:shadow-md"
                }`}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                {tab.highlight && isActive && (
                  <motion.div
                    className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [1, 0.6, 1]
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                )}
                
                <Icon className={`w-4 h-4 ${tab.highlight && isActive ? "text-red-300" : ""}`} />
                <span>{tab.label}</span>
                
                {tab.badge !== undefined && (
                  <motion.span
                    className="px-2 py-0.5 rounded-full bg-primary-foreground/20 text-xs font-bold"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 15 }}
                  >
                    {tab.badge}
                  </motion.span>
                )}
                
                {isActive && (
                  <motion.div
                    className="absolute -bottom-2 left-0 right-0 h-1 bg-primary rounded-full"
                    layoutId="activeTabIndicator"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* League Filter - Redesigned */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground px-1">
            Competitions
          </span>
          {selectedLeague && (
            <motion.button
              onClick={() => onLeagueChange(null)}
              className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <XMarkIcon className="w-3 h-3" />
              Clear
            </motion.button>
          )}
        </div>
        
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
          <motion.button
            onClick={() => onLeagueChange(null)}
            className={`shrink-0 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              selectedLeague === null
                ? "bg-accent text-accent-foreground shadow-md"
                : "glass-card border border-border/50 hover:border-primary/30 text-muted-foreground hover:text-foreground"
            }`}
            whileHover={{ scale: 1.05, y: -1 }}
            whileTap={{ scale: 0.98 }}
          >
            All
          </motion.button>
          
          <AnimatePresence mode="popLayout">
            {LEAGUES.map((league, i) => {
              const isActive = selectedLeague === league.code;
              
              return (
                <motion.button
                  key={league.code}
                  onClick={() => onLeagueChange(league.code as LeagueCode)}
                  className={`shrink-0 flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? "glass-card border-2 shadow-lg"
                      : "glass-card border border-border/50 hover:border-primary/30 text-muted-foreground hover:text-foreground"
                  }`}
                  style={{
                    ...(isActive && { 
                      borderColor: league.accent,
                      color: league.accent,
                      backgroundColor: `${league.accent}15`
                    })
                  }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 400, 
                    damping: 17,
                    delay: i * 0.03
                  }}
                >
                  <div className="relative w-4 h-4">
                    <Image
                      src={
                        league.code === "PL" ? "/premier-league-1.svg" :
                        league.code === "PD" ? "/LaLiga_logo_2023.svg.png" :
                        league.code === "SA" ? "/Serie_A_logo_2022.svg.png" :
                        league.code === "BL1" ? "/Bundesliga_logo_(2017).svg.png" :
                        league.code === "FL1" ? "/Ligue_1_Uber_Eats_logo.svg.png" :
                        "/UEFA_Champions_League.svg.png"
                      }
                      alt={league.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <span>{league.name}</span>
                  
                  {isActive && (
                    <motion.div
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: league.accent }}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 15 }}
                    />
                  )}
                </motion.button>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export const CompactFilters = memo(CompactFiltersCmp);
