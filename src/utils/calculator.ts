import { LeaveSettings, LeaveInput, CalculationResult, DeductionStep } from '../types';

/**
 * Calculates the final office and remote days based on leaves and holidays applied per rules.
 */
export function calculateDays(settings: LeaveSettings, input: LeaveInput): CalculationResult {
  const steps: DeductionStep[] = [];
  let currentOffice = settings.targetOfficeDays;
  let currentRemote = settings.targetRemoteDays;
  let totalCarryOver = 0;

  // 1. Holiday
  // "holiday deduct to office day first then remote day, repeat, if no office days left to deduct then deduct remote days and vise versa, office day deduct by this rule don't carry on to next week"
  for (let i = 1; i <= input.holiday; i++) {
    const beforeOffice = currentOffice;
    const beforeRemote = currentRemote;
    let affected: 'office' | 'remote' | 'none' = 'none';
    let actionDescription = '';

    if (settings.deductionPattern === 'alternating') {
      const targetPool = i % 2 === 1 ? 'office' : 'remote';
      if (targetPool === 'office') {
        if (currentOffice > 0) {
          currentOffice -= 1;
          affected = 'office';
          actionDescription = `Holiday Day ${i} deducted 1 day from office pool (Remaining office: ${currentOffice}).`;
        } else {
          if (currentRemote > 0) {
            currentRemote -= 1;
            affected = 'remote';
            actionDescription = `Holiday Day ${i} attempted to deduct office pool, but no office days were left. Deducted 1 day from remote pool (Remaining remote: ${currentRemote}).`;
          } else {
            affected = 'none';
            actionDescription = `Holiday Day ${i} attempted to deduct office pool, but no office or remote days were left.`;
          }
        }
      } else {
        if (currentRemote > 0) {
          currentRemote -= 1;
          affected = 'remote';
          actionDescription = `Holiday Day ${i} deducted 1 day from remote pool (Remaining remote: ${currentRemote}).`;
        } else {
          currentOffice -= 1;
          affected = 'office';
          actionDescription = `Holiday Day ${i} attempted to deduct remote pool, but no remote days were left. Deducted 1 day from office pool (Remaining office: ${currentOffice}).`;
        }
      }
    } else {
      if (currentOffice > 0) {
        currentOffice -= 1;
        affected = 'office';
        actionDescription = `Holiday Day ${i} deducted 1 day from office pool (Remaining office: ${currentOffice}).`;
      } else {
        if (currentRemote > 0) {
          currentRemote -= 1;
          affected = 'remote';
          actionDescription = `Holiday Day ${i} deducted 1 day from remote pool as no office days were left (Remaining remote: ${currentRemote}).`;
        } else {
          currentOffice -= 1;
          affected = 'office';
          actionDescription = `Holiday Day ${i} deducted 1 day from office pool as no remote days were left (Remaining office: ${currentOffice}).`;
        }
      }
    }

    steps.push({
      id: `holiday-${i}`,
      source: 'holiday',
      dayIndex: i,
      targetBefore: { office: beforeOffice, remote: beforeRemote },
      targetAfter: { office: currentOffice, remote: currentRemote },
      actionDescription,
      affected,
      amount: 1
    });
  }

  // 2. Annual Leave
  // "annual leave deduct to office day first then remote day, repeat, if no office days left to deduct then deduct remote days, office day deduct by this rule don't carry on to next week"
  for (let i = 1; i <= input.annualLeave; i++) {
    const beforeOffice = currentOffice;
    const beforeRemote = currentRemote;
    let affected: 'office' | 'remote' | 'none' = 'none';
    let actionDescription = '';

    if (settings.deductionPattern === 'alternating') {
      // Alternating list: Day 1 (Office), Day 2 (Remote), Day 3 (Office)...
      const targetPool = i % 2 === 1 ? 'office' : 'remote';
      if (targetPool === 'office') {
        if (currentOffice > 0) {
          currentOffice -= 1;
          affected = 'office';
          actionDescription = `Annual Leave Day ${i} deducted 1 day from office pool (Remaining office: ${currentOffice}).`;
        } else {
          // "if no office days left to deduct then deduct remote days"
          if (currentRemote > 0) {
            currentRemote -= 1;
            affected = 'remote';
            actionDescription = `Annual Leave Day ${i} attempted to deduct office pool first, but no office days were left. Deducted 1 day from remote pool (Remaining remote: ${currentRemote}).`;
          } else {
            affected = 'none';
            actionDescription = `Annual Leave Day ${i} attempted to deduct office pool first, but no office or remote days were left.`;
          }
        }
      } else {
        if (currentRemote > 0) {
          currentRemote -= 1;
          affected = 'remote';
          actionDescription = `Annual Leave Day ${i} deducted 1 day from remote pool (Remaining remote: ${currentRemote}).`;
        } else {
          affected = 'none';
          actionDescription = `Annual Leave Day ${i} attempted to deduct 1 remote day, but remote days were already at 0.`;
        }
      }
    } else {
      // Exhaustive: Deducts office first until <= 0, then deducts remote
      if (currentOffice > 0) {
        currentOffice -= 1;
        affected = 'office';
        actionDescription = `Annual Leave Day ${i} deducted 1 day from office pool (Remaining office: ${currentOffice}).`;
      } else {
        if (currentRemote > 0) {
          currentRemote -= 1;
          affected = 'remote';
          actionDescription = `Annual Leave Day ${i} deducted 1 day from remote pool as no office days were left (Remaining remote: ${currentRemote}).`;
        } else {
          affected = 'none';
          actionDescription = `Annual Leave Day ${i} attempted to deduct remote day as no office days were left, but remote days were already at 0.`;
        }
      }
    }

    steps.push({
      id: `annual-${i}`,
      source: 'annualLeave',
      dayIndex: i,
      targetBefore: { office: beforeOffice, remote: beforeRemote },
      targetAfter: { office: currentOffice, remote: currentRemote },
      actionDescription,
      affected,
      amount: 1
    });
  }

  // 3. Sick Leave
  // Rule 3.3: "sick leave have to deduct all remote days first, then deduct office day, the office day deduction in this rule, count as carry over office day to next week"
  for (let i = 1; i <= input.sickLeave; i++) {
    const beforeOffice = currentOffice;
    const beforeRemote = currentRemote;
    let affected: 'office' | 'remote' | 'none' = 'none';
    let actionDescription = '';

    if (currentRemote > 0) {
      currentRemote -= 1;
      affected = 'remote';
      actionDescription = `Sick Leave Day ${i} deducted 1 remote day (Remaining remote: ${currentRemote}).`;
    } else {
      // Remote days are 0 or less, deduct from Office day
      currentOffice -= 1;
      affected = 'office';
      totalCarryOver += 1; // Any sick leave office day deduction ALWAYS counts as carry-over
      actionDescription = `Sick Leave Day ${i} deducted 1 office day because remote pool was depleted. Counts as carry-over office day to next week (Remaining office: ${currentOffice}).`;
    }

    steps.push({
      id: `sick-${i}`,
      source: 'sickLeave',
      dayIndex: i,
      targetBefore: { office: beforeOffice, remote: beforeRemote },
      targetAfter: { office: currentOffice, remote: currentRemote },
      actionDescription,
      affected,
      amount: 1
    });
  }

  // Final Output Calculations
  // Rule 3.6: remote is already capped >= 0, but let's enforce
  const finalRemote = Math.max(0, currentRemote);

  // Rule 3.7: if output result cause office days below 0, office is set to 0 and negative value is carry-over
  let finalOffice = currentOffice;
  if (currentOffice < 0) {
    finalOffice = 0;
  }
  const carryOverOffice = totalCarryOver;

  return {
    settings,
    input,
    steps,
    finalOffice,
    finalRemote,
    carryOverOffice
  };
}
