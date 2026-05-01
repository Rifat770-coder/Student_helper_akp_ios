import { Todo } from "@/lib/storage";
import { Clock, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";

interface UpcomingTodosProps {
  todos: Todo[];
}

const UpcomingTodos = ({ todos }: UpcomingTodosProps) => {
  // Get pending todos with due dates, sorted by date
  const upcomingTodos = todos
    .filter((t) => !t.completed && t.dueDate)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 5); // Show only next 5

  const isOverdue = (dueDate: string): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);
    return due < today;
  };

  const getDaysUntil = (dueDate: string): string => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "Overdue";
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    return `${diffDays} days`;
  };

  return (
    <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-lg">Upcoming Tasks</h3>
        </div>
        <span className="text-xs text-muted-foreground">{upcomingTodos.length} pending</span>
      </div>

      {upcomingTodos.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <p className="text-sm">No upcoming tasks</p>
          <Link to="/todos" className="text-primary hover:underline text-xs mt-2 inline-block">
            View all tasks →
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {upcomingTodos.map((todo) => {
            const overdue = isOverdue(todo.dueDate);
            const daysUntil = getDaysUntil(todo.dueDate);

            return (
              <div
                key={todo.id}
                className={`p-3 rounded-lg border ${
                  overdue ? "border-destructive/30 bg-destructive/5" : "border-border"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{todo.task}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          todo.priority === "high"
                            ? "bg-destructive/10 text-destructive"
                            : todo.priority === "medium"
                            ? "bg-amber-500/10 text-amber-600"
                            : "bg-accent/10 text-accent"
                        }`}
                      >
                        {todo.priority}
                      </span>
                      <span
                        className={`text-xs ${
                          overdue ? "text-destructive font-semibold" : "text-muted-foreground"
                        }`}
                      >
                        {overdue && <AlertCircle className="w-3 h-3 inline mr-1" />}
                        {daysUntil}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          <Link
            to="/todos"
            className="block text-center text-primary hover:underline text-xs mt-2"
          >
            View all tasks →
          </Link>
        </div>
      )}
    </div>
  );
};

export default UpcomingTodos;
