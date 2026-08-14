import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Phone, Mail, Globe, CheckCircle2, Sparkles, ShieldCheck, ArrowRight, Pause, Play, GraduationCap } from 'lucide-react';

// Imported generated 16:9 banner images matching Sir Ali Academy banners
import bannerCambridge from '../assets/images/cambridge_alevels_1786623420908.jpg';
import bannerKarachi from '../assets/images/karachi_board_1786623433073.jpg';
import bannerAkueb from '../assets/images/akueb_prep_1786623445949.jpg';
import bannerFederal from '../assets/images/federal_board_1786623458013.jpg';
import bannerItCourses from '../assets/images/it_courses_1786623469214.jpg';

export interface SlideData {
  id: string;
  category: string;
  title: string;
  subtitle: string;
  targetClasses: string;
  bgImage: string;
  themeColor: 'blue' | 'red' | 'emerald' | 'cyan' | 'orange';
  accentGradient: string;
  features: string[];
  whatsappMsg: string;
}

const SLIDES: SlideData[] = [
  {
    id: 'cambridge_alevels',
    category: 'SIR ALI ACADEMY • Global Success Preparation',
    title: 'CAMBRIDGE A/O LEVELS PREPARATION',
    subtitle: 'Secure Your Path to Global Success with Sir Ali Preparation',
    targetClasses: 'O Levels & A Levels (GCE / IGCSE)',
    bgImage: bannerCambridge,
    themeColor: 'blue',
    accentGradient: 'from-blue-950/80 via-slate-950/50 to-transparent',
    features: [
      'Online and Physical Classes Available',
      'Audio / Visual Support & Learning Material',
      'Daily / Weekly / Monthly / Yearly Tests',
      'A-1 Grade Money Back Guaranteed',
      'Subjects: Maths, Physics, Chemistry, CS, IT',
      'Target: O Levels & A Levels (GCE / IGCSE)'
    ],
    whatsappMsg: 'Hi%20Sir%20Ali%20Academy%2C%20I%20am%20interested%20in%20Cambridge%20A%2FO%20Levels%20Preparation!'
  },
  {
    id: 'karachi_board',
    category: 'SIR ALI ACADEMY • Board Exam Mastery',
    title: 'KARACHI BOARD PREPARATION',
    subtitle: 'Top the Matric & Intermediate Board Exams',
    targetClasses: 'Classes IX, X, XI, & XII (Science & General)',
    bgImage: bannerKarachi,
    themeColor: 'red',
    accentGradient: 'from-red-950/80 via-slate-950/50 to-transparent',
    features: [
      'Online and Physical Interactive Classes',
      'Audio / Visual Support & Test Series',
      'Daily / Weekly / Monthly / Yearly Evaluation',
      'A-1 Grade Money Back Guaranteed',
      'Subjects: Maths, Physics, Chemistry, CS, IT',
      'Target: Classes IX, X, XI, & XII'
    ],
    whatsappMsg: 'Hi%20Sir%20Ali%20Academy%2C%20I%20am%20interested%20in%20Karachi%20Board%20Preparation!'
  },
  {
    id: 'akueb_exam',
    category: 'SIR ALI ACADEMY • Concept-Based Learning',
    title: 'AKU-EB EXAM PREPARATION',
    subtitle: 'Master the Concept-Based Learning Model',
    targetClasses: 'Classes VIII, IX, X, XI, & XII',
    bgImage: bannerAkueb,
    themeColor: 'emerald',
    accentGradient: 'from-emerald-950/80 via-slate-950/50 to-transparent',
    features: [
      'Online and Physical Interactive Classes',
      'Concept-Based Learning & AV Support',
      'Daily / Weekly / Monthly / Yearly Tests',
      'A-1 Grade Money Back Guaranteed',
      'Subjects: Maths, Physics, Chemistry, CS, IT',
      'Target: Classes VIII, IX, X, XI, & XII'
    ],
    whatsappMsg: 'Hi%20Sir%20Ali%20Academy%2C%20I%20am%20interested%20in%20AKU-EB%20Exam%20Preparation!'
  },
  {
    id: 'federal_board',
    category: 'SIR ALI ACADEMY • Centralized Board Excellence',
    title: 'FEDERAL BOARD (FBISE) PREPARATION',
    subtitle: 'Ace Your SLO-Based Centralized Board Exams',
    targetClasses: 'Classes VIII, IX, X, XI, & XII (Science & General)',
    bgImage: bannerFederal,
    themeColor: 'cyan',
    accentGradient: 'from-teal-950/80 via-slate-950/50 to-transparent',
    features: [
      'SLO-Based Centralized Exam Preparation',
      'Online and Physical Classes & AV Support',
      'Daily / Weekly / Monthly / Yearly Tests',
      'A-1 Grade Money Back Guaranteed',
      'Subjects: Maths, Physics, Chemistry, CS, IT',
      'Target: Classes VIII to XII'
    ],
    whatsappMsg: 'Hi%20Sir%20Ali%20Academy%2C%20I%20am%20interested%20in%20Federal%20Board%20FBISE%20Preparation!'
  },
  {
    id: 'it_courses',
    category: 'PROFESSIONAL IT ACADEMY • Digital Skills',
    title: 'PROFESSIONAL IT COURSES',
    subtitle: 'Build Technical Skills for Tomorrow\'s Digital Economy',
    targetClasses: 'Open to Students Class VIII to XII & Beyond',
    bgImage: bannerItCourses,
    themeColor: 'orange',
    accentGradient: 'from-amber-950/80 via-slate-950/50 to-transparent',
    features: [
      'Programming & Code Essentials',
      'Computer Science & IT Fundamentals',
      'Online and Physical Classes & Hands-on Labs',
      'A-1 Grade Quality Learning Guarantee',
      'Math Core & Information Technology',
      'Target: Class VIII to XII & Beyond'
    ],
    whatsappMsg: 'Hi%20Sir%20Ali%20Academy%2C%20I%20am%20interested%20in%20Professional%20IT%20Courses!'
  }
];

