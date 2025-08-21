"use client";
import { format, addDays, isToday, isSameDay } from "date-fns";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import * as ToggleGroup from "@radix-ui/react-toggle-group";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { useFavorites } from "@/hooks/useFavorites";
import {
  CalendarIcon,
  GlobeAltIcon,
  ClockIcon,
  StarIcon,
  ChevronDownIcon
} from "@heroicons/react/24/outline";
import {
  PlayIcon as PlaySolidIcon,
  StarIcon as StarSolidIcon
} from "@heroicons/react/24/solid";

export type FilterTab = "all" | "live" | "today" | "upcoming" | "favorites";

export default function FiltersBar({
  activeTab,
  onTabChange,
  selectedDate,
  onDateChange,
  quickDates,
}: {
  activeTab: FilterTab;
  onTabChange: (t: FilterTab) => void;
  selectedDate: Date;
  onDateChange: (d: Date) => void;
  quickDates: Array<{ label: string; date: Date }>;
}) {
  const { favoriteTeams } = useFavorites();
  const displayDate = format(selectedDate, "PP");

  const filterTabs = [
    {
      value: "all",
      label: "All Matches",
      icon: GlobeAltIcon,
      description: "View all matches"
    },
    {
      value: "live",
      label: "Live",
      icon: PlaySolidIcon,
      description: "Currently playing",
      variant: "live" as const
    },
    {
      value: "today",
      label: "Today",
      icon: CalendarIcon,
      description: "Today's fixtures"
    },
    {
      value: "upcoming",
      label: "Upcoming",
      icon: ClockIcon,
      description: "Future matches"
    },
    {
      value: "favorites",
      label: favoriteTeams.length > 0 ? `Favorites (${favoriteTeams.length})` : "Favorites",
      icon: activeTab === "favorites" ? StarSolidIcon : StarIcon,
      description: favoriteTeams.length > 0 ? `${favoriteTeams.length} favorite teams` : "No favorite teams yet"
    },
  ];

  return (
    <motion.div
      className="glass-card border border-border/50 rounded-2xl p-4 shadow-lg md:filters-bar-mobile"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Filter Tabs */}
        <div className="w-full md:w-auto">
          <ToggleGroup.Root
            type="single"
            value={activeTab}
            onValueChange={(v) => v && onTabChange(v as FilterTab)}
            className="grid grid-cols-2 gap-2 md:flex md:flex-wrap md:items-center"
          >
            {filterTabs.map((tab) => {
              const IconComponent = tab.icon;
              const isActive = activeTab === tab.value;

              return (
                <ToggleGroup.Item
                  key={tab.value}
                  value={tab.value}
                  className={`
                    group relative overflow-hidden rounded-xl px-3 py-3 text-sm font-medium
                    transition-all duration-300 ease-out min-h-[48px] w-full
                    md:px-4 md:py-2.5 md:w-auto md:min-h-auto
                    ${isActive
                      ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                      : 'glass-card border border-border/50 text-muted-foreground hover:text-foreground hover:border-primary/50'
                    }
                    ${tab.variant === 'live' && isActive ? 'animate-pulse' : ''}
                  `}
                >
                  <div className="flex items-center justify-center gap-2 relative z-10 md:justify-start">
                    <IconComponent className={`w-4 h-4 ${tab.variant === 'live' && isActive ? 'text-white' : ''}`} />
                    <span className="text-xs md:text-sm">{tab.label}</span>
                  </div>

                  {/* Hover effect */}
                  <motion.div
                    className="absolute inset-0 bg-primary/10 rounded-xl"
                    initial={{ scale: 0, opacity: 0 }}
                    whileHover={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  />

                  {/* Active indicator */}
                  {isActive && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-foreground rounded-full"
                      layoutId="activeTab"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </ToggleGroup.Item>
              );
            })}
          </ToggleGroup.Root>
        </div>

        {/* Enhanced Date Picker */}
        <div className="w-full md:w-auto">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-3">
            <Badge variant="outline" className="text-xs font-medium self-start md:self-auto">
              Filter by Date
            </Badge>

            <Popover>
              <PopoverTrigger asChild>
                <motion.button
                  className="flex items-center justify-between gap-2 px-4 py-3 rounded-xl glass-card border border-border/50 text-sm font-medium hover:border-primary/50 transition-all duration-300 group w-full md:w-auto md:py-2.5"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    <span className="font-semibold">{displayDate}</span>
                  </div>
                  <ChevronDownIcon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-all duration-300 group-hover:rotate-180" />
                </motion.button>
              </PopoverTrigger>

            <PopoverContent align="end" className="w-96 p-4 md:w-96 max-w-[calc(100vw-32px)]">
              <div className="space-y-4">
                {/* Quick Date Selection */}
                <div>
                  <h4 className="text-sm font-semibold mb-3 text-foreground">Quick Select</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {quickDates.map((q) => {
                      const isSelected = selectedDate.toDateString() === q.date.toDateString();
                      return (
                        <motion.button
                          key={q.label}
                          onClick={() => onDateChange(q.date)}
                          className={`px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 min-h-[44px] ${
                            isSelected
                              ? "bg-primary text-primary-foreground shadow-md"
                              : "glass-card border border-border/50 hover:border-primary/50 hover:bg-primary/5"
                          }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {q.label}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* Date List - Flashscore Style */}
                <div className="border-t border-border/50 pt-4">
                  <div className="space-y-1 max-h-48 overflow-y-auto">
                    {(() => {
                      const dates = [];
                      for (let i = -7; i <= 7; i++) {
                        const date = addDays(selectedDate, i);
                        dates.push(date);
                      }
                      return dates.map((date, index) => {
                        const isSelectedDate = isSameDay(date, selectedDate);
                        const isTodayDate = isToday(date);

                        return (
                          <button
                            key={index}
                            onClick={() => onDateChange(date)}
                            className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                              isSelectedDate
                                ? 'bg-primary text-primary-foreground'
                                : isTodayDate
                                ? 'bg-accent text-accent-foreground hover:bg-accent/80'
                                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                            }`}
                          >
                            <div className="flex justify-between items-center">
                              <span>{format(date, "EEE, MMM d")}</span>
                              {isTodayDate && (
                                <span className="text-xs text-primary">Today</span>
                              )}
                            </div>
                          </button>
                        );
                      });
                    })()}
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          </div>
        </div>
      </div>
    </motion.div>
  );
}


