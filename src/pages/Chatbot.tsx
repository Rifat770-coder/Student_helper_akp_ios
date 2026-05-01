import { useState, useEffect, useRef, FormEvent } from "react";
import { useAuth } from "@/contexts/AuthContext";
import PageLayout from "@/components/layout/PageLayout";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import { Send } from "lucide-react";
import { QUICK_QUESTIONS } from "@/lib/constants";
import { generateResponse } from "@/lib/chatbot-responses";
import ChatMessage from "@/components/chatbot/ChatMessage";

interface Message {
  id: string;
  role: "user" | "bot";
  content: string;
}

const ChatbotContent = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    { id: "welcome", role: "bot", content: "Hi there! 👋 I'm your Study Assistant. Ask me anything about studying, using this app, or getting academic advice!" },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (text?: string) => {
    const msg = text || input.trim();
    if (!msg) return;
    const userMsg: Message = { id: crypto.randomUUID(), role: "user", content: msg };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    setTimeout(() => {
      const botMsg: Message = { id: crypto.randomUUID(), role: "bot", content: generateResponse(msg) };
      setMessages((prev) => [...prev, botMsg]);
    }, 500);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleSend();
  };

  return (
    <PageLayout maxWidth="max-w-3xl">
      <h1 className="text-3xl font-bold mb-2">Study Chatbot</h1>
      <p className="text-muted-foreground mb-6">Your AI-powered study assistant</p>

      <div className="flex flex-wrap gap-2 mb-4">
        {QUICK_QUESTIONS.map((q, i) => (
          <button
            key={i}
            onClick={() => handleSend(q)}
            className="px-3 py-1.5 bg-muted text-muted-foreground rounded-full text-xs font-medium hover:bg-primary/10 hover:text-primary transition-colors"
          >
            {q}
          </button>
        ))}
      </div>

      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="h-[50vh] sm:h-[400px] overflow-y-auto p-3 sm:p-4 space-y-4">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} role={msg.role} content={msg.content} />
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="border-t border-border p-3 flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="form-input flex-1 !py-2.5"
            placeholder="Ask me anything..."
          />
          <button type="submit" className="btn-primary !px-4">
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </PageLayout>
  );
};

const Chatbot = () => (
  <ProtectedRoute>
    <ChatbotContent />
  </ProtectedRoute>
);

export default Chatbot;
