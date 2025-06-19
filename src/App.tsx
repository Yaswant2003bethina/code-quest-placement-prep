
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import Index from './pages/Index';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/Dashboard';
import Problems from './pages/student/Problems';
import ProblemDetail from './pages/student/ProblemDetail';
import AdminProblems from './pages/admin/AdminProblems';
import CreateProblem from './pages/admin/CreateProblem';
import Leaderboard from './pages/Leaderboard';
import NotFound from './pages/NotFound';
import { AuthProvider } from './contexts/AuthContext';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-background">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/problems" element={<Problems />} />
              <Route path="/problem/:id" element={<ProblemDetail />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/admin/problems" element={<AdminProblems />} />
              <Route path="/admin/problem/create" element={<CreateProblem />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
