import { ActivityLog, Goals, HabitStack, ActivityType } from '../types';

// ─────────────────────────────────────────────
// SCORE GIORNALIERO (0-100)
// 70% obiettivi + 30% habit stack
// ─────────────────────────────────────────────
export const calculateDailyScore = (
  log: ActivityLog | undefined,
  goals: Goals,
  habitStacks: HabitStack[],
  todayStr: string
): number => {
  const counts = log?.counts || {};

  // --- Goal ratio (70%) ---
  const dailyGoals = goals?.daily || {};
  const goalActivities = (Object.entries(dailyGoals) as [ActivityType, number][])
    .filter(([, target]) => target > 0);

  let goalRatio = 0;
  if (goalActivities.length > 0) {
    const totalRatio = goalActivities.reduce((sum, [activity, target]) => {
      const actual = counts[activity] || 0;
      return sum + Math.min(actual / target, 1);
    }, 0);
    goalRatio = totalRatio / goalActivities.length;
  } else {
    // No goals set → don't penalize, give full credit to habit part
    goalRatio = 1;
  }

  // --- Habit ratio (30%) ---
  let habitRatio = 0;
  const activeStacks = habitStacks.filter(s => s.time); // only stacks with reminders
  if (activeStacks.length > 0) {
    const completedToday = activeStacks.filter(s => s.lastCompletedDate === todayStr).length;
    habitRatio = completedToday / activeStacks.length;
  } else {
    // No habit stacks → give full credit to goal part
    habitRatio = 1;
  }

  // Weights
  const hasGoals = goalActivities.length > 0;
  const hasHabits = activeStacks.length > 0;

  let score: number;
  if (hasGoals && hasHabits) {
    score = (goalRatio * 0.7 + habitRatio * 0.3) * 100;
  } else if (hasGoals) {
    score = goalRatio * 100;
  } else if (hasHabits) {
    score = habitRatio * 100;
  } else {
    // Nothing configured yet
    score = 0;
  }

  return Math.round(Math.min(score, 100));
};

// ─────────────────────────────────────────────
// STREAK DI COERENZA
// Conta i giorni consecutivi con score ≥ 50
// ─────────────────────────────────────────────
export const calculateCoachStreak = (
  logs: ActivityLog[],
  goals: Goals,
  habitStacks: HabitStack[]
): number => {
  if (!logs || logs.length === 0) return 0;

  const getLocalDateStr = (dateStr: string) => {
    const d = new Date(dateStr);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  const today = new Date();
  const todayStr = getLocalDateStr(today.toISOString());

  // Build a map of date → score
  const scoreMap: Record<string, number> = {};
  logs.forEach(log => {
    const dateStr = getLocalDateStr(log.date);
    scoreMap[dateStr] = calculateDailyScore(log, goals, habitStacks, dateStr);
  });

  let streak = 0;
  let cursor = new Date(today);

  while (true) {
    const cursorStr = getLocalDateStr(cursor.toISOString());
    const score = scoreMap[cursorStr];

    // Allow today to be missing (day not over yet) OR have score ≥ 50
    if (cursorStr === todayStr) {
      // Don't break streak for today even if score is 0 (day is in progress)
      cursor.setDate(cursor.getDate() - 1);
      if (score !== undefined && score >= 50) streak++;
      continue;
    }

    if (score === undefined || score < 50) break;

    streak++;
    cursor.setDate(cursor.getDate() - 1);

    // Safety limit
    if (streak > 365) break;
  }

  return streak;
};

// ─────────────────────────────────────────────
// LABEL DEL COACH
// ─────────────────────────────────────────────
export const getScoreLabel = (score: number): { emoji: string; label: string; color: string } => {
  if (score >= 90) return { emoji: '🏆', label: 'Perfetto!', color: '#10b981' };
  if (score >= 75) return { emoji: '🔥', label: 'In fuoco!', color: '#f59e0b' };
  if (score >= 50) return { emoji: '💪', label: 'Buon lavoro', color: '#3b82f6' };
  if (score >= 25) return { emoji: '😤', label: 'Puoi fare di più!', color: '#f97316' };
  if (score > 0)  return { emoji: '⚠️', label: 'Giornata bassa', color: '#ef4444' };
  return { emoji: '😴', label: 'Inizia ora!', color: '#8b5cf6' };
};
