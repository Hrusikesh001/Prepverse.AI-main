import { Flame } from "lucide-react";

type StreakTrackerProps = {
  streak: number;
  size?: number;
};

const StreakTracker = ({ streak, size = 120 }: StreakTrackerProps) => {
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min((streak / 50) * 100, 100);
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth="8"
          fill="none"
          className="text-muted"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth="8"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="text-primary transition-all duration-500 ease-out streak-ring"
          strokeLinecap="round"
        />
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <Flame className="h-8 w-8 text-primary mb-1 animate-glow-pulse" />
        <span className="text-2xl font-bold text-primary">{streak}</span>
        <span className="text-xs text-muted-foreground">day streak</span>
      </div>
    </div>
  );
};

export default StreakTracker;
