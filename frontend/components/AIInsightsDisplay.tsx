import { AIInsights } from "@/types/profile";
import { GlassCard } from "./GlassComponents";
import { Lightbulb, FileText, LinkedinIcon, MapPin, Copy, Check } from "lucide-react";
import { useState } from "react";

interface AIInsightsDisplayProps {
  insights: AIInsights;
}

export function AIInsightsDisplay({ insights }: AIInsightsDisplayProps) {
  return (
    <div className="space-y-6">
      {/* Resume Bullets */}
      <GlassCard>
        <div className="flex items-center mb-4">
          <FileText className="w-5 h-5 text-green-600 mr-2" />
          <h3 className="text-xl font-semibold text-slate-800">ATS-Ready Resume Bullets</h3>
        </div>
        
        <div className="space-y-3">
          {insights.resumeBullets.map((bullet, index) => (
            <BulletPoint key={index} text={bullet} />
          ))}
        </div>
      </GlassCard>

      {/* LinkedIn Headline */}
      <GlassCard>
        <div className="flex items-center mb-4">
          <LinkedinIcon className="w-5 h-5 text-blue-600 mr-2" />
          <h3 className="text-xl font-semibold text-slate-800">LinkedIn Headline</h3>
        </div>
        
        <CopyableContent content={insights.linkedinHeadline} />
      </GlassCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Skills Section */}
        <GlassCard>
          <div className="flex items-center mb-4">
            <Lightbulb className="w-5 h-5 text-blue-600 mr-2" />
            <h3 className="text-lg font-semibold text-slate-800">Skills Section</h3>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {insights.skillsSection.map(skill => (
              <span 
                key={skill}
                className="glass px-3 py-1 rounded-full text-sm text-slate-700 border border-slate-200"
              >
                {skill}
              </span>
            ))}
          </div>
        </GlassCard>

        {/* Improvement Roadmap */}
        <GlassCard>
          <div className="flex items-center mb-4">
            <MapPin className="w-5 h-5 text-green-600 mr-2" />
            <h3 className="text-lg font-semibold text-slate-800">Growth Roadmap</h3>
          </div>
          
          <div className="space-y-2">
            {insights.improvementRoadmap.slice(0, 5).map((item, index) => (
              <div key={index} className="flex items-start space-x-2">
                <span className="text-slate-500 text-sm mt-1">{index + 1}.</span>
                <p className="text-slate-700 text-sm">{item}</p>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

interface BulletPointProps {
  text: string;
}

function BulletPoint({ text }: BulletPointProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group flex items-start space-x-3 p-3 glass rounded-lg hover:bg-white/80 transition-all duration-300">
      <span className="text-green-600 font-bold text-sm mt-1">•</span>
      <p className="text-slate-700 text-sm flex-1 leading-relaxed">{text}</p>
      <button
        onClick={copyToClipboard}
        className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-1 hover:bg-white/20 rounded"
        title="Copy to clipboard"
      >
        {copied ? (
          <Check size={14} className="text-green-400" />
        ) : (
          <Copy size={14} className="text-slate-500 hover:text-slate-700" />
        )}
      </button>
    </div>
  );
}

interface CopyableContentProps {
  content: string;
}

function CopyableContent({ content }: CopyableContentProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass p-4 rounded-lg">
      <div className="flex justify-between items-start">
        <p className="text-slate-700 text-lg leading-relaxed flex-1">{content}</p>
        <button
          onClick={copyToClipboard}
          className="ml-3 p-2 hover:bg-white/80 rounded-lg transition-all duration-300"
          title="Copy to clipboard"
        >
          {copied ? (
            <Check size={16} className="text-green-600" />
          ) : (
            <Copy size={16} className="text-slate-500 hover:text-slate-700" />
          )}
        </button>
      </div>
    </div>
  );
}
