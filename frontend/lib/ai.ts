import axios from "axios";
import { AIInsights, ProfileAnalysis, RoleAnalysis } from "@/types/profile";

// Fallback AI insights generator (rule-based)
export function generateAIInsights(
  username: string,
  analysis: ProfileAnalysis,
  roles: RoleAnalysis
): AIInsights {
  const bestRole = Object.entries(roles).reduce((best, current) => 
    current[1].score > best[1].score ? current : best
  );

  const resumeBullets = generateResumeBullets(analysis, bestRole);
  const linkedinHeadline = generateLinkedInHeadline(analysis, bestRole);
  const skillsSection = generateSkillsSection(analysis);
  const improvementRoadmap = generateRoadmap(bestRole[1], analysis);

  return {
    resumeBullets,
    linkedinHeadline,
    skillsSection,
    improvementRoadmap
  };
}

function generateResumeBullets(analysis: ProfileAnalysis, bestRole: [string, any]): string[] {
  const bullets: string[] = [];
  const [roleName, roleData] = bestRole;

  // Technical contribution bullets
  if (analysis.totalStars > 0) {
    bullets.push(`Developed ${analysis.totalRepos} open-source projects with ${analysis.totalStars}+ GitHub stars, demonstrating strong coding practices and community engagement`);
  }

  if (analysis.topLanguages.length > 0) {
    const topLangs = analysis.topLanguages.slice(0, 3).join(", ");
    bullets.push(`Proficient in ${topLangs} with hands-on experience building scalable applications and contributing to diverse codebases`);
  }

  // Recent activity bullet
  if (analysis.recentActivity > 5) {
    bullets.push(`Maintained active development presence with ${analysis.recentActivity} recently updated repositories, showcasing continuous learning and project maintenance`);
  }

  // Role-specific bullets
  if (roleName === "SDE") {
    if (roleData.matched.some((skill: string) => skill.includes("React") || skill.includes("Vue"))) {
      bullets.push("Built responsive web applications using modern frontend frameworks with emphasis on user experience and performance optimization");
    }
    if (roleData.matched.some((skill: string) => skill.includes("API") || skill.includes("REST"))) {
      bullets.push("Designed and implemented RESTful APIs and microservices architecture for scalable backend systems");
    }
  } else if (roleName === "AI") {
    bullets.push("Applied machine learning algorithms and data science techniques to solve real-world problems and extract actionable insights");
    if (roleData.matched.some((skill: string) => skill.includes("TensorFlow") || skill.includes("PyTorch"))) {
      bullets.push("Developed deep learning models using industry-standard frameworks for computer vision and natural language processing tasks");
    }
  } else if (roleName === "Cybersecurity") {
    bullets.push("Implemented security best practices and conducted vulnerability assessments using industry-standard penetration testing tools");
    if (roleData.matched.some((skill: string) => skill.includes("Python"))) {
      bullets.push("Automated security workflows and developed custom tools for threat detection and incident response using Python scripting");
    }
  }

  // Collaboration and impact bullets
  if (analysis.totalRepos > 10) {
    bullets.push("Demonstrated project management and version control expertise through successful delivery of multiple software projects");
  }

  return bullets.slice(0, 4); // Limit to top 4 bullets
}

function generateLinkedInHeadline(analysis: ProfileAnalysis, bestRole: [string, any]): string {
  const [roleName, roleData] = bestRole;
  const topTech = analysis.topLanguages.slice(0, 2).join(" & ");
  const score = roleData.score;

  let headline = "";

  if (score > 70) {
    headline = `${roleName} Developer | ${topTech} Expert`;
  } else if (score > 50) {
    headline = `Aspiring ${roleName} Developer | ${topTech} Enthusiast`;
  } else {
    headline = `Software Developer | ${topTech} | Open Source Contributor`;
  }

  // Add specialization based on matched skills
  if (roleName === "AI" && roleData.matched.some((skill: string) => skill.includes("Deep Learning"))) {
    headline += " | ML/AI Specialist";
  } else if (roleName === "SDE" && roleData.matched.some((skill: string) => skill.includes("React"))) {
    headline += " | Full-Stack Developer";
  } else if (roleName === "Cybersecurity") {
    headline += " | Security Analyst";
  }

  return headline;
}

function generateSkillsSection(analysis: ProfileAnalysis): string[] {
  const skills = new Set<string>();

  // Add top languages
  analysis.topLanguages.slice(0, 5).forEach(lang => skills.add(lang));

  // Add tech stack items
  analysis.techStack.slice(0, 10).forEach(tech => skills.add(tech));

  // Add common professional skills based on what's detected
  if (analysis.topLanguages.some(lang => ["JavaScript", "TypeScript", "React"].includes(lang))) {
    skills.add("Frontend Development");
    skills.add("Web Development");
  }

  if (analysis.topLanguages.some(lang => ["Node.js", "Python", "Java"].includes(lang))) {
    skills.add("Backend Development");
    skills.add("API Development");
  }

  if (analysis.techStack.some(tech => tech.includes("Docker") || tech.includes("Kubernetes"))) {
    skills.add("DevOps");
    skills.add("Containerization");
  }

  if (analysis.techStack.some(tech => tech.includes("AWS") || tech.includes("Cloud"))) {
    skills.add("Cloud Computing");
  }

  skills.add("Version Control (Git)");
  skills.add("Problem Solving");
  skills.add("Software Engineering");

  return Array.from(skills).slice(0, 12);
}

function generateRoadmap(bestRoleData: any, analysis: ProfileAnalysis): string[] {
  const roadmap: string[] = [];

  // Priority 1: Fill critical skill gaps
  if (bestRoleData.missing.length > 0) {
    const criticalMissing = bestRoleData.missing.slice(0, 3);
    roadmap.push(`🎯 Priority: Learn ${criticalMissing.join(", ")} to boost your role match score`);
  }

  // Priority 2: Strengthen existing skills
  if (analysis.recentActivity < 5) {
    roadmap.push("📈 Increase coding activity - aim for consistent commits and project updates");
  }

  if (analysis.totalStars < 10) {
    roadmap.push("⭐ Focus on project quality - add comprehensive README files, documentation, and demos");
  }

  // Priority 3: Build portfolio projects
  roadmap.push("🚀 Build 2-3 portfolio projects that showcase your target role skills");
  
  // Priority 4: Community engagement
  if (analysis.totalRepos > analysis.totalStars) {
    roadmap.push("🤝 Contribute to open-source projects to build your reputation and network");
  }

  // Priority 5: Professional development
  roadmap.push("📚 Consider relevant certifications or courses to validate your skills");
  roadmap.push("🌐 Create a personal portfolio website to showcase your work professionally");

  return roadmap.slice(0, 6);
}

// Optional: HuggingFace AI integration (requires API key)
export async function generateAdvancedAI(prompt: string): Promise<string> {
  if (!process.env.HUGGINGFACE_API_KEY) {
    throw new Error("HuggingFace API key not configured");
  }

  try {
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/microsoft/DialoGPT-large",
      { inputs: prompt },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        },
        timeout: 10000, // 10 second timeout
      }
    );

    return response.data[0]?.generated_text || "Unable to generate AI response";
  } catch (error: any) {
    console.error("AI generation failed:", error.message);
    return "AI generation currently unavailable";
  }
}