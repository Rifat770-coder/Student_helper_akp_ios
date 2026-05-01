import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import { Award, BookOpen, CheckSquare, Calendar, MessageCircle, ArrowRight, Smartphone } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Award,
    title: "CGPA Calculator",
    description:
      "Track your grades and calculate your GPA easily. Add courses, enter credits and grades, and get your CGPA instantly.",
    link: "/cgpa",
    colorClass: "text-primary bg-primary/10",
  },
  {
    icon: BookOpen,
    title: "Notes Saver",
    description:
      "Save and organize your study notes. Create, edit, and categorize notes for different subjects and topics.",
    link: "/notes",
    colorClass: "text-secondary bg-secondary/10",
  },
  {
    icon: CheckSquare,
    title: "To-Do List",
    description:
      "Stay organized with task management. Add tasks with priorities and due dates, and track your progress.",
    link: "/todos",
    colorClass: "text-accent bg-accent/10",
  },
  {
    icon: Calendar,
    title: "Class Routine",
    description:
      "Manage your weekly class schedule. Add classes with times, rooms, and instructors for easy reference.",
    link: "/routine",
    colorClass: "text-feature-pink bg-feature-pink/10",
  },
  {
    icon: MessageCircle,
    title: "Study Chatbot",
    description: "Get instant help and study tips. Ask questions about the app features or get study advice.",
    link: "/chatbot",
    colorClass: "text-feature-amber bg-feature-amber/10",
  },
];

const benefits = [
  "Simple and intuitive interface",
  "All your academic tools in one place",
  "Free to use - no hidden costs",
  "Works on any device",
  "Your data stays private and secure",
];

const Index = () => {
  const { user, loading } = useAuth();

  return (
    <div className="page-container">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32 px-5">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-bold leading-tight mb-6"
          >
            Your Academic <span className="text-primary">Success</span> Starts Here
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
          >
            Student Sphere is your all-in-one companion for managing academic life. Track grades, save notes, manage
            tasks, and stay organized effortlessly.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            {loading ? (
              <div className="spinner" />
            ) : user ? (
              <Link to="/dashboard" className="btn-primary text-lg !px-8 !py-4">
                Go to Dashboard <ArrowRight className="w-5 h-5" />
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn-primary text-lg !px-8 !py-4">
                  Get Started Free <ArrowRight className="w-5 h-5" />
                </Link>
                <Link to="/login" className="btn-outline text-lg !px-8 !py-4">
                  Sign In
                </Link>
              </>
            )}
          </motion.div>
        </div>

        {/* Decorative circles */}
        <div className="absolute top-10 right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/3 rounded-full blur-3xl" />
      </section>

      {/* Features Section */}
      <section className="py-20 px-5 bg-muted/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-3">Everything You Need to Succeed</h2>
          <p className="text-center text-muted-foreground mb-12 text-lg">
            Powerful tools designed specifically for students
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Link to={user ? feature.link : "/login"} className="feature-card block group">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${feature.colorClass}`}>
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{feature.description}</p>
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-primary group-hover:gap-2 transition-all">
                    Learn more <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-5">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">Why Students Love Us</h2>
          <ul className="space-y-4 mb-8">
            {benefits.map((b, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-3 text-lg"
              >
                <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                  <CheckSquare className="w-3.5 h-3.5 text-accent" />
                </div>
                {b}
              </motion.li>
            ))}
          </ul>
          {!user && !loading && (
            <Link to="/register" className="btn-accent text-lg">
              Join Now - It's Free!
            </Link>
          )}
        </div>
      </section>

      {/* Download App Banner */}
      <section className="py-12 px-5 bg-primary/5">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center gap-6">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Smartphone className="w-7 h-7 text-primary" />
          </div>
          <div className="text-center sm:text-left flex-1">
            <h3 className="text-xl font-bold mb-1">Get the Mobile App</h3>
            <p className="text-muted-foreground text-sm">Download Student Helper on your phone for the best experience.</p>
          </div>
          <Link to="/download" className="btn-primary !px-6 !py-3 flex-shrink-0">
            Download App <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-5 border-t border-border text-center">
        <p className="text-muted-foreground">Made with care for students everywhere</p>
        <p className="text-sm text-muted-foreground/60 mt-1">
          Student Helper - All rights reserved by{" "}
<a target="_blank" href="https://www.linkedin.com/in/minhajul-islam-rifat-986992342/" className="font-semibold text-primary hover:underline">
            Minhajul Islam Rifat
          </a>
        </p>
      </footer>
    </div>
  );
};

export default Index;
