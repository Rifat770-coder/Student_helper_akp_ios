import { useState, FormEvent, useEffect } from "react";
import { X, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { DAYS, DAY_LABELS } from "@/lib/constants";
import { ClassEntry } from "@/lib/storage";
import { detectConflicts } from "@/lib/classUtils";

type ClassFormData = {
  subject: string;
  day: string;
  startTime: string;
  endTime: string;
  room: string;
  instructor: string;
  instructorPhone: string;
};

interface ClassModalProps {
  onClose: () => void;
  onSubmit: (data: ClassFormData) => void;
  initial?: ClassEntry;
  defaultDay?: string;
  allClasses: ClassEntry[];
}

const ClassModal = ({ onClose, onSubmit, initial, defaultDay, allClasses }: ClassModalProps) => {
  const [subject, setSubject] = useState(initial?.subject ?? "");
  const [day, setDay] = useState(initial?.day ?? defaultDay ?? "monday");
  const [startTime, setStartTime] = useState(initial?.startTime ?? "09:00");
  const [endTime, setEndTime] = useState(initial?.endTime ?? "10:00");
  const [room, setRoom] = useState(initial?.room ?? "");
  const [instructor, setInstructor] = useState(initial?.instructor ?? "");
  const [instructorPhone, setInstructorPhone] = useState(initial?.instructorPhone ?? "");
  const [conflicts, setConflicts] = useState<ClassEntry[]>([]);

  const isEdit = !!initial;

  // Check for conflicts whenever time/day changes
  useEffect(() => {
    const currentClass = {
      day,
      startTime,
      endTime,
      id: initial?.id,
    };
    const foundConflicts = detectConflicts(currentClass, allClasses);
    setConflicts(foundConflicts);
  }, [day, startTime, endTime, allClasses, initial?.id]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!subject.trim()) return;
    onSubmit({ subject, day, startTime, endTime, room, instructor, instructorPhone });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="modal-overlay" onClick={onClose}>
      <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">{isEdit ? "Edit Class" : "Add Class"}</h2>
          <button onClick={onClose} className="p-1 text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
        </div>

        {conflicts.length > 0 && (
          <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-destructive text-sm">Schedule Conflict Detected!</p>
                <p className="text-xs text-destructive/80 mt-1">
                  This class overlaps with:
                </p>
                <ul className="text-xs text-destructive/80 mt-1 space-y-1">
                  {conflicts.map((c) => (
                    <li key={c.id}>
                      • {c.subject} ({c.startTime} - {c.endTime})
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-group">
            <label className="form-label">Subject</label>
            <input value={subject} onChange={(e) => setSubject(e.target.value)} className="form-input" placeholder="e.g., Mathematics" required />
          </div>
          <div className="form-group">
            <label className="form-label">Day</label>
            <select value={day} onChange={(e) => setDay(e.target.value)} className="form-input">
              {DAYS.map((d) => <option key={d} value={d}>{DAY_LABELS[d]}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="form-group">
              <label className="form-label">Start Time</label>
              <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="form-input" />
            </div>
            <div className="form-group">
              <label className="form-label">End Time</label>
              <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="form-input" />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Room</label>
            <input value={room} onChange={(e) => setRoom(e.target.value)} className="form-input" placeholder="e.g., Room 101" />
          </div>
          <div className="form-group">
            <label className="form-label">Instructor</label>
            <input value={instructor} onChange={(e) => setInstructor(e.target.value)} className="form-input" placeholder="e.g., Dr. Smith" />
          </div>
          <div className="form-group">
            <label className="form-label">Instructor Phone</label>
            <input
              type="tel"
              value={instructorPhone}
              onChange={(e) => setInstructorPhone(e.target.value)}
              className="form-input"
              placeholder="e.g., +880 1700-000000"
            />
          </div>
          <button type="submit" className="btn-primary w-full justify-center">
            {isEdit ? "Save Changes" : "Add Class"}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default ClassModal;
