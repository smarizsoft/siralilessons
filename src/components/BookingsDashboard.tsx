import React, { useState } from 'react';
import { AnyBooking } from '../types';
import { deleteBookingFromStorage, exportBookingsToCSV, sendToGoogleSheet, syncAllBookingsToGoogleSheet, updateBookingStatus } from '../utils/googleSheets';
import { BookOpen, Download, Trash2, CheckCircle2, RefreshCw, Search, X, Filter, Database, Send, CloudUpload } from 'lucide-react';

interface BookingsDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  bookings: AnyBooking[];
  onRefreshBookings: () => void;
  onOpenGoogleSheetModal: () => void;
}

export const BookingsDashboard: React.FC<BookingsDashboardProps> = ({
  isOpen,
  onClose,
  bookings,
  onRefreshBookings,
  onOpenGoogleSheetModal
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [batchSyncing, setBatchSyncing] = useState(false);

  if (!isOpen) return null;

  // Filter bookings
  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.studentPhone.includes(searchQuery) ||
      b.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = typeFilter === 'all' || b.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  const handleStatusChange = (id: string, newStatus: AnyBooking['status']) => {
    updateBookingStatus(id, newStatus);
    onRefreshBookings();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this booking reference?')) {
      deleteBookingFromStorage(id);
      onRefreshBookings();
    }
  };

  const handleSyncItem = async (booking: AnyBooking) => {
    setSyncingId(booking.id);
    const res = await sendToGoogleSheet(booking);
    alert(res.message);
    setSyncingId(null);
  };

  const handleSyncAll = async () => {
    setBatchSyncing(true);
    const res = await syncAllBookingsToGoogleSheet();
    alert(res.message);
    setBatchSyncing(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in duration-200">
        
        {/* Dashboard Header */}
        <div className="bg-slate-900 text-white p-5 sm:p-6 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold">Bookings & Admission Database</h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  {bookings.length} Total Records
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Manage trial sessions, annual enrollments, crash course registrations & IT students.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {bookings.length > 0 && (
              <button
                onClick={handleSyncAll}
                disabled={batchSyncing}
                className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
                title="Sync all stored bookings to Google Sheet"
              >
                <CloudUpload className={`w-4 h-4 ${batchSyncing ? 'animate-bounce' : ''}`} />
                <span className="hidden sm:inline">{batchSyncing ? 'Syncing...' : 'Sync to G-Sheet'}</span>
              </button>
            )}

            <button
              onClick={() => exportBookingsToCSV(bookings)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-colors flex items-center gap-1.5"
              title="Download Excel / CSV"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>

            <button
              onClick={onOpenGoogleSheetModal}
              className="px-3 py-1.5 rounded-lg bg-cyan-950 hover:bg-cyan-900 text-cyan-200 text-xs font-bold border border-cyan-800 transition-colors flex items-center gap-1.5"
            >
              <Database className="w-4 h-4 text-cyan-400" />
              <span className="hidden sm:inline">Google Sheet Settings</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-slate-50 p-4 border-b border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3">
          
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by student name, phone or ID..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-600 bg-white"
            />
          </div>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 font-semibold focus:outline-hidden focus:ring-2 focus:ring-blue-600 bg-white"
          >
            <option value="all">All Form Types</option>
            <option value="trial">Trial Class (PKR 2,500)</option>
            <option value="annual">Annual Prep (Aug 1st)</option>
            <option value="crash">Crash Course (Jan 1-15)</option>
            <option value="it_course">IT Courses</option>
            <option value="custom_invoice">Custom Curriculum</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 font-semibold focus:outline-hidden focus:ring-2 focus:ring-blue-600 bg-white"
          >
            <option value="all">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>

        </div>

        {/* Table Area */}
        <div className="flex-1 overflow-auto p-4">
          {filteredBookings.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <Filter className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-slate-600 font-bold text-sm">No bookings found matching filters.</p>
              <p className="text-slate-400 text-xs">Try clearing your search query or type filter.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700 border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-800 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                    <th className="p-3">Ref ID</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">Student & Contact</th>
                    <th className="p-3">Board & Course Details</th>
                    <th className="p-3">Class Mode</th>
                    <th className="p-3">Fee Investment</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredBookings.map((b) => {
                    let typeBadgeClass = 'bg-blue-100 text-blue-800';
                    let courseDetails = '';
                    let feeStr = '';

                    if (b.type === 'trial') {
                      typeBadgeClass = 'bg-amber-100 text-amber-900 border border-amber-300';
                      courseDetails = `Trial Subject: ${b.subject} | Date: ${b.selectedDate} (${b.timeSlot})`;
                      feeStr = 'PKR 2,500 (Fixed)';
                    } else if (b.type === 'annual') {
                      typeBadgeClass = 'bg-blue-100 text-blue-900 border border-blue-300';
                      courseDetails = `Annual (${b.subjects.length} Subj): ${b.subjects.join(', ')} | Start: ${b.startDate}`;
                      feeStr = `PKR ${b.totalMonthlyFee}/mo (Total: PKR ${b.totalFullCourseFee})`;
                    } else if (b.type === 'crash') {
                      typeBadgeClass = 'bg-amber-500 text-slate-950 font-bold';
                      courseDetails = `Crash (${b.subjects.length} Subj): ${b.subjects.join(', ')} | Booking Date: ${b.bookingDate}`;
                      feeStr = `PKR ${b.calculatedFee}`;
                    } else if (b.type === 'it_course') {
                      typeBadgeClass = 'bg-indigo-100 text-indigo-900 border border-indigo-300';
                      courseDetails = `IT: ${b.courseName} (${b.duration})`;
                      feeStr = `PKR ${b.calculatedFee}`;
                    } else if (b.type === 'custom_invoice') {
                      typeBadgeClass = 'bg-emerald-100 text-emerald-900 border border-emerald-300';
                      courseDetails = `Custom Curriculum: ${b.level} (${b.subject}) - ${b.selectedTopics ? b.selectedTopics.length : 0} topics (${b.totalHours} hrs)`;
                      feeStr = `PKR ${b.totalFeePKR.toLocaleString()}`;
                    }

                    return (
                      <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-3 font-mono font-bold text-blue-700">{b.id}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${typeBadgeClass}`}>
                            {b.type.toUpperCase()}
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="font-bold text-slate-900">{b.studentName}</div>
                          <div className="text-[11px] text-slate-500">{b.studentPhone}</div>
                          <div className="text-[10px] text-slate-400">{b.email}</div>
                        </td>
                        <td className="p-3 max-w-xs">
                          <div className="font-semibold text-slate-800 text-[11px]">{b.board}</div>
                          <div className="text-slate-600 text-[11px] mt-0.5">{courseDetails}</div>
                        </td>
                        <td className="p-3">
                          <span className="text-[11px] font-medium text-slate-700">{b.mode.split(' ')[0]}</span>
                        </td>
                        <td className="p-3 font-extrabold text-slate-900 text-xs">
                          {feeStr}
                        </td>
                        <td className="p-3">
                          <select
                            value={b.status}
                            onChange={(e) => handleStatusChange(b.id, e.target.value as any)}
                            className="px-2 py-1 rounded-md border text-[11px] font-bold bg-white text-slate-800 border-slate-300 focus:outline-hidden"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleSyncItem(b)}
                              disabled={syncingId === b.id}
                              className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold"
                              title="Sync to Google Sheet"
                            >
                              <Send className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(b.id)}
                              className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs"
                              title="Delete Record"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-100 p-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-600 gap-2">
          <div>
            Showing <strong>{filteredBookings.length}</strong> of <strong>{bookings.length}</strong> total bookings.
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors"
          >
            Close Dashboard
          </button>
        </div>

      </div>
    </div>
  );
};
