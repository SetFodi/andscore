"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";

interface FootballLoaderProps {
  isLoading: boolean;
  onComplete?: () => void;
}

export default function FootballLoader({ isLoading, onComplete }: FootballLoaderProps) {
  const [loadingStage, setLoadingStage] = useState(0);
  const [progress, setProgress] = useState(0);
  const [windowSize, setWindowSize] = useState({ width: 1200, height: 800 });
  const [isMounted, setIsMounted] = useState(false);

  const loadingMessages = [
    "Warming up the pitch...",
    "Loading team lineups...",
    "Checking match schedules...",
    "Preparing live scores...",
    "Almost ready to kick off!"
  ];

  useEffect(() => {
    // Set mounted state and initial window size
    setIsMounted(true);

    if (typeof window !== 'undefined') {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });

      const handleResize = () => {
        setWindowSize({ width: window.innerWidth, height: window.innerHeight });
      };

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  useEffect(() => {
    if (!isLoading) return;

    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + Math.random() * 15 + 5;
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => onComplete?.(), 500);
          return 100;
        }
        return newProgress;
      });
    }, 300);

    const stageInterval = setInterval(() => {
      setLoadingStage(prev => (prev + 1) % loadingMessages.length);
    }, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(stageInterval);
    };
  }, [isLoading, onComplete]);

  if (!isLoading || !isMounted) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[9999] bg-gradient-to-br from-field-primary via-field-secondary to-field-primary flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Field Lines */}
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="absolute inset-4 border-2 border-white/20 rounded-lg">
              <div className="absolute top-1/2 left-0 right-0 h-px bg-white/20 transform -translate-y-1/2" />
              <div className="absolute top-1/2 left-1/2 w-32 h-32 border-2 border-white/20 rounded-full transform -translate-x-1/2 -translate-y-1/2" />
              <div className="absolute top-1/2 left-0 w-16 h-24 border-2 border-white/20 border-l-0 rounded-r-lg transform -translate-y-1/2" />
              <div className="absolute top-1/2 right-0 w-16 h-24 border-2 border-white/20 border-r-0 rounded-l-lg transform -translate-y-1/2" />
            </div>
          </motion.div>

          {/* Floating Footballs */}
          {Array.from({ length: 5 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-8 h-8 bg-white rounded-full shadow-lg"
              initial={{
                x: Math.random() * windowSize.width,
                y: Math.random() * windowSize.height,
                opacity: 0
              }}
              animate={{
                x: Math.random() * windowSize.width,
                y: Math.random() * windowSize.height,
                opacity: [0, 0.3, 0],
                rotate: 360
              }}
              transition={{
                duration: 8 + Math.random() * 4,
                repeat: Infinity,
                delay: i * 0.5
              }}
            >
              {/* Football pattern */}
              <div className="absolute inset-1 rounded-full border border-gray-800">
                <div className="absolute top-1/2 left-1/2 w-2 h-px bg-gray-800 transform -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute top-1/2 left-1/2 w-px h-2 bg-gray-800 transform -translate-x-1/2 -translate-y-1/2" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Main Loading Content */}
        <div className="relative z-10 text-center text-white">
          {/* Rolling Football */}
          <motion.div
            className="relative mx-auto mb-8 w-20 h-20"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <div className="w-full h-full bg-white rounded-full shadow-2xl relative overflow-hidden">
              {/* Football pattern */}
              <div className="absolute inset-2 rounded-full">
                <div className="absolute top-1/2 left-1/2 w-8 h-px bg-gray-800 transform -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute top-1/2 left-1/2 w-px h-8 bg-gray-800 transform -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-gray-800 rounded-full" />
                <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-gray-800 rounded-full" />
                <div className="absolute top-1/4 right-1/4 w-1 h-1 bg-gray-800 rounded-full" />
                <div className="absolute top-3/4 left-1/4 w-1 h-1 bg-gray-800 rounded-full" />
              </div>
            </div>
          </motion.div>

          {/* Brand Name */}
          <motion.h1
            className="text-4xl font-bold mb-4 text-white drop-shadow-lg"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            andscore
          </motion.h1>

          {/* Loading Message */}
          <motion.p
            className="text-lg mb-8 text-white/90 font-medium"
            key={loadingStage}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {loadingMessages[loadingStage]}
          </motion.p>

          {/* Progress Bar */}
          <div className="w-80 max-w-sm mx-auto">
            <div className="relative h-2 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
              <motion.div
                className="absolute left-0 top-0 h-full bg-white rounded-full shadow-lg"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              />
              
              {/* Moving highlight */}
              <motion.div
                className="absolute top-0 h-full w-8 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                animate={{ x: [-32, 320] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              />
            </div>
            
            {/* Progress Text */}
            <motion.p
              className="text-center mt-3 text-white/80 text-sm font-medium"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              {Math.round(progress)}%
            </motion.p>
          </div>

          {/* League Logos Preview */}
          <motion.div
            className="flex items-center justify-center gap-4 mt-8 opacity-30"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 0.3 }}
            transition={{ delay: 1 }}
          >
            {[
              "/premier-league-1.svg",
              "/LaLiga_logo_2023.svg.png", 
              "/Serie_A_logo_2022.svg.png",
              "/Bundesliga_logo_(2017).svg.png",
              "/UEFA_Champions_League.svg.png"
            ].map((logo, i) => (
              <motion.div
                key={i}
                className="w-8 h-8 relative"
                animate={{ 
                  scale: [1, 1.1, 1],
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
              >
                <Image
                  src={logo}
                  alt=""
                  fill
                  className="object-contain filter brightness-0 invert"
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
