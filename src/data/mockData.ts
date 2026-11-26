import { Student, Transaction, LibraryResource, Notice } from '../types';

export const INITIAL_STUDENTS: Student[] = [
  {
    admNo: '4521',
    firstName: 'Amos',
    lastName: 'Kiprono',
    formLevel: 3,
    stream: 'East',
    house: 'Mount Kenya House',
    parentName: 'Mzee Kiprono',
    parentPhone: '254700000001',
    maskedPhone: '0700 *** 001',
    feeBalance: 14500,
    pocketBalance: 1200,
    status: 'ACTIVE',
    academicRecords: [
      {
        term: 1,
        year: 2026,
        meanGrade: 'B+',
        rank: 4,
        totalClass: 48,
        conduct: 'Exemplary',
        attendance: 100,
        classTeacherRemark: 'Dedicated young man with sharp analytical prowess in sciences and mathematics.',
        principalRemark: 'Consistent leadership and disciplined character. Keep up the high standard.',
        subjects: [
          { name: 'Mathematics', code: '121', score: 84, grade: 'A', teacherRemark: 'Top of class in calculus & algebra' },
          { name: 'English', code: '101', score: 72, grade: 'B+', teacherRemark: 'Strong comprehension and speech skills' },
          { name: 'Kiswahili', code: '102', score: 75, grade: 'B+', teacherRemark: 'Fasihi analysis is very thorough' },
          { name: 'Physics', code: '232', score: 80, grade: 'A-', teacherRemark: 'Excellent lab skills and mechanics intuition' },
          { name: 'Chemistry', code: '233', score: 76, grade: 'B+', teacherRemark: 'Good practical accuracy in titration' },
          { name: 'Biology', code: '231', score: 71, grade: 'B', teacherRemark: 'Steady improvement in genetics topics' },
          { name: 'History & Government', code: '311', score: 78, grade: 'B+', teacherRemark: 'Great grasp of constitutional history' },
          { name: 'Business Studies', code: '565', score: 86, grade: 'A', teacherRemark: 'Outstanding financial accounting mastery' },
        ]
      }
    ]
  },
  {
    admNo: '4810',
    firstName: 'Brian',
    lastName: 'Mwangi',
    formLevel: 4,
    stream: 'West',
    house: 'Aberdare House',
    parentName: 'Grace Wanjiru',
    parentPhone: '254712345678',
    maskedPhone: '0712 *** 678',
    feeBalance: 0,
    pocketBalance: 3500,
    status: 'ACTIVE',
    academicRecords: [
      {
        term: 1,
        year: 2026,
        meanGrade: 'A-',
        rank: 1,
        totalClass: 50,
        conduct: 'Disciplined & Hardworking',
        attendance: 98,
        classTeacherRemark: 'Top candidate in the stream. Focused on reaching an A plain in KCSE.',
        principalRemark: 'Exceptional academic pillar. Mentors juniors effectively.',
        subjects: [
          { name: 'Mathematics', code: '121', score: 92, grade: 'A', teacherRemark: 'Perfect grasp of exam techniques' },
          { name: 'English', code: '101', score: 81, grade: 'A-', teacherRemark: 'Eloquent composition writing' },
          { name: 'Kiswahili', code: '102', score: 83, grade: 'A-', teacherRemark: 'Very creative essays' },
          { name: 'Physics', code: '232', score: 88, grade: 'A', teacherRemark: 'Mastery in electricity & magnetism' },
          { name: 'Chemistry', code: '233', score: 84, grade: 'A', teacherRemark: 'Consistently scores above 80%' },
          { name: 'Geography', code: '312', score: 80, grade: 'A-', teacherRemark: 'Fieldwork project well documented' },
          { name: 'Computer Studies', code: '451', score: 95, grade: 'A', teacherRemark: 'Exemplary project design' },
        ]
      }
    ]
  },
  {
    admNo: '4633',
    firstName: 'Kelvin',
    lastName: 'Maina',
    formLevel: 2,
    stream: 'North',
    house: 'Baringo House',
    parentName: 'David Maina',
    parentPhone: '254722334455',
    maskedPhone: '0722 *** 455',
    feeBalance: 8000,
    pocketBalance: 850,
    status: 'ACTIVE',
    academicRecords: [
      {
        term: 1,
        year: 2026,
        meanGrade: 'B',
        rank: 12,
        totalClass: 46,
        conduct: 'Active & Cooperative',
        attendance: 99,
        classTeacherRemark: 'Good progress in sciences. Encouraged to spend more revision time on languages.',
        principalRemark: 'Promising talent in sports and academic endeavors.',
        subjects: [
          { name: 'Mathematics', code: '121', score: 74, grade: 'B', teacherRemark: 'Shows good understanding of algebraic expressions' },
          { name: 'English', code: '101', score: 65, grade: 'C+', teacherRemark: 'Needs more focus on grammar rules' },
          { name: 'Kiswahili', code: '102', score: 68, grade: 'B-', teacherRemark: 'Good effort in oral comprehension' },
          { name: 'Chemistry', code: '233', score: 77, grade: 'B+', teacherRemark: 'Active participant in laboratory sessions' },
          { name: 'Biology', code: '231', score: 70, grade: 'B-', teacherRemark: 'Clear diagrams and classifications' },
        ]
      }
    ]
  },
  {
    admNo: '5120',
    firstName: 'Dennis',
    lastName: 'Omondi',
    formLevel: 1,
    stream: 'South',
    house: 'Mount Kenya House',
    parentName: 'Mary Atieno',
    parentPhone: '254733445566',
    maskedPhone: '0733 *** 566',
    feeBalance: 22000,
    pocketBalance: 2000,
    status: 'ACTIVE',
    academicRecords: [
      {
        term: 1,
        year: 2026,
        meanGrade: 'B+',
        rank: 6,
        totalClass: 52,
        conduct: 'Well Mannerd & Courteous',
        attendance: 100,
        classTeacherRemark: 'Adapted exceptionally well to secondary school boarding routine.',
        principalRemark: 'A strong foundation established in Term 1.',
        subjects: [
          { name: 'Mathematics', code: '121', score: 81, grade: 'A-', teacherRemark: 'Strong arithmetic and geometry foundation' },
          { name: 'English', code: '101', score: 79, grade: 'B+', teacherRemark: 'Vibrant participation in debating club' },
          { name: 'Kiswahili', code: '102', score: 76, grade: 'B+', teacherRemark: 'Good vocabulary development' },
          { name: 'Integrated Science', code: '201', score: 85, grade: 'A', teacherRemark: 'Excels in laboratory scientific investigations' },
          { name: 'Social Studies', code: '301', score: 78, grade: 'B+', teacherRemark: 'Good conceptual knowledge' },
        ]
      }
    ]
  }
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-1001',
    mpesaReceipt: 'QKH897ZX2',
    studentAdmNo: '4521',
    studentName: 'Amos Kiprono',
    amount: 10000,
    paymentType: 'TUITION_FEES',
    channel: 'STK_PUSH',
    payerPhone: '254700000001',
    status: 'COMPLETED',
    createdAt: '2026-10-21T09:14:22Z',
    notes: 'Term 1 Tuition partial clearance'
  },
  {
    id: 'tx-1002',
    mpesaReceipt: 'QKM4418P9',
    studentAdmNo: '4521',
    studentName: 'Amos Kiprono',
    amount: 1500,
    paymentType: 'POCKET_MONEY',
    channel: 'C2B_PAYBILL',
    payerPhone: '254700000001',
    status: 'COMPLETED',
    createdAt: '2026-10-22T14:32:10Z',
    notes: 'Ref: PKT4521 - Canteen tuck shop allocation'
  },
  {
    id: 'tx-1003',
    mpesaReceipt: 'QLP11029K',
    studentAdmNo: '4810',
    studentName: 'Brian Mwangi',
    amount: 28500,
    paymentType: 'TUITION_FEES',
    channel: 'C2B_PAYBILL',
    payerPhone: '254712345678',
    status: 'COMPLETED',
    createdAt: '2026-10-18T11:05:40Z',
    notes: 'Ref: 4810 - Full clearance for Form 4 Term 1'
  },
  {
    id: 'tx-1004',
    mpesaReceipt: 'QMR78201X',
    studentAdmNo: '4633',
    studentName: 'Kelvin Maina',
    amount: 6000,
    paymentType: 'TUITION_FEES',
    channel: 'STK_PUSH',
    payerPhone: '254722334455',
    status: 'COMPLETED',
    createdAt: '2026-10-19T16:20:00Z',
    notes: 'Term 1 Tuition installment'
  },
  {
    id: 'tx-1005',
    mpesaReceipt: 'QND99321Z',
    studentAdmNo: '5120',
    studentName: 'Dennis Omondi',
    amount: 15000,
    paymentType: 'TUITION_FEES',
    channel: 'BANK_DEPOSIT',
    payerPhone: '254733445566',
    status: 'COMPLETED',
    createdAt: '2026-10-15T08:45:12Z',
    notes: 'Equity Bank Nyeri Branch deposit cleared by Bursar'
  }
];

