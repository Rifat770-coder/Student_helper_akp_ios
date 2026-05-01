import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import PageLayout from "@/components/layout/PageLayout";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import { getNotes, getTodos, getCGPAData, getClasses, calculateCGPA } from "@/lib/storage";
import { recordActivity, getActivityData, getTotalActiveDays } from "@/lib/activityUtils";
import { motion } from "framer-motion";
import TodayClasses from "@/components/dashboard/TodayClasses";
import UpcomingTodos from "@/components/dashboard/UpcomingTodos";
import ActivityStreak from "@/components/dashboard/ActivityStreak";
import PomodoroTimer from "@/components/pomodoro/PomodoroTimer";

const DashboardContent = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ notes: 0, todosTotal: 0, todosCompleted: 0, todosPending: 0, cgpa: 0, classes: 0 });
  const [classes, setClasses] = useState<any[]>([]);
  const [todos, setTodos] = useState<any[]>([]);
  const [activityData, setActivityData] = useState({ streak: 0, longestStreak: 0, totalDays: 0 });

  useEffect(() => {
    if (user) {
      // Record activity
      recordActivity(user.id);

      // Get all data
      const notes = getNotes(user.id);
      const todosData = getTodos(user.id);
      const semesters = getCGPAData(user.id);
      const classesData = getClasses(user.id);
      
      setClasses(classesData);
      setTodos(todosData);
      
      setStats({
        notes: notes.length,
        todosTotal: todosData.length,
        todosCompleted: todosData.filter((t) => t.completed).length,
        todosPending: todosData.filter((t) => !t.completed).length,
        cgpa: parseFloat(calculateCGPA(semesters).toFixed(2)),
        classes: classesData.length,
      });

      // Get activity data
      const activity = getActivityData(user.id);
      setActivityData({
        streak: activity?.streak || 0,
        longestStreak: activity?.longestStreak || 0,
        totalDays: getTotalActiveDays(user.id),
      });
    }
  }, [user]);

  return (
    <PageLayout>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl sm:text-3xl font-bold mb-1">Welcome back, {user!.name}! 👋</h1>
        <p className="text-muted-foreground mb-8">Here's your academic overview</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Notes", value: stats.notes, colorClass: "border-l-secondary" },
          { label: "Tasks Pending", value: stats.todosPending, colorClass: "border-l-feature-amber" },
          { label: "Tasks Done", value: stats.todosCompleted, colorClass: "border-l-accent" },
          { label: "CGPA", value: stats.cgpa.toFixed(2), colorClass: "border-l-primary" },
        ].map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`stat-card border-l-4 ${s.colorClass} text-left`}
          >
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-sm text-muted-foreground">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Today's Overview */}
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <TodayClasses classes={classes} />
        <UpcomingTodos todos={todos} />
        <ActivityStreak
          streak={activityData.streak}
          longestStreak={activityData.longestStreak}
          totalDays={activityData.totalDays}
        />
      </div>

      {/* Pomodoro Timer */}
      <div>
        <div className="max-w-md mx-auto">
          <PomodoroTimer />
        </div>
      </div>
    </PageLayout>
  );
};

const Dashboard = () => (
  <ProtectedRoute>
    <DashboardContent />
  </ProtectedRoute>
);

export default Dashboard;
