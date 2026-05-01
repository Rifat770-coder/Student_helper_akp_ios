import { Trash2, Circle, CheckCircle, Pencil, Repeat } from "lucide-react";
import { motion } from "framer-motion";
import { Todo } from "@/lib/storage";

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (todo: Todo) => void;
}

const isOverdue = (dueDate: string, completed: boolean): boolean => {
  if (!dueDate || completed) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  return due < today;
};

const TodoItem = ({ todo, onToggle, onDelete, onEdit }: TodoItemProps) => {
  const overdue = isOverdue(todo.dueDate, todo.completed);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      className={`feature-card flex items-center gap-4 ${todo.completed ? "opacity-60" : ""} ${
        overdue ? "border-l-4 border-l-destructive" : ""
      }`}
    >
      <button onClick={() => onToggle(todo.id)} className="flex-shrink-0">
        {todo.completed ? (
          <CheckCircle className="w-6 h-6 text-accent" />
        ) : (
          <Circle className="w-6 h-6 text-muted-foreground hover:text-primary transition-colors" />
        )}
      </button>
      <div className="flex-1 min-w-0">
        <p className={`font-medium ${todo.completed ? "line-through text-muted-foreground" : ""}`}>
          {todo.task}
        </p>
        <div className="flex flex-wrap gap-2 mt-1 items-center">
          <span className={`category-badge ${
            todo.priority === "high" ? "priority-high" :
            todo.priority === "medium" ? "priority-medium" : "priority-low"
          }`}>
            {todo.priority}
          </span>
          {todo.dueDate && (
            <span className={`text-xs ${overdue ? "text-destructive font-semibold" : "text-muted-foreground"}`}>
              {overdue ? "⚠️ Overdue: " : "Due: "}
              {new Date(todo.dueDate).toLocaleDateString()}
            </span>
          )}
          {todo.recurring && todo.recurring !== "none" && (
            <span className="flex items-center gap-1 text-xs text-primary">
              <Repeat className="w-3 h-3" />
              {todo.recurring}
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-1 flex-shrink-0">
        <button
          onClick={() => onEdit(todo)}
          className="p-1.5 text-muted-foreground hover:text-primary transition-colors"
          title="Edit"
        >
          <Pencil className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(todo.id)}
          className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"
          title="Delete"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};

export default TodoItem;
