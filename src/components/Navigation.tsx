
import { Link, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { useAuth } from '../contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Code, User, LogOut, Settings, Home, BookOpen, Shield } from 'lucide-react';

export function Navigation() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <Code className="h-8 w-8 text-blue-600" />
          <span className="text-xl font-bold text-gray-900">CodePlace</span>
        </Link>

        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <Link to="/dashboard">
                <Button variant="ghost" size="sm">
                  <Home className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              
              {user.role === 'student' && (
                <Link to="/problems">
                  <Button variant="ghost" size="sm">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Problems
                  </Button>
                </Link>
              )}
              
              {user.role === 'admin' && (
                <Link to="/admin/problems">
                  <Button variant="ghost" size="sm">
                    <Shield className="h-4 w-4 mr-2" />
                    Manage Problems
                  </Button>
                </Link>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <User className="h-4 w-4 mr-2" />
                    {user.name}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Settings className="h-4 w-4 mr-2" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm">
                  Register
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
