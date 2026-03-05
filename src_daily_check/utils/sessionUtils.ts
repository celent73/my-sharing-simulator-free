import { ActivityLog, ActivityType, Goals } from '../types';

export interface SessionStats {
    efficiencyScore: number;
    conversionRates: {
        contactToAppointment: number;
        appointmentToContract: number;
    };
    proTip: string;
    totalActions: number;
}

const ACTIVITY_WEIGHTS: Record<string, number> = {
    [ActivityType.CONTACTS]: 1,
    [ActivityType.VIDEOS_SENT]: 1,
    [ActivityType.APPOINTMENTS]: 3,
    [ActivityType.NEW_CONTRACTS]: 5,
    [ActivityType.NEW_FAMILY_UTILITY]: 2,
};

export const calculateDailySessionStats = (todayLog: ActivityLog | undefined, goals: Goals): SessionStats => {
    if (!todayLog) {
        return {
            efficiencyScore: 0,
            conversionRates: { contactToAppointment: 0, appointmentToContract: 0 },
            proTip: "Inizia la tua giornata aggiungendo la prima attività!",
            totalActions: 0
        };
    }

    const counts = todayLog.counts;
    let totalWeightedProgress = 0;
    let totalWeights = 0;
    let totalActions = 0;

    Object.entries(ACTIVITY_WEIGHTS).forEach(([activity, weight]) => {
        const type = activity as ActivityType;
        const current = counts[type] || 0;
        const target = goals.daily[type] || 5; // Default target if not set

        totalActions += current;
        totalWeights += weight;
        totalWeightedProgress += Math.min(100, (current / target) * 100) * weight;
    });

    const efficiencyScore = Math.round(totalWeightedProgress / totalWeights);

    // Conversion Rates
    const contacts = counts[ActivityType.CONTACTS] || 0;
    const appointments = counts[ActivityType.APPOINTMENTS] || 0;
    const contracts = counts[ActivityType.NEW_CONTRACTS] || 0;

    const contactToAppointment = contacts > 0 ? Math.round((appointments / contacts) * 100) : 0;
    const appointmentToContract = appointments > 0 ? Math.round((contracts / appointments) * 100) : 0;

    // Pro Tips
    let proTip = "Ottimo lavoro oggi! Costanza è la chiave del successo.";
    if (contactToAppointment < 20 && contacts > 5) {
        proTip = "Il tuo tasso di conversione in appuntamenti è basso. Prova a perfezionare il tuo script di contatto.";
    } else if (appointmentToContract < 30 && appointments > 2) {
        proTip = "Fai molti appuntamenti ma pochi contratti. Forse devi lavorare sulla fase di chiusura.";
    } else if (totalActions < 5) {
        proTip = "La giornata è stata un po' scarica. Ricorda: i grandi risultati nascono da piccole azioni quotidiane.";
    } else if (efficiencyScore > 90) {
        proTip = "Sei una macchina! Oggi hai superato te stesso. Mantieni questo ritmo!";
    }

    return {
        efficiencyScore,
        conversionRates: {
            contactToAppointment,
            appointmentToContract
        },
        proTip,
        totalActions
    };
};

export const calculateAggregateStats = (logs: ActivityLog[]): { contactToContractRate: number; avgMonthlyContracts: number } => {
    if (!logs || logs.length === 0) {
        return { contactToContractRate: 0, avgMonthlyContracts: 0 };
    }

    // Prendiamo i log degli ultimi 30 giorni per una media recente
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentLogs = logs.filter(log => new Date(log.date) >= thirtyDaysAgo);

    let totalContacts = 0;
    let totalContracts = 0;

    recentLogs.forEach(log => {
        totalContacts += log.counts[ActivityType.CONTACTS] || 0;
        totalContracts += log.counts[ActivityType.NEW_CONTRACTS] || 0;
    });

    const contactToContractRate = totalContacts > 0 ? (totalContracts / totalContacts) : 0;

    // Per la media mensile, usiamo tutti i log divisi per il numero di mesi unici
    const uniqueMonths = new Set(logs.map(log => log.date.substring(0, 7)));
    const totalAllContracts = logs.reduce((sum, log) => sum + (log.counts[ActivityType.NEW_CONTRACTS] || 0), 0);
    const avgMonthlyContracts = uniqueMonths.size > 0 ? Math.round(totalAllContracts / uniqueMonths.size) : totalAllContracts;

    return {
        contactToContractRate,
        avgMonthlyContracts
    };
};
