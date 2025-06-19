
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Navigation } from '../../components/Navigation';
import { Link } from 'react-router-dom';
import { BookOpen, Trophy, Clock, TrendingUp } from 'lucide-react';

export default function StudentDashboard() {
  // Mock data - replace with actual API calls
  const stats = {
    solvedProblems: 15,
    totalSubmissions: 45,
    successRate: 67,
    streak: 5
  };

  const recentSubmissions = [
    { id: 1, problem: 'Two Sum', status: 'Accepted', score: 100, time: '2 hours ago' },
    { id: 2, problem: 'Reverse String', status: 'Wrong Answer', score: 0, time: '3 hours ago' },
    { id: 3, problem: 'Binary Search', status: 'Accepted', score: 100, time: '1 day ago' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Track your progress and continue learning</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Problems Solved</CardTitle>
              <Trophy className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.solvedProblems}</div>
              <p className="text-xs text-muted-foreground">Keep going!</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
              <BookOpen className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalSubmissions}</div>
              <p className="text-xs text-muted-foreground">Practice makes perfect</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.successRate}%</div>
              <p className="text-xs text-muted-foreground">Great improvement!</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
              <Clock className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.streak} days</div>
              <p className="text-xs text-muted-foreground">Keep it up!</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Submissions */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Submissions</CardTitle>
              <CardDescription>Your latest coding attempts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentSubmissions.map((submission) => (
                  <div key={submission.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{submission.problem}</p>
                      <p className="text-sm text-gray-500">{submission.time}</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 rounded text-xs ${
                        submission.status === 'Accepted' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {submission.status}
                      </span>
                      <p className="text-sm text-gray-500 mt-1">Score: {submission.score}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Continue your learning journey</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link to="/problems">
                <Button className="w-full justify-start" variant="outline">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Browse Problems
                </Button>
              </Link>
              <Button className="w-full justify-start" variant="outline">
                <Trophy className="mr-2 h-4 w-4" />
                View Leaderboard
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <TrendingUp className="mr-2 h-4 w-4" />
                View Progress Report
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
