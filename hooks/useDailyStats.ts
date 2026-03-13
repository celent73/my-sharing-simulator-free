import { useState, useEffect } from 'react';
import { ActivityLog, AppSettings, ActivityType } from '../src_daily_check/types';
import { loadLogs, loadSettings } from '../src_daily_check/services/storageService';
import { calculateAggregateStats, calculateCommercialMonthProgress, CommercialMonthProgress } from '../src_daily_check/utils/sessionUtils';
import { supabase } from '../src_daily_check/supabaseClient';

export interface RecoveryStats {
    metric: ActivityType;
    current: number;
    target: number;
    isBehind: boolean;
    recoveryDaily: number;
    linearTarget: number;
}

export const useDailyStats = () => {
    const [stats, setStats] = useState<{
        contactToContractRate: number;
        avgMonthlyContracts: number;
        newFamilyUtilityTotal: number;
        appointmentsTotal: number;
        commercialMonthStats?: {
            contactToContractRate: number;
            avgMonthlyContracts: number;
            newFamilyUtilityTotal: number;
            appointmentsTotal: number;
        }
    }>({
        contactToContractRate: 0,
        avgMonthlyContracts: 0,
        newFamilyUtilityTotal: 0,
        appointmentsTotal: 0
    });
    const [commercialMonth, setCommercialMonth] = useState<CommercialMonthProgress | null>(null);
    const [recoveryStats, setRecoveryStats] = useState<RecoveryStats[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchStats = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const userId = session?.user?.id || null;

            const logs = await loadLogs(userId);
            const settings = await loadSettings(userId);
            
            const aggregateStats = calculateAggregateStats(logs, 30);
            
            const startDay = settings?.commercialMonthStartDay || 16;
            const progress = calculateCommercialMonthProgress(startDay);
            
            // Calcolo stats specifiche per il mese commerciale
            const commercialDiffDays = Math.max(1, Math.ceil((new Date().getTime() - progress.start.getTime()) / (1000 * 60 * 60 * 24)));
            const commercialMonthStats = calculateAggregateStats(logs, commercialDiffDays);

            setStats({
                ...aggregateStats,
                commercialMonthStats
            });

            setCommercialMonth(progress);

            if (settings?.goals?.monthly) {
                const monthlyGoals = settings.goals.monthly;
                
                // Calcoliamo i progressi attuali per il mese commerciale corrente
                const currentMonthLogs = logs.filter(log => {
                    const logDate = new Date(log.date);
                    return logDate >= progress.start && logDate <= new Date(); // Fino a oggi
                });

                const currentTotals: Record<string, number> = {};
                currentMonthLogs.forEach(log => {
                    Object.entries(log.counts).forEach(([type, count]) => {
                        currentTotals[type] = (currentTotals[type] || 0) + (count || 0);
                    });
                });

                const recovery: RecoveryStats[] = Object.entries(monthlyGoals).map(([type, target]) => {
                    const activityType = type as ActivityType;
                    const current = currentTotals[activityType] || 0;
                    const linearTarget = (target / progress.daysTotal) * progress.daysElapsed;
                    
                    return {
                        metric: activityType,
                        current,
                        target,
                        isBehind: current < linearTarget,
                        recoveryDaily: progress.recoveryDailyTarget(current, target),
                        linearTarget
                    };
                });

                setRecoveryStats(recovery);
            }
        } catch (error) {
            console.error("Error fetching daily stats for simulator:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();

        // Listener per aggiornamenti in tempo reale
        window.addEventListener('daily-check-updated', fetchStats);
        return () => window.removeEventListener('daily-check-updated', fetchStats);
    }, []);

    return { stats, commercialMonth, recoveryStats, loading, refresh: fetchStats };
};
