import { GitHubRepo, ProfileAnalysis } from "@/types/profile";

export function analyzeRepos(repos: GitHubRepo[]): ProfileAnalysis {
  const languageMap: Record<string, number> = {};
  const techStackSet = new Set<string>();
  let totalStars = 0;
  let totalForks = 0;
  
  // Date 6 months ago for recent activity calculation
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  
  let recentActivityCount = 0;

  repos.forEach(repo => {
    // Track languages
    if (repo.language) {
      languageMap[repo.language] = (languageMap[repo.language] || 0) + 1;
      techStackSet.add(repo.language);
    }
    
    // Add stars and forks
    totalStars += repo.stargazers_count;
    totalForks += repo.forks_count;
    
    // Check recent activity
    const updatedAt = new Date(repo.updated_at);
    if (updatedAt > sixMonthsAgo) {
      recentActivityCount++;
    }
    
    // Extract tech stack from topics and repo names
    repo.topics?.forEach(topic => {
      const normalizedTopic = normalizeTechName(topic);
      if (normalizedTopic) {
        techStackSet.add(normalizedTopic);
      }
    });
    
    // Extract tech from repo names/descriptions
    const repoText = `${repo.name} ${repo.description || ""}`.toLowerCase();
    extractTechFromText(repoText).forEach(tech => techStackSet.add(tech));
  });

  // Convert language count to percentage distribution
  const totalRepos = repos.length;
  const languageDistribution: Record<string, number> = {};
  Object.entries(languageMap).forEach(([lang, count]) => {
    languageDistribution[lang] = Math.round((count / totalRepos) * 100);
  });

  // Sort languages by usage
  const topLanguages = Object.entries(languageMap)
    .sort((a, b) => b[1] - a[1])
    .map(([lang]) => lang);

  const averageStars = totalRepos > 0 ? Math.round(totalStars / totalRepos) : 0;

  // Get top repos by stars
  const topRepos = repos
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 5)
    .map(repo => ({
      name: repo.name,
      description: repo.description,
      stars: repo.stargazers_count,
      language: repo.language,
      url: repo.html_url
    }));

  return {
    totalRepos,
    totalStars,
    topLanguages,
    languageDistribution,
    averageStars,
    recentActivity: recentActivityCount,
    techStack: Array.from(techStackSet).sort(),
    topRepos,
  };
}

function normalizeTechName(tech: string): string | null {
  const techMap: Record<string, string> = {
    'js': 'JavaScript',
    'ts': 'TypeScript',
    'py': 'Python',
    'cpp': 'C++',
    'reactjs': 'React',
    'nodejs': 'Node.js',
    'nextjs': 'Next.js',
    'vue': 'Vue.js',
    'angular': 'Angular',
    'django': 'Django',
    'flask': 'Flask',
    'express': 'Express.js',
    'mongodb': 'MongoDB',
    'postgresql': 'PostgreSQL',
    'mysql': 'MySQL',
    'redis': 'Redis',
    'docker': 'Docker',
    'kubernetes': 'Kubernetes',
    'aws': 'AWS',
    'gcp': 'Google Cloud',
    'azure': 'Microsoft Azure',
    'tensorflow': 'TensorFlow',
    'pytorch': 'PyTorch',
    'ml': 'Machine Learning',
    'ai': 'AI',
    'blockchain': 'Blockchain',
    'crypto': 'Cryptocurrency',
  };

  const normalized = tech.toLowerCase().replace(/[-_\s]/g, '');
  return techMap[normalized] || (tech.length > 2 ? tech : null);
}

function extractTechFromText(text: string): string[] {
  const techKeywords = [
    'react', 'vue', 'angular', 'svelte', 'next', 'nuxt', 'gatsby',
    'node', 'express', 'fastapi', 'django', 'flask', 'rails', 'laravel',
    'mongodb', 'mysql', 'postgresql', 'redis', 'elasticsearch',
    'docker', 'kubernetes', 'aws', 'gcp', 'azure', 'vercel', 'netlify',
    'tensorflow', 'pytorch', 'keras', 'scikit', 'opencv',
    'blockchain', 'ethereum', 'solidity', 'web3',
    'android', 'ios', 'flutter', 'kotlin', 'swift',
    'unity', 'unreal', 'godot',
    'api', 'rest', 'graphql', 'microservices',
  ];
  
  return techKeywords
    .filter(keyword => text.includes(keyword))
    .map(keyword => normalizeTechName(keyword))
    .filter(Boolean) as string[];
}

export function calculateContributionScore(repos: GitHubRepo[]): number {
  let score = 0;
  
  repos.forEach(repo => {
    // Base score from stars and forks
    score += repo.stargazers_count * 2;
    score += repo.forks_count * 3;
    
    // Recency bonus
    const daysSinceUpdate = (Date.now() - new Date(repo.updated_at).getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceUpdate < 30) {
      score += 10; // Recent activity bonus
    } else if (daysSinceUpdate < 90) {
      score += 5;
    }
    
    // Size penalty for very small repos
    if (repo.size < 10) {
      score -= 2;
    }
  });
  
  return Math.max(0, score);
}