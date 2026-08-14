import React, { useState, useEffect } from 'react';
import { BoardType, ITCourseDuration, ITCourseName, SubjectType, TuitionMode, AnyBooking } from '../types';
import { BOARDS_LIST, IT_COURSES_DATA, SUBJECTS_LIST } from '../data/tutorData';
import { calculateAnnualFee, calculateCrashFee, calculateITCourseFee, formatPKR, getAnnualStartDateDefault, getCurrentMonthMaxDate, getDefaultCrashDate, getMinTrialDate, getTodayDate, validateAnnualBookingDate, validateCrashBookingDate, validateWhatsAppPhone } from '../utils/calculatorUtils';
import { saveBookingToStorage, sendToGoogleSheet, getWhatsAppNotificationUrl } from '../utils/googleSheets';
import { generateAndDownloadInvoicePNG, OFFICIAL_PAYMENT_METHODS } from '../utils/invoiceGenerator';
import { Calendar, CheckCircle, Clock, Info, AlertTriangle, Send, Sparkles, X, Laptop, ShieldCheck, Download, CreditCard, Smartphone, Building, FileText, Bell, MessageSquare } from 'lucide-react';

interface BookingFormsProps {
  initialFormTab?: string;
  preselectedAnnualSubjects?: SubjectType[];
  preselectedCrashSubjects?: SubjectType[];
  preselectedCrashDuration?: '1 Month Intensive' | '2 Months Complete';
  preselectedCrashMode?: TuitionMode;
  onBookingCreated: (booking: AnyBooking) => void;
}

const ALL_SUBJECTS: SubjectType[] = ['Physics', 'Chemistry', 'Mathematics', 'Additional Mathematics', 'Computer Science'];

const GRADE_LEVEL_OPTIONS = [
  "8th O'levels",
  "9th O'levels",
  "10th O'levels",
  "O'levels Final",
  "A'levels AS",
  "A'levels A2"
] as const;

const constructWhatsAppMessage = (booking: AnyBooking): string => {
  let msg = `🎓 *NEW CLASS BOOKING ADMISSION*\n`;
  msg += `-----------------------------------\n`;
  msg += `*Booking ID:* ${booking.id}\n`;
  msg += `*Type:* ${booking.type.toUpperCase()}\n`;
  msg += `*Student Name:* ${booking.studentName}\n`;
  if ('guardianName' in booking && booking.guardianName) {
    msg += `*Guardian Name:* ${booking.guardianName}\n`;
  }
  msg += `*Phone/WhatsApp:* ${booking.studentPhone}\n`;
  if (booking.email) {
    msg += `*Email:* ${booking.email}\n`;
  }

  if (booking.type === 'trial') {
    msg += `*Subject:* ${booking.subject}\n`;
    msg += `*Board:* ${booking.board}\n`;
    msg += `*Grade:* ${booking.gradeLevel}\n`;
    msg += `*Date:* ${booking.selectedDate}\n`;
    msg += `*Time Slot:* ${booking.timeSlot}\n`;
    msg += `*Mode:* ${booking.mode}\n`;
    msg += `*Fee:* PKR ${booking.fee}\n`;
  } else if (booking.type === 'annual') {
    msg += `*Subjects:* ${booking.subjects.join(', ')}\n`;
    msg += `*Board:* ${booking.board}\n`;
    msg += `*Grade:* ${booking.gradeLevel}\n`;
    msg += `*Start Date:* ${booking.startDate}\n`;
    msg += `*Mode:* ${booking.mode}\n`;
    msg += `*Schedule:* ${booking.paymentSchedule}\n`;
    msg += `*Monthly Fee:* PKR ${booking.totalMonthlyFee}\n`;
    msg += `*Full Course Fee:* PKR ${booking.totalFullCourseFee}\n`;
  } else if (booking.type === 'crash') {
    msg += `*Subjects:* ${booking.subjects.join(', ')}\n`;
    msg += `*Board:* ${booking.board}\n`;
    msg += `*Grade:* ${booking.gradeLevel}\n`;
    msg += `*Start Date:* ${booking.bookingDate}\n`;
    msg += `*Duration:* ${booking.crashDuration}\n`;
    msg += `*Mode:* ${booking.mode}\n`;
    msg += `*Total Fee:* PKR ${booking.calculatedFee}\n`;
  } else if (booking.type === 'it_course') {
    msg += `*Course:* ${booking.courseName}\n`;
    msg += `*Duration:* ${booking.duration}\n`;
    msg += `*Start Date:* ${booking.startDate}\n`;
    msg += `*Mode:* ${booking.mode}\n`;
    msg += `*Total Fee:* PKR ${booking.calculatedFee}\n`;
  }

  if (booking.notes) {
    msg += `*Notes:* ${booking.notes}\n`;
  }
  msg += `-----------------------------------\n`;
  msg += `Hello Sir Ali, I have submitted this booking request on the portal. Please confirm my request.`;

  return msg;
};

