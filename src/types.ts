export type PaymentCategory = 'TUITION_FEES' | 'POCKET_MONEY' | 'UNIFORM_BOARDING';

export type PaymentChannel = 'STK_PUSH' | 'C2B_PAYBILL' | 'BANK_DEPOSIT';

export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED';

export interface SubjectScore {
  name: string;
  code: string;
  score: number;
  grade: string;
  teacherRemark: string;
}

export interface AcademicRecord {
  term: number;
  year: number;
  meanGrade: string;
  rank: number;
  totalClass: number;
  conduct: string;
  attendance: number;
  classTeacherRemark: string;
  principalRemark: string;
  subjects: SubjectScore[];
}

export interface ScannedReportCard {
  id: string;
  studentAdmNo: string;
  studentName: string;
  parentPhone: string;
  formLevel: number;
  stream: string;
  term: number;
  year: number;
  meanGrade: string;
  meanPoints: number;
  classRank: number;
  totalStudents: number;
  fileName: string;
  fileSize: string;
  uploadedAt: string;
  uploadedByTeacher: string;
  status: 'VERIFIED' | 'PENDING_APPROVAL' | 'DELIVERED_SMS';
  teacherRemarks: string;
  principalRemarks: string;
  scannedImageUrl?: string;
  subjectsSummary?: { name: string; score: number; grade: string }[];
}

export interface Student {
  admNo: string;
  firstName: string;
  lastName: string;
  formLevel: number;
  stream: string;
  house: string;
  parentName: string;
  parentPhone: string;
  maskedPhone: string;
  feeBalance: number;
  pocketBalance: number;
  status: 'ACTIVE' | 'SUSPENDED' | 'ALUMNI';
  academicRecords: AcademicRecord[];
  reportCards?: ScannedReportCard[];
}

export interface Transaction {
  id: string;
  mpesaReceipt: string;
  studentAdmNo: string;
  studentName: string;
  amount: number;
  paymentType: PaymentCategory;
  channel: PaymentChannel;
  payerPhone: string;
  status: PaymentStatus;
  checkoutRequestId?: string;
  createdAt: string;
  notes?: string;
}

export interface LibraryResource {
  id: string;
  title: string;
  subject: string;
  formLevel: 'Form 1' | 'Form 2' | 'Form 3' | 'Form 4' | 'All Forms';
  source: 'KNEC' | 'KICD' | 'Internal';
  year: string;
  fileSize: string;
  downloads: number;
  pages: number;
  description: string;
  downloadUrl: string;
}

export interface Notice {
  id: string;
  title: string;
  category: 'Finance & Fees' | 'Academics' | 'School Life' | 'Boarding';
  content: string;
  date: string;
  author: string;
  isUrgent?: boolean;
  image?: string;
}
