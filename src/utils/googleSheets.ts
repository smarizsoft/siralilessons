import { AnyBooking, GoogleSheetSettings } from '../types';

const STORAGE_KEY_BOOKINGS = 'prof_tuition_bookings_db_v1';
const STORAGE_KEY_SETTINGS = 'prof_tuition_gsheet_settings_v1';

// Default initial mock bookings so teacher sees how bookings look in dashboard
const SAMPLE_BOOKINGS: AnyBooking[] = [
  {
    id: 'BK-TRIAL-8841',
    type: 'trial',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    studentName: 'Zainab Ahmed',
    guardianName: 'Dr. Ahmed Tanveer',
    studentPhone: '+923001234567',
    email: 'zainab.t@gmail.com',
    board: 'Cambridge (O Level / IGCSE / A Level)',
    gradeLevel: 'O-Level (Grade 10)',
    selectedDate: '2026-08-15',
    timeSlot: '05:00 PM - 06:30 PM',
    subject: 'Physics',
    mode: 'Online Class (Zoom/Google Meet)',
    fee: 2500,
    duration: '90 Minutes',
    status: 'Confirmed',
    notes: 'Struggling with kinematics equations'
  },
  {
    id: 'BK-ANN-1092',
    type: 'annual',
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    studentName: 'Muhammad Ali',
    guardianName: 'Ali Raza',
    studentPhone: '+923219876543',
    email: 'ali.raza@yahoo.com',
    board: 'Federal Board (FBISE)',
    gradeLevel: 'HSSC-I (FSc Pre-Engineering)',
    startDate: '2026-08-01',
    durationMonths: 10,
    subjects: ['Physics', 'Chemistry', 'Mathematics'],
    mode: 'Physical / Home Tuition (In-Person)',
    feePerMonthPerSubject: 12000,
    totalMonthlyFee: 36000,
    totalFullCourseFee: 360000,
    paymentSchedule: 'Monthly Installments',
    status: 'Confirmed',
    notes: 'Home tuition requested for DHA Phase 5'
  },
  {
    id: 'BK-IT-4491',
    type: 'it_course',
    createdAt: new Date().toISOString(),
    studentName: 'Saad Malik',
    studentPhone: '+923335554433',
    email: 'saad.dev@gmail.com',
    board: 'Cambridge (O Level / IGCSE / A Level)',
    gradeLevel: 'A-Level Graduate',
    courseName: 'Web Development (HTML, CSS, JS, React)',
    duration: '2 Months (Standard)',
    mode: 'Online Class (Zoom/Google Meet)',
    startDate: '2026-08-20',
    calculatedFee: 27000,
    status: 'Pending',
    notes: 'Wants to build portfolio websites'
  }
];

export function getStoredBookings(): AnyBooking[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_BOOKINGS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_BOOKINGS, JSON.stringify(SAMPLE_BOOKINGS));
      return SAMPLE_BOOKINGS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to parse bookings from localStorage', err);
    return SAMPLE_BOOKINGS;
  }
}

export function saveBookingToStorage(booking: AnyBooking): void {
  const current = getStoredBookings();
  const updated = [booking, ...current];
  localStorage.setItem(STORAGE_KEY_BOOKINGS, JSON.stringify(updated));
}

export function updateBookingStatus(id: string, newStatus: AnyBooking['status']): void {
  const current = getStoredBookings();
  const updated = current.map(b => b.id === id ? { ...b, status: newStatus } : b);
  localStorage.setItem(STORAGE_KEY_BOOKINGS, JSON.stringify(updated));
}

export function deleteBookingFromStorage(id: string): void {
  const current = getStoredBookings();
  const updated = current.filter(b => b.id !== id);
  localStorage.setItem(STORAGE_KEY_BOOKINGS, JSON.stringify(updated));
}

export function getGoogleSheetSettings(): GoogleSheetSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SETTINGS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.webhookUrl && parsed.webhookUrl.trim()) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to parse settings', e);
  }

  // Check if Vite environment variable is defined
  const envUrl = ((import.meta as any).env?.VITE_GOOGLE_SHEETS_WEBHOOK_URL || (import.meta as any).env?.VITE_GSHEET_WEBHOOK_URL || '').trim();

  return {
    webhookUrl: envUrl || '',
    autoSync: true
  };
}

