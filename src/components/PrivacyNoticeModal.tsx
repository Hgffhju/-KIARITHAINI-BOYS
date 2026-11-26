import React, { useState } from 'react';
import { Shield, Lock, FileCheck, Check, AlertCircle, X, Mail, Phone, ExternalLink } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyNoticeModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [requestSent, setRequestSent] = useState(false);
  const [parentName, setParentName] = useState('');
  const [admNo, setAdmNo] = useState('');
  const [requestType, setRequestType] = useState('Data Inspection & Transcript');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRequestSent(true);
    setTimeout(() => {
      setRequestSent(false);
      onClose();
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-forest-900 text-white">
          <div className="flex items-center space-x-2.5">
            <Shield className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="text-sm font-bold">Kenya Data Protection Act (KDPA 2019) Compliance</h3>
              <p className="text-[11px] text-slate-300">Office of the Data Protection Commissioner (ODPC) Standards</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-xs text-slate-600 leading-relaxed">
          
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
            <h4 className="font-bold text-emerald-900 text-sm mb-1">
              Data Protection & Student Privacy Charter
            </h4>
            <p className="text-emerald-800 text-xs">
              Kiarithaini Boys High School is committed to processing all student and parent personal data lawfully, fairly, and transparently under the laws of the Republic of Kenya.
            </p>
          </div>

          <div className="space-y-4">
            <h5 className="font-bold text-slate-900 text-sm">1. Categories of Data Collected & Processed</h5>
            <ul className="list-disc list-inside space-y-1.5 pl-1">
              <li><strong>Academic Records:</strong> Termly exam results, KNEC mock marks, KNEC candidate numbers, and teacher assessment feedback.</li>
              <li><strong>Financial Transactions:</strong> Lipa na M-Pesa transaction identifiers, student pocket money canteen ledgers, and bank deposit slips.</li>
              <li><strong>Student Pastoral & Conduct:</strong> House master reports, attendance logs, and medical emergency details.</li>
              <li><strong>Parent/Guardian Contact:</strong> Verified Safaricom phone numbers, identification details, and email addresses.</li>
            </ul>

            <h5 className="font-bold text-slate-900 text-sm">2. Purpose of Processing & Security Guarantees</h5>
            <p>
              Data is utilized solely for academic progress tracking, Ministry of Education (MOE/NEMIS) regulatory reporting, and seamless parent fee clearance. We never disclose, sell, or license student or financial data to third-party commercial marketing entities.
            </p>

            <h5 className="font-bold text-slate-900 text-sm">3. Your Statutory Rights under KDPA (2019)</h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <strong className="block text-slate-900 mb-0.5">Right of Access:</strong>
                <span>Inspect complete academic transcripts, attendance logs, and financial statements anytime via the Parent Portal.</span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <strong className="block text-slate-900 mb-0.5">Right to Rectification:</strong>
                <span>Request immediate correction of incorrect phone numbers, misspelled names, or fee ledger discrepancies.</span>
              </div>
            </div>

            {/* DPO Information */}
            <div className="p-4 bg-slate-100 rounded-xl border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <span className="text-[11px] uppercase font-bold text-slate-500 tracking-wider block">
                  Designated Data Protection Officer (DPO)
                </span>
                <span className="text-sm font-bold text-slate-900 block mt-0.5">
                  Office of the Deputy Principal (Administration)
                </span>
                <span className="text-[11px] text-slate-500">
                  Kiarithaini Boys High School, P.O. Box Kiarithaini, Mathira East, Nyeri County
                </span>
              </div>
              <div className="text-right text-[11px] text-slate-600 space-y-0.5">
                <p>Email: <strong>kiarithainiboys@yahoo.com</strong></p>
                <p>Admin Helpline: <strong>0722377082</strong></p>
              </div>
            </div>

            {/* Interactive Data Access Request Form */}
            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
              <h5 className="font-bold text-slate-900 text-xs mb-2 flex items-center space-x-1.5">
                <FileCheck className="w-4 h-4 text-forest-800" />
                <span>Submit an Electronic Data Subject Request</span>
              </h5>

              {requestSent ? (
                <div className="p-3 bg-emerald-100 text-emerald-900 rounded-lg flex items-center space-x-2 font-medium">
                  <Check className="w-4 h-4 text-emerald-700" />
                  <span>Request registered. The Data Protection Officer will review within 48 hours.</span>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      required
                      placeholder="Parent / Guardian Full Name"
                      value={parentName}
                      onChange={(e) => setParentName(e.target.value)}
                      className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-forest-800"
                    />
                    <input
                      type="text"
                      required
                      placeholder="Student Admission Number (e.g. 4521)"
                      value={admNo}
                      onChange={(e) => setAdmNo(e.target.value)}
                      className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-forest-800"
                    />
                  </div>
                  <select
                    value={requestType}
                    onChange={(e) => setRequestType(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-forest-800"
                  >
                    <option value="Data Inspection & Transcript">Request Formal Inspection of Academic & Financial Records</option>
                    <option value="Correction of Contact Number">Rectify Registered Phone Number / Name</option>
                    <option value="Withdrawal of Alumni Communication">Opt-out of SMS announcements (Alumni)</option>
                  </select>
                  <button
                    type="submit"
                    className="w-full py-2 bg-forest-800 hover:bg-forest-900 text-white font-semibold rounded-lg text-xs transition"
                  >
                    Dispatch KDPA Data Subject Request
                  </button>
                </form>
              )}
            </div>

          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-[11px] text-slate-500">
          <span>Compliant with Kenya Data Protection Act, No. 24 of 2019</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-medium rounded-lg transition"
          >
            Close Notice
          </button>
        </div>

      </div>
    </div>
  );
};
