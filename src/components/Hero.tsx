import React from 'react';
import { Award, BookOpen, Calculator, Calendar, CheckCircle2, ChevronRight, GraduationCap, Laptop, Sparkles, Star } from 'lucide-react';
import { TEACHER_PROFILE } from '../data/tutorData';

interface HeroProps {
  onNavigate: (tabId: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  return (
    <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-[#1a1e26] via-[#0a0c10] to-[#0a0c10] text-slate-300 pt-12 pb-16 lg:pt-16 lg:pb-24 border-b border-slate-800">
      {/* Background Decorative Ambient Gradients */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Main Hero Column */}
          <div className="lg:col-span-7 space-y-6">
            {/* Experience Pill Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/30">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>Home Tuitions Since 1992 ({TEACHER_PROFILE.totalYearsHome}+ Yrs)</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                <Laptop className="w-3.5 h-3.5 text-cyan-400" />
                <span>Online Classes Since 2015 ({TEACHER_PROFILE.totalYearsOnline}+ Yrs)</span>
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-white tracking-tight leading-tight">
              <span className="font-serif italic text-amber-500">
                Excellence in Education
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-400 max-w-2xl font-normal leading-relaxed">
              Specialized conceptual learning & past paper mastery for <strong className="text-slate-200">Cambridge (O/A Levels)</strong>, 
              <strong className="text-slate-200"> Karachi Board</strong>, <strong className="text-slate-200">Federal Board (FBISE)</strong>, <strong className="text-slate-200">AKU-EB</strong> & practical <strong className="text-slate-200">IT Courses</strong>.
            </p>

            {/* Core Boards & Features Checkmarks */}
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 pt-2 text-xs sm:text-sm text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Cambridge O/A Level (CAIE)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Karachi Board XI/XII BIEK & BSEK</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Federal Board (FBISE) SLOs</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>AKU-EB Conceptual CRQs</span>
              </div>
            </div>

            {/* CTA Buttons Row */}
            <div className="flex flex-wrap items-center gap-3 pt-4">
              <button
                onClick={() => onNavigate('trial')}
                className="px-6 py-3.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs uppercase tracking-widest shadow-xl transition-all flex items-center gap-2"
              >
                <Calendar className="w-4 h-4 text-slate-950" />
                <span>Book Trial Class (PKR 2,500)</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate('calculators')}
                className="px-5 py-3.5 rounded-lg bg-[#0f1218] hover:bg-slate-800 text-slate-200 font-bold text-xs uppercase tracking-wider border border-slate-800 hover:border-amber-500/40 transition-all flex items-center gap-2"
              >
                <Calculator className="w-4 h-4 text-amber-400" />
                <span>Fee Calculators</span>
              </button>

              <button
                onClick={() => onNavigate('it_courses')}
                className="px-5 py-3.5 rounded-lg bg-[#0f1218] hover:bg-slate-800 text-slate-200 font-bold text-xs uppercase tracking-wider border border-slate-800 hover:border-cyan-500/40 transition-all flex items-center gap-2"
              >
                <Laptop className="w-4 h-4 text-cyan-400" />
                <span>IT Courses</span>
              </button>
            </div>
          </div>

          {/* Teacher Highlight Card & Quick Info */}
          <div className="lg:col-span-5">
            <div className="bg-[#0f1218] rounded-xl p-6 sm:p-8 border border-slate-800 shadow-2xl relative">
              <div className="absolute -top-3 -right-3 px-3 py-1 bg-amber-500 text-slate-950 font-extrabold text-[10px] uppercase tracking-widest rounded-full shadow-md flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-slate-950" />
                <span>Master Educator</span>
              </div>

              <div className="flex items-center gap-4 pb-6 border-b border-slate-800">
                <div className="w-14 h-14 rounded-lg bg-amber-500 text-slate-950 font-serif font-black text-xl flex items-center justify-center shadow-lg">
                  SA
                </div>
                <div>
                  <h3 className="text-xl font-serif italic text-white">{TEACHER_PROFILE.name}</h3>
                  <p className="text-xs text-amber-400 font-semibold">{TEACHER_PROFILE.title}</p>
                  <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                    <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                    <span>MSC, BSIT, Oracle 9i, DIT</span>
                  </p>
                </div>
              </div>

              {/* Course & Pricing Key Highlights */}
              <div className="py-6 space-y-3 text-xs sm:text-sm">
                <div className="flex items-start justify-between bg-slate-900/60 p-3.5 rounded-lg border border-slate-800">
                  <div>
                    <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider block">90-Min Trial Class</span>
                    <span className="font-bold text-slate-200">Diagnostic Session</span>
                  </div>
                  <span className="text-amber-400 font-serif italic font-bold text-base">PKR 2,500</span>
                </div>

                <div className="flex items-start justify-between bg-slate-900/60 p-3.5 rounded-lg border border-slate-800">
                  <div>
                    <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider block">Annual Preparation (Aug 1st)</span>
                    <span className="font-bold text-slate-200">10-Month Syllabus</span>
                  </div>
                  <span className="text-amber-400 font-serif italic font-bold text-base">PKR 12,000<span className="text-xs font-sans font-normal text-slate-500">/mo/sub</span></span>
                </div>

                <div className="flex items-start justify-between bg-slate-900/60 p-3.5 rounded-lg border border-slate-800">
                  <div>
                    <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider block">Crash Prep (Jan 1 - 15)</span>
                    <span className="font-bold text-slate-200">Theory & Past Papers</span>
                  </div>
                  <div className="text-right">
                    <span className="text-amber-400 font-serif italic font-bold text-base block">PKR 120,000<span className="text-xs font-sans font-normal text-slate-400">/sub</span></span>
                    <span className="text-[10px] font-semibold text-amber-500/90 block">Advance Lump Sum</span>
                  </div>
                </div>
              </div>

              {/* Stats Footer inside Card */}
              <div className="grid grid-cols-3 gap-2 text-center pt-4 border-t border-slate-800 text-slate-300">
                <div>
                  <div className="text-lg font-serif italic text-white">34+ Yrs</div>
                  <div className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Home Tuitions</div>
                </div>
                <div>
                  <div className="text-lg font-serif italic text-cyan-400">11+ Yrs</div>
                  <div className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Online Classes</div>
                </div>
                <div>
                  <div className="text-lg font-serif italic text-amber-400">98% A/A*</div>
                  <div className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Grade Success</div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
