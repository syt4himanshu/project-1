export interface Classification {
  isSlowLearner: boolean;
  isAdvancedLearner: boolean;
  slowReasons: string[];
  advancedReasons: string[];
}

export interface Achievement {
  title: string;
  date?: string;
  [key: string]: any;
}

export interface Project {
  title: string;
  description?: string;
  tags?: string[];
  [key: string]: any;
}

export interface Publication {
  title: string;
  date?: string;
  [key: string]: any;
}

export interface ClassifiedStudent {
  id: number;
  name: string;
  rollNo: string;
  department: string;
  semester: number;
  cgpa: number;
  backlogs: number;
  mseMarks: number;
  achievements: Achievement[];
  projects: Project[];
  publications: Publication[];
  classification: Classification;
}

export interface SupportPlan {
  id: string;
  studentId: number;
  type: 'slow' | 'advanced';
  mechanism: string;
  scheduledAt: string;
  status: 'pending' | 'completed' | 'cancelled';
  notes: string;
  createdBy: number;
}

export interface ClassificationSummary {
  total: number;
  slowLearners: number;
  advancedLearners: number;
  both: number;
  general: number;
  byDepartment: { department: string; slow: number; advanced: number; total: number }[];
}

export interface PaginatedResponse {
  students: ClassifiedStudent[];
  total: number;
  page: number;
  limit: number;
}
