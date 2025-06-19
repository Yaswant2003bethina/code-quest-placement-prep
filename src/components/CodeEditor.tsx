
import { useState } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Play, Send, CheckCircle, XCircle } from 'lucide-react';
import { CodeExecutor } from '../services/codeExecutor';
import { TestCase } from '../types/problem';
import { toast } from 'sonner';

interface CodeEditorProps {
  onSubmit: (code: string) => Promise<void>;
  testCases: TestCase[];
  defaultCode?: string;
}

export function CodeEditor({ onSubmit, testCases, defaultCode = '' }: CodeEditorProps) {
  const [code, setCode] = useState(defaultCode);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [testResults, setTestResults] = useState<any>(null);

  const handleRunCode = async () => {
    if (!code.trim()) {
      toast.error('Please write some code first');
      return;
    }

    setIsRunning(true);
    setOutput('Running code...');

    try {
      const result = await CodeExecutor.executePython(code);
      
      if (result.status === 'success') {
        setOutput(`Output:\n${result.output}\n\nExecution time: ${result.executionTime}ms`);
        toast.success('Code executed successfully!');
      } else {
        setOutput(`Error:\n${result.error}`);
        toast.error('Code execution failed');
      }
    } catch (error) {
      setOutput(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      toast.error('Code execution failed');
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    if (!code.trim()) {
      toast.error('Please write some code first');
      return;
    }

    setIsSubmitting(true);

    try {
      // Run test cases
      const results = await CodeExecutor.runTestCases(code, testCases);
      setTestResults(results);

      if (results.passed === results.total) {
        await onSubmit(code);
        toast.success('Solution submitted successfully!');
      } else {
        toast.error(`${results.passed}/${results.total} test cases passed`);
      }
    } catch (error) {
      toast.error('Submission failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Python Code Editor</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="min-h-[300px] font-mono text-sm"
            placeholder="# Write your Python code here..."
          />
          
          <div className="flex justify-between mt-4">
            <Button variant="outline" onClick={handleRunCode} disabled={isRunning}>
              <Play className="h-4 w-4 mr-2" />
              {isRunning ? 'Running...' : 'Run Code'}
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting || isRunning}>
              <Send className="h-4 w-4 mr-2" />
              {isSubmitting ? 'Submitting...' : 'Submit Solution'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {output && (
        <Card>
          <CardHeader>
            <CardTitle>Output</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-50 p-3 rounded-md text-sm whitespace-pre-wrap">
              {output}
            </pre>
          </CardContent>
        </Card>
      )}

      {testResults && (
        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-lg font-semibold">
                {testResults.passed}/{testResults.total} test cases passed
              </div>
              {testResults.results.map((result: any, index: number) => (
                <div key={index} className="flex items-center space-x-2">
                  {result.passed ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                  <span>Test Case {index + 1}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
