import { useState, useEffect } from "react";
import { WifiOff } from "lucide-react";
import { isOnline, addNetworkListener } from "@/lib/networkUtils";
import { motion, AnimatePresence } from "framer-motion";

const OfflineBanner = () => {
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    // Check initial status
    isOnline().then((online) => setOffline(!online));

    // Listen for changes
    const removeListener = addNetworkListener((connected) => {
      setOffline(!connected);
    });

    return removeListener;
  }, []);

  return (
    <AnimatePresence>
      {offline && (
        <motion.div
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -60, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed top-16 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none"
        >
          <div className="flex items-center gap-3 bg-destructive text-destructive-foreground px-5 py-3 rounded-xl shadow-lg pointer-events-auto">
            <WifiOff className="w-5 h-5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-sm">You're offline</p>
              <p className="text-xs opacity-90">Please turn on your WiFi or mobile data</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OfflineBanner;
