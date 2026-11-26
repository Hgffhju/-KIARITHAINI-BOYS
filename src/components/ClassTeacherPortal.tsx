import React, { useState } from 'react';
import { Student, ScannedReportCard } from '../types';
import {
  Scan,
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  Smartphone,
  Eye,
  Download,
  Filter,
  Search,
  Check,
  Calendar,
  Award,
  Layers,
  Sparkles,
  Database,
  ArrowRight,
  Send,
  RefreshCw,
  Clock,
  Printer,
  ChevronRight,
  Shield,
  FileSpreadsheet
} from 'lucide-react';
import { ScannedReportModal } from './ScannedReportModal';

interface ClassTeacherPortalProps {
  students: Student[];
  onUpdateStudents: (updatedStudents: Student[]) => void;
  onOpenReportModal?: (report: ScannedReportCard) => void;
}

interface TeacherAssignment {
  form: number;
  stream: string;
  teacherName: string;
  department: string;
  studentsCount: number;
}

const TEACHER_ASSIGNMENTS: TeacherAssignment[] = [
  { form: 1, stream: 'South', teacherName: 'Mrs. M. Wambui', department: 'Languages', studentsCount: 52 },
  { form: 1, stream: 'East', teacherName: 'Mr. J. Kariuki', department: 'Humanities', studentsCount: 54 },
  { form: 2, stream: 'North', teacherName: 'Mr. P. Ndegwa', department: 'Mathematics', studentsCount: 46 },
  { form: 2, stream: 'East', teacherName: 'Mrs. A. Gathoni', department: 'Sciences', studentsCount: 48 },
  { form: 3, stream: 'East', teacherName: 'Mr. S. Nderitu', department: 'Sciences & Physics', studentsCount: 48 },
  { form: 3, stream: 'West', teacherName: 'Mr. D. Maina', department: 'Technical', studentsCount: 50 },
  { form: 4, stream: 'West', teacherName: 'Mr. C. Murage', department: 'Deputy Principal Academics', studentsCount: 50 },
  { form: 4, stream: 'East', teacherName: 'Mrs. E. Nyokabi', department: 'Humanities', studentsCount: 49 },
];

