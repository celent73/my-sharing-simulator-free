import { ActivityLog, ActivityType, Qualification } from '../types';

export interface CareerLevel {
  name: string;
  minClients: number;
  qualificationValue?: Qualification; // Link to the enum
  color?: string;
}

export interface CareerStatusInfo {
  currentLevel: CareerLevel;
  nextLevel: CareerLevel | null;
  totalClients: number;
  totalContracts: number;
  progressPercentage: number;
  clientsForNextLevel: number;
  isMaxLevel: boolean;
  specialStatus?: 'family_pro';
  isManualOverride?: boolean; // New flag
}

// Extended to include all Qualification levels
// Note: High-tier levels have high placeholders for minClients as the logic is currently client-based only.
const CAREER_LEVELS: CareerLevel[] = [
  { name: 'Family Utility', minClients: 0, color: '#3b82f6' }, // Blue
  { name: 'Consulente Junior', minClients: 11, color: '#3b82f6' },
  { name: 'Consulente Senior', minClients: 31, color: '#3b82f6' },
  { name: 'Team Leader', minClients: 61, color: '#3b82f6' },
  { name: 'Manager', minClients: 101, color: '#3b82f6' },
  { name: 'Top Manager', minClients: 201, color: '#3b82f6' },
  { name: Qualification.FAMILY_PRO, minClients: 9991, qualificationValue: Qualification.FAMILY_PRO, color: '#ec4899' },
  { name: 'Family pro 3x3', minClients: 9991.5, color: '#815545' }, // Special mid-level
  { name: Qualification.FAMILY_3S, minClients: 9992, qualificationValue: Qualification.FAMILY_3S, color: '#8000ff' },
  { name: Qualification.FAMILY_5S, minClients: 9993, qualificationValue: Qualification.FAMILY_5S, color: '#1147e6' },
  { name: 'Top family', minClients: 9993.5, color: '#00c3eb' }, 
  { name: Qualification.PRO_MANAGER, minClients: 9994, qualificationValue: Qualification.PRO_MANAGER, color: '#54cdb4' },
  { name: Qualification.REGIONAL_MANAGER, minClients: 9995, qualificationValue: Qualification.REGIONAL_MANAGER, color: '#00b21a' },
  { name: Qualification.NATIONAL_MANAGER, minClients: 9996, qualificationValue: Qualification.NATIONAL_MANAGER, color: '#8fff33' },
  { name: Qualification.DIRECTOR, minClients: 9997, qualificationValue: Qualification.DIRECTOR, color: '#e6e600' },
  { name: Qualification.DIRECTOR_PRO, minClients: 9998, qualificationValue: Qualification.DIRECTOR_PRO, color: '#c88536' },
  { name: Qualification.AMBASSADOR, minClients: 9999, qualificationValue: Qualification.AMBASSADOR, color: '#b3b3b3' },
  { name: Qualification.PRESIDENT, minClients: 10000, qualificationValue: Qualification.PRESIDENT, color: '#c8b335' },
];

