// Note categories
export const NOTE_CATEGORIES = ["all", "general", "lecture", "homework", "exam", "project"] as const;

export const NOTE_CATEGORY_COLORS: Record<string, string> = {
  general: "bg-muted text-muted-foreground",
  lecture: "bg-primary/10 text-primary",
  homework: "bg-secondary/10 text-secondary",
  exam: "bg-destructive/10 text-destructive",
  project: "bg-accent/10 text-accent",
};

// Routine days
export const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"] as const;

export const DAY_LABELS: Record<string, string> = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
};

// Chatbot quick questions
export const QUICK_QUESTIONS = [
  "How do I calculate my CGPA?",
  "Give me some study tips",
  "How can I manage my time better?",
  "What features does this app have?",
  "How to stay motivated while studying?",
];

// Dashboard quick links
import { BookOpen, CheckSquare, Calendar, MessageCircle, Award } from "lucide-react";

export const DASHBOARD_LINKS = [
  { to: "/cgpa", label: "CGPA Calculator", icon: Award, colorClass: "text-primary bg-primary/10" },
  { to: "/notes", label: "Notes", icon: BookOpen, colorClass: "text-secondary bg-secondary/10" },
  { to: "/todos", label: "To-Do List", icon: CheckSquare, colorClass: "text-accent bg-accent/10" },
  { to: "/routine", label: "Class Routine", icon: Calendar, colorClass: "text-feature-pink bg-feature-pink/10" },
  { to: "/chatbot", label: "Study Chatbot", icon: MessageCircle, colorClass: "text-feature-amber bg-feature-amber/10" },
];
