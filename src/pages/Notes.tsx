import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import PageLayout from "@/components/layout/PageLayout";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import { getNotes, createNote, updateNote, deleteNote, Note } from "@/lib/storage";
import { Plus, Filter } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { NOTE_CATEGORIES } from "@/lib/constants";
import NoteCard from "@/components/notes/NoteCard";
import NoteModal from "@/components/notes/NoteModal";

const NotesContent = () => {
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  useEffect(() => {
    if (user) setNotes(getNotes(user.id));
  }, [user]);

  const filtered = selectedCategory === "all" ? notes : notes.filter((n) => n.category === selectedCategory);

  const openCreate = () => { setEditingNote(null); setShowModal(true); };
  const openEdit = (note: Note) => { setEditingNote(note); setShowModal(true); };

  const handleSubmit = (data: { title: string; content: string; category: string }) => {
    if (!user) return;
    if (editingNote) {
      updateNote(editingNote.id, data);
    } else {
      createNote({ userId: user.id, ...data });
    }
    setNotes(getNotes(user.id));
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    if (!user) return;
    deleteNote(id);
    setNotes(getNotes(user.id));
  };

  return (
    <PageLayout>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">My Notes</h1>
          <p className="text-muted-foreground">{filtered.length} note{filtered.length !== 1 ? "s" : ""}</p>
        </div>
        <button onClick={openCreate} className="btn-primary">
          <Plus className="w-5 h-5" /> New Note
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <Filter className="w-5 h-5 text-muted-foreground mt-1" />
        {NOTE_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium capitalize transition-colors ${
              selectedCategory === cat
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-lg mb-2">No notes yet</p>
          <p className="text-sm">Create your first note to get started!</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((note) => (
            <NoteCard key={note.id} note={note} onEdit={openEdit} onDelete={handleDelete} />
          ))}
        </div>
      )}

      <AnimatePresence>
        {showModal && (
          <NoteModal
            note={editingNote}
            onClose={() => setShowModal(false)}
            onSubmit={handleSubmit}
          />
        )}
      </AnimatePresence>
    </PageLayout>
  );
};

const Notes = () => (
  <ProtectedRoute>
    <NotesContent />
  </ProtectedRoute>
);

export default Notes;