export const ClassTeacherPortal: React.FC<ClassTeacherPortalProps> = ({
  students,
  onUpdateStudents,
}) => {
  // Active Form & Stream
  const [selectedForm, setSelectedForm] = useState<number>(3);
  const [selectedStream, setSelectedStream] = useState<string>('East');
  const [selectedTerm, setSelectedTerm] = useState<number>(1);
  const [selectedYear] = useState<number>(2026);

  // Active view tab inside portal
  const [activeWorkflowTab, setActiveWorkflowTab] = useState<'scanner' | 'roster' | 'broadsheet' | 'architecture'>('scanner');

  // Scanner State
  const [scanFile, setScanFile] = useState<File | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState<string>('');
  const [scanProgress, setScanProgress] = useState(0);

  // Extracted Report Card Data (editable after OCR scan)
  const [extractedAdm, setExtractedAdm] = useState('4521');
  const [matchedStudent, setMatchedStudent] = useState<Student | null>(null);
  const [extractedGrade, setExtractedGrade] = useState('B+');
  const [extractedPoints, setExtractedPoints] = useState('72');
  const [extractedRank, setExtractedRank] = useState('4');
  const [extractedTotalClass, setExtractedTotalClass] = useState('48');
  const [extractedTeacherRemark, setExtractedTeacherRemark] = useState(
    'Dedicated student with sharp intuition in sciences and mathematics. High potential for KCSE A plain.'
  );
  const [extractedPrincipalRemark, setExtractedPrincipalRemark] = useState(
    'Consistent leadership, disciplined moral conduct, and academic excellence.'
  );
  const [extractedConduct, setExtractedConduct] = useState('Exemplary');
  const [isSavedSuccessfully, setIsSavedSuccessfully] = useState(false);
  const [smsNotificationToast, setSmsNotificationToast] = useState<string | null>(null);

  // Modal State for viewing report card
  const [viewingReport, setViewingReport] = useState<ScannedReportCard | null>(null);

  // Filter students by selected stream
  const streamStudents = students.filter(
    (s) => s.formLevel === selectedForm && s.stream.toLowerCase() === selectedStream.toLowerCase()
  );

  // Current assigned teacher
  const currentAssignment = TEACHER_ASSIGNMENTS.find(
    (t) => t.form === selectedForm && t.stream.toLowerCase() === selectedStream.toLowerCase()
  ) || {
    form: selectedForm,
    stream: selectedStream,
    teacherName: 'Staff Class Teacher',
    department: 'Academics',
    studentsCount: streamStudents.length || 45,
  };

  // Simulate High-Speed OCR & QR Scanner Process
  const handleStartScanner = (sampleAdm: string = '4521') => {
    setIsScanning(true);
    setIsSavedSuccessfully(false);
    setScanProgress(10);
    setScanStep('Initializing high-resolution OCR scanner...');

    setTimeout(() => {
      setScanProgress(35);
      setScanStep('Detecting KNEC QR Code & Barcode on report header...');
    }, 600);

    setTimeout(() => {
      setScanProgress(65);
      setScanStep(`Decoded Student Admission No: [${sampleAdm}]`);
      setExtractedAdm(sampleAdm);

      // Find student in registry
      const student = students.find((s) => s.admNo === sampleAdm) || students[0];
      setMatchedStudent(student);

      if (sampleAdm === '4521') {
        setExtractedGrade('B+');
        setExtractedPoints('72');
        setExtractedRank('4');
        setExtractedTotalClass('48');
        setExtractedTeacherRemark('Dedicated student with sharp intuition in sciences and mathematics.');
      } else if (sampleAdm === '4810') {
        setExtractedGrade('A-');
        setExtractedPoints('78');
        setExtractedRank('1');
        setExtractedTotalClass('50');
        setExtractedTeacherRemark('Exceptional work ethic. Consistently tops the class in KCSE trial papers.');
      }
    }, 1200);

    setTimeout(() => {
      setScanProgress(90);
      setScanStep('Matching registered parent telephone & academic records in registry...');
    }, 1800);

    setTimeout(() => {
      setScanProgress(100);
      setIsScanning(false);
      setScanStep('Extraction Complete! Verified against Kiarithaini High database.');
    }, 2200);
  };

  // Save Scanned Report and Pair with Student Record & Parent Phone
  const handleSaveAndIndexReport = () => {
    const student = matchedStudent || students.find((s) => s.admNo === extractedAdm) || students[0];

    const newReport: ScannedReportCard = {
      id: `rep-${Date.now()}`,
      studentAdmNo: student.admNo,
      studentName: `${student.firstName} ${student.lastName}`,
      parentPhone: student.parentPhone,
      formLevel: student.formLevel,
      stream: student.stream,
      term: selectedTerm,
      year: selectedYear,
      meanGrade: extractedGrade,
      meanPoints: Number(extractedPoints) || 72,
      classRank: Number(extractedRank) || 4,
      totalStudents: Number(extractedTotalClass) || 48,
      fileName: `Kiarithaini_Report_Adm${student.admNo}_Term${selectedTerm}_${selectedYear}.pdf`,
      fileSize: '1.8 MB (Scanned PDF)',
      uploadedAt: new Date().toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' }),
      uploadedByTeacher: `${currentAssignment.teacherName} (Class Teacher)`,
      status: 'VERIFIED',
      teacherRemarks: extractedTeacherRemark,
      principalRemarks: extractedPrincipalRemark,
      subjectsSummary: student.academicRecords[0]?.subjects.map((s) => ({
        name: s.name,
        score: s.score,
        grade: s.grade,
      })) || [],
    };

    // Update students array in parent state
    const updated = students.map((s) => {
      if (s.admNo === student.admNo) {
        const existingReports = s.reportCards || [];
        // Replace or add
        const filtered = existingReports.filter(
          (r) => !(r.term === selectedTerm && r.year === selectedYear)
        );
        return {
          ...s,
          reportCards: [newReport, ...filtered],
          academicRecords: [
            {
              term: selectedTerm,
              year: selectedYear,
              meanGrade: extractedGrade,
              rank: Number(extractedRank) || 4,
              totalClass: Number(extractedTotalClass) || 48,
              conduct: extractedConduct,
              attendance: 100,
              classTeacherRemark: extractedTeacherRemark,
              principalRemark: extractedPrincipalRemark,
              subjects: s.academicRecords[0]?.subjects || [],
            },
            ...s.academicRecords.slice(1),
          ],
        };
      }
      return s;
    });

    onUpdateStudents(updated);
    setIsSavedSuccessfully(true);

    // Simulated SMS Dispatch via Africa's Talking
    setSmsNotificationToast(
      `SMS sent to ${student.parentName} (+${student.parentPhone}): "Dear Parent, ${student.firstName}'s Term ${selectedTerm} report card is ready. Mean: ${extractedGrade} (Rank ${extractedRank}/${extractedTotalClass}). Check Kiarithaini Parent Portal."`
    );

    setTimeout(() => {
      setSmsNotificationToast(null);
    }, 6000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Top Banner & Context Header */}
      <div className="bg-gradient-to-r from-forest-950 via-forest-900 to-slate-900 rounded-3xl p-6 sm:p-10 text-white border border-forest-800 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 transform translate-x-10 -translate-y-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 border border-amber-400/20 px-3 py-1 rounded-full mb-3">
              <Scan className="w-3.5 h-3.5" />
              <span>Kiarithaini High School Academic Registry • Class Teacher CMS</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-serif font-black text-white">
              Student Report Card Scanner &amp; Upload Hub
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              Class teachers can scan physical report forms or upload stream broadsheets. Reports are automatically parsed, indexed by <strong>Admission Number</strong>, paired with <strong>Registered Parent Phone Numbers</strong>, and dispatched straight to the Parent Portal.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-3 shrink-0">
            <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-300 block">Class Teacher</span>
              <span className="text-sm font-bold text-amber-300 font-serif block mt-0.5">
                {currentAssignment.teacherName}
              </span>
              <span className="text-[10px] text-slate-400">Form {selectedForm} {selectedStream}</span>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-300 block">School Principal</span>
              <span className="text-sm font-bold text-white font-serif block mt-0.5">
                Thiong&apos;O John James
              </span>
              <span className="text-[10px] text-emerald-400">Mathira East, Nyeri</span>
            </div>
          </div>
        </div>

        {/* Stream & Term Filter Bar */}
        <div className="mt-8 pt-6 border-t border-white/15 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          
          {/* Form Level */}
          <div>
            <label className="block text-[11px] uppercase font-bold text-slate-300 mb-1.5">
              Select Form Level
            </label>
            <select
              value={selectedForm}
              onChange={(e) => setSelectedForm(Number(e.target.value))}
              className="w-full bg-slate-900 border border-white/20 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-amber-400"
            >
              <option value={1}>Form 1 (Junior Class)</option>
              <option value={2}>Form 2 (Intermediate)</option>
              <option value={3}>Form 3 (Senior Sciences/Arts)</option>
              <option value={4}>Form 4 (KCSE Candidates)</option>
            </select>
          </div>

          {/* Stream */}
          <div>
            <label className="block text-[11px] uppercase font-bold text-slate-300 mb-1.5">
              Select Stream
            </label>
            <select
              value={selectedStream}
              onChange={(e) => setSelectedStream(e.target.value)}
              className="w-full bg-slate-900 border border-white/20 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-amber-400"
            >
              <option value="East">East Stream</option>
              <option value="West">West Stream</option>
              <option value="North">North Stream</option>
              <option value="South">South Stream</option>
            </select>
          </div>

          {/* Academic Term */}
          <div>
            <label className="block text-[11px] uppercase font-bold text-slate-300 mb-1.5">
              Academic Term
            </label>
            <select
              value={selectedTerm}
              onChange={(e) => setSelectedTerm(Number(e.target.value))}
              className="w-full bg-slate-900 border border-white/20 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-amber-400"
            >
              <option value={1}>Term 1, 2026 (Jan - April)</option>
              <option value={2}>Term 2, 2026 (May - August)</option>
              <option value={3}>Term 3, 2026 (Sept - Nov)</option>
            </select>
          </div>

          {/* Stream Stats Pill */}
          <div className="flex flex-col justify-end">
            <div className="bg-amber-400/10 border border-amber-400/30 p-2 rounded-xl text-center">
              <span className="text-[11px] text-amber-200 block">
                Stream Enrolled: <strong>{streamStudents.length > 0 ? streamStudents.length : 48} Boys</strong>
              </span>
              <span className="text-[10px] text-slate-300">
                Teacher: {currentAssignment.teacherName}
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* Workflow Navigation Subtabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveWorkflowTab('scanner')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition ${
              activeWorkflowTab === 'scanner'
                ? 'bg-forest-900 text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Scan className="w-4 h-4 text-amber-400" />
            <span>1. Scan Physical Report (OCR &amp; QR)</span>
          </button>

          <button
            onClick={() => setActiveWorkflowTab('roster')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition ${
              activeWorkflowTab === 'roster'
                ? 'bg-forest-900 text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Layers className="w-4 h-4 text-emerald-400" />
            <span>2. Form {selectedForm} {selectedStream} Roster &amp; Vault</span>
          </button>

          <button
            onClick={() => setActiveWorkflowTab('broadsheet')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition ${
              activeWorkflowTab === 'broadsheet'
                ? 'bg-forest-900 text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4 text-blue-400" />
            <span>3. Batch Broadsheet CSV Import</span>
          </button>
        </div>

        <button
          onClick={() => setActiveWorkflowTab('architecture')}
          className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition border ${
            activeWorkflowTab === 'architecture'
              ? 'bg-amber-500 text-slate-950 border-amber-500 font-bold'
              : 'bg-slate-50 text-slate-600 border-slate-300 hover:bg-slate-100'
          }`}
        >
          <Database className="w-3.5 h-3.5 text-forest-800" />
          <span>Technical Architecture &amp; Database Flow</span>
        </button>
      </div>

      {/* Toast Alert for Dispatched SMS */}
      {smsNotificationToast && (
        <div className="p-4 bg-emerald-900 text-white rounded-2xl shadow-xl border border-emerald-500 flex items-start justify-between gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-start space-x-3">
            <Smartphone className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-xs uppercase font-bold text-emerald-300 block">
                Africa&apos;s Talking SMS Gateway Dispatched
              </span>
              <p className="text-xs text-white mt-0.5">{smsNotificationToast}</p>
            </div>
          </div>
          <button
            onClick={() => setSmsNotificationToast(null)}
            className="text-emerald-300 hover:text-white text-xs font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* WORKFLOW 1: Physical Paper Scanner & OCR Auto-Matcher */}
      {activeWorkflowTab === 'scanner' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Drag & Drop Scanner Input */}
          <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div>
              <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-forest-800 uppercase tracking-widest bg-forest-50 px-3 py-1 rounded-full mb-2">
                <Scan className="w-3.5 h-3.5 text-emerald-600" />
                <span>Document Ingestion</span>
              </div>
              <h3 className="text-xl font-bold font-serif text-slate-900">
                Scan or Upload Paper Report
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Scan the signed terminal report form from your feeder scanner or snap a high-resolution photo with your smartphone.
              </p>
            </div>

            {/* Dropzone Area */}
            <div className="border-2 border-dashed border-slate-300 hover:border-forest-800 rounded-3xl p-8 text-center bg-slate-50/60 transition group cursor-pointer relative">
              <input
                type="file"
                accept="image/*,application/pdf"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setScanFile(e.target.files[0]);
                    handleStartScanner('4521');
                  }
                }}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />

              <div className="w-16 h-16 rounded-2xl bg-white shadow-sm border border-slate-200 flex items-center justify-center mx-auto text-forest-800 group-hover:scale-105 transition">
                <Upload className="w-8 h-8 text-forest-800" />
              </div>

              <h4 className="text-sm font-bold text-slate-900 mt-4">
                Drag &amp; drop physical report scan here
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Supports PDF, JPG, PNG, or Camera Scan (Up to 15MB)
              </p>

              <div className="mt-4">
                <span className="inline-block bg-forest-900 text-white text-xs font-semibold px-4 py-2 rounded-xl group-hover:bg-forest-800 transition">
                  Browse Document
                </span>
              </div>
            </div>

            {/* Quick Demo Pre-load buttons */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <span className="text-[11px] uppercase font-bold text-slate-500 tracking-wider block">
                Quick Demo: Test Automated OCR Recognition
              </span>
              <p className="text-xs text-slate-600">
                Click one of our enrolled Kiarithaini students to test instant document parsing and parent phone mapping:
              </p>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => handleStartScanner('4521')}
                  className="px-3 py-2 bg-white hover:bg-forest-50 border border-slate-200 hover:border-forest-600 rounded-xl text-left transition"
                >
                  <span className="text-xs font-bold text-slate-900 block">Amos Kiprono</span>
                  <span className="text-[10px] text-slate-500 font-mono">Adm: 4521 • Form 3 East</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleStartScanner('4810')}
                  className="px-3 py-2 bg-white hover:bg-forest-50 border border-slate-200 hover:border-forest-600 rounded-xl text-left transition"
                >
                  <span className="text-xs font-bold text-slate-900 block">Brian Mwangi</span>
                  <span className="text-[10px] text-slate-500 font-mono">Adm: 4810 • Form 4 West</span>
                </button>
              </div>
            </div>

            {/* Progress / Step Indicator */}
            {isScanning && (
              <div className="p-4 bg-forest-950 text-white rounded-2xl space-y-3 animate-in fade-in duration-200">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-amber-400 font-bold flex items-center space-x-1.5">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Optical Character Recognition Engine</span>
                  </span>
                  <span className="font-mono">{scanProgress}%</span>
                </div>

                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-amber-400 h-full transition-all duration-300"
                    style={{ width: `${scanProgress}%` }}
                  ></div>
                </div>

                <p className="text-xs text-slate-300 font-mono">{scanStep}</p>
              </div>
            )}

          </div>

          {/* Right Column: OCR Extraction Review & Database Indexing Preview */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-2.5 py-0.5 rounded-md">
                  Extracted Data Validation &amp; Verification
                </span>
                <h3 className="text-xl font-bold font-serif text-slate-900 mt-1">
                  Report Indexing Parameters
                </h3>
              </div>

              {matchedStudent && (
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Registry Status</span>
                  <span className="text-xs font-bold text-emerald-600 inline-flex items-center space-x-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Student Confirmed</span>
                  </span>
                </div>
              )}
            </div>

            {/* Key Pair Parameters: Admission No & Parent Phone */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Admission Number */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    1. Student Admission Number (Primary Key)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={extractedAdm}
                      onChange={(e) => {
                        const val = e.target.value;
                        setExtractedAdm(val);
                        const match = students.find((s) => s.admNo === val);
                        if (match) setMatchedStudent(match);
                      }}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-base font-mono font-bold text-forest-900 focus:outline-none focus:border-forest-800"
                    />
                    <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-mono">
                      auto-parsed
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    OCR detected from report form header barcode / text.
                  </span>
                </div>

                {/* Parent Phone Number */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    2. Paired Parent Phone Number (Access Key)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      readOnly
                      value={matchedStudent ? `+${matchedStudent.parentPhone} (${matchedStudent.parentName})` : '+254700000001 (Mzee Kiprono)'}
                      className="w-full bg-slate-100 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-mono font-semibold text-slate-800 cursor-not-allowed"
                    />
                    <Smartphone className="w-4 h-4 text-emerald-600 absolute right-3 top-3" />
                  </div>
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    Linked automatically via the School Administration Registry.
                  </span>
                </div>

              </div>

              {/* Matched Student Identity Card */}
              {matchedStudent && (
                <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-emerald-800 font-bold uppercase tracking-wider block">
                      Enrolled Student Identity
                    </span>
                    <span className="text-sm font-bold text-emerald-950 font-serif">
                      {matchedStudent.firstName} {matchedStudent.lastName}
                    </span>
                    <span className="text-[11px] text-emerald-800 block">
                      Form {matchedStudent.formLevel} {matchedStudent.stream} • House: {matchedStudent.house} • Fee Balance: KES {matchedStudent.feeBalance.toLocaleString()}
                    </span>
                  </div>
                  <span className="text-xs bg-white text-emerald-800 font-bold px-3 py-1.5 rounded-lg border border-emerald-300 shadow-2xs">
                    Ready to Index
                  </span>
                </div>
              )}
            </div>

            {/* Academic Evaluation Fields */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Mean Grade
                </label>
                <input
                  type="text"
                  value={extractedGrade}
                  onChange={(e) => setExtractedGrade(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm font-bold text-center text-forest-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Mean Points
                </label>
                <input
                  type="text"
                  value={extractedPoints}
                  onChange={(e) => setExtractedPoints(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm font-bold text-center text-slate-900 font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Stream Position
                </label>
                <input
                  type="text"
                  value={extractedRank}
                  onChange={(e) => setExtractedRank(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm font-bold text-center text-slate-900 font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Total in Class
                </label>
                <input
                  type="text"
                  value={extractedTotalClass}
                  onChange={(e) => setExtractedTotalClass(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm font-bold text-center text-slate-900 font-mono"
                />
              </div>
            </div>

            {/* Remarks */}
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Class Teacher Remark ({currentAssignment.teacherName})
                </label>
                <textarea
                  rows={2}
                  value={extractedTeacherRemark}
                  onChange={(e) => setExtractedTeacherRemark(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:border-forest-800"
                ></textarea>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Principal&apos;s Stamped Endorsement (Thiong&apos;O John James)
                </label>
                <textarea
                  rows={2}
                  value={extractedPrincipalRemark}
                  onChange={(e) => setExtractedPrincipalRemark(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:border-forest-800"
                ></textarea>
              </div>
            </div>

            {/* Save & Action Buttons */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleSaveAndIndexReport}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-6 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-md transition"
              >
                <Check className="w-4 h-4" />
                <span>Save &amp; Index to Student Database</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const student = matchedStudent || students[0];
                  setViewingReport({
                    id: 'temp-preview',
                    studentAdmNo: student.admNo,
                    studentName: `${student.firstName} ${student.lastName}`,
                    parentPhone: student.parentPhone,
                    formLevel: student.formLevel,
                    stream: student.stream,
                    term: selectedTerm,
                    year: selectedYear,
                    meanGrade: extractedGrade,
                    meanPoints: Number(extractedPoints) || 72,
                    classRank: Number(extractedRank) || 4,
                    totalStudents: Number(extractedTotalClass) || 48,
                    fileName: `Report_Adm${student.admNo}.pdf`,
                    fileSize: '1.8 MB',
                    uploadedAt: new Date().toLocaleDateString(),
                    uploadedByTeacher: currentAssignment.teacherName,
                    status: 'VERIFIED',
                    teacherRemarks: extractedTeacherRemark,
                    principalRemarks: extractedPrincipalRemark,
                    subjectsSummary: student.academicRecords[0]?.subjects.map((s) => ({
                      name: s.name,
                      score: s.score,
                      grade: s.grade,
                    })),
                  });
                }}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center space-x-1.5 transition"
              >
                <Eye className="w-4 h-4" />
                <span>Preview Stamped Report Slip</span>
              </button>
            </div>

            {isSavedSuccessfully && (
              <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center space-x-3 text-xs text-emerald-900">
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <strong>Successfully Saved!</strong> Report card linked to Admission No. <strong>{extractedAdm}</strong>. Parent can now view and download it immediately in the Parent Portal using phone <strong>+{matchedStudent?.parentPhone || '254700000001'}</strong>.
                </div>
              </div>
            )}

          </div>

        </div>
      )}

      {/* WORKFLOW 2: Class Stream Student Roster & Vault */}
      {activeWorkflowTab === 'roster' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <span className="text-[11px] font-bold text-forest-800 uppercase tracking-widest bg-forest-50 px-3 py-1 rounded-full">
                Form {selectedForm} {selectedStream} Academic Roster
              </span>
              <h3 className="text-xl sm:text-2xl font-bold font-serif text-slate-900 mt-2">
                Class Stream Student Report Status
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                Class Teacher: <strong>{currentAssignment.teacherName}</strong> • {currentAssignment.department} Department
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-xs text-slate-500">
                Term {selectedTerm}, {selectedYear}
              </span>
              <button
                onClick={() => {
                  // Simulate fast batch upload
                  handleStartScanner('4521');
                  setActiveWorkflowTab('scanner');
                }}
                className="bg-forest-900 hover:bg-forest-800 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center space-x-1.5 shadow-sm transition"
              >
                <Scan className="w-3.5 h-3.5 text-amber-400" />
                <span>Scan Student Report</span>
              </button>
            </div>
          </div>

          {/* Roster Table */}
          <div className="overflow-x-auto border border-slate-200 rounded-2xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase font-semibold text-[11px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Adm No.</th>
                  <th className="py-3 px-4">Student Name</th>
                  <th className="py-3 px-4">Registered Parent Phone</th>
                  <th className="py-3 px-4 text-center">Mean Grade</th>
                  <th className="py-3 px-4 text-center">Stream Rank</th>
                  <th className="py-3 px-4">Scanned Report Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {streamStudents.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400">
                      No students directly mapped to Form {selectedForm} {selectedStream} in current sample view. Select <strong>Form 3 East</strong> or <strong>Form 4 West</strong> for full rosters.
                    </td>
                  </tr>
                ) : (
                  streamStudents.map((student) => {
                    const hasReport = (student.reportCards && student.reportCards.length > 0) || student.academicRecords.length > 0;
                    const latestReport = student.reportCards?.[0];
                    const grade = latestReport?.meanGrade || student.academicRecords[0]?.meanGrade || 'B+';
                    const rank = latestReport?.classRank || student.academicRecords[0]?.rank || 4;
                    const total = latestReport?.totalStudents || student.academicRecords[0]?.totalClass || 48;

                    return (
                      <tr key={student.admNo} className="hover:bg-slate-50/80 transition">
                        <td className="py-3 px-4 font-mono font-bold text-forest-900">
                          {student.admNo}
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-bold text-slate-900 block">
                            {student.firstName} {student.lastName}
                          </span>
                          <span className="text-[10px] text-slate-400">House: {student.house}</span>
                        </td>
                        <td className="py-3 px-4 font-mono">
                          <span className="text-slate-800 font-semibold block">+{student.parentPhone}</span>
                          <span className="text-[10px] text-slate-400 font-sans">{student.parentName}</span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="font-black font-mono text-xs bg-emerald-50 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-200">
                            {grade}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center font-mono font-semibold text-slate-700">
                          {rank} / {total}
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center space-x-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                            <CheckCircle className="w-3 h-3 text-emerald-600" />
                            <span>Indexed &amp; Linked to Phone</span>
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right space-x-2">
                          <button
                            type="button"
                            onClick={() => {
                              setViewingReport({
                                id: `rep-${student.admNo}`,
                                studentAdmNo: student.admNo,
                                studentName: `${student.firstName} ${student.lastName}`,
                                parentPhone: student.parentPhone,
                                formLevel: student.formLevel,
                                stream: student.stream,
                                term: selectedTerm,
                                year: selectedYear,
                                meanGrade: grade,
                                meanPoints: 72,
                                classRank: rank,
                                totalStudents: total,
                                fileName: `Kiarithaini_Report_Adm${student.admNo}.pdf`,
                                fileSize: '1.8 MB',
                                uploadedAt: '23 Oct 2026',
                                uploadedByTeacher: currentAssignment.teacherName,
                                status: 'VERIFIED',
                                teacherRemarks: student.academicRecords[0]?.classTeacherRemark || 'Good progress in sciences and mathematics.',
                                principalRemarks: student.academicRecords[0]?.principalRemark || 'Disciplined character and consistent effort.',
                                subjectsSummary: student.academicRecords[0]?.subjects.map((s) => ({
                                  name: s.name,
                                  score: s.score,
                                  grade: s.grade,
                                })),
                              });
                            }}
                            className="inline-flex items-center space-x-1 px-2.5 py-1 bg-slate-100 hover:bg-forest-900 hover:text-white text-slate-700 rounded-lg text-xs font-semibold transition"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View Report</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setSmsNotificationToast(
                                `SMS alert sent to ${student.parentName} (+${student.parentPhone}) for Adm ${student.admNo} report access.`
                              );
                            }}
                            className="inline-flex items-center space-x-1 px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg text-xs font-semibold border border-emerald-200 transition"
                          >
                            <Send className="w-3 h-3" />
                            <span>Send SMS</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* WORKFLOW 3: Broadsheet Excel / CSV Batch Uploader */}
      {activeWorkflowTab === 'broadsheet' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="max-w-2xl">
            <span className="text-[11px] font-bold text-blue-800 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">
              Bulk Examination Marksheet Import
            </span>
            <h3 className="text-2xl font-bold font-serif text-slate-900 mt-2">
              Batch Upload Stream Broadsheet (.CSV)
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              For teachers compiling scores in Excel or school exam software. Upload your completed stream broadsheet to automatically generate and index all 48-52 student report cards at once.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Step 1: Download Broadsheet Template */}
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                1
              </div>
              <h4 className="font-bold text-slate-900 text-sm">
                Download Pre-formatted Stream Template
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Contains columns for <code>AdmNo</code>, <code>StudentName</code>, <code>ParentPhone</code>, and scores for Mathematics, English, Kiswahili, Sciences, and Humanities.
              </p>
              <button
                type="button"
                onClick={() => {
                  const csvContent =
                    "AdmNo,StudentName,ParentPhone,Form,Stream,Math,Eng,Kisw,Phys,Chem,Bio,MeanGrade,ClassTeacherRemark\n" +
                    "4521,Amos Kiprono,254700000001,3,East,84,72,75,80,76,71,B+,Exemplary analytical dedication\n" +
                    "4810,Brian Mwangi,254712345678,4,West,92,81,83,88,84,80,A-,Top candidate in stream\n";
                  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement("a");
                  link.setAttribute("href", url);
                  link.setAttribute("download", `kiarithaini_form${selectedForm}_${selectedStream}_broadsheet_template.csv`);
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                className="inline-flex items-center space-x-2 bg-white hover:bg-slate-100 border border-slate-300 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-800 transition"
              >
                <Download className="w-4 h-4 text-blue-600" />
                <span>Download Form {selectedForm} {selectedStream} Template (.CSV)</span>
              </button>
            </div>

            {/* Step 2: Upload Completed Broadsheet */}
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-forest-900 text-amber-400 flex items-center justify-center font-bold">
                2
              </div>
              <h4 className="font-bold text-slate-900 text-sm">
                Upload &amp; Auto-Generate Reports
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                The system parses each row, creates a digital terminal report, pairs with each student&apos;s registered parent phone, and prepares SMS dispatches.
              </p>

              <div className="border border-dashed border-slate-300 rounded-xl p-4 text-center bg-white cursor-pointer hover:border-forest-800 transition">
                <input
                  type="file"
                  accept=".csv,.xlsx"
                  onChange={() => {
                    handleStartScanner('4521');
                    setSmsNotificationToast(
                      `Broadsheet imported! 48 student reports generated and indexed to parent phones.`
                    );
                  }}
                  className="hidden"
                  id="broadsheet-upload"
                />
                <label htmlFor="broadsheet-upload" className="cursor-pointer">
                  <FileSpreadsheet className="w-8 h-8 text-forest-800 mx-auto" />
                  <span className="block text-xs font-bold text-slate-900 mt-2">
                    Click to Select Completed CSV Broadsheet
                  </span>
                  <span className="block text-[11px] text-slate-400 mt-0.5">
                    Batch updates all students in stream
                  </span>
                </label>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* WORKFLOW 4: Technical Architecture & Storage Schema */}
      {activeWorkflowTab === 'architecture' && (
        <div className="bg-slate-950 text-white rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-2xl space-y-8">
          <div>
            <div className="inline-flex items-center space-x-2 text-amber-400 text-xs font-bold uppercase tracking-wider bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20 mb-3">
              <Database className="w-3.5 h-3.5" />
              <span>Full-Stack Architecture &amp; Indexing Specification</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-serif font-black text-white">
              How Stream Reports are Scanned, Stored, and Indexed
            </h3>
            <p className="text-slate-400 text-xs sm:text-sm mt-2 max-w-3xl leading-relaxed">
              To ensure data integrity, speed, and privacy across all streams at Kiarithaini High School, the system employs an automated pipeline with two primary access keys: <strong>Admission Number</strong> and <strong>Registered Parent Phone Number</strong>.
            </p>
          </div>

          {/* 4-Step Architecture Pipeline */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            
            {/* Step 1 */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="w-8 h-8 rounded-lg bg-forest-900 text-amber-400 font-bold text-xs flex items-center justify-center">
                1
              </span>
              <h4 className="font-bold text-sm text-white">Physical Scan &amp; Barcode / OCR</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                The printed report form contains a header QR code: <code>{`{adm: "4521", form: 3, stream: "East"}`}</code>. High-speed scanners automatically decode the admission number.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="w-8 h-8 rounded-lg bg-forest-900 text-amber-400 font-bold text-xs flex items-center justify-center">
                2
              </span>
              <h4 className="font-bold text-sm text-white">Cloud Storage Bucket Upload</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                The scanned high-resolution PDF or image is stored securely in an encrypted Cloud Storage bucket partitioned by year, term, and stream: <code>/reports/2026/term1/form3_east/4521.pdf</code>.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="w-8 h-8 rounded-lg bg-forest-900 text-amber-400 font-bold text-xs flex items-center justify-center">
                3
              </span>
              <h4 className="font-bold text-sm text-white">Database Indexing &amp; Keying</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                A metadata record in Cloud Firestore / PostgreSQL is indexed with:
                <br />• <code>studentAdmNo: &quot;4521&quot;</code> (Primary)
                <br />• <code>parentPhone: &quot;254700000001&quot;</code> (Index)
                <br />• <code>formLevel: 3, stream: &quot;East&quot;</code>
              </p>
            </div>

            {/* Step 4 */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="w-8 h-8 rounded-lg bg-forest-900 text-amber-400 font-bold text-xs flex items-center justify-center">
                4
              </span>
              <h4 className="font-bold text-sm text-white">Parent Portal &amp; SMS Dispatch</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Parents authenticate using their mobile phone number via 6-digit SMS OTP. The portal queries records matching their phone number and displays their son&apos;s exact stamped report.
              </p>
            </div>

          </div>

          {/* Code Schema Sample */}
          <div className="p-5 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-2">
            <span className="text-[11px] font-bold text-amber-400 uppercase font-mono block">
              Sample Firestore Document Schema (`student_reports` collection):
            </span>
            <pre className="text-xs font-mono text-emerald-400 overflow-x-auto p-3 bg-black/60 rounded-xl">
{`{
  "reportId": "rep-2026-t1-4521",
  "studentAdmNo": "4521",
  "parentPhone": "254700000001",
  "studentName": "Amos Kiprono",
  "formLevel": 3,
  "stream": "East",
  "term": 1,
  "year": 2026,
  "meanGrade": "B+",
  "meanPoints": 72,
  "classRank": 4,
  "totalStudents": 48,
  "conduct": "Exemplary",
  "classTeacher": "Mr. S. Nderitu",
  "principal": "Thiong'O John James",
  "storageUrl": "https://storage.googleapis.com/kiarithaini-reports/2026/term1/4521.pdf",
  "status": "VERIFIED",
  "parentNotifiedAt": "2026-10-23T10:30:00Z"
}`}
            </pre>
          </div>
        </div>
      )}

      {/* Official Scanned Report Card Viewer Modal */}
      {viewingReport && (
        <ScannedReportModal
          report={viewingReport}
          student={students.find((s) => s.admNo === viewingReport.studentAdmNo)}
          onClose={() => setViewingReport(null)}
        />
      )}

    </div>
  );
};