export const INITIAL_NOTICES: Notice[] = [
  {
    id: 'not-1',
    category: 'Finance & Fees',
    title: 'Term 1 Fee Clearance Notice',
    content: 'All parents and guardians are kindly reminded to finalize outstanding fee balances before the upcoming mid-term break. Please ensure you strictly use the official Safaricom Paybill Business Number 174379 with student Admission Number as reference.',
    date: '2 days ago',
    author: "Bursar's Office",
    isUrgent: true,
  },
  {
    id: 'not-2',
    category: 'Academics',
    title: 'Form 4 Joint Mock Revision Papers Uploaded',
    content: 'Revision past papers and marking schemes for Nyeri Central, Kirinyaga, and Mathira East joint examinations are now uploaded into the school E-Library portal below. Candidates should access and print practice sets.',
    date: '5 days ago',
    author: 'Dean of Studies',
    isUrgent: false,
    image: '/public/assets/aistudio/image_47bcacca.png',
  },
  {
    id: 'not-3',
    category: 'School Life',
    title: 'Academic & Spiritual Mentorship Clinic Day',
    content: 'Parents and guardians of Form 3 and Form 4 young men are warmly invited to the termly one-on-one mentorship clinic with subject teachers and school chaplains on Saturday from 9:00 AM.',
    date: '1 week ago',
    author: "Principal Thiong'O John James",
    isUrgent: false,
    image: '/public/assets/aistudio/image_4c54ff56.png',
  },
  {
    id: 'not-4',
    category: 'Boarding',
    title: 'Visiting Day & Transportation Logistics',
    content: 'Official school buses will ferry students for regional academic symposia. Kindly note that student tuck shop allowances must be deposited directly through Paybill 174379 using the PKT prefix.',
    date: '2 weeks ago',
    author: 'Senior Boarding Master',
    isUrgent: false,
    image: '/public/assets/aistudio/image_a9a7270a.png',
  },
  {
    id: 'not-5',
    category: 'School Life',
    title: 'Mathira East Athletics & Soccer Fixtures',
    content: 'Our senior soccer and track athletics squad have commenced intensive morning drills at the school pitch ahead of the County secondary school games.',
    date: '3 weeks ago',
    author: 'Games Department',
    isUrgent: false,
    image: '/public/assets/aistudio/image_5d907acf.png',
  }
];

