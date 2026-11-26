import React, { useState } from 'react';
import {
  Student,
  Transaction,
  LibraryResource,
  Notice,
  PaymentCategory,
} from './types';
import {
  INITIAL_STUDENTS,
  INITIAL_TRANSACTIONS,
  INITIAL_NOTICES,
  INITIAL_LIBRARY_RESOURCES,
} from './data/mockData';
import { AccountHelper } from './components/AccountHelper';
import { StkPushSimulatorModal } from './components/StkPushSimulatorModal';
import { OfficialReceiptModal } from './components/OfficialReceiptModal';
import { LibraryPreviewModal, TeacherUploadModal } from './components/LibraryModal';
import { BursarConsole } from './components/BursarConsole';
import { PrivacyNoticeModal } from './components/PrivacyNoticeModal';
import { FeePaymentTrendsChart } from './components/FeePaymentTrendsChart';
import { CampusGallery } from './components/CampusGallery';
import { ClassTeacherPortal } from './components/ClassTeacherPortal';
import { ScannedReportModal } from './components/ScannedReportModal';
import { ScannedReportCard } from './types';
import {
  BookOpen,
  Camera,
  CreditCard,
  GraduationCap,
  Bell,
  Shield,
  Smartphone,
  CheckCircle,
  Copy,
  ExternalLink,
  ChevronRight,
  Menu,
  X,
  Search,
  Filter,
  Download,
  Eye,
  Plus,
  ArrowRight,
  User,
  LogOut,
  Calendar,
  Award,
  PhoneCall,
  MapPin,
  Clock,
  Check,
  Building,
  FileText,
  Scan,
  Printer,
  FileSpreadsheet
} from 'lucide-react';

