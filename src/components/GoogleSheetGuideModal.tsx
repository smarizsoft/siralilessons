import React, { useState, useEffect } from 'react';
import { GOOGLE_APPS_SCRIPT_CODE, getGoogleSheetSettings, saveGoogleSheetSettings, syncAllBookingsToGoogleSheet, getStoredBookings } from '../utils/googleSheets';
import { Database, Check, Copy, ExternalLink, RefreshCw, X, Sparkles, ShieldCheck, CheckCircle2, AlertCircle, ArrowUpRight } from 'lucide-react';

interface GoogleSheetGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GoogleSheetGuideModal: React.FC<GoogleSheetGuideModalProps> = ({
  isOpen,
  onClose
}) => {
  const [webhookUrl, setWebhookUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [testing, setTesting] = useState(false);
  const [batchSyncing, setBatchSyncing] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const storedCount = getStoredBookings().length;

  useEffect(() => {
    if (isOpen) {
      const settings = getGoogleSheetSettings();
      setWebhookUrl(settings.webhookUrl || '');
      setFeedbackMsg(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isConfigured = !!(webhookUrl && webhookUrl.trim().startsWith('http'));

  const handleCopyCode = () => {
    navigator.clipboard.writeText(GOOGLE_APPS_SCRIPT_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleSaveSettings = () => {
    const trimmed = webhookUrl.trim();
    const current = getGoogleSheetSettings();
    saveGoogleSheetSettings({
      ...current,
      webhookUrl: trimmed
    });
    setSavedSuccess(true);
    setFeedbackMsg({
      type: 'success',
      text: trimmed ? 'Google Sheet Webhook URL saved successfully!' : 'Webhook URL cleared.'
    });
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleTestWebhook = async () => {
    const trimmed = webhookUrl.trim();
    if (!trimmed) {
      setFeedbackMsg({ type: 'error', text: 'Please paste your Google Apps Script Web App URL first!' });
      return;
    }

    setTesting(true);
    setFeedbackMsg(null);

    try {
      await fetch(trimmed, {
        method: 'POST',
        mode: 'no-cors',
        cache: 'no-cache',
        redirect: 'follow',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          id: `TEST-PING-${Math.floor(1000 + Math.random() * 9000)}`,
          type: 'trial',
          createdAt: new Date().toISOString(),
          studentName: 'Test Student (Connectivity Verification)',
          guardianName: 'Parent / Guardian',
          studentPhone: '+923022324503',
          email: 'test@example.com',
          board: 'Cambridge (O Level / IGCSE / A Level)',
          subject: 'Physics',
          selectedDate: new Date().toISOString().split('T')[0],
          timeSlot: '05:00 PM - 06:30 PM',
          mode: 'Online Class (Zoom/Google Meet)',
          fee: 2500,
          status: 'Confirmed',
          notes: 'Automatic connectivity test ping from website'
        })
      });

      // Save settings if valid
      const current = getGoogleSheetSettings();
      saveGoogleSheetSettings({
        ...current,
        webhookUrl: trimmed,
        lastSyncedAt: new Date().toLocaleTimeString()
      });

      setFeedbackMsg({
        type: 'success',
        text: 'Test record dispatched! Please check your Google Sheet — a new row has been added.'
      });
    } catch (err: any) {
      setFeedbackMsg({
        type: 'error',
        text: 'Connection failed: ' + (err.message || 'Check URL format')
      });
    } finally {
      setTesting(false);
    }
  };

  const handleBatchSyncAll = async () => {
    setBatchSyncing(true);
    setFeedbackMsg(null);
    try {
      const res = await syncAllBookingsToGoogleSheet();
      setFeedbackMsg({
        type: res.success ? 'success' : 'error',
        text: res.message
      });
    } catch (err: any) {
      setFeedbackMsg({
        type: 'error',
        text: 'Sync failed: ' + err.message
      });
    } finally {
      setBatchSyncing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 sm:p-6 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-600 text-white flex items-center justify-center font-bold">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold">Google Sheets Integration</h3>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  isConfigured ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                }`}>
                  {isConfigured ? 'Connected' : 'Setup Required'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                All student bookings automatically record directly to your Google Sheet with instant mobile notifications on <strong className="text-amber-400 font-mono">+92 302 2324503</strong>!
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700">
          
          {/* Notification Feedback Box */}
          {feedbackMsg && (
            <div className={`p-3.5 rounded-xl border flex items-center gap-2.5 animate-in fade-in duration-200 ${
              feedbackMsg.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-rose-50 border-rose-200 text-rose-900'
            }`}>
              {feedbackMsg.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span className="text-xs font-semibold">{feedbackMsg.text}</span>
            </div>
          )}

          {/* Step 1: Webhook URL Input & Actions */}
          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-extrabold text-slate-900 text-sm block">
                Step 1: Paste Your Google Apps Script Web App URL
              </label>
              {storedCount > 0 && isConfigured && (
                <button
                  type="button"
                  onClick={handleBatchSyncAll}
                  disabled={batchSyncing}
                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[11px] flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <RefreshCw className={`w-3 h-3 ${batchSyncing ? 'animate-spin' : ''}`} />
                  <span>{batchSyncing ? 'Syncing...' : `Sync All (${storedCount}) Bookings`}</span>
                </button>
              )}
            </div>
            <p className="text-slate-600 text-xs">
              Follow the 2-minute steps below to deploy your script, then paste your Google Web App URL here:
            </p>

            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="url"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                placeholder="https://script.google.com/macros/s/AKfycb.../exec"
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 font-mono focus:outline-hidden focus:ring-2 focus:ring-cyan-600 bg-white"
              />
              <button
                type="button"
                onClick={handleSaveSettings}
                className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs transition-colors shrink-0"
              >
                {savedSuccess ? 'Saved!' : 'Save URL'}
              </button>
              <button
                type="button"
                onClick={handleTestWebhook}
                disabled={testing}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-colors shrink-0 flex items-center justify-center gap-1.5"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin' : ''}`} />
                <span>{testing ? 'Testing...' : 'Test Sync'}</span>
              </button>
            </div>
          </div>

          {/* Step-by-Step Instructions */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <span>Step-by-Step Google Sheet Setup Guide (2 Minutes)</span>
            </h4>

            <ol className="list-decimal pl-5 space-y-2 text-slate-700 leading-relaxed text-xs">
              <li>Open any <strong>Google Sheet</strong> in your Google Drive.</li>
              <li>In the top menu, click <strong>Extensions &gt; Apps Script</strong>.</li>
              <li>Select all default code in the editor, press delete, and paste the code from below.</li>
              <li>
                <span className="text-emerald-700 font-bold">Automatic WhatsApp API (Zero User Interruption):</span>
                <p className="mt-1 text-slate-600">
                  To get WhatsApp messages delivered automatically to Sir Ali without the student needing to click anything, sign up at <strong>UltraMsg.com</strong> or <strong>Green-API.com</strong>, scan the QR code with WhatsApp, and paste your <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-emerald-700">INSTANCE_ID</code> &amp; <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-emerald-700">TOKEN</code> at the top of the script.
                </p>
              </li>
              <li>Click the blue <strong>Deploy</strong> button (top right) &gt; <strong>New deployment</strong>.</li>
              <li>Click the Gear icon ⚙ beside "Select type" and select <strong>Web app</strong>.</li>
              <li>Set <i>Execute as</i>: <strong>Me (your email)</strong>.</li>
              <li>Set <i>Who has access</i>: <strong>Anyone</strong> (Crucial: allows students & visitors to submit form rows).</li>
              <li>Click <strong>Deploy</strong>, authorize permissions if prompted, copy the <strong>Web App URL</strong>, and paste it in Step 1 above!</li>
            </ol>
          </div>

          {/* Copyable Apps Script Snippet Box */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 text-xs">Google Apps Script Code:</span>
              <button
                type="button"
                onClick={handleCopyCode}
                className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 font-bold text-xs hover:bg-blue-100 transition-colors flex items-center gap-1.5"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Code Copied!' : 'Copy Apps Script Code'}</span>
              </button>
            </div>

            <pre className="bg-slate-950 text-emerald-400 p-4 rounded-xl font-mono text-[11px] max-h-56 overflow-y-auto leading-relaxed border border-slate-800 select-all">
              {GOOGLE_APPS_SCRIPT_CODE}
            </pre>
          </div>

        </div>

        {/* Footer */}
        <div className="bg-slate-100 p-4 border-t border-slate-200 flex justify-between items-center">
          <span className="text-[11px] text-slate-500">
            {isConfigured ? '✓ Real-time Google Sheet sync active' : '⚠️ Paste Web App URL to enable live syncing'}
          </span>
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors"
          >
            Done & Close
          </button>
        </div>

      </div>
    </div>
  );
};
