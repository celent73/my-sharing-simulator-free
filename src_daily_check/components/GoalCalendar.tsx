import React, { useMemo } from 'react';
import { ActivityLog, ActivityType, Goals } from '../types';
import {
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    format,
    isToday
} from 'date-fns';

interface GoalCalendarProps {
    activityLogs: ActivityLog[];
    goals: Goals;
    onSelectDate: (date: Date) => void;
}

const GoalCalendar: React.FC<GoalCalendarProps> = ({ activityLogs, goals, onSelectDate }) => {
    const today = new Date();
    const monthStart = startOfMonth(today);
    const monthEnd = endOfMonth(today);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

    // Calculate achievement for each day
    const dayStats = useMemo(() => {
        const stats: Record<string, { status: 'green' | 'yellow' | 'gray', percent: number, hasAppointment: boolean }> = {};

        days.forEach(day => {
            const dateStr = format(day, 'yyyy-MM-dd');
            const log = activityLogs.find(l => l.date === dateStr);

            // Important: search across ALL logs for any lead scheduled for THIS date
            const isScheduledForDay = activityLogs?.some(l =>
                l.leads?.some(lead => lead.appointmentDate && lead.appointmentDate.startsWith(dateStr))
            ) || false;

            let goalsMet = 0;
            let totalGoals = 0;

            if (log) {
                Object.values(ActivityType).forEach(type => {
                    const goal = goals.daily[type as ActivityType] || 0;
                    if (goal > 0) {
                        totalGoals++;
                        if ((log.counts[type as ActivityType] || 0) >= goal) {
                            goalsMet++;
                        }
                    }
                });
            }

            // Also count appointments recorded exactly on this day
            const hasApptEntry = log?.leads?.some(l => l.type === ActivityType.APPOINTMENTS) || false;
            const hasAppt = isScheduledForDay || hasApptEntry;

            if (totalGoals === 0) {
                stats[dateStr] = { status: 'gray', percent: 0, hasAppointment: hasAppt };
            } else if (goalsMet === totalGoals) {
                stats[dateStr] = { status: 'green', percent: 100, hasAppointment: hasAppt };
            } else if (goalsMet > 0) {
                stats[dateStr] = { status: 'yellow', percent: (goalsMet / totalGoals) * 100, hasAppointment: hasAppt };
            } else {
                stats[dateStr] = { status: 'gray', percent: 0, hasAppointment: hasAppt };
            }
        });

        return stats;
    }, [activityLogs, goals, days]);

    const firstDayIndex = (monthStart.getDay() + 6) % 7; // Monday start
    const blanks = Array(firstDayIndex).fill(null);

    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-6 lg:p-8 shadow-xl w-full max-w-5xl mx-auto mb-8">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight">Calendario Produttività</h3>
                <div className="flex gap-4 text-[10px] font-bold uppercase tracking-widest">
                    <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Obiettivi OK</div>
                    <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Parziale</div>
                </div>
            </div>

            <div className="grid grid-cols-7 mb-4">
                {['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'].map(d => (
                    <div key={d} className="text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">{d}</div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-2 sm:gap-4">
                {blanks.map((_, i) => <div key={`blank-${i}`} />)}
                {days.map(day => {
                    const dateStr = format(day, 'yyyy-MM-dd');
                    const stats = dayStats[dateStr];
                    const isCurrentDay = isToday(day);

                    return (
                        <button
                            key={dateStr}
                            onClick={() => onSelectDate(day)}
                            className={`
                                aspect-square rounded-2xl flex flex-col items-center justify-center gap-1 transition-all hover:scale-105 active:scale-95 border-2
                                ${isCurrentDay ? 'border-blue-500 shadow-lg shadow-blue-500/10' : 'border-transparent'}
                                ${stats.status === 'green' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400' : ''}
                                ${stats.status === 'yellow' ? 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400' : ''}
                                ${stats.status === 'gray' ? 'bg-slate-50 text-slate-400 dark:bg-slate-800/50' : ''}
                            `}
                        >
                            <span className="text-sm sm:text-lg font-black leading-none">{format(day, 'd')}</span>
                            <div className="flex gap-0.5">
                                {isCurrentDay && <span className="text-[7px] font-black uppercase text-blue-500">Oggi</span>}
                                {stats.hasAppointment && <span className="text-[10px]" title="Appuntamento programmato">📅</span>}
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default GoalCalendar;
