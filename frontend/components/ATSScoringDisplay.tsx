import { ATSScoreBreakdown, getATSScoreColor, getATSGradeDescription } from "@/lib/atsScoring";
import { GlassCard, GlassProgressBar } from "./GlassComponents";
import { Award, CheckCircle, AlertTriangle, FileText } from "lucide-react";
import { clsx } from "clsx";

interface ATSScoringDisplayProps {
  atsScore: ATSScoreBreakdown;
}

export function ATSScoringDisplay({ atsScore }: ATSScoringDisplayProps) {
  const scoreCategories = [
    {
      name: "Keywords & Skills",
      score: atsScore.keywords,
      max: 25,
      description: "Technical skills and relevant keywords",
      icon: <FileText size={16} />
    },
    {
      name: "Profile Formatting", 
      score: atsScore.formatting,
      max: 20,
      description: "Profile completeness and structure",
      icon: <CheckCircle size={16} />
    },
    {
      name: "Experience Depth",
      score: atsScore.experience,
      max: 25,
      description: "Project portfolio and repository history",
      icon: <Award size={16} />
    },
    {
      name: "Technical Skills",
      score: atsScore.skills,
      max: 15,
      description: "Role-specific technical competencies",
      icon: <CheckCircle size={16} />
    },
    {
      name: "Project Impact",
      score: atsScore.impact,
      max: 15,
      description: "Stars, contributions, and activity",
      icon: <Award size={16} />
    }
  ];

  return (
    <GlassCard>
      <div className="flex items-center mb-6">
        <Award className="w-6 h-6 text-green-600 mr-3" />
        <h3 className="text-2xl font-semibold text-slate-900">ATS Compatibility Score</h3>
      </div>

      {/* Overall Score Display */}
      <div className="text-center mb-8 p-6 glass rounded-xl border-2 border-slate-200">
        <div className="flex items-center justify-center mb-4">
          <div className="text-center">
            <div className={clsx("text-6xl font-bold mb-2", getATSScoreColor(atsScore.total))}>
              {atsScore.total}
            </div>
            <div className="text-slate-600 text-sm">out of 100</div>
          </div>
          <div className="ml-8 text-left">
            <div className={clsx("text-3xl font-bold mb-1", getATSScoreColor(atsScore.total))}>
              Grade {atsScore.grade}
            </div>
            <div className="text-slate-700 text-sm max-w-xs">
              {getATSGradeDescription(atsScore.grade)}
            </div>
          </div>
        </div>
        
        <GlassProgressBar 
          value={atsScore.total} 
          className="h-4"
          color={getProgressBarColor(atsScore.total)}
        />
      </div>

      {/* Score Breakdown */}
      <div className="space-y-4 mb-8">
        <h4 className="text-lg font-semibold text-slate-900 mb-4">Score Breakdown</h4>
        
        {scoreCategories.map((category, index) => (
          <div key={index} className="glass p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <div className="text-green-600 mr-2">{category.icon}</div>
                <span className="text-slate-900 font-medium">{category.name}</span>
              </div>
              <span className="text-slate-700 font-semibold">
                {category.score}/{category.max}
              </span>
            </div>
            
            <GlassProgressBar 
              value={category.score} 
              max={category.max}
              className="mb-2"
              color={getProgressBarColor((category.score / category.max) * 100)}
            />
            
            <p className="text-slate-600 text-sm">{category.description}</p>
          </div>
        ))}
      </div>

      {/* Recommendations */}
      <div className="space-y-4">
        <div className="flex items-center mb-4">
          <AlertTriangle className="w-5 h-5 text-blue-600 mr-2" />
          <h4 className="text-lg font-semibold text-slate-900">Improvement Recommendations</h4>
        </div>
        
        <div className="grid grid-cols-1 gap-3">
          {atsScore.recommendations.map((recommendation, index) => (
            <RecommendationItem 
              key={index}
              recommendation={recommendation}
              priority={index < 3 ? 'high' : 'medium'}
            />
          ))}
        </div>
      </div>

      {/* ATS Tips */}
      <div className="mt-8 p-4 glass rounded-lg border-l-4 border-blue-500">
        <h5 className="text-slate-900 font-semibold mb-2">💡 ATS Optimization Tips</h5>
        <ul className="text-slate-700 text-sm space-y-1">
          <li>• Use standard job titles and industry keywords</li>
          <li>• Include both acronyms and full forms (e.g., "AI" and "Artificial Intelligence")</li>
          <li>• Quantify achievements with numbers when possible</li>
          <li>• Keep formatting simple and consistent</li>
          <li>• Use relevant technical skills throughout your content</li>
        </ul>
      </div>
    </GlassCard>
  );
}

interface RecommendationItemProps {
  recommendation: string;
  priority: 'high' | 'medium' | 'low';
}

function RecommendationItem({ recommendation, priority }: RecommendationItemProps) {
  const getPriorityIcon = () => {
    switch (priority) {
      case 'high': return <AlertTriangle size={14} className="text-red-400" />;
      case 'medium': return <AlertTriangle size={14} className="text-yellow-400" />;
      case 'low': return <CheckCircle size={14} className="text-green-400" />;
    }
  };

  const getPriorityBorder = () => {
    switch (priority) {
      case 'high': return 'border-l-red-400';
      case 'medium': return 'border-l-yellow-400'; 
      case 'low': return 'border-l-green-400';
    }
  };

  return (
    <div className={clsx("glass p-3 rounded-lg border-l-4", getPriorityBorder())}>
      <div className="flex items-start space-x-3">
        <div className="mt-1">{getPriorityIcon()}</div>
        <p className="text-slate-800 text-sm flex-1">{recommendation}</p>
      </div>
    </div>
  );
}

function getProgressBarColor(percentage: number): string {
  if (percentage >= 80) return "bg-gradient-to-r from-green-400 to-emerald-500";
  if (percentage >= 60) return "bg-gradient-to-r from-yellow-400 to-amber-500";
  if (percentage >= 40) return "bg-gradient-to-r from-orange-400 to-red-500";
  return "bg-gradient-to-r from-red-400 to-red-600";
}