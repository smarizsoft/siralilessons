import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { BannerSlider } from './components/BannerSlider';
import { Hero } from './components/Hero';
import { TeacherProfile } from './components/TeacherProfile';
import { FeeCalculators } from './components/FeeCalculators';
import { CustomInvoice } from './components/CustomInvoice';
import { BookingForms } from './components/BookingForms';
import { BookingsDashboard } from './components/BookingsDashboard';
import { GoogleSheetGuideModal } from './components/GoogleSheetGuideModal';
import { Testimonials } from './components/Testimonials';
import { Footer } from './components/Footer';
import { AnyBooking, SubjectType, TuitionMode } from './types';
import { getStoredBookings } from './utils/googleSheets';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('about');
  
  // Bookings list state from localStorage
  const [bookings, setBookings] = useState<AnyBooking[]>([]);
  const [dashboardOpen, setDashboardOpen] = useState(false);
  const [googleSheetModalOpen, setGoogleSheetModalOpen] = useState(false);

  // Preselected calculator state passed to booking forms
  const [formTab, setFormTab] = useState<string>('trial');
  const [preselectedAnnualSubjects, setPreselectedAnnualSubjects] = useState<SubjectType[]>([]);
  const [preselectedCrashSubjects, setPreselectedCrashSubjects] = useState<SubjectType[]>([]);
  const [preselectedCrashDuration, setPreselectedCrashDuration] = useState<'1 Month Intensive' | '2 Months Complete'>('1 Month Intensive');
  const [preselectedCrashMode, setPreselectedCrashMode] = useState<TuitionMode>('Online Class (Zoom/Google Meet)');

  // Refresh bookings from local storage
  const refreshBookings = () => {
    setBookings(getStoredBookings());
  };

  useEffect(() => {
    refreshBookings();
  }, []);

  const handleNavigate = (tabId: string) => {
    setActiveTab(tabId);

    if (['trial', 'annual', 'crash', 'it_courses'].includes(tabId)) {
      setFormTab(tabId);
      const formElement = document.getElementById(tabId) || document.getElementById('booking_section');
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      const element = document.getElementById(tabId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Handlers from Calculators to Forms
  const handleApplyAnnualFromCalc = (subjects: SubjectType[]) => {
    setPreselectedAnnualSubjects(subjects);
    setFormTab('annual');
    setActiveTab('annual');
    setTimeout(() => {
      const el = document.getElementById('annual') || document.getElementById('booking_section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleApplyCrashFromCalc = (
    subjects: SubjectType[],
    duration: '1 Month Intensive' | '2 Months Complete',
    mode: TuitionMode
  ) => {
    setPreselectedCrashSubjects(subjects);
    setPreselectedCrashDuration(duration);
    setPreselectedCrashMode(mode);
    setFormTab('crash');
    setActiveTab('crash');
    setTimeout(() => {
      const el = document.getElementById('crash') || document.getElementById('booking_section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleBookingCreated = (newBooking: AnyBooking) => {
    refreshBookings();
  };

  return (
    <div className="min-h-screen bg-[#0a0c10] text-slate-300 font-sans flex flex-col selection:bg-amber-500/30 selection:text-amber-200">
      
      {/* Sticky Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={handleNavigate}
        onOpenGoogleSheetModal={() => setGoogleSheetModalOpen(true)}
        onOpenDashboard={() => setDashboardOpen(true)}
        bookingsCount={bookings.length}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        
        {/* Full-width Auto-Scrolling Banner Slider */}
        <BannerSlider onNavigate={handleNavigate} />

        {/* Hero Banner */}
        <Hero onNavigate={handleNavigate} />

        {/* Teacher Credentials & Boards Overview */}
        <TeacherProfile onNavigate={handleNavigate} />

        {/* Dual Fee Calculators (Annual & Crash) */}
        <FeeCalculators
          onApplyAnnualSelections={handleApplyAnnualFromCalc}
          onApplyCrashSelections={handleApplyCrashFromCalc}
        />

        {/* Custom Curriculum & Syllabus */}
        <CustomInvoice onBookingCreated={handleBookingCreated} />

        {/* Interactive Booking Forms Section */}
        <div id="booking_section">
          <BookingForms
            initialFormTab={formTab}
            preselectedAnnualSubjects={preselectedAnnualSubjects}
            preselectedCrashSubjects={preselectedCrashSubjects}
            preselectedCrashDuration={preselectedCrashDuration}
            preselectedCrashMode={preselectedCrashMode}
            onBookingCreated={handleBookingCreated}
          />
        </div>

        {/* Testimonials & FAQs */}
        <Testimonials />

      </main>

      {/* Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenGoogleSheetModal={() => setGoogleSheetModalOpen(true)}
        onOpenDashboard={() => setDashboardOpen(true)}
      />

      {/* Bookings Log / Admin Dashboard Modal */}
      <BookingsDashboard
        isOpen={dashboardOpen}
        onClose={() => setDashboardOpen(false)}
        bookings={bookings}
        onRefreshBookings={refreshBookings}
        onOpenGoogleSheetModal={() => {
          setDashboardOpen(false);
          setGoogleSheetModalOpen(true);
        }}
      />

      {/* Google Sheets Database Setup Modal */}
      <GoogleSheetGuideModal
        isOpen={googleSheetModalOpen}
        onClose={() => setGoogleSheetModalOpen(false)}
      />

    </div>
  );
}
