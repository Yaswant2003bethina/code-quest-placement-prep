
import { useState, useEffect } from 'react';
import { Problem, Submission, LeaderboardEntry } from '../types/problem';

// Mock data with modules
const mockProblems: Problem[] = [
  {
    id: 1,
    title: "Two Sum",
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    difficulty: "Easy",
    category: "Array",
    module: "Basic Programming",
    tags: ["Array", "Hash Table"],
    sampleInput: "[2,7,11,15]\n9",
    sampleOutput: "[0,1]",
    explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
    testCases: [
      { id: "1", input: "[2,7,11,15]\n9", expectedOutput: "[0,1]", isHidden: false },
      { id: "2", input: "[3,2,4]\n6", expectedOutput: "[1,2]", isHidden: true }
    ],
    solved: false,
    acceptance: "65%",
    submissions: "234"
  },
  {
    id: 2,
    title: "Fibonacci Sequence",
    description: "Write a function to generate the nth Fibonacci number.",
    difficulty: "Easy",
    category: "Math",
    module: "Basic Programming",
    tags: ["Math", "Recursion"],
    sampleInput: "5",
    sampleOutput: "5",
    testCases: [
      { id: "1", input: "5", expectedOutput: "5", isHidden: false },
      { id: "2", input: "10", expectedOutput: "55", isHidden: true }
    ],
    solved: false,
    acceptance: "70%",
    submissions: "189"
  },
  {
    id: 3,
    title: "Binary Search",
    description: "Implement binary search algorithm.",
    difficulty: "Medium",
    category: "Search",
    module: "Algorithms",
    tags: ["Binary Search", "Array"],
    sampleInput: "[1,2,3,4,5]\n3",
    sampleOutput: "2",
    testCases: [
      { id: "1", input: "[1,2,3,4,5]\n3", expectedOutput: "2", isHidden: false }
    ],
    solved: false,
    acceptance: "55%",
    submissions: "156"
  }
];

const mockSubmissions: Submission[] = [];
const mockLeaderboard: LeaderboardEntry[] = [
  {
    userId: "1",
    username: "Alice Johnson",
    totalSolved: 15,
    totalScore: 1250,
    moduleProgress: { "Basic Programming": 8, "Algorithms": 7 }
  },
  {
    userId: "2", 
    username: "Bob Smith",
    totalSolved: 12,
    totalScore: 1100,
    moduleProgress: { "Basic Programming": 7, "Algorithms": 5 }
  }
];

export const useProblems = () => {
  const [problems, setProblems] = useState<Problem[]>(mockProblems);
  const [submissions, setSubmissions] = useState<Submission[]>(mockSubmissions);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(mockLeaderboard);

  const submitSolution = async (problemId: number, code: string, userId: string): Promise<Submission> => {
    const problem = problems.find(p => p.id === problemId);
    if (!problem) throw new Error('Problem not found');

    // Simulate code execution and testing
    const submission: Submission = {
      id: Date.now().toString(),
      problemId,
      userId,
      code,
      language: 'python',
      status: 'Accepted', // Simplified - in real app, run tests
      score: 100,
      submittedAt: new Date(),
      executionTime: 45
    };

    setSubmissions(prev => [submission, ...prev]);
    
    // Mark problem as solved
    setProblems(prev => prev.map(p => 
      p.id === problemId ? { ...p, solved: true } : p
    ));

    return submission;
  };

  const getModules = () => {
    const modules = [...new Set(problems.map(p => p.module))];
    return modules.map(module => ({
      name: module,
      totalProblems: problems.filter(p => p.module === module).length,
      solvedProblems: problems.filter(p => p.module === module && p.solved).length
    }));
  };

  return {
    problems,
    submissions,
    leaderboard,
    submitSolution,
    getModules
  };
};
