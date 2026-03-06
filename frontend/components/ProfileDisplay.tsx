import { GitHubUser, ProfileAnalysis, RoleAnalysis } from "@/types/profile";
import { GlassCard, GlassProgressBar } from "./GlassComponents";
import { formatNumber, getEngagementLevel, calculateEngagementScore } from "@/utils/scoring";
import { Star, GitBranch, Calendar, Users } from "lucide-react";

interface ProfileDisplayProps {
  user: GitHubUser;
  analysis: ProfileAnalysis;
}

export function ProfileDisplay({ user, analysis }: ProfileDisplayProps) {
  const engagementScore = calculateEngagementScore(analysis);
  const engagement = getEngagementLevel(engagementScore);

  return (
    <GlassCard className="mb-8 hover-lift">
      <div className="flex items-start space-x-8">
        <img 
          src={user.avatar_url} 
          alt={`${user.login}'s avatar`}
          className="w-24 h-24 rounded-full border-4 border-green-200/50 shadow-lg animate-float"
        />
        
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-slate-800 mb-2 animate-slideInUp">
            {user.name || user.login}
          </h1>
          <p className="text-slate-600 mb-4 text-lg">@{user.login}</p>
          
          {user.bio && (
            <p className="text-slate-700 mb-6 max-w-2xl leading-relaxed">{user.bio}</p>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <StatItem 
              icon={<GitBranch size={18} />}
              label="Repositories"
              value={formatNumber(analysis.totalRepos)}
            />
            <StatItem 
              icon={<Star size={18} />}
              label="Total Stars"
              value={formatNumber(analysis.totalStars)}
            />
            <StatItem 
              icon={<Users size={18} />}
              label="Followers"
              value={formatNumber(user.followers)}
            />
            <StatItem 
              icon={<Calendar size={18} />}
              label="Recent Activity"
              value={`${analysis.recentActivity} repos`}
            />
          </div>

          <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-slate-700 font-semibold text-lg">Developer Engagement Score</span>
              <span className={`font-bold text-lg ${engagement.color}`}>{engagement.level}</span>
            </div>
            <GlassProgressBar value={engagementScore} className="mb-2" />
            <p className="text-slate-600">{engagement.description}</p>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}

interface StatItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function StatItem({ icon, label, value }: StatItemProps) {
  return (
    <div className="text-center p-4 bg-gradient-to-b from-white/50 to-white/30 rounded-xl hover-lift">
      <div className="flex items-center justify-center mb-2 text-green-600 p-2 bg-green-100/70 rounded-lg mx-auto w-fit">
        {icon}
      </div>
      <div className="text-xl font-bold text-slate-800">{value}</div>
      <div className="text-sm text-slate-600 font-medium">{label}</div>
    </div>
  );
}