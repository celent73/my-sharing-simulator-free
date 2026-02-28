import { useCallback } from 'react';
import { PlanInput, CondoInput, ViewMode, SavedScenario } from '../types';
import { useSmartState } from './useSmartState';

const STORAGE_KEY = 'sharing_simulator_scenarios_v1';

export const useScenarios = () => {
    const { state: scenarios, set: setScenarios, sync } = useSmartState<SavedScenario[]>([], STORAGE_KEY);

    const saveScenario = useCallback((name: string, data: PlanInput, viewMode: ViewMode, condoData?: CondoInput) => {
        const newScenario: SavedScenario = {
            id: crypto.randomUUID(),
            name: name.trim() || `Scenario ${new Date().toLocaleDateString()}`,
            createdAt: Date.now(),
            data,
            condoData,
            viewMode
        };

        setScenarios(prev => [newScenario, ...prev]);
        return newScenario;
    }, [setScenarios]);

    const deleteScenario = useCallback((id: string) => {
        setScenarios(prev => prev.filter(s => s.id !== id));
    }, [setScenarios]);

    const updateScenario = useCallback((id: string, newName: string) => {
        setScenarios(prev => prev.map(s =>
            s.id === id ? { ...s, name: newName } : s
        ));
    }, [setScenarios]);

    return {
        scenarios,
        saveScenario,
        deleteScenario,
        updateScenario,
        sync
    };
};
