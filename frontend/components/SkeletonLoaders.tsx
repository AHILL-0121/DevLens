import { clsx } from "clsx";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div className={clsx(
      "animate-pulse bg-gradient-to-r from-white/10 via-white/20 to-white/10",
      "bg-[length:200%_100%] animate-[shimmer_2s_infinite]",
      "rounded",
      className
    )} />
  );
}

export function ProfileSkeleton() {
  return (
    <div className="glass-card p-6 space-y-4">
      {/* Avatar and basic info */}
      <div className="flex items-center space-x-4">
        <Skeleton className="w-16 h-16 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
      
      {/* Stats */}
      <div className="flex space-x-4">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-20" />
      </div>
    </div>
  );
}

export function AnalysisSkeleton() {
  return (
    <div className="space-y-6">
      {/* Language chart skeleton */}
      <div className="glass-card p-6">
        <Skeleton className="h-6 w-40 mb-4" />
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-3">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-3 flex-1" />
              <Skeleton className="h-4 w-10" />
            </div>
          ))}
        </div>
      </div>

      {/* Role matching skeleton */}
      <div className="glass-card p-6">
        <Skeleton className="h-6 w-32 mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="glass p-4 rounded-lg">
              <Skeleton className="h-5 w-24 mb-2" />
              <Skeleton className="h-3 w-full mb-3" />
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>
      </div>

      {/* AI insights skeleton */}
      <div className="glass-card p-6">
        <Skeleton className="h-6 w-28 mb-4" />
        <div className="space-y-2">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-4 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="glass-card p-4 text-center">
      <Skeleton className="h-8 w-16 mx-auto mb-2" />
      <Skeleton className="h-4 w-20 mx-auto" />
    </div>
  );
}

export function RoleCardSkeleton() {
  return (
    <div className="glass-card p-4">
      <div className="flex justify-between items-start mb-3">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-6 w-12" />
      </div>
      <Skeleton className="h-3 w-full mb-3" />
      <div className="space-y-1">
        <Skeleton className="h-3 w-24" />
        <div className="flex flex-wrap gap-1">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-5 w-16 rounded-full" />
          ))}
        </div>
      </div>
    </div>
  );
}