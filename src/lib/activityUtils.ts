// Activity and Streak Tracking

interface ActivityData {
  userId: string;
  lastActiveDate: string;
  streak: number;
  longestStreak: number;
  activityDates: string[]; // Array of dates when user was active
}

const ACTIVITY_KEY = "ss_activity";

const getStore = (): ActivityData[] => {
  try {
    return JSON.parse(localStorage.getItem(ACTIVITY_KEY) || "[]");
  } catch {
    return [];
  }
};

const setStore = (data: ActivityData[]) => {
  localStorage.setItem(ACTIVITY_KEY, JSON.stringify(data));
};

// Get today's date in YYYY-MM-DD format
const getTodayString = (): string => {
  return new Date().toISOString().split("T")[0];
};

// Get yesterday's date in YYYY-MM-DD format
const getYesterdayString = (): string => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday.toISOString().split("T")[0];
};

// Record user activity for today
export const recordActivity = (userId: string): void => {
  const all = getStore();
  const idx = all.findIndex((a) => a.userId === userId);
  const today = getTodayString();
  const yesterday = getYesterdayString();

  if (idx >= 0) {
    const activity = all[idx];
    
    // Check if already recorded today
    if (activity.activityDates.includes(today)) {
      return; // Already recorded
    }

    // Add today to activity dates
    activity.activityDates.push(today);

    // Update streak
    if (activity.lastActiveDate === yesterday) {
      // Continuing streak
      activity.streak += 1;
      if (activity.streak > activity.longestStreak) {
        activity.longestStreak = activity.streak;
      }
    } else if (activity.lastActiveDate === today) {
      // Same day, no change
    } else {
      // Streak broken, reset to 1
      activity.streak = 1;
    }

    activity.lastActiveDate = today;
    all[idx] = activity;
  } else {
    // New user
    all.push({
      userId,
      lastActiveDate: today,
      streak: 1,
      longestStreak: 1,
      activityDates: [today],
    });
  }

  setStore(all);
};

// Get user's activity data
export const getActivityData = (userId: string): ActivityData | null => {
  const all = getStore();
  const found = all.find((a) => a.userId === userId);
  
  if (!found) return null;

  // Check if streak is still valid
  const today = getTodayString();
  const yesterday = getYesterdayString();
  
  if (found.lastActiveDate !== today && found.lastActiveDate !== yesterday) {
    // Streak broken
    found.streak = 0;
  }

  return found;
};

// Get total active days
export const getTotalActiveDays = (userId: string): number => {
  const activity = getActivityData(userId);
  return activity ? activity.activityDates.length : 0;
};
