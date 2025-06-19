
export interface Problem {
  id: number;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  module: string;
  tags: string[];
  constraints?: string;
  inputFormat?: string;
  outputFormat?: string;
  sampleInput: string;
  sampleOutput: string;
  explanation?: string;
  testCases: TestCase[];
  solved?: boolean;
  acceptance: string;
  submissions: string;
}

export interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  isHidden: boolean;
}

export interface Submission {
  id: string;
  problemId: number;
  userId: string;
  code: string;
  language: string;
  status: 'Accepted' | 'Wrong Answer' | 'Runtime Error' | 'Time Limit Exceeded' | 'Compilation Error';
  score: number;
  submittedAt: Date;
  executionTime?: number;
}

export interface LeaderboardEntry {
  userId: string;
  username: string;
  totalSolved: number;
  totalScore: number;
  moduleProgress: Record<string, number>;
}