export const BookingForms: React.FC<BookingFormsProps> = ({
  initialFormTab = 'trial',
  preselectedAnnualSubjects,
  preselectedCrashSubjects,
  preselectedCrashDuration,
  preselectedCrashMode,
  onBookingCreated
}) => {
  const [activeFormTab, setActiveFormTab] = useState<'trial' | 'annual' | 'crash' | 'it_course'>(
    (initialFormTab as any) || 'trial'
  );

  useEffect(() => {
    if (initialFormTab) {
      setActiveFormTab(initialFormTab as any);
    }
  }, [initialFormTab]);

  // Global Notification Modal state
  const [submittedBooking, setSubmittedBooking] = useState<AnyBooking | null>(null);
  const [syncStatusMessage, setSyncStatusMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // FORM 1: TRIAL CLASS STATE
  const [trialSubject, setTrialSubject] = useState<SubjectType | 'IT Courses'>('Physics');
  const [trialBoard, setTrialBoard] = useState<BoardType>('Cambridge (O Level / IGCSE / A Level)');
  const [trialGrade, setTrialGrade] = useState<string>("10th O'levels");
  const [trialDate, setTrialDate] = useState<string>(getMinTrialDate());
  const [trialTimeSlot, setTrialTimeSlot] = useState('04:00 PM - 05:30 PM');
  const [trialMode, setTrialMode] = useState<TuitionMode>('Online Class (Zoom/Google Meet)');
  const [trialStudentName, setTrialStudentName] = useState('');
  const [trialGuardianName, setTrialGuardianName] = useState('');
  const [trialPhone, setTrialPhone] = useState('');
  const [trialEmail, setTrialEmail] = useState('');
  const [trialNotes, setTrialNotes] = useState('');

  // FORM 2: ANNUAL PREP STATE
  const [annualSubjects, setAnnualSubjects] = useState<SubjectType[]>(preselectedAnnualSubjects || ['Physics', 'Chemistry']);
  const [annualBoard, setAnnualBoard] = useState<BoardType>('Cambridge (O Level / IGCSE / A Level)');
  const [annualGrade, setAnnualGrade] = useState<string>("10th O'levels");
  const [annualStartDate, setAnnualStartDate] = useState<string>(getAnnualStartDateDefault());
  const [annualMode, setAnnualMode] = useState<TuitionMode>('Online Class (Zoom/Google Meet)');
  const [annualSchedule, setAnnualSchedule] = useState<'Monthly Installments' | 'Lump Sum (5% Discount)'>('Monthly Installments');
  const [annualStudentName, setAnnualStudentName] = useState('');
  const [annualGuardianName, setAnnualGuardianName] = useState('');
  const [annualPhone, setAnnualPhone] = useState('');
  const [annualEmail, setAnnualEmail] = useState('');
  const [annualNotes, setAnnualNotes] = useState('');

  // FORM 3: CRASH COURSE STATE
  const [crashDate, setCrashDate] = useState<string>(getDefaultCrashDate()); // Default within Jan 1 - Jan 15 window (current or future year)
  const [crashSubjects, setCrashSubjects] = useState<SubjectType[]>(preselectedCrashSubjects || ['Physics']);
  const [crashDuration, setCrashDuration] = useState<'1 Month Intensive' | '2 Months Complete'>(preselectedCrashDuration || '1 Month Intensive');
  const [crashMode, setCrashMode] = useState<TuitionMode>(preselectedCrashMode || 'Online Class (Zoom/Google Meet)');
  const [crashBoard, setCrashBoard] = useState<BoardType>('Cambridge (O Level / IGCSE / A Level)');
  const [crashGrade, setCrashGrade] = useState<string>("A'levels AS");
  const [crashStudentName, setCrashStudentName] = useState('');
  const [crashGuardianName, setCrashGuardianName] = useState('');
  const [crashPhone, setCrashPhone] = useState('');
  const [crashEmail, setCrashEmail] = useState('');
  const [crashNotes, setCrashNotes] = useState('');

  // FORM 4: IT COURSES STATE (Dynamic Dropdowns)
  const [itCourseName, setItCourseName] = useState<ITCourseName>('Web Development (HTML, CSS, JS, React)');
  const [itDuration, setItDuration] = useState<ITCourseDuration>('2 Months (Standard)');
  const [itMode, setItMode] = useState<TuitionMode>('Online Class (Zoom/Google Meet)');
  const [itStartDate, setItStartDate] = useState<string>(getMinTrialDate());
  const [itStudentName, setItStudentName] = useState('');
  const [itPhone, setItPhone] = useState('');
  const [itEmail, setItEmail] = useState('');
  const [itNotes, setItNotes] = useState('');

  // Sync preselected subjects if updated from calculator
  useEffect(() => {
    if (preselectedAnnualSubjects && preselectedAnnualSubjects.length > 0) {
      setAnnualSubjects(preselectedAnnualSubjects);
    }
  }, [preselectedAnnualSubjects]);

  useEffect(() => {
    if (preselectedCrashSubjects && preselectedCrashSubjects.length > 0) {
      setCrashSubjects(preselectedCrashSubjects);
    }
    if (preselectedCrashDuration) setCrashDuration(preselectedCrashDuration);
    if (preselectedCrashMode) setCrashMode(preselectedCrashMode);
  }, [preselectedCrashSubjects, preselectedCrashDuration, preselectedCrashMode]);

  // Validate Crash Booking Date
  const crashDateValidation = validateCrashBookingDate(crashDate);

  // Dynamic Fee Calculations
  const annualCalc = calculateAnnualFee(annualSubjects.length);
  const crashCalc = calculateCrashFee(crashSubjects, crashDuration, crashMode);
  const itFeeCalculated = calculateITCourseFee(itCourseName, itDuration, itMode);

  // Submit Handler: Saves booking and opens Official Invoice Modal directly
  const handleBookingSubmit = async (e: React.FormEvent, bookingData: AnyBooking) => {
    e.preventDefault();

    // Disallow selecting back dates
    const chosenDate = (bookingData as any).selectedDate || (bookingData as any).startDate || (bookingData as any).bookingDate;
    const today = getTodayDate();
    if (chosenDate && chosenDate < today) {
      alert('⚠️ Back dates are not permitted. Please select today or a future date.');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Save locally to storage
      saveBookingToStorage(bookingData);
      onBookingCreated(bookingData);

      // 2. Post to Google Sheet Webhook
      const syncResult = await sendToGoogleSheet(bookingData);
      setSyncStatusMessage(syncResult.message);

      // 3. Directly show Invoice modal (skipping welcome message)
      setSubmittedBooking(bookingData);
    } catch (err: any) {
      console.error('Error submitting booking:', err);
      alert('Error submitting booking: ' + (err.message || 'Please try again.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Download Invoice as PNG and then refresh the page
  const handleDownloadInvoiceAndRefresh = () => {
    if (!submittedBooking) return;
    generateAndDownloadInvoicePNG(submittedBooking, `Invoice_${submittedBooking.id || 'SirAli'}.png`);
    setTimeout(() => {
      window.location.reload();
    }, 800);
  };

  // Helper toggle subject functions
  const toggleAnnualSubject = (subj: SubjectType) => {
    if (annualSubjects.includes(subj)) {
      if (annualSubjects.length > 1) setAnnualSubjects(annualSubjects.filter(s => s !== subj));
    } else {
      setAnnualSubjects([...annualSubjects, subj]);
    }
  };

  const toggleCrashSubject = (subj: SubjectType) => {
    if (crashSubjects.includes(subj)) {
      if (crashSubjects.length > 1) setCrashSubjects(crashSubjects.filter(s => s !== subj));
    } else {
      setCrashSubjects([...crashSubjects, subj]);
    }
  };

  return (
    <section className="py-16 bg-[#0a0c10] border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <h2 className="text-3xl font-serif italic text-amber-500 tracking-tight sm:text-4xl">
            Course & Class Admissions
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Select your preferred course format below. Submissions are processed immediately, and class bookings are confirmed once payment is made.
          </p>
        </div>

        {/* Form Selector Tabs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 max-w-4xl mx-auto">
          
          <button
            id="trial"
            onClick={() => setActiveFormTab('trial')}
            className={`p-4 rounded-xl border text-left transition-all ${
              activeFormTab === 'trial'
                ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-xl font-extrabold'
                : 'bg-slate-900/60 text-slate-300 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs sm:text-sm">1. Trial Class</span>
              <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                activeFormTab === 'trial' ? 'bg-slate-950 text-amber-400' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
              }`}>
                PKR 2,500
              </span>
            </div>
            <p className={`text-[11px] mt-1 ${activeFormTab === 'trial' ? 'text-slate-900' : 'text-slate-400'}`}>
              90-Min Session • Next Week Dates
            </p>
          </button>

          <button
            id="annual"
            onClick={() => setActiveFormTab('annual')}
            className={`p-4 rounded-xl border text-left transition-all ${
              activeFormTab === 'annual'
                ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-xl font-extrabold'
                : 'bg-slate-900/60 text-slate-300 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs sm:text-sm">2. Annual Prep</span>
              <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                activeFormTab === 'annual' ? 'bg-slate-950 text-amber-400' : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
              }`}>
                10 Months
              </span>
            </div>
            <p className={`text-[11px] mt-1 ${activeFormTab === 'annual' ? 'text-slate-900' : 'text-slate-400'}`}>
              Starts Aug 1st • 12k/mo/subject
            </p>
          </button>

          <button
            id="crash"
            onClick={() => setActiveFormTab('crash')}
            className={`p-4 rounded-xl border text-left transition-all ${
              activeFormTab === 'crash'
                ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-xl font-extrabold'
                : 'bg-slate-900/60 text-slate-300 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs sm:text-sm">3. Crash Course</span>
              <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                activeFormTab === 'crash' ? 'bg-slate-950 text-amber-400' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
              }`}>
                Jan 1-15
              </span>
            </div>
            <p className={`text-[11px] mt-1 ${activeFormTab === 'crash' ? 'text-slate-900' : 'text-slate-400'}`}>
              Restricted Admission Window
            </p>
          </button>

          <button
            id="it_courses"
            onClick={() => setActiveFormTab('it_course')}
            className={`p-4 rounded-xl border text-left transition-all ${
              activeFormTab === 'it_course'
                ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-xl font-extrabold'
                : 'bg-slate-900/60 text-slate-300 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs sm:text-sm">4. IT Courses</span>
              <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                activeFormTab === 'it_course' ? 'bg-slate-950 text-amber-400' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              }`}>
                Dynamic
              </span>
            </div>
            <p className={`text-[11px] mt-1 ${activeFormTab === 'it_course' ? 'text-slate-900' : 'text-slate-400'}`}>
              Web Dev, Python, Design
            </p>
          </button>

        </div>

        {/* MAIN FORM CONTAINER */}
        <div className="max-w-4xl mx-auto bg-[#0f1218] p-6 sm:p-10 rounded-xl border border-slate-800 shadow-2xl">
          
          {/* ========================================================
              FORM 1: TRIAL CLASS BOOKING FORM
             ======================================================== */}
          {activeFormTab === 'trial' && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const phoneCheck = validateWhatsAppPhone(trialPhone);
                if (!phoneCheck.isValid) {
                  alert(phoneCheck.message);
                  return;
                }
                const booking: AnyBooking = {
                  id: `BK-TR-${Math.floor(1000 + Math.random() * 9000)}`,
                  type: 'trial',
                  createdAt: new Date().toISOString(),
                  studentName: trialStudentName,
                  guardianName: trialGuardianName,
                  studentPhone: phoneCheck.formatted,
                  email: trialEmail,
                  board: trialBoard,
                  gradeLevel: trialGrade,
                  selectedDate: trialDate,
                  timeSlot: trialTimeSlot,
                  subject: trialSubject,
                  mode: trialMode,
                  fee: 2500,
                  duration: '90 Minutes',
                  status: 'Pending',
                  notes: trialNotes
                };
                handleBookingSubmit(e, booking);
              }}
              className="space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4 border-slate-800">
                <div>
                  <h3 className="text-xl font-serif italic text-white">Trial Class Booking</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Evaluation session for diagnostics, study plan drafting & teaching style assessment.
                  </p>
                </div>
                <div className="bg-amber-500/10 px-3.5 py-2 rounded-lg border border-amber-500/30 text-amber-300 text-right">
                  <span className="text-xs sm:text-sm font-semibold text-amber-400 block">
                    Class duration 90min @2500 only.
                  </span>
                </div>
              </div>

              {/* Date constraint & trial class notice banner */}
              <div className="bg-slate-900/80 p-3.5 rounded-lg border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5">
                <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  Trial class available in selected areas of Karachi. One time payment PKR.2500 per class per subject.
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                {/* Preferred Subject */}
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Select Preferred Trial Subject *
                  </label>
                  <select
                    value={trialSubject}
                    onChange={(e) => setTrialSubject(e.target.value as any)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-800 text-white text-sm focus:outline-hidden focus:border-amber-500 bg-slate-900"
                  >
                    {ALL_SUBJECTS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                    <option value="IT Courses">IT Course Trial</option>
                  </select>
                </div>

                {/* Educational Board */}
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Select Educational Board *
                  </label>
                  <select
                    value={trialBoard}
                    onChange={(e) => setTrialBoard(e.target.value as any)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-800 text-white text-sm focus:outline-hidden focus:border-amber-500 bg-slate-900"
                  >
                    {BOARDS_LIST.map((b) => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>

                {/* Date Picker (Min next week, no back dates) */}
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Trial Date (Min Date: Next Week) *
                  </label>
                  <input
                    type="date"
                    min={getMinTrialDate()}
                    value={trialDate}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val && val < getTodayDate()) {
                        alert('⚠️ Back dates are not permitted! Please select today or a future date.');
                        setTrialDate(getMinTrialDate());
                        return;
                      }
                      setTrialDate(val);
                    }}
                    required
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-800 text-white text-sm focus:outline-hidden focus:border-amber-500 bg-slate-900"
                  />
                  <span className="text-[11px] text-slate-500 mt-0.5 block">Earliest available: {getMinTrialDate()}</span>
                </div>

                {/* Time Slot */}
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Preferred Time Slot *
                  </label>
                  <select
                    value={trialTimeSlot}
                    onChange={(e) => setTrialTimeSlot(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-800 text-white text-sm focus:outline-hidden focus:border-amber-500 bg-slate-900"
                  >
                    <option value="03:00 PM - 04:30 PM">03:00 PM - 04:30 PM</option>
                    <option value="05:00 PM - 06:30 PM">05:00 PM - 06:30 PM</option>
                    <option value="07:00 PM - 08:30 PM">07:00 PM - 08:30 PM</option>
                    <option value="09:00 PM - 10:30 PM">09:00 PM - 10:30 PM</option>
                  </select>
                </div>

                {/* Class Mode */}
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Class Mode *
                  </label>
                  <select
                    value={trialMode}
                    onChange={(e) => setTrialMode(e.target.value as any)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-800 text-white text-sm focus:outline-hidden focus:border-amber-500 bg-slate-900"
                  >
                    <option value="Online Class (Zoom/Google Meet)">Online Class (Zoom / Google Meet)</option>
                    <option value="Physical / Home Tuition (In-Person)">Physical / Home Tuition (In-Person)</option>
                  </select>
                </div>

                {/* Grade Level */}
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Grade / Class Level *
                  </label>
                  <select
                    value={trialGrade}
                    onChange={(e) => setTrialGrade(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-800 text-white text-sm focus:outline-hidden focus:border-amber-500 bg-slate-900"
                  >
                    {GRADE_LEVEL_OPTIONS.map((grade) => (
                      <option key={grade} value={grade}>
                        {grade}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Student Name */}
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Student Full Name *
                  </label>
                  <input
                    type="text"
                    value={trialStudentName}
                    onChange={(e) => setTrialStudentName(e.target.value)}
                    placeholder="Enter student name"
                    required
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-800 text-white text-sm focus:outline-hidden focus:border-amber-500 bg-slate-900 placeholder:text-slate-600"
                  />
                </div>

                {/* Phone / WhatsApp */}
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    WhatsApp / Contact Number *
                  </label>
                  <input
                    type="tel"
                    value={trialPhone}
                    onChange={(e) => setTrialPhone(e.target.value)}
                    placeholder="+92 3022324503"
                    required
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-800 text-white text-sm focus:outline-hidden focus:border-amber-500 bg-slate-900 placeholder:text-slate-600"
                  />
                  <p className="text-[10px] text-amber-400/90 mt-1">
                    Required format: <strong className="font-mono text-amber-300">+92 3022324503</strong> (+2-digit country code & 10-digit number)
                  </p>
                </div>

                {/* Email */}
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={trialEmail}
                    onChange={(e) => setTrialEmail(e.target.value)}
                    placeholder="student@example.com"
                    required
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-800 text-white text-sm focus:outline-hidden focus:border-amber-500 bg-slate-900 placeholder:text-slate-600"
                  />
                </div>

                {/* Guardian Name */}
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Parent / Guardian Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={trialGuardianName}
                    onChange={(e) => setTrialGuardianName(e.target.value)}
                    placeholder="Enter parent name"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-800 text-white text-sm focus:outline-hidden focus:border-amber-500 bg-slate-900 placeholder:text-slate-600"
                  />
                </div>

              </div>

              {/* Submit Action Bar */}
              <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-slate-400">
                  Total Trial Investment: <strong className="text-amber-400 font-serif italic text-base">PKR 2,500</strong> (Includes study materials)
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs uppercase tracking-widest shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <span>Processing Booking...</span>
                  ) : (
                    <>
                      <span>Confirm & Book Trial (PKR 2,500)</span>
                      <CheckCircle className="w-4 h-4 text-slate-950" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* ========================================================
              FORM 2: ANNUAL PREPARATION BOOKING FORM
             ======================================================== */}
          {activeFormTab === 'annual' && (() => {
            const annualDateValidation = validateAnnualBookingDate(annualStartDate);
            return (
            <form
              onSubmit={(e) => {
                if (!annualDateValidation.allowed) {
                  e.preventDefault();
                  alert(annualDateValidation.message || 'Invalid start date selected.');
                  return;
                }
                const phoneCheck = validateWhatsAppPhone(annualPhone);
                if (!phoneCheck.isValid) {
                  e.preventDefault();
                  alert(phoneCheck.message);
                  return;
                }
                const booking: AnyBooking = {
                  id: `BK-ANN-${Math.floor(1000 + Math.random() * 9000)}`,
                  type: 'annual',
                  createdAt: new Date().toISOString(),
                  studentName: annualStudentName,
                  guardianName: annualGuardianName,
                  studentPhone: phoneCheck.formatted,
                  email: annualEmail,
                  board: annualBoard,
                  gradeLevel: annualGrade,
                  startDate: annualStartDate,
                  durationMonths: 10,
                  subjects: annualSubjects,
                  mode: annualMode,
                  feePerMonthPerSubject: 12000,
                  totalMonthlyFee: annualCalc.totalMonthlyFee,
                  totalFullCourseFee: annualCalc.totalFullCourseFee,
                  paymentSchedule: annualSchedule,
                  status: 'Pending',
                  notes: annualNotes
                };
                handleBookingSubmit(e, booking);
              }}
              className="space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4 border-slate-800">
                <div>
                  <h3 className="text-xl font-serif italic text-white">Annual Preparation Booking</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    10-Month Course • Start Date restricted to current month & year.
                  </p>
                </div>
                <div className="bg-amber-500/10 px-3.5 py-2 rounded-lg border border-amber-500/30 text-amber-300 text-right">
                  <span className="text-[10px] uppercase font-bold text-amber-400 block tracking-widest">Course Rate</span>
                  <span className="text-sm font-serif italic font-bold text-amber-400">PKR 12,000 <span className="text-xs font-sans not-italic font-normal text-slate-400">/mo/subject</span></span>
                </div>
              </div>

              {/* Subject Selection Multi-Select */}
              <div className="space-y-2">
                <label className="text-[10px] font-extrabold text-amber-500 uppercase tracking-widest block">
                  Select Annual Subjects * ({annualSubjects.length} Selected)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                  {ALL_SUBJECTS.map((subj) => {
                    const isSelected = annualSubjects.includes(subj);
                    return (
                      <button
                        key={subj}
                        type="button"
                        onClick={() => toggleAnnualSubject(subj)}
                        className={`p-2.5 rounded-lg border text-xs font-bold transition-all text-center ${
                          isSelected
                            ? 'bg-amber-500/20 text-amber-400 border-amber-500/60 shadow-xs'
                            : 'bg-slate-900/60 text-slate-300 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        {subj}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                {/* Course Start Date (Current Month & Year, no back dates) */}
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Course Start Date (Current Month & Year) *
                  </label>
                  <input
                    type="date"
                    min={getTodayDate()}
                    max={getCurrentMonthMaxDate()}
                    value={annualStartDate}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val) {
                        if (val < getTodayDate()) {
                          alert('⚠️ Back dates are not permitted! Please select today or a future date.');
                          setAnnualStartDate(getTodayDate());
                          return;
                        }
                        if (val > getCurrentMonthMaxDate()) {
                          alert('⚠️ Date selection is restricted to the current month and current year.');
                          setAnnualStartDate(getTodayDate());
                          return;
                        }
                      }
                      setAnnualStartDate(val);
                    }}
                    required
                    className={`w-full px-3.5 py-2.5 rounded-lg border text-white text-sm focus:outline-hidden bg-slate-900 ${
                      annualDateValidation.allowed
                        ? 'border-slate-800 focus:border-amber-500'
                        : 'border-red-500/80 focus:border-red-500'
                    }`}
                  />
                  <span className="text-[11px] text-slate-500 mt-0.5 block">
                    Select a date in current month & year (back dates restricted).
                  </span>
                  {!annualDateValidation.allowed && annualDateValidation.message && (
                    <p className="text-xs text-red-400 mt-1 flex items-center gap-1 font-semibold">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      {annualDateValidation.message}
                    </p>
                  )}
                </div>

                {/* Mandatory Duration (10 Months) */}
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Course Duration
                  </label>
                  <input
                    type="text"
                    value="10 Months (Mandatory Full Syllabus)"
                    disabled
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-800 text-amber-400 text-sm bg-slate-900/60 font-bold"
                  />
                </div>

                {/* Educational Board */}
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Educational Board *
                  </label>
                  <select
                    value={annualBoard}
                    onChange={(e) => setAnnualBoard(e.target.value as any)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-800 text-white text-sm focus:outline-hidden focus:border-amber-500 bg-slate-900"
                  >
                    {BOARDS_LIST.map((b) => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>

                {/* Class Mode */}
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Delivery Mode *
                  </label>
                  <select
                    value={annualMode}
                    onChange={(e) => setAnnualMode(e.target.value as any)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-800 text-white text-sm focus:outline-hidden focus:border-amber-500 bg-slate-900"
                  >
                    <option value="Online Class (Zoom/Google Meet)">Online Class (Zoom / Google Meet)</option>
                    <option value="Physical / Home Tuition (In-Person)">Physical / Home Tuition (In-Person)</option>
                  </select>
                </div>

                {/* Grade Level */}
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Grade / Class Level *
                  </label>
                  <select
                    value={annualGrade}
                    onChange={(e) => setAnnualGrade(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-800 text-white text-sm focus:outline-hidden focus:border-amber-500 bg-slate-900"
                  >
                    {GRADE_LEVEL_OPTIONS.map((grade) => (
                      <option key={grade} value={grade}>
                        {grade}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Payment Option */}
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Payment Plan *
                  </label>
                  <select
                    value={annualSchedule}
                    onChange={(e) => setAnnualSchedule(e.target.value as any)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-800 text-white text-sm focus:outline-hidden focus:border-amber-500 bg-slate-900"
                  >
                    <option value="Monthly Installments">Monthly Installments ({formatPKR(annualCalc.totalMonthlyFee)}/month)</option>
                    <option value="Lump Sum (5% Discount)">Lump Sum Advance Payment ({formatPKR(annualCalc.lumpSumTotal)})</option>
                  </select>
                </div>

                {/* Student Details */}
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Student Full Name *
                  </label>
                  <input
                    type="text"
                    value={annualStudentName}
                    onChange={(e) => setAnnualStudentName(e.target.value)}
                    placeholder="Student name"
                    required
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-800 text-white text-sm focus:outline-hidden focus:border-amber-500 bg-slate-900 placeholder:text-slate-600"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    WhatsApp / Contact Number *
                  </label>
                  <input
                    type="tel"
                    value={annualPhone}
                    onChange={(e) => setAnnualPhone(e.target.value)}
                    placeholder="+92 3022324503"
                    required
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-800 text-white text-sm focus:outline-hidden focus:border-amber-500 bg-slate-900 placeholder:text-slate-600"
                  />
                  <p className="text-[10px] text-amber-400/90 mt-1">
                    Required format: <strong className="font-mono text-amber-300">+92 3022324503</strong> (+2-digit country code & 10-digit number)
                  </p>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={annualEmail}
                    onChange={(e) => setAnnualEmail(e.target.value)}
                    placeholder="student@example.com"
                    required
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-800 text-white text-sm focus:outline-hidden focus:border-amber-500 bg-slate-900 placeholder:text-slate-600"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Parent / Guardian Name
                  </label>
                  <input
                    type="text"
                    value={annualGuardianName}
                    onChange={(e) => setAnnualGuardianName(e.target.value)}
                    placeholder="Parent name"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-800 text-white text-sm focus:outline-hidden focus:border-amber-500 bg-slate-900 placeholder:text-slate-600"
                  />
                </div>

              </div>

              {/* Fee Summary Banner */}
              <div className="bg-[#0a0c10] p-4 rounded-lg border border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs sm:text-sm">
                <div>
                  <span className="font-bold text-white block">Annual Tuition Breakdown</span>
                  <span className="text-slate-400">
                    {annualSubjects.length} Subject(s) • 10 Months Duration
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 block">Monthly Amount:</span>
                  <span className="text-xl font-serif italic font-bold text-amber-400">
                    {formatPKR(annualCalc.totalMonthlyFee)} <span className="text-xs font-sans not-italic font-normal text-slate-500">/month</span>
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs uppercase tracking-widest shadow-xl transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting ? 'Submitting Annual Booking...' : 'Submit Annual Course Admission'}
              </button>
            </form>
            );
          })()}

          {/* ========================================================
              FORM 3: CRASH PREPARATION BOOKING FORM
             ======================================================== */}
          {activeFormTab === 'crash' && (
            <form
              onSubmit={(e) => {
                if (!crashDateValidation.allowed) {
                  e.preventDefault();
                  alert(crashDateValidation.message);
                  return;
                }
                const phoneCheck = validateWhatsAppPhone(crashPhone);
                if (!phoneCheck.isValid) {
                  e.preventDefault();
                  alert(phoneCheck.message);
                  return;
                }
                const booking: AnyBooking = {
                  id: `BK-CR-${Math.floor(1000 + Math.random() * 9000)}`,
                  type: 'crash',
                  createdAt: new Date().toISOString(),
                  studentName: crashStudentName,
                  guardianName: crashGuardianName,
                  studentPhone: phoneCheck.formatted,
                  email: crashEmail,
                  board: crashBoard,
                  gradeLevel: crashGrade,
                  bookingDate: crashDate,
                  subjects: crashSubjects,
                  crashDuration: crashDuration,
                  mode: crashMode,
                  calculatedFee: crashCalc.total,
                  status: 'Pending',
                  notes: crashNotes
                };
                handleBookingSubmit(e, booking);
              }}
              className="space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4 border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-serif italic text-white">Crash Course Booking</h3>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/30">
                      Jan 1 - 15 Window
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Fast-Track Intensive Exam Revision & Past Paper Drill.
                  </p>
                </div>
              </div>

              {/* DATES VALIDATION CRITICAL ALERT BANNER */}
              {!crashDateValidation.allowed ? (
                <div className="bg-rose-950/40 p-4 rounded-lg border border-rose-800/80 text-rose-300 text-xs flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-extrabold text-sm block text-rose-300">Booking Blocked Outside Jan 1 - Jan 15 Window</strong>
                    <p className="mt-0.5">
                      {crashDateValidation.message}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-emerald-950/40 p-3.5 rounded-lg border border-emerald-800/80 text-xs text-emerald-300 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>
                    Selected date ({crashDate}) is valid! Admissions are open between 1st Jan and 15th Jan.
                  </span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                {/* Booking Date (1st Jan to 15th Jan restriction, no back dates) */}
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Select Crash Booking Date (Allowed: Jan 1st - Jan 15th) *
                  </label>
                  <input
                    type="date"
                    min={getTodayDate()}
                    value={crashDate}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val && val < getTodayDate()) {
                        alert('⚠️ Back dates are not permitted! Please select today or a future date.');
                        setCrashDate(getDefaultCrashDate());
                        return;
                      }
                      setCrashDate(val);
                    }}
                    required
                    className={`w-full px-3.5 py-2.5 rounded-lg border text-sm focus:outline-hidden ${
                      crashDateValidation.allowed
                        ? 'bg-slate-900 border-slate-800 text-white focus:border-amber-500'
                        : 'border-rose-500 text-rose-200 bg-rose-950/30 focus:border-rose-400'
                    }`}
                  />
                  <span className="text-[11px] text-slate-500 mt-0.5 block">
                    Admissions only allowed from 1st Jan to 15th Jan.
                  </span>
                </div>

                {/* Crash Package Duration */}
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Crash Duration Package *
                  </label>
                  <select
                    value={crashDuration}
                    onChange={(e) => setCrashDuration(e.target.value as any)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-800 text-white text-sm focus:outline-hidden focus:border-amber-500 bg-slate-900"
                  >
                    <option value="1 Month Intensive">1 Month Intensive (Past Paper Drill)</option>
                    <option value="2 Months Complete">2 Months Complete (Theory + Past Papers)</option>
                  </select>
                </div>

                {/* Educational Board */}
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Educational Board *
                  </label>
                  <select
                    value={crashBoard}
                    onChange={(e) => setCrashBoard(e.target.value as any)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-800 text-white text-sm focus:outline-hidden focus:border-amber-500 bg-slate-900"
                  >
                    {BOARDS_LIST.map((b) => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>

                {/* Mode */}
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Class Mode *
                  </label>
                  <select
                    value={crashMode}
                    onChange={(e) => setCrashMode(e.target.value as any)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-800 text-white text-sm focus:outline-hidden focus:border-amber-500 bg-slate-900"
                  >
                    <option value="Online Class (Zoom/Google Meet)">Online Class (Zoom / Google Meet)</option>
                    <option value="Physical / Home Tuition (In-Person)">Physical / Home Tuition (In-Person)</option>
                  </select>
                </div>

                {/* Student Name */}
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Student Full Name *
                  </label>
                  <input
                    type="text"
                    value={crashStudentName}
                    onChange={(e) => setCrashStudentName(e.target.value)}
                    placeholder="Student name"
                    required
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-800 text-white text-sm focus:outline-hidden focus:border-amber-500 bg-slate-900 placeholder:text-slate-600"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    WhatsApp / Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={crashPhone}
                    onChange={(e) => setCrashPhone(e.target.value)}
                    placeholder="+92 3022324503"
                    required
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-800 text-white text-sm focus:outline-hidden focus:border-amber-500 bg-slate-900 placeholder:text-slate-600"
                  />
                  <p className="text-[10px] text-amber-400/90 mt-1">
                    Required format: <strong className="font-mono text-amber-300">+92 3022324503</strong> (+2-digit country code & 10-digit number)
                  </p>
                </div>

                {/* Email */}
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={crashEmail}
                    onChange={(e) => setCrashEmail(e.target.value)}
                    placeholder="student@example.com"
                    required
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-800 text-white text-sm focus:outline-hidden focus:border-amber-500 bg-slate-900 placeholder:text-slate-600"
                  />
                </div>

                {/* Grade */}
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Grade / Class Level *
                  </label>
                  <select
                    value={crashGrade}
                    onChange={(e) => setCrashGrade(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-800 text-white text-sm focus:outline-hidden focus:border-amber-500 bg-slate-900"
                  >
                    {GRADE_LEVEL_OPTIONS.map((grade) => (
                      <option key={grade} value={grade}>
                        {grade}
                      </option>
                    ))}
                  </select>
                </div>

              </div>

              {/* Subject Multi-Select */}
              <div className="space-y-2">
                <label className="text-[10px] font-extrabold text-amber-500 uppercase tracking-widest block">
                  Select Crash Subjects * ({crashSubjects.length} Selected)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                  {ALL_SUBJECTS.map((subj) => {
                    const isSelected = crashSubjects.includes(subj);
                    return (
                      <button
                        key={subj}
                        type="button"
                        onClick={() => toggleCrashSubject(subj)}
                        className={`p-2 rounded-lg border text-xs font-bold transition-all text-center ${
                          isSelected
                            ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-xs'
                            : 'bg-slate-900/60 text-slate-300 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        {subj}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Fee Summary */}
              <div className="bg-[#0a0c10] p-4 rounded-lg border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-serif italic text-white text-xs sm:text-sm block">Advance Lump Sum Crash Fee:</span>
                  <span className="text-[11px] text-amber-400 font-medium">PKR 120,000 per subject (Theory & Past Papers) • Paid in advance lump sum</span>
                </div>
                <span className="text-xl font-serif italic font-bold text-amber-400">
                  {formatPKR(crashCalc.total)}
                </span>
              </div>

              <button
                type="submit"
                disabled={!crashDateValidation.allowed || isSubmitting}
                className={`w-full py-3.5 rounded-lg font-extrabold text-xs uppercase tracking-widest shadow-xl transition-all flex items-center justify-center gap-2 ${
                  crashDateValidation.allowed
                    ? 'bg-amber-500 hover:bg-amber-600 text-slate-950'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                {isSubmitting ? 'Submitting Crash Course...' : 'Submit Crash Course Admission'}
              </button>
            </form>
          )}

          {/* ========================================================
              FORM 4: IT COURSES BOOKING FORM (Dynamic Dropdowns)
             ======================================================== */}
          {activeFormTab === 'it_course' && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const phoneCheck = validateWhatsAppPhone(itPhone);
                if (!phoneCheck.isValid) {
                  alert(phoneCheck.message);
                  return;
                }
                const booking: AnyBooking = {
                  id: `BK-IT-${Math.floor(1000 + Math.random() * 9000)}`,
                  type: 'it_course',
                  createdAt: new Date().toISOString(),
                  studentName: itStudentName,
                  studentPhone: phoneCheck.formatted,
                  email: itEmail,
                  board: '' as any,
                  gradeLevel: 'IT Professional Course',
                  courseName: itCourseName,
                  duration: itDuration,
                  mode: itMode,
                  startDate: itStartDate,
                  calculatedFee: itFeeCalculated,
                  status: 'Pending',
                  notes: itNotes
                };
                handleBookingSubmit(e, booking);
              }}
              className="space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4 border-slate-800">
                <div>
                  <h3 className="text-xl font-serif italic text-white flex items-center gap-2">
                    <Laptop className="w-5 h-5 text-amber-400" />
                    <span>IT Courses Booking</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Select your course, duration, and class mode. Fee calculates dynamically in real-time!
                  </p>
                </div>
              </div>

              {/* DYNAMIC DROPDOWN SELECTIONS */}
              <div className="bg-[#0a0c10] p-5 rounded-lg border border-slate-800 space-y-4">
                <h4 className="text-[10px] font-extrabold text-amber-500 uppercase tracking-widest">
                  Course Specification Dropdowns
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  
                  {/* Dropdown 1: Course Name */}
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">
                      1. Select IT Course Name *
                    </label>
                    <select
                      value={itCourseName}
                      onChange={(e) => setItCourseName(e.target.value as ITCourseName)}
                      required
                      className="w-full px-3 py-2.5 rounded-lg border border-slate-800 text-white text-xs font-semibold focus:outline-hidden focus:border-amber-500 bg-slate-900"
                    >
                      {IT_COURSES_DATA.map((c) => (
                        <option key={c.name} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Dropdown 2: Duration */}
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">
                      2. Select Duration *
                    </label>
                    <select
                      value={itDuration}
                      onChange={(e) => setItDuration(e.target.value as ITCourseDuration)}
                      required
                      className="w-full px-3 py-2.5 rounded-lg border border-slate-800 text-white text-xs font-semibold focus:outline-hidden focus:border-amber-500 bg-slate-900"
                    >
                      <option value="1 Month (Fast Track)">1 Month (Fast Track)</option>
                      <option value="2 Months (Standard)">2 Months (Standard)</option>
                      <option value="3 Months (Mastery)">3 Months (Mastery)</option>
                    </select>
                  </div>

                  {/* Dropdown 3: Class Mode */}
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">
                      3. Select Mode *
                    </label>
                    <select
                      value={itMode}
                      onChange={(e) => setItMode(e.target.value as TuitionMode)}
                      required
                      className="w-full px-3 py-2.5 rounded-lg border border-slate-800 text-white text-xs font-semibold focus:outline-hidden focus:border-amber-500 bg-slate-900"
                    >
                      <option value="Online Class (Zoom/Google Meet)">Online Class (Virtual Lab)</option>
                      <option value="Physical / Home Tuition (In-Person)">Physical / Home Tuition (In-Person)</option>
                    </select>
                  </div>

                </div>

                {/* Live Dynamic Fee Calculation Display */}
                <div className="bg-slate-900 text-white p-4 rounded-lg border border-slate-800 shadow-md flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-medium text-amber-400 block">Dynamic Fee Calculation</span>
                    <span className="font-bold text-xs sm:text-sm text-slate-200">
                      {itCourseName} • {itDuration} ({itMode.split(' ')[0]})
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400 block">Total Investment</span>
                    <span className="text-2xl font-serif italic font-bold text-amber-400">{formatPKR(itFeeCalculated)}</span>
                  </div>
                </div>
              </div>

              {/* Personal Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Student Full Name *
                  </label>
                  <input
                    type="text"
                    value={itStudentName}
                    onChange={(e) => setItStudentName(e.target.value)}
                    placeholder="Student name"
                    required
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-800 text-white text-sm focus:outline-hidden focus:border-amber-500 bg-slate-900 placeholder:text-slate-600"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    WhatsApp / Contact Number *
                  </label>
                  <input
                    type="tel"
                    value={itPhone}
                    onChange={(e) => setItPhone(e.target.value)}
                    placeholder="+92 3022324503"
                    required
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-800 text-white text-sm focus:outline-hidden focus:border-amber-500 bg-slate-900 placeholder:text-slate-600"
                  />
                  <p className="text-[10px] text-amber-400/90 mt-1">
                    Required format: <strong className="font-mono text-amber-300">+92 3022324503</strong> (+2-digit country code & 10-digit number)
                  </p>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={itEmail}
                    onChange={(e) => setItEmail(e.target.value)}
                    placeholder="student@example.com"
                    required
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-800 text-white text-sm focus:outline-hidden focus:border-amber-500 bg-slate-900 placeholder:text-slate-600"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Preferred Batch Start Date
                  </label>
                  <input
                    type="date"
                    value={itStartDate}
                    min={getTodayDate()}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val && val < getTodayDate()) {
                        alert('⚠️ Back dates are not permitted! Please select today or a future date.');
                        setItStartDate(getMinTrialDate());
                        return;
                      }
                      setItStartDate(val);
                    }}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-800 text-white text-sm focus:outline-hidden focus:border-amber-500 bg-slate-900"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs uppercase tracking-widest shadow-xl transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting ? 'Submitting IT Course Booking...' : `Confirm & Enroll in ${itCourseName}`}
              </button>
            </form>
          )}

        </div>
      </div>

      {/* ========================================================
          OFFICIAL INVOICE MODAL & PNG DOWNLOAD
         ======================================================== */}
      {submittedBooking && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0f1218] border border-amber-500/40 rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative space-y-5 animate-in fade-in zoom-in duration-200 text-slate-300 my-8">
            <button
              onClick={() => {
                setSubmittedBooking(null);
                window.location.reload();
              }}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
              title="Close and refresh page"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-2">
              <div className="w-14 h-14 bg-amber-500/20 text-amber-400 border border-amber-500/40 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <FileText className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-serif text-white font-bold">Official Fee Invoice Generated</h3>
              <p className="text-xs text-amber-400 font-medium">
                Click anywhere on the invoice below to download PNG and finish registration!
              </p>
            </div>

            {/* Clickable Official Invoice Card */}
            <div
              onClick={handleDownloadInvoiceAndRefresh}
              className="bg-slate-900/90 border-2 border-amber-500/40 hover:border-amber-400 rounded-xl p-5 sm:p-6 shadow-2xl space-y-4 cursor-pointer group hover:bg-slate-900 transition-all transform hover:scale-[1.01] active:scale-[0.99] relative overflow-hidden"
              title="Click to Download Invoice (PNG) & Refresh"
            >
              <div className="absolute top-0 right-0 bg-amber-500 text-slate-950 font-extrabold text-[10px] uppercase tracking-wider px-3 py-1 rounded-bl-lg flex items-center gap-1 shadow-md">
                <Download className="w-3 h-3 text-slate-950" />
                <span>Click to Download PNG</span>
              </div>

              {/* Header Section */}
              <div className="border-b border-slate-800 pb-3 text-center space-y-1">
                <h4 className="font-serif font-bold text-amber-400 text-xl tracking-tight">Sir Ali Preparation (Since 1992)</h4>
                <p className="text-xs text-slate-300 font-medium">+92 302 2324 503 | sagtut@gmail.com | sirali.com</p>
                <p className="text-xs text-amber-500 font-mono font-bold pt-0.5">Fee Invoice # {submittedBooking.id}</p>
              </div>

              {/* Body Section (2 Columns: Left & Right) */}
              <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* Left Section */}
                <div className="space-y-2 border-b sm:border-b-0 sm:border-r border-slate-800 pb-2 sm:pb-0 sm:pr-3">
                  <div>
                    <span className="text-slate-500 text-[10px] uppercase font-semibold block">Student Name</span>
                    <strong className="text-white text-sm">{submittedBooking.studentName || 'N/A'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] uppercase font-semibold block">Guardian Name</span>
                    <strong className="text-slate-200">{(submittedBooking as any).guardianName || 'N/A'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] uppercase font-semibold block">Contact Number</span>
                    <strong className="text-amber-300 font-mono">{submittedBooking.studentPhone || 'N/A'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] uppercase font-semibold block">Email</span>
                    <strong className="text-slate-300">{submittedBooking.email || 'N/A'}</strong>
                  </div>
                </div>

                {/* Right Section */}
                <div className="space-y-2">
                  <div>
                    <span className="text-slate-500 text-[10px] uppercase font-semibold block">Selected Subjects</span>
                    <strong className="text-white">
                      {submittedBooking.type === 'annual' || submittedBooking.type === 'crash' ? 
                        (submittedBooking.subjects?.join(', ') || 'Selected Subjects') :
                       submittedBooking.type === 'it_course' ? (submittedBooking.courseName || 'IT Course') :
                       (submittedBooking.subject || 'Trial Session')}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] uppercase font-semibold block">Grade / Class</span>
                    <strong className="text-slate-200">
                      {submittedBooking.type === 'it_course' ? (submittedBooking.duration || 'Standard') : (submittedBooking.gradeLevel || 'N/A')}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] uppercase font-semibold block">Class Mode</span>
                    <strong className="text-slate-200">{submittedBooking.mode || 'Online / Physical'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] uppercase font-semibold block">Level / Board</span>
                    <strong className="text-slate-200">
                      {submittedBooking.type === 'it_course' ? 'IT Skills Certification' : (submittedBooking.board || 'O Level / A Level')}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Fee Section (3 Sections: Actual Fee, Lump Sum / Discounted, Expiry Date) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                {/* Left Section (Actual Fee) */}
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-center space-y-0.5">
                  <span className="text-slate-400 text-[10px] uppercase font-semibold block">Actual Fee</span>
                  <strong className="text-white text-sm font-serif block">
                    {submittedBooking.type === 'annual' ? `${formatPKR(submittedBooking.totalMonthlyFee || 36000)} / mo` :
                     submittedBooking.type === 'crash' ? formatPKR(submittedBooking.calculatedFee || 120000) :
                     submittedBooking.type === 'it_course' ? formatPKR(submittedBooking.calculatedFee || 27000) :
                     formatPKR(submittedBooking.fee || 2500)}
                  </strong>
                  <span className="text-[9px] text-slate-500">Regular Scheduled Rate</span>
                </div>

                {/* Middle Section (Lump Sum / Discounted Fee or One Time Payment for Trial) */}
                <div className="bg-amber-950/30 p-2.5 rounded-lg border border-amber-500/40 text-center space-y-0.5">
                  <span className="text-amber-400 text-[10px] uppercase font-semibold block">
                    {submittedBooking.type === 'trial' ? 'One Time Payment' : 'Lump Sum / Discounted'}
                  </span>
                  <strong className="text-amber-400 text-sm font-serif block">
                    {submittedBooking.type === 'annual' ? formatPKR(submittedBooking.lumpSumTotal || Math.round((submittedBooking.totalFullCourseFee || 360000) * 0.95)) :
                     submittedBooking.type === 'crash' ? formatPKR(submittedBooking.calculatedFee || 120000) :
                     submittedBooking.type === 'it_course' ? formatPKR(submittedBooking.calculatedFee || 27000) :
                     formatPKR(submittedBooking.fee || 2500)}
                  </strong>
                  <span className="text-[9px] text-amber-300/80">
                    {submittedBooking.type === 'trial' ? 'Not Refundable' : 'Advance Paid Option'}
                  </span>
                </div>

                {/* Right Section (Invoice Expiry Date - 5 days after current date) */}
                <div className="bg-red-950/30 p-2.5 rounded-lg border border-red-500/40 text-center space-y-0.5">
                  <span className="text-red-400 text-[10px] uppercase font-semibold block">Expiry Date</span>
                  <strong className="text-red-300 text-sm font-mono block">
                    {new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </strong>
                  <span className="text-[9px] text-red-400/80">Valid 5 Days Only</span>
                </div>
              </div>

              {/* Footer (Thank you message & Mobile Notification Status) */}
              <div className="pt-2 text-center border-t border-slate-800/80 space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-semibold">
                  <Bell className="w-3 h-3 text-emerald-400 animate-pulse" />
                  <span>Real-time alert sent to Mobile: +92 302 2324503</span>
                </div>
                <p className="text-[11px] text-slate-400 italic font-serif">
                  Thank you for choosing Sir Ali Preparation! Computer Generated Official Fee Invoice.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 space-y-2.5">
              <a
                href={getWhatsAppNotificationUrl(submittedBooking)}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2"
                title="Direct WhatsApp Alert to Sir Ali (+92 302 2324503)"
              >
                <MessageSquare className="w-4 h-4 text-white" />
                <span>📲 Notify Sir Ali on WhatsApp (+92 302 2324503)</span>
              </a>

              <button
                type="button"
                onClick={handleDownloadInvoiceAndRefresh}
                className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm uppercase tracking-wider shadow-lg shadow-amber-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4 text-slate-950" />
                <span>Download Official Invoice (PNG) & Finish</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};
