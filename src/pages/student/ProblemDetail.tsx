
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Navigation } from '../../components/Navigation';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Badge } from '../../components/ui/badge';
import { Textarea } from '../../components/ui/textarea';
import { ArrowLeft, Play, Send, Clock, BarChart3 } from 'lucide-react';
import { toast } from 'sonner';

// Mock problem data
const mockProblem = {
  id: 1,
  title: "Two Sum",
  description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.`,
  difficulty: "Easy",
  category: "Array",
  tags: ["Array", "Hash Table"],
  constraints: `2 ≤ nums.length ≤ 10^4
-10^9 ≤ nums[i] ≤ 10^9
-10^9 ≤ target ≤ 10^9
Only one valid answer exists.`,
  inputFormat: "The first line contains the array nums. The second line contains the target.",
  outputFormat: "Return the indices of the two numbers that add up to target.",
  sampleInput: `[2,7,11,15]
9`,
  sampleOutput: `[0,1]`,
  explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
};

const codeTemplates = {
  python: `def two_sum(nums, target):
    # Write your solution here
    pass

# Test with sample input
nums = [2, 7, 11, 15]
target = 9
result = two_sum(nums, target)
print(result)`,
  javascript: `function twoSum(nums, target) {
    // Write your solution here
}

// Test with sample input
const nums = [2, 7, 11, 15];
const target = 9;
const result = twoSum(nums, target);
console.log(result);`,
  java: `public class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Write your solution here
        return new int[0];
    }
    
    public static void main(String[] args) {
        Solution solution = new Solution();
        int[] nums = {2, 7, 11, 15};
        int target = 9;
        int[] result = solution.twoSum(nums, target);
        System.out.println(Arrays.toString(result));
    }
}`,
  cpp: `#include <vector>
#include <iostream>
using namespace std;

vector<int> twoSum(vector<int>& nums, int target) {
    // Write your solution here
    return {};
}

int main() {
    vector<int> nums = {2, 7, 11, 15};
    int target = 9;
    vector<int> result = twoSum(nums, target);
    
    for (int i : result) {
        cout << i << " ";
    }
    return 0;
}`
};

export default function ProblemDetail() {
  const { id } = useParams();
  const [selectedLanguage, setSelectedLanguage] = useState('python');
  const [code, setCode] = useState(codeTemplates.python);
  const [customInput, setCustomInput] = useState('');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
    setCode(codeTemplates[language as keyof typeof codeTemplates]);
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput('Running code...');
    
    // Simulate code execution
    setTimeout(() => {
      setOutput('Output:\n[0, 1]\n\nExecution time: 45ms\nMemory used: 15.2MB');
      setIsRunning(false);
      toast.success('Code executed successfully!');
    }, 2000);
  };

  const handleSubmit = async () => {
    setIsRunning(true);
    
    // Simulate submission
    setTimeout(() => {
      setIsRunning(false);
      toast.success('Solution submitted successfully!');
    }, 1500);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{mockProblem.title}</h1>
              <div className="flex items-center space-x-3">
                <Badge className={getDifficultyColor(mockProblem.difficulty)}>
                  {mockProblem.difficulty}
                </Badge>
                <Badge variant="outline">{mockProblem.category}</Badge>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <BarChart3 className="h-4 w-4" />
                    <span>65% Acceptance</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>234 Submissions</span>
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
                  <p className="whitespace-pre-line">{mockProblem.description}</p>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {mockProblem.tags.map((tag) => (
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
                        <pre className="text-sm mt-1">{mockProblem.sampleInput}</pre>
                      </div>
                      <div className="mb-2">
                        <strong>Output:</strong>
                        <pre className="text-sm mt-1">{mockProblem.sampleOutput}</pre>
                      </div>
                      <div>
                        <strong>Explanation:</strong>
                        <p className="text-sm mt-1">{mockProblem.explanation}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Constraints</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-sm whitespace-pre-line">{mockProblem.constraints}</pre>
              </CardContent>
            </Card>
          </div>

          {/* Code Editor */}
          <div className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle>Code Editor</CardTitle>
                <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="python">Python</SelectItem>
                    <SelectItem value="javascript">JavaScript</SelectItem>
                    <SelectItem value="java">Java</SelectItem>
                    <SelectItem value="cpp">C++</SelectItem>
                  </SelectContent>
                </Select>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="min-h-[300px] font-mono text-sm"
                  placeholder="Write your code here..."
                />
                
                <div className="flex justify-between mt-4">
                  <Button variant="outline" onClick={handleRunCode} disabled={isRunning}>
                    <Play className="h-4 w-4 mr-2" />
                    {isRunning ? 'Running...' : 'Run Code'}
                  </Button>
                  <Button onClick={handleSubmit} disabled={isRunning}>
                    <Send className="h-4 w-4 mr-2" />
                    Submit
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Test Cases</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="custom" className="w-full">
                  <TabsList>
                    <TabsTrigger value="custom">Custom Input</TabsTrigger>
                    <TabsTrigger value="output">Output</TabsTrigger>
                  </TabsList>
                  <TabsContent value="custom">
                    <Textarea
                      value={customInput}
                      onChange={(e) => setCustomInput(e.target.value)}
                      placeholder="Enter your test input here..."
                      className="min-h-[100px] font-mono text-sm"
                    />
                  </TabsContent>
                  <TabsContent value="output">
                    <div className="bg-gray-50 p-3 rounded-md min-h-[100px]">
                      <pre className="text-sm whitespace-pre-wrap">
                        {output || 'Run your code to see output here...'}
                      </pre>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
