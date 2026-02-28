import { useMemo } from 'react';
import { PlanInput, LevelData, CompensationPlanResult, MonthlyGrowthData, ViewMode } from '../types';

// --- CONFIGURAZIONE TARIFFE UNA TANTUM (Differenziate 1° vs Extra) ---
const BONUS_RATES: { [key: number]: { first: number, extra: number } } = {
    0: { first: 50, extra: 7.5 },   // Livello 0 (Tu/Diretti): 50€ il primo, 7.5€ i successivi
    1: { first: 15, extra: 2.5 },   // Livello 1: 15€ il primo, 2.5€ i successivi
    2: { first: 5, extra: 1.5 },    // Livello 2: 5€ il primo, 1.5€ i successivi
    3: { first: 3, extra: 1.25 },   // Livello 3: 3€ il primo, 1.25€ i successivi
    4: { first: 2.5, extra: 1.25 }, // Livello 4: 2.5€ il primo, 1.25€ i successivi
    5: { first: 2.5, extra: 1.25 }, // Livello 5: 2.5€ il primo, 1.25€ i successivi
};

const DEFAULT_RATE = { first: 0, extra: 0 };

// --- CONFIGURAZIONE RICORRENZE (Moltiplicatori Annuali) ---
const RECURRING_RATES_PER_YEAR = {
    1: 1.0,
    2: 1.5,
    3: 2.0,
};

// Valori Bonus Una Tantum per Clienti Personali
const PERSONAL_CLIENT_BONUS = {
    GREEN: 50,
    LIGHT: 25,
    BUSINESS_GREEN: 100,
    BUSINESS_LIGHT: 50,
    MY_GREEN: 50,
    MY_LIGHT: 25
};

// Valori Base Ricorrente (Anno 1) per Clienti Personali
const PERSONAL_RECURRING_BASE = {
    GREEN: 1.0,
    LIGHT: 0.5,
    BUSINESS_GREEN: 2.0,
    BUSINESS_LIGHT: 1.0,
    MY_GREEN: 1.0,
    MY_LIGHT: 0.5
};

