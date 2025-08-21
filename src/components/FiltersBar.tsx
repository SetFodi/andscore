"use client";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import * as ToggleGroup from "@radix-ui/react-toggle-group";
import { DayPicker } from "react-day-picker";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import {
  CalendarIcon,
  GlobeAltIcon,
  PlayIcon,
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
  const displayDate = selectedDate.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

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
      label: "Favorites",
      icon: activeTab === "favorites" ? StarSolidIcon : StarIcon,
      description: "Your starred teams"
    },
  ];

  return (
    <motion.div
      className="glass-card border border-border/50 rounded-2xl p-4 shadow-lg"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 justify-between">
        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          <ToggleGroup.Root
            type="single"
            value={activeTab}
            onValueChange={(v) => v && onTabChange(v as FilterTab)}
            className="flex flex-wrap items-center gap-2"
          >
            {filterTabs.map((tab) => {
              const IconComponent = tab.icon;
              const isActive = activeTab === tab.value;

              return (
                <ToggleGroup.Item
                  key={tab.value}
                  value={tab.value}
                  className={`
                    group relative overflow-hidden rounded-xl px-4 py-2.5 text-sm font-medium
                    transition-all duration-300 ease-out
                    ${isActive
                      ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                      : 'glass-card border border-border/50 text-muted-foreground hover:text-foreground hover:border-primary/50'
                    }
                    ${tab.variant === 'live' && isActive ? 'animate-pulse' : ''}
                  `}
                >
                  <div className="flex items-center gap-2 relative z-10">
                    <IconComponent className={`w-4 h-4 ${tab.variant === 'live' && isActive ? 'text-white' : ''}`} />
                    <span>{tab.label}</span>
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
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-xs font-medium">
            Filter by Date
          </Badge>

          <Popover>
            <PopoverTrigger asChild>
              <motion.button
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl glass-card border border-border/50 text-sm font-medium hover:border-primary/50 transition-all duration-300 group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <CalendarIcon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="font-semibold">{displayDate}</span>
                <ChevronDownIcon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-all duration-300 group-hover:rotate-180" />
              </motion.button>
            </PopoverTrigger>

            <PopoverContent align="end" className="w-80 p-4">
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
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
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

                {/* Calendar */}
                <div className="border-t border-border/50 pt-4">
                  <DayPicker
                    mode="single"
                    selected={selectedDate}
                    onSelect={(d) => d && onDateChange(d)}
                    className="rdp-custom"
                  />
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </motion.div>
  );
}


