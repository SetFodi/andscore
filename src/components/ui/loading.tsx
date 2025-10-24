"use client";
import { motion } from "framer-motion";
import Image from "next/image";

export function LoadingSpinner({ size = "md", className = "" }: { size?: "sm" | "md" | "lg"; className?: string }) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12"
  };

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-primary/20"
        style={{ borderTopColor: "var(--primary)" }}
        animate={{ rotate: 360 }}
        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}

export function LoadingDots({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-2 h-2 rounded-full bg-primary"
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.4, 1, 0.4]
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            delay: i * 0.2,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
}

export function FootballLoadingAnimation() {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-8">
      {/* Animated Football with 3D effect */}
      <div className="relative">
        {/* Main football */}
        <motion.div
          className="relative w-20 h-20"
          animate={{
            rotate: 360,
            y: [0, -10, 0],
          }}
          transition={{
            rotate: { duration: 3, repeat: Infinity, ease: "linear" },
            y: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
          }}
        >
          <Image
            src="/football.png"
            alt="Football"
            width={80}
            height={80}
            className="w-full h-full drop-shadow-2xl"
          />
        </motion.div>
        
        {/* Dynamic shadow */}
        <motion.div
          className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-16 h-3 bg-black/30 rounded-full blur-md"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.2, 0.3]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Loading text with animation */}
      <motion.div 
        className="flex flex-col items-center gap-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center gap-2">
          <motion.span 
            className="text-base font-semibold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent"
            animate={{ opacity: [1, 0.7, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Loading matches
          </motion.span>
          <LoadingDots />
        </div>
        
        {/* Animated progress bar */}
        <div className="w-32 h-1 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary/50 via-primary to-primary/50"
            animate={{
              x: ["-100%", "200%"]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
      </motion.div>

      {/* Field lines decoration */}
      <div className="relative w-64 h-px">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-border to-transparent" />
        <motion.div
          className="absolute top-0 left-0 h-full w-8 bg-gradient-to-r from-primary/50 to-transparent"
          animate={{
            x: [0, 256]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>
    </div>
  );
}

export function MatchLoadingState({ viewMode = "cards" }: { viewMode?: "cards" | "list" }) {
  if (viewMode === "list") {
    return (
      <div className="space-y-6">
        <FootballLoadingAnimation />
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <motion.div
              key={i}
              className="glass-card rounded-xl p-4 border border-border/30 overflow-hidden relative"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08, type: "spring", stiffness: 100 }}
            >
              {/* Shimmer effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
                animate={{
                  x: ["-100%", "200%"]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear",
                  delay: i * 0.2
                }}
              />
              
              <div className="flex items-center gap-4 relative">
                <motion.div 
                  className="w-12 h-4 bg-muted/50 rounded"
                  animate={{ opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
                />
                <motion.div 
                  className="flex-1 h-4 bg-muted/50 rounded"
                  animate={{ opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 + 0.2 }}
                />
                <motion.div 
                  className="w-16 h-6 bg-muted/50 rounded"
                  animate={{ opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 + 0.4 }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <FootballLoadingAnimation />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={i}
            className="glass-card rounded-2xl p-6 border border-border/30 overflow-hidden relative"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ 
              delay: i * 0.1,
              type: "spring",
              stiffness: 100,
              damping: 15
            }}
          >
            {/* Shimmer effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
              animate={{
                x: ["-100%", "200%"]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear",
                delay: i * 0.3
              }}
            />
            
            <div className="space-y-4 relative">
              <div className="flex items-center justify-between">
                <motion.div 
                  className="w-20 h-4 bg-muted/50 rounded"
                  animate={{ opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <motion.div 
                  className="w-16 h-4 bg-muted/50 rounded"
                  animate={{ opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                />
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <motion.div 
                    className="w-12 h-12 rounded-full bg-muted/50"
                    animate={{ opacity: [0.5, 0.8, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
                  />
                  <motion.div 
                    className="flex-1 h-4 bg-muted/50 rounded"
                    animate={{ opacity: [0.5, 0.8, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
                  />
                  <motion.div 
                    className="w-8 h-6 bg-muted/50 rounded"
                    animate={{ opacity: [0.5, 0.8, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                  />
                </div>
                <div className="h-px bg-border/30" />
                <div className="flex items-center gap-3">
                  <motion.div 
                    className="w-12 h-12 rounded-full bg-muted/50"
                    animate={{ opacity: [0.5, 0.8, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }}
                  />
                  <motion.div 
                    className="flex-1 h-4 bg-muted/50 rounded"
                    animate={{ opacity: [0.5, 0.8, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.7 }}
                  />
                  <motion.div 
                    className="w-8 h-6 bg-muted/50 rounded"
                    animate={{ opacity: [0.5, 0.8, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.8 }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
