export interface UserProfile {
  name: string;
  email: string;
  avatarUrl?: string;
}

export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  salary: string;
  description: string;
  requirements: string[];
  status: string;
  postedDate: string;
  applicantsCount: number;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  appliedJobId: string;
  appliedJobTitle: string;
  experienceYears: number;
  skills: string[];
  matchScore: number;
  status: string;
  matchBreakdown: {
    skillsMatch: number;
    experienceMatch: number;
    culturalFit: number;
  };
  missingQualifications: string[];
  justification: string;
  resumeText: string;
  appliedDate: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export interface InterviewQuestion {
  question: string;
  focusArea: string;
  evaluationGuideline: string;
}

export interface AnalyticsData {
  totalApplicants: number;
  shortlistedCount: number;
  avgMatchScore: number;
  avgTimeToHireDays: number;
  pipelineFunnel: { stage: string; count: number }[];
  matchScoreDistribution: { range: string; count: number }[];
  sourceOfHire: { source: string; count: number }[];
}
