import { AnyBooking } from '../types';
import { formatPKR } from './calculatorUtils';

export interface PaymentDetails {
  jazzcash: string;
  easypaisa: string;
  bankName: string;
  bankAccountNo: string;
  accountTitle: string;
}

export const OFFICIAL_PAYMENT_METHODS: PaymentDetails = {
  jazzcash: '03022324503',
  easypaisa: '03181189084',
  bankName: 'Bank AL Habib',
  bankAccountNo: '10710078015905018',
  accountTitle: 'Syed Muhammad Ali Rizvi'
};

/**
  * Helper to draw a rounded rectangle cleanly with explicit beginPath to avoid
  * path accumulation bugs that cause canvas re-fill text masking.
  */
function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
  fillColor?: string,
  strokeColor?: string,
  lineWidth: number = 1
) {
  ctx.beginPath();
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(x, y, w, h, r);
  } else {
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }
  if (fillColor) {
    ctx.fillStyle = fillColor;
    ctx.fill();
  }
  if (strokeColor) {
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
  }
}

/**
 * Generates a clean, professional Invoice image on HTML5 Canvas in Grey & Black theme
 * and automatically triggers a download of 'invoice.png'.
 */
export function generateAndDownloadInvoicePNG(booking: AnyBooking, filename = 'invoice.png'): void {
  const canvas = document.createElement('canvas');
  // Half A4 Paper Size Canvas Dimensions
  canvas.width = 700;
  canvas.height = 540;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    console.error('Canvas 2D context not available');
    return;
  }

  // Outer Background (Dark Slate)
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Main White Card Container (Half A4 Paper Boundary)
  const pad = 24;
  const cardWidth = canvas.width - pad * 2; // 652px
  const cardHeight = canvas.height - pad * 2; // 492px
  drawRoundedRect(ctx, pad, pad, cardWidth, cardHeight, 16, '#ffffff');

  // ==========================================
  // HEADER SECTION
  // ==========================================
  let y = pad + 38;
  
  // Header Line 1: Sir Ali Preparation (Since 1992)
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 26px "Playfair Display", Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText('Sir Ali Preparation (Since 1992)', canvas.width / 2, y);

  // Header Line 2: +92 302 2324 503 | sagtut@gmail.com | sirali.com
  y += 24;
  ctx.fillStyle = '#475569';
  ctx.font = 'bold 12px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('+92 302 2324 503 | sagtut@gmail.com | sirali.com', canvas.width / 2, y);

  // Header Line 3: Fee Invoice #
  y += 26;
  ctx.fillStyle = '#b45309';
  ctx.font = 'bold 15px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(`Fee Invoice # ${booking.id || 'SAB-1001'}`, canvas.width / 2, y);

  // Header Divider
  y += 18;
  ctx.beginPath();
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 1.5;
  ctx.moveTo(pad + 24, y);
  ctx.lineTo(canvas.width - pad - 24, y);
  ctx.stroke();

  // Reset text align for body
  ctx.textAlign = 'left';

  // Issue & Expiry Dates Calculation
  const issueDateObj = new Date(booking.createdAt || Date.now());
  const expiryDateObj = new Date(issueDateObj.getTime() + 5 * 24 * 60 * 60 * 1000);
  const formatDate = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const expiryDateStr = formatDate(expiryDateObj);

  // ==========================================
  // BODY SECTION (2 Columns: Student Info & Academic Info)
  // ==========================================
  y += 18;
  const bodyBoxY = y;
  const bodyBoxHeight = 210;
  drawRoundedRect(ctx, pad + 20, bodyBoxY, cardWidth - 40, bodyBoxHeight, 12, '#f8fafc', '#cbd5e1', 1.5);

  // Body Title Bar
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 13px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('STUDENT & ACADEMIC REGISTRATION DETAILS', pad + 35, bodyBoxY + 28);

  ctx.beginPath();
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 1;
  ctx.moveTo(pad + 35, bodyBoxY + 38);
  ctx.lineTo(canvas.width - pad - 35, bodyBoxY + 38);
  ctx.stroke();

  // Extract Student Info
  const studentName = booking.studentName || 'N/A';
  const guardianName = (booking as any).guardianName || 'N/A';
  const contactNo = booking.studentPhone || 'N/A';
  const email = booking.email || 'N/A';

  // Extract Academic Info
  let selectedSubjects = 'N/A';
  let grade = booking.gradeLevel || 'N/A';
  let classMode = booking.mode || 'Online / Physical';
  let level = booking.board || 'O Level / A Level';

  if (booking.type === 'annual' || booking.type === 'crash') {
    selectedSubjects = booking.subjects?.length ? booking.subjects.join(', ') : 'Selected Subjects';
  } else if (booking.type === 'trial') {
    selectedSubjects = booking.subject || 'Trial Session';
  } else if (booking.type === 'it_course') {
    selectedSubjects = booking.courseName || 'IT Course';
    grade = booking.duration || 'Standard';
    level = 'IT Skills Certification';
  }

  // Column 1: Left Section (Student Name, Guardian Name, Contact Number, Email)
  const col1X = pad + 35;
  let colY = bodyBoxY + 62;
  const colGap = 36;

  // Student Name
  ctx.fillStyle = '#64748b';
  ctx.font = '600 10px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('STUDENT NAME', col1X, colY);
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 13px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(studentName, col1X, colY + 15);

  // Guardian Name
  ctx.fillStyle = '#64748b';
  ctx.font = '600 10px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('GUARDIAN NAME', col1X, colY + colGap);
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 13px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(guardianName, col1X, colY + colGap + 15);

  // Contact Number
  ctx.fillStyle = '#64748b';
  ctx.font = '600 10px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('CONTACT NUMBER', col1X, colY + colGap * 2);
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 13px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(contactNo, col1X, colY + colGap * 2 + 15);

  // Email
  ctx.fillStyle = '#64748b';
  ctx.font = '600 10px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('EMAIL ADDRESS', col1X, colY + colGap * 3);
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 12px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(email, col1X, colY + colGap * 3 + 15);

  // Column Divider Line inside Body
  const colDividerX = canvas.width / 2 + 10;
  ctx.beginPath();
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 1;
  ctx.moveTo(colDividerX, bodyBoxY + 48);
  ctx.lineTo(colDividerX, bodyBoxY + bodyBoxHeight - 15);
  ctx.stroke();

  // Column 2: Right Section (List of subjects, Grade, Class, Level)
  const col2X = colDividerX + 20;

  // Selected Subjects
  ctx.fillStyle = '#64748b';
  ctx.font = '600 10px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('SUBJECTS SELECTED', col2X, colY);
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 12px "Plus Jakarta Sans", sans-serif';
  // Truncate if too long for display
  const displaySubjects = selectedSubjects.length > 32 ? selectedSubjects.substring(0, 30) + '...' : selectedSubjects;
  ctx.fillText(displaySubjects, col2X, colY + 15);

  // Grade
  ctx.fillStyle = '#64748b';
  ctx.font = '600 10px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('GRADE / CLASS LEVEL', col2X, colY + colGap);
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 13px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(grade, col2X, colY + colGap + 15);

  // Class Mode
  ctx.fillStyle = '#64748b';
  ctx.font = '600 10px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('CLASS MODE', col2X, colY + colGap * 2);
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 13px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(classMode, col2X, colY + colGap * 2 + 15);

  // Level / Board
  ctx.fillStyle = '#64748b';
  ctx.font = '600 10px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('ACADEMIC LEVEL / BOARD', col2X, colY + colGap * 3);
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 13px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(level, col2X, colY + colGap * 3 + 15);

  // ==========================================
  // FEE SECTION (3 Sections: Actual Fee, Lump Sum / Discounted, Expiry Date)
  // ==========================================
  y = bodyBoxY + bodyBoxHeight + 16;
  const feeBoxY = y;
  const feeBoxHeight = 110;

  // Fee calculation logic
  let actualFeeStr = 'PKR 0';
  let lumpSumFeeStr = 'N/A';

  if (booking.type === 'annual') {
    const monthlyFee = booking.totalMonthlyFee || 36000;
    const fullFee = booking.totalFullCourseFee || monthlyFee * 10;
    const lumpSum = (booking as any).lumpSumTotal || Math.round(fullFee * 0.95);
    actualFeeStr = `${formatPKR(monthlyFee)} / mo`;
    lumpSumFeeStr = `${formatPKR(lumpSum)} (Lump Sum)`;
  } else if (booking.type === 'crash') {
    const crashFee = booking.calculatedFee || 120000;
    actualFeeStr = formatPKR(crashFee);
    lumpSumFeeStr = `${formatPKR(crashFee)} (Adv. Paid)`;
  } else if (booking.type === 'it_course') {
    const itFee = booking.calculatedFee || 27000;
    actualFeeStr = formatPKR(itFee);
    lumpSumFeeStr = `${formatPKR(itFee)} (Course Lump Sum)`;
  } else {
    const trialFee = (booking as any).fee || 2500;
    actualFeeStr = formatPKR(trialFee);
    lumpSumFeeStr = formatPKR(trialFee);
  }

  const subBoxWidth = (cardWidth - 50) / 3;

  // Box 1: Left Section (Actual Fee)
  const b1X = pad + 20;
  drawRoundedRect(ctx, b1X, feeBoxY, subBoxWidth, feeBoxHeight, 10, '#f1f5f9', '#cbd5e1', 1.5);
  ctx.fillStyle = '#475569';
  ctx.font = 'bold 11px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('ACTUAL FEE', b1X + 16, feeBoxY + 30);
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 17px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(actualFeeStr, b1X + 16, feeBoxY + 62);
  ctx.fillStyle = '#64748b';
  ctx.font = '500 10px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('Regular Scheduled Rate', b1X + 16, feeBoxY + 85);

  // Box 2: Middle Section (Lump Sum / Discounted Fee or One Time Payment for Trial)
  const b2X = b1X + subBoxWidth + 5;
  drawRoundedRect(ctx, b2X, feeBoxY, subBoxWidth, feeBoxHeight, 10, '#fffbebe6', '#fcd34d', 1.5);
  ctx.fillStyle = '#92400e';
  ctx.font = 'bold 11px "Plus Jakarta Sans", sans-serif';
  const box2Title = booking.type === 'trial' ? 'ONE TIME PAYMENT' : 'LUMP SUM / DISCOUNTED';
  const box2Sub = booking.type === 'trial' ? 'Not Refundable' : 'Advance Payment Discount';
  ctx.fillText(box2Title, b2X + 16, feeBoxY + 30);
  ctx.fillStyle = '#b45309';
  ctx.font = 'bold 16px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(lumpSumFeeStr, b2X + 16, feeBoxY + 62);
  ctx.fillStyle = '#a16207';
  ctx.font = '500 10px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(box2Sub, b2X + 16, feeBoxY + 85);

  // Box 3: Right Section (Invoice Expiry Date - 5 days after current date)
  const b3X = b2X + subBoxWidth + 5;
  drawRoundedRect(ctx, b3X, feeBoxY, subBoxWidth, feeBoxHeight, 10, '#fef2f2', '#fca5a5', 1.5);
  ctx.fillStyle = '#991b1b';
  ctx.font = 'bold 11px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('INVOICE EXPIRY DATE', b3X + 16, feeBoxY + 30);
  ctx.fillStyle = '#dc2626';
  ctx.font = 'bold 16px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(expiryDateStr, b3X + 16, feeBoxY + 62);
  ctx.fillStyle = '#b91c1c';
  ctx.font = '500 10px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('Valid for 5 days only', b3X + 16, feeBoxY + 85);

  // ==========================================
  // FOOTER (Thank you message)
  // ==========================================
  const footerY = canvas.height - pad - 18;
  ctx.fillStyle = '#475569';
  ctx.font = 'bold italic 12px "Playfair Display", Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText('Thank you for choosing Sir Ali Preparation! Computer Generated Official Fee Invoice.', canvas.width / 2, footerY);

  // Convert canvas to PNG and download
  try {
    const imageURI = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = filename;
    link.href = imageURI;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (err) {
    console.error('Failed to auto-download invoice PNG', err);
  }
}

