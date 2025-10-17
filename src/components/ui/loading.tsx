"use client";
import { motion } from "framer-motion";

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
        style={{ borderTopColor: "currentColor" }}
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
          className="w-2 h-2 rounded-full bg-current"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.15
          }}
        />
      ))}
    </div>
  );
}

export function LoadingPulse({ className = "" }: { className?: string }) {
  return (
    <motion.div
      className={`inline-block ${className}`}
      animate={{
        opacity: [0.5, 1, 0.5]
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      Loading...
    </motion.div>
  );
}

export function MatchLoadingState({ viewMode = "cards" }: { viewMode?: "cards" | "list" }) {
  if (viewMode === "list") {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.div
            key={i}
            className="glass-card rounded-xl p-4 border border-border/30"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-4 bg-muted/50 rounded animate-pulse" />
              <div className="flex-1 h-4 bg-muted/50 rounded animate-pulse" />
              <div className="w-16 h-6 bg-muted/50 rounded animate-pulse" />
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.div
          key={i}
          className="glass-card rounded-2xl p-6 border border-border/30"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.05 }}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-20 h-4 bg-muted/50 rounded animate-pulse" />
              <div className="w-16 h-4 bg-muted/50 rounded animate-pulse" />
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-muted/50 animate-pulse" />
                <div className="flex-1 h-4 bg-muted/50 rounded animate-pulse" />
                <div className="w-8 h-6 bg-muted/50 rounded animate-pulse" />
              </div>
              <div className="h-px bg-border/30" />
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-muted/50 animate-pulse" />
                <div className="flex-1 h-4 bg-muted/50 rounded animate-pulse" />
                <div className="w-8 h-6 bg-muted/50 rounded animate-pulse" />
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
