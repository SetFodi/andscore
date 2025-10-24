"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";

interface FootballLoaderProps {
  isLoading: boolean;
  onComplete?: () => void;
}

export default function FootballLoader({ isLoading, onComplete }: FootballLoaderProps) {
  const [progress, setProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  const loadingMessages = [
    "Preparing the pitch",
    "Loading teams",
    "Checking fixtures",
    "Updating scores",
    "Almost ready"
  ];

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isLoading) return;

    // Smooth progress animation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const increment = Math.random() * 8 + 4;
        const newProgress = Math.min(prev + increment, 100);
        
        if (newProgress >= 100) {
          clearInterval(progressInterval);
          setTimeout(() => onComplete?.(), 300);
        }
        
        return newProgress;
      });
    }, 200);

    // Message rotation
    const messageInterval = setInterval(() => {
      setMessageIndex(prev => (prev + 1) % loadingMessages.length);
    }, 1200);

    return () => {
      clearInterval(progressInterval);
      clearInterval(messageInterval);
    };
  }, [isLoading, onComplete, loadingMessages.length]);

  if (!isLoading || !isMounted) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[9999] bg-gradient-to-br from-background via-background to-background/95 flex items-center justify-center backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
      >
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div 
            className="absolute inset-0" 
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
              backgroundSize: '40px 40px'
            }}
          />
        </div>

        {/* Main content */}
        <div className="relative z-10 flex flex-col items-center">
          {/* Enhanced Football Animation */}
          <div className="relative mb-12">
            {/* Glow effect */}
            <motion.div
              className="absolute inset-0 rounded-full blur-2xl opacity-30"
              style={{
                background: "radial-gradient(circle, var(--primary) 0%, transparent 70%)"
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.2, 0.4, 0.2]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />

            {/* Football using actual image */}
            <motion.div
              className="relative w-24 h-24"
              animate={{
                rotate: 360,
                y: [0, -15, 0],
              }}
              transition={{
                rotate: { duration: 4, repeat: Infinity, ease: "linear" },
                y: { duration: 2, repeat: Infinity, ease: "easeInOut" }
              }}
            >
              <Image
                src="/football.png"
                alt="Football"
                width={96}
                height={96}
                className="w-full h-full drop-shadow-2xl"
                priority
              />
            </motion.div>
            
            {/* Dynamic shadow */}
            <motion.div
              className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-20 h-4 rounded-full"
              style={{
                background: "radial-gradient(ellipse, rgba(0,0,0,0.3) 0%, transparent 70%)",
                filter: "blur(4px)"
              }}
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.4, 0.25, 0.4]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>

          {/* Brand name */}
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
              AndScore
            </h1>
          </motion.div>

          {/* Loading message with smooth transition */}
          <div className="h-6 mb-8 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.p
                key={messageIndex}
                className="text-base font-medium text-muted-foreground"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                {loadingMessages[messageIndex]}...
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Modern progress bar */}
          <div className="w-72 space-y-3">
            <div className="relative h-2 bg-muted/50 rounded-full overflow-hidden backdrop-blur-sm">
              {/* Progress fill with gradient */}
              <motion.div
                className="absolute left-0 top-0 h-full rounded-full"
                style={{
                  background: "linear-gradient(90deg, var(--primary), var(--primary) 60%, var(--primary)/70)",
                  boxShadow: "0 0 10px var(--primary)/30"
                }}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              />
              
              {/* Animated shimmer */}
              <motion.div
                className="absolute top-0 h-full w-16"
                style={{
                  background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)"
                }}
                animate={{
                  x: ["-4rem", "20rem"]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
            </div>
            
            {/* Progress percentage */}
            <div className="flex items-center justify-between text-sm">
              <motion.span
                className="text-muted-foreground font-medium"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {Math.round(progress)}%
              </motion.span>
              
              <motion.div
                className="flex gap-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-1 h-1 rounded-full bg-primary"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.3, 1, 0.3]
                    }}
                    transition={{
                      duration: 1.2,
                      repeat: Infinity,
                      delay: i * 0.2
                    }}
                  />
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
