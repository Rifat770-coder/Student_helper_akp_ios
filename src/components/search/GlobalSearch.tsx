import { useState, useEffect } from "react";
import { Search, X, FileText, CheckSquare, Calendar } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getNotes, getTodos, getClasses } from "@/lib/storage";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

interface SearchResult {
  type: "note" | "todo" | "class";
  id: string;
  title: string;
  subtitle?: string;
  link: string;
}

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

const GlobalSearch = ({ isOpen, onClose }: GlobalSearchProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);

  useEffect(() => {
    if (!isOpen) {
      setQuery("");
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!user || !query.trim()) {
      setResults([]);
      return;
    }

    const searchQuery = query.toLowerCase();
    const allResults: SearchResult[] = [];

    // Search notes
    const notes = getNotes(user.id);
    notes.forEach((note) => {
      if (
        note.title.toLowerCase().includes(searchQuery) ||
        note.content.toLowerCase().includes(searchQuery)
      ) {
        allResults.push({
          type: "note",
          id: note.id,
          title: note.title,
          subtitle: note.content.substring(0, 60) + "...",
          link: "/notes",
        });
      }
    });

    // Search todos
    const todos = getTodos(user.id);
    todos.forEach((todo) => {
      if (todo.task.toLowerCase().includes(searchQuery)) {
        allResults.push({
          type: "todo",
          id: todo.id,
          title: todo.task,
          subtitle: `${todo.priority} priority • ${todo.dueDate ? new Date(todo.dueDate).toLocaleDateString() : "No due date"}`,
          link: "/todos",
        });
      }
    });

    // Search classes
    const classes = getClasses(user.id);
    classes.forEach((cls) => {
      if (
        cls.subject.toLowerCase().includes(searchQuery) ||
        cls.instructor?.toLowerCase().includes(searchQuery) ||
        cls.room?.toLowerCase().includes(searchQuery)
      ) {
        allResults.push({
          type: "class",
          id: cls.id,
          title: cls.subject,
          subtitle: `${cls.day} • ${cls.startTime} - ${cls.endTime}${cls.room ? ` • ${cls.room}` : ""}`,
          link: "/routine",
        });
      }
    });

    setResults(allResults.slice(0, 10)); // Limit to 10 results
  }, [query, user]);

  const handleResultClick = (result: SearchResult) => {
    navigate(result.link);
    onClose();
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "note":
        return <FileText className="w-4 h-4" />;
      case "todo":
        return <CheckSquare className="w-4 h-4" />;
      case "class":
        return <Calendar className="w-4 h-4" />;
      default:
        return <Search className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "note":
        return "text-secondary";
      case "todo":
        return "text-accent";
      case "class":
        return "text-primary";
      default:
        return "text-muted-foreground";
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-foreground/50 z-50 flex items-start justify-center pt-20 px-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, y: -20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: -20 }}
          className="bg-card rounded-xl border border-border shadow-xl w-full max-w-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Search Input */}
          <div className="flex items-center gap-3 p-4 border-b border-border">
            <Search className="w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search notes, tasks, classes..."
              className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
              autoFocus
            />
            <button
              onClick={onClose}
              className="p-1 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Results */}
          <div className="max-h-96 overflow-y-auto">
            {query.trim() === "" ? (
              <div className="p-8 text-center text-muted-foreground">
                <Search className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Start typing to search...</p>
              </div>
            ) : results.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                <p className="text-sm">No results found for "{query}"</p>
              </div>
            ) : (
              <div className="p-2">
                {results.map((result) => (
                  <button
                    key={`${result.type}-${result.id}`}
                    onClick={() => handleResultClick(result)}
                    className="w-full text-left p-3 rounded-lg hover:bg-muted transition-colors flex items-start gap-3"
                  >
                    <div className={`mt-0.5 ${getTypeColor(result.type)}`}>
                      {getIcon(result.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{result.title}</p>
                      {result.subtitle && (
                        <p className="text-xs text-muted-foreground truncate mt-0.5">
                          {result.subtitle}
                        </p>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground capitalize px-2 py-1 bg-muted rounded">
                      {result.type}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-border bg-muted/30">
            <p className="text-xs text-muted-foreground text-center">
              Press <kbd className="px-1.5 py-0.5 bg-background rounded text-xs">Esc</kbd> to close
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default GlobalSearch;
