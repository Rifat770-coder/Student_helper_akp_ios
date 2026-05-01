import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import PageLayout from "@/components/layout/PageLayout";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import { getClasses, addClass, updateClass, deleteClass, ClassEntry } from "@/lib/storage";
import { Plus, Calendar, List } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { DAYS, DAY_LABELS } from "@/lib/constants";
import ClassCard from "@/components/routine/ClassCard";
import ClassModal from "@/components/routine/ClassModal";
import WeeklyView from "@/components/routine/WeeklyView";

type ClassFormData = { subject: string; day: string; startTime: string; endTime: string; room: string; instructor: string; instructorPhone: string };

const RoutineContent = () => {
  const { user } = useAuth();
  const [classes, setClasses] = useState<ClassEntry[]>([]);
  const [selectedDay, setSelectedDay] = useState("monday");
  const [showModal, setShowModal] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassEntry | null>(null);
  const [viewMode, setViewMode] = useState<"daily" | "weekly">("daily");

  useEffect(() => {
    if (user) setClasses(getClasses(user.id));
  }, [user]);

  const refresh = () => { if (user) setClasses(getClasses(user.id)); };
  const dayClasses = classes.filter((c) => c.day === selectedDay).sort((a, b) => a.startTime.localeCompare(b.startTime));

  const handleAdd = (data: ClassFormData) => {
    if (!user) return;
    addClass({ userId: user.id, ...data });
    setShowModal(false);
    refresh();
  };

  const handleEdit = (data: ClassFormData) => {
    if (!editingClass) return;
    updateClass(editingClass.id, data);
    setEditingClass(null);
    refresh();
  };

  const handleDelete = (id: string) => { deleteClass(id); refresh(); };

  const handleClassClick = (cls: ClassEntry) => {
    setEditingClass(cls);
  };

  return (
    <PageLayout>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Class Routine</h1>
          <p className="text-muted-foreground">Your weekly schedule</p>
        </div>
        <div className="flex gap-2">
          <div className="flex bg-muted rounded-lg p-1">
            <button
              onClick={() => setViewMode("daily")}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1 ${
                viewMode === "daily" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <List className="w-4 h-4" />
              Daily
            </button>
            <button
              onClick={() => setViewMode("weekly")}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1 ${
                viewMode === "weekly" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Calendar className="w-4 h-4" />
              Weekly
            </button>
          </div>
          <button onClick={() => setShowModal(true)} className="btn-primary">
            <Plus className="w-5 h-5" /> Add Class
          </button>
        </div>
      </div>

      {viewMode === "daily" ? (
        <>
          <div className="flex overflow-x-auto gap-1 mb-6 pb-2 -mx-5 px-5 sm:mx-0 sm:px-0">
            {DAYS.map((day) => {
              const count = classes.filter((c) => c.day === day).length;
              return (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    selectedDay === day
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {DAY_LABELS[day]}
                  {count > 0 && (
                    <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-xs ${
                      selectedDay === day ? "bg-primary-foreground/20" : "bg-primary/10 text-primary"
                    }`}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {dayClasses.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <p className="text-lg mb-2">No classes on {DAY_LABELS[selectedDay]}</p>
              <p className="text-sm">Add a class to see it here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {dayClasses.map((cls) => (
                <ClassCard key={cls.id} cls={cls} onDelete={handleDelete} onEdit={setEditingClass} />
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="bg-card rounded-xl p-4 border border-border shadow-sm">
          <WeeklyView classes={classes} onClassClick={handleClassClick} />
        </div>
      )}

      <AnimatePresence>
        {showModal && (
          <ClassModal
            onClose={() => setShowModal(false)}
            onSubmit={handleAdd}
            defaultDay={selectedDay}
            allClasses={classes}
          />
        )}
        {editingClass && (
          <ClassModal
            onClose={() => setEditingClass(null)}
            onSubmit={handleEdit}
            initial={editingClass}
            allClasses={classes}
          />
        )}
      </AnimatePresence>
    </PageLayout>
  );
};

const Routine = () => (
  <ProtectedRoute>
    <RoutineContent />
  </ProtectedRoute>
);

export default Routine;