export const INITIAL_LIBRARY_RESOURCES: LibraryResource[] = [
  {
    id: 'lib-1',
    title: 'KCSE Mathematics Joint Mock Paper 1 & 2 with Marking Schemes',
    subject: 'Mathematics',
    formLevel: 'Form 4',
    source: 'KNEC',
    year: '2024',
    fileSize: '2.8 MB',
    downloads: 342,
    pages: 36,
    description: 'Comprehensive joint county mock examinations covering calculus, 3D geometry, matrices, probability, and linear programming with verified step-by-step marking schemes.',
    downloadUrl: '#'
  },
  {
    id: 'lib-2',
    title: 'Integrated Science & Physics Mechanics Guide: Newton Laws to Energy',
    subject: 'Physics',
    formLevel: 'Form 3',
    source: 'KICD',
    year: '2024',
    fileSize: '4.2 MB',
    downloads: 289,
    pages: 58,
    description: 'KICD curriculum handbook breaking down linear motion, circular motion, Archimedes principle, simple machines, and mechanical energy with practical diagrams.',
    downloadUrl: '#'
  },
  {
    id: 'lib-3',
    title: 'Kiswahili Fasihi: Chozi la Heri & Bembea ya Bukini Uchambuzi wa kina',
    subject: 'Kiswahili',
    formLevel: 'Form 4',
    source: 'Internal',
    year: '2024',
    fileSize: '1.9 MB',
    downloads: 415,
    pages: 44,
    description: 'Mwongozo wa kipekee kutoka idara ya Kiswahili Kiarithaini unaoangazia maudhui, wahusika, migogoro, na mbinu za lugha katika vitabu teule vya KCSE.',
    downloadUrl: '#'
  },
  {
    id: 'lib-4',
    title: 'Chemistry Volumetric Analysis & Qualitative Practical Manual',
    subject: 'Chemistry',
    formLevel: 'Form 3',
    source: 'Internal',
    year: '2023',
    fileSize: '3.2 MB',
    downloads: 310,
    pages: 40,
    description: 'Laboratory guidebook for Paper 233/3 preparation: standard titration calculations, redox titrations, confirmatory ion tests, and flame test tables.',
    downloadUrl: '#'
  },
  {
    id: 'lib-5',
    title: 'Biology: Cell Structure, Genetics & Ecology Summary Notes',
    subject: 'Biology',
    formLevel: 'Form 2',
    source: 'KICD',
    year: '2023',
    fileSize: '5.0 MB',
    downloads: 274,
    pages: 62,
    description: 'Detailed illustrative summaries for Form 2 syllabus covering cell physiology, diffusion, osmosis, active transport, and early genetics foundations.',
    downloadUrl: '#'
  },
  {
    id: 'lib-6',
    title: 'English Functional Writing, Grammar & Oral Poetry Techniques',
    subject: 'English',
    formLevel: 'Form 1',
    source: 'Internal',
    year: '2024',
    fileSize: '1.4 MB',
    downloads: 198,
    pages: 28,
    description: 'Foundational guide for Form 1 learners on writing formal letters, memos, notices, book reviews, and mastering stress patterns in English poetry.',
    downloadUrl: '#'
  },
  {
    id: 'lib-7',
    title: 'History & Government: Devolution & The Constitution of Kenya (2010)',
    subject: 'History',
    formLevel: 'Form 4',
    source: 'KNEC',
    year: '2024',
    fileSize: '2.5 MB',
    downloads: 230,
    pages: 34,
    description: 'Focused KCSE revision paper focusing on Section B & C questions regarding county government structures, national executive, and public finance in Kenya.',
    downloadUrl: '#'
  },
  {
    id: 'lib-8',
    title: 'Computer Studies: Systems Analysis, Databases & Networking Modules',
    subject: 'Computer Studies',
    formLevel: 'Form 3',
    source: 'KICD',
    year: '2024',
    fileSize: '3.8 MB',
    downloads: 172,
    pages: 48,
    description: 'Database normalization rules, SQL queries, network topologies, data communication media, and ethical hacking overview for secondary syllabus.',
    downloadUrl: '#'
  }
];
