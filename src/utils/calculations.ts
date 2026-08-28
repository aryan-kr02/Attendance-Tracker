import { OverallAttendance, RiskLevel, SubjectAttendance } from '../types';

export const TARGET_ATTENDANCE = 75; // 75% standard university criterion

/**
 * Calculates maximum classes a student can miss without dropping below the target %
 */
export function calculateClassesCanMiss(present: number, total: number, target: number = TARGET_ATTENDANCE): number {
  if (total === 0) return 0;
  const targetRatio = target / 100;
  const currentRatio = present / total;
  if (currentRatio < targetRatio) return 0;
  
  // P / (T + x) >= targetRatio => x <= (P / targetRatio) - T
  const maxMiss = Math.floor(present / targetRatio - total);
  return Math.max(0, maxMiss);
}

/**
 * Calculates consecutive upcoming classes a student must attend to reach target %
 */
export function calculateClassesMustAttend(present: number, total: number, target: number = TARGET_ATTENDANCE): number {
  if (total === 0) return 0;
  const targetRatio = target / 100;
  const currentRatio = present / total;
  if (currentRatio >= targetRatio) return 0;

  // (P + x) / (T + x) >= targetRatio
  // P + x >= targetRatio * T + targetRatio * x
  // x * (1 - targetRatio) >= targetRatio * T - P
  // x >= (targetRatio * T - P) / (1 - targetRatio)
  const numerator = targetRatio * total - present;
  const denominator = 1 - targetRatio;
  const required = Math.ceil(numerator / denominator);
  return Math.max(0, required);
}

/**
 * Computes projected attendance if attending or missing next N classes
 */
export function calculateProjection(present: number, total: number, nextClassesAttended: number, nextClassesMissed: number = 0): number {
  const newPresent = present + nextClassesAttended;
  const newTotal = total + nextClassesAttended + nextClassesMissed;
  if (newTotal === 0) return 0;
  return Math.round((newPresent / newTotal) * 1000) / 10;
}

/**
 * Determines risk level based on percentage
 */
export function getRiskLevel(percentage: number): RiskLevel {
  if (percentage >= 85) return 'safe';
  if (percentage >= 75) return 'warning';
  return 'critical';
}

/**
 * Determines subject status category
 */
export function getSubjectStatus(percentage: number): 'excellent' | 'good' | 'low' {
  if (percentage >= 90) return 'excellent';
  if (percentage >= 75) return 'good';
  return 'low';
}

export function computeOverall(subjects: SubjectAttendance[]): OverallAttendance {
  const totalHeld = subjects.reduce((sum, s) => sum + s.held, 0);
  const totalPresent = subjects.reduce((sum, s) => sum + s.present, 0);
  const totalMissed = totalHeld - totalPresent;
  const percentage = totalHeld > 0 ? Math.round((totalPresent / totalHeld) * 1000) / 10 : 0;
  const bufferPercentage = Math.round((percentage - TARGET_ATTENDANCE) * 10) / 10;
  const riskLevel = getRiskLevel(percentage);
  const maxMissableOverall = calculateClassesCanMiss(totalPresent, totalHeld, TARGET_ATTENDANCE);
  const mustAttendOverall = calculateClassesMustAttend(totalPresent, totalHeld, TARGET_ATTENDANCE);

  return {
    totalHeld,
    totalPresent,
    totalMissed,
    percentage,
    bufferPercentage,
    riskLevel,
    maxMissableOverall,
    mustAttendOverall,
  };
}
