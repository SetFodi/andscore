"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import FootballLoader from "./FootballLoader";

interface LoadingContextType {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  showLoader: () => void;
  hideLoader: () => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function useLoading() {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
}

interface LoadingProviderProps {
  children: ReactNode;
  initialLoading?: boolean;
}

export default function LoadingProvider({ 
  children, 
  initialLoading = true 
}: LoadingProviderProps) {
  const [isLoading, setIsLoading] = useState(initialLoading);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    // Simulate initial app loading
    if (initialLoading && !hasLoaded) {
      const timer = setTimeout(() => {
        setHasLoaded(true);
      }, 3000); // Minimum loading time for effect

      return () => clearTimeout(timer);
    }
  }, [initialLoading, hasLoaded]);

  const showLoader = () => setIsLoading(true);
  const hideLoader = () => setIsLoading(false);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  const value = {
    isLoading,
    setIsLoading,
    showLoader,
    hideLoader
  };

  return (
    <LoadingContext.Provider value={value}>
      <FootballLoader 
        isLoading={isLoading && !hasLoaded} 
        onComplete={handleLoadingComplete}
      />
      {children}
    </LoadingContext.Provider>
  );
}
