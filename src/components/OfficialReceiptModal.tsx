import React from 'react';
import { Transaction, Student } from '../types';
import { Printer, Download, CheckCircle, ShieldCheck, X } from 'lucide-react';

interface Props {
  transaction: Transaction;
  student: Student;
  onClose: () => void;
}

export const OfficialReceiptModal: React.FC<Props> = ({ transaction, student, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  const formattedDate = new Date(transaction.createdAt).toLocaleString('en-KE', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in duration-200">
        
        {/* Modal Top Actions (Hidden in Print) */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-slate-100 border-b border-slate-200 print:hidden">
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-700">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>Official M-Pesa Verified Clearance Document</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium bg-forest-800 text-white rounded-lg hover:bg-forest-900 transition shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition"
              aria-label="Close receipt"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Official Receipt Body */}
        <div id="printable-receipt-modal" className="p-8 sm:p-10 font-sans text-slate-800 bg-white">
          
          {/* Double Decorative Border typical of Kenyan School Certificates */}
          <div className="border-2 border-forest-900 p-6 sm:p-8 rounded-lg relative">
            <div className="absolute inset-1 border border-amber-600/40 rounded pointer-events-none"></div>

            {/* Header */}
            <div className="text-center pb-4 border-b border-slate-300">
              <div className="flex justify-center mb-2">
                <div className="w-14 h-14 rounded-2xl bg-forest-900 text-amber-400 font-serif font-black text-3xl flex items-center justify-center shadow-md border-2 border-amber-400/40">
                  K
                </div>
              </div>
              <h1 className="text-xl sm:text-2xl font-serif font-extrabold tracking-wide text-forest-900 uppercase">
                KIARITHAINI BOYS HIGH SCHOOL
              </h1>
              <p className="text-xs italic text-amber-700 font-serif mt-0.5">
                Motto: &quot;Strive to Excel&quot;
              </p>
              <p className="text-[11px] text-slate-600 mt-1">
                P.O. Box Kiarithaini, Mathira East, Nyeri County, Kenya • Tel: +254 722 377082 (0722377082) • Email: kiarithainiboys@yahoo.com
              </p>
              <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                MOE / KNEC Institution Center Code: <strong>20400000</strong> • Status: County Boarding Boys
              </p>
            </div>

            {/* Document Title Badge */}
            <div className="my-5 text-center">
              <span className="inline-block bg-forest-900 text-amber-300 font-mono font-bold text-xs uppercase px-4 py-1.5 rounded-full tracking-wider shadow-sm">
                OFFICIAL M-PESA PAYMENT CLEARANCE SLIP
              </span>
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-lg border border-slate-200">
              <div>
                <span className="text-slate-500 block text-[11px]">Safaricom M-Pesa Ref:</span>
                <span className="font-mono font-bold text-slate-900 text-sm tracking-wider">
                  {transaction.mpesaReceipt || 'QKH897ZX2'}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Transaction Date & Time:</span>
                <span className="font-semibold text-slate-800">{formattedDate}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Student Name:</span>
                <span className="font-bold text-slate-900 text-sm">
                  {student.firstName} {student.lastName}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Admission Number:</span>
                <span className="font-mono font-bold text-forest-800 text-sm">
                  {student.admNo}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Class & Stream:</span>
                <span className="font-medium text-slate-800">
                  Form {student.formLevel} {student.stream} ({student.house})
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Payer Contact:</span>
                <span className="font-mono text-slate-800">
                  +{transaction.payerPhone}
                </span>
              </div>
            </div>

            {/* Itemized Breakdown Table */}
            <div className="mt-6 border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full text-xs">
                <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3 text-left">Description</th>
                    <th className="py-2.5 px-3 text-left">Payment Channel</th>
                    <th className="py-2.5 px-3 text-left">Allocation Account</th>
                    <th className="py-2.5 px-3 text-right">Amount (KES)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-sans">
                  <tr>
                    <td className="py-3 px-3 font-semibold text-slate-800">
                      {transaction.paymentType === 'POCKET_MONEY'
                        ? 'Student Pocket Money (Tuck Shop Credit)'
                        : transaction.paymentType === 'UNIFORM_BOARDING'
                        ? 'Boarding Supplies & School Uniform'
                        : 'Term 1 School Tuition & Boarding Fees'}
                    </td>
                    <td className="py-3 px-3 text-slate-600 font-mono">
                      {transaction.channel === 'STK_PUSH'
                        ? 'M-Pesa STK Express'
                        : transaction.channel === 'C2B_PAYBILL'
                        ? 'Lipa na M-Pesa Paybill (174379)'
                        : 'Direct Bank Deposit Slip'}
                    </td>
                    <td className="py-3 px-3 text-slate-600 font-mono">
                      {transaction.paymentType === 'POCKET_MONEY' ? `PKT${student.admNo}` : student.admNo}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-slate-900 text-sm">
                      KES {transaction.amount.toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Financial Summary & Balances */}
            <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200/80 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs">
              <div>
                <span className="text-emerald-900 font-bold block">Status: Verified & Cleared to School Ledger</span>
                <span className="text-emerald-700 text-[11px]">Automated reconciliation via Safaricom Daraja C2B/STK Gateway</span>
              </div>
              <div className="text-right">
                <div className="text-slate-600 text-[11px]">Remaining Tuition Fee Balance:</div>
                <div className="text-base font-mono font-black text-amber-700">
                  KES {student.feeBalance.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Official Stamp & Signatures */}
            <div className="mt-8 pt-6 border-t border-slate-200 flex flex-wrap justify-between items-end gap-4">
              
              {/* Circular Stamp simulation */}
              <div className="relative w-32 h-32 rounded-full border-4 border-dashed border-blue-700/80 p-2 flex flex-col items-center justify-center text-center text-blue-800 font-serif rotate-[-6deg] select-none shadow-sm bg-blue-50/40">
                <div className="absolute inset-1.5 rounded-full border border-blue-600"></div>
                <span className="text-[9px] font-bold tracking-widest uppercase">KIARITHAINI BOYS</span>
                <span className="text-[7px] font-mono uppercase text-blue-900 my-0.5">ACCOUNTS OFFICE</span>
                <div className="text-[10px] font-black font-sans text-emerald-700 bg-emerald-100/80 px-1 py-0.5 rounded border border-emerald-300">
                  VERIFIED
                </div>
                <span className="text-[6.5px] text-slate-600 mt-0.5">CO-OP BANK CODE: 707</span>
                <span className="text-[6.5px] font-mono text-blue-800">{new Date().toLocaleDateString('en-KE')}</span>
              </div>

              {/* Principal Endorsement */}
              <div className="text-center space-y-1 text-xs">
                <div className="h-8 flex items-end justify-center">
                  <span className="font-serif italic text-slate-700 border-b border-slate-400 pb-0.5 px-3 font-semibold">
                    Thiong&apos;O John James
                  </span>
                </div>
                <span className="text-[11px] font-bold text-slate-800 block">Chief Principal</span>
                <span className="text-[10px] text-slate-400 block">Kiarithaini High School</span>
              </div>

              {/* Bursar Signoff */}
              <div className="text-right space-y-1 text-xs">
                <div className="h-8 flex items-end justify-end">
                  <span className="font-serif italic text-slate-500 border-b border-slate-400 pb-0.5 px-3">
                    Accounts Office
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 block">Co-operative Bank: 01129059715100</span>
                <span className="text-[10px] text-slate-400 block">Mathira East, Nyeri County</span>
              </div>
            </div>

            {/* KDPA 2019 Notice & MOE Ceiling */}
            <div className="mt-6 pt-3 border-t border-slate-200 text-center space-y-1">
              <p className="text-[9px] text-slate-500 font-medium">
                MOE Fee Compliance: Boarding fee structure strictly adheres to the approved national public boarding ceiling (KSh 40,535 – KSh 53,554 p.a.).
              </p>
              <p className="text-[8.5px] text-slate-400 italic">
                This document is an electronic receipt issued in compliance with the Kenya Data Protection Act (2019) and Public Finance Management regulations.
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
