import { useState, useEffect } from 'react';

// Simplified types for the hook
interface HabitStack {
    id: string;
    trigger: string;
    action: string;
    time: string;
    targetCount: number;
    lastCompletedDate?: string;
    snoozedUntil?: number;
}

interface AppSettings {
    enableHabitStacking?: boolean;
    habitStacks?: HabitStack[];
}

export const usePendingHabitStacks = () => {
    const [hasPending, setHasPending] = useState(false);

    useEffect(() => {
        const checkPending = () => {
            try {
                const settingsStr = localStorage.getItem('daily-check-app-settings');
                if (!settingsStr) return;
                
                const settings: AppSettings = JSON.parse(settingsStr);
                if (!settings.enableHabitStacking || !settings.habitStacks?.length) {
                    setHasPending(false);
                    return;
                }

                const now = new Date();
                const todayStr = now.toISOString().split('T')[0]; // Simple YYYY-MM-DD

                const isAnyPending = settings.habitStacks.some(stack => {
                    if (!stack.time) return false;
                    
                    // Already done today?
                    if (stack.lastCompletedDate === todayStr) return false;

                    // Snoozed for now?
                    if (stack.snoozedUntil && stack.snoozedUntil > now.getTime()) return false;

                    // Time reached?
                    const [hours, minutes] = stack.time.split(':').map(Number);
                    const stackTime = new Date();
                    stackTime.setHours(hours, minutes, 0, 0);

                    return now.getTime() >= stackTime.getTime();
                });

                setHasPending(isAnyPending);
            } catch (e) {
                console.error("Error in usePendingHabitStacks:", e);
                setHasPending(false);
            }
        };

        // Check on mount and then every minute
        checkPending();
        const interval = setInterval(checkPending, 60000);
        
        // Also listen for storage changes (even in same window if we trigger it)
        window.addEventListener('storage', checkPending);
        window.addEventListener('habit-stacks-updated', checkPending);

        return () => {
            clearInterval(interval);
            window.removeEventListener('storage', checkPending);
            window.removeEventListener('habit-stacks-updated', checkPending);
        };
    }, []);

    return hasPending;
};
