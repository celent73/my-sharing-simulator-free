import { ActivityLog, ActivityType } from '../types';
import {
  addDays,
  startOfMonth,
  endOfMonth,
  format,
  startOfWeek,
  endOfWeek,
  lastDayOfMonth,
  subDays,
  differenceInDays,
  getDaysInMonth,
  startOfYear,
  endOfYear,
  getDay
} from 'date-fns';
import { it } from 'date-fns/locale';

export const formatItalianDate = (date: Date): string => {
  return format(date, 'd MMMM yyyy', { locale: it });
};

export const getTodayDateString = (): string => {
  return format(new Date(), 'yyyy-MM-dd');
};

export const getWeekIdentifier = (date: Date): string => {
  const start = startOfWeek(date, { weekStartsOn: 1 }); // Monday
  const end = endOfWeek(date, { weekStartsOn: 1 });
  return `${format(start, 'yyyy-MM-dd')}-${format(end, 'yyyy-MM-dd')}`;
};

export const getMonthIdentifier = (date: Date): string => {
  return format(date, 'yyyy-MM');
};

export const getPreviousWeekIdentifier = (date: Date): string => {
  const prevWeek = subDays(date, 7);
  return getWeekIdentifier(prevWeek);
}

export const getWeekProgress = (date: Date): number => {
  const start = startOfWeek(date, { weekStartsOn: 1 });
  const end = endOfWeek(date, { weekStartsOn: 1 });
  const totalDays = differenceInDays(end, start) + 1;
  const daysPassed = differenceInDays(date, start) + 1;
  return Math.min(100, Math.max(0, (daysPassed / totalDays) * 100));
};

export const getMonthProgress = (date: Date): number => {
  const start = startOfMonth(date);
  const end = endOfMonth(date);
  const totalDays = differenceInDays(end, start) + 1;
  const daysPassed = differenceInDays(date, start) + 1;
  return Math.min(100, Math.max(0, (daysPassed / totalDays) * 100));
};

export const getYearProgress = (date: Date): number => {
  const start = startOfYear(date);
  const end = endOfYear(date);
  const totalDays = differenceInDays(end, start) + 1;
  const daysPassed = differenceInDays(date, start) + 1;
  return Math.min(100, Math.max(0, (daysPassed / totalDays) * 100));
};

export const getCommercialMonthRange = (date: Date, commercialStartDay: number): { start: Date, end: Date } => {
  const currentMonth = date.getMonth();
  const currentYear = date.getFullYear();

  const start = new Date(currentYear, currentMonth, commercialStartDay);
  start.setHours(0, 0, 0, 0);

  if (date.getDate() < commercialStartDay) {
    start.setMonth(currentMonth - 1);
  }

  // Commercial month ends on the day before the next month's start day
  const end = new Date(start.getFullYear(), start.getMonth() + 1, commercialStartDay);
  end.setHours(0, 0, 0, 0);
  end.setDate(end.getDate() - 1);
  end.setHours(23, 59, 59, 999);

  if (commercialStartDay === 1) {
    const monthStart = startOfMonth(date);
    const monthEnd = endOfMonth(date);
    return { start: monthStart, end: monthEnd };
  }

  return { start, end };
};


export const getCommercialMonthString = (date: Date, commercialStartDay: number): string => {
  const { start, end } = getCommercialMonthRange(date, commercialStartDay);
  return `${format(start, 'd MMM', { locale: it })} - ${format(end, 'd MMM', { locale: it })}`;
};

export const getDaysUntilCommercialMonthEnd = (date: Date, commercialStartDay: number): number => {
  const { end } = getCommercialMonthRange(date, commercialStartDay);
  const now = new Date(date);
  now.setHours(0, 0, 0, 0);
  const endDate = new Date(end);
  endDate.setHours(0, 0, 0, 0);
  return differenceInDays(endDate, now);
};

export const getCommercialMonthProgress = (date: Date, commercialStartDay: number): number => {
  const { start, end } = getCommercialMonthRange(date, commercialStartDay);
  const totalDays = differenceInDays(end, start) + 1;
  const daysPassed = differenceInDays(date, start);
  return Math.min(100, Math.max(0, (daysPassed / totalDays) * 100));
};

export const calculateProgressForActivity = (logs: ActivityLog[], activity: ActivityType, commercialStartDay: number): { daily: number, weekly: number, monthly: number } => {
  const now = new Date();

  // Daily
  const today = getTodayDateString();
  const todayLog = logs.find(l => l.date === today);
  const daily = todayLog?.counts[activity] || 0;

  // Weekly
  const currentWeekId = getWeekIdentifier(now);
  const weekly = logs
    .filter(l => getWeekIdentifier(new Date(l.date)) === currentWeekId)
    .reduce((sum, l) => sum + (l.counts[activity] || 0), 0);

  // Monthly (Commercial)
  const { start, end } = getCommercialMonthRange(now, commercialStartDay);
  const monthly = logs
    .filter(l => {
      const d = new Date(l.date);
      d.setHours(0, 0, 0, 0);
      return d.getTime() >= start.getTime() && d.getTime() <= end.getTime();
    })
    .reduce((sum, l) => sum + (l.counts[activity] || 0), 0);

  return { daily, weekly, monthly };
};

export const calculateSimpleProgress = (current: number, target: number): number => {
  if (!target || target <= 0) return 0;
  return Math.min(100, Math.max(0, (current / target) * 100));
};
