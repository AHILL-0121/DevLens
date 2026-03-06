import { RoleAnalysis, RoleMatch } from "@/types/profile";
import { GlassCard, GlassProgressBar } from "./GlassComponents";
import { Target, CheckCircle, AlertCircle, TrendingUp } from "lucide-react";
import { clsx } from "clsx";

interface RoleMatchingProps {
  roles: RoleAnalysis;
}

export function RoleMatching({ roles }: RoleMatchingProps) {
  // Sort roles by score
  const sortedRoles = Object.entries(roles).sort((a, b) => b[1].score - a[1].score);
  const bestMatch = sortedRoles[0];

  return (
    <GlassCard>
      <div className="flex items-center mb-6">
        <Target className="w-6 h-6 text-green-600 mr-3" />
        <h3 className="text-2xl font-semibold text-slate-900">Career Role Analysis</h3>
      </div>

      {/* Best Match Highlight */}
      <div className="mb-6 p-4 glass rounded-lg border-l-4 border-green-600">
        <div className="flex items-center mb-2">
          <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
          <span className="text-slate-700 font-medium">Best Role Match</span>
        </div>
        <h4 className="text-xl font-bold text-slate-900 mb-1">{bestMatch[0]} Developer</h4>
        <p className="text-slate-700">{getRoleDescription(bestMatch[0])}</p>
      </div>

      {/* Role Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {sortedRoles.map(([roleName, roleData], index) => (
          <RoleCard 
            key={roleName}
            roleName={roleName}
            roleData={roleData}
            isBest={index === 0}
          />
        ))}
      </div>
    </GlassCard>
  );
}

interface RoleCardProps {
  roleName: string;
  roleData: RoleMatch;
  isBest: boolean;
}

function RoleCard({ roleName, roleData, isBest }: RoleCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-green-400";
    if (score >= 50) return "text-yellow-400";
    if (score >= 30) return "text-orange-400";
    return "text-red-400";
  };

  const getProgressColor = (score: number) => {
    if (score >= 70) return "from-green-400 to-emerald-500";
    if (score >= 50) return "from-yellow-400 to-amber-500";
    if (score >= 30) return "from-orange-400 to-red-500";
    return "from-red-400 to-red-600";
  };

  return (
    <div className={clsx(
      "glass p-4 rounded-lg transition-all duration-300 hover:bg-white/20",
      isBest && "ring-2 ring-green-400/50"
    )}>
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <h4 className="font-bold text-slate-900">{roleName}</h4>
        <div className="text-right">
          <span className={clsx("text-2xl font-bold", getScoreColor(roleData.score))}>
            {roleData.score}
          </span>
          <span className="text-slate-600 text-sm ml-1">/100</span>
        </div>
      </div>

      {/* Progress Bar */}
      <GlassProgressBar 
        value={roleData.score} 
        className="mb-4"
        color={`bg-gradient-to-r ${getProgressColor(roleData.score)}`}
      />

      {/* Match Info */}
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-slate-600">Match Rate:</span>
          <span className="text-slate-900 font-medium">{roleData.matchPercentage}%</span>
        </div>
        
        {/* Matched Skills */}
        {roleData.matched.length > 0 && (
          <div>
            <div className="flex items-center text-green-400 mb-1">
              <CheckCircle size={14} className="mr-1" />
              <span>Matched Skills ({roleData.matched.length})</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {roleData.matched.slice(0, 3).map(skill => (
                <span key={skill} className="bg-green-400/20 text-green-300 px-2 py-1 rounded text-xs">
                  {skill}
                </span>
              ))}
              {roleData.matched.length > 3 && (
                <span className="text-green-300/70 text-xs px-2 py-1">
                  +{roleData.matched.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Missing Skills */}
        {roleData.missing.length > 0 && (
          <div>
            <div className="flex items-center text-orange-400 mb-1">
              <AlertCircle size={14} className="mr-1" />
              <span>Key Missing Skills</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {roleData.missing.slice(0, 3).map(skill => (
                <span key={skill} className="bg-orange-400/20 text-orange-300 px-2 py-1 rounded text-xs">
                  {skill}
                </span>
              ))}
              {roleData.missing.length > 3 && (
                <span className="text-orange-300/70 text-xs px-2 py-1">
                  +{roleData.missing.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {isBest && (
        <div className="mt-3 pt-3 border-t border-slate-200">
          <div className="flex items-center text-green-600 text-sm">
            <TrendingUp size={14} className="mr-1" />
            <span className="font-medium">Top Match</span>
          </div>
        </div>
      )}
    </div>
  );
}

function getRoleDescription(role: string): string {
  const descriptions = {
    SDE: "Software Development Engineer - Building scalable applications and systems",
    AI: "AI/ML Engineer - Developing intelligent systems and machine learning solutions",
    Cybersecurity: "Security Engineer - Protecting systems and conducting security assessments"
  };
  return descriptions[role as keyof typeof descriptions] || "Software Development Role";
}