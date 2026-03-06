import { GitHubRepo, ProfileAnalysis } from "@/types/profile";

export function calculateEngagementScore(analysis: ProfileAnalysis): number {
  let score = 0;
  
  // Base score from repository count (max 30 points)
  score += Math.min(analysis.totalRepos * 2, 30);
  
  // Stars contribution (max 25 points)
  score += Math.min(analysis.totalStars, 25);
  
  // Language diversity bonus (max 20 points)
  score += Math.min(analysis.topLanguages.length * 3, 20);
  
  // Recent activity bonus (max 15 points)
  score += Math.min(analysis.recentActivity * 2, 15);
  
  // Average stars bonus (max 10 points)
  score += Math.min(analysis.averageStars, 10);
  
  return Math.min(score, 100);
}

export function getEngagementLevel(score: number): {
  level: string;
  color: string;
  description: string;
} {
  if (score >= 80) {
    return {
      level: "Expert",
      color: "text-green-400",
      description: "Highly active contributor with strong community engagement"
    };
  } else if (score >= 60) {
    return {
      level: "Advanced",
      color: "text-blue-400", 
      description: "Active developer with good project portfolio"
    };
  } else if (score >= 40) {
    return {
      level: "Intermediate",
      color: "text-yellow-400",
      description: "Growing developer with moderate activity"
    };
  } else if (score >= 20) {
    return {
      level: "Beginner",
      color: "text-orange-400",
      description: "New developer building initial portfolio"
    };
  } else {
    return {
      level: "Getting Started",
      color: "text-red-400",
      description: "Just beginning the coding journey"
    };
  }
}

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
}

export function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60
  };
  
  for (const [unit, seconds] of Object.entries(intervals)) {
    const interval = Math.floor(diffInSeconds / seconds);
    if (interval >= 1) {
      return `${interval} ${unit}${interval > 1 ? 's' : ''} ago`;
    }
  }
  
  return 'Just now';
}

export function generateColorFromString(str: string): string {
  // Generate a consistent color based on string hash
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  // Convert to HSL for better color distribution
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 70%, 60%)`;
}