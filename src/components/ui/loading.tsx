"use client";
import { motion } from "framer-motion";
import { cn } from "./cn";

// Football spinning animation
export function FootballSpinner({ className, size = "md" }: { 
  className?: string; 
  size?: "sm" | "md" | "lg" 
}) {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8", 
    lg: "w-12 h-12"
  };

  return (
    <motion.div
      className={cn("relative", sizeClasses[size], className)}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    >
      <div className="w-full h-full rounded-full bg-gradient-to-br from-primary to-primary-hover shadow-lg">
        {/* Football pattern */}
        <div className="absolute inset-0 rounded-full">
          <div className="absolute top-1/2 left-1/2 w-1/3 h-px bg-white transform -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute top-1/2 left-1/2 w-px h-1/3 bg-white transform -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-white rounded-full" />
          <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-white rounded-full" />
        </div>
      </div>
    </motion.div>
  );
}

// Pulsing dots loader
export function PulsingDots({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-2 h-2 bg-primary rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.2
          }}
        />
      ))}
    </div>
  );
}

// Field loading animation
export function FieldLoader({ className }: { className?: string }) {
  return (
    <div className={cn("relative w-32 h-20 mx-auto", className)}>
      {/* Field background */}
      <div className="absolute inset-0 bg-gradient-to-br from-field-primary to-field-secondary rounded-lg overflow-hidden">
        {/* Field lines */}
        <div className="absolute inset-2 border border-field-lines/30 rounded">
          <div className="absolute top-1/2 left-0 right-0 h-px bg-field-lines/30 transform -translate-y-1/2" />
          <div className="absolute top-1/2 left-1/2 w-8 h-8 border border-field-lines/30 rounded-full transform -translate-x-1/2 -translate-y-1/2" />
        </div>
        
        {/* Animated ball */}
        <motion.div
          className="absolute w-3 h-3 bg-white rounded-full shadow-lg"
          animate={{
            x: [8, 120, 8],
            y: [8, 44, 8]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
    </div>
  );
}

// Loading overlay
export function LoadingOverlay({ 
  isLoading, 
  children, 
  loadingText = "Loading...",
  className 
}: {
  isLoading: boolean;
  children: React.ReactNode;
  loadingText?: string;
  className?: string;
}) {
  return (
    <div className={cn("relative", className)}>
      {children}
      
      {isLoading && (
        <motion.div
          className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 rounded-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="text-center">
            <FootballSpinner className="mx-auto mb-4" />
            <p className="text-sm font-medium text-muted-foreground">{loadingText}</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}

// Progress bar with football theme
export function FootballProgress({ 
  value, 
  max = 100, 
  className 
}: { 
  value: number; 
  max?: number; 
  className?: string; 
}) {
  const percentage = (value / max) * 100;
  
  return (
    <div className={cn("relative w-full h-2 bg-muted rounded-full overflow-hidden", className)}>
      <motion.div
        className="h-full bg-gradient-to-r from-primary to-primary-hover rounded-full relative"
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* Moving highlight */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
      </motion.div>
    </div>
  );
}

// Skeleton with football theme
export function FootballSkeleton({ 
  className,
  variant = "default"
}: { 
  className?: string;
  variant?: "default" | "match" | "league" | "standing";
}) {
  const baseClasses = "animate-pulse bg-gradient-to-r from-muted/50 via-muted/80 to-muted/50 rounded-lg";
  
  if (variant === "match") {
    return (
      <div className={cn("glass-card p-6 rounded-2xl border border-border/50", className)}>
        <div className="flex items-center justify-between mb-4">
          <div className={cn(baseClasses, "h-4 w-20")} />
          <div className={cn(baseClasses, "h-6 w-16 rounded-full")} />
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className={cn(baseClasses, "h-10 w-10 rounded-full")} />
            <div className={cn(baseClasses, "h-5 flex-1")} />
            <div className={cn(baseClasses, "h-6 w-8")} />
          </div>
          <div className="flex items-center gap-3">
            <div className={cn(baseClasses, "h-10 w-10 rounded-full")} />
            <div className={cn(baseClasses, "h-5 flex-1")} />
            <div className={cn(baseClasses, "h-6 w-8")} />
          </div>
        </div>
      </div>
    );
  }
  
  return <div className={cn(baseClasses, className)} />;
}
