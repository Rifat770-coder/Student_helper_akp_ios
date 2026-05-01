import { useState, FormEvent } from "react";
import { X } from "lucide-react";
import { motion } from "framer-motion";
import { Todo } from "@/lib/storage";

type TodoFormData = {
  task: string;
  priority: "high" | "medium" | "low";
  dueDate: string;
  recurring: "none" | "daily" | "weekly" | "monthly";
};

interface TodoModalProps {
  onClose: () => void;
  onSubmit: (data: TodoFormData) => void;
  initial?: Todo;
}

const TodoModal = ({ onClose, onSubmit, initial }: TodoModalProps) => {
  const [task, setTask] = useState(initial?.task ?? "");
  const [priority, setPriority] = useState<"high" | "medium" | "low">(initial?.priority ?? "medium");
  const [dueDate, setDueDate] = useState(initial?.dueDate ?? "");
  const [recurring, setRecurring] = useState<"none" | "daily" | "weekly" | "monthly">(initial?.recurring ?? "none");

  const isEdit = !!initial;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!task.trim()) return;
    onSubmit({ task, priority, dueDate, recurring });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="modal-overlay"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">{isEdit ? "Edit Task" : "Add Task"}</h2>
          <button onClick={onClose} className="p-1 text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-group">
            <label className="form-label">Task</label>
            <input
              value={task}
              onChange={(e) => setTask(e.target.value)}
              className="form-input"
              placeholder="Enter your task..."
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as "high" | "medium" | "low")}
              className="form-input"
            >
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Recurring</label>
            <select
              value={recurring}
              onChange={(e) => setRecurring(e.target.value as "none" | "daily" | "weekly" | "monthly")}
              className="form-input"
            >
              <option value="none">None</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          <button type="submit" className="btn-primary w-full justify-center">
            {isEdit ? "Save Changes" : "Add Task"}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default TodoModal;
