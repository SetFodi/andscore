"use client";
import { format, addDays, isToday, isSameDay } from "date-fns";
import { useState } from "react";

export default function DatePicker({
  selected,
  onSelect
}: {
  selected: Date;
  onSelect: (date: Date) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  // Generate date options (7 days before and after selected date)
  const generateDateOptions = () => {
    const dates = [];
    for (let i = -7; i <= 7; i++) {
      const date = addDays(selected, i);
      dates.push(date);
    }
    return dates;
  };

  const dateOptions = generateDateOptions();

  const handleQuickSelect = (daysOffset: number) => {
    const newDate = addDays(new Date(), daysOffset);
    onSelect(newDate);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-[#2a2a2a] border border-[#404040] rounded-lg hover:bg-[#333] transition-colors text-sm text-white"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
        {format(selected, "MMM d, yyyy")}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full mt-2 z-50 bg-[#1a1a1a] border border-[#333] rounded-lg shadow-xl min-w-[280px]">
            {/* Quick Select */}
            <div className="p-3 border-b border-[#333]">
              <div className="text-xs text-[#888] mb-2 font-medium">Quick Select</div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleQuickSelect(-1)}
                  className="px-3 py-1.5 bg-[#2a2a2a] hover:bg-[#333] rounded text-xs text-white transition-colors"
                >
                  Yesterday
                </button>
                <button
                  onClick={() => handleQuickSelect(0)}
                  className="px-3 py-1.5 bg-[#00a651] hover:bg-[#00b359] rounded text-xs text-white transition-colors"
                >
                  Today
                </button>
                <button
                  onClick={() => handleQuickSelect(1)}
                  className="px-3 py-1.5 bg-[#2a2a2a] hover:bg-[#333] rounded text-xs text-white transition-colors"
                >
                  Tomorrow
                </button>
              </div>
            </div>

            {/* Date List */}
            <div className="p-3">
              <div className="text-xs text-[#888] mb-2 font-medium">
                {format(selected, "MMMM yyyy")}
              </div>
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {dateOptions.map((date, index) => {
                  const isSelectedDate = isSameDay(date, selected);
                  const isTodayDate = isToday(date);

                  return (
                    <button
                      key={index}
                      onClick={() => {
                        onSelect(date);
                        setIsOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                        isSelectedDate
                          ? 'bg-[#00a651] text-white'
                          : isTodayDate
                          ? 'bg-[#2a2a2a] text-white hover:bg-[#333]'
                          : 'text-[#ccc] hover:bg-[#2a2a2a] hover:text-white'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span>{format(date, "EEE, MMM d")}</span>
                        {isTodayDate && (
                          <span className="text-xs text-[#00a651]">Today</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
