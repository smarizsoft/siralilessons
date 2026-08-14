export type BoardType = 
  | 'Cambridge (O Level / IGCSE / A Level)'
  | 'Karachi Board (BIEK / BSEK)'
  | 'Federal Board (FBISE)'
  | 'AKU-EB (Aga Khan Board)';

export type SubjectType = 
  | 'Physics'
  | 'Chemistry'
  | 'Mathematics'
  | 'Additional Mathematics'
  | 'Computer Science';

export type ITCourseName = 
  | 'Web Development (HTML, CSS, JS, React)'
  | 'Python Programming & Data Science Fundamentals'
  | 'Graphic Design & UI/UX Design'
  | 'MS Office & IT Office Automation'
  | 'Cyber Security & Ethical Hacking Basics'
  | 'Computer Science O/A Level Practical Coding';

export type ITCourseDuration = '1 Month (Fast Track)' | '2 Months (Standard)' | '3 Months (Mastery)';

export type TuitionMode = 'Online Class (Zoom/Google Meet)' | 'Physical / Home Tuition (In-Person)';

export type BookingStatus = 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';

export interface BaseBooking {
  id: string;
  createdAt: string;
  studentName: string;
  guardianName?: string;
  studentPhone: string;
  email: string;
  board: BoardType;
  gradeLevel: string;
  cityArea?: string;
  status: BookingStatus;
  notes?: string;
}

export interface TrialBooking extends BaseBooking {
  type: 'trial';
  selectedDate: string; // Must be >= next week
  timeSlot: string;
  subject: SubjectType | 'IT Courses';
  mode: TuitionMode;
  fee: 2500; // Fixed PKR 2500
  duration: '90 Minutes';
}

export interface AnnualBooking extends BaseBooking {
  type: 'annual';
  startDate: string; // Starts from 1st Aug
  durationMonths: 10; // Mandatory 10 months
  subjects: SubjectType[];
  mode: TuitionMode;
  feePerMonthPerSubject: 12000;
  totalMonthlyFee: number; // subjects.length * 12000
  totalFullCourseFee: number; // totalMonthlyFee * 10
  paymentSchedule: 'Monthly Installments' | 'Lump Sum (5% Discount)';
}

export interface CrashBooking extends BaseBooking {
  type: 'crash';
  bookingDate: string; // Must be 1st Jan - 15th Jan
  subjects: SubjectType[];
  crashDuration: '1 Month Intensive' | '2 Months Complete';
  mode: TuitionMode;
  calculatedFee: number;
}

export interface ITCourseBooking extends BaseBooking {
  type: 'it_course';
  courseName: ITCourseName;
  duration: ITCourseDuration;
  mode: TuitionMode;
  startDate: string;
  calculatedFee: number;
}

export interface CustomInvoiceBooking extends BaseBooking {
  type: 'custom_invoice';
  level: string;
  subject: string;
  selectedTopics: Array<{
    name: string;
    hours: number;
    pricePKR: number;
  }>;
  totalHours: number;
  totalFeePKR: number;
  mode: TuitionMode;
}

export type AnyBooking = TrialBooking | AnnualBooking | CrashBooking | ITCourseBooking | CustomInvoiceBooking;

export interface GoogleSheetSettings {
  webhookUrl: string;
  autoSync: boolean;
  lastSyncedAt?: string;
}
