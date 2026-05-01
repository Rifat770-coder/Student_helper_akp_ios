export const generateResponse = (input: string): string => {
  const lower = input.toLowerCase();

  if (lower.includes("cgpa") || lower.includes("gpa") || lower.includes("grade")) {
    return "To calculate your CGPA, go to the CGPA Calculator page. Add semesters, then add courses with credits and letter grades. The app automatically calculates your GPA per semester and your cumulative CGPA on a 4.0 scale.";
  }
  if (lower.includes("note")) {
    return "The Notes feature lets you create, edit, and organize study notes. You can categorize them as lecture, homework, exam, or project notes, and filter by category to find what you need quickly.";
  }
  if (lower.includes("todo") || lower.includes("task")) {
    return "The To-Do List helps you stay organized! Add tasks with priority levels (high, medium, low) and due dates. Mark them as complete when done, and filter to see pending or completed tasks.";
  }
  if (lower.includes("routine") || lower.includes("schedule") || lower.includes("class")) {
    return "Use the Class Routine feature to manage your weekly schedule. Add classes with subject, time, room, and instructor details. View your schedule organized by day of the week.";
  }
  if (lower.includes("feature") || lower.includes("what can")) {
    return "Student Helper offers 5 key features: 📊 CGPA Calculator for tracking grades, 📝 Notes Saver for organizing study notes, ✅ To-Do List for task management, 📅 Class Routine for weekly schedules, and 💬 this Study Chatbot for quick help!";
  }
  if (lower.includes("study tip") || lower.includes("study advice")) {
    return "Here are some effective study tips:\n\n1. 📚 Use the Pomodoro Technique (25 min study, 5 min break)\n2. 📝 Take active notes - don't just read passively\n3. 🔄 Review material within 24 hours of learning it\n4. 🎯 Set specific, achievable goals for each study session\n5. 😴 Get enough sleep - it's crucial for memory consolidation";
  }
  if (lower.includes("motivat")) {
    return "Staying motivated can be tough! Try these strategies:\n\n🎯 Break big goals into smaller, achievable tasks\n🏆 Reward yourself after completing difficult work\n👥 Study with friends for accountability\n📱 Use this app to track your progress\n💪 Remember why you started - visualize your success!";
  }
  if (lower.includes("time") || lower.includes("manage")) {
    return "Great question about time management! Here's what works:\n\n⏰ Use the To-Do list to prioritize tasks\n📅 Check your Class Routine daily\n📊 Set deadlines and stick to them\n🚫 Minimize distractions during study time\n✅ Do the hardest tasks when you have the most energy";
  }
  if (lower.includes("hello") || lower.includes("hi") || lower.includes("hey")) {
    return "Hello! 👋 I'm your Study Assistant. I can help you with:\n\n• Using app features (CGPA, Notes, Todos, Routine)\n• Study tips and strategies\n• Time management advice\n• Motivation and productivity\n\nWhat would you like to know?";
  }

  return "That's a great question! While I'm a simple assistant, I can help with:\n\n📊 CGPA Calculator usage\n📝 Notes & study organization\n✅ Task management tips\n📅 Schedule planning\n💡 Study tips & motivation\n\nTry asking about any of these topics!";
};
