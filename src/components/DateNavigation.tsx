"use client";
import { memo } from "react";
import { format, addDays, subDays, isToday, isSameDay } from "date-fns";
import { motion } from "framer-motion";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

interface DateNavigationProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  className?: string;
}

function DateNavigationCmp({ selectedDate, onDateChange, className = "" }: DateNavigationProps) {
  const dates = [];
  for (let i = -3; i <= 3; i++) {
    dates.push(addDays(selectedDate, i));
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Previous Day */}
      <button
        onClick={() => onDateChange(subDays(selectedDate, 1))}
        className="p-2 rounded-lg hover:bg-muted transition-colors shrink-0"
        aria-label="Previous day"
      >
        <ChevronLeftIcon className="w-5 h-5" />
      </button>

      {/* Date Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
        {dates.map((date) => {
          const selected = isSameDay(date, selectedDate);
          const today = isToday(date);
          
          return (
            <motion.button
              key={date.toISOString()}
              onClick={() => onDateChange(date)}
              className={`relative shrink-0 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                selected
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : today
                  ? "bg-accent text-accent-foreground border border-primary/30"
                  : "hover:bg-muted"
              }`}
              whileHover={!selected ? { scale: 1.05 } : {}}
              whileTap={{ scale: 0.95 }}
            >
              <div className="flex flex-col items-center gap-0.5">
                <span className="text-xs opacity-90">
                  {format(date, "EEE")}
                </span>
                <span className="text-base font-bold">
                  {format(date, "d")}
                </span>
                {today && !selected && (
                  <span className="text-[10px] font-semibold text-primary">Today</span>
                )}
              </div>
              
              {selected && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-foreground rounded-full"
                  layoutId="selectedDate"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Next Day */}
      <button
        onClick={() => onDateChange(addDays(selectedDate, 1))}
        className="p-2 rounded-lg hover:bg-muted transition-colors shrink-0"
        aria-label="Next day"
      >
        <ChevronRightIcon className="w-5 h-5" />
      </button>
    </div>
  );
}

export const DateNavigation = memo(DateNavigationCmp);

