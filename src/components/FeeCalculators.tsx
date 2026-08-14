import React, { useState } from 'react';
import { calculateAnnualFee, calculateCrashFee, formatPKR } from '../utils/calculatorUtils';
import { SubjectType, TuitionMode } from '../types';
import { Calculator, CheckCircle2, ChevronRight, HelpCircle, Info, Sparkles, ShieldCheck } from 'lucide-react';

interface FeeCalculatorsProps {
  onApplyAnnualSelections: (subjects: SubjectType[]) => void;
  onApplyCrashSelections: (subjects: SubjectType[], duration: '1 Month Intensive' | '2 Months Complete', mode: TuitionMode) => void;
}

const ALL_SUBJECTS: SubjectType[] = ['Physics', 'Chemistry', 'Mathematics', 'Additional Mathematics', 'Computer Science'];

export const FeeCalculators: React.FC<FeeCalculatorsProps> = ({
  onApplyAnnualSelections,
  onApplyCrashSelections
}) => {
  const [activeTab, setActiveTab] = useState<'annual' | 'crash'>('annual');

  // Annual Calculator State
  const [annualSubjects, setAnnualSubjects] = useState<SubjectType[]>(['Physics', 'Chemistry']);

  // Crash Calculator State
  const [crashSubjects, setCrashSubjects] = useState<SubjectType[]>(['Physics']);
  const [crashDuration, setCrashDuration] = useState<'1 Month Intensive' | '2 Months Complete'>('1 Month Intensive');
  const [crashMode, setCrashMode] = useState<TuitionMode>('Online Class (Zoom/Google Meet)');

  // Toggle Annual Subject
  const toggleAnnualSubject = (subject: SubjectType) => {
    if (annualSubjects.includes(subject)) {
      if (annualSubjects.length > 1) {
        setAnnualSubjects(annualSubjects.filter(s => s !== subject));
      }
    } else {
      setAnnualSubjects([...annualSubjects, subject]);
    }
  };

  // Toggle Crash Subject
  const toggleCrashSubject = (subject: SubjectType) => {
    if (crashSubjects.includes(subject)) {
      if (crashSubjects.length > 1) {
        setCrashSubjects(crashSubjects.filter(s => s !== subject));
      }
    } else {
      setCrashSubjects([...crashSubjects, subject]);
    }
  };

  // Perform Calculations
  const annualCalc = calculateAnnualFee(annualSubjects.length);
  const crashCalc = calculateCrashFee(crashSubjects, crashDuration, crashMode);

  return (
    <section id="calculators" className="py-16 bg-[#0a0c10] border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <Calculator className="w-3.5 h-3.5 text-amber-400" />
            <span>Transparent Pricing Engines</span>
          </span>
          <h2 className="text-3xl font-serif italic text-amber-500 tracking-tight sm:text-4xl">
            Tuition Fee Calculators
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Instantly calculate your tuition investment for <strong className="text-slate-200">Annual Preparation (10-Month Course)</strong> or <strong className="text-slate-200">Crash Revision Courses</strong>.
          </p>
        </div>

        {/* Tab Switcher Buttons */}
        <div className="flex justify-center">
          <div className="inline-flex p-1.5 rounded-xl bg-slate-900 border border-slate-800">
            <button
              onClick={() => setActiveTab('annual')}
              className={`px-6 py-2.5 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                activeTab === 'annual'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>Annual Preparation Calculator</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-widest ${
                activeTab === 'annual' ? 'bg-slate-950 text-amber-400' : 'bg-slate-800 text-slate-400'
              }`}>
                Aug 1st Start
              </span>
            </button>

            <button
              onClick={() => setActiveTab('crash')}
              className={`px-6 py-2.5 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                activeTab === 'crash'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>Crash / Short Course Calculator</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-widest ${
                activeTab === 'crash' ? 'bg-slate-950 text-amber-400' : 'bg-slate-800 text-amber-400/80'
              }`}>
                Jan 1-15 Window
              </span>
            </button>
          </div>
        </div>

        {/* CALCULATOR 1: ANNUAL PREPARATION CALCULATOR */}
        {activeTab === 'annual' && (
          <div className="bg-[#0f1218] p-6 sm:p-10 rounded-xl border border-slate-800 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Options Left Column */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <h3 className="text-xl font-serif italic text-white flex items-center gap-2">
                  <span>Annual Preparation Calculator</span>
                  <span className="text-xs font-sans not-italic text-slate-500">(10-Month Course)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Fixed fee of <strong className="text-amber-400">PKR 12,000 per month per subject</strong> for complete syllabus coverage and past paper practice.
                </p>
              </div>

              {/* Subject Selection Multi-Select */}
              <div className="space-y-3">
                <label className="text-[10px] font-extrabold text-amber-500 uppercase tracking-widest block">
                  Select Subjects ({annualSubjects.length} Selected)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {ALL_SUBJECTS.map((subj) => {
                    const isSelected = annualSubjects.includes(subj);
                    return (
                      <button
                        key={subj}
                        type="button"
                        onClick={() => toggleAnnualSubject(subj)}
                        className={`p-3 rounded-lg border text-left text-xs font-bold transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-amber-500/20 text-amber-400 border-amber-500/60 shadow-sm'
                            : 'bg-slate-900/60 text-slate-300 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <span>{subj}</span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Course Duration Mandatory Badge */}
              <div className="bg-slate-900/80 p-4 rounded-lg border border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-amber-400 shrink-0" />
                  <div>
                    <span className="font-bold text-slate-200 block">Mandatory 10-Month Duration</span>
                    <span className="text-slate-500 text-[11px]">Course commences 1st August each academic year.</span>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-md bg-amber-500/10 text-amber-400 font-extrabold text-[10px] uppercase tracking-widest border border-amber-500/30">
                  10 Months
                </span>
              </div>
            </div>

            {/* Calculations Output Right Column */}
            <div className="lg:col-span-5 bg-[#0a0c10] p-6 sm:p-8 rounded-xl border border-slate-800 shadow-xl space-y-6">
              <h4 className="text-base font-serif italic text-white border-b pb-3 border-slate-800 flex items-center justify-between">
                <span>Fee Summary Breakdown</span>
                <span className="text-xs font-sans not-italic font-bold text-amber-400">{annualSubjects.length} Subject(s)</span>
              </h4>

              <div className="space-y-3 text-xs sm:text-sm">
                <div className="flex justify-between items-center text-slate-400">
                  <span>Fee Rate per Month per Subject:</span>
                  <span className="font-bold text-white">PKR 12,000</span>
                </div>

                <div className="flex justify-between items-center text-slate-400">
                  <span>Selected Subjects ({annualSubjects.length}):</span>
                  <span className="font-semibold text-slate-200">{annualSubjects.join(', ')}</span>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-slate-800 text-slate-300">
                  <span className="font-semibold">Total Monthly Installment:</span>
                  <span className="font-serif italic font-bold text-amber-400 text-xl">
                    {formatPKR(annualCalc.totalMonthlyFee)}<span className="text-xs font-sans not-italic font-normal text-slate-500">/mo</span>
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 rounded-lg bg-slate-900 border border-slate-800">
                  <div>
                    <span className="font-bold text-white block text-xs">10-Month Full Course Total:</span>
                    <span className="text-[10px] text-slate-500">Standard monthly payment plan</span>
                  </div>
                  <span className="font-serif italic font-bold text-white text-lg">
                    {formatPKR(annualCalc.totalFullCourseFee)}
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 rounded-lg bg-emerald-950/40 border border-emerald-800/60 text-emerald-200">
                  <div>
                    <span className="font-bold block text-xs text-emerald-300">Lump Sum Advance (5% Discount):</span>
                    <span className="text-[10px] text-emerald-400">Save {formatPKR(annualCalc.lumpSumDiscount)} on advance payment</span>
                  </div>
                  <span className="font-serif italic font-bold text-emerald-400 text-lg">
                    {formatPKR(annualCalc.lumpSumTotal)}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onApplyAnnualSelections(annualSubjects)}
                className="w-full py-3.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs uppercase tracking-widest shadow-xl transition-all flex items-center justify-center gap-2"
              >
                <span>Proceed to Annual Booking</span>
                <ChevronRight className="w-4 h-4 text-slate-950" />
              </button>
            </div>

          </div>
        )}

        {/* CALCULATOR 2: CRASH / SHORT COURSE CALCULATOR */}
        {activeTab === 'crash' && (
          <div className="bg-[#0f1218] p-6 sm:p-10 rounded-xl border border-slate-800 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Options Left Column */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-serif italic text-white">Crash & Short Course Calculator</h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-amber-500/10 text-amber-400 border border-amber-500/30">
                    Jan 1 - 15 Window
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Intensive exam revision, topical paper drill, and high-frequency exam questions focus.
                </p>
              </div>

              {/* Subject Selection */}
              <div className="space-y-3">
                <label className="text-[10px] font-extrabold text-amber-500 uppercase tracking-widest block">
                  Select Crash Subjects ({crashSubjects.length} Selected)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {ALL_SUBJECTS.map((subj) => {
                    const isSelected = crashSubjects.includes(subj);
                    return (
                      <button
                        key={subj}
                        type="button"
                        onClick={() => toggleCrashSubject(subj)}
                        className={`p-3 rounded-lg border text-left text-xs font-bold transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-amber-500/20 text-amber-400 border-amber-500/60 shadow-sm'
                            : 'bg-slate-900/60 text-slate-300 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <span>{subj}</span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Crash Duration Option */}
              <div className="space-y-3">
                <label className="text-[10px] font-extrabold text-amber-500 uppercase tracking-widest block">
                  Crash Course Package Duration
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setCrashDuration('1 Month Intensive')}
                    className={`p-3.5 rounded-lg border text-left text-xs transition-all ${
                      crashDuration === '1 Month Intensive'
                        ? 'bg-amber-500/20 border-amber-500/60 text-amber-300 font-bold'
                        : 'bg-slate-900/60 border-slate-800 text-slate-300 font-medium hover:border-slate-700'
                    }`}
                  >
                    <div className="font-bold text-white text-sm">1 Month Intensive</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">Topical Past Paper Solving & Exam Tips</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCrashDuration('2 Months Complete')}
                    className={`p-3.5 rounded-lg border text-left text-xs transition-all ${
                      crashDuration === '2 Months Complete'
                        ? 'bg-amber-500/20 border-amber-500/60 text-amber-300 font-bold'
                        : 'bg-slate-900/60 border-slate-800 text-slate-300 font-medium hover:border-slate-700'
                    }`}
                  >
                    <div className="font-bold text-white text-sm">2 Months Complete</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">Full Theory Revision + Year 2012-2025 Solved</div>
                  </button>
                </div>
              </div>

              {/* Class Mode Option */}
              <div className="space-y-3">
                <label className="text-[10px] font-extrabold text-amber-500 uppercase tracking-widest block">
                  Tuition Delivery Mode
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setCrashMode('Online Class (Zoom/Google Meet)')}
                    className={`p-3.5 rounded-lg border text-left text-xs transition-all ${
                      crashMode === 'Online Class (Zoom/Google Meet)'
                        ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-300 font-bold'
                        : 'bg-slate-900/60 border-slate-800 text-slate-300 font-medium hover:border-slate-700'
                    }`}
                  >
                    <div className="font-bold text-white">🌐 Online Class</div>
                    <div className="text-[11px] text-slate-400">Interactive Tablet Whiteboard</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCrashMode('Physical / Home Tuition (In-Person)')}
                    className={`p-3.5 rounded-lg border text-left text-xs transition-all ${
                      crashMode === 'Physical / Home Tuition (In-Person)'
                        ? 'bg-amber-500/10 border-amber-500/50 text-amber-300 font-bold'
                        : 'bg-slate-900/60 border-slate-800 text-slate-300 font-medium hover:border-slate-700'
                    }`}
                  >
                    <div className="font-bold text-white">🏠 Physical Home Tuition</div>
                    <div className="text-[11px] text-slate-400">In-Person One-on-One (+25% travel fee)</div>
                  </button>
                </div>
              </div>

            </div>

            {/* Calculations Output Right Column */}
            <div className="lg:col-span-5 bg-[#0a0c10] p-6 sm:p-8 rounded-xl border border-slate-800 shadow-xl space-y-6">
              <h4 className="text-base font-serif italic text-white border-b pb-3 border-slate-800 flex items-center justify-between">
                <span>Crash Fee Estimate</span>
                <span className="text-xs font-sans not-italic font-bold text-amber-400">{crashSubjects.length} Subject(s)</span>
              </h4>

              <div className="space-y-3 text-xs sm:text-sm">
                <div className="flex justify-between items-center text-slate-400">
                  <span>Selected Duration:</span>
                  <span className="font-semibold text-white">{crashDuration}</span>
                </div>

                <div className="flex justify-between items-center text-slate-400">
                  <span>Fee Per Subject (Theory & Past Papers):</span>
                  <span className="font-semibold text-amber-400">{formatPKR(crashCalc.basePerSubject)}</span>
                </div>

                <div className="flex justify-between items-center text-slate-400">
                  <span>Payment Plan:</span>
                  <span className="font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 text-xs">
                    Advance Lump Sum (Not Monthly)
                  </span>
                </div>

                <div className="flex justify-between items-center text-slate-400">
                  <span>Selected Subjects ({crashSubjects.length}):</span>
                  <span className="font-semibold text-slate-200">{crashSubjects.join(', ')}</span>
                </div>

                <div className="flex justify-between items-center text-slate-400">
                  <span>Class Mode:</span>
                  <span className="font-semibold text-slate-200">{crashMode.split(' ')[0]}</span>
                </div>

                <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-amber-300">
                  <div>
                    <span className="font-bold text-xs block text-white">Total Advance Lump Sum Fee:</span>
                    <span className="text-[10px] text-amber-400">Full Theory & Past Paper Coverage</span>
                  </div>
                  <span className="font-serif italic font-bold text-amber-400 text-2xl">
                    {formatPKR(crashCalc.total)}
                  </span>
                </div>
              </div>

              <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
                <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-200">Important Rule:</strong> Crash Course booking dates are strictly restricted to 
                  <strong className="text-amber-400"> 1st Jan – 15th Jan</strong>. Bookings will be blocked outside this period.
                </span>
              </div>

              <button
                type="button"
                onClick={() => onApplyCrashSelections(crashSubjects, crashDuration, crashMode)}
                className="w-full py-3.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs uppercase tracking-widest shadow-xl transition-all flex items-center justify-center gap-2"
              >
                <span>Proceed to Crash Course Booking</span>
                <ChevronRight className="w-4 h-4 text-slate-950" />
              </button>
            </div>

          </div>
        )}

      </div>
    </section>
  );
};