interface BannerSliderProps {
  onNavigate?: (tabId: string) => void;
}

export const BannerSlider: React.FC<BannerSliderProps> = ({ onNavigate }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const handleEnrollClick = () => {
    if (onNavigate) {
      onNavigate('annual');
    } else {
      const el = document.getElementById('annual') || document.getElementById('booking_section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Auto-scroll timer
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
    }, 5000); // Auto scrolls every 5 seconds

    return () => clearInterval(timer);
  }, [isPaused]);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  // Touch Swipe Handlers for Mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        goToNext();
      } else {
        goToPrev();
      }
    }
    touchStartX.current = null;
  };

  return (
    <div 
      className="relative w-full overflow-hidden bg-slate-950 select-none border-b border-slate-800/80 shadow-2xl"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Container with responsive min-height for mobile screens */}
      <div className="relative w-full min-h-[480px] sm:min-h-[440px] md:min-h-[480px] lg:min-h-[520px]">
        
        {SLIDES.map((slide, index) => {
          const isActive = index === currentIndex;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              {/* Background Image */}
              <img
                src={slide.bgImage}
                alt={slide.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center transform scale-105 transition-transform duration-10000"
              />

              {/* Overlay Gradients - Balanced for clear image visibility and text legibility */}
              <div className={`absolute inset-0 bg-gradient-to-r ${slide.accentGradient}`} />
              <div className="absolute inset-0 bg-slate-950/30" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-slate-950/30" />

              {/* Slide Content Container */}
              <div className="absolute inset-0 flex items-center overflow-y-auto custom-scrollbar">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-6 pb-14 sm:pb-8">
                  
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-center">
                    
                    {/* Main Content Column */}
                    <div className="lg:col-span-8 space-y-2.5 sm:space-y-4">
                      
                      {/* Category Badge */}
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-slate-900/90 border border-amber-500/40 text-amber-300 text-[10px] sm:text-xs font-semibold backdrop-blur-md">
                        <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
                        <span className="truncate">{slide.category}</span>
                      </div>

                      {/* Main Title & Subtitle */}
                      <div className="space-y-1">
                        <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white font-serif tracking-tight drop-shadow-md leading-tight">
                          {slide.title}
                        </h1>
                        <p className="text-xs sm:text-sm md:text-base text-amber-300 font-medium">
                          {slide.subtitle}
                        </p>
                      </div>

                      {/* Feature Bullet Points */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2 pt-1 max-w-3xl">
                        {slide.features.slice(0, 6).map((feat, fIdx) => (
                          <div 
                            key={fIdx} 
                            className={`flex items-center gap-2 text-slate-200 text-[11px] sm:text-xs font-medium bg-slate-900/80 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-slate-800/80 ${
                              fIdx >= 4 ? 'hidden sm:flex' : 'flex'
                            }`}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            <span className="truncate">{feat}</span>
                          </div>
                        ))}
                      </div>

                      {/* Contact Bar & CTA */}
                      <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4 text-xs text-slate-300 border-t border-slate-800/80">
                        <div className="flex items-center justify-between sm:justify-start gap-3 flex-wrap">
                          <a href="https://wa.me/923022324503" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 font-bold text-amber-400 text-xs hover:underline">
                            <Phone className="w-3.5 h-3.5 text-amber-400" />
                            <span>WhatsApp: +92 302 2324503</span>
                          </a>
                          <a href="mailto:sagtut@gmail.com" className="hidden sm:flex items-center gap-1.5 text-slate-300 text-xs hover:text-white">
                            <Mail className="w-3.5 h-3.5 text-cyan-400" />
                            <span>sagtut@gmail.com</span>
                          </a>
                          <a href="https://sirali.com" target="_blank" rel="noopener noreferrer" className="hidden md:flex items-center gap-1.5 text-slate-300 text-xs hover:text-white">
                            <Globe className="w-3.5 h-3.5 text-emerald-400" />
                            <span>sirali.com</span>
                          </a>
                        </div>

                        <button
                          type="button"
                          onClick={handleEnrollClick}
                          className="w-full sm:w-auto px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-1.5 shrink-0 cursor-pointer hover:scale-105 active:scale-95"
                        >
                          <span>Enroll / Inquiry</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>

                    </div>

                    {/* Right Decorative Badge Column (Desktop) */}
                    <div className="hidden lg:flex lg:col-span-4 justify-end">
                      <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl backdrop-blur-md shadow-2xl max-w-xs space-y-4 text-center">
                        <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto">
                          <GraduationCap className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="text-white font-bold text-base font-serif">Target Classes</h4>
                          <p className="text-xs text-amber-300 font-semibold mt-1">{slide.targetClasses}</p>
                          <p className="text-[11px] text-slate-400 mt-1">Online & Physical Classes • Audio/Visual Support</p>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-amber-400 font-extrabold text-xs uppercase tracking-wider">
                          A-1 Grade Money Back Guaranteed
                        </div>
                      </div>
                    </div>

                  </div>

                </div>
              </div>

            </div>
          );
        })}

      </div>

      {/* Compact Navigation Arrow Buttons for Mobile */}
      <button
        onClick={goToPrev}
        className="absolute left-1.5 sm:left-4 top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-slate-950/70 hover:bg-slate-900 border border-slate-700/80 text-white flex items-center justify-center backdrop-blur-md transition-all hover:scale-105 active:scale-95 focus:outline-none shadow-lg"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6 text-amber-400" />
      </button>

      <button
        onClick={goToNext}
        className="absolute right-1.5 sm:right-4 top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-slate-950/70 hover:bg-slate-900 border border-slate-700/80 text-white flex items-center justify-center backdrop-blur-md transition-all hover:scale-105 active:scale-95 focus:outline-none shadow-lg"
        aria-label="Next Slide"
      >
        <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6 text-amber-400" />
      </button>

      {/* Bottom Navigation Dots & Auto-Play Status */}
      <div className="absolute bottom-2 sm:bottom-3 inset-x-0 z-30 flex items-center justify-center gap-2.5 px-4">
        <div className="flex items-center gap-1.5 sm:gap-2 bg-slate-950/80 border border-slate-800/80 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full backdrop-blur-md">
          {SLIDES.map((slide, idx) => {
            const isActive = idx === currentIndex;
            return (
              <button
                key={slide.id}
                onClick={() => setCurrentIndex(idx)}
                className={`transition-all rounded-full ${
                  isActive
                    ? 'w-5 sm:w-7 h-1.5 sm:h-2 bg-amber-400'
                    : 'w-1.5 sm:w-2 h-1.5 sm:h-2 bg-slate-600 hover:bg-slate-400'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            );
          })}
        </div>

        {/* Pause / Play Indicator Button */}
        <button
          onClick={() => setIsPaused(!isPaused)}
          className="p-1 sm:p-1.5 rounded-full bg-slate-950/80 border border-slate-800/80 text-slate-400 hover:text-white backdrop-blur-md transition-colors"
          title={isPaused ? "Resume Auto-Play" : "Pause Auto-Play"}
        >
          {isPaused ? <Play className="w-3 h-3 text-amber-400" /> : <Pause className="w-3 h-3" />}
        </button>
      </div>

    </div>
  );
};

