import React, { useState, useEffect } from 'react';
import { Smartphone, CheckCircle2, AlertCircle, X, Shield, Lock, ArrowRight, RotateCw } from 'lucide-react';
import { PaymentCategory, Student, Transaction } from '../types';

interface Props {
  student: Student;
  amount: number;
  purpose: PaymentCategory;
  phone: string;
  onSuccess: (newTx: Transaction) => void;
  onClose: () => void;
}

export const StkPushSimulatorModal: React.FC<Props> = ({
  student,
  amount,
  purpose,
  phone,
  onSuccess,
  onClose,
}) => {
  const [step, setStep] = useState<'prompt' | 'processing' | 'success' | 'failed'>('prompt');
  const [pin, setPin] = useState('');
  const [countdown, setCountdown] = useState(45);
  const [errorMsg, setErrorMsg] = useState('');

  const accountRef = purpose === 'POCKET_MONEY' ? `PKT${student.admNo}` : student.admNo;
  const purposeLabel =
    purpose === 'POCKET_MONEY'
      ? 'Student Pocket Money'
      : purpose === 'UNIFORM_BOARDING'
      ? 'Boarding Supplies & Uniform'
      : 'Tuition & Boarding Fees';

  // Countdown timer for STK prompt timeout
  useEffect(() => {
    if (step === 'prompt' && countdown > 0) {
      const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && step === 'prompt') {
      setStep('failed');
      setErrorMsg('M-Pesa STK Prompt timed out. No response received from phone.');
    }
  }, [countdown, step]);

  const handleKeyPress = (num: string) => {
    if (pin.length < 4) {
      setPin((prev) => prev + num);
    }
  };

  const handleBackspace = () => {
    setPin((prev) => prev.slice(0, -1));
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (pin.length !== 4) {
      setErrorMsg('Please enter a 4-digit M-Pesa PIN.');
      return;
    }

    setErrorMsg('');
    setStep('processing');

    // Simulate Daraja STK Push callback latency
    setTimeout(() => {
      // Generate realistic Safaricom Receipt: QK + 7 random chars
      const chars = '0123456789ABCDEFGHJKLMNPQRSTUVWXYZ';
      let randomReceipt = 'QK';
      for (let i = 0; i < 7; i++) {
        randomReceipt += chars.charAt(Math.floor(Math.random() * chars.length));
      }

      const newTx: Transaction = {
        id: `tx-${Date.now()}`,
        mpesaReceipt: randomReceipt,
        studentAdmNo: student.admNo,
        studentName: `${student.firstName} ${student.lastName}`,
        amount: Number(amount),
        paymentType: purpose,
        channel: 'STK_PUSH',
        payerPhone: phone,
        status: 'COMPLETED',
        createdAt: new Date().toISOString(),
        notes: `STK Push to ${student.admNo} (${purposeLabel})`,
      };

      setStep('success');
      setTimeout(() => {
        onSuccess(newTx);
      }, 1400);
    }, 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 text-white rounded-3xl shadow-2xl overflow-hidden">
        
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              Safaricom Daraja Gateway
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {step === 'prompt' && (
            <div className="space-y-6">
              
              {/* Phone Frame Simulator Header */}
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-3">
                  <Smartphone className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">M-Pesa STK Push Prompt</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Prompt dispatched to phone <strong className="text-white">{phone}</strong>
                </p>
              </div>

              {/* STK Screen Replica */}
              <div className="bg-slate-800/90 rounded-2xl p-5 border border-emerald-500/30 shadow-inner relative">
                <div className="flex justify-between items-center text-[11px] text-emerald-400 font-mono mb-3">
                  <span>LIPA NA M-PESA</span>
                  <span>{countdown}s remaining</span>
                </div>

                <div className="text-xs text-slate-200 leading-relaxed font-sans bg-slate-950/70 p-3.5 rounded-xl border border-slate-700/80">
                  <p>
                    Do you want to pay <strong className="text-amber-400">KES {Number(amount).toLocaleString()}</strong> to{' '}
                    <strong className="text-white">KIARITHAINI BOYS HIGH SCH</strong>?
                  </p>
                  <div className="mt-2 text-[11px] text-slate-400 space-y-0.5">
                    <p>• Paybill: <strong>174379</strong></p>
                    <p>• Account: <strong className="text-amber-300 font-mono">{accountRef}</strong> ({purposeLabel})</p>
                    <p>• Student: <strong>{student.firstName} {student.lastName}</strong></p>
                  </div>
                </div>

                {/* PIN Input Display */}
                <div className="mt-4 text-center">
                  <label className="block text-xs font-medium text-slate-300 mb-2">
                    Enter M-Pesa PIN:
                  </label>
                  <div className="flex justify-center items-center space-x-3">
                    {[0, 1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className={`w-9 h-11 rounded-lg border flex items-center justify-center text-xl font-bold font-mono transition-all ${
                          pin.length > i
                            ? 'border-emerald-400 bg-emerald-950/60 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                            : 'border-slate-700 bg-slate-900/80 text-slate-500'
                        }`}
                      >
                        {pin.length > i ? '•' : ''}
                      </div>
                    ))}
                  </div>

                  {errorMsg && (
                    <p className="text-xs text-red-400 mt-2 flex items-center justify-center space-x-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{errorMsg}</span>
                    </p>
                  )}
                </div>

                {/* Keypad */}
                <div className="mt-5 grid grid-cols-3 gap-2">
                  {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                    <button
                      key={digit}
                      type="button"
                      onClick={() => handleKeyPress(digit)}
                      className="py-2.5 bg-slate-900 hover:bg-slate-700 text-white font-mono font-bold text-sm rounded-xl border border-slate-700/60 transition active:scale-95"
                    >
                      {digit}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setPin('1234')}
                    className="py-2 text-[10px] font-semibold text-amber-400 bg-slate-900/80 hover:bg-slate-800 rounded-xl border border-slate-700/60 transition"
                    title="Quick demo fill"
                  >
                    Demo PIN (1234)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleKeyPress('0')}
                    className="py-2.5 bg-slate-900 hover:bg-slate-700 text-white font-mono font-bold text-sm rounded-xl border border-slate-700/60 transition active:scale-95"
                  >
                    0
                  </button>
                  <button
                    type="button"
                    onClick={handleBackspace}
                    className="py-2.5 bg-slate-900 hover:bg-slate-700 text-slate-300 font-mono text-xs rounded-xl border border-slate-700/60 transition active:scale-95 flex items-center justify-center"
                  >
                    Clear
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 px-4 border border-slate-700 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold transition"
                >
                  Cancel Request
                </button>
                <button
                  type="button"
                  onClick={() => handleSubmit()}
                  disabled={pin.length !== 4}
                  className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2 shadow-lg shadow-emerald-900/30"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Authorize Payment</span>
                </button>
              </div>

            </div>
          )}

          {step === 'processing' && (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <RotateCw className="w-8 h-8 animate-spin" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white">Contacting Safaricom Daraja...</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                  Reconciling payment of KES {Number(amount).toLocaleString()} for Admission No. {student.admNo}.
                </p>
              </div>
              <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 text-[11px] text-slate-300 font-mono">
                Payload Callback: /api/mpesa/stk-callback (HTTP 200)
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="py-10 text-center space-y-4 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-white">Payment Confirmed!</h4>
                <p className="text-xs text-emerald-400 font-medium mt-1">
                  KES {Number(amount).toLocaleString()} credited successfully.
                </p>
              </div>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                SMS alert dispatched to {phone}. The school ledger and student balance have been automatically updated.
              </p>
            </div>
          )}

          {step === 'failed' && (
            <div className="py-8 text-center space-y-4">
              <div className="w-14 h-14 mx-auto rounded-full bg-red-500/10 text-red-400 border border-red-500/30 flex items-center justify-center">
                <AlertCircle className="w-7 h-7" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white">Transaction Not Completed</h4>
                <p className="text-xs text-red-300 mt-1">{errorMsg}</p>
              </div>
              <button
                onClick={() => {
                  setStep('prompt');
                  setCountdown(45);
                  setPin('');
                }}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition"
              >
                Retry STK Push
              </button>
            </div>
          )}

        </div>

        {/* Security Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
          <span className="flex items-center space-x-1">
            <Shield className="w-3.5 h-3.5 text-emerald-500" />
            <span>256-Bit TLS End-to-End Encryption</span>
          </span>
          <span className="text-slate-400">Kenya Data Protection Act (2019)</span>
        </div>

      </div>
    </div>
  );
};
