
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Navigation } from '../../components/Navigation';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { ArrowLeft, CheckCircle, Clock, BarChart3 } from 'lucide-react';
import { CodeEditor } from '../../components/CodeEditor';
import { useProblems } from '../../hooks/useProblems';
import { useAuth } from '../../contexts/AuthContext';

export default function ProblemDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const { problems, submitSolution } = useProblems();
  
  const problem = problems.find(p => p.id === parseInt(id || '0'));

  if (!problem) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Problem not found</h1>
            <Link to="/problems" className="text-blue-600 hover:text-blue-800">
              Back to Problems
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (code: string) => {
    if (!user) return;
    await submitSolution(problem.id, code, user.id);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const defaultCode = `def solution():
    # Write your solution here
    pass

# Test with sample input
result = solution()
print(result)`;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-6">
          <Link to="/problems" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Problems
          </Link>
          
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{problem.title}</h1>
                {problem.solved && (
                  <CheckCircle className="h-6 w-6 text-green-500" />
                )}
              </div>
              <div className="flex items-center space-x-3">
                <Badge className={getDifficultyColor(problem.difficulty)}>
                  {problem.difficulty}
                </Badge>
                <Badge variant="outline">{problem.category}</Badge>
                <Badge variant="secondary">{problem.module}</Badge>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <BarChart3 className="h-4 w-4" />
                    <span>{problem.acceptance} Acceptance</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{problem.submissions} Submissions</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Problem Description */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Problem Description</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="prose prose-sm max-w-none">
                  <p className="whitespace-pre-line">{problem.description}</p>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {problem.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Examples</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Example 1:</h4>
                    <div className="bg-gray-50 p-3 rounded-md">
                      <div className="mb-2">
                        <strong>Input:</strong>
                        <pre className="text-sm mt-1">{problem.sampleInput}</pre>
                      </div>
                      <div className="mb-2">
                        <strong>Output:</strong>
                        <pre className="text-sm mt-1">{problem.sampleOutput}</pre>
                      </div>
                      {problem.explanation && (
                        <div>
                          <strong>Explanation:</strong>
                          <p className="text-sm mt-1">{problem.explanation}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {problem.constraints && (
              <Card>
                <CardHeader>
                  <CardTitle>Constraints</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="text-sm whitespace-pre-line">{problem.constraints}</pre>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Code Editor */}
          <div>
            <CodeEditor
              onSubmit={handleSubmit}
              testCases={problem.testCases}
              defaultCode={defaultCode}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
