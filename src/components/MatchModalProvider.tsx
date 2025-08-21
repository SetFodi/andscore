"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import MatchDetailsModal from "./MatchDetailsModal";
import type { Match } from "@/lib/fd";

interface MatchModalContextType {
  selectedMatch: Match | null;
  isModalOpen: boolean;
  openMatchModal: (match: Match) => void;
  closeMatchModal: () => void;
}

const MatchModalContext = createContext<MatchModalContextType | undefined>(undefined);

export function useMatchModal() {
  const context = useContext(MatchModalContext);
  if (!context) {
    throw new Error("useMatchModal must be used within a MatchModalProvider");
  }
  return context;
}

interface MatchModalProviderProps {
  children: ReactNode;
}

export default function MatchModalProvider({ children }: MatchModalProviderProps) {
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openMatchModal = (match: Match) => {
    setSelectedMatch(match);
    setIsModalOpen(true);
  };

  const closeMatchModal = () => {
    setIsModalOpen(false);
    // Delay clearing the match to allow exit animation
    setTimeout(() => setSelectedMatch(null), 300);
  };

  const value = {
    selectedMatch,
    isModalOpen,
    openMatchModal,
    closeMatchModal
  };

  return (
    <MatchModalContext.Provider value={value}>
      {children}
      <MatchDetailsModal
        match={selectedMatch}
        isOpen={isModalOpen}
        onClose={closeMatchModal}
      />
    </MatchModalContext.Provider>
  );
}
