import React from 'react';
import { TESTIMONIALS, TEACHER_PROFILE } from '../data/tutorData';
import { Award, CheckCircle2, GraduationCap, HelpCircle, MessageSquareQuote, Star, ShieldCheck } from 'lucide-react';

export const Testimonials: React.FC = () => {
  const faqs = [
    {
      q: "What are the rules for Trial Class booking?",
      a: "Trial classes are available in selected areas of Karachi with a one time payment of PKR 2,500 per class per subject (90-minute diagnostic session)."
    },
    {
      q: "How does Annual Preparation fee calculation work?",
      a: "Annual preparation commences on 1st August and spans a mandatory 10-month course duration. The fee is charged at a constant rate of PKR 12,000 per month per subject."
    },
    {
      q: "Why are Crash Course dates restricted?",
      a: "Crash course admissions are strictly open between 1st Jan and 15th Jan only to maintain intensive cohort focus and exam readiness."
    },
    {
      q: "How do IT Course charges calculate?",
      a: "IT course charges calculate dynamically based on Course Name, Duration (1, 2, or 3 months), and Mode (Online vs Physical Home Tuition)."
    },
    {
      q: "What is the money-back guarantee preparation?",
      a: "Yes, Sir Ali provides money-back guaranteed preparation exclusively for physical, one-on-one sessions. This preparation is available in selected areas of Karachi. If a student does not secure the guaranteed grade, 80% of the fee will be refunded to their parents."
    }
  ];

  return (
    <section className="py-16 bg-[#0a0c10] border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Testimonials Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>Proven Student Success Stories</span>
          </span>
          <h2 className="text-3xl font-serif italic text-amber-500 tracking-tight sm:text-4xl">
            Student & Parent Reviews
          </h2>
          <p className="text-slate-400 text-sm">
            Hear from students and parents across Cambridge O/A Levels, Federal Board, Karachi Board & IT programs.
          </p>
        </div>

        {/* Testimonial Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {TESTIMONIALS.map((item, idx) => (
            <div key={idx} className="bg-[#0f1218] p-6 rounded-xl border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-all shadow-xl">
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-slate-300 text-xs leading-relaxed italic">
                  "{item.quote}"
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800 mt-4">
                <div className="font-bold text-white text-sm">{item.name}</div>
                <div className="text-[11px] font-semibold text-amber-400">{item.role}</div>
                <div className="text-[10px] text-slate-500 font-medium">{item.board}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Frequently Asked Questions */}
        <div className="pt-8 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h3 className="text-2xl font-serif italic text-white flex items-center justify-center gap-2">
              <HelpCircle className="w-5 h-5 text-amber-400" />
              <span>Frequently Asked Questions</span>
            </h3>
            <p className="text-slate-400 text-xs">
              Clear information about tuition policies, dates, and fee structures.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-[#0f1218] p-5 rounded-xl border border-slate-800 space-y-1.5 shadow-md">
                <h4 className="font-bold text-white text-sm flex items-start gap-2">
                  <span className="text-amber-400 font-serif italic font-extrabold">Q.</span>
                  <span>{faq.q}</span>
                </h4>
                <p className="text-slate-400 text-xs leading-relaxed pl-5">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
