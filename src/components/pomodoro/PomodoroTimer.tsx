import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, Coffee, BookOpen } from "lucide-react";

const PomodoroTimer = () => {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<"work" | "break">("work");
  const [workDuration, setWorkDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            // Timer finished
            handleTimerComplete();
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);
    } else if (!isActive && interval) {
      clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, minutes, seconds]);

  const handleTimerComplete = () => {
    setIsActive(false);
    playSound();
    
    // Switch mode
    if (mode === "work") {
      setMode("break");
      setMinutes(breakDuration);
      setSeconds(0);
    } else {
      setMode("work");
      setMinutes(workDuration);
      setSeconds(0);
    }
  };

  const playSound = () => {
    // Create a simple beep sound using Web Audio API
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = "sine";
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setMinutes(mode === "work" ? workDuration : breakDuration);
    setSeconds(0);
  };

  const switchMode = (newMode: "work" | "break") => {
    setIsActive(false);
    setMode(newMode);
    setMinutes(newMode === "work" ? workDuration : breakDuration);
    setSeconds(0);
  };

  const formatTime = (mins: number, secs: number): string => {
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const progress = mode === "work"
    ? ((workDuration * 60 - (minutes * 60 + seconds)) / (workDuration * 60)) * 100
    : ((breakDuration * 60 - (minutes * 60 + seconds)) / (breakDuration * 60)) * 100;

  return (
    <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
      <h3 className="font-semibold text-lg mb-4 text-center">Pomodoro Timer</h3>

      {/* Mode Toggle */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => switchMode("work")}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
            mode === "work"
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Work
        </button>
        <button
          onClick={() => switchMode("break")}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
            mode === "break"
              ? "bg-accent text-accent-foreground"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          <Coffee className="w-4 h-4" />
          Break
        </button>
      </div>

      {/* Timer Display */}
      <div className="relative mb-6">
        {/* Progress Circle */}
        <svg className="w-full h-48" viewBox="0 0 200 200">
          <circle
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-muted"
          />
          <circle
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
            className={mode === "work" ? "text-primary" : "text-accent"}
            strokeDasharray={`${2 * Math.PI * 90}`}
            strokeDashoffset={`${2 * Math.PI * 90 * (1 - progress / 100)}`}
            transform="rotate(-90 100 100)"
            style={{ transition: "stroke-dashoffset 1s linear" }}
          />
        </svg>
        
        {/* Time Text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="text-5xl font-bold">{formatTime(minutes, seconds)}</p>
            <p className="text-sm text-muted-foreground mt-2 capitalize">{mode} Session</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-2 justify-center mb-4">
        <button
          onClick={toggleTimer}
          className={`p-4 rounded-full transition-colors ${
            isActive
              ? "bg-destructive/10 text-destructive hover:bg-destructive/20"
              : "bg-primary text-primary-foreground hover:opacity-90"
          }`}
        >
          {isActive ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
        </button>
        <button
          onClick={resetTimer}
          className="p-4 rounded-full bg-muted text-muted-foreground hover:bg-muted/80 transition-colors"
        >
          <RotateCcw className="w-6 h-6" />
        </button>
      </div>

      {/* Duration Settings */}
      <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border">
        <div>
          <label className="text-xs text-muted-foreground block mb-1">Work (min)</label>
          <input
            type="number"
            value={workDuration}
            onChange={(e) => {
              const val = parseInt(e.target.value) || 1;
              setWorkDuration(val);
              if (mode === "work" && !isActive) {
                setMinutes(val);
                setSeconds(0);
              }
            }}
            className="form-input !py-1 !px-2 text-sm w-full"
            min="1"
            max="60"
            disabled={isActive}
          />
        </div>
        <div>
          <label className="text-xs text-muted-foreground block mb-1">Break (min)</label>
          <input
            type="number"
            value={breakDuration}
            onChange={(e) => {
              const val = parseInt(e.target.value) || 1;
              setBreakDuration(val);
              if (mode === "break" && !isActive) {
                setMinutes(val);
                setSeconds(0);
              }
            }}
            className="form-input !py-1 !px-2 text-sm w-full"
            min="1"
            max="30"
            disabled={isActive}
          />
        </div>
      </div>
    </div>
  );
};

export default PomodoroTimer;
