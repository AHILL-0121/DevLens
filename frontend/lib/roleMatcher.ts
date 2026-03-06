import { RoleAnalysis, RoleMatch } from "@/types/profile";

// Define skill requirements for different roles
const ROLE_SKILLS = {
  SDE: {
    core: ["JavaScript", "TypeScript", "Python", "Java", "C++", "Go", "Rust"],
    frameworks: ["React", "Vue.js", "Angular", "Next.js", "Node.js", "Express.js", "Django", "Flask", "Spring"],
    databases: ["MongoDB", "PostgreSQL", "MySQL", "Redis"],
    tools: ["Git", "Docker", "Kubernetes", "AWS", "Jenkins"],
    concepts: ["API", "REST", "Microservices", "CI/CD"]
  },
  AI: {
    core: ["Python", "R", "Julia", "MATLAB"],
    frameworks: ["TensorFlow", "PyTorch", "Keras", "Scikit-learn", "Pandas", "NumPy"],
    specialized: ["Computer Vision", "NLP", "Deep Learning", "Machine Learning", "OpenCV"],
    tools: ["Jupyter", "Anaconda", "MLflow", "Kubeflow"],
    cloud: ["AWS SageMaker", "Google AI Platform", "Azure ML"]
  },
  Cybersecurity: {
    core: ["Python", "C", "C++", "Assembly", "PowerShell", "Bash"],
    networking: ["TCP/IP", "DNS", "HTTP/HTTPS", "VPN", "Firewall"],
    tools: ["Wireshark", "Nmap", "Metasploit", "Kali Linux", "Burp Suite"],
    concepts: ["Cryptography", "Penetration Testing", "SIEM", "IDS/IPS", "Forensics"],
    compliance: ["OWASP", "ISO 27001", "GDPR", "SOC", "PCI DSS"]
  }
};

const SKILL_WEIGHTS = {
  core: 3,
  frameworks: 2,
  specialized: 2.5,
  networking: 2,
  databases: 1.5,
  tools: 1,
  concepts: 1.5,
  cloud: 2,
  compliance: 1.5
};

export function matchRoles(techStack: string[], topLanguages: string[]): RoleAnalysis {
  const allSkills = [...new Set([...techStack, ...topLanguages])];
  
  const results: RoleAnalysis = {
    SDE: calculateRoleMatch("SDE", allSkills),
    AI: calculateRoleMatch("AI", allSkills),
    Cybersecurity: calculateRoleMatch("Cybersecurity", allSkills)
  };

  return results;
}

function calculateRoleMatch(role: keyof typeof ROLE_SKILLS, userSkills: string[]): RoleMatch {
  const roleSkills = ROLE_SKILLS[role];
  const matched: string[] = [];
  const missing: string[] = [];
  let weightedScore = 0;
  let maxPossibleScore = 0;

  // Normalize user skills for better matching
  const normalizedUserSkills = userSkills.map(skill => normalizeSkill(skill));

  // Check each skill category
  Object.entries(roleSkills).forEach(([category, skills]) => {
    const weight = SKILL_WEIGHTS[category as keyof typeof SKILL_WEIGHTS];
    
    skills.forEach(skill => {
      const normalizedSkill = normalizeSkill(skill);
      maxPossibleScore += weight;
      
      if (normalizedUserSkills.some(userSkill => 
        userSkill.includes(normalizedSkill) || normalizedSkill.includes(userSkill)
      )) {
        matched.push(skill);
        weightedScore += weight;
      } else {
        missing.push(skill);
      }
    });
  });

  const matchPercentage = maxPossibleScore > 0 ? Math.round((weightedScore / maxPossibleScore) * 100) : 0;
  
  // Calculate overall score (0-100) taking into account skill diversity and depth
  const diversityBonus = Math.min(matched.length * 2, 20); // Bonus for skill diversity
  const score = Math.min(matchPercentage + diversityBonus, 100);

  return {
    role,
    matchPercentage,
    missing: missing.slice(0, 10), // Limit to top 10 missing skills
    matched,
    score
  };
}

function normalizeSkill(skill: string): string {
  return skill
    .toLowerCase()
    .replace(/[^\w\s]/g, '') // Remove special characters
    .replace(/\s+/g, '') // Remove spaces
    .replace(/(js|javascript)/, 'javascript')
    .replace(/(ts|typescript)/, 'typescript')
    .replace(/(py|python)/, 'python')
    .replace(/(cpp|c\+\+)/, 'cpp')
    .replace(/nodejs/, 'node')
    .replace(/reactjs/, 'react')
    .replace(/vuejs/, 'vue')
    .replace(/nextjs/, 'next')
    .replace(/tensorflow/, 'tensorflow')
    .replace(/pytorch/, 'pytorch');
}

export function generateRoleRecommendations(analysis: RoleAnalysis): {
  bestMatch: string;
  recommendations: string[];
} {
  // Find the role with highest score
  const sortedRoles = Object.entries(analysis).sort((a, b) => b[1].score - a[1].score);
  const bestMatch = sortedRoles[0][0];
  const bestRole = sortedRoles[0][1];

  const recommendations: string[] = [];

  // Add specific recommendations based on the best matching role
  if (bestMatch === "SDE") {
    if (bestRole.score < 50) {
      recommendations.push("Focus on core programming languages (JavaScript, Python, or Java)");
      recommendations.push("Build projects using popular frameworks (React, Node.js)");
    }
    if (!bestRole.matched.some((skill: string) => skill.includes("React") || skill.includes("Vue"))) {
      recommendations.push("Learn a modern frontend framework (React/Vue)");
    }
    if (!bestRole.matched.some((skill: string) => skill.includes("database"))) {
      recommendations.push("Add database experience (MongoDB, PostgreSQL)");
    }
  } else if (bestMatch === "AI") {
    if (!bestRole.matched.includes("Python")) {
      recommendations.push("Python is essential for AI/ML roles - prioritize it");
    }
    if (!bestRole.matched.some((skill: string) => skill.includes("TensorFlow") || skill.includes("PyTorch"))) {
      recommendations.push("Learn a deep learning framework (TensorFlow or PyTorch)");
    }
    recommendations.push("Build ML projects with real datasets");
  } else if (bestMatch === "Cybersecurity") {
    if (!bestRole.matched.some((skill: string) => ["Python", "C", "C++"].includes(skill))) {
      recommendations.push("Learn Python or C/C++ for security tools development");
    }
    if (bestRole.score < 40) {
      recommendations.push("Study networking fundamentals (TCP/IP, DNS)");
      recommendations.push("Practice with security tools (Wireshark, Nmap)");
    }
  }

  // General recommendations
  if (Math.max(...Object.values(analysis).map(r => r.score)) < 30) {
    recommendations.unshift("Consider focusing on one specific career path to build deeper expertise");
  }

  return { bestMatch, recommendations: recommendations.slice(0, 5) };
}