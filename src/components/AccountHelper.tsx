import React, { useState } from 'react';
import { Copy, Check, Info, Sparkles, ArrowRight } from 'lucide-react';

interface Props {
  onOpenPortal?: () => void;
}

export const AccountHelper: React.FC<Props> = ({ onOpenPortal }) => {
  const [accountType, setAccountType] = useState<'fees' | 'pocket'>('fees');
  const [admNo, setAdmNo] = useState('4521');
  const [copied, setCopied] = useState(false);

  const cleanAdm = admNo.replace(/\D/g, '') || '4521';
  const formattedAccount = accountType === 'pocket' ? `PKT${cleanAdm}` : cleanAdm;

  const handleCopy = () => {
    navigator.clipboard.writeText(formattedAccount);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-forest-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 border border-slate-700 shadow-xl flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/20 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Validation Tool</span>
          </div>
          <span className="text-[11px] text-slate-400">Avoid payment bounces</span>
        </div>

        <h3 className="text-xl font-bold font-serif text-white">M-Pesa Account Helper</h3>
        <p className="text-xs text-slate-300 mt-1 mb-6 leading-relaxed">
          Safaricom validation checks for exact formats. Check how your account reference should be typed before you send.
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              1. What are you paying for?
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setAccountType('fees')}
                className={`py-2 px-3 rounded-xl text-xs font-medium border text-left transition ${
                  accountType === 'fees'
                    ? 'border-amber-400 bg-amber-400/10 text-white shadow-sm'
                    : 'border-slate-700 bg-slate-800/60 text-slate-400 hover:text-white'
                }`}
              >
                <span className="block font-semibold">School Tuition</span>
                <span className="text-[10px] opacity-75">Boarding & Fees</span>
              </button>

              <button
                type="button"
                onClick={() => setAccountType('pocket')}
                className={`py-2 px-3 rounded-xl text-xs font-medium border text-left transition ${
                  accountType === 'pocket'
                    ? 'border-emerald-400 bg-emerald-400/10 text-white shadow-sm'
                    : 'border-slate-700 bg-slate-800/60 text-slate-400 hover:text-white'
                }`}
              >
                <span className="block font-semibold">Pocket Money</span>
                <span className="text-[10px] opacity-75">Tuck Shop (PKT)</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              2. Student Admission Number
            </label>
            <div className="relative">
              <input
                type="text"
                value={admNo}
                onChange={(e) => setAdmNo(e.target.value)}
                placeholder="e.g. 4521"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono placeholder:text-slate-500 focus:outline-none focus:border-amber-400 transition"
              />
              <span className="absolute right-3 top-2.5 text-xs text-slate-500 font-sans">
                digits only
              </span>
            </div>
          </div>

          {/* Result Card with 1-click copy */}
          <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-700/80 relative overflow-hidden mt-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                Type this exact Account No:
              </span>
              <button
                onClick={handleCopy}
                className="inline-flex items-center space-x-1 text-xs bg-slate-800 hover:bg-slate-700 text-amber-300 px-2.5 py-1 rounded-lg border border-slate-700 transition"
                title="Copy formatted account number"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-medium">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            <div className="mt-2 flex items-baseline space-x-3">
              <div className="text-3xl font-mono font-black tracking-wider text-amber-400">
                {formattedAccount}
              </div>
              <span
                className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                  accountType === 'pocket'
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    : 'bg-amber-950 text-amber-300 border border-amber-800'
                }`}
              >
                {accountType === 'pocket' ? 'Pocket Money account' : 'Tuition & General Fees account'}
              </span>
            </div>

            <p className="text-[11px] text-slate-400 mt-2 flex items-start space-x-1.5">
              <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
              <span>
                {accountType === 'pocket'
                  ? 'The PKT prefix routes funds straight to the student canteen smart card.'
                  : 'Do not append names (e.g., "4521 Amos"). Type only digits to ensure automated clearing.'}
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-5 border-t border-slate-800/80 text-xs text-slate-400 flex items-center justify-between">
        <span>Prefer automated phone prompt?</span>
        {onOpenPortal && (
          <button
            onClick={onOpenPortal}
            className="inline-flex items-center space-x-1 text-amber-400 hover:text-amber-300 font-semibold transition"
          >
            <span>Parent Portal STK Push</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
