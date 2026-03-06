import { RoleAnalysis } from "@/types/profile";
import { GlassCard } from "./GlassComponents";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from 'recharts';
import { Activity, Target, TrendingUp } from "lucide-react";

interface SkillRadarChartProps {
  roles: RoleAnalysis;
}

export function SkillRadarChart({ roles }: SkillRadarChartProps) {
  // Prepare data for radar chart
  const radarData = [
    {
      skill: 'Frontend Development',
      SDE: roles.SDE.score,
      AI: Math.min(roles.AI.score * 0.3, 100), // AI has some frontend but less focus
      Cybersecurity: Math.min(roles.Cybersecurity.score * 0.2, 100)
    },
    {
      skill: 'Backend Development', 
      SDE: roles.SDE.score,
      AI: Math.min(roles.AI.score * 0.8, 100),
      Cybersecurity: Math.min(roles.Cybersecurity.score * 0.7, 100)
    },
    {
      skill: 'Data Science/ML',
      SDE: Math.min(roles.SDE.score * 0.3, 100),
      AI: roles.AI.score,
      Cybersecurity: Math.min(roles.Cybersecurity.score * 0.4, 100)
    },
    {
      skill: 'Security & Networking',
      SDE: Math.min(roles.SDE.score * 0.4, 100),
      AI: Math.min(roles.AI.score * 0.2, 100),
      Cybersecurity: roles.Cybersecurity.score
    },
    {
      skill: 'DevOps & Cloud',
      SDE: Math.min(roles.SDE.score * 0.8, 100),
      AI: Math.min(roles.AI.score * 0.7, 100),
      Cybersecurity: Math.min(roles.Cybersecurity.score * 0.9, 100)
    },
    {
      skill: 'Mobile Development',
      SDE: Math.min(roles.SDE.score * 0.6, 100),
      AI: Math.min(roles.AI.score * 0.3, 100),
      Cybersecurity: Math.min(roles.Cybersecurity.score * 0.2, 100)
    }
  ];

  return (
    <GlassCard>
      <div className="flex items-center mb-6">
        <Activity className="w-6 h-6 text-blue-600 mr-3" />
        <h3 className="text-2xl font-semibold text-slate-900">Skills Radar Analysis</h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Radar Chart */}
        <div className="lg:col-span-2">
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid gridType="polygon" className="opacity-30" stroke="#94a3b8" />
                <PolarAngleAxis 
                  dataKey="skill" 
                  tick={{ fontSize: 12, fill: '#1e293b' }}
                  className="text-slate-900"
                />
                <PolarRadiusAxis 
                  angle={90}
                  domain={[0, 100]}
                  tick={{ fontSize: 10, fill: '#64748b' }}
                />
                <Radar
                  name="SDE"
                  dataKey="SDE"
                  stroke="#14b8a6"
                  fill="#14b8a6"
                  fillOpacity={0.1}
                  strokeWidth={2}
                />
                <Radar
                  name="AI/ML"
                  dataKey="AI"
                  stroke="#0ea5e9"
                  fill="#0ea5e9"
                  fillOpacity={0.1}
                  strokeWidth={2}
                />
                <Radar
                  name="Cybersecurity"
                  dataKey="Cybersecurity"
                  stroke="#f59e0b"
                  fill="#f59e0b"
                  fillOpacity={0.1}
                  strokeWidth={2}
                />
                <Legend 
                  wrapperStyle={{ 
                    color: '#1e293b',
                    fontSize: '14px'
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Role Scores Summary */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-slate-900 mb-4">Role Compatibility</h4>
          
          {Object.entries(roles).map(([roleName, roleData]) => (
            <RoleScoreCard key={roleName} roleName={roleName} roleData={roleData} />
          ))}

          <div className="mt-6 p-4 glass rounded-lg border-l-4 border-blue-500">
            <div className="flex items-center mb-2">
              <Target className="w-4 h-4 text-blue-600 mr-2" />
              <span className="text-slate-900 font-medium text-sm">Best Match</span>
            </div>
            {(() => {
              const bestRole = Object.entries(roles).reduce((best, current) => 
                current[1].score > best[1].score ? current : best
              );
              return (
                <p className="text-slate-700 text-sm">
                  <span className="font-semibold text-blue-600">{bestRole[0]}</span> 
                  {" "}with {bestRole[1].score}% compatibility
                </p>
              );
            })()}
          </div>
        </div>
      </div>

      {/* Skill Recommendations */}
      <div className="mt-6 pt-6 border-t border-slate-200">
        <div className="flex items-center mb-4">
          <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
          <h4 className="text-lg font-semibold text-slate-900">Skill Development Priority</h4>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {generateSkillRecommendations(roles).map((rec, index) => (
            <div key={index} className="glass p-3 rounded-lg">
              <div className="flex items-center mb-1">
                <div className={`w-2 h-2 rounded-full mr-2 ${getPriorityColor(rec.priority)}`} />
                <span className="text-slate-900 font-medium text-sm">{rec.skill}</span>
              </div>
              <p className="text-slate-600 text-xs">{rec.reason}</p>
            </div>
          ))}
        </div>
      </div>
    </GlassCard>
  );
}

interface RoleScoreCardProps {
  roleName: string;
  roleData: any;
}

function RoleScoreCard({ roleName, roleData }: RoleScoreCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 70) return "bg-green-400";
    if (score >= 50) return "bg-yellow-400";
    if (score >= 30) return "bg-orange-400";
    return "bg-red-400";
  };

  return (
    <div className="glass p-3 rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <span className="text-slate-900 font-medium text-sm">{roleName}</span>
        <span className="text-slate-700 text-sm font-bold">{roleData.score}%</span>
      </div>
      <div className="glass rounded-full h-2 overflow-hidden mb-2">
        <div 
          className={`h-full transition-all duration-700 ${getScoreColor(roleData.score)}`}
          style={{ width: `${roleData.score}%` }}
        />
      </div>
      <div className="flex justify-between text-xs">
        <span className="text-green-600">{roleData.matched.length} matched</span>
        <span className="text-orange-600">{roleData.missing.length} missing</span>
      </div>
    </div>
  );
}

function generateSkillRecommendations(roles: RoleAnalysis): Array<{
  skill: string;
  priority: 'high' | 'medium' | 'low';
  reason: string;
}> {
  const recommendations: Array<{
    skill: string;
    priority: 'high' | 'medium' | 'low';
    reason: string;
  }> = [];

  // Find the best role
  const bestRole = Object.entries(roles).reduce((best, current) => 
    current[1].score > best[1].score ? current : best
  );

  // High priority - missing skills from best role
  bestRole[1].missing.slice(0, 3).forEach((skill: string) => {
    recommendations.push({
      skill,
      priority: 'high',
      reason: `Critical for ${bestRole[0]} role advancement`
    });
  });

  // Medium priority - skills from other roles
  Object.entries(roles).forEach(([roleName, roleData]) => {
    if (roleName !== bestRole[0] && roleData.score > 30) {
      roleData.missing.slice(0, 2).forEach((skill: string) => {
        if (!recommendations.find(r => r.skill === skill)) {
          recommendations.push({
            skill,
            priority: 'medium',
            reason: `Valuable for ${roleName} opportunities`
          });
        }
      });
    }
  });

  return recommendations.slice(0, 6);
}

function getPriorityColor(priority: 'high' | 'medium' | 'low'): string {
  switch (priority) {
    case 'high': return 'bg-red-400';
    case 'medium': return 'bg-yellow-400';
    case 'low': return 'bg-green-400';
    default: return 'bg-gray-400';
  }
}