import { useState } from "react";
import { ArrowUpDown, TrendingUp } from "lucide-react";
import LeaderboardCard from "@/components/LeaderboardCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import studentsData from "@/data/students.json";

const Leaderboard = () => {
  const [sortField, setSortField] = useState("overallScore");
  const [sortOrder, setSortOrder] = useState("desc");
  const [zoneFilter, setZoneFilter] = useState("all");

  const getSortedStudents = () => {
    let students = [...studentsData];

    // Apply zone filter
    if (zoneFilter === "skills") {
      students.sort((a, b) => b.skillScore - a.skillScore);
    } else if (zoneFilter === "academic") {
      students.sort((a, b) => b.cgpa - a.cgpa);
    } else if (zoneFilter === "coCurricular") {
      students.sort((a, b) => b.coCurricularScore - a.coCurricularScore);
    } else {
      students.sort((a, b) => {
        const aValue = a[sortField];
        const bValue = b[sortField];
        return sortOrder === "desc" ? bValue - aValue : aValue - bValue;
      });
    }

    return students;
  };

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "desc" ? "asc" : "desc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  const sortedStudents = getSortedStudents();

  // Find most improved student
  const mostImproved = studentsData.reduce((prev, current) => {
    const prevImprovement =
      prev.performanceHistory[prev.performanceHistory.length - 1].score -
      prev.performanceHistory[0].score;
    const currentImprovement =
      current.performanceHistory[current.performanceHistory.length - 1].score -
      current.performanceHistory[0].score;
    return currentImprovement > prevImprovement ? current : prev;
  });

  return (
    <div className="container mx-auto space-y-6 px-4 py-8">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="text-4xl font-bold mb-2">Student Leaderboard</h1>
        <p className="text-muted-foreground">
          Track top performers and celebrate achievements
        </p>
      </div>

      {/* Most Improved Card */}
      <Card className="card-depth animate-slide-up bg-gradient-to-r from-success/10 to-success/5 p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/20">
            <TrendingUp className="h-8 w-8 text-success" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Most Improved Student</h3>
            <p className="text-2xl font-bold text-success">{mostImproved.name}</p>
            <p className="text-sm text-muted-foreground">
              {mostImproved.department} • Progress: +
              {(
                mostImproved.performanceHistory[
                  mostImproved.performanceHistory.length - 1
                ].score - mostImproved.performanceHistory[0].score
              ).toFixed(1)}
              %
            </p>
          </div>
        </div>
      </Card>

      {/* Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <Tabs
          value={zoneFilter}
          onValueChange={(value) => setZoneFilter(value)}
          className="w-full md:w-auto"
        >
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="skills">Skill Zone</TabsTrigger>
            <TabsTrigger value="academic">Academic Zone</TabsTrigger>
            <TabsTrigger value="coCurricular">Co-Curricular</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => toggleSort("overallScore")}
            className="gap-2"
          >
            Overall <ArrowUpDown className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => toggleSort("cgpa")}
            className="gap-2"
          >
            CGPA <ArrowUpDown className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Leaderboard List */}
      <div className="space-y-3">
        {sortedStudents.map((student, index) => (
          <LeaderboardCard
            key={student.id}
            student={student}
            rank={index + 1}
          />
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;
