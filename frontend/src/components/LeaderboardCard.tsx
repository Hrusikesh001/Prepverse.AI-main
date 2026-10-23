import { Link } from "react-router-dom";
import { Trophy, TrendingUp, Flame } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Student = {
  id: string;
  name: string;
  department: string;
  photo: string;
  overallScore: number;
  cgpa: number;
  skillScore: number;
  streak: number;
  badges: string[];
};

type LeaderboardCardProps = {
  student: Student;
  rank: number;
};

const LeaderboardCard = ({ student, rank }: LeaderboardCardProps) => {
  const getRankColor = (rank: number) => {
    if (rank === 1) return "text-warning";
    if (rank === 2) return "text-muted-foreground";
    if (rank === 3) return "text-primary";
    return "text-foreground";
  };

  const getRankBg = (rank: number) => {
    if (rank === 1) return "bg-warning/10";
    if (rank === 2) return "bg-muted";
    if (rank === 3) return "bg-primary/10";
    return "bg-muted/50";
  };

  return (
    <Link to={`/profile/${student.id}`}>
      <Card className="card-depth hover-glow animate-fade-in group cursor-pointer overflow-hidden p-4 transition-all">
        <div className="flex items-center gap-4">
          {/* Rank Badge */}
          <div
            className={`flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl ${getRankBg(
              rank
            )}`}
          >
            <span className={`text-2xl font-bold ${getRankColor(rank)}`}>
              {rank}
            </span>
          </div>

          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <img
              src={student.photo}
              alt={student.name}
              className="h-16 w-16 rounded-full border-2 border-border"
            />
            {student.streak > 20 && (
              <div className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary animate-glow-pulse">
                <Flame className="h-3 w-3 text-primary-foreground" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg truncate group-hover:text-primary transition-colors">
              {student.name}
            </h3>
            <p className="text-sm text-muted-foreground truncate">
              {student.department}
            </p>
            <div className="flex items-center gap-2 mt-1">
              {student.badges.slice(0, 2).map((badge) => (
                <Badge
                  key={badge}
                  variant="secondary"
                  className="text-xs px-2 py-0"
                >
                  {badge}
                </Badge>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="hidden md:flex flex-col items-end gap-1">
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-primary" />
              <span className="text-xl font-bold text-primary">
                {student.overallScore}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>CGPA: {student.cgpa.toFixed(2)}</span>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <Flame className="h-3 w-3 text-primary" />
              <span className="text-primary font-medium">{student.streak} days</span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default LeaderboardCard;
