import { ITCourseDuration, ITCourseName, SubjectType, TuitionMode } from '../types';
import { IT_COURSES_DATA } from '../data/tutorData';

// Format currency PKR
export function formatPKR(amount: number): string {
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    maximumFractionDigits: 0
  }).format(amount);
}

// Date helper: Today date string YYYY-MM-DD (disallow selecting past / back dates)
export function getTodayDate(): string {
  const date = new Date();
  return date.toISOString().split('T')[0];
}

// Date helper: Trial class back dates not allowed, allow only from next week (7 days from today)
export function getMinTrialDate(): string {
  const date = new Date();
  date.setDate(date.getDate() + 7); // minimum next week
  return date.toISOString().split('T')[0];
}

// Date helper: Annual Prep start date defaults to today (no back dates, current month & year)
export function getAnnualStartDateDefault(): string {
  return getTodayDate();
}

// Date helper: Get last day of current month in current year (YYYY-MM-DD)
export function getCurrentMonthMaxDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const lastDay = new Date(year, month + 1, 0);
  const yyyy = lastDay.getFullYear();
  const mm = String(lastDay.getMonth() + 1).padStart(2, '0');
  const dd = String(lastDay.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

// Validate Annual booking date (no back dates, only current month and current year)
export function validateAnnualBookingDate(dateStr: string): { allowed: boolean; message?: string } {
  if (!dateStr) {
    return { allowed: false, message: 'Please select a start date.' };
  }
  const todayStr = getTodayDate();
  if (dateStr < todayStr) {
    return { allowed: false, message: '⚠️ Back dates are not allowed. Please select today or a future date.' };
  }
  const maxMonthDate = getCurrentMonthMaxDate();
  if (dateStr > maxMonthDate) {
    return { allowed: false, message: '⚠️ Only dates within the current month and current year are allowed.' };
  }
  return { allowed: true };
}

// Date helper: Default crash date (Jan 5th of current or next year depending on today)
export function getDefaultCrashDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const jan15CurrentYear = new Date(year, 0, 15);
  if (now > jan15CurrentYear) {
    return `${year + 1}-01-05`;
  }
  return `${year}-01-05`;
}

// Date helper: Crash course dates allowed ONLY 1st Jan to 15th Jan and disallow back dates
export function validateCrashBookingDate(dateStr: string): { allowed: boolean; message?: string } {
  if (!dateStr) {
    return { allowed: false, message: 'Please select a booking date.' };
  }

  const todayStr = getTodayDate();
  if (dateStr < todayStr) {
    return {
      allowed: false,
      message: '⚠️ Back dates are not allowed. Please select a current or future date.'
    };
  }

  const date = new Date(dateStr);
  const month = date.getMonth(); // 0 = January
  const day = date.getDate();

  // Check if month is January (0) and day between 1 and 15
  if (month !== 0 || day < 1 || day > 15) {
    return {
      allowed: false,
      message: '⚠️ Crash Course booking is ONLY permitted between 1st January and 15th January. Bookings for other dates are disabled.'
    };
  }

  return { allowed: true };
}

// Fee calculations
export function calculateAnnualFee(subjectsCount: number) {
  const feePerMonthPerSubject = 12000;
  const durationMonths = 10;
  const totalMonthlyFee = subjectsCount * feePerMonthPerSubject;
  const totalFullCourseFee = totalMonthlyFee * durationMonths;
  const lumpSumDiscount = totalFullCourseFee * 0.05; // 5% discount if paid lump sum
  const lumpSumTotal = totalFullCourseFee - lumpSumDiscount;

  return {
    feePerMonthPerSubject,
    durationMonths,
    totalMonthlyFee,
    totalFullCourseFee,
    lumpSumDiscount,
    lumpSumTotal
  };
}

export function calculateCrashFee(subjects: SubjectType[], crashDuration: '1 Month Intensive' | '2 Months Complete', mode: TuitionMode) {
  const count = Math.max(1, subjects.length);
  const basePerSubject = 120000; // PKR 120,000 per subject for complete theory & past papers
  let total = count * basePerSubject;
  
  if (mode === 'Physical / Home Tuition (In-Person)') {
    total = Math.round(total * 1.25); // 25% physical tuition surcharge
  }

  return {
    count,
    basePerSubject,
    total,
    paymentTerm: 'Advance Lump Sum (Not Monthly Fee)',
    scope: 'Theory & Past Papers'
  };
}

export function calculateITCourseFee(courseName: ITCourseName, duration: ITCourseDuration, mode: TuitionMode): number {
  const config = IT_COURSES_DATA.find(c => c.name === courseName) || IT_COURSES_DATA[0];
  let multiplier = 1.0;

  if (duration === '2 Months (Standard)') {
    multiplier = 1.8; // 10% discount on 2nd month
  } else if (duration === '3 Months (Mastery)') {
    multiplier = 2.5; // ~17% discount on 3rd month
  }

  let total = config.basePrice1Month * multiplier;

  if (mode === 'Physical / Home Tuition (In-Person)') {
    total *= 1.35; // 35% surcharge for physical home visits
  }

  return Math.round(total);
}

/**
 * Validates WhatsApp / Phone number format.
 * Requirement: Must start with '+' followed by a 2-digit country code and a 10-digit number.
 * Total 12 digits after '+'.
 * Examples: +923022324503, +92 302 2324503, +92-302-2324503
 */
export function validateWhatsAppPhone(phone: string): { isValid: boolean; message?: string; formatted: string } {
  if (!phone || !phone.trim()) {
    return {
      isValid: false,
      message: '⚠️ WhatsApp / Contact number is required.',
      formatted: ''
    };
  }

  const trimmed = phone.trim();

  // Must start with '+'
  if (!trimmed.startsWith('+')) {
    return {
      isValid: false,
      message: '⚠️ Phone number must start with a "+" sign followed by a 2-digit country code and a 10-digit number (e.g. +92 3022324503 or +923022324503).',
      formatted: trimmed
    };
  }

  // Extract all digits after '+'
  const digitsOnly = trimmed.slice(1).replace(/\D/g, '');

  if (digitsOnly.length !== 12) {
    return {
      isValid: false,
      message: `⚠️ Phone number must contain a 2-digit country code and a 10-digit number (total 12 digits after '+'). You provided ${digitsOnly.length} digits. Example: +923022324503`,
      formatted: trimmed
    };
  }

  const countryCode = digitsOnly.slice(0, 2);
  const localNumber = digitsOnly.slice(2);
  const formatted = `+${countryCode} ${localNumber}`;

  return {
    isValid: true,
    formatted
  };
}
