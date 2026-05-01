import { Edit2, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { Note } from "@/lib/storage";
import { NOTE_CATEGORY_COLORS } from "@/lib/constants";

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
}

const NoteCard = ({ note, onEdit, onDelete }: NoteCardProps) => (
  <motion.div
    layout
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="feature-card"
  >
    <div className="flex items-start justify-between mb-3">
      <span className={`category-badge ${NOTE_CATEGORY_COLORS[note.category] || NOTE_CATEGORY_COLORS.general}`}>
        {note.category}
      </span>
      <div className="flex gap-1">
        <button onClick={() => onEdit(note)} className="p-1.5 text-muted-foreground hover:text-primary transition-colors">
          <Edit2 className="w-4 h-4" />
        </button>
        <button onClick={() => onDelete(note.id)} className="p-1.5 text-muted-foreground hover:text-destructive transition-colors">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
    <h3 className="font-semibold mb-2 line-clamp-1">{note.title}</h3>
    <p className="text-sm text-muted-foreground line-clamp-3">{note.content}</p>
    <p className="text-xs text-muted-foreground/60 mt-3">
      {new Date(note.updatedAt).toLocaleDateString()}
    </p>
  </motion.div>
);

export default NoteCard;