export default function App() {
  // State for core datasets
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [notices] = useState<Notice[]>(INITIAL_NOTICES);
  const [libraryResources, setLibraryResources] = useState<LibraryResource[]>(INITIAL_LIBRARY_RESOURCES);

  // Navigation & Active View state
  const [activeTab, setActiveTab] = useState<'portal_public' | 'bursar' | 'teacher'>('portal_public');
  const [activeReportModal, setActiveReportModal] = useState<ScannedReportCard | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // E-Library state
  const [librarySearch, setLibrarySearch] = useState('');
  const [libraryLevel, setLibraryLevel] = useState<string>('all');
  const [librarySource, setLibrarySource] = useState<string>('all');
  const [previewResource, setPreviewResource] = useState<LibraryResource | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [downloadToast, setDownloadToast] = useState<string | null>(null);

  // Notice board filter
  const [noticeCategory, setNoticeCategory] = useState<string>('all');

  // Paybill & Bank quick copy
  const [paybillCopied, setPaybillCopied] = useState(false);
  const [coopCopied, setCoopCopied] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);
  const [paymentMethodTab, setPaymentMethodTab] = useState<'mpesa' | 'bank'>('mpesa');

  // Parent Portal Auth state
  const [authPhone, setAuthPhone] = useState('0700000001');
  const [otpSent, setOtpSent] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState('');
  const [simulatedOtp, setSimulatedOtp] = useState('849201');
  const [activeStudent, setActiveStudent] = useState<Student | null>(null);
  const [authError, setAuthError] = useState('');
  const [otpTimer, setOtpTimer] = useState(300);

  // STK Push state
  const [stkModalOpen, setStkModalOpen] = useState(false);
  const [stkAmount, setStkAmount] = useState('5000');
  const [stkPurpose, setStkPurpose] = useState<PaymentCategory>('TUITION_FEES');
  const [activeReceiptModal, setActiveReceiptModal] = useState<{ tx: Transaction; student: Student } | null>(null);

  // KDPA Modal
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);

  // Academic breakdown tab inside parent portal
  const [parentSubTab, setParentSubTab] = useState<'overview' | 'subjects' | 'reports' | 'ledger'>('overview');

  // Quick Paybill copy
  const copyPaybill = () => {
    navigator.clipboard.writeText('174379');
    setPaybillCopied(true);
    setTimeout(() => setPaybillCopied(false), 2000);
  };

  // Quick Co-op Bank Account copy
  const copyCoopAccount = () => {
    navigator.clipboard.writeText('01129059715100');
    setCoopCopied(true);
    setTimeout(() => setCoopCopied(false), 2000);
  };

  // Quick School Code copy
  const copySchoolCode = () => {
    navigator.clipboard.writeText('707');
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  };

  // Helper: Format Kenyan Phone
  const normalizeKenyanPhone = (input: string): string => {
    let clean = input.replace(/\D/g, '');
    if (clean.startsWith('0')) clean = '254' + clean.slice(1);
    if (clean.startsWith('7') || clean.startsWith('1')) clean = '254' + clean;
    return clean;
  };

  // Parent Portal OTP Flow
  const handleSendOTP = (targetPhone?: string) => {
    const phoneToUse = targetPhone || authPhone;
    const normalized = normalizeKenyanPhone(phoneToUse);
    const matched = students.find(
      (s) => s.parentPhone === normalized || s.parentPhone.endsWith(phoneToUse.replace(/\D/g, '').slice(-9))
    );

    if (!matched) {
      setAuthError('This phone number is not registered to any student in the school administration database.');
      return;
    }

    setAuthError('');
    // Generate 6 digit code
    const generated = Math.floor(100000 + Math.random() * 900000).toString();
    setSimulatedOtp(generated);
    setOtpSent(true);
    setOtpTimer(300);
  };

  const handleVerifyOTP = (codeToVerify?: string) => {
    const code = codeToVerify || enteredOtp;
    if (code === simulatedOtp || code === '123456') {
      const normalized = normalizeKenyanPhone(authPhone);
      const matched =
        students.find((s) => s.parentPhone === normalized || s.parentPhone.endsWith(authPhone.replace(/\D/g, '').slice(-9))) ||
        students[0];
      setActiveStudent(matched);
      setAuthError('');
    } else {
      setAuthError('Invalid verification code. Please check your SMS or click Auto-fill.');
    }
  };

  const handleLogout = () => {
    setActiveStudent(null);
    setOtpSent(false);
    setEnteredOtp('');
    setAuthError('');
  };

  // Handle successful STK payment
  const handleStkSuccess = (newTx: Transaction) => {
    setStkModalOpen(false);

    // Update students state
    setStudents((prev) =>
      prev.map((s) => {
        if (s.admNo === newTx.studentAdmNo) {
          if (newTx.paymentType === 'POCKET_MONEY') {
            return { ...s, pocketBalance: s.pocketBalance + newTx.amount };
          } else {
            return { ...s, feeBalance: Math.max(0, s.feeBalance - newTx.amount) };
          }
        }
        return s;
      })
    );

    // Update active student in session
    if (activeStudent && activeStudent.admNo === newTx.studentAdmNo) {
      if (newTx.paymentType === 'POCKET_MONEY') {
        setActiveStudent({
          ...activeStudent,
          pocketBalance: activeStudent.pocketBalance + newTx.amount,
        });
      } else {
        setActiveStudent({
          ...activeStudent,
          feeBalance: Math.max(0, activeStudent.feeBalance - newTx.amount),
        });
      }
    }

    // Add to transactions ledger
    setTransactions((prev) => [newTx, ...prev]);

    // Automatically prompt receipt modal for the parent
    const student = students.find((s) => s.admNo === newTx.studentAdmNo) || activeStudent || students[0];
    setActiveReceiptModal({ tx: newTx, student });
  };

  // Bursar manual transaction
  const handleAddBursarTransaction = (newTx: Transaction) => {
    setTransactions((prev) => [newTx, ...prev]);
    setStudents((prev) =>
      prev.map((s) => {
        if (s.admNo === newTx.studentAdmNo) {
          if (newTx.paymentType === 'POCKET_MONEY') {
            return { ...s, pocketBalance: s.pocketBalance + newTx.amount };
          } else {
            return { ...s, feeBalance: Math.max(0, s.feeBalance - newTx.amount) };
          }
        }
        return s;
      })
    );
  };

  // E-Library filtering
  const filteredLibrary = libraryResources.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(librarySearch.toLowerCase()) ||
      item.subject.toLowerCase().includes(librarySearch.toLowerCase()) ||
      item.description.toLowerCase().includes(librarySearch.toLowerCase());

    const matchesLevel = libraryLevel === 'all' || item.formLevel === libraryLevel;
    const matchesSource = librarySource === 'all' || item.source === librarySource;

    return matchesSearch && matchesLevel && matchesSource;
  });

  const handleDownloadResource = (res: LibraryResource) => {
    setDownloadToast(`Downloading "${res.title}" (${res.fileSize})...`);
    // Increment download count
    setLibraryResources((prev) =>
      prev.map((r) => (r.id === res.id ? { ...r, downloads: r.downloads + 1 } : r))
    );
    setTimeout(() => {
      setDownloadToast(null);
    }, 3500);
  };

  // Notice filtering
  const filteredNotices = notices.filter(
    (n) => noticeCategory === 'all' || n.category === noticeCategory
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-amber-400 selection:text-slate-900">
      
      {/* Toast Notification */}
      {downloadToast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-forest-900 text-white border border-amber-400 px-5 py-3 rounded-2xl shadow-2xl flex items-center space-x-2 text-xs font-semibold animate-in slide-in-from-top-4">
          <Download className="w-4 h-4 text-amber-400 animate-bounce" />
          <span>{downloadToast}</span>
        </div>
      )}

      {/* Top Banner */}
      <div className="bg-forest-950 text-slate-300 text-xs py-2.5 px-4 border-b border-forest-900 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center space-x-3 text-[11px] sm:text-xs">
            <span className="flex items-center space-x-1 text-slate-200">
              <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Mathira East, Nyeri County • Slopes of Mt. Kenya</span>
            </span>
            <span className="hidden md:inline text-slate-600">|</span>
            <span className="hidden md:inline text-slate-300">
              Tel: <a href="tel:0722377082" className="text-amber-400 font-bold hover:underline">0722377082</a>
            </span>
            <span className="hidden lg:inline text-slate-600">|</span>
            <span className="hidden lg:inline text-slate-300">
              Email: <a href="mailto:kiarithainiboys@yahoo.com" className="text-slate-200 hover:underline">kiarithainiboys@yahoo.com</a>
            </span>
            <span className="hidden lg:inline text-slate-600">|</span>
            <span className="hidden lg:inline text-slate-300">
              Paybill: <strong className="text-emerald-400">174379</strong>
            </span>
          </div>

          <div className="flex items-center space-x-4 text-[11px] sm:text-xs font-medium">
            <button
              onClick={() => {
                setActiveTab('bursar');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`hover:text-amber-300 transition flex items-center space-x-1 ${
                activeTab === 'bursar' ? 'text-amber-400 font-bold underline' : 'text-slate-300'
              }`}
            >
              <Building className="w-3.5 h-3.5" />
              <span>Bursar Finance Console</span>
            </button>
            <span className="text-slate-600">|</span>
            <a
              href="#parent-portal"
              onClick={() => setActiveTab('portal_public')}
              className="text-amber-400 font-semibold hover:text-amber-300 transition flex items-center space-x-1"
            >
              <span>Parent Portal Direct Pay &rarr;</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Header / Navigation */}
      <header className="bg-white sticky top-[37px] z-40 shadow-sm border-b border-slate-200">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo & School Name */}
          <div
            onClick={() => {
              setActiveTab('portal_public');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center space-x-3.5 cursor-pointer group"
          >
            <div className="h-12 w-12 rounded-2xl bg-forest-900 group-hover:bg-forest-800 text-amber-400 font-serif font-black text-2xl flex items-center justify-center shadow-md border-2 border-amber-400/30 transition-transform group-hover:scale-105">
              K
            </div>
            <div>
              <span className="text-lg sm:text-xl font-extrabold tracking-tight text-forest-900 block leading-tight font-serif">
                KIARITHAINI BOYS
              </span>
              <span className="text-[11px] text-slate-500 tracking-wider uppercase font-bold flex items-center space-x-1">
                <span>County Boarding Boys</span>
                <span>•</span>
                <span className="text-amber-700">Mathira East, Nyeri</span>
              </span>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-6 text-xs sm:text-sm font-semibold text-slate-600">
            <button
              onClick={() => {
                setActiveTab('portal_public');
                const el = document.getElementById('about');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hover:text-forest-800 transition"
            >
              About
            </button>
            <button
              onClick={() => {
                setActiveTab('portal_public');
                const el = document.getElementById('notices');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hover:text-forest-800 transition"
            >
              Notice Board
            </button>
            <button
              onClick={() => {
                setActiveTab('portal_public');
                const el = document.getElementById('quick-pay');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hover:text-forest-800 transition text-emerald-800 font-bold flex items-center space-x-1"
            >
              <CreditCard className="w-4 h-4 text-emerald-600" />
              <span>Lipa na M-Pesa</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('portal_public');
                const el = document.getElementById('elibrary');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hover:text-forest-800 transition"
            >
              E-Library
            </button>
            <button
              onClick={() => {
                setActiveTab('portal_public');
                const el = document.getElementById('gallery');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hover:text-forest-800 transition flex items-center space-x-1"
            >
              <span>Campus Life</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('teacher');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition border flex items-center space-x-1.5 ${
                activeTab === 'teacher'
                  ? 'bg-forest-900 text-amber-400 border-forest-950 shadow-sm'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
              }`}
            >
              <Scan className="w-3.5 h-3.5 text-emerald-600" />
              <span>Class Teachers</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('bursar');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition border ${
                activeTab === 'bursar'
                  ? 'bg-amber-100 text-amber-900 border-amber-300 shadow-sm'
                  : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
              }`}
            >
              Bursar Console
            </button>
            <button
              onClick={() => {
                setActiveTab('portal_public');
                const el = document.getElementById('parent-portal');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-forest-900 hover:bg-forest-800 text-white px-4 py-2 rounded-xl font-bold transition shadow-sm hover:shadow flex items-center space-x-1.5"
            >
              <Smartphone className="w-4 h-4 text-amber-400" />
              <span>Parent Portal</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-700 hover:text-slate-900 rounded-lg hover:bg-slate-100"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-3 shadow-lg">
            <button
              onClick={() => {
                setActiveTab('portal_public');
                setMobileMenuOpen(false);
                document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="block w-full text-left py-2 text-sm font-semibold text-slate-700"
            >
              About the School
            </button>
            <button
              onClick={() => {
                setActiveTab('portal_public');
                setMobileMenuOpen(false);
                document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="block w-full text-left py-2 text-sm font-semibold text-slate-700"
            >
              Campus Life & Gallery
            </button>
            <button
              onClick={() => {
                setActiveTab('portal_public');
                setMobileMenuOpen(false);
                document.getElementById('notices')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="block w-full text-left py-2 text-sm font-semibold text-slate-700"
            >
              Notice Board
            </button>
            <button
              onClick={() => {
                setActiveTab('portal_public');
                setMobileMenuOpen(false);
                document.getElementById('quick-pay')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="block w-full text-left py-2 text-sm font-bold text-emerald-700"
            >
              Lipa na M-Pesa Guide
            </button>
            <button
              onClick={() => {
                setActiveTab('portal_public');
                setMobileMenuOpen(false);
                document.getElementById('elibrary')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="block w-full text-left py-2 text-sm font-semibold text-slate-700"
            >
              E-Library Learning Materials
            </button>
            <div className="pt-2 flex flex-col space-y-2">
              <button
                onClick={() => {
                  setActiveTab('teacher');
                  setMobileMenuOpen(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full text-center py-2.5 bg-emerald-50 text-emerald-900 rounded-xl text-xs font-bold border border-emerald-200 flex items-center justify-center space-x-1.5"
              >
                <Scan className="w-3.5 h-3.5 text-emerald-700" />
                <span>Class Teacher Stream Report Hub</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab('bursar');
                  setMobileMenuOpen(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full text-center py-2.5 bg-slate-100 text-slate-800 rounded-xl text-xs font-bold border border-slate-300"
              >
                Bursar Finance Console
              </button>
              <button
                onClick={() => {
                  setActiveTab('portal_public');
                  setMobileMenuOpen(false);
                  document.getElementById('parent-portal')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full text-center py-2.5 bg-forest-900 text-white rounded-xl text-xs font-bold"
              >
                Parent Portal & Direct Pay
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Page View Conditional */}
      {activeTab === 'bursar' ? (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="mb-6 flex items-center justify-between">
            <button
              onClick={() => setActiveTab('portal_public')}
              className="inline-flex items-center space-x-1.5 text-xs font-bold text-forest-800 hover:text-forest-900 transition"
            >
              <span>&larr; Return to School Public Portal</span>
            </button>
          </div>
          <BursarConsole
            transactions={transactions}
            students={students}
            onAddTransaction={handleAddBursarTransaction}
            onOpenReceipt={(tx, student) => setActiveReceiptModal({ tx, student })}
          />
        </main>
      ) : activeTab === 'teacher' ? (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="mb-6 flex items-center justify-between">
            <button
              onClick={() => setActiveTab('portal_public')}
              className="inline-flex items-center space-x-1.5 text-xs font-bold text-forest-800 hover:text-forest-900 transition"
            >
              <span>&larr; Return to School Public Portal</span>
            </button>
          </div>
          <ClassTeacherPortal
            students={students}
            onUpdateStudents={setStudents}
            onOpenReportModal={(rep) => setActiveReportModal(rep)}
          />
        </main>
      ) : (
        <>
          {/* Hero Section */}
          <section id="about" className="relative bg-gradient-to-br from-forest-950 via-forest-900 to-slate-900 text-white py-20 lg:py-28 overflow-hidden">
            {/* Subtle aesthetic dot pattern & mountain crest vibe */}
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:24px_24px]"></div>
            <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-y-12 translate-x-12">
              <div className="w-[500px] h-[500px] rounded-full border-[40px] border-amber-400"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                
                {/* Left 7 Cols: Text & Stats */}
                <div className="lg:col-span-7">
                  <div className="inline-flex items-center space-x-2 bg-white/10 text-amber-300 backdrop-blur-md text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full mb-6 border border-white/15 shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                    <span>School Motto: Strive to Excel</span>
                  </div>

                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-black tracking-tight leading-[1.15]">
                    Excellence Rooted in <span className="italic text-amber-400">Discipline</span> & Character
                  </h1>

                  <p className="mt-6 text-base sm:text-lg text-slate-200 leading-relaxed font-light">
                    Welcome to Kiarithaini High School, a County Boarding Boys institution situated on the serene slopes below Mount Kenya in Mathira East Sub-County, Nyeri County. We nurture 657 young men in academic excellence, moral leadership, and spiritual discipline.
                  </p>

                  {/* Primary CTA Buttons */}
                  <div className="mt-8 flex flex-wrap gap-3 items-center">
                    <a
                      href="#quick-pay"
                      className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-3 rounded-xl font-bold shadow-lg shadow-emerald-950/40 transition flex items-center space-x-2 text-xs uppercase tracking-wider"
                    >
                      <CreditCard className="w-4 h-4 text-emerald-200" />
                      <span>Lipa na M-Pesa</span>
                    </a>

                    <a
                      href="#gallery"
                      className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-5 py-3 rounded-xl font-bold backdrop-blur-sm transition flex items-center space-x-2 text-xs uppercase tracking-wider"
                    >
                      <Camera className="w-4 h-4 text-amber-300" />
                      <span>Campus Photos</span>
                    </a>

                    <a
                      href="#parent-portal"
                      className="bg-amber-400 hover:bg-amber-300 text-slate-950 px-5 py-3 rounded-xl font-bold transition flex items-center space-x-2 text-xs uppercase tracking-wider shadow-md"
                    >
                      <Smartphone className="w-4 h-4 text-slate-900" />
                      <span>Parent Portal</span>
                    </a>
                  </div>

                  {/* Live Stats Ticker */}
                  <div className="mt-10 pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
                    <div>
                      <div className="text-2xl font-bold font-mono text-amber-400">657</div>
                      <div className="text-xs text-slate-300 mt-0.5">Students Enrolled</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold font-mono text-emerald-400">County</div>
                      <div className="text-xs text-slate-300 mt-0.5">School Status</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold font-mono text-amber-400">Boarding</div>
                      <div className="text-xs text-slate-300 mt-0.5">Boys Institution</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold font-mono text-emerald-400">Mathira East</div>
                      <div className="text-xs text-slate-300 mt-0.5">Nyeri County</div>
                    </div>
                  </div>
                </div>

                {/* Right 5 Cols: Visual Real Photo Spotlight Card */}
                <div className="lg:col-span-5 hidden lg:block">
                  <div className="relative">
                    
                    {/* Main Top Card: Students in uniform */}
                    <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-white/20 bg-slate-900 group">
                      <img
                        src="/public/assets/aistudio/image_4c54ff56.png"
                        alt="Kiarithaini High School students in official uniform"
                        className="w-full h-64 object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent p-5 flex flex-col justify-end text-white">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 border border-amber-400/30 px-2 py-0.5 rounded-full w-fit">
                          Student Brotherhood
                        </span>
                        <h4 className="text-sm font-bold font-serif text-white mt-1">
                          Kiarithaini Gentlemen in Uniform
                        </h4>
                        <p className="text-[11px] text-slate-300 mt-0.5">
                          Proud academic ambassadors representing Nyeri County.
                        </p>
                      </div>
                    </div>

                    {/* Overlapping Bottom Card: School Bus */}
                    <div className="mt-4 -ml-6 relative rounded-2xl overflow-hidden shadow-2xl border-2 border-amber-400/30 bg-slate-900 flex items-center p-2.5 space-x-3 backdrop-blur-md bg-slate-900/90">
                      <img
                        src="/public/assets/aistudio/image_a9a7270a.png"
                        alt="Kiarithaini High School dedicated luxury bus"
                        className="w-24 h-16 rounded-xl object-cover border border-slate-700"
                      />
                      <div className="flex-1">
                        <span className="text-[10px] uppercase font-bold text-emerald-400">
                          Modern School Fleet
                        </span>
                        <div className="text-xs font-bold text-white font-serif">
                          Official School Bus
                        </div>
                        <p className="text-[10px] text-slate-300">
                          Equipped for academic symposia & national fixtures.
                        </p>
                      </div>
                      <a
                        href="#gallery"
                        className="p-2 rounded-xl bg-forest-800 hover:bg-forest-700 text-amber-300 transition text-xs"
                        title="View photo gallery"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </a>
                    </div>

                  </div>
                </div>

              </div>
            </div>
          </section>

          {/* Main Content Layout */}
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-24">

            {/* School Summary & Authentic Campus Showcase */}
            <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-6 sm:p-10">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                
                {/* Left Column: Campus Collage Image */}
                <div className="lg:col-span-7 space-y-3">
                  <div className="relative rounded-2xl overflow-hidden shadow-md border border-slate-200 group">
                    <img
                      src="/public/assets/aistudio/image_1fb62f0f.png"
                      alt="Kiarithaini High School Campus - Main Academic Block, School Gate, Corridor Walkway, and Landscaped Grounds"
                      className="w-full h-auto object-cover group-hover:scale-[1.01] transition-transform duration-300"
                    />
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950/90 via-slate-900/60 to-transparent p-4 sm:p-5 text-white">
                      <div className="flex items-center space-x-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
                        <Building className="w-3.5 h-3.5" />
                        <span>Campus Tour & Facilities</span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-200 font-medium">
                        Kiarithaini High School: Main Academic Complex, Iconic School Entrance Gate, Classroom Corridors, and Landscaped Grounds on the Slopes of Mount Kenya.
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-500 text-center">
                    <span className="p-2 bg-slate-50 rounded-lg border border-slate-100 font-semibold text-slate-700">✓ Main Gate & Vision</span>
                    <span className="p-2 bg-slate-50 rounded-lg border border-slate-100 font-semibold text-slate-700">✓ Academic Block</span>
                    <span className="p-2 bg-slate-50 rounded-lg border border-slate-100 font-semibold text-slate-700">✓ Covered Corridors</span>
                    <span className="p-2 bg-slate-50 rounded-lg border border-slate-100 font-semibold text-slate-700">✓ Serene Lawns</span>
                  </div>
                </div>

                {/* Right Column: Verified School Summary Details Table */}
                <div className="lg:col-span-5 space-y-5">
                  <div>
                    <div className="inline-flex items-center space-x-2 text-xs font-bold text-forest-800 uppercase tracking-wider bg-forest-800/10 px-3 py-1 rounded-full mb-2">
                      <span>Official School Profile</span>
                    </div>
                    <h3 className="text-2xl font-bold font-serif text-slate-900">
                      School Summary Details
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Institutional profile and administrative records for Kiarithaini High School.
                    </p>
                  </div>

                  {/* Details Table */}
                  <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-slate-50/50 text-xs">
                    <div className="flex justify-between items-center p-3 sm:px-4">
                      <span className="text-slate-500 font-medium">School Name</span>
                      <span className="font-bold text-slate-900 font-serif">Kiarithaini High School</span>
                    </div>
                    <div className="flex justify-between items-center p-3 sm:px-4">
                      <span className="text-slate-500 font-medium">County</span>
                      <span className="font-bold text-slate-900">Nyeri</span>
                    </div>
                    <div className="flex justify-between items-center p-3 sm:px-4">
                      <span className="text-slate-500 font-medium">Sub-County</span>
                      <span className="font-bold text-amber-700 font-semibold">Mathira East</span>
                    </div>
                    <div className="flex justify-between items-center p-3 sm:px-4">
                      <span className="text-slate-500 font-medium">Status of School</span>
                      <span className="font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full text-[11px]">
                        County
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 sm:px-4">
                      <span className="text-slate-500 font-medium">Type of School</span>
                      <span className="font-bold text-slate-900">Boarding Boys</span>
                    </div>
                    <div className="flex justify-between items-center p-3 sm:px-4">
                      <span className="text-slate-500 font-medium">Principal</span>
                      <span className="font-bold text-slate-900 font-serif">Thiong&apos;O John James</span>
                    </div>
                    <div className="flex justify-between items-center p-3 sm:px-4">
                      <span className="text-slate-500 font-medium">Number of Students enrolled</span>
                      <span className="font-mono font-bold text-forest-900 text-sm">657 Students</span>
                    </div>
                    <div className="flex justify-between items-center p-3 sm:px-4">
                      <span className="text-slate-500 font-medium">Phone Number</span>
                      <a href="tel:0722377082" className="font-mono font-bold text-emerald-700 hover:underline">
                        0722377082
                      </a>
                    </div>
                    <div className="flex justify-between items-center p-3 sm:px-4">
                      <span className="text-slate-500 font-medium">Email Address</span>
                      <a href="mailto:kiarithainiboys@yahoo.com" className="font-mono font-semibold text-slate-800 hover:underline truncate max-w-[200px]">
                        kiarithainiboys@yahoo.com
                      </a>
                    </div>
                    <div className="flex justify-between items-center p-3 sm:px-4 bg-amber-50/50">
                      <span className="text-slate-600 font-medium">Co-operative Bank A/C</span>
                      <div className="text-right">
                        <span className="font-mono font-bold text-slate-900 block">01129059715100</span>
                        <span className="text-[10px] text-amber-800 font-medium">School Code: 707</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-3 sm:px-4 bg-emerald-50/50">
                      <span className="text-slate-600 font-medium">Public Boarding Fee Cap</span>
                      <span className="font-mono font-bold text-emerald-800">
                        KSh 40,535 – KSh 53,554 / Yr
                      </span>
                    </div>
                  </div>

                  <div className="p-4 bg-emerald-50 border border-emerald-200/80 rounded-2xl flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-emerald-950 block">Admissions & General Enquiries</span>
                      <span className="text-emerald-700 text-[11px]">Direct administrative line available</span>
                    </div>
                    <a
                      href="tel:0722377082"
                      className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold transition text-xs shrink-0 shadow-sm"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>Call 0722377082</span>
                    </a>
                  </div>

                </div>

              </div>
            </section>

            {/* Campus Life & Authentic Photo Gallery */}
            <section id="gallery" className="scroll-mt-24">
              <CampusGallery />
            </section>

            {/* Notice Board & Alerts */}
            <section id="notices" className="scroll-mt-24">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-4 mb-8">
                <div>
                  <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-forest-800 uppercase tracking-wider mb-1">
                    <Bell className="w-3.5 h-3.5 text-amber-600" />
                    <span>Official Announcements</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
                    School Notice Board
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Timely communications from the Principal, Dean of Studies, and Bursar.
                  </p>
                </div>

                {/* Filter Pills */}
                <div className="flex flex-wrap items-center gap-2">
                  {['all', 'Finance & Fees', 'Academics', 'School Life', 'Boarding'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setNoticeCategory(cat)}
                      className={`text-xs px-3 py-1.5 rounded-full font-semibold transition ${
                        noticeCategory === cat
                          ? 'bg-forest-900 text-white shadow-sm'
                          : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {cat === 'all' ? 'All Notices' : cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredNotices.map((notice) => (
                  <div
                    key={notice.id}
                    className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between"
                  >
                    <div>
                      {notice.image && (
                        <div className="mb-3 rounded-xl overflow-hidden aspect-video bg-slate-100 border border-slate-100 relative group/img">
                          <img
                            src={notice.image}
                            alt={notice.title}
                            className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}

                      <div className="flex items-center justify-between mb-3">
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                            notice.category === 'Finance & Fees'
                              ? 'bg-emerald-100 text-emerald-800'
                              : notice.category === 'Academics'
                              ? 'bg-blue-100 text-blue-800'
                              : notice.category === 'Boarding'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-purple-100 text-purple-800'
                          }`}
                        >
                          {notice.category}
                        </span>
                        {notice.isUrgent && (
                          <span className="text-[10px] bg-red-100 text-red-800 font-bold px-2 py-0.5 rounded-full">
                            Urgent
                          </span>
                        )}
                      </div>

                      <h3 className="font-bold text-slate-900 text-base leading-snug mb-2 font-serif">
                        {notice.title}
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {notice.content}
                      </p>
                    </div>

                    <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                      <span>{notice.date}</span>
                      <span className="font-semibold text-slate-700">{notice.author}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Payment Channels & MOE Regulatory Fee Guidelines */}
            <section id="quick-pay" className="scroll-mt-24 space-y-6">
              
              {/* Payment Channel Card */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                {/* Header with Channel Switcher Tabs */}
                <div className="p-6 sm:p-8 bg-gradient-to-r from-forest-900 via-forest-800 to-slate-900 text-white">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="inline-flex items-center space-x-2 text-amber-400 font-bold text-xs uppercase tracking-wider mb-2">
                        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                        <span>Institutional Payment Gateways • Mathira East, Nyeri</span>
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-bold font-serif text-white">
                        Official Fee Payment Channels
                      </h2>
                      <p className="mt-1 text-xs sm:text-sm text-slate-300 max-w-2xl">
                        Kiarithaini High School accepts payments via Safaricom Lipa na M-Pesa and Co-operative Bank of Kenya. Real-time reconciliation ensures prompt official receipt issuance.
                      </p>
                    </div>

                    {/* Method Switcher Tabs */}
                    <div className="inline-flex p-1.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shrink-0">
                      <button
                        onClick={() => setPaymentMethodTab('mpesa')}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
                          paymentMethodTab === 'mpesa'
                            ? 'bg-emerald-600 text-white shadow-md'
                            : 'text-slate-200 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        <Smartphone className="w-4 h-4 text-emerald-300" />
                        <span>Safaricom M-Pesa</span>
                      </button>
                      <button
                        onClick={() => setPaymentMethodTab('bank')}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
                          paymentMethodTab === 'bank'
                            ? 'bg-amber-500 text-slate-950 shadow-md'
                            : 'text-slate-200 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        <Building className="w-4 h-4 text-amber-950" />
                        <span>Co-operative Bank</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Tab 1: Safaricom M-Pesa Paybill */}
                {paymentMethodTab === 'mpesa' && (
                  <div className="grid grid-cols-1 lg:grid-cols-12">
                    {/* Left: Step-by-Step Instructions */}
                    <div className="p-8 lg:p-10 lg:col-span-7 bg-white flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                            Safaricom Daraja C2B Verified Channel
                          </span>
                          <span className="text-xs text-slate-500 font-mono">Real-time STK Clearance</span>
                        </div>

                        <h3 className="text-xl font-bold text-slate-900 font-serif">
                          How to Pay via Lipa na M-Pesa Paybill
                        </h3>
                        <p className="mt-1 text-xs text-slate-600">
                          Follow these 3 quick steps on your phone. Immediate SMS receipt confirmation will be sent upon payment.
                        </p>

                        <div className="mt-6 space-y-4">
                          {/* Step 1 */}
                          <div className="flex items-start space-x-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                            <span className="shrink-0 w-8 h-8 rounded-xl bg-forest-900 text-amber-400 font-bold text-xs flex items-center justify-center">
                              1
                            </span>
                            <div>
                              <div className="text-[11px] uppercase text-slate-500 font-semibold tracking-wider">
                                M-Pesa SIM Toolkit / M-Pesa App
                              </div>
                              <div className="text-sm font-bold text-slate-900 mt-0.5">
                                Select Lipa na M-Pesa &rarr; Paybill
                              </div>
                            </div>
                          </div>

                          {/* Step 2 */}
                          <div className="flex items-start space-x-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                            <span className="shrink-0 w-8 h-8 rounded-xl bg-forest-900 text-amber-400 font-bold text-xs flex items-center justify-center">
                              2
                            </span>
                            <div className="flex-1">
                              <div className="text-[11px] uppercase text-slate-500 font-semibold tracking-wider">
                                Business Number
                              </div>
                              <div className="flex items-center space-x-3 mt-1">
                                <code className="text-2xl font-black font-mono text-forest-900 bg-white px-3.5 py-1 rounded-xl border border-slate-200">
                                  174379
                                </code>
                                <button
                                  onClick={copyPaybill}
                                  className="inline-flex items-center space-x-1 text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 px-3 py-1.5 rounded-lg font-semibold transition"
                                >
                                  {paybillCopied ? (
                                    <>
                                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                                      <span>Copied!</span>
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="w-3.5 h-3.5" />
                                      <span>Copy Paybill</span>
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Step 3 */}
                          <div className="flex items-start space-x-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                            <span className="shrink-0 w-8 h-8 rounded-xl bg-forest-900 text-amber-400 font-bold text-xs flex items-center justify-center">
                              3
                            </span>
                            <div className="flex-1">
                              <div className="text-[11px] uppercase text-slate-500 font-semibold tracking-wider">
                                Account Number Formatting Rules
                              </div>
                              <p className="text-xs text-slate-600 mt-1">
                                Type only the student admission number. <strong>Do not include student names</strong>, as names cannot be processed by the automated validation server.
                              </p>

                              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">
                                    For Tuition & Fees:
                                  </span>
                                  <span className="font-mono font-bold text-base text-slate-900">4521</span>
                                  <span className="block text-[11px] text-slate-500 mt-0.5">
                                    (Just admission number)
                                  </span>
                                </div>

                                <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">
                                    For Pocket Money:
                                  </span>
                                  <span className="font-mono font-bold text-base text-emerald-700">PKT4521</span>
                                  <span className="block text-[11px] text-slate-500 mt-0.5">
                                    (PKT prefix + admission number)
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                        </div>
                      </div>

                      <div className="mt-8 pt-4 border-t border-slate-100 text-xs text-slate-500 flex items-center space-x-2">
                        <Shield className="w-4 h-4 text-emerald-600" />
                        <span>Instant Daraja C2B receipt generation and Bursar ledger reconciliation.</span>
                      </div>
                    </div>

                    {/* Right: Interactive Account Helper */}
                    <div className="lg:col-span-5 p-4 sm:p-6 lg:p-8 bg-slate-900 flex flex-col justify-center">
                      <AccountHelper
                        onOpenPortal={() => {
                          document.getElementById('parent-portal')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Tab 2: Co-operative Bank Direct Deposit & EFT */}
                {paymentMethodTab === 'bank' && (
                  <div className="grid grid-cols-1 lg:grid-cols-12">
                    {/* Left: Co-op Bank Details */}
                    <div className="p-8 lg:p-10 lg:col-span-7 bg-white flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-xs font-bold text-forest-800 uppercase tracking-wider bg-forest-50 border border-forest-200 px-3 py-1 rounded-full">
                            Co-operative Bank of Kenya • Institutional Account
                          </span>
                          <span className="text-xs text-slate-500 font-mono">School Code: 707</span>
                        </div>

                        <h3 className="text-xl font-bold text-slate-900 font-serif">
                          Direct Bank Deposit &amp; Agent Banking
                        </h3>
                        <p className="mt-1 text-xs text-slate-600">
                          Parents and guardians can deposit funds directly via any Co-operative Bank branch, Co-op Kwa Jirani agent, or through MCo-op Cash.
                        </p>

                        {/* Co-op Bank Key Account Parameters Card */}
                        <div className="mt-6 p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                          
                          {/* Row 1: Account Number */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-white rounded-xl border border-slate-200">
                            <div>
                              <span className="text-[10px] uppercase text-slate-500 font-bold tracking-wider block">
                                Account Number
                              </span>
                              <code className="text-2xl font-black font-mono text-forest-900 tracking-wider">
                                01129059715100
                              </code>
                            </div>
                            <button
                              onClick={copyCoopAccount}
                              className="inline-flex items-center space-x-1.5 text-xs bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 px-3.5 py-2 rounded-xl font-bold transition self-start sm:self-center"
                            >
                              {coopCopied ? (
                                <>
                                  <Check className="w-4 h-4 text-emerald-600" />
                                  <span>Account Copied!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-4 h-4 text-amber-800" />
                                  <span>Copy Account</span>
                                </>
                              )}
                            </button>
                          </div>

                          {/* Row 2: Grid with Account Name & School Code */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="p-3 bg-white rounded-xl border border-slate-200">
                              <span className="text-[10px] uppercase text-slate-500 font-bold tracking-wider block">
                                Account Name
                              </span>
                              <span className="text-sm font-bold text-slate-900 font-serif">
                                Kiarithaini High School
                              </span>
                              <span className="block text-[11px] text-slate-500 mt-0.5">
                                Bank: Co-operative Bank of Kenya
                              </span>
                            </div>

                            <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                              <div>
                                <span className="text-[10px] uppercase text-slate-500 font-bold tracking-wider block">
                                  School Code
                                </span>
                                <span className="text-lg font-black font-mono text-forest-900">
                                  707
                                </span>
                                <span className="block text-[11px] text-slate-500 mt-0.5">
                                  For MCo-op Cash &amp; Agent
                                </span>
                              </div>
                              <button
                                onClick={copySchoolCode}
                                className="inline-flex items-center space-x-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1.5 rounded-lg font-semibold transition"
                              >
                                {codeCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                                <span>{codeCopied ? 'Copied' : 'Copy'}</span>
                              </button>
                            </div>
                          </div>

                          {/* Row 3: Institutional Authority & Contacts */}
                          <div className="text-[11px] text-slate-600 bg-amber-50/50 p-3 rounded-xl border border-amber-200/50 flex flex-wrap items-center justify-between gap-2">
                            <span>
                              Chief Principal: <strong className="text-slate-900">Thiong&apos;O John James</strong>
                            </span>
                            <span>
                              Sub-County: <strong className="text-slate-900">Mathira East</strong>, Nyeri
                            </span>
                            <span>
                              Tel: <a href="tel:0722377082" className="text-forest-900 font-bold hover:underline">0722377082</a>
                            </span>
                          </div>

                        </div>

                        {/* Three Deposit Ways */}
                        <div className="mt-6 space-y-3">
                          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                            Deposit Instructions by Channel:
                          </h4>

                          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 flex items-start space-x-3">
                            <span className="font-bold text-forest-800 bg-white px-2 py-0.5 rounded border border-slate-200 shrink-0">
                              MCo-op Cash (*667#)
                            </span>
                            <span>
                              Open MCo-op Cash &rarr; <em>Pay Loans &amp; Fees</em> &rarr; <em>School Fees</em> &rarr; Enter School Code <strong>707</strong> &rarr; Enter Student Admission No. (e.g. <strong>4521</strong>) as Reference.
                            </span>
                          </div>

                          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 flex items-start space-x-3">
                            <span className="font-bold text-forest-800 bg-white px-2 py-0.5 rounded border border-slate-200 shrink-0">
                              Co-op Kwa Jirani (Agent)
                            </span>
                            <span>
                              Visit any licensed Co-op Bank Agent nationwide. Provide School Code <strong>707</strong> and Student Admission No. (e.g. <strong>4521</strong>). You will receive an official branded agent slip.
                            </span>
                          </div>

                          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 flex items-start space-x-3">
                            <span className="font-bold text-forest-800 bg-white px-2 py-0.5 rounded border border-slate-200 shrink-0">
                              Bank Counter / EFT / RTGS
                            </span>
                            <span>
                              Use standard deposit slip. Account: <strong>01129059715100</strong>. Narration/Depositor: <em>Adm No: [4521] - [Student Name]</em>. Bring slip copy to Bursar or view via Parent Portal.
                            </span>
                          </div>
                        </div>

                      </div>

                      <div className="mt-8 pt-4 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Shield className="w-4 h-4 text-forest-800" />
                          <span>Direct banking transactions reconciled daily by the school bursar desk.</span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Bank Deposit Assistant Card */}
                    <div className="lg:col-span-5 p-6 sm:p-8 bg-forest-950 text-white flex flex-col justify-between">
                      <div>
                        <div className="inline-flex items-center space-x-2 text-amber-400 font-bold text-xs uppercase tracking-wider mb-3">
                          <Building className="w-4 h-4" />
                          <span>Co-op Banking Assistant</span>
                        </div>

                        <h3 className="text-xl font-bold font-serif text-white">
                          Bank Deposit Reference Guide
                        </h3>
                        <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                          When depositing at Co-operative Bank, ensure your deposit slip or EFT narration includes the exact student admission number for instant crediting.
                        </p>

                        <div className="mt-6 p-4 rounded-2xl bg-white/10 border border-white/15 space-y-3">
                          <div className="text-xs">
                            <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
                              Branch Counter Deposit Narration Example:
                            </span>
                            <div className="mt-1 font-mono text-sm bg-black/40 p-2.5 rounded-xl border border-white/10 text-amber-300">
                              ADM: 4521 - John Kimani (Form 3 East)
                            </div>
                          </div>

                          <div className="text-xs pt-2 border-t border-white/10">
                            <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
                              Co-op Agent / MCo-op Reference:
                            </span>
                            <div className="mt-1 font-mono text-sm bg-black/40 p-2.5 rounded-xl border border-white/10 text-emerald-300">
                              School Code: 707 | Student No: 4521
                            </div>
                          </div>
                        </div>

                        <div className="mt-6 p-4 rounded-xl bg-amber-400/10 border border-amber-400/30 text-amber-200 text-xs leading-relaxed">
                          <strong>Bursar Verification:</strong> Retain the duplicate bank deposit slip or agent transaction SMS for presentation during student reporting or termly clearance.
                        </div>
                      </div>

                      <div className="mt-8 space-y-3">
                        <button
                          onClick={() => {
                            document.getElementById('parent-portal')?.scrollIntoView({ behavior: 'smooth' });
                          }}
                          className="w-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold py-3 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-lg transition"
                        >
                          <User className="w-4 h-4" />
                          <span>Check Student Fee Ledger in Parent Portal &rarr;</span>
                        </button>
                        
                        <p className="text-[11px] text-center text-slate-400">
                          Need bursar help? Call: <strong>0722377082</strong> • Email: <strong>kiarithainiboys@yahoo.com</strong>
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Ministry of Education (MOE) Public Boarding Fee Ceiling Card */}
              <div className="bg-gradient-to-br from-amber-50 via-white to-amber-50/50 rounded-3xl border border-amber-200/80 p-6 sm:p-8 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-amber-200/60">
                  <div className="max-w-2xl">
                    <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-amber-900 uppercase tracking-widest bg-amber-100 border border-amber-300 px-3 py-1 rounded-full mb-3">
                      <Shield className="w-3.5 h-3.5 text-amber-700" />
                      <span>Ministry of Education (MOE) Gazette Notice Compliance</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold font-serif text-slate-900">
                      National Public Boarding Secondary School Fee Ceiling
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                      In strict compliance with Ministry of Education regulations for County Public Boarding Secondary Institutions, the maximum annual fee ceiling is capped between <strong>KSh 40,535</strong> and <strong>KSh 53,554</strong> per academic year (divided across Terms 1, 2, and 3 depending on the school&apos;s approved category tier).
                    </p>
                  </div>

                  {/* Ceiling Highlight Pill */}
                  <div className="p-4 bg-white rounded-2xl border border-amber-200 shadow-sm shrink-0 text-center min-w-[240px]">
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
                      Approved Annual Fee Ceiling
                    </span>
                    <span className="text-xl sm:text-2xl font-black font-mono text-forest-900 block mt-1">
                      KSh 40,535 &ndash; 53,554
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full inline-block mt-1">
                      County Boarding Boys Tier
                    </span>
                  </div>
                </div>

                {/* Term Distribution Breakdown Grid */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Term 1 */}
                  <div className="bg-white p-5 rounded-2xl border border-amber-100 shadow-xs relative overflow-hidden">
                    <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2 w-16 h-16 bg-amber-100/50 rounded-full blur-md"></div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-lg border border-amber-200">
                        Term 1 (50%)
                      </span>
                      <span className="text-[11px] text-slate-400 font-semibold">Jan &ndash; April</span>
                    </div>
                    <div className="mt-3">
                      <span className="text-lg font-black font-mono text-slate-900 block">
                        KSh 20,268 &ndash; 26,777
                      </span>
                      <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                        Allocated for boarding upkeep, academic tuition materials, co-curricular registration, and initial maintenance.
                      </p>
                    </div>
                  </div>

                  {/* Term 2 */}
                  <div className="bg-white p-5 rounded-2xl border border-amber-100 shadow-xs relative overflow-hidden">
                    <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2 w-16 h-16 bg-blue-100/40 rounded-full blur-md"></div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-blue-800 bg-blue-50 px-2.5 py-0.5 rounded-lg border border-blue-200">
                        Term 2 (30%)
                      </span>
                      <span className="text-[11px] text-slate-400 font-semibold">May &ndash; August</span>
                    </div>
                    <div className="mt-3">
                      <span className="text-lg font-black font-mono text-slate-900 block">
                        KSh 12,160 &ndash; 16,066
                      </span>
                      <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                        Covers academic mid-year continuous assessments, boarding utilities, sanitation, and co-curricular sports.
                      </p>
                    </div>
                  </div>

                  {/* Term 3 */}
                  <div className="bg-white p-5 rounded-2xl border border-amber-100 shadow-xs relative overflow-hidden">
                    <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2 w-16 h-16 bg-emerald-100/40 rounded-full blur-md"></div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-200">
                        Term 3 (20%)
                      </span>
                      <span className="text-[11px] text-slate-400 font-semibold">Sept &ndash; Nov</span>
                    </div>
                    <div className="mt-3">
                      <span className="text-lg font-black font-mono text-slate-900 block">
                        KSh 8,107 &ndash; 10,711
                      </span>
                      <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                        Allocated for end-of-year assessment, KNEC exam preparation logistics, and annual clearance.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Statutory Protection Notice */}
                <div className="mt-6 pt-4 border-t border-amber-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>
                      <strong>Strict Fee Transparency:</strong> No unauthorized levies, motivation fees, or unapproved development charges are levied in accordance with Mathira East Sub-County Education Board directives.
                    </span>
                  </div>
                  <div className="shrink-0 text-slate-500 text-[11px]">
                    Principal: <strong className="text-slate-800">Thiong&apos;O John James</strong>
                  </div>
                </div>
              </div>

            </section>

            {/* School E-Library Section */}
            <section id="elibrary" className="scroll-mt-24 space-y-8">
              
              <div className="text-center max-w-2xl mx-auto">
                <span className="text-xs font-bold text-forest-800 uppercase tracking-widest bg-forest-800/10 px-3.5 py-1.5 rounded-full">
                  Curriculum & Revision Hub
                </span>
                <h2 className="text-3xl font-bold font-serif text-slate-900 mt-3">
                  School E-Library Repository
                </h2>
                <p className="text-slate-600 text-xs sm:text-sm mt-2">
                  Access past KNEC mock examinations, KICD modules, laboratory manuals, and teacher summary notes.
                </p>
              </div>

              {/* Filter and Search Bar */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  
                  {/* Keyword */}
                  <div className="sm:col-span-2 relative">
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Search by Subject, Topic or Title
                    </label>
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                      <input
                        type="text"
                        value={librarySearch}
                        onChange={(e) => setLibrarySearch(e.target.value)}
                        placeholder="e.g. Mathematics Calculus, Kiswahili Fasihi, Titration..."
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-forest-800"
                      />
                    </div>
                  </div>

                  {/* Form Level */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Form Level
                    </label>
                    <select
                      value={libraryLevel}
                      onChange={(e) => setLibraryLevel(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-forest-800"
                    >
                      <option value="all">All Forms (1 — 4)</option>
                      <option value="Form 1">Form 1</option>
                      <option value="Form 2">Form 2</option>
                      <option value="Form 3">Form 3</option>
                      <option value="Form 4">Form 4</option>
                    </select>
                  </div>

                  {/* Source */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Curriculum Source
                    </label>
                    <select
                      value={librarySource}
                      onChange={(e) => setLibrarySource(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-forest-800"
                    >
                      <option value="all">All Sources</option>
                      <option value="KNEC">KNEC Past Papers</option>
                      <option value="KICD">KICD Core Modules</option>
                      <option value="Internal">Internal Revision Notes</option>
                    </select>
                  </div>

                </div>

                {/* Upload action for staff */}
                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
                  <span>Found <strong>{filteredLibrary.length}</strong> learning materials available</span>
                  <button
                    onClick={() => setShowUploadModal(true)}
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-slate-100 hover:bg-forest-900 hover:text-white text-slate-700 rounded-lg font-semibold transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Teacher / Staff CMS Upload</span>
                  </button>
                </div>
              </div>

              {/* Resource Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredLibrary.length === 0 ? (
                  <div className="col-span-full py-16 text-center text-slate-400 bg-white rounded-2xl border border-dashed border-slate-300">
                    <BookOpen className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                    <p className="text-sm font-semibold text-slate-600">No resources matched your search filter.</p>
                    <p className="text-xs text-slate-400 mt-1">Try resetting the form level or keyword filter.</p>
                  </div>
                ) : (
                  filteredLibrary.map((res) => (
                    <div
                      key={res.id}
                      className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-forest-800 transition shadow-sm hover:shadow-md flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between text-xs mb-3">
                          <span className="font-bold text-forest-800 bg-forest-800/10 px-2.5 py-0.5 rounded-md">
                            {res.subject}
                          </span>
                          <span className="text-slate-500 font-semibold text-[11px]">
                            {res.formLevel}
                          </span>
                        </div>

                        <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2 font-serif">
                          {res.title}
                        </h3>

                        <p className="text-xs text-slate-500 mt-2 line-clamp-3 leading-relaxed">
                          {res.description}
                        </p>

                        <div className="flex items-center space-x-2 text-[11px] text-slate-400 mt-4">
                          <span className="font-semibold text-slate-600">Source: {res.source}</span>
                          <span>•</span>
                          <span>{res.fileSize}</span>
                          <span>•</span>
                          <span>{res.downloads} downloads</span>
                        </div>
                      </div>

                      <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-2 gap-2">
                        <button
                          onClick={() => setPreviewResource(res)}
                          className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 rounded-xl text-xs font-semibold transition flex items-center justify-center space-x-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Preview</span>
                        </button>

                        <button
                          onClick={() => handleDownloadResource(res)}
                          className="w-full bg-forest-800 hover:bg-forest-900 text-white py-2 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1 shadow-sm"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download</span>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

            </section>

            {/* Parent Portal & Direct M-Pesa STK Push */}
            <section id="parent-portal" className="scroll-mt-24 bg-slate-950 rounded-3xl p-6 sm:p-10 lg:p-12 text-white border border-slate-800 shadow-2xl">
              
              <div className="max-w-3xl mb-8">
                <div className="inline-flex items-center space-x-2 text-amber-400 text-xs font-bold uppercase tracking-wider bg-amber-400/10 px-3.5 py-1.5 rounded-full border border-amber-400/20 mb-3">
                  <Shield className="w-3.5 h-3.5" />
                  <span>Secure Parent Authentication & STK Push</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-serif font-black text-white">
                  Parent Portal & Direct Pay
                </h2>
                <p className="text-slate-400 text-xs sm:text-sm mt-2 leading-relaxed">
                  Passwordless phone authentication linked to the school administration registry. View academic reports, discipline notes, fee balances, and trigger instant M-Pesa prompts straight to your phone.
                </p>
              </div>

              {/* View 1: Unauthenticated Login Form */}
              {!activeStudent ? (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {/* Phone Login Box */}
                  <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8">
                    <h3 className="text-xl font-bold font-serif text-white mb-1">
                      Log in with your registered phone
                    </h3>
                    <p className="text-xs text-slate-400 mb-6">
                      Enter the mobile number provided during admission. A 6-digit security code will be sent via SMS.
                    </p>

                    {/* Step A: Phone Number Input */}
                    {!otpSent ? (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                            Registered Parent Phone Number
                          </label>
                          <div className="relative">
                            <input
                              type="tel"
                              value={authPhone}
                              onChange={(e) => setAuthPhone(e.target.value)}
                              placeholder="e.g. 0700000001 or 0712345678"
                              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white font-mono placeholder:text-slate-600 focus:outline-none focus:border-amber-400 transition"
                            />
                            <Smartphone className="w-4 h-4 text-slate-500 absolute right-3.5 top-3.5" />
                          </div>
                        </div>

                        {authError && (
                          <div className="p-3 bg-red-950/60 border border-red-500/40 rounded-xl text-xs text-red-300">
                            {authError}
                          </div>
                        )}

                        <button
                          type="button"
                          onClick={() => handleSendOTP()}
                          className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl transition text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg shadow-emerald-950/50"
                        >
                          <span>Send 6-Digit SMS Verification Code</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      /* Step B: 6-Digit OTP Verification */
                      <div className="space-y-4">
                        {/* Simulated SMS Alert */}
                        <div className="p-4 bg-emerald-950/80 border border-emerald-500/40 rounded-2xl text-xs text-emerald-300 space-y-1">
                          <div className="flex items-center justify-between font-bold">
                            <span>Africa&apos;s Talking SMS Gateway [KIARITHAINI]</span>
                            <span>Simulated Code</span>
                          </div>
                          <p className="text-slate-200">
                            Kiarithaini Boys: Your login code is <strong className="text-amber-400 font-mono text-sm">{simulatedOtp}</strong>. Valid for 5 minutes.
                          </p>
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <label className="text-xs font-semibold text-slate-300">
                              Enter 6-Digit SMS Code
                            </label>
                            <span className="text-[11px] text-amber-400 font-mono">
                              Expires in 04:59
                            </span>
                          </div>
                          <input
                            type="text"
                            maxLength={6}
                            value={enteredOtp}
                            onChange={(e) => setEnteredOtp(e.target.value.replace(/\D/g, ''))}
                            placeholder="e.g. 849201"
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-center text-xl font-mono font-bold tracking-widest text-white focus:outline-none focus:border-amber-400"
                          />
                        </div>

                        {authError && (
                          <div className="p-3 bg-red-950/60 border border-red-500/40 rounded-xl text-xs text-red-300">
                            {authError}
                          </div>
                        )}

                        <div className="flex space-x-3">
                          <button
                            type="button"
                            onClick={() => handleVerifyOTP()}
                            className="flex-1 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold py-3 rounded-xl transition text-xs uppercase tracking-wider shadow-md"
                          >
                            Verify & Enter Portal
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setEnteredOtp(simulatedOtp);
                              handleVerifyOTP(simulatedOtp);
                            }}
                            className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 rounded-xl text-xs font-semibold transition"
                            title="Auto fill code"
                          >
                            Auto-fill
                          </button>
                          <button
                            type="button"
                            onClick={() => setOtpSent(false)}
                            className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl text-xs transition"
                          >
                            Back
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Preset Demo Selector for Testing */}
                  <div className="lg:col-span-5 bg-slate-900/60 border border-slate-800 p-6 rounded-3xl space-y-4">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 block">
                      Quick Demo Parent Accounts
                    </span>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Click any registered student record below to test phone authentication instantly:
                    </p>

                    <div className="space-y-3">
                      {students.map((student) => (
                        <div
                          key={student.admNo}
                          onClick={() => {
                            setAuthPhone(`0${student.parentPhone.slice(3)}`);
                            setOtpSent(false);
                            setAuthError('');
                          }}
                          className={`p-3.5 rounded-2xl border cursor-pointer transition ${
                            authPhone.endsWith(student.parentPhone.slice(-9))
                              ? 'border-amber-400 bg-amber-400/10'
                              : 'border-slate-800 bg-slate-900/80 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs text-white">
                              {student.firstName} {student.lastName}
                            </span>
                            <span className="font-mono text-[11px] text-amber-400">
                              Adm: {student.admNo}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                            <span>Form {student.formLevel} {student.stream}</span>
                            <span>Phone: 0{student.parentPhone.slice(3)}</span>
                          </div>
                          <div className="text-[10px] text-slate-500 mt-1">
                            Fee Balance: KES {student.feeBalance.toLocaleString()} • Pocket: KES {student.pocketBalance.toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              ) : (
                /* View 2: Authenticated Parent Dashboard */
                <div className="space-y-8 animate-in fade-in duration-200">
                  
                  {/* Student Welcome Header */}
                  <div className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-3xl flex flex-wrap justify-between items-center gap-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-14 h-14 rounded-2xl bg-forest-900 border border-amber-400/40 text-amber-400 font-serif font-black text-2xl flex items-center justify-center">
                        {activeStudent.firstName[0]}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                            Authenticated Parent Session
                          </span>
                          <span className="text-xs text-emerald-400 font-mono">
                            ● Active
                          </span>
                        </div>
                        <h3 className="text-2xl font-bold font-serif text-white mt-1">
                          Student: {activeStudent.firstName} {activeStudent.lastName}
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Admission No: <strong className="text-amber-300 font-mono">{activeStudent.admNo}</strong> • Form {activeStudent.formLevel} {activeStudent.stream} • House: {activeStudent.house} • Parent: {activeStudent.parentName}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={handleLogout}
                      className="inline-flex items-center space-x-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-4 py-2.5 rounded-xl border border-slate-700 transition"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Log Out Session</span>
                    </button>
                  </div>

                  {/* Dashboard Sub-tabs */}
                  <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3 text-xs font-semibold">
                    <button
                      onClick={() => setParentSubTab('overview')}
                      className={`px-4 py-2 rounded-xl transition ${
                        parentSubTab === 'overview'
                          ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                          : 'text-slate-400 hover:text-white hover:bg-slate-900'
                      }`}
                    >
                      Academic & Fee Standing
                    </button>
                    <button
                      onClick={() => setParentSubTab('subjects')}
                      className={`px-4 py-2 rounded-xl transition ${
                        parentSubTab === 'subjects'
                          ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                          : 'text-slate-400 hover:text-white hover:bg-slate-900'
                      }`}
                    >
                      Subject-by-Subject Breakdown
                    </button>
                    <button
                      onClick={() => setParentSubTab('reports')}
                      className={`px-4 py-2 rounded-xl transition flex items-center space-x-1.5 ${
                        parentSubTab === 'reports'
                          ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                          : 'text-slate-400 hover:text-white hover:bg-slate-900'
                      }`}
                    >
                      <Award className="w-3.5 h-3.5" />
                      <span>Official Scanned Report Card</span>
                    </button>
                    <button
                      onClick={() => setParentSubTab('ledger')}
                      className={`px-4 py-2 rounded-xl transition ${
                        parentSubTab === 'ledger'
                          ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                          : 'text-slate-400 hover:text-white hover:bg-slate-900'
                      }`}
                    >
                      Payment History & Receipts
                    </button>
                  </div>

                  {/* Tab 1: Overview & STK Push */}
                  {parentSubTab === 'overview' && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                      
                      {/* Left: Academic & Fee Balances */}
                      <div className="lg:col-span-7 space-y-6">
                        
                        {/* Performance Card */}
                        <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-3xl space-y-4">
                          <h4 className="font-bold text-white text-base font-serif">
                            Termly Performance Summary
                          </h4>

                          <div className="grid grid-cols-3 gap-3 text-center">
                            <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800">
                              <span className="text-[11px] text-slate-400 block font-semibold">Mean Grade</span>
                              <span className="text-2xl font-black font-mono text-amber-400 mt-1 block">
                                {activeStudent.academicRecords[0]?.meanGrade || 'B+'}
                              </span>
                            </div>

                            <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800">
                              <span className="text-[11px] text-slate-400 block font-semibold">Class Rank</span>
                              <span className="text-2xl font-black font-mono text-white mt-1 block">
                                0{activeStudent.academicRecords[0]?.rank} / {activeStudent.academicRecords[0]?.totalClass}
                              </span>
                            </div>

                            <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800">
                              <span className="text-[11px] text-slate-400 block font-semibold">Conduct</span>
                              <span className="text-xl font-bold text-emerald-400 mt-1 block truncate">
                                {activeStudent.academicRecords[0]?.conduct || 'Exemplary'}
                              </span>
                            </div>
                          </div>

                          <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800/80 text-xs text-slate-300 space-y-2">
                            <p>
                              • <strong>Attendance:</strong> {activeStudent.academicRecords[0]?.attendance || 100}% recorded attendance for the current term.
                            </p>
                            <p>
                              • <strong>Class Teacher Remark:</strong> &ldquo;{activeStudent.academicRecords[0]?.classTeacherRemark}&rdquo;
                            </p>
                            <p>
                              • <strong>Principal Remark:</strong> &ldquo;{activeStudent.academicRecords[0]?.principalRemark}&rdquo;
                            </p>
                          </div>
                        </div>

                        {/* Current Fee Standing Card */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-3xl">
                            <span className="text-xs uppercase text-slate-400 font-semibold tracking-wider block">
                              Outstanding School Fees
                            </span>
                            <div className="mt-2 text-3xl font-black font-mono text-white">
                              KES {activeStudent.feeBalance.toLocaleString()}
                            </div>
                            <span
                              className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded mt-2 ${
                                activeStudent.feeBalance === 0
                                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                  : 'bg-amber-950 text-amber-300 border border-amber-800'
                              }`}
                            >
                              {activeStudent.feeBalance === 0 ? '✓ Fully Cleared' : 'Payment Required'}
                            </span>
                          </div>

                          <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-3xl">
                            <span className="text-xs uppercase text-slate-400 font-semibold tracking-wider block">
                              Student Pocket Money
                            </span>
                            <div className="mt-2 text-3xl font-black font-mono text-emerald-400">
                              KES {activeStudent.pocketBalance.toLocaleString()}
                            </div>
                            <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded mt-2 bg-emerald-950 text-emerald-300 border border-emerald-800">
                              Available in Canteen Tuck Shop
                            </span>
                          </div>
                        </div>

                        {/* Recharts Bar Chart: Historical Fee Payment Trends */}
                        <FeePaymentTrendsChart
                          student={activeStudent}
                          transactions={transactions}
                        />

                      </div>

                      {/* Right: Direct M-Pesa STK Push Form */}
                      <div className="lg:col-span-5 bg-forest-950/80 border border-forest-800/80 p-6 sm:p-8 rounded-3xl space-y-6">
                        <div>
                          <div className="inline-flex items-center space-x-2 text-emerald-400 font-bold text-xs uppercase tracking-wider mb-1">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                            <span>M-Pesa Express • Daraja STK Push</span>
                          </div>
                          <h4 className="text-xl font-bold font-serif text-white">
                            Pay by Instant Phone Prompt
                          </h4>
                          <p className="text-xs text-slate-300 mt-1">
                            A secure Safaricom PIN prompt will be sent directly to your registered number: <strong className="text-white">{activeStudent.maskedPhone}</strong>.
                          </p>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                              What are you paying for?
                            </label>
                            <select
                              value={stkPurpose}
                              onChange={(e) => setStkPurpose(e.target.value as any)}
                              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                            >
                              <option value="TUITION_FEES">School Tuition & Boarding Fees</option>
                              <option value="POCKET_MONEY">Student Pocket Money (PKT Tuck Shop)</option>
                              <option value="UNIFORM_BOARDING">Boarding Supplies & Uniform</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                              Amount in KES
                            </label>
                            <input
                              type="number"
                              min="10"
                              value={stkAmount}
                              onChange={(e) => setStkAmount(e.target.value)}
                              placeholder="e.g. 5000"
                              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm font-mono font-bold text-white focus:outline-none focus:border-amber-400"
                            />

                            {/* Quick Amount Chips */}
                            <div className="flex flex-wrap gap-2 mt-2">
                              {[1000, 2500, 5000].map((amt) => (
                                <button
                                  key={amt}
                                  type="button"
                                  onClick={() => setStkAmount(amt.toString())}
                                  className="text-[11px] px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg border border-slate-700 transition"
                                >
                                  +KES {amt.toLocaleString()}
                                </button>
                              ))}
                              {activeStudent.feeBalance > 0 && (
                                <button
                                  type="button"
                                  onClick={() => setStkAmount(activeStudent.feeBalance.toString())}
                                  className="text-[11px] px-2.5 py-1 bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 rounded-lg border border-amber-400/30 transition font-semibold"
                                >
                                  Clear Balance (KES {activeStudent.feeBalance.toLocaleString()})
                                </button>
                              )}
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => setStkModalOpen(true)}
                            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 rounded-xl transition text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg shadow-emerald-950/60"
                          >
                            <Smartphone className="w-4 h-4" />
                            <span>Send M-Pesa Prompt to {activeStudent.maskedPhone}</span>
                          </button>
                        </div>

                        <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 text-[11px] text-slate-400 flex items-start space-x-2">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>
                            Upon entering PIN, your student&apos;s fee ledger updates immediately, and an official clearance slip is ready to print.
                          </span>
                        </div>
                      </div>

                    </div>
                  )}

                  {/* Tab 2: Subject Breakdown */}
                  {parentSubTab === 'subjects' && (
                    <div className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-3xl space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-bold text-white text-base font-serif">
                            Term 1 Subject Grades & Continuous Assessment (CAT)
                          </h4>
                          <p className="text-xs text-slate-400">
                            Candidate examination codes and teacher evaluation feedback.
                          </p>
                        </div>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-slate-300">
                          <thead className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800">
                            <tr>
                              <th className="p-3">Subject Name</th>
                              <th className="p-3">KNEC Code</th>
                              <th className="p-3 text-right">Score (%)</th>
                              <th className="p-3">Grade</th>
                              <th className="p-3">Subject Teacher Remark</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800">
                            {activeStudent.academicRecords[0]?.subjects.map((sub) => (
                              <tr key={sub.code} className="hover:bg-slate-800/40 transition">
                                <td className="p-3 font-semibold text-white">{sub.name}</td>
                                <td className="p-3 font-mono text-slate-400">{sub.code}</td>
                                <td className="p-3 text-right font-mono font-bold text-amber-400">{sub.score}%</td>
                                <td className="p-3 font-bold text-emerald-400">{sub.grade}</td>
                                <td className="p-3 text-slate-400 italic">&ldquo;{sub.teacherRemark}&rdquo;</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Tab: Official Scanned Terminal Report Card */}
                  {parentSubTab === 'reports' && (
                    <div className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-3xl space-y-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                        <div>
                          <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-amber-400 uppercase tracking-widest bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20 mb-2">
                            <Award className="w-3.5 h-3.5 text-amber-400" />
                            <span>Official Examination Document</span>
                          </div>
                          <h4 className="font-bold text-white text-xl font-serif">
                            Scanned Terminal Report Card • Term 1, 2026
                          </h4>
                          <p className="text-xs text-slate-400 mt-1">
                            Indexed to Admission No: <strong className="text-amber-300 font-mono">{activeStudent.admNo}</strong> • Verified by Class Teacher
                          </p>
                        </div>

                        <div className="flex items-center space-x-2">
                          <button
                            type="button"
                            onClick={() => {
                              const rep: ScannedReportCard = activeStudent.reportCards?.[0] || {
                                id: `rep-${activeStudent.admNo}`,
                                studentAdmNo: activeStudent.admNo,
                                studentName: `${activeStudent.firstName} ${activeStudent.lastName}`,
                                parentPhone: activeStudent.parentPhone,
                                formLevel: activeStudent.formLevel,
                                stream: activeStudent.stream,
                                term: 1,
                                year: 2026,
                                meanGrade: activeStudent.academicRecords[0]?.meanGrade || 'B+',
                                meanPoints: 72,
                                classRank: activeStudent.academicRecords[0]?.rank || 4,
                                totalStudents: activeStudent.academicRecords[0]?.totalClass || 48,
                                fileName: `Kiarithaini_Report_Adm${activeStudent.admNo}.pdf`,
                                fileSize: '1.8 MB (Verified Scan)',
                                uploadedAt: '23 Oct 2026',
                                uploadedByTeacher: 'Class Teacher',
                                status: 'VERIFIED',
                                teacherRemarks: activeStudent.academicRecords[0]?.classTeacherRemark || 'Dedicated student with sharp intuition in sciences.',
                                principalRemarks: activeStudent.academicRecords[0]?.principalRemark || 'Consistent leadership and disciplined character.',
                                subjectsSummary: activeStudent.academicRecords[0]?.subjects.map((s) => ({
                                  name: s.name,
                                  score: s.score,
                                  grade: s.grade,
                                })) || [],
                              };
                              setActiveReportModal(rep);
                            }}
                            className="bg-amber-400 hover:bg-amber-300 text-slate-950 px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-md transition"
                          >
                            <Eye className="w-4 h-4" />
                            <span>View Full Stamped Report</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => window.print()}
                            className="bg-slate-800 hover:bg-slate-700 text-white px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-700 flex items-center space-x-1.5 transition"
                          >
                            <Printer className="w-3.5 h-3.5 text-slate-300" />
                            <span>Print</span>
                          </button>
                        </div>
                      </div>

                      {/* Certificate & Summary Card */}
                      <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
                          <div>
                            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
                              Student Name &amp; Stream
                            </span>
                            <span className="text-lg font-bold text-white font-serif">
                              {activeStudent.firstName} {activeStudent.lastName}
                            </span>
                            <span className="text-xs text-amber-300 font-mono block mt-0.5">
                              Adm: {activeStudent.admNo} • Form {activeStudent.formLevel} {activeStudent.stream}
                            </span>
                          </div>

                          <div className="flex items-center space-x-3 bg-slate-900 p-3 rounded-xl border border-slate-800">
                            <div className="text-right">
                              <span className="text-[10px] text-slate-400 uppercase font-bold block">Mean Grade</span>
                              <span className="text-xl font-black font-mono text-emerald-400">
                                {activeStudent.academicRecords[0]?.meanGrade || 'B+'}
                              </span>
                            </div>
                            <div className="h-8 w-[1px] bg-slate-700"></div>
                            <div>
                              <span className="text-[10px] text-slate-400 uppercase font-bold block">Class Position</span>
                              <span className="text-sm font-bold text-white font-mono">
                                {activeStudent.academicRecords[0]?.rank || 4} of {activeStudent.academicRecords[0]?.totalClass || 48}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Remarks Preview */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                          <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                              Class Teacher Remarks
                            </span>
                            <p className="text-slate-300 italic">
                              &ldquo;{activeStudent.academicRecords[0]?.classTeacherRemark}&rdquo;
                            </p>
                          </div>

                          <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                              Principal&apos;s Stamped Endorsement
                            </span>
                            <p className="text-slate-300 italic">
                              &ldquo;{activeStudent.academicRecords[0]?.principalRemark}&rdquo;
                            </p>
                            <span className="text-[10px] text-amber-400 block mt-1 font-semibold">
                              Signed: Chief Principal Thiong&apos;O John James
                            </span>
                          </div>
                        </div>

                        <div className="pt-2 flex items-center justify-between text-xs text-slate-400">
                          <div className="flex items-center space-x-1.5">
                            <CheckCircle className="w-4 h-4 text-emerald-400" />
                            <span>Digital Scan Verified • Tied to Registered Mobile (+{activeStudent.parentPhone})</span>
                          </div>
                          <span className="text-[11px] font-mono text-slate-500">
                            Status: Official Terminal Archive
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Tab 3: Student Payment History */}
                  {parentSubTab === 'ledger' && (
                    <div className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-3xl space-y-6">
                      <h4 className="font-bold text-white text-base font-serif">
                        Student M-Pesa Payment History for Adm: {activeStudent.admNo}
                      </h4>

                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-slate-300">
                          <thead className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800">
                            <tr>
                              <th className="p-3">Receipt Ref</th>
                              <th className="p-3">Category</th>
                              <th className="p-3 text-right">Amount</th>
                              <th className="p-3">Channel</th>
                              <th className="p-3">Date</th>
                              <th className="p-3">Status</th>
                              <th className="p-3 text-center">Clearance Slip</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800 font-sans">
                            {transactions
                              .filter((t) => t.studentAdmNo === activeStudent.admNo)
                              .map((tx) => (
                                <tr key={tx.id} className="hover:bg-slate-800/40 transition">
                                  <td className="p-3 font-mono font-bold text-amber-400">
                                    {tx.mpesaReceipt}
                                  </td>
                                  <td className="p-3 font-medium">
                                    {tx.paymentType === 'POCKET_MONEY'
                                      ? 'Pocket Money (PKT)'
                                      : 'Tuition Fees'}
                                  </td>
                                  <td className="p-3 text-right font-mono font-bold text-white">
                                    KES {tx.amount.toLocaleString()}
                                  </td>
                                  <td className="p-3 text-slate-400 font-mono">
                                    {tx.channel}
                                  </td>
                                  <td className="p-3 text-slate-400">
                                    {new Date(tx.createdAt).toLocaleDateString()}
                                  </td>
                                  <td className="p-3">
                                    <span className="text-emerald-400 font-bold">
                                      ✓ {tx.status}
                                    </span>
                                  </td>
                                  <td className="p-3 text-center">
                                    <button
                                      onClick={() => setActiveReceiptModal({ tx, student: activeStudent })}
                                      className="px-2.5 py-1 bg-forest-800 hover:bg-forest-700 text-white rounded text-[11px] font-semibold transition"
                                    >
                                      Download Slip &darr;
                                    </button>
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                </div>
              )}

            </section>

            {/* Kenya Data Protection Act Notice */}
            <section className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div className="max-w-3xl">
                  <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-forest-800 uppercase tracking-widest mb-2">
                    <Shield className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Data Protection & Privacy Notice</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold font-serif text-slate-900">
                    Statutory Governance under Kenya Data Protection Act (2019)
                  </h3>
                  <p className="text-slate-600 text-xs sm:text-sm mt-3 leading-relaxed">
                    We keep exam results, behaviour records, and fee payments for your son so we can run the school and report directly to you. Only you and authorized school academic staff can access these records.
                  </p>
                  <p className="text-slate-600 text-xs sm:text-sm mt-2 leading-relaxed">
                    Under the Kenya Data Protection Act (2019), you have the right to inspect, correct, or request clarification on stored personal student data.
                  </p>

                  <div className="mt-4">
                    <button
                      onClick={() => setPrivacyModalOpen(true)}
                      className="inline-flex items-center space-x-1 text-xs text-forest-800 hover:text-forest-900 font-bold underline"
                    >
                      <span>View Full KDPA Privacy Notice & Submit Data Subject Request &rarr;</span>
                    </button>
                  </div>
                </div>

                <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl min-w-[280px]">
                  <span className="text-[11px] text-slate-500 uppercase tracking-wider block font-bold mb-1">
                    Data Protection Officer (DPO)
                  </span>
                  <span className="text-sm font-bold text-slate-900 block">
                    Office of Deputy Principal
                  </span>
                  <span className="text-xs text-slate-600 mt-1 block">
                    Kiarithaini Boys High School, Nyeri County
                  </span>
                  <span className="text-xs text-forest-800 font-mono mt-2 block font-semibold">
                    dpo@kiarithainiboys.ac.ke
                  </span>
                </div>
              </div>
            </section>

          </main>
        </>
      )}

      {/* Footer */}
      <footer className="bg-forest-950 text-slate-300 pt-16 pb-12 border-t border-forest-900 text-xs sm:text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-xl bg-white/10 text-amber-400 font-serif font-black text-xl flex items-center justify-center border border-amber-400/30">
                K
              </div>
              <div>
                <span className="text-lg font-bold text-white font-serif block">
                  Kiarithaini Boys High School
                </span>
                <span className="text-xs text-amber-400 italic font-serif">
                  Motto: &quot;Strive to Excel&quot;
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              Fostering academic excellence, moral discipline, and spiritual growth on the serene slopes of Mount Kenya, Nyeri County.
            </p>

            <div className="text-[11px] text-slate-400 font-mono">
              KNEC Institution Center Code: 20400000 • Safaricom Paybill: 174379
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">
              Quick Navigation
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => { setActiveTab('portal_public'); document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-amber-400 transition">
                  About the School
                </button>
              </li>
              <li>
                <button onClick={() => { setActiveTab('portal_public'); document.getElementById('quick-pay')?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-amber-400 transition">
                  Lipa na M-Pesa Instructions
                </button>
              </li>
              <li>
                <button onClick={() => { setActiveTab('portal_public'); document.getElementById('elibrary')?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-amber-400 transition">
                  E-Library Past Papers
                </button>
              </li>
              <li>
                <button onClick={() => { setActiveTab('portal_public'); document.getElementById('parent-portal')?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-amber-400 transition">
                  Parent Portal Login
                </button>
              </li>
              <li>
                <button onClick={() => { setActiveTab('bursar'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-amber-400 transition">
                  Bursar Finance Console
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">
              Institutional Administration
            </h4>
            <div className="text-xs text-slate-400 leading-relaxed space-y-1.5">
              <p>
                <span className="text-slate-300 font-semibold">Principal:</span>{' '}
                <strong className="text-white">Thiong&apos;O John James</strong>
              </p>
              <p>
                <span className="text-slate-300 font-semibold">Location:</span> Mathira East Sub-County, Nyeri County
              </p>
              <p>
                <span className="text-slate-300 font-semibold">Phone:</span>{' '}
                <a href="tel:0722377082" className="text-amber-400 font-mono font-bold hover:underline">
                  0722377082
                </a>
              </p>
              <p>
                <span className="text-slate-300 font-semibold">Email:</span>{' '}
                <a href="mailto:kiarithainiboys@yahoo.com" className="text-amber-400 hover:underline">
                  kiarithainiboys@yahoo.com
                </a>
              </p>
              <p className="pt-1 border-t border-forest-900 text-[11px]">
                <span className="text-slate-300 font-semibold">Co-op Bank A/C:</span>{' '}
                <code className="text-amber-300 font-mono font-bold">01129059715100</code>{' '}
                <span className="text-slate-400">(Code: 707)</span>
              </p>
              <p className="text-[11px] text-slate-400">
                County Boarding Boys • 657 Students Enrolled
              </p>
            </div>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-forest-900 pt-6 text-xs text-slate-500 flex flex-wrap justify-between items-center gap-4">
          <p>
            &copy; {new Date().getFullYear()} Kiarithaini Boys High School, Nyeri County. All Rights Reserved.
          </p>
          <p className="text-[11px]">
            Integrated with Safaricom Daraja API & Africa&apos;s Talking SMS Gateway.
          </p>
        </div>
      </footer>

      {/* Modal: STK Push Simulator */}
      {stkModalOpen && activeStudent && (
        <StkPushSimulatorModal
          student={activeStudent}
          amount={Number(stkAmount) || 1000}
          purpose={stkPurpose}
          phone={activeStudent.parentPhone}
          onSuccess={handleStkSuccess}
          onClose={() => setStkModalOpen(false)}
        />
      )}

      {/* Modal: Official Stamped Clearance Receipt */}
      {activeReceiptModal && (
        <OfficialReceiptModal
          transaction={activeReceiptModal.tx}
          student={activeReceiptModal.student}
          onClose={() => setActiveReceiptModal(null)}
        />
      )}

      {/* Modal: E-Library Preview */}
      {previewResource && (
        <LibraryPreviewModal
          resource={previewResource}
          onClose={() => setPreviewResource(null)}
          onDownload={(res) => {
            setPreviewResource(null);
            handleDownloadResource(res);
          }}
        />
      )}

      {/* Modal: Teacher Resource Upload */}
      {showUploadModal && (
        <TeacherUploadModal
          onClose={() => setShowUploadModal(false)}
          onAddResource={(newRes) => {
            setLibraryResources((prev) => [newRes, ...prev]);
            setDownloadToast(`Resource "${newRes.title}" published to E-Library!`);
            setTimeout(() => setDownloadToast(null), 3500);
          }}
        />
      )}

      {/* Modal: KDPA Privacy Notice */}
      <PrivacyNoticeModal
        isOpen={privacyModalOpen}
        onClose={() => setPrivacyModalOpen(false)}
      />

      {/* Modal: Official Scanned Terminal Report Card */}
      {activeReportModal && (
        <ScannedReportModal
          report={activeReportModal}
          student={students.find((s) => s.admNo === activeReportModal.studentAdmNo)}
          onClose={() => setActiveReportModal(null)}
        />
      )}

    </div>
  );
}
