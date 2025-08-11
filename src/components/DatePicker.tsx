"use client";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import { useState } from "react";

export default function DatePicker({ 
  selected, 
  onSelect 
}: { 
  selected: Date; 
  onSelect: (date: Date) => void; 
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-xl glass-card border border-border/50 hover:scale-105 transition-all duration-200 text-sm font-medium"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
        {format(selected, "MMM dd, yyyy")}
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full mt-2 z-50 glass-card border border-border/50 rounded-2xl p-4 shadow-xl">
            <DayPicker
              mode="single"
              selected={selected}
              onSelect={(date) => {
                if (date) {
                  onSelect(date);
                  setIsOpen(false);
                }
              }}
              className="rdp-custom"
            />
          </div>
        </>
      )}
    </div>
  );
}
