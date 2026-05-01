import { ClassEntry } from "@/lib/storage";
import { DAY_LABELS } from "@/lib/constants";
import { Clock, MapPin, User, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { getSubjectColor } from "@/lib/classUtils";

interface TodayClassesProps {
  classes: ClassEntry[];
}

const TodayClasses = ({ classes }: TodayClassesProps) => {
  // Get today's day name
  const today = new Date().toLocaleDateString("en-US", { weekday: "long" }).toLowerCase();
  
  // Filter classes for today and sort by time
  const todayClasses = classes
    .filter((c) => c.day === today)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  return (
    <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-lg">Today's Classes</h3>
        </div>
        <span className="text-xs text-muted-foreground">{DAY_LABELS[today]}</span>
      </div>

      {todayClasses.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <p className="text-sm">No classes today! 🎉</p>
          <Link to="/routine" className="text-primary hover:underline text-xs mt-2 inline-block">
            View full schedule →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {todayClasses.map((cls) => {
            const colorClass = getSubjectColor(cls.subject);
            return (
              <div
                key={cls.id}
                className={`p-3 rounded-lg border-l-4 ${colorClass} hover:opacity-80 transition-opacity`}
              >
                <h4 className="font-semibold text-sm mb-2">{cls.subject}</h4>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {cls.startTime} - {cls.endTime}
                  </div>
                  {cls.room && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {cls.room}
                    </div>
                  )}
                  {cls.instructor && (
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {cls.instructor}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          <Link
            to="/routine"
            className="block text-center text-primary hover:underline text-xs mt-2"
          >
            View full schedule →
          </Link>
        </div>
      )}
    </div>
  );
};

export default TodayClasses;
