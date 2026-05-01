import { Trash2, Clock, MapPin, User, Phone, Pencil } from "lucide-react";
import { motion } from "framer-motion";
import { ClassEntry } from "@/lib/storage";
import { getSubjectColor } from "@/lib/classUtils";

interface ClassCardProps {
  cls: ClassEntry;
  onDelete: (id: string) => void;
  onEdit: (cls: ClassEntry) => void;
}

const ClassCard = ({ cls, onDelete, onEdit }: ClassCardProps) => {
  const colorClass = getSubjectColor(cls.subject);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      className={`feature-card border-l-4 ${colorClass}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-lg">{cls.subject}</h3>
          <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {cls.startTime} - {cls.endTime}
            </span>
            {cls.room && (
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {cls.room}
              </span>
            )}
            {cls.instructor && (
              <span className="flex items-center gap-1">
                <User className="w-4 h-4" />
                {cls.instructor}
              </span>
            )}
            {cls.instructorPhone && (
              <span className="flex items-center gap-1">
                <Phone className="w-4 h-4" />
                <a href={`tel:${cls.instructorPhone}`} className="hover:text-primary transition-colors">
                  {cls.instructorPhone}
                </a>
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(cls)}
            className="p-1.5 text-muted-foreground hover:text-primary transition-colors"
            title="Edit"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(cls.id)}
            className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ClassCard;
