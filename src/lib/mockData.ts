// Mock Data for LMS Demo
// This provides realistic demo data for all dashboards and workflows

export interface Course {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  thumbnail: string;
  category: string; // Academic, Tiny Explorers, Special Needs, Creative & Extra
  subcategory: string;
  classLevel?: string; // Play, Nursery, KG, Class 1-10
  medium?: 'bangla' | 'english' | 'english-version'; // For academic courses
  instructor: string;
  price: number;
  priceUSD: number;
  originalPrice?: number;
  originalPriceUSD?: number;
  duration: string;
  totalLessons: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  isFree: boolean;
  features: string[];
  syllabus: CourseSyllabus[];
  schedule: {
    liveClasses: string;
    timezone: string;
  };
  enrolledStudents: number;
  rating: number;
  reviews: number;
}

export interface CourseSyllabus {
  week: number;
  title: string;
  topics: string[];
  materials: CourseMaterial[];
}

export interface CourseMaterial {
  id: string;
  type: 'video' | 'pdf' | 'slides' | 'book' | 'audio' | 'live_recording';
  title: string;
  url: string;
  duration?: string;
  downloadable: boolean;
  hasTranscript: boolean;
  hasPodcast: boolean;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  parentId: string;
  enrolledCourses: string[];
  wishlist: string[];
  progress: Record<string, CourseProgress>;
  notifications: Notification[];
}

export interface CourseProgress {
  courseId: string;
  completedLessons: string[];
  currentLesson: string;
  progressPercentage: number;
  quizScores: QuizScore[];
  assignments: Assignment[];
  notes: Note[];
  lastAccessed: string;
}

export interface QuizScore {
  quizId: string;
  score: number;
  totalQuestions: number;
  completedAt: string;
  timeTaken: string;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  submittedAt?: string;
  status: 'pending' | 'submitted' | 'late' | 'graded';
  grade?: number;
  feedback?: string;
}

export interface Note {
  id: string;
  materialId: string;
  content: string;
  timestamp: string;
  lastModified: string;
}

export interface Notification {
  id: string;
  type: 'assignment' | 'quiz' | 'announcement' | 'reminder' | 'grade';
  title: string;
  message: string;
  date: string;
  read: boolean;
  actionUrl?: string;
}

export interface Parent {
  id: string;
  name: string;
  email: string;
  studentIds: string[];
}

