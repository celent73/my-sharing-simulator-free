import { useState, useEffect } from 'react';
import { ActivityLog } from '../src_daily_check/types';
import { loadLogs } from '../src_daily_check/services/storageService';
import { calculateAggregateStats } from '../src_daily_check/utils/sessionUtils';
import { supabase } from '../src_daily_check/supabaseClient';

export const useDailyStats = () => {
    const [stats, setStats] = useState({
        contactToContractRate: 0,
        avgMonthlyContracts: 0,
        newFamilyUtilityTotal: 0,
        appointmentsTotal: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                const userId = session?.user?.id || null;

                const logs = await loadLogs(userId);
                const aggregateStats = calculateAggregateStats(logs);
                setStats(aggregateStats);
            } catch (error) {
                console.error("Error fetching daily stats for simulator:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();

        // Listener per aggiornamenti in tempo reale
        window.addEventListener('daily-check-updated', fetchStats);
        return () => window.removeEventListener('daily-check-updated', fetchStats);
    }, []);

    return { stats, loading };
};
