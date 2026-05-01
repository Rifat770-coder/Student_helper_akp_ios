import { useState } from "react";
import { Target, Edit2, Check, X } from "lucide-react";

interface TargetCGPAProps {
  currentCGPA: number;
  targetCGPA?: number;
  onSaveTarget: (target: number) => void;
}

const TargetCGPA = ({ currentCGPA, targetCGPA, onSaveTarget }: TargetCGPAProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(targetCGPA?.toString() || "");

  const handleSave = () => {
    const value = parseFloat(inputValue);
    if (value >= 0 && value <= 4.0) {
      onSaveTarget(value);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setInputValue(targetCGPA?.toString() || "");
    setIsEditing(false);
  };

  const difference = targetCGPA ? targetCGPA - currentCGPA : 0;
  const percentageToTarget = targetCGPA ? (currentCGPA / targetCGPA) * 100 : 0;

  return (
    <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-lg">Target CGPA</h3>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="p-1.5 text-muted-foreground hover:text-primary transition-colors"
            title="Set Target"
          >
            <Edit2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="form-input flex-1"
              placeholder="Enter target CGPA (0-4.0)"
              min="0"
              max="4.0"
              step="0.01"
              autoFocus
            />
            <button
              onClick={handleSave}
              className="p-2 bg-accent text-accent-foreground rounded-lg hover:opacity-90 transition-opacity"
              title="Save"
            >
              <Check className="w-5 h-5" />
            </button>
            <button
              onClick={handleCancel}
              className="p-2 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition-colors"
              title="Cancel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      ) : targetCGPA ? (
        <div className="space-y-4">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Target</p>
              <p className="text-3xl font-bold text-primary">{targetCGPA.toFixed(2)}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Current</p>
              <p className="text-3xl font-bold">{currentCGPA.toFixed(2)}</p>
            </div>
          </div>

          {/* Progress bar */}
          <div>
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Progress</span>
              <span>{Math.min(percentageToTarget, 100).toFixed(0)}%</span>
            </div>
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  percentageToTarget >= 100 ? "bg-accent" : "bg-primary"
                }`}
                style={{ width: `${Math.min(percentageToTarget, 100)}%` }}
              />
            </div>
          </div>

          {/* Status message */}
          <div className={`p-3 rounded-lg ${
            difference > 0 ? "bg-primary/10 text-primary" : 
            difference < 0 ? "bg-accent/10 text-accent" : 
            "bg-muted text-muted-foreground"
          }`}>
            {difference > 0 ? (
              <p className="text-sm">
                📈 You need <strong>{difference.toFixed(2)}</strong> more points to reach your target
              </p>
            ) : difference < 0 ? (
              <p className="text-sm">
                🎉 Congratulations! You've exceeded your target by <strong>{Math.abs(difference).toFixed(2)}</strong> points
              </p>
            ) : (
              <p className="text-sm">
                🎯 Perfect! You've reached your target CGPA
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <p className="text-sm">No target set</p>
          <button
            onClick={() => setIsEditing(true)}
            className="mt-2 text-primary hover:underline text-sm"
          >
            Set a target CGPA
          </button>
        </div>
      )}
    </div>
  );
};

export default TargetCGPA;
