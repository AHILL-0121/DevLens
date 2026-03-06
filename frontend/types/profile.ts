export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  created_at: string;
  topics: string[];
  size: number;
}

export interface GitHubUser {
  login: string;
  name: string | null;
  bio: string | null;
  email?: string | null;
  location?: string | null;
  blog?: string | null;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
  avatar_url: string;
}

export interface ProfileAnalysis {
  totalRepos: number;
  totalStars: number;
  topLanguages: string[];
  languageDistribution: Record<string, number>;
  averageStars: number;
  recentActivity: number;
  techStack: string[];
  topRepos?: Array<{
    name: string;
    description: string | null;
    stars: number;
    language: string | null;
    url: string;
  }>;
}

export interface RoleMatch {
  role: string;
  matchPercentage: number;
  missing: string[];
  matched: string[];
  score: number;
}

export interface RoleAnalysis {
  SDE: RoleMatch;
  AI: RoleMatch;
  Cybersecurity: RoleMatch;
}

export interface AIInsights {
  resumeBullets: string[];
  linkedinHeadline: string;
  skillsSection: string[];
  improvementRoadmap: string[];
}

export interface DevLensReport {
  user: GitHubUser;
  analysis: ProfileAnalysis;
  roles: RoleAnalysis;
  insights: AIInsights;
  generatedAt: string;
}