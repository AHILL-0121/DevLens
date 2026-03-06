import { ProfileAnalysis } from "@/types/profile";
import { GlassCard, GlassProgressBar } from "./GlassComponents";
import { generateColorFromString } from "@/utils/scoring";
import { Code, Layers, TrendingUp } from "lucide-react";

interface TechStackDisplayProps {
  analysis: ProfileAnalysis;
}

export function TechStackDisplay({ analysis }: TechStackDisplayProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Programming Languages */}
      <GlassCard>
        <div className="flex items-center mb-4">
          <Code className="w-5 h-5 text-blue-600 mr-2" />
          <h3 className="text-xl font-semibold text-slate-800">Programming Languages</h3>
        </div>
        
        <div className="space-y-3">
          {analysis.topLanguages.slice(0, 8).map((language, index) => {
            const percentage = analysis.languageDistribution[language] || 0;
            const color = generateColorFromString(language);
            
            return (
              <div key={language} className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-slate-800 font-medium">{language}</span>
                  <span className="text-slate-600 text-sm">{percentage}%</span>
                </div>
                <div className="glass rounded-full h-2 overflow-hidden">
                  <div 
                    className="h-full transition-all duration-700 ease-out"
                    style={{ 
                      width: `${percentage}%`,
                      background: color
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {analysis.topLanguages.length === 0 && (
          <div className="text-center py-8 text-slate-500">
            <Code className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No programming languages detected</p>
          </div>
        )}
      </GlassCard>

      {/* Tech Stack & Insights */}
      <div className="space-y-6">
        {/* Tech Stack */}
        <GlassCard>
          <div className="flex items-center mb-4">
            <Layers className="w-5 h-5 text-blue-600 mr-2" />
            <h3 className="text-xl font-semibold text-slate-800">Tech Stack</h3>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {analysis.techStack.slice(0, 12).map(tech => (
              <span 
                key={tech}
                className="glass px-3 py-1 rounded-full text-sm text-slate-700 border border-slate-200"
              >
                {tech}
              </span>
            ))}
          </div>

          {analysis.techStack.length === 0 && (
            <div className="text-center py-6 text-slate-500">
              <Layers className="w-6 h-6 mx-auto mb-2 opacity-50" />
              <p>No specific technologies detected</p>
            </div>
          )}
        </GlassCard>

        {/* Activity Insights */}
        <GlassCard>
          <div className="flex items-center mb-4">
            <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
            <h3 className="text-xl font-semibold text-slate-800">Activity Insights</h3>
          </div>
          
          <div className="space-y-3">
            <InsightItem 
              label="Total Repositories"
              value={analysis.totalRepos.toString()}
              description="Public repositories created"
            />
            <InsightItem 
              label="Average Stars"
              value={analysis.averageStars.toString()}
              description="Stars per repository"
            />
            <InsightItem 
              label="Recent Activity"
              value={`${analysis.recentActivity} repos`}
              description="Updated in last 6 months"
            />
            <InsightItem 
              label="Language Diversity"
              value={analysis.topLanguages.length.toString()}
              description="Different programming languages"
            />
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

interface InsightItemProps {
  label: string;
  value: string;
  description: string;
}

function InsightItem({ label, value, description }: InsightItemProps) {
  return (
    <div className="flex justify-between items-center py-2">
      <div>
        <p className="text-slate-800 font-medium">{label}</p>
        <p className="text-slate-600 text-sm">{description}</p>
      </div>
      <span className="text-lg font-bold text-green-600">{value}</span>
    </div>
  );
}