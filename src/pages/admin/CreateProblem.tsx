
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Navigation } from '../../components/Navigation';
import { ProtectedRoute } from '../../components/ProtectedRoute';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { ArrowLeft, Plus, Trash2, Save } from 'lucide-react';
import { toast } from 'sonner';

interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  isHidden: boolean;
}

export default function CreateProblem() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    difficulty: '',
    category: '',
    module: '',
    tags: '',
    constraints: '',
    inputFormat: '',
    outputFormat: '',
    sampleInput: '',
    sampleOutput: '',
    explanation: ''
  });
  
  const [testCases, setTestCases] = useState<TestCase[]>([
    { id: '1', input: '', expectedOutput: '', isHidden: false }
  ]);

  const modules = [
    'Basic Programming',
    'Data Structures',
    'Algorithms',
    'Dynamic Programming',
    'Graph Theory',
    'Mathematics',
    'String Processing'
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addTestCase = () => {
    const newId = (testCases.length + 1).toString();
    setTestCases(prev => [...prev, { id: newId, input: '', expectedOutput: '', isHidden: false }]);
  };

  const removeTestCase = (id: string) => {
    if (testCases.length > 1) {
      setTestCases(prev => prev.filter(tc => tc.id !== id));
    }
  };

  const updateTestCase = (id: string, field: keyof TestCase, value: string | boolean) => {
    setTestCases(prev => prev.map(tc => 
      tc.id === id ? { ...tc, [field]: value } : tc
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.title || !formData.description || !formData.difficulty || !formData.module) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Validate test cases
    const validTestCases = testCases.filter(tc => tc.input && tc.expectedOutput);
    if (validTestCases.length === 0) {
      toast.error('Please add at least one valid test case');
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Problem created successfully!');
      navigate('/admin/problems');
    } catch (error) {
      toast.error('Failed to create problem');
    }
  };

  return (
    <ProtectedRoute requireAdmin>
      <div className="min-h-screen bg-background">
        <Navigation />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <Link to="/admin/problems" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Problems
            </Link>
            
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Create New Problem</h1>
                <p className="text-gray-600 mt-2">Add a new coding problem with modular organization</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="title">Problem Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="e.g., Two Sum"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="difficulty">Difficulty *</Label>
                    <Select value={formData.difficulty} onValueChange={(value) => handleInputChange('difficulty', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Easy">Easy</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="module">Module *</Label>
                    <Select value={formData.module} onValueChange={(value) => handleInputChange('module', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select module" />
                      </SelectTrigger>
                      <SelectContent>
                        {modules.map(module => (
                          <SelectItem key={module} value={module}>{module}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Array">Array</SelectItem>
                        <SelectItem value="String">String</SelectItem>
                        <SelectItem value="Math">Math</SelectItem>
                        <SelectItem value="Search">Search</SelectItem>
                        <SelectItem value="Sort">Sort</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="tags">Tags</Label>
                  <Input
                    id="tags"
                    value={formData.tags}
                    onChange={(e) => handleInputChange('tags', e.target.value)}
                    placeholder="e.g., Array, Hash Table"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Problem Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe the problem in detail..."
                    className="min-h-[120px]"
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Sample Example */}
            <Card>
              <CardHeader>
                <CardTitle>Sample Example</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="sampleInput">Sample Input</Label>
                    <Textarea
                      id="sampleInput"
                      value={formData.sampleInput}
                      onChange={(e) => handleInputChange('sampleInput', e.target.value)}
                      placeholder="Enter sample input..."
                      className="min-h-[100px] font-mono text-sm"
                    />
                  </div>

                  <div>
                    <Label htmlFor="sampleOutput">Sample Output</Label>
                    <Textarea
                      id="sampleOutput"
                      value={formData.sampleOutput}
                      onChange={(e) => handleInputChange('sampleOutput', e.target.value)}
                      placeholder="Enter expected output..."
                      className="min-h-[100px] font-mono text-sm"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="explanation">Explanation</Label>
                  <Textarea
                    id="explanation"
                    value={formData.explanation}
                    onChange={(e) => handleInputChange('explanation', e.target.value)}
                    placeholder="Explain the sample case..."
                    className="min-h-[80px]"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Test Cases */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle>Test Cases</CardTitle>
                <Button type="button" variant="outline" size="sm" onClick={addTestCase}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Test Case
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                {testCases.map((testCase, index) => (
                  <div key={testCase.id} className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Test Case {index + 1}</h4>
                      {testCases.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeTestCase(testCase.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Input</Label>
                        <Textarea
                          value={testCase.input}
                          onChange={(e) => updateTestCase(testCase.id, 'input', e.target.value)}
                          placeholder="Enter test input..."
                          className="min-h-[80px] font-mono text-sm"
                        />
                      </div>

                      <div>
                        <Label>Expected Output</Label>
                        <Textarea
                          value={testCase.expectedOutput}
                          onChange={(e) => updateTestCase(testCase.id, 'expectedOutput', e.target.value)}
                          placeholder="Enter expected output..."
                          className="min-h-[80px] font-mono text-sm"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={() => navigate('/admin/problems')}>
                Cancel
              </Button>
              <Button type="submit">
                Create Problem
              </Button>
            </div>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
}
