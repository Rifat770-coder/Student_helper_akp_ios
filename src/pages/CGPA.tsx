import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import PageLayout from "@/components/layout/PageLayout";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import { getCGPAData, getTargetCGPA, saveCGPAData, calculateGPA, calculateCGPA, GRADE_OPTIONS, Semester, Course } from "@/lib/storage";
import { Plus, Trash2, Save, Award, Download, Pencil, Check, X } from "lucide-react";
import { motion } from "framer-motion";
import TrendChart from "@/components/cgpa/TrendChart";
import TargetCGPA from "@/components/cgpa/TargetCGPA";
import { exportToCSV, exportToJSON, exportToPDF } from "@/lib/exportUtils";

const CGPAContent = () => {
  const { user } = useAuth();
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [saving, setSaving] = useState(false);
  const [cgpa, setCgpa] = useState(0);
  const [targetCGPA, setTargetCGPA] = useState<number | undefined>();
  const [editingSemesterId, setEditingSemesterId] = useState<string | null>(null);
  const [editingSemesterName, setEditingSemesterName] = useState("");
  const [showExportMenu, setShowExportMenu] = useState(false);

  useEffect(() => {
    if (user) {
      const data = getCGPAData(user.id);
      setSemesters(data);
      setCgpa(calculateCGPA(data));
      setTargetCGPA(getTargetCGPA(user.id));
    }
  }, [user]);

  const addSemester = () => {
    setSemesters([...semesters, { id: crypto.randomUUID(), name: `Semester ${semesters.length + 1}`, courses: [] }]);
  };

  const removeSemester = (id: string) => {
    const updated = semesters.filter((s) => s.id !== id);
    setSemesters(updated);
    setCgpa(calculateCGPA(updated));
  };

  const startRenameSemester = (sem: Semester) => {
    setEditingSemesterId(sem.id);
    setEditingSemesterName(sem.name);
  };

  const saveRenameSemester = () => {
    if (editingSemesterId && editingSemesterName.trim()) {
      setSemesters(semesters.map((s) =>
        s.id === editingSemesterId ? { ...s, name: editingSemesterName } : s
      ));
      setEditingSemesterId(null);
      setEditingSemesterName("");
    }
  };

  const cancelRenameSemester = () => {
    setEditingSemesterId(null);
    setEditingSemesterName("");
  };

  const addCourse = (semId: string) => {
    setSemesters(semesters.map((s) =>
      s.id === semId ? { ...s, courses: [...s.courses, { name: "", credits: 3, grade: "A" }] } : s
    ));
  };

  const removeCourse = (semId: string, courseIdx: number) => {
    const updated = semesters.map((s) =>
      s.id === semId ? { ...s, courses: s.courses.filter((_, i) => i !== courseIdx) } : s
    );
    setSemesters(updated);
    setCgpa(calculateCGPA(updated));
  };

  const updateCourse = (semId: string, courseIdx: number, field: keyof Course, value: string | number) => {
    const updated = semesters.map((s) =>
      s.id === semId ? {
        ...s,
        courses: s.courses.map((c, i) => i === courseIdx ? { ...c, [field]: value } : c),
      } : s
    );
    setSemesters(updated);
    setCgpa(calculateCGPA(updated));
  };

  const handleSave = () => {
    if (!user) return;
    setSaving(true);
    saveCGPAData(user.id, semesters, targetCGPA);
    setTimeout(() => setSaving(false), 500);
  };

  const handleSaveTarget = (target: number) => {
    setTargetCGPA(target);
    if (user) {
      saveCGPAData(user.id, semesters, target);
    }
  };

  const handleExport = (format: "csv" | "json" | "pdf") => {
    if (!user) return;
    
    switch (format) {
      case "csv":
        exportToCSV(semesters, cgpa);
        break;
      case "json":
        exportToJSON(semesters, cgpa);
        break;
      case "pdf":
        exportToPDF(semesters, cgpa, user.name);
        break;
    }
    setShowExportMenu(false);
  };

  return (
    <PageLayout>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">CGPA Calculator</h1>
          <p className="text-muted-foreground">Track your academic performance</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="btn-outline text-sm !px-3 !py-2 sm:text-base sm:!px-6 sm:!py-3"
            >
              <Download className="w-4 h-4 sm:w-5 sm:h-5" /> Export
            </button>
            {showExportMenu && (
              <div className="absolute right-0 mt-2 w-40 bg-card border border-border rounded-lg shadow-lg z-10">
                <button
                  onClick={() => handleExport("csv")}
                  className="w-full text-left px-4 py-2 hover:bg-muted transition-colors text-sm"
                >
                  Export as CSV
                </button>
                <button
                  onClick={() => handleExport("json")}
                  className="w-full text-left px-4 py-2 hover:bg-muted transition-colors text-sm"
                >
                  Export as JSON
                </button>
                <button
                  onClick={() => handleExport("pdf")}
                  className="w-full text-left px-4 py-2 hover:bg-muted transition-colors text-sm"
                >
                  Export as TXT
                </button>
              </div>
            )}
          </div>
          <button onClick={addSemester} className="btn-outline text-sm !px-3 !py-2 sm:text-base sm:!px-6 sm:!py-3">
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" /> Add Semester
          </button>
          <button onClick={handleSave} className="btn-primary text-sm !px-3 !py-2 sm:text-base sm:!px-6 sm:!py-3" disabled={saving}>
            <Save className="w-4 h-4 sm:w-5 sm:h-5" /> {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-xl p-6 border border-border shadow-md text-center"
        >
          <Award className="w-10 h-10 text-primary mx-auto mb-2" />
          <p className="text-sm text-muted-foreground mb-1">Cumulative GPA</p>
          <p className="text-5xl font-bold text-primary">{cgpa.toFixed(2)}</p>
          <p className="text-sm text-muted-foreground mt-1">out of 4.00</p>
        </motion.div>

        <TargetCGPA currentCGPA={cgpa} targetCGPA={targetCGPA} onSaveTarget={handleSaveTarget} />
      </div>

      {semesters.length > 0 && (
        <div className="mb-8">
          <TrendChart semesters={semesters} />
        </div>
      )}

      {semesters.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-lg mb-2">No semesters yet</p>
          <p className="text-sm">Add a semester to start calculating your CGPA</p>
        </div>
      ) : (
        <div className="space-y-6">
          {semesters.map((sem) => (
            <motion.div key={sem.id} layout className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
                <div className="flex-1">
                  {editingSemesterId === sem.id ? (
                    <div className="flex items-center gap-2">
                      <input
                        value={editingSemesterName}
                        onChange={(e) => setEditingSemesterName(e.target.value)}
                        className="form-input !py-1 !px-2 text-sm"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === "Enter") saveRenameSemester();
                          if (e.key === "Escape") cancelRenameSemester();
                        }}
                      />
                      <button
                        onClick={saveRenameSemester}
                        className="p-1 text-accent hover:opacity-80"
                        title="Save"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={cancelRenameSemester}
                        className="p-1 text-muted-foreground hover:text-foreground"
                        title="Cancel"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{sem.name}</h3>
                      <button
                        onClick={() => startRenameSemester(sem)}
                        className="p-1 text-muted-foreground hover:text-primary transition-colors"
                        title="Rename"
                      >
                        <Pencil className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                  <p className="text-sm text-muted-foreground">
                    GPA: <span className="font-medium text-primary">{calculateGPA(sem.courses).toFixed(2)}</span>
                    {" · "}{sem.courses.length} course{sem.courses.length !== 1 ? "s" : ""}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => addCourse(sem.id)} className="px-3 py-1.5 text-sm bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors">
                    <Plus className="w-4 h-4 inline mr-1" />Course
                  </button>
                  <button onClick={() => removeSemester(sem.id)} className="p-1.5 text-muted-foreground hover:text-destructive transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              {sem.courses.length > 0 && (
                <div className="p-4 space-y-3">
                  {sem.courses.map((course, ci) => (
                    <div key={ci} className="flex flex-col sm:flex-row gap-2 sm:gap-3 items-stretch sm:items-center">
                      <input
                        value={course.name}
                        onChange={(e) => updateCourse(sem.id, ci, "name", e.target.value)}
                        className="form-input flex-1 min-w-0"
                        placeholder="Course name"
                      />
                      <div className="flex gap-2 items-center">
                        <input
                          type="number"
                          value={course.credits}
                          onChange={(e) => updateCourse(sem.id, ci, "credits", parseInt(e.target.value) || 0)}
                          className="form-input w-20 sm:w-24"
                          placeholder="Credits"
                          min={0}
                          max={10}
                        />
                        <select
                          value={course.grade}
                          onChange={(e) => updateCourse(sem.id, ci, "grade", e.target.value)}
                          className="form-input w-20 sm:w-24"
                        >
                          {GRADE_OPTIONS.map((g) => <option key={g} value={g}>{g}</option>)}
                        </select>
                        <button onClick={() => removeCourse(sem.id, ci)} className="p-2 text-muted-foreground hover:text-destructive transition-colors flex-shrink-0">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </PageLayout>
  );
};

const CGPA = () => (
  <ProtectedRoute>
    <CGPAContent />
  </ProtectedRoute>
);

export default CGPA;
