import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import PageLayout from "@/components/layout/PageLayout";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import { getTodos, createTodo, updateTodo, toggleTodo, deleteTodo, Todo } from "@/lib/storage";
import { Plus, ArrowUpDown } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import TodoItem from "@/components/todos/TodoItem";
import TodoModal from "@/components/todos/TodoModal";

type TodoFormData = { task: string; priority: "high" | "medium" | "low"; dueDate: string; recurring: "none" | "daily" | "weekly" | "monthly" };
type SortOption = "default" | "priority" | "dueDate";

const TodosContent = () => {
  const { user } = useAuth();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState<SortOption>("default");
  const [showModal, setShowModal] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  useEffect(() => {
    if (user) setTodos(getTodos(user.id));
  }, [user]);

  const refresh = () => { if (user) setTodos(getTodos(user.id)); };

  const handleAdd = (data: TodoFormData) => {
    if (!user) return;
    createTodo({ userId: user.id, ...data, completed: false });
    setShowModal(false);
    refresh();
  };

  const handleEdit = (data: TodoFormData) => {
    if (!editingTodo) return;
    updateTodo(editingTodo.id, data);
    setEditingTodo(null);
    refresh();
  };

  const handleToggle = (id: string) => { toggleTodo(id); refresh(); };
  const handleDelete = (id: string) => { deleteTodo(id); refresh(); };

  const openCreate = () => { setEditingTodo(null); setShowModal(true); };
  const openEdit = (todo: Todo) => { setEditingTodo(todo); };

  const filtered = todos.filter((t) => {
    if (filter === "pending") return !t.completed;
    if (filter === "completed") return t.completed;
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "priority") {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    if (sortBy === "dueDate") {
      if (!a.dueDate && !b.dueDate) return 0;
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    }
    return 0; // default order
  });

  const stats = {
    total: todos.length,
    completed: todos.filter((t) => t.completed).length,
    pending: todos.filter((t) => !t.completed).length,
  };

  return (
    <PageLayout>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">To-Do List</h1>
          <p className="text-muted-foreground">{sorted.length} task{sorted.length !== 1 ? "s" : ""}</p>
        </div>
        <button onClick={openCreate} className="btn-primary">
          <Plus className="w-5 h-5" /> Add Task
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-6">
        <div className="stat-card"><p className="text-2xl font-bold">{stats.total}</p><p className="text-sm text-muted-foreground">Total</p></div>
        <div className="stat-card"><p className="text-2xl font-bold text-accent">{stats.completed}</p><p className="text-sm text-muted-foreground">Completed</p></div>
        <div className="stat-card"><p className="text-2xl font-bold text-feature-amber">{stats.pending}</p><p className="text-sm text-muted-foreground">Pending</p></div>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="flex gap-2">
          {["all", "pending", "completed"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-colors ${
                filter === f ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="px-3 py-2 rounded-lg text-sm bg-muted text-muted-foreground border-0 focus:ring-2 focus:ring-primary"
          >
            <option value="default">Default</option>
            <option value="priority">Priority</option>
            <option value="dueDate">Due Date</option>
          </select>
        </div>
      </div>

      {sorted.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">No tasks found</div>
      ) : (
        <div className="space-y-3">
          {sorted.map((todo) => (
            <TodoItem key={todo.id} todo={todo} onToggle={handleToggle} onDelete={handleDelete} onEdit={openEdit} />
          ))}
        </div>
      )}

      <AnimatePresence>
        {showModal && (
          <TodoModal onClose={() => setShowModal(false)} onSubmit={handleAdd} />
        )}
        {editingTodo && (
          <TodoModal onClose={() => setEditingTodo(null)} onSubmit={handleEdit} initial={editingTodo} />
        )}
      </AnimatePresence>
    </PageLayout>
  );
};

const Todos = () => (
  <ProtectedRoute>
    <TodosContent />
  </ProtectedRoute>
);

export default Todos;