export function saveGoogleSheetSettings(settings: GoogleSheetSettings): void {
  localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
}

// Send booking data to Google Apps Script Webhook URL if configured
export async function sendToGoogleSheet(booking: AnyBooking): Promise<{ success: boolean; message: string }> {
  const settings = getGoogleSheetSettings();
  const url = (settings.webhookUrl || '').trim();

  if (!url) {
    return {
      success: false,
      message: 'Google Sheets webhook URL is not configured yet. Booking is securely stored in your local Dashboard.'
    };
  }

  try {
    // Standard fetch using 'text/plain' Content-Type to avoid CORS preflight rejection in Google Apps Script Web Apps
    await fetch(url, {
      method: 'POST',
      mode: 'no-cors',
      cache: 'no-cache',
      redirect: 'follow',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: JSON.stringify(booking)
    });

    // Update last sync timestamp
    saveGoogleSheetSettings({
      ...settings,
      lastSyncedAt: new Date().toLocaleTimeString()
    });

    return {
      success: true,
      message: 'Booking successfully synchronized with your Google Sheet!'
    };
  } catch (error: any) {
    console.warn('Standard fetch error, trying beacon fallback:', error);
    try {
      if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
        const blob = new Blob([JSON.stringify(booking)], { type: 'text/plain' });
        navigator.sendBeacon(url, blob);
        return {
          success: true,
          message: 'Booking dispatched to Google Sheet queue.'
        };
      }
    } catch (beaconErr) {
      console.error('Beacon fallback failed:', beaconErr);
    }

    return {
      success: false,
      message: `Saved locally. Could not sync to Google Sheet: ${error.message || 'Network error'}`
    };
  }
}

// Batch sync all local bookings to Google Sheet
export async function syncAllBookingsToGoogleSheet(): Promise<{ success: boolean; syncedCount: number; message: string }> {
  const bookings = getStoredBookings();
  const settings = getGoogleSheetSettings();
  const url = (settings.webhookUrl || '').trim();

  if (!url) {
    return {
      success: false,
      syncedCount: 0,
      message: 'Google Sheets Webhook URL is not configured. Please paste your Web App URL in settings first.'
    };
  }

  let count = 0;
  for (const b of bookings) {
    await sendToGoogleSheet(b);
    count++;
    // Small delay between requests to avoid burst rate limiting
    await new Promise(r => setTimeout(r, 200));
  }

  return {
    success: true,
    syncedCount: count,
    message: `Successfully sent ${count} booking record(s) to your Google Sheet!`
  };
}

// Helper to create a direct WhatsApp notification link to teacher's mobile +923022324503
export function getWhatsAppNotificationUrl(booking: AnyBooking): string {
  const teacherPhone = '923022324503';
  let summary = `*NEW BOOKING ALERT - Sir Ali Academy*\n`;
  summary += `• Booking ID: ${booking.id}\n`;
  summary += `• Type: ${booking.type.toUpperCase()}\n`;
  summary += `• Student Name: ${booking.studentName}\n`;
  if ((booking as any).guardianName) summary += `• Guardian: ${(booking as any).guardianName}\n`;
  summary += `• Phone: ${booking.studentPhone}\n`;
  if (booking.email) summary += `• Email: ${booking.email}\n`;
  summary += `• Board: ${booking.board}\n`;

  if (booking.type === 'trial') {
    summary += `• Trial Subject: ${booking.subject}\n`;
    summary += `• Slot: ${booking.selectedDate} (${booking.timeSlot})\n`;
    summary += `• Fee: PKR ${booking.fee}\n`;
  } else if (booking.type === 'annual') {
    summary += `• Annual Subjects: ${booking.subjects.join(', ')}\n`;
    summary += `• Start Date: ${booking.startDate} (10 Months)\n`;
    summary += `• Fee: PKR ${booking.totalMonthlyFee}/month (Full Course: PKR ${booking.totalFullCourseFee})\n`;
  } else if (booking.type === 'crash') {
    summary += `• Crash Subjects: ${booking.subjects.join(', ')}\n`;
    summary += `• Window: ${booking.bookingDate}\n`;
    summary += `• Fee: PKR ${booking.calculatedFee}\n`;
  } else if (booking.type === 'it_course') {
    summary += `• Course: ${booking.courseName} (${booking.duration})\n`;
    summary += `• Fee: PKR ${booking.calculatedFee}\n`;
  } else if (booking.type === 'custom_invoice') {
    summary += `• Custom Syllabus: ${booking.level} - ${booking.subject} (${booking.selectedTopics.length} topics, ${booking.totalHours} hrs)\n`;
    summary += `• Fee: PKR ${booking.totalFeePKR}\n`;
  }

  summary += `• Mode: ${booking.mode}\n`;
  summary += `• Status: ${booking.status}\n`;
  if (booking.notes) summary += `• Notes: ${booking.notes}\n`;

  return `https://wa.me/${teacherPhone}?text=${encodeURIComponent(summary)}`;
}

