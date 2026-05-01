import { User, Zap } from "lucide-react";
import { motion } from "framer-motion";

interface ChatMessageProps {
  role: "user" | "bot";
  content: string;
}

const ChatMessage = ({ role, content }: ChatMessageProps) => (
  <motion.div
    initial={{ opacity: 0, y: 5 }}
    animate={{ opacity: 1, y: 0 }}
    className={`flex gap-3 ${role === "user" ? "flex-row-reverse" : ""}`}
  >
    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
      role === "user" ? "bg-primary/10 text-primary" : "bg-secondary/10 text-secondary"
    }`}>
      {role === "user" ? <User className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
    </div>
    <div className={`max-w-[85%] sm:max-w-[80%] px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-sm whitespace-pre-wrap ${
      role === "user"
        ? "bg-primary text-primary-foreground rounded-tr-sm"
        : "bg-muted text-foreground rounded-tl-sm"
    }`}>
      {content}
    </div>
  </motion.div>
);

export default ChatMessage;
