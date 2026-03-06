"use client";

import { useState } from "react";
import { DevLensReport } from "@/types/profile";
import { ATSScoreBreakdown, calculateATSScore } from "@/lib/atsScoring";
import { generateResumePDF } from "@/lib/pdfGenerator";
import { GlassCard, GlassInput, GlassButton } from "@/components/GlassComponents";
import { ProfileDisplay } from "@/components/ProfileDisplay";
import { TechStackDisplay } from "@/components/TechStackDisplay";
import { RoleMatching } from "@/components/RoleMatching";
import { AIInsightsDisplay } from "@/components/AIInsightsDisplay";
import { ATSScoringDisplay } from "@/components/ATSScoringDisplay";
import { SkillRadarChart } from "@/components/SkillRadarChart";
import { 
  ProfileSkeleton, 
  AnalysisSkeleton 
} from "@/components/SkeletonLoaders";
import { Search, Github, Zap, AlertCircle, FileText, Download } from "lucide-react";

export default function HomePage() {
  const [username, setUsername] = useState("");
  const [report, setReport] = useState<DevLensReport | null>(null);
  const [atsScore, setAtsScore] = useState<ATSScoreBreakdown | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!username.trim()) {
      setError("Please enter a GitHub username");
      return;
    }

    setLoading(true);
    setError(null);
    setReport(null);
    setAtsScore(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          username: username.trim(),
          saveReport: false
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Analysis failed");
      }

      setReport(data);
      
      // Calculate ATS score
      const calculatedAtsScore = calculateATSScore(data.user, data.analysis, data.roles);
      setAtsScore(calculatedAtsScore);

    } catch (err: any) {
      setError(err.message || "An error occurred during analysis");
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePDF = async () => {
    if (!report || !atsScore) return;
    
    try {
      await generateResumePDF(report, atsScore);
    } catch (err) {
      console.error("Failed to generate PDF:", err);
      setError("Failed to generate PDF. Please try again.");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAnalyze();
    }
  };

  return (
    <main className="container mx-auto px-6 py-12 min-h-screen">
      {/* Header */}
      <div className="mb-12">
        <div className="text-center">
          <div className="flex items-center justify-center mb-6 animate-slideInUp">
            <div className="p-4 glass rounded-full mr-6 animate-float">
              <Github className="w-10 h-10 text-gray-800" />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-gray-800 via-green-600 to-blue-600 bg-clip-text text-transparent animate-glow">
              DevLens
            </h1>
          </div>
          <p className="text-2xl text-slate-700 mb-4 animate-slideInUp font-semibold">
            Free & AI-Powered GitHub Profile Analyzer
          </p>
          <p className="text-slate-600 max-w-2xl mx-auto leading-relaxed animate-slideInUp" style={{animationDelay: '0.2s'}}>
            Transform your GitHub activity into career insights. Get ATS-ready resume bullets, 
            role matching analysis, and personalized growth recommendations - completely free!
          </p>
        </div>
      </div>

      {/* Search Section */}
      <GlassCard className="max-w-2xl mx-auto mb-12 hover-lift">
        <div className="flex items-center mb-6">
          <div className="p-2 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg mr-3">
            <Search className="w-6 h-6 text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-700">Analyze GitHub Profile</h2>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <GlassInput
            value={username}
            onChange={setUsername}
            placeholder="Enter GitHub username (e.g., octocat)"
            className="flex-1"
            disabled={loading}
            onKeyPress={handleKeyPress}
          />
          <GlassButton
            onClick={handleAnalyze}
            loading={loading}
            disabled={loading || !username.trim()}
            className="sm:w-auto w-full"
          >
            {loading ? (
              <>Analyzing...</>
            ) : (
              <>
                <Zap className="w-4 h-4 mr-2" />
                Analyze
              </>
            )}
          </GlassButton>
        </div>

        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl animate-slideInUp">
            <div className="flex items-center">
              <div className="p-1 bg-red-100 rounded-lg mr-3">
                <AlertCircle className="w-5 h-5 text-red-500" />
              </div>
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          </div>
        )}
      </GlassCard>

      {/* Loading State */}
      {loading && (
        <div className="space-y-6">
          <ProfileSkeleton />
          <AnalysisSkeleton />
        </div>
      )}

      {/* Results */}
      {report && !loading && (
        <div id="analysis-report" className="space-y-8">
          {/* Profile Section */}
          <ProfileDisplay user={report.user} analysis={report.analysis} />

          {/* ATS Score Section */}
          {atsScore && <ATSScoringDisplay atsScore={atsScore} />}

          {/* Skill Radar Chart */}
          <SkillRadarChart roles={report.roles} />

          {/* Tech Stack Section */}
          <TechStackDisplay analysis={report.analysis} />

          {/* Role Matching Section */}
          <RoleMatching roles={report.roles} />

          {/* AI Insights Section */}
          <AIInsightsDisplay insights={report.insights} />

          {/* Export Actions */}
          <GlassCard className="text-center">
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              Ready to level up your career?
            </h3>
            <p className="text-slate-700 mb-4">
              Use these insights to update your resume, LinkedIn profile, and skill development plan.
            </p>
            <div className="flex justify-center space-x-4 flex-wrap gap-2">
              <GlassButton 
                variant="secondary"
                onClick={() => window.print()}
              >
                <FileText className="w-4 h-4 mr-2" />
                Print Report
              </GlassButton>
              
              <GlassButton
                onClick={handleGeneratePDF}
              >
                <Download className="w-4 h-4 mr-2" />
                Download PDF Resume
              </GlassButton>
              
              <GlassButton
                variant="secondary"
                onClick={() => {
                  const text = generateReportText(report);
                  navigator.clipboard.writeText(text);
                }}
              >
                Copy to Clipboard
              </GlassButton>
            </div>
          </GlassCard>
        </div>
      )}

      {/* Features Section - Only show when no report */}
      {!loading && !report && (
        <div className="text-center mt-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <FeatureCard
              icon={<Github className="w-6 h-6" />}
              title="Deep GitHub Analysis"
              description="Comprehensive analysis of your repositories, languages, and contribution patterns"
            />
            <FeatureCard
              icon={<Zap className="w-6 h-6" />}
              title="AI-Powered Insights"
              description="Get personalized resume bullets and career recommendations powered by AI"
            />
            <FeatureCard
              icon={<Search className="w-6 h-6" />}
              title="Role Matching"
              description="See how well you match SDE, AI/ML, and Cybersecurity career paths"
            />
          </div>
        </div>
      )}
    </main>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <GlassCard className="text-center" hover>
      <div className="text-green-600 mb-4 flex justify-center">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-slate-800 mb-2">{title}</h3>
      <p className="text-slate-600 text-sm">{description}</p>
    </GlassCard>
  );
}

function generateReportText(report: DevLensReport): string {
  return `
DevLens Analysis Report for ${report.user.login}
Generated: ${new Date(report.generatedAt).toLocaleDateString()}

=== PROFILE SUMMARY ===
${report.user.name || report.user.login} (@${report.user.login})
${report.user.bio || ''}
Repositories: ${report.analysis.totalRepos}
Total Stars: ${report.analysis.totalStars}
Top Languages: ${report.analysis.topLanguages.join(', ')}

=== RESUME BULLETS ===
${report.insights.resumeBullets.map(bullet => `• ${bullet}`).join('\n')}

=== LinkedIn HEADLINE ===
${report.insights.linkedinHeadline}

=== SKILLS ===
${report.insights.skillsSection.join(', ')}

=== GROWTH ROADMAP ===
${report.insights.improvementRoadmap.map((item, i) => `${i + 1}. ${item}`).join('\n')}

Generated by DevLens - AI GitHub Profile Analyzer
  `.trim();
}