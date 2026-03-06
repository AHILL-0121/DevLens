import { ProfileAnalysis, RoleAnalysis, GitHubUser } from "@/types/profile";

export interface ATSScoreBreakdown {
  keywords: number;
  formatting: number;
  experience: number;
  skills: number;
  impact: number;
  total: number;
  grade: string;
  recommendations: string[];
}

export function calculateATSScore(
  user: GitHubUser,
  analysis: ProfileAnalysis,
  roles: RoleAnalysis
): ATSScoreBreakdown {
  let keywordsScore = 0;
  let formattingScore = 0;
  let experienceScore = 0;
  let skillsScore = 0;
  let impactScore = 0;

  // Keywords Score (0-25 points)
  const totalSkills = analysis.topLanguages.length + analysis.techStack.length;
  keywordsScore = Math.min(totalSkills * 2, 25);

  // Formatting Score (0-20 points) - Based on profile completeness
  let formatPoints = 0;
  if (user.name) formatPoints += 5;
  if (user.bio) formatPoints += 5;
  if (analysis.totalRepos > 5) formatPoints += 5;
  if (analysis.topLanguages.length >= 3) formatPoints += 5;
  formattingScore = formatPoints;

  // Experience Score (0-25 points) - Based on repository depth
  if (analysis.totalRepos >= 20) experienceScore = 25;
  else if (analysis.totalRepos >= 15) experienceScore = 20;
  else if (analysis.totalRepos >= 10) experienceScore = 15;
  else if (analysis.totalRepos >= 5) experienceScore = 10;
  else experienceScore = 5;

  // Skills Score (0-15 points) - Based on role matching
  const roleScores = Object.values(roles).map(role => role.matchPercentage);
  const bestRoleScore = roleScores.length > 0 ? Math.max(...roleScores) : 0;
  skillsScore = Math.round((bestRoleScore / 100) * 15);

  // Impact Score (0-15 points) - Based on stars and activity
  let impactPoints = 0;
  if (analysis.totalStars >= 100) impactPoints += 5;
  else if (analysis.totalStars >= 50) impactPoints += 3;
  else if (analysis.totalStars >= 10) impactPoints += 2;
  
  if (analysis.recentActivity >= 10) impactPoints += 5;
  else if (analysis.recentActivity >= 5) impactPoints += 3;
  else if (analysis.recentActivity >= 2) impactPoints += 2;
  
  if (analysis.averageStars >= 5) impactPoints += 5;
  else if (analysis.averageStars >= 2) impactPoints += 3;
  
  impactScore = Math.min(impactPoints, 15);

  const total = keywordsScore + formattingScore + experienceScore + skillsScore + impactScore;

  // Calculate grade
  let grade: string;
  if (total >= 85) grade = "A+";
  else if (total >= 75) grade = "A";
  else if (total >= 65) grade = "B+";
  else if (total >= 55) grade = "B";
  else if (total >= 45) grade = "C+";
  else if (total >= 35) grade = "C";
  else grade = "D";

  // Generate recommendations
  const recommendations = generateATSRecommendations({
    keywordsScore,
    formattingScore,
    experienceScore,
    skillsScore,
    impactScore,
    total,
    analysis,
    user
  });

  return {
    keywords: keywordsScore,
    formatting: formattingScore,
    experience: experienceScore,
    skills: skillsScore,
    impact: impactScore,
    total,
    grade,
    recommendations
  };
}

function generateATSRecommendations(data: {
  keywordsScore: number;
  formattingScore: number;
  experienceScore: number;
  skillsScore: number;
  impactScore: number;
  total: number;
  analysis: ProfileAnalysis;
  user: GitHubUser;
}): string[] {
  const recommendations: string[] = [];

  // Keywords recommendations
  if (data.keywordsScore < 15) {
    recommendations.push("Add more technical skills and frameworks to your repositories");
    recommendations.push("Include trending technologies in your project stack");
  }

  // Formatting recommendations
  if (data.formattingScore < 15) {
    if (!data.user.name) recommendations.push("Add your full name to your GitHub profile");
    if (!data.user.bio) recommendations.push("Write a compelling bio describing your expertise");
    if (data.analysis.topLanguages.length < 3) {
      recommendations.push("Diversify your programming language portfolio");
    }
  }

  // Experience recommendations
  if (data.experienceScore < 20) {
    recommendations.push("Create more substantial projects to demonstrate experience");
    recommendations.push("Contribute to open-source projects in your field");
  }

  // Skills recommendations
  if (data.skillsScore < 10) {
    recommendations.push("Focus on building projects in your target role area");
    recommendations.push("Learn industry-standard tools and frameworks");
  }

  // Impact recommendations
  if (data.impactScore < 10) {
    recommendations.push("Improve code quality to attract more stars");
    recommendations.push("Maintain consistent coding activity");
    recommendations.push("Add comprehensive README files with demos");
  }

  // Overall recommendations
  if (data.total < 50) {
    recommendations.push("Consider creating a portfolio website showcasing your best work");
  }

  return recommendations.slice(0, 8); // Limit to most important recommendations
}

export function getATSScoreColor(score: number): string {
  if (score >= 85) return "text-green-400";
  if (score >= 75) return "text-green-300";
  if (score >= 65) return "text-yellow-400";
  if (score >= 55) return "text-yellow-300";
  if (score >= 45) return "text-orange-400";
  if (score >= 35) return "text-orange-300";
  return "text-red-400";
}

export function getATSGradeDescription(grade: string): string {
  const descriptions: Record<string, string> = {
    "A+": "Exceptional ATS compatibility - Will pass most automated screenings",
    "A": "Excellent ATS compatibility - Strong chance of getting through filters",
    "B+": "Good ATS compatibility - Likely to pass basic screenings",
    "B": "Fair ATS compatibility - May need optimization for competitive roles",
    "C+": "Below average ATS compatibility - Requires significant improvement",
    "C": "Poor ATS compatibility - Major optimizations needed",
    "D": "Very poor ATS compatibility - Complete profile overhaul recommended"
  };
  return descriptions[grade] || "Unknown grade";
}