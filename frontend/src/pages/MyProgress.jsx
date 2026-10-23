import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Trophy,
  TrendingUp,
  Target,
  Flame,
  Award,
  Calendar,
  BarChart3,
  CheckCircle2,
  Clock,
} from "lucide-react";
import StreakTracker from "@/components/StreakTracker";
import BadgeCard from "@/components/BadgeCard";
import studentsData from "@/data/students.json";

const MyProgress = () => {
  // For demo purposes, using the first student as "current user"
  // In real app, this would be the authenticated user's data
  const currentUser = studentsData[0];

  const rank = studentsData
    .sort((a, b) => b.overallScore - a.overallScore)
    .findIndex((s) => s.id === currentUser.id) + 1;

  const totalStudents = studentsData.length;
  const percentile = Math.round(((totalStudents - rank) / totalStudents) * 100);

  // Calculate growth metrics
  const performanceGrowth =
    currentUser.performanceHistory[currentUser.performanceHistory.length - 1].score -
    currentUser.performanceHistory[0].score;

  const allBadges = [
    "Skill Master",
    "Active Learner",
    "Cultural Contributor",
    "Data Wizard",
    "Team Player",
    "Event Champion",
    "Quick Learner",
    "Consistent Performer",
  ];

  const badgeProgress = (currentUser.badges.length / allBadges.length) * 100;

  // Generate streak calendar (last 30 days)
  const generateStreakDays = () => {
    const days = [];
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      days.push({
        date: date.getDate(),
        active: i < currentUser.streak,
      });
    }
    return days;
  };

  const streakDays = generateStreakDays();

  // Goals and milestones
  const goals = [
    {
      title: "Reach Top 3",
      current: totalStudents - rank + 1,
      target: totalStudents - 2,
      icon: Trophy,
    },
    {
      title: "50-Day Streak",
      current: currentUser.streak,
      target: 50,
      icon: Flame,
    },
    {
      title: "Collect All Badges",
      current: currentUser.badges.length,
      target: allBadges.length,
      icon: Award,
    },
    {
      title: "CGPA 10.0",
      current: currentUser.cgpa * 100,
      target: 1000,
      icon: Target,
    },
  ];

  return (
    <div className="container mx-auto space-y-6 px-4 py-8">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="text-4xl font-bold mb-2">
          My Progress
        </h1>
        <p className="text-muted-foreground">
          Track your journey, celebrate milestones, and stay motivated
        </p>
      </div>
      <div>
        <br/>
        <h2 >  <span className="text-4xl font-bold mb-2 text-primary ">{currentUser.name}</span></h2>
      </div>
      {/* Quick Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="card-depth animate-slide-up bg-gradient-to-br from-primary/10 to-primary/5 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Current Rank</p>
              <p className="text-3xl font-bold text-primary">#{rank}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Top {percentile}%
              </p>
            </div>
            <Trophy className="h-12 w-12 text-primary/30" />
          </div>
        </Card>

        <Card className="card-depth animate-slide-up p-6" style={{ animationDelay: "0.1s" }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Overall Score</p>
              <p className="text-3xl font-bold">{currentUser.overallScore}</p>
              <p className="text-xs text-success flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3" />
                +{performanceGrowth.toFixed(1)} this quarter
              </p>
            </div>
            <BarChart3 className="h-12 w-12 text-muted/30" />
          </div>
        </Card>

        <Card className="card-depth animate-slide-up p-6" style={{ animationDelay: "0.2s" }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">CGPA</p>
              <p className="text-3xl font-bold">{currentUser.cgpa.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Target: 10.0
              </p>
            </div>
            <Award className="h-12 w-12 text-muted/30" />
          </div>
        </Card>

        <Card className="card-depth animate-slide-up p-6" style={{ animationDelay: "0.3s" }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active Streak</p>
              <p className="text-3xl font-bold text-primary">{currentUser.streak}</p>
              <p className="text-xs text-muted-foreground mt-1">
                days in a row
              </p>
            </div>
            <Flame className="h-12 w-12 text-primary/30" />
          </div>
        </Card>
      </div>

      {/* Streak Tracker & Calendar */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="card-depth p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Flame className="h-5 w-5 text-primary" />
            Streak Progress
          </h2>
          <div className="flex flex-col items-center">
            <StreakTracker streak={currentUser.streak} size={140} />
            <p className="mt-4 text-center text-sm text-muted-foreground">
              Keep logging in daily to maintain your streak!
            </p>
          </div>
        </Card>

        <Card className="card-depth lg:col-span-2 p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Last 30 Days Activity
          </h2>
          <div className="grid grid-cols-10 gap-2">
            {streakDays.map((day, index) => (
              <div
                key={index}
                className={`aspect-square rounded-md transition-all ${
                  day.active
                    ? "bg-primary hover-glow"
                    : "bg-muted hover:bg-muted/80"
                }`}
                title={`Day ${day.date}`}
              />
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
            <span>Less Active</span>
            <span>More Active</span>
          </div>
        </Card>
      </div>

      {/* Skills Breakdown */}
      <Card className="card-depth p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          Detailed Skills Analysis
        </h2>
        <div className="space-y-6">
          {Object.entries(currentUser.skills).map(([skill, score]) => {
            const getSkillLevel = (score) => {
              if (score >= 90) return { label: "Expert", color: "text-success" };
              if (score >= 75) return { label: "Advanced", color: "text-primary" };
              if (score >= 60) return { label: "Intermediate", color: "text-warning" };
              return { label: "Beginner", color: "text-muted-foreground" };
            };

            const level = getSkillLevel(score);

            return (
              <div
                key={skill}
                className="animate-slide-up"
              >
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold">{skill}</span>
                    <Badge variant="secondary" className="text-xs">
                      {level.label}
                    </Badge>
                  </div>
                  <span className={`text-sm font-bold ${level.color}`}>
                    {score}%
                  </span>
                </div>
                <Progress value={score} className="h-3" />
              </div>
            );
          })}
        </div>
      </Card>

      {/* Performance History */}
      <Card className="card-depth p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Performance Trend
        </h2>
        <div className="space-y-4">
          {currentUser.performanceHistory.map((data, index) => {
            const isLatest = index === currentUser.performanceHistory.length - 1;
            const growth =
              index > 0
                ? data.score - currentUser.performanceHistory[index - 1].score
                : 0;

            return (
              <div
                key={data.month}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="mb-2 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{data.month} 2025</span>
                    {isLatest && (
                      <Badge className="bg-primary text-primary-foreground text-xs">
                        Current
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-primary font-semibold">{data.score}%</span>
                    {growth !== 0 && (
                      <span
                        className={`text-xs flex items-center gap-1 ${
                          growth > 0 ? "text-success" : "text-destructive"
                        }`}
                      >
                        <TrendingUp
                          className={`h-3 w-3 ${growth < 0 ? "rotate-180" : ""}`}
                        />
                        {growth > 0 ? "+" : ""}
                        {growth.toFixed(1)}
                      </span>
                    )}
                  </div>
                </div>
                <div className="relative h-10 overflow-hidden rounded-lg bg-muted">
                  <div
                    className="h-full rounded-lg bg-gradient-to-r from-primary to-primary-glow transition-all duration-1000 ease-out flex items-center justify-end pr-3"
                    style={{ width: `${data.score}%` }}
                  >
                    {data.score > 20 && (
                      <span className="text-xs font-medium text-primary-foreground">
                        {data.score}%
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Goals & Milestones */}
      <Card className="card-depth p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          Goals & Milestones
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {goals.map((goal, index) => {
            const Icon = goal.icon;
            const progress = (goal.current / goal.target) * 100;
            const isCompleted = progress >= 100;

            return (
              <Card
                key={goal.title}
                className={`p-4 ${
                  isCompleted
                    ? "bg-gradient-to-br from-success/10 to-success/5 border-success/20"
                    : "bg-muted/50"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                        isCompleted ? "bg-success/20" : "bg-background"
                      }`}
                    >
                      <Icon
                        className={`h-5 w-5 ${
                          isCompleted ? "text-success" : "text-muted-foreground"
                        }`}
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">{goal.title}</h4>
                      <p className="text-xs text-muted-foreground">
                        {goal.current} / {goal.target}
                      </p>
                    </div>
                  </div>
                  {isCompleted && (
                    <CheckCircle2 className="h-5 w-5 text-success" />
                  )}
                </div>
                <Progress
                  value={Math.min(progress, 100)}
                  className="h-2"
                />
              </Card>
            );
          })}
        </div>
      </Card>

      {/* Badge Collection Progress */}
      <Card className="card-depth p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            Badge Collection
          </h2>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">
              {currentUser.badges.length} of {allBadges.length} earned
            </p>
            <p className="text-xs text-primary font-medium">
              {badgeProgress.toFixed(0)}% Complete
            </p>
          </div>
        </div>
        <Progress value={badgeProgress} className="mb-6 h-2" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {allBadges.map((badge) => (
            <BadgeCard
              key={badge}
              badge={badge}
              earned={currentUser.badges.includes(badge)}
            />
          ))}
        </div>
      </Card>

      {/* Recent Achievements */}
      <Card className="card-depth p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          Recent Achievements
        </h2>
        <div className="space-y-3">
          {currentUser.achievements.map((achievement, index) => (
            <div
              key={achievement.title}
              className="flex items-center gap-4 rounded-lg bg-muted/50 p-4 hover-glow animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-2xl">
                {achievement.icon}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold">{achievement.title}</h4>
                <p className="text-sm text-muted-foreground">
                  Earned on {achievement.date}
                </p>
              </div>
              <CheckCircle2 className="h-5 w-5 text-success" />
            </div>
          ))}
        </div>
      </Card>

      {/* Personalized Insights */}
      <Card className="card-depth bg-gradient-to-r from-primary/10 to-primary/5 p-6">
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Personalized Insights
        </h2>
        <ul className="space-y-2 text-sm">
          <li className="flex items-start gap-2">
            <span className="text-primary font-bold">•</span>
            <span>
              You're in the <strong>top {percentile}%</strong> of all students.
              Keep up the excellent work!
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary font-bold">•</span>
            <span>
              Your performance improved by <strong>+{performanceGrowth.toFixed(1)}%</strong> this
              quarter. Fantastic growth!
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary font-bold">•</span>
            <span>
              You're <strong>{50 - currentUser.streak} days away</strong> from the 50-day
              streak milestone. Don't break the chain!
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary font-bold">•</span>
            <span>
              Focus on improving <strong>{Object.entries(currentUser.skills).sort((a, b) => a[1] - b[1])[0][0]}</strong> to
              achieve a more balanced skill profile.
            </span>
          </li>
        </ul>
      </Card>
    </div>
  );
};

export default MyProgress;
