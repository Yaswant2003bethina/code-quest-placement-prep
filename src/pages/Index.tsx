
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Navigation } from '../components/Navigation';
import { Code, Trophy, Users, Clock, FileText, TrendingUp } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Master Coding Interviews
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Comprehensive platform for placement preparation with real-time code execution, 
              detailed analytics, and curated problem sets from top companies.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" className="text-lg px-8">
                  Start Practicing
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg" className="text-lg px-8">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose CodePlace?</h2>
            <p className="text-lg text-gray-600">Everything you need to ace your coding interviews</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Code className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle>Real-time Code Execution</CardTitle>
                <CardDescription>
                  Execute and test your code instantly with our powerful online compiler supporting multiple languages.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <TrendingUp className="h-12 w-12 text-green-600 mb-4" />
                <CardTitle>Progress Analytics</CardTitle>
                <CardDescription>
                  Track your improvement with detailed analytics, performance metrics, and personalized insights.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Trophy className="h-12 w-12 text-yellow-600 mb-4" />
                <CardTitle>Company-wise Problems</CardTitle>
                <CardDescription>
                  Practice problems from top tech companies including Google, Microsoft, Amazon, and more.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Users className="h-12 w-12 text-purple-600 mb-4" />
                <CardTitle>Collaborative Learning</CardTitle>
                <CardDescription>
                  Learn together with discussion forums, solution sharing, and peer code reviews.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Clock className="h-12 w-12 text-red-600 mb-4" />
                <CardTitle>Timed Challenges</CardTitle>
                <CardDescription>
                  Simulate interview conditions with timed coding challenges and mock interviews.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <FileText className="h-12 w-12 text-indigo-600 mb-4" />
                <CardTitle>Study Resources</CardTitle>
                <CardDescription>
                  Access comprehensive study materials, algorithms guides, and placement preparation resources.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600">1000+</div>
              <div className="text-gray-600">Coding Problems</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600">10K+</div>
              <div className="text-gray-600">Students Practicing</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-yellow-600">50+</div>
              <div className="text-gray-600">Companies Covered</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600">95%</div>
              <div className="text-gray-600">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Your Journey?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of students who have successfully cracked their dream placements
          </p>
          <Link to="/register">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              Get Started Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Index;
