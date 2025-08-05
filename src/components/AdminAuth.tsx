import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { NewNavigation } from './NewNavigation';
import { Footer } from './Footer';
import { Eye, EyeOff, Shield, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import type { User as SupabaseUser } from '@supabase/supabase-js';

type Page = 'home' | 'listings' | 'destination' | 'account' | 'saved' | 'auth' | 'admin-auth' | 'admin-dashboard' | 'admin-add-guide' | 'admin-comments' | 'admin-users' | 'not-found' | 'blogs' | 'tours' | 'about' | 'contact' | 'tour-details' | 'blog-details';

interface AdminAuthProps {
  onAuthSuccess?: () => void;
  onNavigate?: (page: Page) => void;
  user?: SupabaseUser | null;
  isAdmin?: boolean;
}

// Simple hardcoded admin credentials
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin123'
};

export function AdminAuth({ onAuthSuccess, onNavigate, user, isAdmin }: AdminAuthProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate loading time
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check credentials
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      // Store admin status in localStorage for persistence
      localStorage.setItem('isAdminAuthenticated', 'true');
      localStorage.setItem('adminUser', JSON.stringify({
        id: 'admin-001',
        email: 'admin@travelquest.com',
        user_metadata: { role: 'admin', full_name: 'Administrator' },
        role: 'admin'
      }));

      toast.success('Admin login successful');
      
      // Trigger auth success and navigate to admin dashboard
      if (onAuthSuccess) onAuthSuccess();
      if (onNavigate) onNavigate('admin-dashboard');
    } else {
      setError('Invalid username or password');
      toast.error('Invalid credentials');
    }

    setIsLoading(false);
  };

  const handleNavigate = (page: Page) => {
    if (onNavigate) {
      onNavigate(page);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NewNavigation 
        currentPage="admin-auth" 
        onNavigate={handleNavigate} 
        user={user || null}
        isAdmin={isAdmin || false}
      />

      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-8">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold">Admin Portal</CardTitle>
            <p className="text-gray-600">
              Enter your admin credentials to access the dashboard
            </p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium text-gray-700">
                  Username
                </label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    required
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            {/* Demo credentials info */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800 font-medium mb-2">Demo Credentials:</p>
              <p className="text-sm text-blue-700">
                <strong>Username:</strong> admin<br />
                <strong>Password:</strong> admin123
              </p>
            </div>

            <div className="mt-4 text-center">
              <Button 
                variant="ghost" 
                onClick={() => handleNavigate('home')}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                ← Back to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer onNavigate={handleNavigate} />
    </div>
  );
}