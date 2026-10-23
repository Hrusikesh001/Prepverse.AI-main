import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Award, Flame, Trophy, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import StreakTracker from "@/components/StreakTracker";
import BadgeCard from "@/components/BadgeCard";
import studentsData from "@/data/students.json";

const Profile = () => {
  const { id } = useParams();
  const student = studentsData.find((s) => s.id === id);

  if (!student) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold">Student not found</h1>
        <Link to="/">
          <Button className="mt-4">Back to Leaderboard</Button>
        </Link>
      </div>
    );
  }

  const rank = studentsData
    .sort((a, b) => b.overallScore - a.overallScore)
    .findIndex((s) => s.id === id) + 1;

  return (
    <div className="container mx-auto space-y-6 px-4 py-8">
      {/* Back Button */}
      <Link to="/">
        <Button variant="ghost" size="sm" className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Leaderboard
        </Button>
      </Link>

      {/* Profile Header */}
      <Card className="card-depth animate-fade-in p-6">
        <div className="flex flex-col items-center gap-6 md:flex-row">
          {/* Avatar */}
          <div className="relative">
            <img
              src={student.photo}
              alt={student.name}
              className="h-32 w-32 rounded-full border-4 border-primary/20"
            />
            <div className="absolute -bottom-2 -right-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
              <span className="text-lg font-bold">#{rank}</span>
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold">{student.name}</h1>
            <p className="text-lg text-muted-foreground">{student.department}</p>
            <div className="mt-3 flex flex-wrap justify-center gap-2 md:justify-start">
              {student.badges.map((badge) => (
                <Badge key={badge} className="bg-primary/10 text-primary">
                  {badge}
                </Badge>
              ))}
            </div>
          </div>

          {/* Streak Tracker */}
          <div className="flex flex-col items-center">
            <StreakTracker streak={student.streak} />
          </div>
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="card-depth animate-slide-up p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Overall Score</p>
              <p className="text-3xl font-bold text-primary">{student.overallScore}</p>
            </div>
            <Trophy className="h-12 w-12 text-primary/30" />
          </div>
        </Card>

        <Card className="card-depth animate-slide-up p-6" style={{ animationDelay: "0.1s" }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">CGPA</p>
              <p className="text-3xl font-bold">{student.cgpa.toFixed(2)}</p>
            </div>
            <Award className="h-12 w-12 text-muted/30" />
          </div>
        </Card>

        <Card className="card-depth animate-slide-up p-6" style={{ animationDelay: "0.2s" }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Skill Score</p>
              <p className="text-3xl font-bold text-success">{student.skillScore}</p>
            </div>
            <TrendingUp className="h-12 w-12 text-success/30" />
          </div>
        </Card>
      </div>

      {/* Skills Radar */}
      <Card className="card-depth p-6">
        <h2 className="mb-4 text-xl font-semibold">Skill Balance</h2>
        <div className="space-y-3">
          {Object.entries(student.skills).map(([skill, score]) => (
            <div key={skill}>
              <div className="mb-1 flex justify-between text-sm">
                <span className="font-medium">{skill}</span>
                <span className="text-muted-foreground">{score}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{ width: `${score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Achievements */}
      <div>
        <h2 className="mb-4 text-xl font-semibold">Achievements</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {student.achievements.map((achievement) => (
            <Card key={achievement.title} className="card-depth hover-glow p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-2xl">
                  {achievement.icon}
                </div>
                <div>
                  <h4 className="font-semibold">{achievement.title}</h4>
                  <p className="text-xs text-muted-foreground">{achievement.date}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Badges Collection */}
      <div>
        <h2 className="mb-4 text-xl font-semibold">Badge Collection</h2>
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {student.badges.map((badge) => (
            <BadgeCard key={badge} badge={badge} earned />
          ))}
          <BadgeCard badge="Master Achiever" earned={false} />
        </div>
      </div>
    </div>
  );
};

export default Profile;
