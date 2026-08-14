import React, { useState } from 'react';
import { Award, Calculator, CalendarCheck, Laptop, Phone, ShieldCheck, Database, Menu, X, Mail, FileText } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenGoogleSheetModal: () => void;
  onOpenDashboard: () => void;
  bookingsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenGoogleSheetModal,
  onOpenDashboard,
  bookingsCount
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'about', label: 'About' },
    { id: 'courses', label: 'Subjects & Boards' },
    { id: 'calculators', label: 'Fee Calculators', icon: Calculator },
    { id: 'custom_curriculum', label: 'Custom Curriculum', icon: FileText },
    { id: 'annual', label: 'Annual Preparation' },
    { id: 'crash', label: 'Crash Course' },
    { id: 'it_courses', label: 'IT Courses' },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0f1218]/95 backdrop-blur-md border-b border-slate-800 shadow-xl">
      {/* Top Banner with Teaching Legacy Badges */}
      <div className="bg-[#0a0c10] text-slate-400 text-xs py-2 px-4 sm:px-8 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 font-medium">
            <span className="flex items-center gap-1.5 text-amber-400 font-semibold">
              <Award className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>A1 grade money back guaranteed preparation</span>
            </span>
            <span className="hidden sm:inline text-slate-700">|</span>
            <a href="mailto:sagtut@gmail.com" className="flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 transition-colors">
              <Mail className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>sagtut@gmail.com</span>
            </a>
            <span className="hidden md:inline text-slate-700">|</span>
            <span className="hidden md:inline text-slate-300 font-serif italic">
              Cambridge • Karachi Board • FBISE • AKU-EB
            </span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://wa.me/923022324503"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors flex items-center gap-1"
            >
              <Phone className="w-3 h-3" />
              <span>+92 302 2324503</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Header Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex items-center justify-between">
          {/* Logo & Teacher Title */}
          <div 
            onClick={() => handleNavClick('about')}
            className="cursor-pointer group flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-lg bg-amber-500 text-slate-950 font-bold font-serif text-xl flex items-center justify-center shadow-lg group-hover:bg-amber-400 transition-colors">
              SA
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-serif italic text-white tracking-tight leading-none group-hover:text-amber-400 transition-colors">
                  Sir Ali
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  Est. 1992
                </span>
              </div>
              <p className="text-[10px] uppercase tracking-wider text-amber-500 font-semibold mt-1">
                Excellence in Education
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1.5 text-xs font-semibold">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeTab === link.id
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/40 font-bold shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Action CTAs: Direct Book */}
          <div className="hidden sm:flex items-center gap-2.5">
            <button
              onClick={() => handleNavClick('annual')}
              className="px-4 py-2 rounded-lg bg-amber-500/10 border border-amber-500/50 text-amber-400 hover:bg-amber-500 hover:text-slate-950 text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-md"
            >
              <CalendarCheck className="w-4 h-4" />
              <span>Enroll Now</span>
            </button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-300 hover:bg-slate-800 focus:outline-hidden"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-3 pt-3 border-t border-slate-800 flex flex-col gap-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`text-left px-3 py-2 rounded-md text-xs font-semibold ${
                  activeTab === link.id
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 font-bold'
                    : 'text-slate-300 hover:bg-slate-800/80'
                }`}
              >
                {link.label}
              </button>
            ))}

            <div className="pt-2 mt-2 border-t border-slate-800 flex flex-col gap-2">
              <button
                onClick={() => handleNavClick('annual')}
                className="w-full text-center py-2.5 rounded-lg bg-amber-500 text-slate-950 text-xs font-extrabold uppercase tracking-wider shadow-md"
              >
                Enroll in Annual Preparation
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