// Generate Google Apps Script snippet for teacher's Google Sheet
export const GOOGLE_APPS_SCRIPT_CODE = `/**
 * GOOGLE APPS SCRIPT FOR PROF. SCIENCE & IT ACADEMY DATABASE
 * --------------------------------------------------------
 * WITH AUTOMATIC REAL-TIME MOBILE NOTIFICATION (+92 302 2324503)
 * & DIRECT BACKGROUND WHATSAPP API DISPATCH (ZERO USER INTERRUPTION)
 * 
 * HOW TO CONNECT IN 2 MINUTES:
 * 1. Open your Google Sheet (create a new one or open existing).
 * 2. In the top menu, click: Extensions > Apps Script.
 * 3. Delete everything in the script editor, and paste this entire code.
 * 4. (Optional) Put your WhatsApp API token below (UltraMsg / GreenAPI / Custom).
 * 5. Click 'Deploy' (top right blue button) > 'New deployment'.
 * 6. Click the gear icon ⚙ beside "Select type" and choose 'Web app'.
 * 7. Under 'Execute as', select: 'Me' (your email).
 * 8. Under 'Who has access', select: 'Anyone' (Crucial: allows forms to submit).
 * 9. Click 'Deploy', authorize permissions when prompted, and copy the Web App URL!
 * 10. Paste the Web App URL into the app's 'Google Sheet DB' settings.
 */

// =============================================================================
// TEACHER CONFIGURATION
// =============================================================================
var TEACHER_MOBILE = "+92 302 2324503";
var TEACHER_WHATSAPP_NUMBER = "923022324503"; // Without '+' or spaces
var TEACHER_EMAIL = "sagtut@gmail.com";

// =============================================================================
// (OPTIONAL) AUTOMATED BACKGROUND WHATSAPP API (Choose ANY ONE service):
// =============================================================================
// 🟢 OPTION A: UltraMsg (https://ultramsg.com - Scan QR & paste credentials)
var ULTRAMSG_INSTANCE_ID = ""; // e.g. "instance12345"
var ULTRAMSG_TOKEN = "";       // e.g. "abcdef123456"

// 🟢 OPTION B: Green API (https://green-api.com)
var GREENAPI_ID_INSTANCE = ""; // e.g. "1101823456"
var GREENAPI_API_TOKEN = "";   // e.g. "d7b4b3e0..."

// 🟢 OPTION C: Custom WhatsApp Webhook / Waha / Wasender
var CUSTOM_WHATSAPP_WEBHOOK = ""; // e.g. "https://api.yourbot.com/send"

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    if (!ss) {
      return ContentService
        .createTextOutput(JSON.stringify({ result: "error", message: "No active spreadsheet found." }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    var sheet = ss.getSheetByName("Bookings");
    if (!sheet) {
      sheet = ss.getActiveSheet();
      if (sheet.getName() === "Sheet1") {
        try { sheet.setName("Bookings"); } catch(err) {}
      }
    }

    // Auto-create clean headers if sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Booking ID", 
        "Form Type", 
        "Date Submitted", 
        "Student Name", 
        "Guardian Name", 
        "Phone / WhatsApp", 
        "Email", 
        "Board / System", 
        "Grade Level", 
        "Subject / Course Details", 
        "Mode", 
        "Fee / Amount (PKR)", 
        "Status", 
        "Notes"
      ]);
      
      var headerRange = sheet.getRange(1, 1, 1, 14);
      headerRange.setFontWeight("bold");
      headerRange.setBackground("#1e293b");
      headerRange.setFontColor("#ffffff");
      headerRange.setHorizontalAlignment("center");
      try { sheet.setFrozenRows(1); } catch(fErr) {}
    }

    // Parse incoming payload safely
    var data = {};
    if (e && e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch(parseErr) {
        data = e.parameter || {};
      }
    } else if (e && e.parameter && e.parameter.data) {
      try {
        data = JSON.parse(e.parameter.data);
      } catch(parseErr) {
        data = e.parameter || {};
      }
    } else if (e && e.parameter) {
      data = e.parameter;
    }

    var formType = (data.type || "booking").toString().toLowerCase();
    var details = "";
    var feeFormatted = "";

    if (formType === "trial") {
      details = "Trial Subject: " + (data.subject || "General") + " | Slot: " + (data.selectedDate || "Upcoming") + " (" + (data.timeSlot || "Standard") + ")";
      feeFormatted = "PKR " + (data.fee || 2500) + " (One-time 90min)";
    } else if (formType === "annual") {
      var subjList = Array.isArray(data.subjects) ? data.subjects.join(", ") : (data.subjects || "Selected Subjects");
      var count = Array.isArray(data.subjects) ? data.subjects.length : 1;
      details = "Annual Subjects (" + count + "): " + subjList + " | Start: " + (data.startDate || "Aug 1st") + " (" + (data.durationMonths || 10) + " Months)";
      feeFormatted = "PKR " + (data.totalMonthlyFee || 0) + "/month (Total: PKR " + (data.totalFullCourseFee || 0) + ")";
    } else if (formType === "crash") {
      var crashSubj = Array.isArray(data.subjects) ? data.subjects.join(", ") : (data.subjects || "Crash Subjects");
      details = "Crash Subjects: " + crashSubj + " | Window: " + (data.bookingDate || data.startDate || "Jan 1-15");
      feeFormatted = "PKR " + (data.calculatedFee || 0);
    } else if (formType === "it_course") {
      details = "IT Course: " + (data.courseName || "IT Training") + " (" + (data.duration || "Standard") + ") | Start: " + (data.startDate || "Upcoming");
      feeFormatted = "PKR " + (data.calculatedFee || 0);
    } else if (formType === "custom_invoice") {
      var topicCount = data.selectedTopics && Array.isArray(data.selectedTopics) ? data.selectedTopics.length : 0;
      details = "Custom Curriculum: " + (data.level || "") + " (" + (data.subject || "") + ") - " + topicCount + " topics (" + (data.totalHours || 0) + " hrs)";
      feeFormatted = "PKR " + (data.totalFeePKR || 0);
    } else {
      details = data.notes || data.details || "General Admission";
      feeFormatted = "PKR " + (data.fee || data.calculatedFee || data.totalFeePKR || 0);
    }

    var phoneFormatted = data.studentPhone ? "'" + data.studentPhone : "";
    var bookingId = data.id || ("BK-" + Math.floor(1000 + Math.random() * 9000));
    var createdAtStr = data.createdAt || new Date().toLocaleString();

    // 1. Append row into Google Sheet
    sheet.appendRow([
      bookingId,
      formType.toUpperCase(),
      createdAtStr,
      data.studentName || "N/A",
      data.guardianName || "-",
      phoneFormatted,
      data.email || "",
      data.board || "IT / Academic",
      data.gradeLevel || "-",
      details,
      data.mode || "Online",
      feeFormatted,
      data.status || "Pending",
      data.notes || ""
    ]);

    // 2. Prepare Notification Message Body
    var waNotificationText = 
      "🚨 *NEW ADMISSION ALERT - Prof. Science & IT Academy* 🚨\\n\\n" +
      "📌 *Booking ID:* " + bookingId + "\\n" +
      "🏷️ *Type:* " + formType.toUpperCase() + "\\n" +
      "👤 *Student Name:* " + (data.studentName || "N/A") + "\\n" +
      "👨‍👦 *Guardian:* " + (data.guardianName || "-") + "\\n" +
      "📞 *Phone:* " + (data.studentPhone || "N/A") + "\\n" +
      "📧 *Email:* " + (data.email || "-") + "\\n" +
      "📚 *Board / Level:* " + (data.board || "IT/Academic") + " (" + (data.gradeLevel || "-") + ")\\n" +
      "📖 *Course Details:* " + details + "\\n" +
      "💻 *Mode:* " + (data.mode || "Online") + "\\n" +
      "💰 *Fee:* " + feeFormatted + "\\n" +
      "⏰ *Time:* " + createdAtStr;

    // =========================================================================
    // 3. BACKGROUND WHATSAPP API DISPATCH (ZERO USER ACTION REQUIRED)
    // =========================================================================
    try {
      // (A) UltraMsg API
      if (ULTRAMSG_INSTANCE_ID && ULTRAMSG_TOKEN) {
        UrlFetchApp.fetch("https://api.ultramsg.com/" + ULTRAMSG_INSTANCE_ID + "/messages/chat", {
          method: "post",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          payload: {
            token: ULTRAMSG_TOKEN,
            to: TEACHER_WHATSAPP_NUMBER,
            body: waNotificationText
          },
          muteHttpExceptions: true
        });
      }

      // (B) Green API
      if (GREENAPI_ID_INSTANCE && GREENAPI_API_TOKEN) {
        var greenApiUrl = "https://api.green-api.com/waInstance" + GREENAPI_ID_INSTANCE + "/sendMessage/" + GREENAPI_API_TOKEN;
        UrlFetchApp.fetch(greenApiUrl, {
          method: "post",
          headers: { "Content-Type": "application/json" },
          payload: JSON.stringify({
            chatId: TEACHER_WHATSAPP_NUMBER + "@c.us",
            message: waNotificationText
          }),
          muteHttpExceptions: true
        });
      }

      // (C) Custom Webhook
      if (CUSTOM_WHATSAPP_WEBHOOK) {
        UrlFetchApp.fetch(CUSTOM_WHATSAPP_WEBHOOK, {
          method: "post",
          headers: { "Content-Type": "application/json" },
          payload: JSON.stringify({
            phone: TEACHER_WHATSAPP_NUMBER,
            message: waNotificationText,
            booking: data
          }),
          muteHttpExceptions: true
        });
      }
    } catch(waErr) {
      Logger.log("WhatsApp API Dispatch Error: " + waErr.toString());
    }

    // =========================================================================
    // 4. INSTANT PUSH EMAIL ALERT (Always active fallback to Google Mobile App)
    // =========================================================================
    try {
      var effectiveUser = Session.getEffectiveUser().getEmail();
      var recipientList = TEACHER_EMAIL;
      if (effectiveUser && effectiveUser !== TEACHER_EMAIL && effectiveUser.indexOf("@") !== -1) {
        recipientList = TEACHER_EMAIL + "," + effectiveUser;
      }

      var studentPhoneClean = (data.studentPhone || "").replace(/[^0-9+]/g, "");
      var waStudentLink = studentPhoneClean ? "https://wa.me/" + studentPhoneClean.replace("+", "") : "";
      var emailSubject = "🚨 NEW ADMISSION ALERT: " + (data.studentName || "Student") + " (" + formType.toUpperCase() + ") - " + feeFormatted;
      
      var emailHtml = 
        "<div style='font-family: -apple-system, BlinkMacSystemFont, Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; background: #ffffff; box-shadow: 0 4px 12px rgba(0,0,0,0.05);'>" +
          "<div style='background: #0f172a; color: #f59e0b; padding: 22px 20px; text-align: center; border-bottom: 3px solid #f59e0b;'>" +
            "<h2 style='margin: 0; font-size: 20px; color: #f59e0b;'>🔔 Prof. Science & IT Academy</h2>" +
            "<p style='margin: 6px 0 0 0; color: #94a3b8; font-size: 13px;'>Instant Mobile Push Alert & Google Sheet Log</p>" +
          "</div>" +
          "<div style='padding: 24px 20px; color: #1e293b; font-size: 14px; line-height: 1.6;'>" +
            "<div style='background: #f8fafc; border-left: 4px solid #f59e0b; padding: 12px 16px; margin-bottom: 18px; border-radius: 4px;'>" +
              "<strong style='color: #0f172a; font-size: 15px;'>A new student admission form has just been submitted and recorded in your Google Sheet!</strong>" +
            "</div>" +
            "<table style='width: 100%; border-collapse: collapse; margin-top: 10px;'>" +
              "<tr style='border-bottom: 1px solid #f1f5f9;'><td style='padding: 9px 0; color: #64748b; width: 35%;'><strong>Booking ID:</strong></td><td style='padding: 9px 0; font-weight: bold; color: #0f172a; font-family: monospace;'>" + bookingId + "</td></tr>" +
              "<tr style='border-bottom: 1px solid #f1f5f9;'><td style='padding: 9px 0; color: #64748b;'><strong>Category:</strong></td><td style='padding: 9px 0; font-weight: bold; color: #d97706;'>" + formType.toUpperCase() + "</td></tr>" +
              "<tr style='border-bottom: 1px solid #f1f5f9;'><td style='padding: 9px 0; color: #64748b;'><strong>Student Name:</strong></td><td style='padding: 9px 0; font-weight: bold; color: #0f172a; font-size: 16px;'>" + (data.studentName || "N/A") + "</td></tr>" +
              "<tr style='border-bottom: 1px solid #f1f5f9;'><td style='padding: 9px 0; color: #64748b;'><strong>Guardian:</strong></td><td style='padding: 9px 0;'>" + (data.guardianName || "-") + "</td></tr>" +
              "<tr style='border-bottom: 1px solid #f1f5f9;'><td style='padding: 9px 0; color: #64748b;'><strong>Phone / WhatsApp:</strong></td><td style='padding: 9px 0; font-weight: bold;'><a href='tel:" + studentPhoneClean + "' style='color: #2563eb; text-decoration: none;'>" + (data.studentPhone || "N/A") + "</a></td></tr>" +
              "<tr style='border-bottom: 1px solid #f1f5f9;'><td style='padding: 9px 0; color: #64748b;'><strong>Email:</strong></td><td style='padding: 9px 0;'>" + (data.email || "-") + "</td></tr>" +
              "<tr style='border-bottom: 1px solid #f1f5f9;'><td style='padding: 9px 0; color: #64748b;'><strong>Board / Level:</strong></td><td style='padding: 9px 0;'>" + (data.board || "IT / Academic") + " (" + (data.gradeLevel || "-") + ")</td></tr>" +
              "<tr style='border-bottom: 1px solid #f1f5f9;'><td style='padding: 9px 0; color: #64748b;'><strong>Course Details:</strong></td><td style='padding: 9px 0; font-weight: bold; color: #0f172a;'>" + details + "</td></tr>" +
              "<tr style='border-bottom: 1px solid #f1f5f9;'><td style='padding: 9px 0; color: #64748b;'><strong>Class Mode:</strong></td><td style='padding: 9px 0;'>" + (data.mode || "Online") + "</td></tr>" +
              "<tr style='border-bottom: 1px solid #f1f5f9;'><td style='padding: 9px 0; color: #64748b;'><strong>Calculated Fee:</strong></td><td style='padding: 9px 0; font-weight: bold; color: #059669; font-size: 15px;'>" + feeFormatted + "</td></tr>" +
            "</table>" +
            "<div style='margin-top: 24px; text-align: center; display: flex; gap: 10px; justify-content: center;'>" +
              "<a href='https://wa.me/923022324503' style='display: inline-block; background: #22c55e; color: #ffffff; text-decoration: none; padding: 11px 20px; border-radius: 8px; font-weight: bold; font-size: 13px; margin: 4px;'>📱 Teacher Mobile: +92 302 2324503</a>" +
              (waStudentLink ? "<a href='" + waStudentLink + "' style='display: inline-block; background: #0284c7; color: #ffffff; text-decoration: none; padding: 11px 20px; border-radius: 8px; font-weight: bold; font-size: 13px; margin: 4px;'>💬 Message Student WhatsApp</a>" : "") +
            "</div>" +
          "</div>" +
          "<div style='background: #f8fafc; padding: 14px 20px; text-align: center; color: #94a3b8; font-size: 11px; border-top: 1px solid #e2e8f0;'>" +
            "Automated alert dispatched upon Google Sheet entry.<br/>Teacher Mobile: <strong>+92 302 2324503</strong> | Email: <strong>sagtut@gmail.com</strong>" +
          "</div>" +
        "</div>";

      MailApp.sendEmail({
        to: recipientList,
        subject: emailSubject,
        htmlBody: emailHtml
      });
    } catch(notifErr) {
      Logger.log("Notification dispatch warning: " + notifErr.toString());
    }

    return ContentService
      .createTextOutput(JSON.stringify({ result: "success", id: bookingId, notifiedPhone: TEACHER_MOBILE }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  if (e && e.parameter && e.parameter.ping === "test") {
    return ContentService.createTextOutput(JSON.stringify({ 
      status: "ok", 
      message: "Sir Ali Tuition Google Sheet Webhook & WhatsApp API (+92 302 2324503) is active and connected!" 
    })).setMimeType(ContentService.MimeType.JSON);
  }
  return ContentService.createTextOutput("Sir Ali Tuition Booking Webhook is Active! Background WhatsApp alerts configured for +92 302 2324503.");
}
`;