export const calculateCareerStatus = (
  logs: ActivityLog[], 
  overrideQualification?: Qualification | null,
  careerDates?: Record<string, string>
): CareerStatusInfo => {
  const totalContracts = logs.reduce((sum, log) => {
    return sum + (log.counts[ActivityType.NEW_CONTRACTS] || 0) + (log.counts[ActivityType.NEW_FAMILY_UTILITY] || 0);
  }, 0);

  const totalClients = logs.reduce((sum, log) => {
    const contracts = log.counts[ActivityType.NEW_CONTRACTS] || 0;
    return sum + contracts;
  }, 0);

  // 1. Determine Level based on Metrics (Standard Logic)
  let metricLevelIndex = 0;
  for (let i = 0; i < CAREER_LEVELS.length; i++) {
    if (i > 5) break; // Metric logic up to Top Manager
    if (totalClients >= CAREER_LEVELS[i].minClients) {
      metricLevelIndex = i;
    }
  }

  // 2. Determine Level based on Special Achievements (Family Pro)
  let specialLevelIndex = -1;
  if (totalContracts >= 10) {
    specialLevelIndex = CAREER_LEVELS.findIndex(l => l.qualificationValue === Qualification.FAMILY_PRO);
  }

  // 3. Determine Level based on Manual Selection
  let manualLevelIndex = -1;
  if (overrideQualification) {
    manualLevelIndex = CAREER_LEVELS.findIndex(l => 
      l.name === overrideQualification || l.qualificationValue === overrideQualification
    );
  }

  // 4. Determine Level based on Career Path reached milestones (careerDates)
  let milestoneLevelIndex = -1;
  if (careerDates) {
    const todayStr = new Date().toISOString().split('T')[0];
    const reachedStages = Object.keys(careerDates).filter(name => {
      const dateStr = careerDates[name];
      return dateStr && dateStr <= todayStr;
    });
    reachedStages.forEach(stageName => {
      // Find index in CAREER_LEVELS. Use case-insensitive find for robustness
      const idx = CAREER_LEVELS.findIndex(l => 
        l.name.toLowerCase() === stageName.toLowerCase() || 
        (l.qualificationValue && l.qualificationValue.toLowerCase() === stageName.toLowerCase())
      );
      if (idx > milestoneLevelIndex) milestoneLevelIndex = idx;
    });
  }

  // 5. THE WINNER: The highest index achieved
  const finalIndex = Math.max(metricLevelIndex, specialLevelIndex, manualLevelIndex, milestoneLevelIndex);
  let currentLevel = CAREER_LEVELS[finalIndex];
  
  // Logic for Special Status Flag (mostly for notifications or specific UI tags)
  const specialStatus = totalContracts >= 10 ? 'family_pro' : undefined;
  const isManualOverride = manualLevelIndex === finalIndex && manualLevelIndex > metricLevelIndex;

  let nextLevel: CareerLevel | null = null;
  if (finalIndex < CAREER_LEVELS.length - 1) {
    nextLevel = CAREER_LEVELS[finalIndex + 1];
  }

  const isMaxLevel = !nextLevel || nextLevel.minClients > 9000;
  let progressPercentage = 100;
  let clientsForNextLevel = 0;

  if (nextLevel && !isManualOverride && finalIndex <= 5) {
    const clientsInCurrentLevel = totalClients - currentLevel.minClients;
    const clientsNeededForNextLevel = nextLevel.minClients - currentLevel.minClients;
    progressPercentage = (clientsInCurrentLevel / clientsNeededForNextLevel) * 100;
    clientsForNextLevel = nextLevel.minClients;
  }

  return {
    currentLevel,
    nextLevel,
    totalClients,
    totalContracts,
    progressPercentage: Math.min(progressPercentage, 100),
    clientsForNextLevel,
    isMaxLevel,
    specialStatus: specialStatus as any,
    isManualOverride
  };
};

export const predictQualificationDate = (logs: ActivityLog[], status: CareerStatusInfo): string | null => {
  if (status.isMaxLevel || !status.nextLevel || status.isManualOverride) return null;

  const targetClients = status.clientsForNextLevel;
  const missingClients = targetClients - status.totalClients;

  if (missingClients <= 0) return "Oggi!";

  // Calcola la media giornaliera degli ultimi 30 giorni
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const relevantLogs = logs.filter(log => new Date(log.date) >= thirtyDaysAgo);
  const totalNewInPeriod = relevantLogs.reduce((sum, log) => sum + (log.counts[ActivityType.NEW_CONTRACTS] || 0), 0);

  // Usiamo il numero di log reali nel periodo per una media realistica
  const daysInPeriod = Math.max(1, relevantLogs.length);
  const dailyAverage = totalNewInPeriod / daysInPeriod;

  if (dailyAverage <= 0) return null;

  const daysToTarget = Math.ceil(missingClients / dailyAverage);
  const estimatedDate = new Date();
  estimatedDate.setDate(estimatedDate.getDate() + daysToTarget);

  return estimatedDate.toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' });
};