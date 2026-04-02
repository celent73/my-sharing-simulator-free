import { ActivityLog, ActivityType, Lead } from '../types';
import { differenceInDays, subDays, startOfWeek, endOfWeek, isWithinInterval } from 'date-fns';

export interface PerformanceTrend {
    count: number;
    previousCount: number;
    percentChange: number;
    velocity: 'up' | 'down' | 'stable';
}

export interface EliteStats {
    weeklyTrend: PerformanceTrend;
    conversionRate: number;
    hotLeads: Lead[];
    bottleneck: string;
}

/**
 * Calculates velocity trend for a specific activity type comparing current week to last week.
 */
export const calculateVelocityTrend = (logs: ActivityLog[], activity: ActivityType): PerformanceTrend => {
    const now = new Date();
    const currentWeek = {
        start: startOfWeek(now, { weekStartsOn: 1 }),
        end: endOfWeek(now, { weekStartsOn: 1 })
    };
    const lastWeek = {
        start: startOfWeek(subDays(now, 7), { weekStartsOn: 1 }),
        end: endOfWeek(subDays(now, 7), { weekStartsOn: 1 })
    };

    const currentCount = logs
        .filter(l => isWithinInterval(new Date(l.date), currentWeek))
        .reduce((sum, l) => sum + (l.counts[activity] || 0), 0);

    const lastCount = logs
        .filter(l => isWithinInterval(new Date(l.date), lastWeek))
        .reduce((sum, l) => sum + (l.counts[activity] || 0), 0);

    let percentChange = 0;
    if (lastCount > 0) {
        percentChange = ((currentCount - lastCount) / lastCount) * 100;
    } else if (currentCount > 0) {
        percentChange = 100;
    }

    let velocity: 'up' | 'down' | 'stable' = 'stable';
    if (percentChange > 5) velocity = 'up';
    if (percentChange < -5) velocity = 'down';

    return {
        count: currentCount,
        previousCount: lastCount,
        percentChange: Math.round(percentChange),
        velocity
    };
};

/**
 * Identifies high-priority "Hot Leads" (warm/hot temperature, pending, >48h since creation/last update).
 */
export const getHotLeads = (logs: ActivityLog[], limit: number = 3): Lead[] => {
    const allLeads: Lead[] = [];
    logs.forEach(log => {
        if (log.leads) allLeads.push(...log.leads);
    });

    const now = new Date();
    
    return allLeads
        .filter(l => {
            // Only pending leads
            if (l.status !== 'pending') return false;
            
            // Only Warm or Hot
            const temp = (l as any).temperature || 'tiepido';
            if (temp === 'freddo') return false;

            // Wait at least 24h to avoid nagging immediately
            const lastUpdate = l.updatedAt ? new Date(l.updatedAt) : new Date(l.date);
            const daysSinceUpdate = differenceInDays(now, lastUpdate);
            
            return daysSinceUpdate >= 1; 
        })
        .sort((a, b) => {
            // Hot first, then Warm
            const tempA = (a as any).temperature === 'caldo' ? 2 : 1;
            const tempB = (b as any).temperature === 'caldo' ? 2 : 1;
            if (tempA !== tempB) return tempB - tempA;
            
            // Oldest first within temperature group
            const dateA = a.updatedAt ? new Date(a.updatedAt) : new Date(a.date);
            const dateB = b.updatedAt ? new Date(b.updatedAt) : new Date(b.date);
            return dateA.getTime() - dateB.getTime();
        })
        .slice(0, limit);
};

/**
 * Identifies the funnel bottleneck based on conversion ratios.
 */
export const identifyBottleneck = (logs: ActivityLog[]): string => {
    const totals = {
        contacts: 0,
        videos: 0,
        appointments: 0,
        won: 0
    };

    logs.forEach(log => {
        totals.contacts += log.counts[ActivityType.CONTACTS] || 0;
        totals.videos += log.counts[ActivityType.VIDEOS_SENT] || 0;
        totals.appointments += log.counts[ActivityType.APPOINTMENTS] || 0;
        totals.won += (log.counts[ActivityType.NEW_CONTRACTS] || 0) + (log.counts[ActivityType.NEW_FAMILY_UTILITY] || 0);
    });

    if (totals.contacts === 0) return "Inizia a creare contatti!";
    
    const ratios = {
        contactToVideo: totals.videos / totals.contacts,
        videoToAppt: totals.appointments / (totals.videos || 1),
        apptToWin: totals.won / (totals.appointments || 1)
    };

    if (ratios.contactToVideo < 0.3) return "Invia più video informativi dopo i contatti.";
    if (ratios.videoToAppt < 0.2) return "Lavora sulla chiusura dell'appuntamento dopo il video.";
    if (ratios.apptToWin < 0.3) return "Affina la presentazione per aumentare le chiusure.";

    return "Mantieni questo ritmo, la tua pipeline è equilibrata!";
};
