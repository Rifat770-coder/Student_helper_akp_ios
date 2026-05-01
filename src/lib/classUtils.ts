import { ClassEntry } from "./storage";

// Generate consistent color for each subject
export const getSubjectColor = (subject: string): string => {
  const colors = [
    "bg-blue-500/10 text-blue-600 border-l-blue-500",
    "bg-purple-500/10 text-purple-600 border-l-purple-500",
    "bg-green-500/10 text-green-600 border-l-green-500",
    "bg-orange-500/10 text-orange-600 border-l-orange-500",
    "bg-pink-500/10 text-pink-600 border-l-pink-500",
    "bg-teal-500/10 text-teal-600 border-l-teal-500",
    "bg-indigo-500/10 text-indigo-600 border-l-indigo-500",
    "bg-red-500/10 text-red-600 border-l-red-500",
    "bg-cyan-500/10 text-cyan-600 border-l-cyan-500",
    "bg-amber-500/10 text-amber-600 border-l-amber-500",
  ];

  // Simple hash function to get consistent color for same subject
  let hash = 0;
  for (let i = 0; i < subject.length; i++) {
    hash = subject.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % colors.length;
  return colors[index];
};

// Check if two time ranges overlap
const timeRangesOverlap = (start1: string, end1: string, start2: string, end2: string): boolean => {
  const s1 = start1.replace(":", "");
  const e1 = end1.replace(":", "");
  const s2 = start2.replace(":", "");
  const e2 = end2.replace(":", "");

  return (s1 < e2 && e1 > s2);
};

// Detect conflicts for a specific class
export const detectConflicts = (
  currentClass: { day: string; startTime: string; endTime: string; id?: string },
  allClasses: ClassEntry[]
): ClassEntry[] => {
  return allClasses.filter((cls) => {
    // Skip if it's the same class (during edit)
    if (currentClass.id && cls.id === currentClass.id) return false;
    
    // Check if same day and time overlaps
    return (
      cls.day === currentClass.day &&
      timeRangesOverlap(currentClass.startTime, currentClass.endTime, cls.startTime, cls.endTime)
    );
  });
};

// Format time for display
export const formatTime = (time: string): string => {
  const [hours, minutes] = time.split(":");
  const h = parseInt(hours);
  const ampm = h >= 12 ? "PM" : "AM";
  const displayHour = h % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
};
