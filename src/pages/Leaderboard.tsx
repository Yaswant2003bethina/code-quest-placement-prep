
import { Navigation } from '../components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Trophy, Award, Star } from 'lucide-react';
import { useProblems } from '../hooks/useProblems';

export default function Leaderboard() {
  const { leaderboard, getModules } = useProblems();
  const modules = getModules();

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Trophy className="h-6 w-6 text-yellow-500" />;
      case 2: return <Award className="h-6 w-6 text-gray-400" />;
      case 3: return <Star className="h-6 w-6 text-amber-600" />;
      default: return <span className="text-lg font-bold text-gray-600">#{rank}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Leaderboard</h1>
          <p className="text-gray-600">Top performers across all modules</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Leaderboard */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Overall Rankings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {leaderboard.map((entry, index) => (
                    <div key={entry.userId} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 flex items-center justify-center">
                          {getRankIcon(index + 1)}
                        </div>
                        <div>
                          <div className="font-semibold text-lg">{entry.username}</div>
                          <div className="text-sm text-gray-600">
                            {entry.totalSolved} problems solved
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-blue-600">
                          {entry.totalScore}
                        </div>
                        <div className="text-sm text-gray-600">points</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Module Progress */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Module Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {modules.map((module) => (
                  <div key={module.name} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{module.name}</span>
                      <Badge variant="outline">
                        {module.solvedProblems}/{module.totalProblems}
                      </Badge>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(module.solvedProblems / module.totalProblems) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Your Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">12</div>
                    <div className="text-sm text-gray-600">Solved</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">1100</div>
                    <div className="text-sm text-gray-600">Points</div>
                  </div>
                </div>
                <div className="text-center">
                  <Badge className="bg-orange-100 text-orange-800">
                    Rank #2
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
