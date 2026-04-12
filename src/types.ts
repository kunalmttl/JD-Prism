
export interface JobDescription {
  id: string;
  companyName: string;
  role: string;
  summary: string;
  keyRequirements: string[];
  technicalSkills: string[];
  softSkills: string[];
  rawText: string;
  fileName: string;
}

export interface AggregatedInsights {
  commonTechnicalSkills: { skill: string; count: number; percentage: number }[];
  commonSoftSkills: { skill: string; count: number; percentage: number }[];
  studyPriority: { topic: string; reason: string; priority: 'High' | 'Medium' | 'Low' }[];
  overallSummary: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}
