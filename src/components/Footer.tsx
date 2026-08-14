import React from 'react';
import { TEACHER_PROFILE } from '../data/tutorData';
import { Award, Database, GraduationCap, Laptop, MapPin, Mail, Phone, ShieldCheck } from 'lucide-react';

interface FooterProps {
  onNavigate: (tabId: string) => void;
  onOpenGoogleSheetModal: () => void;
  onOpenDashboard: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onOpenGoogleSheetModal,
  onOpenDashboard
}) => {
  return (
    <footer className="bg-[#07080b] text-slate-300 pt-16 pb-12 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Main Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Col 1: Brand & Legacy */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center font-black text-slate-950 text-lg shadow-lg">
                SA
              </div>
              <div>
                <h4 className="font-serif italic font-bold text-white text-base leading-tight">{TEACHER_PROFILE.name}</h4>
                <p className="text-xs text-amber-500/80">Science & IT Private Tuition</p>
              </div>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed">
              Sir Ali is a premier educator dedicated to transforming how children learn, offering elite home tuition since 1992 and interactive online classes since 2015.
            </p>

            <div className="flex flex-col gap-1.5 text-xs text-slate-400 font-medium pt-1">
              <span className="flex items-center gap-1.5 text-amber-400">
                <Award className="w-3.5 h-3.5 shrink-0" />
                <span>Home Tuitions Since 1992 (34+ Yrs)</span>
              </span>
              <span className="flex items-center gap-1.5 text-amber-400/80">
                <Laptop className="w-3.5 h-3.5 shrink-0" />
                <span>Online Classes Since 2015 (11+ Yrs)</span>
              </span>
            </div>
          </div>

          {/* Col 2: Tuition Coverage */}
          <div className="space-y-3">
            <h5 className="font-serif italic text-amber-500 text-sm tracking-wide">Tuition Coverage</h5>
            <p className="text-xs text-slate-400 leading-relaxed">
              <strong className="text-slate-200">Online Classes:</strong> Worldwide (Pakistan, Middle East, UK, USA, Canada via Zoom).
            </p>
            <p className="text-xs text-slate-400 leading-relaxed">
              <strong className="text-slate-200">Home Tuitions (Karachi):</strong> DHA, PECHS, Gulshan-e-Iqbal, North Nazimabad, Federal B Area, Bahadurabad, Tariq road, KDA Scheme 1, Askari & Jauhar.
            </p>
          </div>

          {/* Col 4: Contact & Database */}
          <div className="space-y-3">
            <h5 className="font-serif italic text-amber-500 text-sm tracking-wide">Direct Contact</h5>
            <div className="space-y-2 text-xs text-slate-300">
              <a
                href="https://wa.me/923022324503"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-emerald-400 font-semibold hover:underline"
              >
                <Phone className="w-4 h-4" />
                <span>+92 302 2324503 (WhatsApp)</span>
              </a>
              <a href="mailto:sagtut@gmail.com" className="flex items-center gap-2 text-slate-400 hover:text-amber-400 transition-colors">
                <Mail className="w-4 h-4 text-amber-400" />
                <span>sagtut@gmail.com</span>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div>
            © {new Date().getFullYear()} {TEACHER_PROFILE.name}. All rights reserved.
          </div>
          <div className="flex items-center gap-4 text-slate-500">
            <button
              onClick={onOpenDashboard}
              className="text-slate-600 hover:text-slate-400 transition-colors text-[11px]"
              title="Admin Dashboard"
            >
              Teacher Admin
            </button>
            <span>•</span>
            <span>Powered by Team Smarizsoft</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
