// LocalStorage helper for all data operations

export interface Note {
  id: string;
  userId: string;
  title: string;
  content: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export interface Todo {
  id: string;
  userId: string;
  task: string;
  priority: "high" | "medium" | "low";
  dueDate: string;
  completed: boolean;
  createdAt: string;
  recurring?: "none" | "daily" | "weekly" | "monthly";
}

export interface Course {
  name: string;
  credits: number;
  grade: string;
}

export interface Semester {
  id: string;
  name: string;
  courses: Course[];
}

export interface CGPAData {
  userId: string;
  semesters: Semester[];
  targetCGPA?: number;
}

export interface ClassEntry {
  id: string;
  userId: string;
  subject: string;
  day: string;
  startTime: string;
  endTime: string;
  room: string;
  instructor: string;
  instructorPhone: string;
}

const getStore = <T>(key: string): T[] => {
  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch {
    return [];
  }
};

const setStore = <T>(key: string, data: T[]) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Notes
export const getNotes = (userId: string): Note[] =>
  getStore<Note>("ss_notes").filter((n) => n.userId === userId);

export const createNote = (note: Omit<Note, "id" | "createdAt" | "updatedAt">): Note => {
  const notes = getStore<Note>("ss_notes");
  const newNote: Note = { ...note, id: crypto.randomUUID(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
  notes.push(newNote);
  setStore("ss_notes", notes);
  return newNote;
};

export const updateNote = (id: string, updates: Partial<Note>): Note | null => {
  const notes = getStore<Note>("ss_notes");
  const idx = notes.findIndex((n) => n.id === id);
  if (idx === -1) return null;
  notes[idx] = { ...notes[idx], ...updates, updatedAt: new Date().toISOString() };
  setStore("ss_notes", notes);
  return notes[idx];
};

export const deleteNote = (id: string) => {
  setStore("ss_notes", getStore<Note>("ss_notes").filter((n) => n.id !== id));
};

// Todos
export const getTodos = (userId: string): Todo[] =>
  getStore<Todo>("ss_todos").filter((t) => t.userId === userId);

export const createTodo = (todo: Omit<Todo, "id" | "createdAt">): Todo => {
  const todos = getStore<Todo>("ss_todos");
  const newTodo: Todo = { ...todo, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
  todos.push(newTodo);
  setStore("ss_todos", todos);
  return newTodo;
};

export const updateTodo = (id: string, updates: Partial<Omit<Todo, "id" | "userId" | "createdAt">>): Todo | null => {
  const todos = getStore<Todo>("ss_todos");
  const idx = todos.findIndex((t) => t.id === id);
  if (idx === -1) return null;
  todos[idx] = { ...todos[idx], ...updates };
  setStore("ss_todos", todos);
  return todos[idx];
};

export const toggleTodo = (id: string): Todo | null => {
  const todos = getStore<Todo>("ss_todos");
  const idx = todos.findIndex((t) => t.id === id);
  if (idx === -1) return null;
  todos[idx].completed = !todos[idx].completed;
  setStore("ss_todos", todos);
  return todos[idx];
};

export const deleteTodo = (id: string) => {
  setStore("ss_todos", getStore<Todo>("ss_todos").filter((t) => t.id !== id));
};

// CGPA
export const getCGPAData = (userId: string): Semester[] => {
  const all = getStore<CGPAData>("ss_cgpa");
  const found = all.find((d) => d.userId === userId);
  return found?.semesters || [];
};

export const getTargetCGPA = (userId: string): number | undefined => {
  const all = getStore<CGPAData>("ss_cgpa");
  const found = all.find((d) => d.userId === userId);
  return found?.targetCGPA;
};

export const saveCGPAData = (userId: string, semesters: Semester[], targetCGPA?: number) => {
  const all = getStore<CGPAData>("ss_cgpa");
  const idx = all.findIndex((d) => d.userId === userId);
  if (idx >= 0) {
    all[idx].semesters = semesters;
    if (targetCGPA !== undefined) all[idx].targetCGPA = targetCGPA;
  } else {
    all.push({ userId, semesters, targetCGPA });
  }
  setStore("ss_cgpa", all);
};

// Routine
export const getClasses = (userId: string): ClassEntry[] =>
  getStore<ClassEntry>("ss_classes").filter((c) => c.userId === userId);

export const addClass = (entry: Omit<ClassEntry, "id">): ClassEntry => {
  const classes = getStore<ClassEntry>("ss_classes");
  const newClass: ClassEntry = { ...entry, id: crypto.randomUUID() };
  classes.push(newClass);
  setStore("ss_classes", classes);
  return newClass;
};

export const updateClass = (id: string, updates: Partial<Omit<ClassEntry, "id" | "userId">>): ClassEntry | null => {
  const classes = getStore<ClassEntry>("ss_classes");
  const idx = classes.findIndex((c) => c.id === id);
  if (idx === -1) return null;
  classes[idx] = { ...classes[idx], ...updates };
  setStore("ss_classes", classes);
  return classes[idx];
};

export const deleteClass = (id: string) => {
  setStore("ss_classes", getStore<ClassEntry>("ss_classes").filter((c) => c.id !== id));
};

// CGPA calculation helpers
export const GRADES: Record<string, number> = {
  "A+": 4.0, "A": 4.0, "A-": 3.7,
  "B+": 3.3, "B": 3.0, "B-": 2.7,
  "C+": 2.3, "C": 2.0, "C-": 1.7,
  "D+": 1.3, "D": 1.0, "D-": 0.7,
  "F": 0.0,
};

export const GRADE_OPTIONS = Object.keys(GRADES);

export const calculateGPA = (courses: Course[]): number => {
  if (courses.length === 0) return 0;
  let totalPoints = 0;
  let totalCredits = 0;
  courses.forEach((c) => {
    const pts = GRADES[c.grade] ?? 0;
    totalPoints += pts * c.credits;
    totalCredits += c.credits;
  });
  return totalCredits > 0 ? totalPoints / totalCredits : 0;
};

export const calculateCGPA = (semesters: Semester[]): number => {
  const allCourses = semesters.flatMap((s) => s.courses);
  return calculateGPA(allCourses);
};