// Course Categories Structure
export const courseCategories = {
  academic: {
    name: 'Academic Courses',
    description: 'Comprehensive curriculum for Play to Grade 10',
    classes: ['Play', 'Nursery', 'KG', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'],
    mediums: [
      { id: 'bangla', name: 'Bangla Medium', icon: '🇧🇩' },
      { id: 'english', name: 'English Medium', icon: '🇬🇧' },
      { id: 'english-version', name: 'English Version', icon: '📚' }
    ],
    subjects: ['Mathematics', 'Science', 'English', 'Bangla', 'Social Studies', 'ICT']
  },
  tinyExplorers: {
    name: 'Tiny Explorers',
    description: 'Interactive learning for preschoolers and kindergarteners',
    ageGroups: ['2-3 years', '3-4 years', '4-5 years', '5-6 years'],
    programs: ['Phonics', 'Numbers', 'Colors & Shapes', 'Music & Movement', 'Art & Craft', 'Storytelling']
  },
  specialNeeds: {
    name: 'Special Needs',
    description: 'Tailored programs for children with special needs',
    categories: ['Autism Support', 'ADHD Support', 'Learning Disabilities', 'Speech Therapy', 'Occupational Therapy', 'Behavioral Therapy']
  },
  creativeExtra: {
    name: 'Creative & Extra',
    description: 'Beyond academics - arts, music, sports, and more',
    categories: ['Art & Drawing', 'Music & Instruments', 'Dance', 'Sports & Fitness', 'Coding & Robotics', 'Public Speaking', 'Creative Writing']
  }
};

// Mock Courses
export const mockCourses: Course[] = [
  // FREE DEMO COURSE - Fully Featured
  {
    id: 'course-free-demo',
    title: 'Complete Web Development Bootcamp - FREE DEMO',
    description: 'Master HTML, CSS, JavaScript, React, Node.js and become a full-stack developer. This comprehensive course covers everything from basics to advanced concepts with hands-on projects.',
    shortDescription: 'Become a full-stack web developer in 12 weeks',
    thumbnail: '/placeholder.svg',
    category: 'Creative & Extra',
    subcategory: 'Coding & Robotics',
    instructor: 'Dr. Sarah Ahmed',
    price: 0,
    priceUSD: 0,
    originalPrice: 15000,
    originalPriceUSD: 180,
    duration: '12 weeks',
    totalLessons: 96,
    level: 'beginner',
    isFree: true,
    features: [
      '96 HD video lessons',
      'Live classes 3x per week',
      'Hands-on projects',
      'Certificate of completion',
      'Lifetime access',
      '1-on-1 mentorship',
      'Job placement assistance'
    ],
    syllabus: [
      {
        week: 1,
        title: 'HTML & CSS Fundamentals',
        topics: ['HTML5 structure', 'CSS3 styling', 'Flexbox & Grid', 'Responsive design'],
        materials: [
          {
            id: 'mat-1',
            type: 'video',
            title: 'Introduction to HTML5',
            url: 'https://www.youtube.com/watch?v=qz0aGYrrlhU',
            duration: '45 min',
            downloadable: false,
            hasTranscript: true,
            hasPodcast: true
          },
          {
            id: 'mat-2',
            type: 'pdf',
            title: 'HTML Cheat Sheet',
            url: 'https://htmlcheatsheet.com/css/',
            downloadable: true,
            hasTranscript: false,
            hasPodcast: false
          },
          {
            id: 'mat-3',
            type: 'video',
            title: 'CSS Styling Basics',
            url: 'https://www.youtube.com/watch?v=yfoY53QXEnI',
            duration: '1 hr 10 min',
            downloadable: false,
            hasTranscript: true,
            hasPodcast: true
          },
          {
            id: 'mat-4',
            type: 'slides',
            title: 'HTML & CSS Presentation',
            url: 'https://www.w3schools.com/html/',
            duration: '30 slides',
            downloadable: true,
            hasTranscript: false,
            hasPodcast: false
          }
        ]
      },
      {
        week: 2,
        title: 'JavaScript Basics',
        topics: ['Variables & Data Types', 'Functions', 'DOM Manipulation', 'Events'],
        materials: []
      }
    ],
    schedule: {
      liveClasses: 'Mon, Wed, Fri 6:00 PM - 7:30 PM',
      timezone: 'GMT+6 (Bangladesh)'
    },
    enrolledStudents: 245,
    rating: 4.8,
    reviews: 89
  },
  // ACADEMIC COURSES - Class 10 English Medium
  {
    id: 'course-class10-math-eng',
    title: 'Class 10 Mathematics - English Medium',
    description: 'Complete Class 10 Mathematics curriculum covering algebra, geometry, trigonometry, and statistics with live classes and practice tests.',
    shortDescription: 'Master Class 10 Mathematics with expert guidance',
    thumbnail: '/placeholder.svg',
    category: 'Academic',
    subcategory: 'Mathematics',
    classLevel: 'Class 10',
    medium: 'english',
    instructor: 'Prof. Kamal Hossain',
    price: 8000,
    priceUSD: 95,
    originalPrice: 12000,
    originalPriceUSD: 145,
    duration: '8 weeks',
    totalLessons: 64,
    level: 'intermediate',
    isFree: false,
    features: [
      '64 expert-led lessons',
      'Daily practice tests',
      'Speaking practice sessions',
      'Writing feedback',
      'Mock exams',
      'Study materials'
    ],
    syllabus: [],
    schedule: {
      liveClasses: 'Tue, Thu, Sat 7:00 PM - 8:30 PM',
      timezone: 'GMT+6 (Bangladesh)'
    },
    enrolledStudents: 189,
    rating: 4.9,
    reviews: 67
  },
  // ACADEMIC - Class 5 Bangla Medium
  {
    id: 'course-class5-science-bangla',
    title: 'Class 5 Science - Bangla Medium',
    description: 'পঞ্চম শ্রেণীর বিজ্ঞান সম্পূর্ণ পাঠ্যক্রম। প্রাণী, উদ্ভিদ, পদার্থ এবং শক্তি সম্পর্কে শিখুন।',
    shortDescription: 'সম্পূর্ণ বিজ্ঞান পাঠ্যক্রম বাংলা মাধ্যমে',
    thumbnail: '/placeholder.svg',
    category: 'Academic',
    subcategory: 'Science',
    classLevel: 'Class 5',
    medium: 'bangla',
    instructor: 'মোঃ রফিক উদ্দিন',
    price: 5000,
    priceUSD: 60,
    originalPrice: 7000,
    originalPriceUSD: 85,
    duration: '8 months',
    totalLessons: 120,
    level: 'beginner',
    isFree: false,
    features: [
      'বাংলা ভাষায় ক্লাস',
      '১২০টি ভিডিও লেসন',
      'সাপ্তাহিক কুইজ',
      'পরীক্ষার প্রস্তুতি',
      'লাইভ ক্লাস',
    ],
    syllabus: [],
    schedule: {
      liveClasses: 'রবি, মঙ্গল, বৃহঃ সন্ধ্যা ৬-৭টা',
      timezone: 'GMT+6 (Bangladesh)'
    },
    enrolledStudents: 234,
    rating: 4.7,
    reviews: 89
  },
  
  // TINY EXPLORERS
  {
    id: 'course-tiny-phonics',
    title: 'Phonics & Early Reading (Ages 3-5)',
    description: 'Interactive phonics program teaching letter sounds, blending, and early reading skills through games and activities.',
    shortDescription: 'Fun phonics for preschoolers',
    thumbnail: '/placeholder.svg',
    category: 'Tiny Explorers',
    subcategory: 'Phonics',
    instructor: 'Miss Ayesha Rahman',
    price: 4000,
    priceUSD: 48,
    duration: '10 weeks',
    totalLessons: 80,
    level: 'beginner',
    isFree: false,
    features: [
      '80 practical lessons',
      'Real campaign projects',
      'SEO tools training',
      'Certificate',
      'Marketing templates'
    ],
    syllabus: [],
    schedule: {
      liveClasses: 'Mon, Wed 8:00 PM - 9:00 PM',
      timezone: 'GMT+6 (Bangladesh)'
    },
    enrolledStudents: 156,
    rating: 4.7,
    reviews: 52
  }
];

// Mock Students
export const mockStudents: Student[] = [
  {
    id: 'student-1',
    name: 'Rafiq Ahmed',
    email: 'rafiq@example.com',
    phone: '+880 1712-345678',
    avatar: undefined,
    parentId: 'parent-1',
    enrolledCourses: ['course-1'],
    wishlist: ['course-2', 'course-3'],
    progress: {
      'course-1': {
        courseId: 'course-1',
        completedLessons: ['mat-1'],
        currentLesson: 'mat-2',
        progressPercentage: 15,
        quizScores: [
          {
            quizId: 'quiz-1',
            score: 18,
            totalQuestions: 20,
            completedAt: '2025-12-20T10:30:00Z',
            timeTaken: '25 minutes'
          }
        ],
        assignments: [
          {
            id: 'assign-1',
            title: 'Build a Personal Portfolio',
            description: 'Create a responsive portfolio website using HTML and CSS',
            dueDate: '2025-12-30T23:59:59Z',
            status: 'pending',
          },
          {
            id: 'assign-2',
            title: 'CSS Layout Challenge',
            description: 'Recreate the given design using Flexbox or Grid',
            dueDate: '2025-12-28T23:59:59Z',
            submittedAt: '2025-12-27T15:30:00Z',
            status: 'graded',
            grade: 95,
            feedback: 'Excellent work! Very clean code and pixel-perfect design.'
          }
        ],
        notes: [
          {
            id: 'note-1',
            materialId: 'mat-1',
            content: 'Remember: HTML5 semantic tags improve SEO. Use <header>, <nav>, <main>, <footer>.',
            timestamp: '2025-12-20T14:25:00Z',
            lastModified: '2025-12-20T14:25:00Z'
          }
        ],
        lastAccessed: '2025-12-24T18:45:00Z'
      }
    },
    notifications: [
      {
        id: 'notif-1',
        type: 'assignment',
        title: 'New Assignment Posted',
        message: 'A new assignment "Build a Personal Portfolio" has been posted for Web Development Bootcamp',
        date: '2025-12-23T09:00:00Z',
        read: false,
        actionUrl: '/dashboard/courses/course-1/assignments'
      },
      {
        id: 'notif-2',
        type: 'reminder',
        title: 'Upcoming Live Class',
        message: 'Your live class starts in 2 hours - Web Development Bootcamp',
        date: '2025-12-25T16:00:00Z',
        read: false,
        actionUrl: '/dashboard/courses/course-1/live'
      },
      {
        id: 'notif-3',
        type: 'grade',
        title: 'Assignment Graded',
        message: 'Your CSS Layout Challenge has been graded: 95/100',
        date: '2025-12-24T11:20:00Z',
        read: true,
        actionUrl: '/dashboard/courses/course-1/assignments/assign-2'
      }
    ]
  }
];

// Mock Parents
export const mockParents: Parent[] = [
  {
    id: 'parent-1',
    name: 'Khaleda Ahmed',
    email: 'khaleda@example.com',
    studentIds: ['student-1']
  }
];

// Helper functions
export const getCourseById = (id: string): Course | undefined => {
  return mockCourses.find(course => course.id === id);
};

export const getStudentById = (id: string): Student | undefined => {
  return mockStudents.find(student => student.id === id);
};

export const getParentById = (id: string): Parent | undefined => {
  return mockParents.find(parent => parent.id === id);
};

export const getStudentCourses = (studentId: string): Course[] => {
  const student = getStudentById(studentId);
  if (!student) return [];
  return mockCourses.filter(course => student.enrolledCourses.includes(course.id));
};

export const getStudentWishlist = (studentId: string): Course[] => {
  const student = getStudentById(studentId);
  if (!student) return [];
  return mockCourses.filter(course => student.wishlist.includes(course.id));
};
