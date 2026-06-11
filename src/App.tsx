import React, { useState, useMemo } from 'react';
import { 
  Calendar, 
  Plus, 
  Minus, 
  Settings, 
  Info, 
  HeartPulse, 
  Compass, 
  ArrowRight, 
  HelpCircle, 
  CheckCircle2, 
  Undo2, 
  AlertCircle,
  TrendingDown,
  Building,
  Home,
  RefreshCw,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { LeaveSettings, LeaveInput } from './types';
import { calculateDays } from './utils/calculator';

export default function App() {
  // Application State
  const [settings, setSettings] = useState<LeaveSettings>({
    targetOfficeDays: 2,
    targetRemoteDays: 3,
    deductionPattern: 'alternating',
    startFreshOnHoliday: true,
  });

  const [input, setInput] = useState<LeaveInput>({
    sickLeave: 0,
    annualLeave: 0,
    holiday: 0,
  });

  const [showConfig, setShowConfig] = useState<boolean>(false);
  const [showHelp, setShowHelp] = useState<boolean>(false);

  // Derive target sum of leaves
  const totalLeaves = useMemo(() => {
    return input.sickLeave + input.annualLeave + input.holiday;
  }, [input]);

  // Compute calculated values reactively upon leave inputs / settings change
  const calcResult = useMemo(() => {
    return calculateDays(settings, input);
  }, [settings, input]);

  // Update leave inputs with safety validation
  const handleUpdateLeave = (type: keyof LeaveInput, value: number) => {
    setInput(prev => {
      const nextVal = Math.max(0, Math.min(5, value));
      const otherValueSum = Object.keys(prev)
        .filter(k => k !== type)
        .reduce((sum, key) => sum + prev[key as keyof LeaveInput], 0);

      // Validate total sum does not exceed 5
      if (nextVal + otherValueSum > 5) {
        return prev;
      }

      return {
        ...prev,
        [type]: nextVal
      };
    });
  };

  // Reset inputs to 0
  const handleReset = () => {
    setInput({
      sickLeave: 0,
      annualLeave: 0,
      holiday: 0
    });
  };

  // Set predefined scenarios
  const applyPreset = (sick: number, annual: number, holiday: number) => {
    setInput({
      sickLeave: sick,
      annualLeave: annual,
      holiday: holiday
    });
  };

  // Adjust standard baseline weekly breakdown (Total must always equal 5)
  const handleAdjustBaseline = (officeVal: number) => {
    const cappedOffice = Math.max(0, Math.min(5, officeVal));
    setSettings(prev => ({
      ...prev,
      targetOfficeDays: cappedOffice,
      targetRemoteDays: 5 - cappedOffice
    }));
  };

  return (
    <div className="min-h-screen bg-[#0F1115] text-[#E2E8F0] font-sans flex flex-col justify-between antialiased pb-0 select-none">
      
      {/* 20px Visual Top Decorative Border line matching brand accent blue */}
      <div className="h-1.5 bg-gradient-to-r from-[#3B82F6] via-[#2D3748] to-[#10B981] w-full" />

      {/* Primary Elegant Dark Header */}
      <header className="border-b border-[#2D3748] bg-[#161B22] shadow-lg sticky top-0 z-50 transition-all duration-200">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#3B82F6] rounded-xl flex items-center justify-center shadow-md shadow-[#3B82F6]/25 transition-transform duration-300 hover:scale-105">
              <Calendar className="w-5.5 h-5.5 text-white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black font-display text-white tracking-tight leading-none flex items-center gap-1.5">
                WorkBalance <span className="text-[#3B82F6] font-light">Optimizer</span>
              </h1>
              <p className="text-[10px] text-[#64748B] uppercase tracking-wider font-mono mt-0.5 sm:block hidden">
                Real-time hybrid system
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2.5">
            <button
              id="btn-settings-toggle"
              onClick={() => setShowConfig(!showConfig)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 sm:py-2 sm:px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                showConfig 
                  ? 'bg-[#3B82F6] text-white shadow-lg shadow-[#3B82F6]/20' 
                  : 'bg-[#2D3748] hover:bg-[#2D3748]/80 hover:text-white text-[#94A3B8] border border-[#2D3748]/60'
              }`}
            >
              <Settings className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline">Baseline Policies</span>
            </button>
            <button
              id="btn-help-toggle"
              onClick={() => setShowHelp(!showHelp)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 sm:py-2 sm:px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                showHelp
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                  : 'bg-[#2D3748] hover:bg-[#2D3748]/80 hover:text-white text-[#94A3B8] border border-[#2D3748]/60'
              }`}
            >
              <HelpCircle className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline">Rule Guide</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl mx-auto px-6 py-8 w-full">
        
        {/* Help Panel */}
        <AnimatePresence>
          {showHelp && (
            <motion.div
              initial={{ height: 0, opacity: 0, marginBottom: 0 }}
              animate={{ height: 'auto', opacity: 1, marginBottom: 24 }}
              exit={{ height: 0, opacity: 0, marginBottom: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-[#161B22] border border-emerald-500/25 rounded-2xl p-6 shadow-xl shadow-emerald-950/10">
                <div className="flex items-center justify-between mb-4 border-b border-[#2D3748] pb-3">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-emerald-400" />
                    <h3 className="font-semibold text-white font-display text-lg">System Calculation Instructions</h3>
                  </div>
                  <button 
                    onClick={() => setShowHelp(false)}
                    className="text-xs text-emerald-400 hover:text-emerald-300 font-bold tracking-wide uppercase"
                  >
                    Close Rules
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-[#94A3B8]">
                  <div className="space-y-3">
                    <div className="flex gap-3 items-start">
                      <span className="font-mono bg-emerald-950/80 text-emerald-400 font-bold px-2 py-0.5 rounded text-xs border border-emerald-900/40">Rule 3.2</span>
                      <p className="leading-relaxed">
                        <strong className="text-white">Baseline Target:</strong> Default schedule is 2 Office and 3 Remote days per week. Use the Policy Panel at the top to customize individual user targets anytime.
                      </p>
                    </div>
                    <div className="flex gap-3 items-start">
                      <span className="font-mono bg-emerald-950/80 text-emerald-400 font-bold px-2 py-0.5 rounded text-xs border border-emerald-900/40">Rule 3.3</span>
                      <p className="leading-relaxed">
                        <strong className="text-white">Sick Leave Priority:</strong> Deducts all <span className="text-[#3B82F6]">Remote WFH</span> days first, then deducts office days. Office day deductions count as carry over to next week.
                      </p>
                    </div>
                    <div className="flex gap-3 items-start">
                      <span className="font-mono bg-emerald-950/80 text-emerald-400 font-bold px-2 py-0.5 rounded text-xs border border-emerald-900/40">Rule 3.4</span>
                      <p className="leading-relaxed">
                        <strong className="text-white">Annual Leave Priority:</strong> Deducts to office day first then remote day, repeat. If no office days are left to deduct, then deducts remote days. Office day deductions by this rule do NOT carry on to next week.
                      </p>
                    </div>
                    <div className="flex gap-3 items-start">
                      <span className="font-mono bg-emerald-950/80 text-emerald-400 font-bold px-2 py-0.5 rounded text-xs border border-emerald-900/40">Rule 3.5</span>
                      <p className="leading-relaxed">
                        <strong className="text-white">Holiday Priority:</strong> Deducts to office day first then remote day, repeat. If no office days are left to deduct, then deducts remote days, and vice versa. Office day deductions by this rule do NOT carry on to next week.
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex gap-3 items-start">
                      <span className="font-mono bg-emerald-950/80 text-emerald-400 font-bold px-2 py-0.5 rounded text-xs border border-emerald-900/40">Rule 3.6</span>
                      <p className="leading-relaxed">
                        <strong className="text-white">Remote Cap:</strong> Leftover remote days cannot go below zero under any condition. Excess deduction is absorbed by the system.
                      </p>
                    </div>
                    <div className="flex gap-3 items-start">
                      <span className="font-mono bg-emerald-950/80 text-emerald-400 font-bold px-2 py-0.5 rounded text-xs border border-emerald-900/40">Rule 3.7</span>
                      <p className="leading-relaxed">
                        <strong className="text-white">Office Carry-On:</strong> Driven office balance below zero sets output to <code className="text-white bg-[#0F1115] px-1 rounded">0</code>, and records the negative magnitude as positive Debt to carry on to next week.
                      </p>
                    </div>
                    <div className="flex gap-3 items-start">
                      <span className="font-mono bg-emerald-950/80 text-emerald-400 font-bold px-2 py-0.5 rounded text-xs border border-emerald-900/40">Limits</span>
                      <p className="leading-relaxed">
                        <strong className="text-white">Sum limit:</strong> Sickness, annual, and holidays combined must lie between <code className="text-white">0 and 5</code> days per week.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Global Configuration Policy Panel */}
        <AnimatePresence>
          {showConfig && (
            <motion.div
              initial={{ height: 0, opacity: 0, marginBottom: 0 }}
              animate={{ height: 'auto', opacity: 1, marginBottom: 24 }}
              exit={{ height: 0, opacity: 0, marginBottom: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-[#161B22] border border-[#2D3748] rounded-2xl p-6 shadow-xl">
                <div className="flex items-center justify-between mb-5 border-b border-[#2D3748] pb-3">
                  <div className="flex items-center gap-2">
                    <Settings className="w-5 h-5 text-[#3B82F6]" />
                    <h3 className="font-bold text-white font-display text-base">Standard Weekly Baseline Administration</h3>
                  </div>
                  <button 
                    onClick={() => setShowConfig(false)}
                    className="text-xs text-[#3B82F6] hover:text-blue-400 font-extrabold tracking-wider uppercase"
                  >
                    Save & Apply
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Baseline scheduler */}
                  <div className="md:col-span-2 space-y-4">
                    <div>
                      <span className="block text-sm font-semibold text-[#E2E8F0] mb-1">
                        Individual expected split (Must equal 5 days)
                      </span>
                      <p className="text-xs text-[#64748B] mb-4">
                        Adjust expected office presence against dynamic remote status.
                      </p>
                    </div>
                    
                    <div className="space-y-5">
                      {/* Interactive Buttons for Easy Baseline Selector */}
                      <div className="grid grid-cols-6 gap-2">
                        {[0, 1, 2, 3, 4, 5].map((officeDays) => {
                          const remoteDays = 5 - officeDays;
                          const isSelected = settings.targetOfficeDays === officeDays;
                          return (
                            <button
                              key={officeDays}
                              id={`preset-schedule-${officeDays}`}
                              onClick={() => handleAdjustBaseline(officeDays)}
                              className={`flex flex-col items-center justify-center py-3 px-1 rounded-xl border text-xs font-bold transition-all duration-150 ${
                                isSelected
                                  ? 'bg-[#3B82F6] text-white border-[#3B82F6] shadow-lg shadow-[#3B82F6]/20'
                                  : 'bg-[#0F1115] hover:bg-[#161B22] text-[#94A3B8] border-[#2D3748]'
                              }`}
                            >
                              <span className="text-sm font-bold">{officeDays} : {remoteDays}</span>
                              <span className="text-[9px] opacity-75 uppercase tracking-tighter mt-1">
                                {officeDays === 2 && remoteDays === 3 ? 'Default (2:3)' : `${officeDays} Off.`}
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Explicit sliders */}
                      <div className="space-y-3 bg-[#0F1115] p-4.5 rounded-xl border border-[#2D3748]">
                        <div className="flex items-center justify-between text-xs font-bold text-[#94A3B8]">
                          <span className="flex items-center gap-1.5">
                            <Building className="w-3.5 h-3.5 text-slate-500" />
                            Baseline Office: <strong className="text-white font-mono text-sm ml-1">{settings.targetOfficeDays} d</strong>
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Home className="w-3.5 h-3.5 text-slate-500" />
                            Baseline Remote: <strong className="text-emerald-400 font-mono text-sm ml-1">{settings.targetRemoteDays} d</strong>
                          </span>
                        </div>
                        <input
                          id="slider-office-days"
                          type="range"
                          min="0"
                          max="5"
                          step="1"
                          value={settings.targetOfficeDays}
                          onChange={(e) => handleAdjustBaseline(Number(e.target.value))}
                          className="w-full accent-[#3B82F6] h-2 bg-[#2D3748] rounded-lg appearance-none cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Additional configurations */}
                  <div className="space-y-4 border-t md:border-t-0 md:border-l border-[#2D3748] pt-4 md:pt-0 md:pl-6">
                    <div>
                      <span className="block text-sm font-semibold text-[#E2E8F0] mb-1">
                        Deduction Rule Type
                      </span>
                      <p className="text-xs text-[#64748B] mb-4">
                        Control leave deduction cascading priority logic.
                      </p>
                    </div>
                    <div className="flex flex-col gap-2.5">
                      <button
                        id="policy-pattern-alternating"
                        onClick={() => setSettings(prev => ({ ...prev, deductionPattern: 'alternating' }))}
                        className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-all duration-150 ${
                          settings.deductionPattern === 'alternating'
                            ? 'bg-[#1a1f2c] border-[#3B82F6]/60 shadow-inner'
                            : 'bg-[#0F1115] hover:bg-[#161B22]/70 border-[#2D3748]'
                        }`}
                      >
                        <input
                          type="radio"
                          checked={settings.deductionPattern === 'alternating'}
                          onChange={() => {}}
                          className="mt-1 accent-[#3B82F6]"
                        />
                        <div>
                          <span className="block text-xs font-bold text-white">Alternating Priority</span>
                          <span className="block text-[10px] text-[#64748B] leading-relaxed mt-1">
                            Office & Remote pools are reduced dynamically (1:1 repeat).
                          </span>
                        </div>
                      </button>

                      <button
                        id="policy-pattern-exhaustive"
                        onClick={() => setSettings(prev => ({ ...prev, deductionPattern: 'exhaustive' }))}
                        className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-all duration-150 ${
                          settings.deductionPattern === 'exhaustive'
                            ? 'bg-[#1a1f2c] border-[#3B82F6]/60 shadow-inner'
                            : 'bg-[#0F1115] hover:bg-[#161B22]/70 border-[#2D3748]'
                        }`}
                      >
                        <input
                          type="radio"
                          checked={settings.deductionPattern === 'exhaustive'}
                          onChange={() => {}}
                          className="mt-1 accent-[#3B82F6]"
                        />
                        <div>
                          <span className="block text-xs font-bold text-white">Office First Exhaustive</span>
                          <span className="block text-[10px] text-[#64748B] leading-relaxed mt-1">
                            Deplete anticipated office days entirely before remote is hit.
                          </span>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dashboard Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Inputs & Quick Presets (5 CoLS) */}
          <div className="lg:col-span-12 xl:col-span-5 space-y-6">
            
            {/* Input Form Card */}
            <div className="bg-[#161B22] rounded-2xl border border-[#2D3748] shadow-xl overflow-hidden p-6">
              <div className="flex items-center justify-between mb-4 border-b border-[#2D3748] pb-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#3B82F6]" />
                  <h2 className="font-bold text-white font-display text-lg">Absence Day Inputs</h2>
                </div>
                {totalLeaves > 0 && (
                  <button
                    id="btn-clear-inputs"
                    onClick={handleReset}
                    className="flex items-center gap-1.5 text-xs font-bold text-red-400 hover:text-red-300 transition-colors"
                  >
                    <Undo2 className="w-3.5 h-3.5" />
                    Reset Week
                  </button>
                )}
              </div>



              {/* Dynamic Counters for Leave Types */}
              <div className="space-y-4">
                
                {/* SICK LEAVE */}
                <div className="flex items-center justify-between p-4 bg-[#0F1115] hover:bg-[#0F1115]/80 rounded-xl transition-all border border-[#2D3748]/60">
                  <div className="flex items-center gap-3">
                    <span className="p-2.5 rounded-lg bg-red-950/40 text-red-400 border border-red-900/30">
                      <HeartPulse className="w-4 h-4" />
                    </span>
                    <div>
                      <span className="block text-xs font-bold text-white">Sick Leave</span>
                      <span className="block text-[10px] text-[#64748B]">Deducts remote first, then office with carry-over</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      id="btn-sick-minus"
                      disabled={input.sickLeave === 0}
                      onClick={() => handleUpdateLeave('sickLeave', input.sickLeave - 1)}
                      className="w-8 h-8 rounded-lg bg-[#2D3748] hover:bg-[#343e4f] disabled:opacity-30 disabled:pointer-events-none text-white active:scale-95 flex items-center justify-center transition-all shadow-sm"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span id="label-sick-value" className="w-6 text-center text-sm font-bold font-mono text-white">
                      {input.sickLeave}
                    </span>
                    <button
                      id="btn-sick-plus"
                      disabled={totalLeaves >= 5}
                      onClick={() => handleUpdateLeave('sickLeave', input.sickLeave + 1)}
                      className="w-8 h-8 rounded-lg bg-[#2D3748] hover:bg-[#343e4f] disabled:opacity-30 disabled:pointer-events-none text-white active:scale-95 flex items-center justify-center transition-all shadow-sm"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* ANNUAL LEAVE */}
                <div className="flex items-center justify-between p-4 bg-[#0F1115] hover:bg-[#0F1115]/80 rounded-xl transition-all border border-[#2D3748]/60">
                  <div className="flex items-center gap-3">
                    <span className="p-2.5 rounded-lg bg-emerald-950/40 text-emerald-400 border border-emerald-900/30">
                      <Compass className="w-4 h-4" />
                    </span>
                    <div>
                      <span className="block text-xs font-bold text-white">Annual Leave</span>
                      <span className="block text-[10px] text-[#64748B]">Deducts office first, then remote (no carry-over)</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      id="btn-annual-minus"
                      disabled={input.annualLeave === 0}
                      onClick={() => handleUpdateLeave('annualLeave', input.annualLeave - 1)}
                      className="w-8 h-8 rounded-lg bg-[#2D3748] hover:bg-[#343e4f] disabled:opacity-30 disabled:pointer-events-none text-white active:scale-95 flex items-center justify-center transition-all shadow-sm"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span id="label-annual-value" className="w-6 text-center text-sm font-bold font-mono text-white">
                      {input.annualLeave}
                    </span>
                    <button
                      id="btn-annual-plus"
                      disabled={totalLeaves >= 5}
                      onClick={() => handleUpdateLeave('annualLeave', input.annualLeave + 1)}
                      className="w-8 h-8 rounded-lg bg-[#2D3748] hover:bg-[#343e4f] disabled:opacity-30 disabled:pointer-events-none text-white active:scale-95 flex items-center justify-center transition-all shadow-sm"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* PUBLIC HOLIDAYS */}
                <div className="flex items-center justify-between p-4 bg-[#0F1115] hover:bg-[#0F1115]/80 rounded-xl transition-all border border-[#2D3748]/60">
                  <div className="flex items-center gap-3">
                    <span className="p-2.5 rounded-lg bg-amber-950/40 text-amber-400 border border-amber-900/30">
                      <Calendar className="w-4 h-4" />
                    </span>
                    <div>
                      <span className="block text-xs font-bold text-white">Public Holidays</span>
                      <span className="block text-[10px] text-[#64748B]">Deducts office first, then remote (no carry-over)</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      id="btn-holiday-minus"
                      disabled={input.holiday === 0}
                      onClick={() => handleUpdateLeave('holiday', input.holiday - 1)}
                      className="w-8 h-8 rounded-lg bg-[#2D3748] hover:bg-[#343e4f] disabled:opacity-30 disabled:pointer-events-none text-white active:scale-95 flex items-center justify-center transition-all shadow-sm"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span id="label-holiday-value" className="w-6 text-center text-sm font-bold font-mono text-white">
                      {input.holiday}
                    </span>
                    <button
                      id="btn-holiday-plus"
                      disabled={totalLeaves >= 5}
                      onClick={() => handleUpdateLeave('holiday', input.holiday + 1)}
                      className="w-8 h-8 rounded-lg bg-[#2D3748] hover:bg-[#343e4f] disabled:opacity-30 disabled:pointer-events-none text-white active:scale-95 flex items-center justify-center transition-all shadow-sm"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>

              {/* Progress Visual Bar */}
              <div className="mt-6 pt-4 border-t border-[#2D3748]">
                <div className="flex items-center justify-between text-xs font-semibold text-[#94A3B8] mb-1.5">
                  <span className="flex items-center gap-1">
                    Allocated Leaves: <strong className="text-white font-mono">{totalLeaves} of 5 days</strong>
                  </span>
                  <span className="text-[#64748B]">
                    {5 - totalLeaves} work days remaining
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#0F1115] overflow-hidden flex gap-0.5">
                  <div 
                    style={{ width: `${(input.sickLeave / 5) * 100}%` }}
                    className="bg-red-500 h-full transition-all duration-300"
                    title={`Sick Leave: ${input.sickLeave} days`}
                  />
                  <div 
                    style={{ width: `${(input.annualLeave / 5) * 100}%` }}
                    className="bg-emerald-550 h-full transition-all duration-300 bg-[#10B981]"
                    title={`Annual Leave: ${input.annualLeave} days`}
                  />
                  <div 
                    style={{ width: `${(input.holiday / 5) * 100}%` }}
                    className="bg-amber-500 h-full transition-all duration-300"
                    title={`Holiday: ${input.holiday} days`}
                  />
                  <div 
                    style={{ width: `${((5 - totalLeaves) / 5) * 100}%` }}
                    className="bg-[#2D3748] h-full transition-all duration-300"
                    title={`Remaining active work days: ${5 - totalLeaves}`}
                  />
                </div>
                <div className="flex items-center justify-between mt-2.5 text-[9px] font-semibold text-[#475569] uppercase tracking-wider">
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" /> Sick</span>
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#10B981] inline-block" /> Annual</span>
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" /> Holiday</span>
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#2D3748] inline-block" /> Available</span>
                </div>
              </div>

              {/* Day limit warnings positioned at the bottom of the card to prevent layout shifts of input controls above */}
              {totalLeaves === 5 && (
                <div id="warning-box" className="flex items-start gap-2 bg-red-950/20 border border-red-500/30 p-3.5 rounded-xl text-xs text-red-400 mt-5 animate-fade-in">
                  <Info className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <span>
                    <strong>Maximum reached:</strong> All 5 working days of this week are allocated to leaves/holidays. Work days will resolve to zero.
                  </span>
                </div>
              )}

            </div>

            {/* Configured Baseline Presets Card */}
            <div className="bg-[#161B22] rounded-2xl border border-[#2D3748] shadow-sm p-6">
              <span className="block text-xs font-bold text-[#64748B] uppercase tracking-wider mb-3">
                Predefined Test Scenarios
              </span>
              <div className="grid grid-cols-2 gap-2.5 text-xs">
                <button
                  id="btn-preset-standard"
                  onClick={() => applyPreset(0, 0, 0)}
                  className="p-3 rounded-xl border border-[#2D3748] bg-[#0F1115] hover:bg-[#161B22] text-[#E2E8F0] hover:text-white font-semibold text-left transition-all"
                >
                  <span className="block font-bold">Standard Week</span>
                  <span className="text-[10px] text-[#64748B] font-normal mt-0.5">0 leaves, full working week</span>
                </button>
                <button
                  id="btn-preset-sick"
                  onClick={() => applyPreset(1, 0, 1)}
                  className="p-3 rounded-xl border border-[#2D3748] bg-[#0F1115] hover:bg-[#161B22] text-[#E2E8F0] hover:text-white font-semibold text-left transition-all"
                >
                  <span className="block font-bold">Sick + Holiday</span>
                  <span className="text-[10px] text-[#64748B] font-normal mt-0.5">1 Sick day, 1 Holiday</span>
                </button>
                <button
                  id="btn-preset-vacation"
                  onClick={() => applyPreset(0, 3, 0)}
                  className="p-3 rounded-xl border border-[#2D3748] bg-[#0F1115] hover:bg-[#161B22] text-[#E2E8F0] hover:text-white font-semibold text-left transition-all"
                >
                  <span className="block font-bold">Mid-Week Vacation</span>
                  <span className="text-[10px] text-[#64748B] font-normal mt-0.5">3 days of Annual Leave</span>
                </button>
                <button
                  id="btn-preset-longweekend"
                  onClick={() => applyPreset(0, 1, 2)}
                  className="p-3 rounded-xl border border-[#2D3748] bg-[#0F1115] hover:bg-[#161B22] text-[#E2E8F0] hover:text-white font-semibold text-left transition-all"
                >
                  <span className="block font-bold">Long Weekend</span>
                  <span className="text-[10px] text-[#64748B] font-normal mt-0.5">1 Annual day, 2 Holidays</span>
                </button>
              </div>
            </div>

          </div>

          {/* RIGHT: Results and Detailed Step Trace (7 COLS) */}
          <div className="lg:col-span-12 xl:col-span-7 space-y-6">
            
            {/* Direct Balance Outputs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* OFFICE BALANCE */}
              <div className="bg-[#161B22] rounded-3xl border border-[#2D3748] shadow-lg p-6 flex flex-col items-center justify-center text-center transition-all duration-300">
                <span className="text-xs font-bold text-[#64748B] uppercase tracking-[0.2em] mb-3">Office Days</span>
                <div id="res-office" className="text-8xl font-black text-white leading-none tracking-tighter">
                  {calcResult.finalOffice}
                </div>
                <div className="mt-4 h-1.5 w-16 bg-[#3B82F6] rounded-full shadow-sm" />
                <span className="text-[10px] text-[#475569] uppercase tracking-wider font-mono mt-3">
                  Baseline Target: {settings.targetOfficeDays} d
                </span>
              </div>

              {/* REMOTE BALANCE */}
              <div className="bg-[#161B22] rounded-3xl border border-[#2D3748] shadow-lg p-6 flex flex-col items-center justify-center text-center transition-all duration-300">
                <span className="text-xs font-bold text-[#64748B] uppercase tracking-[0.2em] mb-3">Remote Days</span>
                <div id="res-remote" className="text-8xl font-black text-white leading-none tracking-tighter">
                  {calcResult.finalRemote}
                </div>
                <div className="mt-4 h-1.5 w-16 bg-[#10B981] rounded-full shadow-sm" />
                <span className="text-[10px] text-[#475569] uppercase tracking-wider font-mono mt-3">
                  Baseline Target: {settings.targetRemoteDays} d
                </span>
              </div>

              {/* CARRY OVER BALANCE */}
              <div className={`bg-[#161B22] rounded-3xl border shadow-lg p-6 flex flex-col justify-between transition-all duration-350 ${
                calcResult.carryOverOffice > 0 
                  ? 'border-red-500/40 shadow-xl shadow-red-950/20' 
                  : 'border-[#2D3748]'
              }`}>
                <div className="flex flex-col items-center text-center">
                  <div className="flex items-center justify-between w-full mb-3 pb-1 border-b border-[#2D3748]/50">
                    <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest">Outlook Outlook</span>
                    
                    <div 
                      id="carry-pill" 
                      className={`px-3 py-1 bg-[#2D3748] rounded-full text-[9px] font-bold flex items-center gap-1.5 border uppercase ${
                        calcResult.carryOverOffice > 0 
                          ? 'bg-red-900/20 text-red-400 border-red-500/35' 
                          : 'bg-[#2D3748] border-[#2D3748] text-[#94A3B8]'
                      }`}
                    >
                      <div className={`w-1.5 h-1.5 rounded-full ${calcResult.carryOverOffice > 0 ? 'bg-red-400' : 'bg-[#64748B]'}`} />
                      {calcResult.carryOverOffice > 0 ? 'Priority Debt' : 'No Debt'}
                    </div>
                  </div>

                  <div id="carry-count" className={`text-6xl font-black leading-none mt-1 ${
                    calcResult.carryOverOffice > 0 ? 'text-red-500' : 'text-[#64748B] opacity-45'
                  }`}>
                    {calcResult.carryOverOffice}
                  </div>
                  <span className="text-[#64748B] text-[10px] uppercase tracking-widest mt-3.5 block font-medium">
                    Carry-over Office Days
                  </span>
                  <p className="text-[#475569] text-xs mt-3 max-w-[180px] leading-relaxed">
                    {calcResult.carryOverOffice > 0 
                      ? "Unfulfilled mandatory office expectation added to your next week's schedule."
                      : "No missing office targets. Baseline carries on cleanly."}
                  </p>
                </div>
              </div>

            </div>

            {/* Calculations Log & Trace Flowchart */}
            <div className="bg-[#161B22] rounded-2xl border border-[#2D3748] shadow-sm overflow-hidden p-6">
              <div className="flex items-center justify-between mb-5 border-b border-[#2D3748] pb-3">
                <div className="flex items-center gap-2">
                  <TrendingDown className="w-5 h-5 text-[#3B82F6]" />
                  <h3 className="font-bold text-white font-display text-base">Resolution & Allocation Trace</h3>
                </div>
                <span className="text-[10px] font-mono text-[#64748B] uppercase tracking-widest">
                  Rule Priority Cycle
                </span>
              </div>

              {/* Initial State Node */}
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-6 h-6 rounded-full bg-[#2D3748] flex items-center justify-center border-2 border-[#161B22] shadow-sm shrink-0">
                      <span className="text-[10px] font-bold text-[#E2E8F0] font-mono">0</span>
                    </div>
                    <div className="w-0.5 h-10 bg-[#2D3748]" />
                  </div>
                  <div className="flex-1 bg-[#0F1115] rounded-xl p-4.5 border border-[#2D3748] text-xs">
                    <div className="flex items-center justify-between font-bold text-white mb-2 pb-1 border-b border-[#2D3748]/30">
                      <span>Standard Schedule Loaded</span>
                      <span className="font-mono bg-[#2D3748] rounded px-1.5 py-0.5 text-[9px] text-[#A3B8CC]">
                        Baseline Load
                      </span>
                    </div>
                    <p className="text-[#94A3B8] text-xs">
                      Starting template values initialized in work profile engine.
                    </p>
                    <div className="flex items-center gap-4 font-mono font-bold text-[#3B82F6] mt-3.5 text-[11px]">
                      <span className="flex items-center gap-1.5"><Building className="w-3.5 h-3.5" /> Expected Office: {settings.targetOfficeDays} d</span>
                      <span className="flex items-center gap-1.5 text-emerald-450"><Home className="w-3.5 h-3.5" /> Expected Remote: {settings.targetRemoteDays} d</span>
                    </div>
                  </div>
                </div>

                {/* Steps mapped dynamically */}
                {calcResult.steps.length === 0 ? (
                  <div className="flex items-start gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-6 h-6 rounded-full bg-emerald-950/50 flex items-center justify-center border-2 border-emerald-900/20 shadow-sm shrink-0">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      </div>
                    </div>
                    <div className="flex-1 bg-emerald-955/10 rounded-xl p-4.5 border border-emerald-500/15 text-xs text-emerald-400">
                      <strong>Perfect Balance: No leaves or holidays scheduled for this week.</strong> Standard configured work days are active and available with zero carry debt.
                    </div>
                  </div>
                ) : (
                  calcResult.steps.map((step, idx) => {
                    const isLast = idx === calcResult.steps.length - 1;
                    
                    // Determine badge decoration based on leave type
                    let badgeColor = 'bg-[#2D3748] text-[#94A3B8]';
                    let headingText = '';
                    if (step.source === 'sickLeave') {
                      badgeColor = 'bg-red-950/40 text-red-400 border-red-900/30';
                      headingText = `Sick Leave Day ${step.dayIndex}`;
                    } else if (step.source === 'annualLeave') {
                      badgeColor = 'bg-emerald-950/40 text-[#10B981] border-emerald-900/30';
                      headingText = `Annual Leave Day ${step.dayIndex}`;
                    } else if (step.source === 'holiday') {
                      badgeColor = 'bg-amber-950/40 text-amber-400 border-amber-900/30';
                      headingText = `Public Holiday Day ${step.dayIndex}`;
                    }

                    return (
                      <div key={step.id} className="flex items-start gap-4">
                        <div className="flex flex-col items-center">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 border-[#161B22] shadow-sm shrink-0 font-mono text-[10px] font-bold ${
                            step.affected === 'office' ? 'bg-[#3B82F6] text-white' : step.affected === 'remote' ? 'bg-[#10B981] text-white' : 'bg-slate-700 text-slate-300'
                          }`}>
                            {idx + 1}
                          </div>
                          {!isLast && <div className="w-0.5 h-14 bg-[#2D3748]" />}
                        </div>
                        <div className="flex-1 bg-[#0F1115] rounded-xl p-4.5 border border-[#2D3748]/60 shadow-md text-xs relative overflow-hidden">
                          {/* Colored vertical indicator to align with dynamic pool drop */}
                          <div className={`absolute top-0 bottom-0 left-0 w-1 ${
                            step.affected === 'office' ? 'bg-[#3B82F6]' : step.affected === 'remote' ? 'bg-[#10B981]' : 'bg-[#2D3748]'
                          }`} />
                          
                          <div className="pl-2">
                            <div className="flex items-center justify-between font-bold text-white mb-2.5">
                              <span className="font-display font-medium text-[13px]">{headingText}</span>
                              <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${badgeColor}`}>
                                {step.source === 'sickLeave' ? 'Rule 3.3' : step.source === 'annualLeave' ? 'Rule 3.4' : 'Rule 3.5'}
                              </span>
                            </div>
                            <p className="text-[#94A3B8] mb-3 leading-relaxed">
                              {step.actionDescription}
                            </p>
                            <div className="flex items-center gap-4 text-[10px] font-bold text-[#64748B] font-mono bg-[#161B22] p-2 rounded border border-[#2D3748]/30">
                              <span className="text-[9px] uppercase font-bold tracking-wider text-[#475569]">Step State:</span>
                              <span className="flex items-center gap-1">
                                Office: <span className="text-white font-normal">{step.targetBefore.office}</span>
                                <ArrowRight className="w-2.5 h-2.5 text-[#475569]" />
                                <span className={step.affected === 'office' ? 'text-white underline font-black decoration-[#3B82F6] underline-offset-2' : 'text-[#A3B8CC]'}>
                                  {step.targetAfter.office}
                                </span>
                              </span>
                              <span className="flex items-center gap-1.5">
                                Remote: <span className="text-white font-normal">{step.targetBefore.remote}</span>
                                <ArrowRight className="w-2.5 h-2.5 text-[#475569]" />
                                <span className={step.affected === 'remote' ? 'text-[#10B981] underline font-black decoration-[#10B981] underline-offset-2' : 'text-[#A3B8CC]'}>
                                  {step.targetAfter.remote}
                                </span>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}

                {/* Final Capped Result Indicator */}
                {calcResult.steps.length > 0 && (
                  <div className="flex items-start gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-0.5 h-4 bg-[#2D3748]" />
                      <div className="w-6 h-6 rounded-full bg-white text-[#0F1115] flex items-center justify-center border border-white shadow-md shrink-0">
                        <span className="text-[10px] font-bold font-mono">✔</span>
                      </div>
                    </div>
                    <div className="flex-1 bg-[#161B22] border border-[#2D3748] text-[#E2E8F0] rounded-xl p-4.5 text-xs">
                      <div className="flex items-center justify-between font-bold mb-2 pb-1 border-b border-[#2D3748]/55">
                        <span className="text-white">Resolved Schedule Balance</span>
                        <span className="bg-[#3B82F6]/20 text-[#3B82F6] text-[9px] px-2 py-0.5 rounded font-bold font-mono border border-[#3B82F6]/25">
                          SYSTEM OK
                        </span>
                      </div>
                      <p className="text-[#94A3B8] text-[11px] mb-3 leading-relaxed">
                        Applying bounds calculations. Negative office days have been converted to next week's unfulfilled priority attendance, saving target requirements securely.
                      </p>
                      <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 font-mono font-bold text-[#E2E8F0] mt-1 text-[11px]">
                        <span className="flex items-center gap-1 text-[#64748B]">Active Office: <strong className="text-white text-sm ml-1">{calcResult.finalOffice} d</strong></span>
                        <span className="flex items-center gap-1.5 text-[#64748B]">Active Remote: <strong className="text-[#10B981] text-sm ml-1">{calcResult.finalRemote} d</strong></span>
                        <span className="flex items-center gap-1 opacity-90 text-[#64748B]">Carry Count: <strong className={`text-sm ml-1 ${calcResult.carryOverOffice > 0 ? 'text-red-400' : 'text-slate-400'}`}>{calcResult.carryOverOffice} d</strong></span>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>

          </div>

        </div>

      </main>

      {/* Primary Footer */}
      <footer className="h-12 bg-[#0A0C10] border-t border-[#2D3748] px-6 sm:px-10 flex items-center justify-between text-[10px] text-[#475569] uppercase tracking-widest mt-12 shrink-0 w-full transition-colors">
        <div className="flex gap-6">
          <span>Ruleset 3.0 Real-time</span>
          <span className="hidden sm:inline">5-Day Week Standard</span>
        </div>
        <div>© 2026 WorkBalance Optimizer</div>
      </footer>

    </div>
  );
}
