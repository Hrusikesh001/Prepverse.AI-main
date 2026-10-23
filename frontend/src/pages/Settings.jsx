import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useTheme } from "@/context/ThemeContext";
import { Moon, Sun, Bell, Accessibility } from "lucide-react";

const Settings = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="container mx-auto space-y-6 px-4 py-8 max-w-2xl">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="text-4xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">
          Customize your dashboard experience
        </p>
      </div>

      {/* Theme Settings */}
      <Card className="card-depth p-6 animate-slide-up">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {theme === "light" ? (
              <Sun className="h-10 w-10 text-primary" />
            ) : (
              <Moon className="h-10 w-10 text-primary" />
            )}
            <div>
              <Label htmlFor="theme-toggle" className="text-base font-semibold">
                Dark Mode
              </Label>
              <p className="text-sm text-muted-foreground">
                Toggle between light and dark themes
              </p>
            </div>
          </div>
          <Switch
            id="theme-toggle"
            checked={theme === "dark"}
            onCheckedChange={toggleTheme}
            className="data-[state=checked]:bg-primary"
          />
        </div>
      </Card>

      {/* Notifications */}
      <Card className="card-depth p-6 animate-slide-up" style={{ animationDelay: "0.1s" }}>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Bell className="h-10 w-10 text-primary" />
            <div>
              <h3 className="text-base font-semibold">Notifications</h3>
              <p className="text-sm text-muted-foreground">
                Manage your notification preferences
              </p>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="achievement-notif" className="text-sm font-medium">
                  Achievement Alerts
                </Label>
                <p className="text-xs text-muted-foreground">
                  Get notified when you earn new badges
                </p>
              </div>
              <Switch id="achievement-notif" defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="streak-notif" className="text-sm font-medium">
                  Streak Reminders
                </Label>
                <p className="text-xs text-muted-foreground">
                  Daily reminders to maintain your streak
                </p>
              </div>
              <Switch id="streak-notif" defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="rank-notif" className="text-sm font-medium">
                  Rank Updates
                </Label>
                <p className="text-xs text-muted-foreground">
                  Notifications about leaderboard changes
                </p>
              </div>
              <Switch id="rank-notif" />
            </div>
          </div>
        </div>
      </Card>

      {/* Accessibility */}
      <Card className="card-depth p-6 animate-slide-up" style={{ animationDelay: "0.2s" }}>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Accessibility className="h-10 w-10 text-primary" />
            <div>
              <h3 className="text-base font-semibold">Accessibility</h3>
              <p className="text-sm text-muted-foreground">
                Customize for better accessibility
              </p>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="reduce-motion" className="text-sm font-medium">
                  Reduce Motion
                </Label>
                <p className="text-xs text-muted-foreground">
                  Minimize animations and transitions
                </p>
              </div>
              <Switch id="reduce-motion" />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="high-contrast" className="text-sm font-medium">
                  High Contrast
                </Label>
                <p className="text-xs text-muted-foreground">
                  Increase color contrast for better visibility
                </p>
              </div>
              <Switch id="high-contrast" />
            </div>
          </div>
        </div>
      </Card>

      {/* Info Card */}
      <Card className="card-depth bg-gradient-to-r from-primary/10 to-primary/5 p-6 animate-slide-up" style={{ animationDelay: "0.3s" }}>
        <p className="text-sm text-muted-foreground">
          Settings are automatically saved and synced across your devices.
          Changes take effect immediately.
        </p>
      </Card>
    </div>
  );
};

export default Settings;
