import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Mail, Github, Linkedin, Target, Users, Sparkles } from "lucide-react";

const About = () => {
  return (
    <div className="container mx-auto space-y-6 px-4 py-8 max-w-3xl">
      {/* Header */}
      <div className="animate-fade-in text-center">
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary">
          <Trophy className="h-12 w-12 text-primary-foreground" />
        </div>
        <h1 className="text-4xl font-bold mb-2">StudentBoard</h1>
        <p className="text-xl text-muted-foreground">
          Gamified University Student Leaderboard Dashboard
        </p>
      </div>

      {/* Vision */}
      <Card className="card-depth animate-slide-up p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <Target className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">Our Vision</h2>
            <p className="text-muted-foreground">
              StudentBoard transforms the academic experience by gamifying student
              performance tracking. We believe in celebrating achievements, fostering
              healthy competition, and motivating students through visual feedback,
              streaks, and badges. Our platform makes academic progress engaging and
              encourages daily learning habits.
            </p>
          </div>
        </div>
      </Card>

      {/* Features */}
      <Card className="card-depth animate-slide-up p-6" style={{ animationDelay: "0.1s" }}>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-primary" />
          Key Features
        </h2>
        <ul className="space-y-3 text-sm">
          <li className="flex items-start gap-2">
            <span className="text-primary font-bold">•</span>
            <span>
              <strong>Real-time Leaderboard</strong> - Track rankings across skills,
              academics, and co-curricular activities
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary font-bold">•</span>
            <span>
              <strong>Streak Tracking</strong> - Maintain daily engagement with
              animated streak counters and milestone celebrations
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary font-bold">•</span>
            <span>
              <strong>Badge System</strong> - Earn achievements for various
              accomplishments and showcase your progress
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary font-bold">•</span>
            <span>
              <strong>Analytics Dashboard</strong> - Visualize performance trends and
              identify areas for improvement
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary font-bold">•</span>
            <span>
              <strong>Light/Dark Mode</strong> - Comfortable viewing experience with
              smooth theme transitions
            </span>
          </li>
        </ul>
      </Card>

      {/* Technology */}
      <Card className="card-depth animate-slide-up p-6" style={{ animationDelay: "0.2s" }}>
        <h2 className="text-xl font-semibold mb-4">Built With</h2>
        <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-3">
          <div className="rounded-lg bg-muted p-3 text-center">
            <p className="font-semibold">React</p>
            <p className="text-xs text-muted-foreground">UI Framework</p>
          </div>
          <div className="rounded-lg bg-muted p-3 text-center">
            <p className="font-semibold">JavaScript</p>
            <p className="text-xs text-muted-foreground">Type Safety</p>
          </div>
          <div className="rounded-lg bg-muted p-3 text-center">
            <p className="font-semibold">Tailwind CSS</p>
            <p className="text-xs text-muted-foreground">Styling</p>
          </div>
        </div>
      </Card>

      {/* Developer */}
      <Card className="card-depth animate-slide-up p-6" style={{ animationDelay: "0.3s" }}>
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <Users className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold mb-2">Developer</h2>
            <p className="text-muted-foreground mb-4">
              Built with passion by students, for students. This project aims to make
              academic tracking more engaging and motivational.
            </p>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Mail className="h-4 w-4" />
                Contact
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Github className="h-4 w-4" />
                GitHub
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Linkedin className="h-4 w-4" />
                LinkedIn
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Version */}
      <div className="text-center text-sm text-muted-foreground animate-fade-in">
        <p>Version 1.0.0 • Built By Synapson</p>
        <p className="mt-1">© 2025 StudentBoard. All rights reserved.</p>
      </div>
    </div>
  );
};

export default About;
