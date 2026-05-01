import { useState, FormEvent, useEffect } from "react";
import { X } from "lucide-react";
import { motion } from "framer-motion";
import { Note } from "@/lib/storage";
import { NOTE_CATEGORIES } from "@/lib/constants";

interface NoteModalProps {
  note: Note | null;
  onClose: () => void;
  onSubmit: (data: { title: string; content: string; category: string }) => void;
}

const NoteModal = ({ note, onClose, onSubmit }: NoteModalProps) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("general");
  const [error, setError] = useState("");

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setCategory(note.category);
    } else {
      setTitle("");
      setContent("");
      setCategory("general");
    }
    setError("");
  }, [note]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError("Title and content are required");
      return;
    }
    onSubmit({ title, content, category });
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
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">{note ? "Edit Note" : "New Note"}</h2>
          <button onClick={onClose} className="p-1 text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>
        {error && <div className="bg-destructive/10 text-destructive px-3 py-2 rounded-lg text-sm mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-group">
            <label className="form-label">Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="form-input" placeholder="Note title" />
          </div>
          <div className="form-group">
            <label className="form-label">Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="form-input">
              {NOTE_CATEGORIES.filter((c) => c !== "all").map((c) => (
                <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Content</label>
            <textarea value={content} onChange={(e) => setContent(e.target.value)} className="form-input min-h-[120px]" placeholder="Write your note..." />
          </div>
          <button type="submit" className="btn-primary w-full justify-center">
            {note ? "Update Note" : "Create Note"}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default NoteModal;
