import { Card } from "@/components/ui/card";
import { Award } from "lucide-react";

type BadgeCardProps = {
  badge: string;
  earned?: boolean;
};

const BadgeCard = ({ badge, earned = true }: BadgeCardProps) => {
  const getBadgeIcon = (badge: string) => {
    const icons: Record<string, string> = {
      "Skill Master": "🎯",
      "Active Learner": "📚",
      "Cultural Contributor": "🎭",
      "Data Wizard": "🔮",
      "Team Player": "🤝",
      "Event Champion": "🏅",
      "Quick Learner": "⚡",
      "Consistent Performer": "⭐",
    };
    return icons[badge] || "🏆";
  };

  return (
    <Card
      className={`card-depth p-4 text-center transition-all ${
        earned
          ? "hover-glow cursor-pointer"
          : "opacity-50 grayscale"
      }`}
    >
      <div
        className={`mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full text-3xl ${
          earned ? "bg-primary/10" : "bg-muted"
        }`}
      >
        {earned ? (
          <span className="badge-shine relative">{getBadgeIcon(badge)}</span>
        ) : (
          <Award className="h-8 w-8 text-muted-foreground" />
        )}
      </div>
      <h4 className="text-sm font-semibold">{badge}</h4>
      {earned && (
        <p className="mt-1 text-xs text-muted-foreground">Earned</p>
      )}
    </Card>
  );
};

export default BadgeCard;
