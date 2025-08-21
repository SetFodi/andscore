"use client";
import { useState, useEffect } from "react";

interface FavoriteTeam {
  id: number;
  name: string;
  crest: string;
}

export function useFavorites() {
  const [favoriteTeams, setFavoriteTeams] = useState<FavoriteTeam[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load favorites from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("favorite_teams");
        if (saved) {
          setFavoriteTeams(JSON.parse(saved));
        }
      } catch (error) {
        console.error("Failed to load favorite teams:", error);
      }
      setIsLoaded(true);
    }
  }, []);

  // Save to localStorage whenever favorites change
  useEffect(() => {
    if (isLoaded && typeof window !== "undefined") {
      try {
        localStorage.setItem("favorite_teams", JSON.stringify(favoriteTeams));
      } catch (error) {
        console.error("Failed to save favorite teams:", error);
      }
    }
  }, [favoriteTeams, isLoaded]);

  const addFavoriteTeam = (team: FavoriteTeam) => {
    setFavoriteTeams(prev => {
      if (prev.some(t => t.id === team.id)) return prev;
      return [...prev, team];
    });
  };

  const removeFavoriteTeam = (teamId: number) => {
    setFavoriteTeams(prev => prev.filter(t => t.id !== teamId));
  };

  const isFavoriteTeam = (teamId: number) => {
    return favoriteTeams.some(t => t.id === teamId);
  };

  const toggleFavoriteTeam = (team: FavoriteTeam) => {
    if (isFavoriteTeam(team.id)) {
      removeFavoriteTeam(team.id);
    } else {
      addFavoriteTeam(team);
    }
  };

  return {
    favoriteTeams,
    addFavoriteTeam,
    removeFavoriteTeam,
    isFavoriteTeam,
    toggleFavoriteTeam,
    isLoaded
  };
}
