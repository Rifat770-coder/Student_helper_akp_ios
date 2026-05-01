import { Semester, calculateGPA } from "@/lib/storage";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface TrendChartProps {
  semesters: Semester[];
}

const TrendChart = ({ semesters }: TrendChartProps) => {
  if (semesters.length === 0) return null;

  const semesterGPAs = semesters.map((sem) => ({
    name: sem.name,
    gpa: calculateGPA(sem.courses),
  }));

  const maxGPA = 4.0;
  const minGPA = 0;

  return (
    <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
      <h3 className="font-semibold text-lg mb-4">GPA Trend</h3>
      
      {/* Chart */}
      <div className="relative h-48 mb-4">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-muted-foreground w-8">
          <span>4.0</span>
          <span>3.0</span>
          <span>2.0</span>
          <span>1.0</span>
          <span>0.0</span>
        </div>

        {/* Chart area */}
        <div className="ml-10 h-full relative">
          {/* Grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between">
            {[4, 3, 2, 1, 0].map((val) => (
              <div key={val} className="border-t border-border/50" />
            ))}
          </div>

          {/* Bars */}
          <div className="absolute inset-0 flex items-end justify-around gap-2">
            {semesterGPAs.map((sem, idx) => {
              const heightPercent = (sem.gpa / maxGPA) * 100;
              const prevGPA = idx > 0 ? semesterGPAs[idx - 1].gpa : sem.gpa;
              const trend = sem.gpa > prevGPA ? "up" : sem.gpa < prevGPA ? "down" : "same";
              
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1 group">
                  <div className="relative w-full">
                    <div
                      className="w-full bg-primary rounded-t-lg transition-all duration-300 group-hover:opacity-80 relative"
                      style={{ height: `${heightPercent}%`, minHeight: "4px" }}
                    >
                      {/* GPA value on hover */}
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-foreground text-background text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {sem.gpa.toFixed(2)}
                      </div>
                    </div>
                  </div>
                  
                  {/* Trend indicator */}
                  {idx > 0 && (
                    <div className="text-xs">
                      {trend === "up" && <TrendingUp className="w-3 h-3 text-accent" />}
                      {trend === "down" && <TrendingDown className="w-3 h-3 text-destructive" />}
                      {trend === "same" && <Minus className="w-3 h-3 text-muted-foreground" />}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* X-axis labels */}
      <div className="ml-10 flex justify-around gap-2">
        {semesterGPAs.map((sem, idx) => (
          <div key={idx} className="flex-1 text-center text-xs text-muted-foreground truncate">
            {sem.name}
          </div>
        ))}
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-border">
        <div className="text-center">
          <p className="text-xs text-muted-foreground">Highest</p>
          <p className="text-lg font-semibold text-accent">
            {Math.max(...semesterGPAs.map((s) => s.gpa)).toFixed(2)}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-muted-foreground">Lowest</p>
          <p className="text-lg font-semibold text-destructive">
            {Math.min(...semesterGPAs.map((s) => s.gpa)).toFixed(2)}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-muted-foreground">Average</p>
          <p className="text-lg font-semibold text-primary">
            {(semesterGPAs.reduce((sum, s) => sum + s.gpa, 0) / semesterGPAs.length).toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TrendChart;
