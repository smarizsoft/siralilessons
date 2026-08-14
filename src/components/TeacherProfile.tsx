import React from 'react';
import { BOARDS_LIST, SUBJECTS_LIST, TEACHER_PROFILE } from '../data/tutorData';
import { Atom, Binary, BookCheck, Calculator, CheckCircle2, FlaskConical, GraduationCap, Laptop, Sparkles, Trophy } from 'lucide-react';

interface TeacherProfileProps {
  onNavigate: (tabId: string) => void;
}

export const TeacherProfile: React.FC<TeacherProfileProps> = ({ onNavigate }) => {
  const getSubjectIcon = (iconName: string) => {
    switch (iconName) {
      case 'Atom': return <Atom className="w-6 h-6 text-amber-400" />;
      case 'FlaskConical': return <FlaskConical className="w-6 h-6 text-emerald-400" />;
      case 'Calculator': return <Calculator className="w-6 h-6 text-amber-400" />;
      case 'Binary': return <Binary className="w-6 h-6 text-cyan-400" />;
      case 'Laptop': return <Laptop className="w-6 h-6 text-cyan-400" />;
      default: return <BookCheck className="w-6 h-6 text-amber-400" />;
    }
  };

  return (
    <section id="about" className="py-16 bg-[#0a0c10] border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>34+ Years Teaching Legacy</span>
          </span>
          <h2 className="text-3xl font-serif italic text-amber-500 tracking-tight sm:text-4xl">
            About {TEACHER_PROFILE.name}
          </h2>
          <p className="text-slate-300 text-base leading-relaxed font-medium">
            Sir Ali is a premier educator dedicated to transforming how children learn, offering elite home tuition since 1992 and interactive online classes since 2015.
          </p>
        </div>

        {/* Why Parents Trust Sir Ali Grid */}
        <div className="bg-[#0f1218] p-6 sm:p-8 rounded-xl border border-slate-800 shadow-xl space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-1">
            <h3 className="text-2xl font-serif italic text-amber-400">Why Parents Trust Sir Ali</h3>
            <p className="text-slate-400 text-xs sm:text-sm">
              Dedicated to building confidence, conceptual clarity, and academic excellence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="bg-[#0a0c10] p-5 rounded-lg border border-slate-800/80 space-y-1.5 hover:border-amber-500/30 transition-all">
              <h4 className="font-bold text-amber-400 text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Proven Track Record</span>
              </h4>
              <p className="text-slate-300 text-xs leading-relaxed pl-6">
                Over 30 years of academic mentoring experience.
              </p>
            </div>

            <div className="bg-[#0a0c10] p-5 rounded-lg border border-slate-800/80 space-y-1.5 hover:border-amber-500/30 transition-all">
              <h4 className="font-bold text-amber-400 text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Dual Learning Modes</span>
              </h4>
              <p className="text-slate-300 text-xs leading-relaxed pl-6">
                Flexible in-person home tutoring or seamless digital sessions.
              </p>
            </div>

            <div className="bg-[#0a0c10] p-5 rounded-lg border border-slate-800/80 space-y-1.5 hover:border-amber-500/30 transition-all">
              <h4 className="font-bold text-amber-400 text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Science Mastery</span>
              </h4>
              <p className="text-slate-300 text-xs leading-relaxed pl-6">
                Simplifies complex physics, chemistry, and biology concepts for students.
              </p>
            </div>

            <div className="bg-[#0a0c10] p-5 rounded-lg border border-slate-800/80 space-y-1.5 hover:border-amber-500/30 transition-all">
              <h4 className="font-bold text-amber-400 text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Future-Ready IT</span>
              </h4>
              <p className="text-slate-300 text-xs leading-relaxed pl-6">
                Builds vital tech skills through specialized computer and informatics courses.
              </p>
            </div>

            <div className="bg-[#0a0c10] p-5 rounded-lg border border-slate-800/80 space-y-1.5 hover:border-amber-500/30 transition-all">
              <h4 className="font-bold text-amber-400 text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Tailored Approach</span>
              </h4>
              <p className="text-slate-300 text-xs leading-relaxed pl-6">
                Customizes lesson paces to match your child's unique learning style.
              </p>
            </div>

            <div className="bg-[#0a0c10] p-5 rounded-lg border border-slate-800/80 space-y-1.5 hover:border-amber-500/30 transition-all">
              <h4 className="font-bold text-amber-400 text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Confidence Development</span>
              </h4>
              <p className="text-slate-300 text-xs leading-relaxed pl-6">
                Focuses on deep conceptual understanding to raise exam scores.
              </p>
            </div>
          </div>
        </div>

        {/* 2-Column Experience Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* Online Tuitions Column */}
          <div className="bg-[#0f1218] p-8 rounded-xl border border-slate-800 shadow-xl flex flex-col justify-between hover:border-slate-700 transition-all">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-800 flex items-center justify-center font-bold text-xl">
                    <Laptop className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-serif italic text-white">Online Classes</h3>
                    <p className="text-xs font-semibold text-cyan-400">Active Since 2015 (11+ Years)</p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                  Global Reach
                </span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                Conducting high-interactivity virtual classrooms using Zoom, Google Meet, and interactive digital writing tablets. 
                Full digital whiteboards, HD session recordings, online quiz submissions, and real-time PDF notes sharing for students in Pakistan, UAE, UK, and Saudi Arabia.
              </p>
              <ul className="space-y-2 text-xs text-slate-300 font-medium pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  <span>Interactive Digital Tablet & Stylus Whiteboard</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  <span>Recorded Sessions & On-Demand Homework Help</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  <span>Digital Past Paper Marking & Diagnostic Reports</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Home Tuitions Column */}
          <div className="bg-[#0f1218] p-8 rounded-xl border border-slate-800 shadow-xl flex flex-col justify-between hover:border-slate-700 transition-all">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-amber-950 text-amber-400 border border-amber-800 flex items-center justify-center font-bold text-xl">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-serif italic text-white">Home Tuitions</h3>
                    <p className="text-xs font-semibold text-amber-400">Active Since 1992 (34+ Years)</p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-amber-500/10 text-amber-300 border border-amber-500/30">
                  In-Person Excellence
                </span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                Over 34 years of dedicated one-on-one and small group home tuition in premier residential areas of Karachi. 
                Disciplined physical coaching, rigorous paper solve drills, and individual attention tailored to every student's unique learning pace.
              </p>
              <ul className="space-y-2 text-xs text-slate-300 font-medium pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  <span>One-on-One Personalized In-Person Instruction</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  <span>Weekly Physical Tests & Parent Progress Updates</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  <span>Punctual, Highly Disciplined & Trustworthy Legacy</span>
                </li>
              </ul>
            </div>
          </div>

        </div>

        {/* Educational Boards Covered Grid */}
        <div id="courses" className="space-y-6 pt-4">
          <div className="text-center max-w-2xl mx-auto">
            <h3 className="text-2xl font-serif italic text-white">Educational Boards Prepared</h3>
            <p className="text-slate-400 text-sm mt-1">
              Customized exam strategies tailored to specific board criteria and question patterns.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {BOARDS_LIST.map((board) => (
              <div key={board.id} className="bg-[#0f1218] p-6 rounded-xl border border-slate-800 hover:border-amber-500/40 transition-all shadow-xl flex flex-col justify-between">
                <div>
                  <span className="inline-block px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-widest bg-amber-500/10 text-amber-400 mb-3 border border-amber-500/30">
                    {board.badge}
                  </span>
                  <h4 className="font-serif text-white text-base mb-2">{board.name}</h4>
                  <p className="text-slate-400 text-xs leading-relaxed">{board.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Core Academic Subjects */}
        <div className="space-y-6 pt-4">
          <div className="text-center max-w-2xl mx-auto">
            <h3 className="text-2xl font-serif italic text-white">Academic & Science Subjects</h3>
            <p className="text-slate-400 text-sm mt-1">
              Complete theoretical clarity, numerical problem solving, and topical past papers (Years 2000 - 2025).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {SUBJECTS_LIST.map((subject) => (
              <div key={subject.name} className="bg-[#0f1218] p-5 rounded-xl border border-slate-800 shadow-xl hover:border-amber-500/40 transition-all flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center">
                    {getSubjectIcon(subject.iconName)}
                  </div>
                  <div>
                    <h4 className="font-serif text-white text-base">{subject.name}</h4>
                    <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider block mt-0.5">{subject.code}</span>
                  </div>
                  <p className="text-slate-400 text-xs leading-normal">{subject.desc}</p>
                </div>
                <button
                  onClick={() => onNavigate('annual')}
                  className="mt-4 w-full py-2 rounded-lg bg-slate-900 hover:bg-amber-500/10 hover:border-amber-500/40 text-amber-400 text-xs font-bold uppercase tracking-wider transition-colors text-center border border-slate-800"
                >
                  Book Course →
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
