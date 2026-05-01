import { Flame, Trophy, Calendar } from "lucide-react";

interface ActivityStreakProps {
  streak: number;
  longestStreak: number;
  totalDays: number;
}

const ActivityStreak = ({ streak, longestStreak, totalDays }: ActivityStreakProps) => {
  return (
    <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Flame className="w-5 h-5 text-orange-500" />
        <h3 className="font-semibold text-lg">Activity Streak</h3>
      </div>

      <div className="space-y-4">
        {/* Current Streak */}
        <div className="text-center p-4 bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-lg">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Flame className="w-8 h-8 text-orange-500" />
            <p className="text-4xl font-bold text-orange-500">{streak}</p>
          </div>
          <p className="text-sm text-muted-foreground">
            {streak === 1 ? "day streak" : "days streak"}
          </p>
          {streak > 0 && (
            <p className="text-xs text-muted-foreground mt-1">
              Keep it up! 🔥
            </p>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Trophy className="w-4 h-4 text-amber-500" />
              <p className="text-2xl font-bold">{longestStreak}</p>
            </div>
            <p className="text-xs text-muted-foreground">Best Streak</p>
          </div>
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Calendar className="w-4 h-4 text-primary" />
              <p className="text-2xl font-bold">{totalDays}</p>
            </div>
            <p className="text-xs text-muted-foreground">Total Days</p>
          </div>
        </div>

        {/* Motivational message */}
        <div className="text-center text-xs text-muted-foreground">
          {streak === 0 ? (
            <p>Start your streak today! 💪</p>
          ) : streak < 7 ? (
            <p>Great start! Keep going! 🚀</p>
          ) : streak < 30 ? (
            <p>Amazing consistency! 🌟</p>
          ) : (
            <p>You're on fire! Legendary! 🏆</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityStreak;
