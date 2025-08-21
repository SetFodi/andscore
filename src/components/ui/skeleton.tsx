"use client";
import { cn } from "./cn";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-muted/50 backdrop-blur-sm",
        className
      )}
      {...props}
    />
  );
}

// Football-themed skeleton variants
function MatchCardSkeleton() {
  return (
    <div className="glass-card p-6 rounded-2xl border border-border/50">
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-16" />
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-5 w-24" />
        </div>
        <div className="flex items-center gap-4">
          <Skeleton className="h-8 w-12" />
          <span className="text-muted-foreground">-</span>
          <Skeleton className="h-8 w-12" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
      </div>
    </div>
  );
}

function LeagueCardSkeleton() {
  return (
    <div className="glass-card p-8 rounded-2xl border border-border/50">
      <div className="flex items-center gap-4 mb-6">
        <Skeleton className="h-16 w-16 rounded-lg" />
        <div className="flex-1">
          <Skeleton className="h-6 w-32 mb-2" />
          <Skeleton className="h-4 w-48" />
        </div>
      </div>
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-3/4" />
    </div>
  );
}

function StandingsRowSkeleton() {
  return (
    <div className="flex items-center gap-4 py-3 px-4">
      <Skeleton className="h-4 w-6" />
      <Skeleton className="h-8 w-8 rounded-full" />
      <Skeleton className="h-4 flex-1" />
      <Skeleton className="h-4 w-8" />
      <Skeleton className="h-4 w-8" />
      <Skeleton className="h-4 w-8" />
      <Skeleton className="h-4 w-8" />
    </div>
  );
}

export { Skeleton, MatchCardSkeleton, LeagueCardSkeleton, StandingsRowSkeleton };
