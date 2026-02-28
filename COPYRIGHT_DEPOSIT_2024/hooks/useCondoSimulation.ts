
import { useMemo } from 'react';
import { CondoInput, CondoSimulationResult, CompensationPlanResult } from '../types';

const RATES = {
    GREEN: {
        OT: 100,
        REC_Y1: 5.0,
        REC_Y2: 7.5,
        REC_Y3: 10.0
    },
    LIGHT: {
        OT: 50,
        REC_Y1: 2.5,
        REC_Y2: 3.75,
        REC_Y3: 5.0
    }
};

export const useCondoSimulation = (inputs: CondoInput, mainNetworkResults?: CompensationPlanResult): CondoSimulationResult => {
    return useMemo(() => {
        const {
            greenUnits,
            lightUnits,
            yearlyNewUnitsGreen,
            yearlyNewUnitsLight,
            managedCondos = 0,
            familiesPerCondo = 0,
            networkConversionRate = 0,
            showFamilyUtilityView = false,
            includeMainNetworkEarnings = false
        } = inputs;

        // --- RECRUITER (FAMILY UTILITY) OFFICIAL RATES (Updated) ---
        const RECRUITER_RATES = {
            GREEN_OT: 30,
            GREEN_REC: { Y1: 3, Y2: 4, Y3: 6 },
            LIGHT_OT: 15, // Ipotizzato metà
            LIGHT_REC: { Y1: 1.5, Y2: 2, Y3: 3 }, // Ipotizzato metà

            // Network conversion uses standard Level 1 rates (from useSimulation)
            LEVEL_1_OT_PER_USER: 15 + 2.5, // 1 Green + 1 Light = 17.50€
            LEVEL_1_REC_PER_USER: 1.0 + 0.5 // 1 Green + 1 Light = 1.50€ (Base Anno 1)
        };

        // --- NETWORK OPPORTUNITY CALCULATION ---
        const totalPotentialFamilies = (greenUnits + lightUnits) * (familiesPerCondo || 0);
        const newNetworkUsers = Math.floor(totalPotentialFamilies * ((networkConversionRate || 0) / 100));

        let net_OneTime = 0;
        let net_RecY1 = 0;
        let net_RecY2 = 0;
        let net_RecY3 = 0;

        // Recruiter network earnings (from condo families)
        let recruiter_net_OT = 0;
        let recruiter_net_Rec_Base = 0;

        if (newNetworkUsers > 0) {
            // Admin (Level 0)
            const perUser_OT = 50 + 7.5; // 57.50€
            const perUser_Rec_Base = 1.00 + 0.50; // 1.50€

            net_OneTime = newNetworkUsers * perUser_OT;
            const baseRecTotal = newNetworkUsers * perUser_Rec_Base;
            net_RecY1 = baseRecTotal * 1.0;
            net_RecY2 = baseRecTotal * 1.5;
            net_RecY3 = baseRecTotal * 2.0;

            // Recruiter (Level 1)
            recruiter_net_OT = newNetworkUsers * RECRUITER_RATES.LEVEL_1_OT_PER_USER;
            recruiter_net_Rec_Base = newNetworkUsers * RECRUITER_RATES.LEVEL_1_REC_PER_USER;
        }

        const networkStats = {
            usersCount: newNetworkUsers,
            oneTimeBonus: net_OneTime,
            recurringYear1: net_RecY1,
            recurringYear2: net_RecY2,
            recurringYear3: net_RecY3,
            totalAnnualYear1: net_OneTime + (net_RecY1 * 12),
            totalAnnualYear2: (net_RecY2 * 12),
            totalAnnualYear3: (net_RecY3 * 12)
        };

        // --- YEAR 1 ---
        const y1_Green = greenUnits;
        const y1_Light = lightUnits;
        const y1_OT = (y1_Green * RATES.GREEN.OT) + (y1_Light * RATES.LIGHT.OT);
        const y1_RecMonthly = (y1_Green * RATES.GREEN.REC_Y1) + (y1_Light * RATES.LIGHT.REC_Y1);
        const y1_TotalAnnual = y1_OT + (y1_RecMonthly * 12) + networkStats.totalAnnualYear1;
        const y1_ActiveUnits = y1_Green + y1_Light;

        // Recruiter Y1 (Condo Meters part)
        let recruiter_y1_OT_Condo = (y1_Green * RECRUITER_RATES.GREEN_OT) + (y1_Light * RECRUITER_RATES.LIGHT_OT);
        let recruiter_y1_Rec_Annual_Condo = ((y1_Green * RECRUITER_RATES.GREEN_REC.Y1 + y1_Light * RECRUITER_RATES.LIGHT_REC.Y1) * 12);

        let recruiter_y1_OT_Network = recruiter_net_OT;
        let recruiter_y1_Rec_Annual_Network = (recruiter_net_Rec_Base * 12);

        // --- YEAR 2 ---
        const y2_NewGreen = yearlyNewUnitsGreen;
        const y2_NewLight = yearlyNewUnitsLight;
        const y2_New_OT = (y2_NewGreen * RATES.GREEN.OT) + (y2_NewLight * RATES.LIGHT.OT);
        const y2_New_Rec = (y2_NewGreen * RATES.GREEN.REC_Y1) + (y2_NewLight * RATES.LIGHT.REC_Y1);
        const y2_Old_Rec = (y1_Green * RATES.GREEN.REC_Y2) + (y1_Light * RATES.LIGHT.REC_Y2);
        const y2_RecMonthly = y2_New_Rec + y2_Old_Rec + networkStats.recurringYear2;
        const y2_TotalAnnual = y2_New_OT + ((y2_New_Rec + y2_Old_Rec) * 12) + networkStats.totalAnnualYear2;
        const y2_ActiveUnits = y1_ActiveUnits + y2_NewGreen + y2_NewLight;

        // Recruiter Y2 (Condo Meters part)
        let recruiter_y2_OT_Condo = (y2_NewGreen * RECRUITER_RATES.GREEN_OT) + (y2_NewLight * RECRUITER_RATES.LIGHT_OT);
        const recruiter_y2_New_Rec_Condo = (y2_NewGreen * RECRUITER_RATES.GREEN_REC.Y1) + (y2_NewLight * RECRUITER_RATES.LIGHT_REC.Y1);
        const recruiter_y2_Old_Rec_Condo = (y1_Green * RECRUITER_RATES.GREEN_REC.Y2) + (y1_Light * RECRUITER_RATES.LIGHT_REC.Y2);
        let recruiter_y2_Rec_Annual_Condo = ((recruiter_y2_New_Rec_Condo + recruiter_y2_Old_Rec_Condo) * 12);

        let recruiter_y2_OT_Network = 0; // Assuming no new conversions in Y2 for condo families simplified model
        let recruiter_y2_Rec_Annual_Network = (recruiter_net_Rec_Base * 1.5 * 12);

        // --- YEAR 3 ---
        const y3_NewGreen = yearlyNewUnitsGreen;
        const y3_NewLight = yearlyNewUnitsLight;
        const y3_New_OT = (y3_NewGreen * RATES.GREEN.OT) + (y3_NewLight * RATES.LIGHT.OT);
        const y3_New_Rec = (y3_NewGreen * RATES.GREEN.REC_Y1) + (y3_NewLight * RATES.LIGHT.REC_Y1);
        const y3_Mid_Rec = (y2_NewGreen * RATES.GREEN.REC_Y2) + (y2_NewLight * RATES.LIGHT.REC_Y2);
        const y3_Old_Rec = (y1_Green * RATES.GREEN.REC_Y3) + (y1_Light * RATES.LIGHT.REC_Y3);
        const y3_RecMonthly = y3_New_Rec + y3_Mid_Rec + y3_Old_Rec + networkStats.recurringYear3;
        const y3_TotalAnnual = y3_New_OT + ((y3_New_Rec + y3_Mid_Rec + y3_Old_Rec) * 12) + networkStats.totalAnnualYear3;
        const y3_ActiveUnits = y2_ActiveUnits + y3_NewGreen + y3_NewLight;

        // Recruiter Y3 (Condo Meters part)
        let recruiter_y3_OT_Condo = (y3_NewGreen * RECRUITER_RATES.GREEN_OT) + (y3_NewLight * RECRUITER_RATES.LIGHT_OT);
        const recruiter_y3_New_Rec_Condo = (y3_NewGreen * RECRUITER_RATES.GREEN_REC.Y1) + (y3_NewLight * RECRUITER_RATES.LIGHT_REC.Y1);
        const recruiter_y3_Mid_Rec_Condo = (y2_NewGreen * RECRUITER_RATES.GREEN_REC.Y2) + (y2_NewLight * RECRUITER_RATES.LIGHT_REC.Y2);
        const recruiter_y3_Old_Rec_Condo = (y1_Green * RECRUITER_RATES.GREEN_REC.Y3) + (y1_Light * RECRUITER_RATES.LIGHT_REC.Y3);
        let recruiter_y3_Rec_Annual_Condo = ((recruiter_y3_New_Rec_Condo + recruiter_y3_Mid_Rec_Condo + recruiter_y3_Old_Rec_Condo) * 12);

        let recruiter_y3_OT_Network = 0;
        let recruiter_y3_Rec_Annual_Network = (recruiter_net_Rec_Base * 2.0 * 12);

        // --- OPTIONAL: ADD MAIN NETWORK EARNINGS ---
        if (includeMainNetworkEarnings && mainNetworkResults) {
            recruiter_y1_OT_Network += mainNetworkResults.totalOneTimeBonus;
            recruiter_y1_Rec_Annual_Network += (mainNetworkResults.totalRecurringYear1 * 12);
            recruiter_y2_Rec_Annual_Network += (mainNetworkResults.totalRecurringYear2 * 12);
            recruiter_y3_Rec_Annual_Network += (mainNetworkResults.totalRecurringYear3 * 12);
        }

        const y1_Total = recruiter_y1_OT_Condo + recruiter_y1_Rec_Annual_Condo + recruiter_y1_OT_Network + recruiter_y1_Rec_Annual_Network;
        const y2_Total = recruiter_y2_OT_Condo + recruiter_y2_Rec_Annual_Condo + recruiter_y2_OT_Network + recruiter_y2_Rec_Annual_Network;
        const y3_Total = recruiter_y3_OT_Condo + recruiter_y3_Rec_Annual_Condo + recruiter_y3_OT_Network + recruiter_y3_Rec_Annual_Network;

        return {
            year1: {
                activeUnits: y1_ActiveUnits + networkStats.usersCount,
                oneTimeBonus: y1_OT + networkStats.oneTimeBonus,
                recurringMonthly: y1_RecMonthly + networkStats.recurringYear1,
                totalAnnual: y1_TotalAnnual
            },
            year2: {
                activeUnits: y2_ActiveUnits + networkStats.usersCount,
                oneTimeBonus: y2_New_OT,
                recurringMonthly: y2_RecMonthly,
                totalAnnual: y2_TotalAnnual
            },
            year3: {
                activeUnits: y3_ActiveUnits + networkStats.usersCount,
                oneTimeBonus: y3_New_OT,
                recurringMonthly: y3_RecMonthly,
                totalAnnual: y3_TotalAnnual
            },
            total3Years: y1_TotalAnnual + y2_TotalAnnual + y3_TotalAnnual,
            networkStats,
            familyUtilityEarnings: showFamilyUtilityView ? {
                year1: {
                    total: y1_Total,
                    oneTime: recruiter_y1_OT_Condo + recruiter_y1_OT_Network,
                    recurring: recruiter_y1_Rec_Annual_Condo + recruiter_y1_Rec_Annual_Network,
                    networkPart: { oneTime: recruiter_y1_OT_Network, recurring: recruiter_y1_Rec_Annual_Network }
                },
                year2: {
                    total: y2_Total,
                    oneTime: recruiter_y2_OT_Condo + recruiter_y2_OT_Network,
                    recurring: recruiter_y2_Rec_Annual_Condo + recruiter_y2_Rec_Annual_Network,
                    networkPart: { oneTime: recruiter_y2_OT_Network, recurring: recruiter_y2_Rec_Annual_Network }
                },
                year3: {
                    total: y3_Total,
                    oneTime: recruiter_y3_OT_Condo + recruiter_y3_OT_Network,
                    recurring: recruiter_y3_Rec_Annual_Condo + recruiter_y3_Rec_Annual_Network,
                    networkPart: { oneTime: recruiter_y3_OT_Network, recurring: recruiter_y3_Rec_Annual_Network }
                },
                total3Years: y1_Total + y2_Total + y3_Total
            } : undefined
        };

    }, [inputs, mainNetworkResults]);
};
