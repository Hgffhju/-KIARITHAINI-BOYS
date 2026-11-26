import React from 'react';
import { ScannedReportCard, Student } from '../types';
import {
  X,
  Download,
  Printer,
  Shield,
  Award,
  Calendar,
  User,
  CheckCircle,
  Smartphone
} from 'lucide-react';

interface ScannedReportModalProps {
  report: ScannedReportCard;
  student?: Student;
  onClose: () => void;
}

export const ScannedReportModal: React.FC<ScannedReportModalProps> = ({
  report,
  student,
  onClose,
}) => {
  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Generate simulated download
    const element = document.createElement('a');
    const file = new Blob(
      [
        `KIARITHAINI HIGH SCHOOL - OFFICIAL REPORT CARD\n` +
        `Student: ${report.studentName} (Adm: ${report.studentAdmNo})\n` +
        `Form: ${report.formLevel} ${report.stream} | Term ${report.term} ${report.year}\n` +
        `Mean Grade: ${report.meanGrade} (${report.meanPoints} Pts) | Rank: ${report.classRank}/${report.totalStudents}\n` +
        `Parent Phone: ${report.parentPhone}\n` +
        `Class Teacher: ${report.uploadedByTeacher}\n` +
        `Principal: Thiong'O John James\n` +
        `Verified at Kiarithaini High School, Mathira East, Nyeri County.`
      ],
      { type: 'text/plain' }
    );
    element.href = URL.createObjectURL(file);
    element.download = `ReportCard_Adm${report.studentAdmNo}_Term${report.term}_${report.year}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 print:p-0 print:bg-white">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden relative animate-in fade-in zoom-in-95 duration-200 print:border-none print:shadow-none print:rounded-none">
        
        {/* Action Header - Hidden on Print */}
        <div className="bg-forest-950 px-6 py-4 flex items-center justify-between text-white print:hidden">
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-white/10 text-amber-400">
              <Award className="w-4 h-4" />
            </span>
            <div>
              <span className="text-xs uppercase tracking-wider font-bold text-amber-400 block">
                Official Digital Academic Archive
              </span>
              <span className="text-xs text-slate-300">
                Indexed to Admission No: <strong className="text-white font-mono">{report.studentAdmNo}</strong>
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleDownload}
              className="px-3 py-1.5 rounded-xl bg-forest-900 hover:bg-forest-800 text-xs font-semibold text-white border border-forest-700 flex items-center space-x-1.5 transition"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span>Download</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold flex items-center space-x-1.5 transition shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Report</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Official Report Card Canvas */}
        <div className="p-8 sm:p-10 space-y-6 bg-white text-slate-900 print:p-4">
          
          {/* School Header */}
          <div className="text-center border-b-2 border-forest-900 pb-5">
            <div className="inline-block mx-auto mb-2">
              <div className="h-16 w-16 rounded-2xl bg-forest-950 text-amber-400 font-serif font-black text-2xl flex items-center justify-center border-2 border-amber-400 shadow-md mx-auto">
                K
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black font-serif text-forest-950 uppercase tracking-wide">
              Kiarithaini High School
            </h1>
            <p className="text-xs font-serif italic text-amber-700 font-semibold mt-0.5">
              &quot;Strive to Excel&quot;
            </p>
            <p className="text-xs text-slate-600 mt-1">
              P.O. Box Kiarithaini, Mathira East Sub-County, Nyeri County, Kenya
            </p>
            <p className="text-[11px] text-slate-500 font-mono mt-0.5">
              KNEC Center Code: 20400000 • Tel: 0722377082 • Email: kiarithainiboys@yahoo.com
            </p>

            <div className="mt-3 inline-block bg-forest-900 text-amber-300 text-xs font-bold uppercase tracking-widest px-4 py-1 rounded-full">
              Student Terminal Evaluation Report Card
            </div>
          </div>

          {/* Student & Administrative Identification Block */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">Student Full Name</span>
              <span className="font-bold text-slate-900 font-serif text-sm">{report.studentName}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">Admission Number</span>
              <code className="font-bold text-forest-900 text-sm font-mono bg-white px-2 py-0.5 rounded border border-slate-200">
                {report.studentAdmNo}
              </code>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">Class &amp; Stream</span>
              <span className="font-bold text-slate-900">Form {report.formLevel} {report.stream}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">Academic Period</span>
              <span className="font-bold text-slate-900">Term {report.term}, {report.year}</span>
            </div>

            <div className="pt-2 border-t border-slate-200/80">
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">Registered Parent Phone</span>
              <span className="font-mono font-semibold text-slate-700">+{report.parentPhone}</span>
            </div>
            <div className="pt-2 border-t border-slate-200/80">
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">Class Teacher</span>
              <span className="font-semibold text-slate-700">{report.uploadedByTeacher}</span>
            </div>
            <div className="pt-2 border-t border-slate-200/80">
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">Stream Rank</span>
              <span className="font-bold text-emerald-700 font-mono">
                {report.classRank} of {report.totalStudents}
              </span>
            </div>
            <div className="pt-2 border-t border-slate-200/80">
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">Mean Grade</span>
              <span className="font-black text-forest-900 text-sm font-mono">
                {report.meanGrade} ({report.meanPoints} Pts)
              </span>
            </div>
          </div>

          {/* Academic Performance Table */}
          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Examinations &amp; Continuous Assessment (CAT) Marks</span>
              <span className="text-[11px] text-slate-500 lowercase font-normal">8 Subjects Registered</span>
            </h3>

            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-forest-900 text-white text-[11px] uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="py-2.5 px-3">Subject Name</th>
                    <th className="py-2.5 px-3 text-center">KNEC Code</th>
                    <th className="py-2.5 px-3 text-right">Score (%)</th>
                    <th className="py-2.5 px-3 text-center">Grade</th>
                    <th className="py-2.5 px-3">Subject Teacher Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {report.subjectsSummary && report.subjectsSummary.length > 0 ? (
                    report.subjectsSummary.map((sub, idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/70'}>
                        <td className="py-2 px-3 font-semibold text-slate-900">{sub.name}</td>
                        <td className="py-2 px-3 text-center font-mono text-slate-500">{100 + idx * 11}</td>
                        <td className="py-2 px-3 text-right font-mono font-bold text-slate-900">{sub.score}%</td>
                        <td className="py-2 px-3 text-center font-bold text-forest-900">
                          <span className={`inline-block px-2 py-0.5 rounded text-[11px] ${
                            sub.grade.startsWith('A') ? 'bg-emerald-100 text-emerald-800' :
                            sub.grade.startsWith('B') ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {sub.grade}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-slate-600 italic text-[11px]">
                          Satisfactory competency demonstrated in curriculum scope.
                        </td>
                      </tr>
                    ))
                  ) : student?.academicRecords[0]?.subjects ? (
                    student.academicRecords[0].subjects.map((sub, idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/70'}>
                        <td className="py-2 px-3 font-semibold text-slate-900">{sub.name}</td>
                        <td className="py-2 px-3 text-center font-mono text-slate-500">{sub.code}</td>
                        <td className="py-2 px-3 text-right font-mono font-bold text-slate-900">{sub.score}%</td>
                        <td className="py-2 px-3 text-center font-bold text-forest-900">
                          <span className={`inline-block px-2 py-0.5 rounded text-[11px] ${
                            sub.grade.startsWith('A') ? 'bg-emerald-100 text-emerald-800' :
                            sub.grade.startsWith('B') ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {sub.grade}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-slate-600 italic text-[11px]">&ldquo;{sub.teacherRemark}&rdquo;</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-4 text-center text-slate-400">No subject records available</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Conduct & Remarks Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
                Class Teacher Remarks
              </span>
              <p className="italic text-slate-800 leading-relaxed">
                &ldquo;{report.teacherRemarks}&rdquo;
              </p>
              <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
                <span>Signed: <strong>{report.uploadedByTeacher}</strong></span>
                <span>Date: {report.uploadedAt}</span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
                Principal&apos;s Signature &amp; Official School Seal
              </span>
              <p className="italic text-slate-800 leading-relaxed">
                &ldquo;{report.principalRemarks}&rdquo;
              </p>
              
              {/* Seal Stamp */}
              <div className="pt-2 flex items-center justify-between">
                <div>
                  <span className="block font-bold text-forest-900 text-xs">Thiong&apos;O John James</span>
                  <span className="block text-[10px] text-slate-500">Chief Principal, Kiarithaini High</span>
                </div>

                <div className="relative border-2 border-dashed border-red-500/70 rounded-full w-20 h-20 flex flex-col items-center justify-center text-red-600 rotate-[-12deg] p-1 text-[9px] font-bold text-center leading-tight">
                  <span className="uppercase text-[8px] font-black">KIARITHAINI</span>
                  <span>* PRINCIPAL *</span>
                  <span className="text-[7px]">APPROVED</span>
                </div>
              </div>
            </div>
          </div>

          {/* Opening Date & Fee Balance Advice */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="font-bold block text-slate-900">Next Term Reporting Advice:</span>
              <span>All students report back on <strong>Tuesday, 5th May 2026</strong> by 3:00 PM.</span>
            </div>
            <div className="text-right sm:text-right">
              <span className="text-[11px] block text-slate-600">Fee Clearing Channel:</span>
              <code className="font-mono font-bold text-forest-900">Co-op Bank A/C: 01129059715100</code>
            </div>
          </div>

          {/* Verification Bar */}
          <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between text-[11px] text-slate-400 gap-2">
            <div className="flex items-center space-x-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>Digital Copy Verified against School Examination Ledger (Adm: {report.studentAdmNo})</span>
            </div>
            <div className="font-mono">
              Status: <span className="text-emerald-700 font-bold">{report.status}</span> • Parent SMS Dispatched
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