export const useCompensationPlan = (inputs: PlanInput, viewMode: ViewMode = 'family'): CompensationPlanResult => {
    return useMemo(() => {
        const {
            directRecruits,
            contractsPerUser,
            indirectRecruits,
            networkDepth,
            realizationTimeMonths,
            personalClientsGreen = 0,
            personalClientsLight = 0,
            personalClientsBusinessGreen = 0,
            personalClientsBusinessLight = 0,
            myPersonalUnitsGreen = 0,
            myPersonalUnitsLight = 0,
            cashbackSpending = 0,
            cashbackPercentage = 0,
            unionParkPanels = 0,
            unionParkPun = 0.20
        } = inputs;

        // Helper per calcolare il bonus una tantum complesso
        const calculateBonus = (levelIndex: number, usersCount: number, contractsAvg: number) => {
            if (usersCount <= 0 || contractsAvg <= 0) return 0;

            const rates = BONUS_RATES[levelIndex] || DEFAULT_RATE;

            // 1. Guadagno sul Primo contratto di tutti gli utenti
            const firstContractEarnings = usersCount * rates.first;

            // 2. Guadagno sui contratti Extra (dal 2° in poi)
            const extraContractsCount = Math.max(0, contractsAvg - 1);
            const extraContractEarnings = (usersCount * extraContractsCount) * rates.extra;

            return firstContractEarnings + extraContractEarnings;
        };

        // Helper per calcolare la ricorrenza (Base x Contratti x Utenti)
        // 1° Contratto: 1.00 € (Base)
        // Contratti successivi: 0.50 € (Base)
        const calculateRecurringBase = (levelIndex: number, usersCount: number, contractsAvg: number) => {
            if (usersCount <= 0 || contractsAvg <= 0) return 0;

            const baseFirst = 1.00;
            const baseExtra = 0.50;

            if (contractsAvg < 1) {
                return usersCount * (contractsAvg * baseFirst);
            }

            const extraContracts = contractsAvg - 1;
            const recurringPerUser = baseFirst + (extraContracts * baseExtra);

            return usersCount * recurringPerUser;
        };

        // --- 1. Calcolo Struttura Rete ---
        const levelData: LevelData[] = [];
        let cumulativeUsers = 0;

        // Livello 0 (Diretti)
        const level0Users = directRecruits;
        if (level0Users > 0) {
            cumulativeUsers += level0Users;

            const oneTimeBonus = calculateBonus(0, level0Users, contractsPerUser);
            const recurringBase = calculateRecurringBase(0, level0Users, contractsPerUser);

            levelData.push({
                level: 0,
                users: level0Users,
                oneTimeBonus,
                recurringYear1: recurringBase * RECURRING_RATES_PER_YEAR[1],
                recurringYear2: recurringBase * RECURRING_RATES_PER_YEAR[2],
                recurringYear3: recurringBase * RECURRING_RATES_PER_YEAR[3],
            });
        }

        // Livelli Indiretti (1 a N)
        let previousLevelUsers = level0Users;
        for (let i = 1; i <= networkDepth; i++) {
            if (previousLevelUsers === 0 || indirectRecruits === 0) break;
            const currentLevelUsers = Math.floor(previousLevelUsers * indirectRecruits); // Aggiunto floor per interi
            cumulativeUsers += currentLevelUsers;

            const oneTimeBonus = calculateBonus(i, currentLevelUsers, contractsPerUser);
            const recurringBase = calculateRecurringBase(i, currentLevelUsers, contractsPerUser);

            levelData.push({
                level: i,
                users: currentLevelUsers,
                oneTimeBonus,
                recurringYear1: recurringBase * RECURRING_RATES_PER_YEAR[1],
                recurringYear2: recurringBase * RECURRING_RATES_PER_YEAR[2],
                recurringYear3: recurringBase * RECURRING_RATES_PER_YEAR[3],
            });
            previousLevelUsers = currentLevelUsers;
        }

        let totalOneTimeBonus = levelData.reduce((sum, level) => sum + level.oneTimeBonus, 0);

        // --- AGGIUNTA BONUS CLIENTI PERSONALI + MIE UTENZE (UNA TANTUM) ---
        const residentialOneTime = (personalClientsGreen * PERSONAL_CLIENT_BONUS.GREEN) + (personalClientsLight * PERSONAL_CLIENT_BONUS.LIGHT);
        const businessOneTime = (personalClientsBusinessGreen * PERSONAL_CLIENT_BONUS.BUSINESS_GREEN) + (personalClientsBusinessLight * PERSONAL_CLIENT_BONUS.BUSINESS_LIGHT);
        const myUnitsOneTime = (myPersonalUnitsGreen * PERSONAL_CLIENT_BONUS.MY_GREEN) + (myPersonalUnitsLight * PERSONAL_CLIENT_BONUS.MY_LIGHT);

        // One-time bonus on panels only applies in non-client modes
        const unionParkOneTime = viewMode !== 'client' ? (unionParkPanels || 0) * 50 : 0;

        totalOneTimeBonus += (residentialOneTime + businessOneTime + myUnitsOneTime + unionParkOneTime);

        // --- AGGIUNTA CASHBACK ---
        const monthlyCashback = cashbackSpending * (cashbackPercentage / 100);
        totalOneTimeBonus += monthlyCashback;

        // --- CALCOLO TOTALI RICORRENZA RETE ---
        let totalRecurringYear1 = levelData.reduce((sum, level) => sum + level.recurringYear1, 0);
        let totalRecurringYear2 = levelData.reduce((sum, level) => sum + level.recurringYear2, 0);
        let totalRecurringYear3 = levelData.reduce((sum, level) => sum + level.recurringYear3, 0);

        // --- AGGIUNTA BONUS CLIENTI PERSONALI + MIE UTENZE (RICORRENZA) ---
        const personalBaseRecurring =
            (personalClientsGreen * PERSONAL_RECURRING_BASE.GREEN) +
            (personalClientsLight * PERSONAL_RECURRING_BASE.LIGHT) +
            (personalClientsBusinessGreen * PERSONAL_RECURRING_BASE.BUSINESS_GREEN) +
            (personalClientsBusinessLight * PERSONAL_RECURRING_BASE.BUSINESS_LIGHT) +
            (myPersonalUnitsGreen * PERSONAL_RECURRING_BASE.MY_GREEN) +
            (myPersonalUnitsLight * PERSONAL_RECURRING_BASE.MY_LIGHT);

        // Calculate panel yield (Monthly User Benefit)
        const monthlyPanelYield = (unionParkPanels || 0) * (unionParkPun || 0.20) * 33.4;

        // Calculate promoter recurring bonus from panel sale (Monthly)
        // Formula: Production (33.4) * Num Panels * (0.12 - 0.09)
        const panelSaleRecurringBonus = (unionParkPanels || 0) * 33.4 * (0.12 - 0.09);

        totalRecurringYear1 += (personalBaseRecurring * RECURRING_RATES_PER_YEAR[1]) + monthlyPanelYield + panelSaleRecurringBonus;
        totalRecurringYear2 += (personalBaseRecurring * RECURRING_RATES_PER_YEAR[2]) + monthlyPanelYield + panelSaleRecurringBonus;
        totalRecurringYear3 += (personalBaseRecurring * RECURRING_RATES_PER_YEAR[3]) + monthlyPanelYield + panelSaleRecurringBonus;

        // Conteggio totale contratti
        const personalContractsCount = personalClientsGreen + personalClientsLight + personalClientsBusinessGreen + personalClientsBusinessLight + myPersonalUnitsGreen + myPersonalUnitsLight;
        const totalContracts = (cumulativeUsers * contractsPerUser) + personalContractsCount;

        // --- 2. Dati crescita mensile (ESPONENZIALE) ---
        const monthlyData: MonthlyGrowthData[] = [];

        const hasAnyActivity = cumulativeUsers > 0 || personalContractsCount > 0 || monthlyCashback > 0 || (unionParkPanels || 0) > 0;

        if (realizationTimeMonths > 0 && hasAnyActivity) {
            // Logica Crescita
            const targetRecurring = totalRecurringYear1;
            const targetOneTime = totalOneTimeBonus;
            const baseStartRatio = 0.05;

            for (let month = 1; month <= realizationTimeMonths; month++) {
                const t = month / realizationTimeMonths;
                const growthFactor = Math.pow(t, 1.5);

                const currentCumulativeOneTime = targetOneTime * growthFactor;
                const currentMonthlyRecurring = targetRecurring * growthFactor;

                const prevCumulativeOneTime = month === 1 ? 0 : monthlyData[month - 2].cumulativeOneTimeBonus;
                const prevCumulativeRecurring = month === 1 ? 0 : monthlyData[month - 2].cumulativeRecurring;

                const monthlyOneTimeFlow = currentCumulativeOneTime - prevCumulativeOneTime;
                const monthlyRecurringFlow = currentMonthlyRecurring;
                const monthlyTotalCheck = monthlyOneTimeFlow + monthlyRecurringFlow;
                const totalCashInPocket = prevCumulativeRecurring + monthlyTotalCheck;

                monthlyData.push({
                    month,
                    users: Math.floor(cumulativeUsers * growthFactor),
                    monthlyOneTimeBonus: parseFloat(monthlyOneTimeFlow.toFixed(2)),
                    monthlyRecurring: parseFloat(monthlyRecurringFlow.toFixed(2)),
                    monthlyTotalEarnings: parseFloat(monthlyTotalCheck.toFixed(2)),
                    cumulativeOneTimeBonus: parseFloat(currentCumulativeOneTime.toFixed(2)),
                    cumulativeRecurring: parseFloat((prevCumulativeRecurring + monthlyRecurringFlow).toFixed(2)),
                    cumulativeEarnings: parseFloat(totalCashInPocket.toFixed(2))
                });
            }
        }

        return {
            levelData,
            levels: levelData,
            totalUsers: cumulativeUsers,
            totalContracts,
            totalOneTimeBonus: parseFloat(totalOneTimeBonus.toFixed(2)),
            totalRecurringYear1: parseFloat(totalRecurringYear1.toFixed(2)),
            totalRecurringYear2: parseFloat(totalRecurringYear2.toFixed(2)),
            totalRecurringYear3: parseFloat(totalRecurringYear3.toFixed(2)),
            monthlyCashback: parseFloat(monthlyCashback.toFixed(2)),
            monthlyData
        };
    }, [inputs, viewMode]);
};