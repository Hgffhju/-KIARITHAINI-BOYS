import React, { useState } from 'react';
import { LibraryResource } from '../types';
import { X, FileText, Download, Check, Sparkles, BookOpen, Layers, Calendar, UserCheck } from 'lucide-react';

interface PreviewProps {
  resource: LibraryResource;
  onClose: () => void;
  onDownload: (res: LibraryResource) => void;
}

export const LibraryPreviewModal: React.FC<PreviewProps> = ({ resource, onClose, onDownload }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-200">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-xs uppercase px-2.5 py-1 rounded bg-forest-800 text-amber-300">
              {resource.subject}
            </span>
            <span className="text-xs text-slate-500 font-medium">{resource.formLevel}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          <div>
            <h3 className="text-xl font-bold font-serif text-slate-900">
              {resource.title}
            </h3>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              {resource.description}
            </p>
          </div>

          {/* Meta Details */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <span className="text-slate-400 block text-[11px]">Curriculum Source:</span>
              <span className="font-semibold text-slate-800">{resource.source}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Academic Year:</span>
              <span className="font-semibold text-slate-800">{resource.year}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">File Size:</span>
              <span className="font-semibold text-slate-800">{resource.fileSize}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Page Count:</span>
              <span className="font-semibold text-slate-800">{resource.pages} Pages</span>
            </div>
          </div>

          {/* Simulated Document Preview */}
          <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/50 space-y-4">
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-700">
              <BookOpen className="w-4 h-4 text-forest-800" />
              <span>Sample Content & Syllabus Coverage:</span>
            </div>

            <ul className="text-xs text-slate-600 space-y-2 list-disc list-inside">
              <li>Section A: Core conceptual definitions, foundational formulas, and multiple-choice diagnostics.</li>
              <li>Section B: Structured analytical questions with detailed step-by-step marking schemes.</li>
              <li>Section C: Applied case problems, diagrams, and past KNEC examination examiner remarks.</li>
              <li>Teacher verification: Certified by the Kiarithaini Academic Review Committee.</li>
            </ul>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Downloaded <strong>{resource.downloads}</strong> times by students
          </span>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-lg hover:bg-slate-200 transition"
            >
              Close
            </button>
            <button
              onClick={() => onDownload(resource)}
              className="inline-flex items-center space-x-1.5 px-5 py-2 text-xs font-bold bg-forest-800 hover:bg-forest-900 text-white rounded-lg shadow-sm transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF ({resource.fileSize})</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

interface UploadProps {
  onClose: () => void;
  onAddResource: (newRes: LibraryResource) => void;
}

export const TeacherUploadModal: React.FC<UploadProps> = ({ onClose, onAddResource }) => {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('Mathematics');
  const [level, setLevel] = useState<'Form 1' | 'Form 2' | 'Form 3' | 'Form 4' | 'All Forms'>('Form 4');
  const [source, setSource] = useState<'KNEC' | 'KICD' | 'Internal'>('Internal');
  const [description, setDescription] = useState('');
  const [pages, setPages] = useState('24');
  const [fileSize, setFileSize] = useState('2.1 MB');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newRes: LibraryResource = {
      id: `lib-${Date.now()}`,
      title: title.trim(),
      subject,
      formLevel: level,
      source,
      year: new Date().getFullYear().toString(),
      fileSize: fileSize || '2.5 MB',
      downloads: 0,
      pages: Number(pages) || 20,
      description: description.trim() || `Official revision material prepared for ${level} ${subject} students.`,
      downloadUrl: '#',
    };

    onAddResource(newRes);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        
        <div className="flex items-center justify-between px-6 py-4 bg-forest-900 text-white">
          <div className="flex items-center space-x-2">
            <UserCheck className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold">Teacher / Academic CMS Upload</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Document Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. 2026 Term 1 Biology Genetics Revision Notes"
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-forest-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Subject</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-forest-800"
              >
                <option value="Mathematics">Mathematics</option>
                <option value="English">English</option>
                <option value="Kiswahili">Kiswahili</option>
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Biology">Biology</option>
                <option value="History">History & Government</option>
                <option value="Geography">Geography</option>
                <option value="Computer Studies">Computer Studies</option>
                <option value="Business Studies">Business Studies</option>
                <option value="CRE">CRE</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Form Level</label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value as any)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-forest-800"
              >
                <option value="Form 1">Form 1</option>
                <option value="Form 2">Form 2</option>
                <option value="Form 3">Form 3</option>
                <option value="Form 4">Form 4</option>
                <option value="All Forms">All Forms</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Source / Accreditation</label>
              <select
                value={source}
                onChange={(e) => setSource(e.target.value as any)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-forest-800"
              >
                <option value="Internal">Internal Revision Notes</option>
                <option value="KNEC">KNEC Past Papers</option>
                <option value="KICD">KICD Core Modules</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Estimated Pages</label>
              <input
                type="number"
                value={pages}
                onChange={(e) => setPages(e.target.value)}
                placeholder="24"
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-forest-800"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Resource Description / Topics</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Summary notes, formulas, and past trial problems..."
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-forest-800"
            ></textarea>
          </div>

          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-800 text-[11px]">
            Once submitted, this material will instantly appear in the student E-Library repository for download across all devices.
          </div>

          <div className="flex space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 border border-slate-300 rounded-lg font-semibold text-slate-600 hover:bg-slate-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 bg-forest-800 hover:bg-forest-900 text-white font-bold rounded-lg transition"
            >
              Publish to E-Library
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
