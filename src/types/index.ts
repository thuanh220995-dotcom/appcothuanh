export type Subject = 
  | 'Toán' 
  | 'Tiếng Việt' 
  | 'Tự nhiên và Xã hội' 
  | 'Đạo đức' 
  | 'Hoạt động trải nghiệm' 
  | 'Công nghệ' 
  | 'Tin học' 
  | 'Tiếng Anh';

export type StationId = 'station1' | 'station2' | 'station3' | 'station4' | 'station5';

export interface StationInfo {
  id: StationId;
  number: number;
  title: string;
  subtitle: string;
  color: string; // Tailwind color token
  bgGradient: string;
  iconName: string;
  objective: string;
}

export interface Question {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'fill-blank' | 'matching';
  level: 1 | 2 | 3; // 1: Củng cố nền tảng, 2: Vận dụng, 3: Nâng cao
  prompt: string;
  options?: string[];
  correctAnswer: string | number | boolean;
  explanation: string;
  hint?: string;
  pairs?: { left: string; right: string }[];
}

export interface SecretTileGame {
  topic: string;
  question: string;
  tiles: { id: number; clue: string; isRevealed: boolean }[];
  hiddenContent: string;
  answer: string;
}

export interface LessonStation1Data {
  warmupRiddle: {
    riddle: string;
    hint: string;
    answer: string;
    explanation: string;
  };
  observationGame: {
    title: string;
    description: string;
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
  secretTile: SecretTileGame;
}

export interface LessonStation2Data {
  summaryTitle: string;
  levels: {
    basic: { title: string; content: string; keyPoints: string[] };
    standard: { title: string; content: string; keyPoints: string[] };
    advanced: { title: string; content: string; keyPoints: string[] };
  };
  flashcards: {
    front: string;
    back: string;
    example: string;
  }[];
  mindMapNodes: { id: string; label: string; parentId?: string; color: string }[];
}

export interface LessonStation3Data {
  tasks: Question[];
}

export interface LessonStation4Data {
  challengeTitle: string;
  prompt: string;
  creativeType: 'drawing' | 'story' | 'mindmap';
  suggestedIdeas: string[];
}

export interface LessonStation5Data {
  reflectionQuestions: {
    id: string;
    question: string;
    type: 'emoji' | 'self-rate' | 'open-text';
  }[];
  teacherCheer: string;
}

export interface Lesson {
  id: string;
  title: string;
  subject: Subject;
  grade: number; // 3
  unit: string;
  bookSeries: 'Kết nối tri thức' | 'Chân trời sáng tạo' | 'Cánh diều' | 'Chung';
  objective: string;
  competencies: string[]; // Năng lực và phẩm chất
  durationMinutes: number;
  station1: LessonStation1Data;
  station2: LessonStation2Data;
  station3: LessonStation3Data;
  station4: LessonStation4Data;
  station5: LessonStation5Data;
  isCustom?: boolean;
}

export interface Student {
  id: string;
  code: string; // e.g. "HS-3D-01"
  name: string;
  group: string; // e.g. "Nhóm Sao Kim", "Nhóm Khám Phá"
  avatar: string;
  completedTasksCount: number;
  totalScore: number;
  badges: string[];
  needsSupport?: boolean;
  notes?: string;
}

export interface StudentStationResult {
  lessonId: string;
  studentId: string;
  stationId: StationId;
  completedAt: string;
  score?: number;
  maxScore?: number;
  levelReached?: 1 | 2 | 3;
  feedbackEmoji?: string;
  selfEvaluation?: 'need_help' | 'understood' | 'mastered';
  reflectionText?: string;
  drawingDataUrl?: string;
}

export interface LessonPlanOutput {
  id: string;
  lessonName: string;
  subject: Subject;
  grade: number;
  bookSeries: string;
  duration: string;
  objectives: {
    knowledge: string[];
    competence: string[];
    qualities: string[];
  };
  equipment: {
    teacher: string[];
    students: string[];
  };
  activities: {
    step: string;
    title: string;
    time: string;
    teacherAction: string;
    studentAction: string;
    expectedProduct: string;
  }[];
  assessment: string;
  differentiation: {
    forStudentsNeedingSupport: string;
    forAdvancedStudents: string;
  };
  createdAt: string;
}

export interface LearningMaterial {
  id: string;
  title: string;
  type: 'worksheet' | 'question_bank' | 'flashcards' | 'reading' | 'quiz';
  subject: Subject;
  grade: number;
  level: string;
  content: any;
  createdAt: string;
}

export interface PortfolioEvidence {
  id: string;
  category: 
    | 'Thực trạng'
    | 'Giải pháp 5 trạm'
    | 'Kế hoạch triển khai'
    | 'Học liệu AI'
    | 'Sản phẩm học sinh'
    | 'Kết quả đánh giá'
    | 'Khả năng nhân rộng';
  title: string;
  description: string;
  date: string;
  tags: string[];
  author: string;
}
