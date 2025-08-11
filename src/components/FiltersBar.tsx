"use client";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import * as ToggleGroup from "@radix-ui/react-toggle-group";
import { DayPicker } from "react-day-picker";
import { motion, AnimatePresence } from "framer-motion";

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

  return (
    <div className="glass-card border border-border/50 rounded-2xl p-3 flex flex-wrap items-center gap-3 justify-between">
      {/* Tabs */}
      <ToggleGroup.Root
        type="single"
        value={activeTab}
        onValueChange={(v) => v && onTabChange(v as FilterTab)}
        className="flex items-center gap-2"
      >
        {([
          { value: "all", label: "All", icon: "🌐" },
          { value: "live", label: "Live", icon: "🔴" },
          { value: "today", label: "Today", icon: "📅" },
          { value: "upcoming", label: "Upcoming", icon: "⏭️" },
          { value: "favorites", label: "Favorites", icon: "⭐" },
        ] as const).map((t) => (
          <ToggleGroup.Item
            key={t.value}
            value={t.value}
            className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground glass-card border border-border/50 px-3 py-2 rounded-xl text-sm font-medium"
          >
            <span className="mr-1">{t.icon}</span>
            {t.label}
          </ToggleGroup.Item>
        ))}
      </ToggleGroup.Root>

      {/* Date popover */}
      <Popover>
        <PopoverTrigger asChild>
          <button className="flex items-center gap-2 px-3 py-2 rounded-xl glass-card border border-border/50 text-sm font-medium">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            {displayDate}
          </button>
        </PopoverTrigger>
        <PopoverContent align="end">
          <div className="grid grid-cols-3 gap-2 text-sm mb-3">
            {quickDates.map((q) => (
              <button
                key={q.label}
                onClick={() => onDateChange(q.date)}
                className={`px-3 py-2 rounded-xl text-sm glass-card border border-border/50 ${
                  selectedDate.toDateString() === q.date.toDateString()
                    ? "bg-primary text-primary-foreground"
                    : "hover:scale-[1.02] transition"
                }`}
              >
                {q.label}
              </button>
            ))}
          </div>
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={(d) => d && onDateChange(d)}
            className="rdp-custom"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}


