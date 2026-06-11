export interface LeaveSettings {
  targetOfficeDays: number;
  targetRemoteDays: number;
  deductionPattern: 'alternating' | 'exhaustive';
  startFreshOnHoliday: boolean;
}

export interface LeaveInput {
  sickLeave: number;
  annualLeave: number;
  holiday: number;
}

export interface DeductionStep {
  id: string;
  source: 'sickLeave' | 'annualLeave' | 'holiday';
  dayIndex: number; // 1-based index for visual purpose
  targetBefore: {
    office: number;
    remote: number;
  };
  targetAfter: {
    office: number;
    remote: number;
  };
  actionDescription: string;
  affected: 'office' | 'remote' | 'none';
  amount: number;
}

export interface CalculationResult {
  settings: LeaveSettings;
  input: LeaveInput;
  steps: DeductionStep[];
  finalOffice: number;
  finalRemote: number;
  carryOverOffice: number;
}
