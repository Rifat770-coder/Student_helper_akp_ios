import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Smartphone, Download, Apple, MonitorSmartphone, ArrowRight, CheckCircle2, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  "Access all tools offline",
  "Native performance & smooth animations",
  "Push notifications for tasks & deadlines",
  "Quick launch from your home screen",
];

const DownloadPage = () => {
  const navigate = useNavigate();

  return (
    <div className="page-container">
      <Navbar />

      <div className="max-w-6xl mx-auto px-5 pt-4">
        <button
          onClick={() => navigate("/dashboard")}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden py-20 md:py-28 px-5">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6"
          >
            <Smartphone className="w-4 h-4" />
            Now Available on Mobile
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold leading-tight mb-6"
          >
            Student Helper in Your <span className="text-primary">Pocket</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
          >
            Download the Student Helper app and take your academic tools everywhere you go. Available for Android and iOS.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <a
              href="#"
              className="inline-flex items-center gap-3 px-6 py-4 rounded-xl bg-foreground text-background font-semibold text-lg hover:opacity-90 transition-opacity"
            >
              <svg viewBox="0 0 24 24" className="w-7 h-7 fill-current">
                <path d="M17.523 2.237a.625.625 0 0 0-.425.18L3.84 15.675a.625.625 0 0 0 .188 1.012l5.625 2.5a.625.625 0 0 0 .55-.05L22.14 3.162a.625.625 0 0 0-.3-1.137l-4.125-.775a.625.625 0 0 0-.192-.013ZM3.375 17.75a.625.625 0 0 0-.625.625v3.25a.625.625 0 0 0 .625.625h3.25a.625.625 0 0 0 .442-1.067L3.817 17.933a.625.625 0 0 0-.442-.183Z" />
              </svg>
              <div className="text-left">
                <div className="text-xs opacity-70">GET IT ON</div>
                <div>Google Play</div>
              </div>
            </a>

            <a
              href="#"
              className="inline-flex items-center gap-3 px-6 py-4 rounded-xl bg-foreground text-background font-semibold text-lg hover:opacity-90 transition-opacity"
            >
              <Apple className="w-7 h-7" />
              <div className="text-left">
                <div className="text-xs opacity-70">Download on the</div>
                <div>App Store</div>
              </div>
            </a>
          </motion.div>
        </div>

        <div className="absolute top-10 right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
      </section>

      {/* Why Download */}
      <section className="py-20 px-5 bg-muted/50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Why Download the App?
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-3 p-5 rounded-xl bg-card border border-border"
              >
                <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-foreground font-medium">{feature}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Device Preview */}
      <section className="py-20 px-5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Works on All Devices</h2>
          <p className="text-muted-foreground text-lg mb-12">
            Whether you use Android or iPhone, Student Helper works beautifully everywhere.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex flex-col items-center gap-3 p-8 rounded-2xl bg-muted/50 border border-border"
            >
              <Smartphone className="w-16 h-16 text-primary" />
              <span className="font-semibold text-lg">Android</span>
              <span className="text-sm text-muted-foreground">Android 8.0+</span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex flex-col items-center gap-3 p-8 rounded-2xl bg-muted/50 border border-border"
            >
              <Apple className="w-16 h-16 text-primary" />
              <span className="font-semibold text-lg">iOS</span>
              <span className="text-sm text-muted-foreground">iOS 14.0+</span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col items-center gap-3 p-8 rounded-2xl bg-muted/50 border border-border"
            >
              <MonitorSmartphone className="w-16 h-16 text-primary" />
              <span className="font-semibold text-lg">Web</span>
              <span className="text-sm text-muted-foreground">Any browser</span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-5 bg-primary/5">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Don't have the app yet?</h2>
          <p className="text-muted-foreground mb-8">
            You can also use Student Helper right here in your browser — no download required!
          </p>
          <Link to="/register" className="btn-primary text-lg !px-8 !py-4">
            Use Web Version <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <footer className="py-8 px-5 border-t border-border text-center">
        <p className="text-muted-foreground">Made with care for students everywhere</p>
        <p className="text-sm text-muted-foreground/60 mt-1">
          Student Helper - All rights reserved by{" "}
          <a target="_blank" href="https://www.linkedin.com/in/minhajul-islam-rifat-986992342/">
            Minhajul Islam Rifat
          </a>
        </p>
      </footer>
    </div>
  );
};

export default DownloadPage;
