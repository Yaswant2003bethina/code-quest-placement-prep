
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navigation } from '../../components/Navigation';
import { ProtectedRoute } from '../../components/ProtectedRoute';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../../components/ui/table';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import { Plus, Search, MoreHorizontal, Edit, Trash2, Eye } from 'lucide-react';
import { toast } from 'sonner';

// Mock data for admin problems view
const mockProblems = [
  {
    id: 1,
    title: "Two Sum",
    difficulty: "Easy",
    category: "Array",
    status: "Active",
    submissions: 234,
    acceptance: 65,
    createdAt: "2024-01-15",
    createdBy: "Admin"
  },
  {
    id: 2,
    title: "Add Two Numbers",
    difficulty: "Medium",
    category: "Linked List",
    status: "Active",
    submissions: 189,
    acceptance: 45,
    createdAt: "2024-01-14",
    createdBy: "Admin"
  },
  {
    id: 3,
    title: "Longest Substring",
    difficulty: "Medium",
    category: "String",
    status: "Draft",
    submissions: 156,
    acceptance: 55,
    createdAt: "2024-01-13",
    createdBy: "Admin"
  },
  {
    id: 4,
    title: "Median of Two Sorted Arrays",
    difficulty: "Hard",
    category: "Array",
    status: "Active",
    submissions: 89,
    acceptance: 32,
    createdAt: "2024-01-12",
    createdBy: "Admin"
  }
];

export default function AdminProblems() {
  const [searchTerm, setSearchTerm] = useState('');
  const [problems, setProblems] = useState(mockProblems);

  const filteredProblems = problems.filter(problem =>
    problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    problem.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (problemId: number) => {
    setProblems(problems.filter(p => p.id !== problemId));
    toast.success('Problem deleted successfully');
  };

  const handleStatusToggle = (problemId: number) => {
    setProblems(problems.map(p => 
      p.id === problemId 
        ? { ...p, status: p.status === 'Active' ? 'Draft' : 'Active' }
        : p
    ));
    toast.success('Problem status updated');
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Draft': return 'bg-gray-100 text-gray-800';
      case 'Archived': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <ProtectedRoute requireAdmin>
      <div className="min-h-screen bg-background">
        <Navigation />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Problem Management</h1>
              <p className="text-gray-600 mt-2">Create and manage coding problems</p>
            </div>
            <Link to="/admin/problem/create">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Problem
              </Button>
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Problems</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{problems.length}</div>
                <p className="text-xs text-muted-foreground">
                  +2 from last month
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Problems</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {problems.filter(p => p.status === 'Active').length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Currently available
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {problems.reduce((sum, p) => sum + p.submissions, 0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  All time submissions
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Acceptance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.round(problems.reduce((sum, p) => sum + p.acceptance, 0) / problems.length)}%
                </div>
                <p className="text-xs text-muted-foreground">
                  Across all problems
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search problems..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 max-w-md"
              />
            </div>
          </div>

          {/* Problems Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Problem</TableHead>
                    <TableHead>Difficulty</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submissions</TableHead>
                    <TableHead>Acceptance</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProblems.map((problem) => (
                    <TableRow key={problem.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{problem.title}</div>
                          <div className="text-sm text-gray-500">ID: {problem.id}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getDifficultyColor(problem.difficulty)}>
                          {problem.difficulty}
                        </Badge>
                      </TableCell>
                      <TableCell>{problem.category}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(problem.status)}>
                          {problem.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{problem.submissions}</TableCell>
                      <TableCell>{problem.acceptance}%</TableCell>
                      <TableCell>{problem.createdAt}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link to={`/problem/${problem.id}`}>
                                <Eye className="h-4 w-4 mr-2" />
                                View
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusToggle(problem.id)}>
                              {problem.status === 'Active' ? 'Deactivate' : 'Activate'}
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDelete(problem.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {filteredProblems.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500 mb-4">
                <Search className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No problems found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm ? 'Try adjusting your search criteria' : 'Get started by creating your first problem'}
              </p>
              {!searchTerm && (
                <Link to="/admin/problem/create">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Problem
                  </Button>
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
