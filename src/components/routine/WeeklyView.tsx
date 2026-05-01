import { ClassEntry } from "@/lib/storage";
import { DAYS, DAY_LABELS } from "@/lib/constants";
import { getSubjectColor } from "@/lib/classUtils";
import { Clock, MapPin } from "lucide-react";

interface WeeklyViewProps {
  classes: ClassEntry[];
  onClassClick: (cls: ClassEntry) => void;
}

const WeeklyView = ({ classes, onClassClick }: WeeklyViewProps) => {
  // Get all unique time slots
  const timeSlots = Array.from(
    new Set(classes.flatMap((c) => [c.startTime, c.endTime]))
  ).sort();

  const getClassesForDayAndTime = (day: string, time: string): ClassEntry[] => {
    return classes.filter((c) => {
      return c.day === day && c.startTime <= time && c.endTime > time;
    });
  };

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[800px]">
        {/* Header */}
        <div className="grid grid-cols-8 gap-2 mb-2">
          <div className="font-semibold text-sm text-muted-foreground">Time</div>
          {DAYS.map((day) => (
            <div key={day} className="font-semibold text-sm text-center">
              {DAY_LABELS[day]}
            </div>
          ))}
        </div>

        {/* Time slots */}
        <div className="space-y-1">
          {timeSlots.map((time, idx) => {
            // Only show start times
            if (idx % 2 !== 0) return null;

            return (
              <div key={time} className="grid grid-cols-8 gap-2">
                <div className="text-xs text-muted-foreground py-2">{time}</div>
                {DAYS.map((day) => {
                  const dayClasses = classes.filter(
                    (c) => c.day === day && c.startTime === time
                  );

                  return (
                    <div key={day} className="min-h-[60px]">
                      {dayClasses.map((cls) => {
                        const colorClass = getSubjectColor(cls.subject);
                        return (
                          <button
                            key={cls.id}
                            onClick={() => onClassClick(cls)}
                            className={`w-full text-left p-2 rounded-lg border-l-4 ${colorClass} hover:opacity-80 transition-opacity mb-1`}
                          >
                            <div className="font-semibold text-xs truncate">{cls.subject}</div>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                              <Clock className="w-3 h-3" />
                              {cls.startTime}-{cls.endTime}
                            </div>
                            {cls.room && (
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <MapPin className="w-3 h-3" />
                                {cls.room}
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        {timeSlots.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <p>No classes scheduled</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeeklyView;
