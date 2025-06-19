import { TestCase } from '../types/problem';

interface ExecutionResult {
  output?: string;
  error?: string;
  status: 'success' | 'error' | 'timeout';
  executionTime?: number;
}

export class CodeExecutor {
  static async executePython(code: string, input: string = ''): Promise<ExecutionResult> {
    try {
      // Simulate Python execution with web worker or API call
      // In a real implementation, this would call a backend service
      const startTime = Date.now();
      
      // Basic Python simulation - replace with actual Python execution service
      const result = await this.simulatePythonExecution(code, input);
      const executionTime = Date.now() - startTime;
      
      return {
        ...result,
        executionTime
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Unknown error',
        status: 'error'
      };
    }
  }

  private static async simulatePythonExecution(code: string, input: string): Promise<ExecutionResult> {
    // This is a simulation - in production, use Pyodide or backend service
    return new Promise((resolve) => {
      setTimeout(() => {
        try {
          // Basic validation
          if (code.includes('print(')) {
            const match = code.match(/print\((.*?)\)/);
            if (match) {
              resolve({
                output: match[1].replace(/['"]/g, ''),
                status: 'success'
              });
            }
          } else {
            resolve({
              output: 'Code executed successfully',
              status: 'success'
            });
          }
        } catch {
          resolve({
            error: 'Execution failed',
            status: 'error'
          });
        }
      }, 1000);
    });
  }

  static async runTestCases(code: string, testCases: TestCase[]): Promise<{
    passed: number;
    total: number;
    results: Array<{ passed: boolean; output?: string; error?: string }>;
  }> {
    const results = [];
    let passed = 0;

    for (const testCase of testCases) {
      const result = await this.executePython(code, testCase.input);
      const testPassed = result.status === 'success' && 
                        result.output?.trim() === testCase.expectedOutput.trim();
      
      if (testPassed) passed++;
      
      results.push({
        passed: testPassed,
        output: result.output,
        error: result.error
      });
    }

    return { passed, total: testCases.length, results };
  }
}
