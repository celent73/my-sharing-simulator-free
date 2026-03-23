import { ActivityLog, ActivityType, Goals } from '../types';



export const calculateAggregateStats = (logs: ActivityLog[], days: number = 30): {
    contactToContractRate: number;
    avgMonthlyContracts: number;
    newFamilyUtilityTotal: number;
    appointmentsTotal: number;
} => {
    if (!logs || logs.length === 0) {
        return { contactToContractRate: 0, avgMonthlyContracts: 0, newFamilyUtilityTotal: 0, appointmentsTotal: 0 };
    }

    // Prendiamo i log dell'intervallo specificato (es. 30 giorni) per una media recente
    const filterDate = new Date();
    filterDate.setDate(filterDate.getDate() - days);
    const recentLogs = logs.filter(log => new Date(log.date) >= filterDate);

    let totalContacts = 0;
    let totalContracts = 0;
    let newFamilyUtilityTotal = 0;
    let appointmentsTotal = 0;

    recentLogs.forEach(log => {
        if (!log || !log.counts) return;
        totalContacts += log.counts[ActivityType.CONTACTS] || 0;
        totalContracts += log.counts[ActivityType.NEW_CONTRACTS] || 0;
        newFamilyUtilityTotal += log.counts[ActivityType.NEW_FAMILY_UTILITY] || 0;
        appointmentsTotal += log.counts[ActivityType.APPOINTMENTS] || 0;
    });

    const contactToContractRate = totalContacts > 0 ? (totalContracts / totalContacts) : 0;

    // Per la media mensile, usiamo tutti i log divisi per il numero di mesi unici
    const uniqueMonths = new Set(logs.map(log => log.date.substring(0, 7)));
    const totalAllContracts = logs.reduce((sum, log) => sum + (log?.counts?.[ActivityType.NEW_CONTRACTS] || 0), 0);
    const avgMonthlyContracts = uniqueMonths.size > 0 ? Math.round(totalAllContracts / uniqueMonths.size) : totalAllContracts;

    return {
        contactToContractRate,
        avgMonthlyContracts,
        newFamilyUtilityTotal,
        appointmentsTotal
    };
};

export interface CommercialMonthProgress {
    start: Date;
    end: Date;
    daysTotal: number;
    daysElapsed: number;
    daysRemaining: number;
    progressPercentage: number; // Linear time progress
    isBehind: (current: number, target: number) => boolean;
    recoveryDailyTarget: (current: number, target: number) => number;
}

export const calculateCommercialMonthProgress = (startDay: number = 16): CommercialMonthProgress => {
    const today = new Date();
    let start = new Date(today.getFullYear(), today.getMonth(), startDay);
    
    // Se oggi è prima del giorno di inizio, il mese commerciale è iniziato nel mese precedente
    if (today.getDate() < startDay) {
        start.setMonth(start.getMonth() - 1);
    }
    
    let end = new Date(start.getFullYear(), start.getMonth() + 1, startDay - 1);
    
    const daysTotal = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const daysElapsed = Math.ceil((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    const daysRemaining = Math.max(0, daysTotal - daysElapsed);
    const progressPercentage = (daysElapsed / daysTotal) * 100;

    return {
        start,
        end,
        daysTotal,
        daysElapsed,
        daysRemaining,
        progressPercentage,
        isBehind: (current: number, target: number) => {
            const linearTarget = (target / daysTotal) * daysElapsed;
            return current < linearTarget;
        },
        recoveryDailyTarget: (current: number, target: number) => {
            if (daysRemaining <= 0) return 0;
            const gap = Math.max(0, target - current);
            return gap / daysRemaining;
        }
    };
};
