import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  CheckSquare, 
  Square, 
  Clock, 
  DollarSign, 
  User, 
  Phone, 
  Mail, 
  Sparkles, 
  BookOpen, 
  GraduationCap, 
  Send, 
  CheckCircle, 
  X,
  Printer,
  Bell,
  MessageSquare
} from 'lucide-react';
import { 
  CUSTOM_INVOICE_DATA, 
  LEVEL_OPTIONS, 
  LevelOptionType, 
  TopicItem 
} from '../data/customInvoiceData';
import { AnyBooking, CustomInvoiceBooking, TuitionMode } from '../types';
import { saveBookingToStorage, sendToGoogleSheet, getWhatsAppNotificationUrl } from '../utils/googleSheets';
import { validateWhatsAppPhone } from '../utils/calculatorUtils';

interface CustomInvoiceProps {
  onBookingCreated?: (booking: AnyBooking) => void;
}

export const CustomInvoice: React.FC<CustomInvoiceProps> = ({ onBookingCreated }) => {
  // Level & Subject State
  const [selectedLevel, setSelectedLevel] = useState<LevelOptionType>("Olevels");
  
  // Available subjects for the selected level
  const availableSubjects = useMemo(() => {
    return CUSTOM_INVOICE_DATA[selectedLevel] || [];
  }, [selectedLevel]);

  // Selected Subject State (defaults to first subject in available level, e.g. Physics)
  const [selectedSubjectName, setSelectedSubjectName] = useState<string>("Physics");

  // Current Subject Object
  const currentSubjectObj = useMemo(() => {
    const found = availableSubjects.find(s => s.subjectName === selectedSubjectName);
    return found || availableSubjects[0];
  }, [availableSubjects, selectedSubjectName]);

  // Selected Topic IDs state (all topics selected by default)
  const [selectedTopicIds, setSelectedTopicIds] = useState<Set<string>>(() => {
    const defaultSubject = CUSTOM_INVOICE_DATA["Olevels"][0];
    return new Set(defaultSubject.topics.map(t => t.id));
  });

  // Handle Level Change
  const handleLevelChange = (newLevel: LevelOptionType) => {
    setSelectedLevel(newLevel);
    const subList = CUSTOM_INVOICE_DATA[newLevel] || [];
    if (subList.length > 0) {
      setSelectedSubjectName(subList[0].subjectName);
      setSelectedTopicIds(new Set(subList[0].topics.map(t => t.id)));
    }
  };

  // Handle Subject Change
  const handleSubjectChange = (newSubName: string) => {
    setSelectedSubjectName(newSubName);
    const found = availableSubjects.find(s => s.subjectName === newSubName);
    if (found) {
      setSelectedTopicIds(new Set(found.topics.map(t => t.id)));
    }
  };

  // Toggle single topic selection
  const toggleTopic = (id: string) => {
    setSelectedTopicIds(prev => {
      const updated = new Set(prev);
      if (updated.has(id)) {
        updated.delete(id);
      } else {
        updated.add(id);
      }
      return updated;
    });
  };

  // Select all / Deselect all
  const selectAllTopics = () => {
    if (!currentSubjectObj) return;
    setSelectedTopicIds(new Set(currentSubjectObj.topics.map(t => t.id)));
  };

  const deselectAllTopics = () => {
    setSelectedTopicIds(new Set());
  };

  // Contact Form State
  const [studentName, setStudentName] = useState('');
  const [guardianName, setGuardianName] = useState('');
  const [studentPhone, setStudentPhone] = useState('');
  const [email, setEmail] = useState('');
  const [mode, setMode] = useState<TuitionMode>('Online Class (Zoom/Google Meet)');
  const [notes, setNotes] = useState('');

  // Submission & Modal State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedBooking, setSubmittedBooking] = useState<CustomInvoiceBooking | null>(null);

  // Selected Topics List & Financial Calculations
  const selectedTopicsList = useMemo(() => {
    if (!currentSubjectObj) return [];
    return currentSubjectObj.topics.filter(t => selectedTopicIds.has(t.id));
  }, [currentSubjectObj, selectedTopicIds]);

  const totalHours = useMemo(() => {
    return selectedTopicsList.reduce((acc, curr) => acc + curr.hours, 0);
  }, [selectedTopicsList]);

  const totalFeePKR = useMemo(() => {
    return selectedTopicsList.reduce((acc, curr) => acc + curr.pricePKR, 0);
  }, [selectedTopicsList]);

  // Form Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedTopicsList.length === 0) {
      alert('Please select at least one syllabus topic for your custom curriculum.');
      return;
    }

    if (!studentName.trim() || !studentPhone.trim() || !email.trim()) {
      alert('Please fill in all required contact details.');
      return;
    }

    const phoneCheck = validateWhatsAppPhone(studentPhone);
    if (!phoneCheck.isValid) {
      alert(phoneCheck.message);
      return;
    }

    setIsSubmitting(true);

    const bookingId = `CUST-INV-${Math.floor(1000 + Math.random() * 9000)}`;

    const customBooking: CustomInvoiceBooking = {
      id: bookingId,
      type: 'custom_invoice',
      createdAt: new Date().toISOString(),
      studentName: studentName.trim(),
      guardianName: guardianName.trim() || undefined,
      studentPhone: phoneCheck.formatted,
      email: email.trim(),
      board: selectedLevel.includes('Karachi') 
        ? 'Karachi Board (BIEK / BSEK)' 
        : 'Cambridge (O Level / IGCSE / A Level)',
      gradeLevel: selectedLevel,
      level: selectedLevel,
      subject: currentSubjectObj.subjectName,
      selectedTopics: selectedTopicsList.map(t => ({
        name: t.name,
        hours: t.hours,
        pricePKR: t.pricePKR
      })),
      totalHours,
      totalFeePKR,
      mode,
      status: 'Pending',
      notes: notes.trim() || undefined
    };

    try {
      // 1. Save locally
      saveBookingToStorage(customBooking);

      // 2. Sync with Google Sheets
      await sendToGoogleSheet(customBooking);

      if (onBookingCreated) {
        onBookingCreated(customBooking);
      }

      setSubmittedBooking(customBooking);
    } catch (error: any) {
      console.error('Error submitting custom invoice:', error);
      alert('Error recording request: ' + (error.message || 'Unknown error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset all form state and refresh page
  const handleCloseAndReset = () => {
    setSubmittedBooking(null);
    setStudentName('');
    setGuardianName('');
    setStudentPhone('');
    setEmail('');
    setNotes('');
    setMode('Online Class (Zoom/Google Meet)');
    setSelectedLevel("Olevels");
    const subList = CUSTOM_INVOICE_DATA["Olevels"] || [];
    if (subList.length > 0) {
      setSelectedSubjectName(subList[0].subjectName);
      setSelectedTopicIds(new Set(subList[0].topics.map(t => t.id)));
    }
    // Refresh page back to custom curriculum section
    window.location.hash = '#custom_curriculum';
    window.location.reload();
  };

  return (
    <section id="custom_curriculum" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-20">
      
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-3">
          <FileText className="w-4 h-4 text-amber-400" />
          <span>Tailored Syllabus & Custom Curriculum</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-serif text-white font-bold tracking-tight">
          Custom Curriculum
        </h2>
        <p className="mt-2 text-sm text-slate-400 leading-relaxed">
          Select your class level, subject, and specific CAIE / Board syllabus topics to build a customized study plan with precise duration and price estimates.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Controls & Topic Selection (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Step 1: Select Level & Subject */}
          <div className="bg-[#0f1218] p-5 sm:p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center gap-2.5 text-amber-400 border-b border-slate-800 pb-3">
              <GraduationCap className="w-5 h-5 text-amber-400" />
              <h3 className="font-bold text-base text-white">1. Select Level & Subject</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Level Dropdown */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">
                  Select Grade / Class Level *
                </label>
                <select
                  value={selectedLevel}
                  onChange={(e) => handleLevelChange(e.target.value as LevelOptionType)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 text-white text-sm focus:outline-none focus:border-amber-500 bg-slate-900 font-medium"
                >
                  {LEVEL_OPTIONS.map((lvl) => (
                    <option key={lvl} value={lvl}>
                      {lvl}
                    </option>
                  ))}
                </select>
              </div>

              {/* Subject Dropdown */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">
                  Select Subject from List *
                </label>
                <select
                  value={selectedSubjectName}
                  onChange={(e) => handleSubjectChange(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 text-white text-sm focus:outline-none focus:border-amber-500 bg-slate-900 font-medium"
                >
                  {availableSubjects.map((sub) => (
                    <option key={sub.subjectName} value={sub.subjectName}>
                      {sub.subjectName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Step 2: Syllabus Topics Checklist */}
          <div className="bg-[#0f1218] p-5 sm:p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-2">
              <div className="flex items-center gap-2.5 text-cyan-400">
                <BookOpen className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-base text-white">
                  2. Syllabus Topics ({selectedLevel} - {currentSubjectObj?.subjectName})
                </h3>
              </div>

              <div className="flex items-center gap-2 text-xs font-semibold">
                <button
                  type="button"
                  onClick={selectAllTopics}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 transition-colors"
                >
                  Select All
                </button>
                <button
                  type="button"
                  onClick={deselectAllTopics}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 border border-slate-700 transition-colors"
                >
                  Deselect All
                </button>
              </div>
            </div>

            {/* Topics Checklist */}
            <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1 custom-scrollbar">
              {currentSubjectObj?.topics.map((topic, index) => {
                const isSelected = selectedTopicIds.has(topic.id);
                return (
                  <div
                    key={topic.id}
                    onClick={() => toggleTopic(topic.id)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                      isSelected
                        ? 'bg-amber-500/10 border-amber-500/40 text-white'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <button
                      type="button"
                      className="mt-0.5 text-amber-400 focus:outline-none shrink-0"
                    >
                      {isSelected ? (
                        <CheckSquare className="w-5 h-5 text-amber-400" />
                      ) : (
                        <Square className="w-5 h-5 text-slate-600" />
                      )}
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <span className={`text-xs sm:text-sm font-semibold leading-snug ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                          Topic {index + 1}: {topic.name}
                        </span>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700/60">
                            {topic.hours} hrs
                          </span>
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            PKR {topic.pricePKR.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Real-time Calculation & Contact Details (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Real-Time Price Summary Card */}
            <div className="bg-[#0f1218] p-5 sm:p-6 rounded-2xl border border-amber-500/30 bg-gradient-to-b from-amber-500/5 to-transparent shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  Custom Curriculum Summary
                </span>
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  {selectedTopicsList.length} Topics Selected
                </span>
              </div>

              <div className="space-y-2.5 text-xs text-slate-300">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Class Level:</span>
                  <span className="font-bold text-white">{selectedLevel}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Selected Subject:</span>
                  <span className="font-bold text-amber-400">{currentSubjectObj?.subjectName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Total Duration:</span>
                  <span className="font-bold text-cyan-300 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {totalHours} Hours
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase text-slate-400 font-bold">Total Estimated Fee</div>
                  <div className="text-xs text-slate-500">PKR {currentSubjectObj?.defaultPricePKR.toLocaleString()} / topic (2 hrs)</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-amber-400 font-serif">
                    PKR {totalFeePKR.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3: Contact & Booking Details */}
            <div className="bg-[#0f1218] p-5 sm:p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center gap-2.5 text-amber-400 border-b border-slate-800 pb-3">
                <User className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-base text-white">3. Student Contact Details</h3>
              </div>

              {/* Student Name */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Student Full Name *
                </label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="e.g. Muhammad Hamza"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 text-white text-sm focus:outline-none focus:border-amber-500 bg-slate-900"
                />
              </div>

              {/* Guardian Name */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Guardian / Parent Name
                </label>
                <input
                  type="text"
                  value={guardianName}
                  onChange={(e) => setGuardianName(e.target.value)}
                  placeholder="e.g. Tariq Mehmood"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 text-white text-sm focus:outline-none focus:border-amber-500 bg-slate-900"
                />
              </div>

              {/* Phone / WhatsApp */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  WhatsApp / Phone Number *
                </label>
                <input
                  type="tel"
                  value={studentPhone}
                  onChange={(e) => setStudentPhone(e.target.value)}
                  placeholder="+92 3022324503"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 text-white text-sm focus:outline-none focus:border-amber-500 bg-slate-900"
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. hamza@gmail.com"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 text-white text-sm focus:outline-none focus:border-amber-500 bg-slate-900"
                />
              </div>

              {/* Tuition Mode */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Preferred Learning Mode *
                </label>
                <select
                  value={mode}
                  onChange={(e) => setMode(e.target.value as TuitionMode)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 text-white text-sm focus:outline-none focus:border-amber-500 bg-slate-900"
                >
                  <option value="Online Class (Zoom/Google Meet)">Online Class (Zoom / Google Meet)</option>
                  <option value="Physical / Home Tuition (In-Person)">Physical / Home Tuition (In-Person)</option>
                </select>
              </div>

              {/* Notes */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Additional Notes / Specific Schedule Request
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Prefer evening slots after 5 PM..."
                  rows={2}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 text-white text-sm focus:outline-none focus:border-amber-500 bg-slate-900"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || selectedTopicsList.length === 0}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-sm uppercase tracking-wider shadow-xl shadow-amber-500/20 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Send className="w-4 h-4 text-slate-950" />
                <span>{isSubmitting ? 'Processing Request...' : 'Submit & Request Custom Curriculum'}</span>
              </button>
            </div>

          </form>

        </div>

      </div>

      {/* SUBMISSION CONFIRMATION MODAL */}
      {submittedBooking && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0f1218] border border-slate-800 rounded-2xl max-w-xl w-full p-6 space-y-5 relative shadow-2xl my-8">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white font-serif">Custom Curriculum Request Recorded</h3>
                  <p className="text-xs text-amber-400 font-semibold">Booking ID: {submittedBooking.id}</p>
                </div>
              </div>
              <button
                onClick={handleCloseAndReset}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Confirmation Message Box */}
            <div className="bg-emerald-950/40 p-4 rounded-xl border border-emerald-800/60 text-xs text-emerald-300 flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-semibold text-emerald-200">
                  Your request has been submitted successfully! We are reviewing availability and will follow up with you shortly.
                </p>
                <p className="text-emerald-400/80">
                  Payment details will be shared via WhatsApp once your class slot is confirmed.
                </p>
              </div>
            </div>

            {/* Custom Curriculum Details Table */}
            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 text-slate-300 border-b border-slate-800 pb-2">
                <div>
                  <span className="text-slate-500 block text-[10px]">Student Name:</span>
                  <span className="font-bold text-white">{submittedBooking.studentName}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Contact Phone:</span>
                  <span className="font-bold text-amber-400">{submittedBooking.studentPhone}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Level & Subject:</span>
                  <span className="font-bold text-white">{submittedBooking.level} ({submittedBooking.subject})</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Mode:</span>
                  <span className="font-bold text-slate-300">{submittedBooking.mode}</span>
                </div>
              </div>

              {/* Selected Topics List */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Selected Syllabus Topics ({submittedBooking.selectedTopics.length}):</span>
                <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar">
                  {submittedBooking.selectedTopics.map((top, idx) => (
                    <div key={idx} className="flex justify-between items-center text-slate-300 bg-slate-950/50 px-2.5 py-1.5 rounded border border-slate-800/80">
                      <span className="font-medium truncate max-w-[280px]">{top.name}</span>
                      <span className="text-amber-400 font-bold shrink-0">{top.hours} hrs • PKR {top.pricePKR.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total Calculation & Mobile Notification Status */}
              <div className="pt-3 border-t border-slate-800 space-y-2">
                <div className="flex justify-between items-center font-bold text-sm">
                  <span className="text-slate-300">Total Custom Curriculum ({submittedBooking.totalHours} hrs):</span>
                  <span className="text-amber-400 text-lg font-serif">PKR {submittedBooking.totalFeePKR.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-semibold w-fit mx-auto">
                  <Bell className="w-3 h-3 text-emerald-400 animate-pulse" />
                  <span>Real-time alert sent to Mobile: +92 302 2324503</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 space-y-2">
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
                onClick={handleCloseAndReset}
                className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm uppercase tracking-wider shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
              >
                Done
              </button>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
