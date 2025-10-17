"use client";
import { memo } from "react";
import { motion } from "framer-motion";
import { 
  FireIcon,
  CalendarIcon, 
  ClockIcon,
  CheckCircleIcon,
  StarIcon,
  FunnelIcon
} from "@heroicons/react/24/outline";
import type { LeagueCode } from "@/lib/constants";
import { LEAGUES } from "@/lib/constants";

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
    { value: "all" as const, label: "All", icon: FunnelIcon },
    { value: "live" as const, label: "Live", icon: FireIcon, highlight: true },
    { value: "today" as const, label: "Today", icon: CalendarIcon },
    { value: "upcoming" as const, label: "Upcoming", icon: ClockIcon },
    { value: "finished" as const, label: "Finished", icon: CheckCircleIcon },
    { 
      value: "favorites" as const, 
      label: favoriteCount > 0 ? `Favorites (${favoriteCount})` : "Favorites", 
      icon: StarIcon 
    },
  ];

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {/* Status Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.value;
          
          return (
            <motion.button
              key={tab.value}
              onClick={() => onTabChange(tab.value)}
              className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "hover:bg-muted text-muted-foreground hover:text-foreground"
              } ${tab.highlight && isActive ? "animate-pulse" : ""}`}
              whileHover={!isActive ? { scale: 1.02 } : {}}
              whileTap={{ scale: 0.98 }}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              
              {isActive && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-foreground rounded-full"
                  layoutId="activeTab"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* League Filter */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        <button
          onClick={() => onLeagueChange(null)}
          className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            selectedLeague === null
              ? "bg-accent text-accent-foreground"
              : "hover:bg-muted text-muted-foreground"
          }`}
        >
          All Leagues
        </button>
        
        {LEAGUES.map((league) => (
          <button
            key={league.code}
            onClick={() => onLeagueChange(league.code as LeagueCode)}
            className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              selectedLeague === league.code
                ? "bg-accent text-accent-foreground border border-primary/30"
                : "hover:bg-muted text-muted-foreground"
            }`}
            style={{
              ...(selectedLeague === league.code && { 
                borderColor: league.accent + "50",
                color: league.accent 
              })
            }}
          >
            {league.name}
          </button>
        ))}
      </div>
    </div>
  );
}

export const CompactFilters = memo(CompactFiltersCmp);