export function exportBookingsToCSV(bookings: AnyBooking[]): void {
  if (!bookings || bookings.length === 0) return;

  const headers = [
    'Booking ID',
    'Type',
    'Date Submitted',
    'Student Name',
    'Phone',
    'Email',
    'Board',
    'Course/Subjects',
    'Mode',
    'Fee (PKR)',
    'Status'
  ];

  const rows = bookings.map(b => {
    let courseInfo = '';
    let feeInfo = '';

    if (b.type === 'trial') {
      courseInfo = `Trial ${b.subject} (${b.selectedDate} ${b.timeSlot})`;
      feeInfo = '2500';
    } else if (b.type === 'annual') {
      courseInfo = `Annual Prep: ${b.subjects.join('; ')} (10 Mo from ${b.startDate})`;
      feeInfo = `${b.totalFullCourseFee} (${b.totalMonthlyFee}/mo)`;
    } else if (b.type === 'crash') {
      courseInfo = `Crash Course: ${b.subjects.join('; ')} (${b.bookingDate})`;
      feeInfo = `${b.calculatedFee}`;
    } else if (b.type === 'it_course') {
      courseInfo = `IT: ${b.courseName} (${b.duration})`;
      feeInfo = `${b.calculatedFee}`;
    } else if (b.type === 'custom_invoice') {
      courseInfo = `Custom Curriculum: ${b.level} - ${b.subject} (${b.selectedTopics.length} topics, ${b.totalHours} hrs)`;
      feeInfo = `${b.totalFeePKR}`;
    }

    return [
      `"${b.id}"`,
      `"${b.type.toUpperCase()}"`,
      `"${new Date(b.createdAt).toLocaleDateString()}"`,
      `"${b.studentName.replace(/"/g, '""')}"`,
      `"${b.studentPhone}"`,
      `"${b.email}"`,
      `"${b.board}"`,
      `"${courseInfo.replace(/"/g, '""')}"`,
      `"${b.mode}"`,
      `"${feeInfo}"`,
      `"${b.status}"`
    ];
  });

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `Tuition_Bookings_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
