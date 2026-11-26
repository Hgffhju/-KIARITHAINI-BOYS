import React, { useState } from 'react';
import { Transaction, Student, PaymentCategory } from '../types';
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  Users,
  Search,
  Filter,
  Download,
  PlusCircle,
  MessageSquare,
  CheckCircle,
  Clock,
  Printer,
  X,
  FileSpreadsheet
} from 'lucide-react';

interface Props {
  transactions: Transaction[];
  students: Student[];
  onAddTransaction: (tx: Transaction) => void;
  onOpenReceipt: (tx: Transaction, student: Student) => void;
}

export const BursarConsole: React.FC<Props> = ({
  transactions,
  students,
  onAddTransaction,
  onOpenReceipt,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterChannel, setFilterChannel] = useState<string>('all');
  const [showManualModal, setShowManualModal] = useState(false);
  const [showSmsModal, setShowSmsModal] = useState(false);
  const [smsSentToast, setSmsSentToast] = useState(false);

  // Manual payment form state
  const [manualAdm, setManualAdm] = useState('4521');
  const [manualAmount, setManualAmount] = useState('5000');
  const [manualCategory, setManualCategory] = useState<PaymentCategory>('TUITION_FEES');
  const [manualChannel, setManualChannel] = useState<'BANK_DEPOSIT' | 'C2B_PAYBILL'>('BANK_DEPOSIT');
  const [manualRef, setManualRef] = useState('');
  const [manualNotes, setManualNotes] = useState('');

  // SMS reminder state
  const [selectedStudentForSms, setSelectedStudentForSms] = useState<Student>(students[0]);
  const [smsCustomText, setSmsCustomText] = useState(
    `Dear Parent, this is Kiarithaini Boys High School. Student Amos Kiprono (Adm: 4521) has an outstanding fee balance of KES 14,500. Please clear via Paybill 174379, Acc: 4521 before mid-term.`
  );

  // Statistics
  const totalCollected = transactions
    .filter((t) => t.status === 'COMPLETED')
    .reduce((sum, t) => sum + t.amount, 0);

  const tuitionCollected = transactions
    .filter((t) => t.status === 'COMPLETED' && t.paymentType === 'TUITION_FEES')
    .reduce((sum, t) => sum + t.amount, 0);

  const pocketCollected = transactions
    .filter((t) => t.status === 'COMPLETED' && t.paymentType === 'POCKET_MONEY')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalOutstandingFees = students.reduce((sum, s) => sum + s.feeBalance, 0);
  const fullyClearedStudents = students.filter((s) => s.feeBalance === 0).length;

  // Filtered transactions
  const filtered = transactions.filter((tx) => {
    const matchesSearch =
      tx.mpesaReceipt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.studentAdmNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.payerPhone.includes(searchQuery);

    const matchesCategory = filterCategory === 'all' || tx.paymentType === filterCategory;
    const matchesChannel = filterChannel === 'all' || tx.channel === filterChannel;

    return matchesSearch && matchesCategory && matchesChannel;
  });

  const handleCreateManualPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const student = students.find((s) => s.admNo === manualAdm) || students[0];
    const amountNum = Number(manualAmount) || 0;

    const receipt =
      manualRef.trim() ||
      `BNK${Math.floor(100000 + Math.random() * 900000)}`;

    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      mpesaReceipt: receipt.toUpperCase(),
      studentAdmNo: student.admNo,
      studentName: `${student.firstName} ${student.lastName}`,
      amount: amountNum,
      paymentType: manualCategory,
      channel: manualChannel,
      payerPhone: student.parentPhone,
      status: 'COMPLETED',
      createdAt: new Date().toISOString(),
      notes: manualNotes.trim() || `Manual bursar entry (${manualChannel})`,
    };

    onAddTransaction(newTx);
    setShowManualModal(false);
    setManualRef('');
    setManualNotes('');
  };

  const handleSendSms = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSmsModal(false);
    setSmsSentToast(true);
    setTimeout(() => setSmsSentToast(false), 4000);
  };

  const handleExportCSV = () => {
    const headers = 'Receipt,Adm No,Student Name,Category,Amount (KES),Channel,Timestamp,Status\n';
    const rows = filtered
      .map(
        (t) =>
          `"${t.mpesaReceipt}","${t.studentAdmNo}","${t.studentName}","${t.paymentType}",${t.amount},"${t.channel}","${t.createdAt}","${t.status}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Kiarithaini_Bursar_Ledger_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Toast Alert */}
      {smsSentToast && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-900 text-white border border-emerald-500 px-4 py-3 rounded-xl shadow-xl flex items-center space-x-2 text-xs animate-in slide-in-from-top-4">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>Africa&apos;s Talking Gateway: SMS reminder dispatched to parent!</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-forest-800 uppercase tracking-wider mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
            <span>Bursar Finance Console • Daraja Clearing</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
            School Accounts & Payment Ledger
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Kiarithaini High School (Mathira East, Nyeri) • Live reconciliation of Paybill 174379 payments, STK Pushes, and student pocket money allocations.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowSmsModal(true)}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 text-xs font-semibold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-xl transition"
          >
            <MessageSquare className="w-3.5 h-3.5 text-amber-700" />
            <span>Send Fee Balance SMS</span>
          </button>

          <button
            onClick={() => setShowManualModal(true)}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 text-xs font-bold bg-forest-800 hover:bg-forest-900 text-white rounded-xl shadow-sm transition"
          >
            <PlusCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>Record Bank / Cash Slip</span>
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Total M-Pesa Collections</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900">
            KES {totalCollected.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-700 font-medium mt-1">
            ✓ 100% reconciled via Daraja
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Tuition Fees Cleared</span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900">
            KES {tuitionCollected.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Tuition accounts (e.g. 4521)
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Pocket Money Credited</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-amber-700">
            KES {pocketCollected.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            PKT accounts (Canteen tuck shop)
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Outstanding Tuition Balance</span>
            <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900">
            KES {totalOutstandingFees.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {fullyClearedStudents} of {students.length} students fully cleared
          </div>
        </div>
      </div>

      {/* Main Ledger Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        
        {/* Table Filter Controls */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/80 flex flex-wrap items-center justify-between gap-3">
          
          <div className="flex-1 min-w-[240px] relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search receipt, admission number, or student name..."
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-forest-800"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="text-xs bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none"
            >
              <option value="all">All Categories</option>
              <option value="TUITION_FEES">Tuition Fees</option>
              <option value="POCKET_MONEY">Pocket Money (PKT)</option>
              <option value="UNIFORM_BOARDING">Boarding / Uniform</option>
            </select>

            <select
              value={filterChannel}
              onChange={(e) => setFilterChannel(e.target.value)}
              className="text-xs bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none"
            >
              <option value="all">All Channels</option>
              <option value="STK_PUSH">M-Pesa STK Push</option>
              <option value="C2B_PAYBILL">Lipa na M-Pesa (C2B)</option>
              <option value="BANK_DEPOSIT">Bank Deposit</option>
            </select>

            <button
              onClick={handleExportCSV}
              className="inline-flex items-center space-x-1 text-xs bg-white hover:bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-300 transition"
              title="Download as Excel/CSV"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-100/80 border-b border-slate-200 text-slate-700 uppercase font-semibold">
              <tr>
                <th className="py-3 px-4">M-Pesa Ref</th>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Adm No</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4 text-right">Amount (KES)</th>
                <th className="py-3 px-4">Channel</th>
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    No transactions found matching your criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((tx) => {
                  const student = students.find((s) => s.admNo === tx.studentAdmNo) || {
                    admNo: tx.studentAdmNo,
                    firstName: tx.studentName.split(' ')[0] || '',
                    lastName: tx.studentName.split(' ')[1] || '',
                    formLevel: 3,
                    stream: 'East',
                    house: 'Mount Kenya House',
                    parentName: 'Parent',
                    parentPhone: tx.payerPhone,
                    maskedPhone: tx.payerPhone,
                    feeBalance: 0,
                    pocketBalance: 0,
                    status: 'ACTIVE' as const,
                    academicRecords: [],
                  };

                  return (
                    <tr key={tx.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        {tx.mpesaReceipt}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-800">
                        {tx.studentName}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-700">
                        {tx.studentAdmNo}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                            tx.paymentType === 'POCKET_MONEY'
                              ? 'bg-amber-100 text-amber-800'
                              : tx.paymentType === 'UNIFORM_BOARDING'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {tx.paymentType === 'POCKET_MONEY' ? 'Pocket (PKT)' : tx.paymentType.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                        KES {tx.amount.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-[11px] text-slate-600 font-mono">
                        {tx.channel === 'STK_PUSH'
                          ? 'STK Express'
                          : tx.channel === 'C2B_PAYBILL'
                          ? 'C2B Paybill'
                          : 'Bank Slip'}
                      </td>
                      <td className="py-3 px-4 text-[11px] text-slate-500">
                        {new Date(tx.createdAt).toLocaleDateString('en-KE')} {new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center space-x-1 text-[11px] font-semibold text-emerald-700">
                          <CheckCircle className="w-3 h-3 text-emerald-600" />
                          <span>Cleared</span>
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => onOpenReceipt(tx, student)}
                          className="px-2.5 py-1 text-[11px] bg-slate-100 hover:bg-forest-800 hover:text-white text-slate-700 rounded font-semibold transition"
                          title="Generate official stamped clearance PDF"
                        >
                          Slip &darr;
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex flex-wrap justify-between items-center gap-2">
          <span>Showing {filtered.length} of {transactions.length} records</span>
          <span className="text-[11px] text-slate-400">
            Safaricom Paybill 174379 • Automatic C2B Validation active
          </span>
        </div>

      </div>

      {/* Manual Deposit Modal */}
      {showManualModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 bg-forest-900 text-white">
              <h3 className="text-sm font-bold">Record Manual Bank / Cash Deposit</h3>
              <button onClick={() => setShowManualModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateManualPayment} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Student</label>
                <select
                  value={manualAdm}
                  onChange={(e) => setManualAdm(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-forest-800"
                >
                  {students.map((s) => (
                    <option key={s.admNo} value={s.admNo}>
                      {s.firstName} {s.lastName} (Adm: {s.admNo} - Form {s.formLevel} {s.stream})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Payment Category</label>
                  <select
                    value={manualCategory}
                    onChange={(e) => setManualCategory(e.target.value as any)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-forest-800"
                  >
                    <option value="TUITION_FEES">Tuition & Fees</option>
                    <option value="POCKET_MONEY">Pocket Money</option>
                    <option value="UNIFORM_BOARDING">Uniform / Boarding</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Deposit Channel</label>
                  <select
                    value={manualChannel}
                    onChange={(e) => setManualChannel(e.target.value as any)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-forest-800"
                  >
                    <option value="BANK_DEPOSIT">Co-operative Bank (01129059715100)</option>
                    <option value="C2B_PAYBILL">Manual Paybill (174379)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Amount (KES)</label>
                <input
                  type="number"
                  required
                  min="50"
                  value={manualAmount}
                  onChange={(e) => setManualAmount(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs font-mono font-bold focus:outline-none focus:border-forest-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Bank Slip / Reference No</label>
                <input
                  type="text"
                  placeholder="e.g. COOP-NYR-88190"
                  value={manualRef}
                  onChange={(e) => setManualRef(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs uppercase font-mono focus:outline-none focus:border-forest-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Bursar Audit Notes</label>
                <input
                  type="text"
                  placeholder="Verified at KCB Bank Nyeri branch teller"
                  value={manualNotes}
                  onChange={(e) => setManualNotes(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-forest-800"
                />
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowManualModal(false)}
                  className="flex-1 py-2.5 border border-slate-300 rounded-lg font-semibold text-slate-600 hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-forest-800 hover:bg-forest-900 text-white font-bold rounded-lg transition"
                >
                  Credit Student Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SMS Reminder Modal */}
      {showSmsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold">SMS Fee Balance Dispatch (Africa&apos;s Talking)</h3>
              </div>
              <button onClick={() => setShowSmsModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendSms} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Student</label>
                <select
                  value={selectedStudentForSms.admNo}
                  onChange={(e) => {
                    const found = students.find((s) => s.admNo === e.target.value);
                    if (found) {
                      setSelectedStudentForSms(found);
                      setSmsCustomText(
                        `Dear Parent, this is Kiarithaini Boys High School. Student ${found.firstName} ${found.lastName} (Adm: ${found.admNo}) has an outstanding fee balance of KES ${found.feeBalance.toLocaleString()}. Please clear via Paybill 174379, Acc: ${found.admNo} before mid-term.`
                      );
                    }
                  }}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-forest-800"
                >
                  {students.map((s) => (
                    <option key={s.admNo} value={s.admNo}>
                      {s.firstName} {s.lastName} (Adm: {s.admNo}) - Fee Balance: KES {s.feeBalance.toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Recipient Mobile Phone</label>
                <input
                  type="text"
                  disabled
                  value={`+${selectedStudentForSms.parentPhone} (${selectedStudentForSms.parentName})`}
                  className="w-full bg-slate-100 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-600 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">SMS Message Content</label>
                <textarea
                  rows={4}
                  value={smsCustomText}
                  onChange={(e) => setSmsCustomText(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-forest-800"
                ></textarea>
                <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                  <span>Alphanumeric Sender ID: <strong>KIARITHAINI</strong></span>
                  <span>{smsCustomText.length} characters (1 SMS page)</span>
                </div>
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSmsModal(false)}
                  className="flex-1 py-2.5 border border-slate-300 rounded-lg font-semibold text-slate-600 hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg transition"
                >
                  Dispatch SMS Alert
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
