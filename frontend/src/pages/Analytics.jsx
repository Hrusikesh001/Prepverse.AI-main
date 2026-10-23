import { Card } from "@/components/ui/card";
import { TrendingUp, Users, Award, Flame } from "lucide-react";
import studentsData from "@/data/students.json";

const Analytics = () => {
  const totalStudents = studentsData.length;
  const averageCGPA = (
    studentsData.reduce((sum, s) => sum + s.cgpa, 0) / totalStudents
  ).toFixed(2);
  const averageStreak = Math.round(
    studentsData.reduce((sum, s) => sum + s.streak, 0) / totalStudents
  );
  const totalBadges = studentsData.reduce((sum, s) => sum + s.badges.length, 0);

  // Sample data for visualization
  const months = ["Aug", "Sep", "Oct"];
  const avgPerformance = months.map((month) => {
    const scores = studentsData.map((s) => {
      const history = s.performanceHistory.find((h) => h.month === month);
      return history ? history.score : 0;
    });
    return {
      month,
      score: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
    };
  });

  return (
    <div className="container mx-auto space-y-6 px-4 py-8">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="text-4xl font-bold mb-2">Analytics Dashboard</h1>
        <p className="text-muted-foreground">
          Insights and trends across all students
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="card-depth animate-slide-up p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Students</p>
              <p className="text-3xl font-bold">{totalStudents}</p>
            </div>
            <Users className="h-12 w-12 text-primary/30" />
          </div>
        </Card>

        <Card className="card-depth animate-slide-up p-6" style={{ animationDelay: "0.1s" }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Average CGPA</p>
              <p className="text-3xl font-bold text-success">{averageCGPA}</p>
            </div>
            <TrendingUp className="h-12 w-12 text-success/30" />
          </div>
        </Card>

        <Card className="card-depth animate-slide-up p-6" style={{ animationDelay: "0.2s" }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Avg Streak</p>
              <p className="text-3xl font-bold text-primary">{averageStreak} days</p>
            </div>
            <Flame className="h-12 w-12 text-primary/30" />
          </div>
        </Card>

        <Card className="card-depth animate-slide-up p-6" style={{ animationDelay: "0.3s" }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Badges</p>
              <p className="text-3xl font-bold text-warning">{totalBadges}</p>
            </div>
            <Award className="h-12 w-12 text-warning/30" />
          </div>
        </Card>
      </div>

      {/* Performance Trend Chart */}
      <Card className="card-depth p-6">
        <h2 className="mb-6 text-xl font-semibold">Average Performance Trend</h2>
        <div className="space-y-4">
          {avgPerformance.map((data, index) => (
            <div key={data.month} className="animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="mb-2 flex justify-between text-sm">
                <span className="font-medium">{data.month} 2025</span>
                <span className="text-primary font-semibold">{data.score}%</span>
              </div>
              <div className="h-8 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-1000 ease-out"
                  style={{ width: `${data.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Top Performers by Category */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="card-depth p-6">
          <h3 className="mb-4 font-semibold text-primary">Top in Skills</h3>
          <div className="space-y-3">
            {studentsData
              .sort((a, b) => b.skillScore - a.skillScore)
              .slice(0, 3)
              .map((student, index) => (
                <div key={student.id} className="flex items-center gap-3">
                  <span className="text-lg font-bold text-muted-foreground">
                    {index + 1}
                  </span>
                  <img
                    src={student.photo}
                    alt={student.name}
                    className="h-10 w-10 rounded-full"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{student.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Score: {student.skillScore}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </Card>

        <Card className="card-depth p-6">
          <h3 className="mb-4 font-semibold text-success">Top in CGPA</h3>
          <div className="space-y-3">
            {studentsData
              .sort((a, b) => b.cgpa - a.cgpa)
              .slice(0, 3)
              .map((student, index) => (
                <div key={student.id} className="flex items-center gap-3">
                  <span className="text-lg font-bold text-muted-foreground">
                    {index + 1}
                  </span>
                  <img
                    src={student.photo}
                    alt={student.name}
                    className="h-10 w-10 rounded-full"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{student.name}</p>
                    <p className="text-xs text-muted-foreground">
                      CGPA: {student.cgpa.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </Card>

        <Card className="card-depth p-6">
          <h3 className="mb-4 font-semibold text-warning">Longest Streaks</h3>
          <div className="space-y-3">
            {studentsData
              .sort((a, b) => b.streak - a.streak)
              .slice(0, 3)
              .map((student, index) => (
                <div key={student.id} className="flex items-center gap-3">
                  <span className="text-lg font-bold text-muted-foreground">
                    {index + 1}
                  </span>
                  <img
                    src={student.photo}
                    alt={student.name}
                    className="h-10 w-10 rounded-full"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{student.name}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Flame className="h-3 w-3 text-primary" />
                      {student.streak} days
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </Card>
      </div>

      {/* Insights */}
      <Card className="card-depth bg-gradient-to-r from-primary/10 to-primary/5 p-6">
        <h2 className="mb-4 text-xl font-semibold">Key Insights</h2>
        <ul className="space-y-2 text-sm">
          <li className="flex items-start gap-2">
            <span className="text-primary">•</span>
            <span>
              Performance has shown consistent upward trend over the past 3 months
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">•</span>
            <span>
              {studentsData.filter((s) => s.streak > 30).length} students maintaining 30+ day
              streaks
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">•</span>
            <span>
              Average skill score increased by{" "}
              {(
                (avgPerformance[avgPerformance.length - 1].score -
                  avgPerformance[0].score) /
                avgPerformance[0].score *
                100
              ).toFixed(1)}
              % this quarter
            </span>
          </li>
        </ul>
      </Card>
    </div>
  );
};

export default Analytics;
