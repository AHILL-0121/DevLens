import { ReactNode } from "react";
import { clsx } from "clsx";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function GlassCard({ children, className, hover = false }: GlassCardProps) {
  return (
    <div className={clsx(
      "glass-card p-8 animate-slideInUp",
      hover && "hover-lift hover:bg-white/80 cursor-pointer",
      className
    )}>
      {children}
    </div>
  );
}

interface GlassButtonProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  variant?: 'primary' | 'secondary';
}

export function GlassButton({ 
  children, 
  onClick, 
  disabled = false, 
  loading = false,
  className,
  variant = 'primary'
}: GlassButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={clsx(
        "glass-card px-8 py-4 font-semibold transition-all duration-300 hover-lift",
        "hover:bg-white/90 active:scale-95 transform-gpu",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
        variant === 'primary' && "text-slate-700 bg-gradient-to-r from-green-100/60 to-blue-100/60 border-green-300/40 hover:from-green-200/70 hover:to-blue-200/70",
        variant === 'secondary' && "text-slate-600 bg-white/50 hover:bg-white/70",
        className
      )}
    >
      {loading ? (
        <div className="flex items-center space-x-3">
          <div className="w-5 h-5 border-2 border-green-300/50 border-t-green-600 rounded-full animate-spin"></div>
          <span className="animate-pulse">Analyzing...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
}

interface GlassInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  onKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export function GlassInput({ 
  value, 
  onChange, 
  placeholder, 
  className,
  disabled = false,
  onKeyPress 
}: GlassInputProps) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyPress={onKeyPress}
      placeholder={placeholder}
      disabled={disabled}
      className={clsx(
        "glass-input w-full transition-all duration-300 focus:outline-none",
        "focus:ring-2 focus:ring-primary-400/50 focus:bg-white/20",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
    />
  );
}

interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
  color?: string;
}

export function GlassProgressBar({ 
  value, 
  max = 100, 
  className,
  color = "bg-gradient-to-r from-primary-400 to-accent-400"
}: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100);
  
  return (
    <div className={clsx("glass rounded-full h-3 overflow-hidden", className)}>
      <div 
        className={clsx("h-full transition-all duration-700 ease-out", color)}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}