import React, { useState, useEffect } from 'react';
import { Home } from './components/Home';
import { TravelListings } from './components/TravelListings';
import { DestinationDetail } from './components/DestinationDetail';
import { UserAccount } from './components/UserAccount';
import { SavedDestinations } from './components/SavedDestinations';
import { Auth } from './components/Auth';
import { AdminAuth } from './components/AdminAuth';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminAddGuide } from './components/AdminAddGuide';
import { AdminCommentModeration } from './components/AdminCommentModeration';
import { AdminUsers } from './components/AdminUsers';
import { Navigation } from './components/Navigation';
import { Toaster } from './components/ui/sonner';
import { supabase } from './utils/supabase/client';
import type { User } from '@supabase/supabase-js';

type Page = 'home' | 'listings' | 'destination' | 'account' | 'saved' | 'auth' | 'admin-auth' | 'admin-dashboard' | 'admin-add-guide' | 'admin-comments' | 'admin-users';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedDestination, setSelectedDestination] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkAdminStatus = (currentUser: User | null) => {
    if (!currentUser) return false;
    
    // Check if user is admin through multiple methods
    const isAdminByEmail = currentUser.email?.includes('admin');
    const isAdminByMetadata = currentUser.user_metadata?.role === 'admin';
    const isAdminByAppMetadata = currentUser.app_metadata?.role === 'admin';
    
    return isAdminByEmail || isAdminByMetadata || isAdminByAppMetadata;
  };

  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      
      const adminStatus = checkAdminStatus(currentUser);
      setIsAdmin(adminStatus);
      
      setIsLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      
      const adminStatus = checkAdminStatus(currentUser);
      setIsAdmin(adminStatus);

      // Handle post-login redirection
      if (event === 'SIGNED_IN' && currentUser) {
        if (adminStatus) {
          // Redirect admin users to admin dashboard
          setCurrentPage('admin-dashboard');
        } else {
          // Redirect regular users to account page
          setCurrentPage('account');
        }
      }

      // Handle sign out
      if (event === 'SIGNED_OUT') {
        setCurrentPage('home');
      }
    });

    // Listen for mock auth changes (for demo mode)
    const handleMockAuthChange = (event: any) => {
      const { event: authEvent, session } = event.detail;
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      
      const adminStatus = checkAdminStatus(currentUser);
      setIsAdmin(adminStatus);

      // Handle post-login redirection
      if (authEvent === 'SIGNED_IN' && currentUser) {
        if (adminStatus) {
          setCurrentPage('admin-dashboard');
        } else {
          setCurrentPage('account');
        }
      }

      if (authEvent === 'SIGNED_OUT') {
        setCurrentPage('home');
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('supabase-auth-change', handleMockAuthChange);
    }

    return () => {
      subscription?.unsubscribe();
      if (typeof window !== 'undefined') {
        window.removeEventListener('supabase-auth-change', handleMockAuthChange);
      }
    };
  }, []);

  const handleDestinationSelect = (destinationId: string) => {
    setSelectedDestination(destinationId);
    setCurrentPage('destination');
  };

  const handleAuthSuccess = () => {
    // This will be handled by the auth state change listener
    // but we can add immediate feedback here if needed
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onDestinationSelect={handleDestinationSelect} onNavigate={setCurrentPage} />;
      case 'listings':
        return <TravelListings onDestinationSelect={handleDestinationSelect} />;
      case 'destination':
        return (
          <DestinationDetail 
            destinationId={selectedDestination} 
            onBack={() => setCurrentPage('listings')} 
            user={user}
          />
        );
      case 'account':
        return user ? (
          <UserAccount user={user} onNavigate={setCurrentPage} />
        ) : (
          <Auth onAuthSuccess={handleAuthSuccess} />
        );
      case 'saved':
        return user ? (
          <SavedDestinations user={user} onDestinationSelect={handleDestinationSelect} />
        ) : (
          <Auth onAuthSuccess={handleAuthSuccess} />
        );
      case 'auth':
        return <Auth onAuthSuccess={handleAuthSuccess} />;
      case 'admin-auth':
        return <AdminAuth onAuthSuccess={handleAuthSuccess} />;
      case 'admin-dashboard':
        return isAdmin ? (
          <AdminDashboard onNavigate={setCurrentPage} />
        ) : (
          <AdminAuth onAuthSuccess={handleAuthSuccess} />
        );
      case 'admin-add-guide':
        return isAdmin ? (
          <AdminAddGuide onNavigate={setCurrentPage} />
        ) : (
          <AdminAuth onAuthSuccess={handleAuthSuccess} />
        );
      case 'admin-comments':
        return isAdmin ? (
          <AdminCommentModeration onNavigate={setCurrentPage} />
        ) : (
          <AdminAuth onAuthSuccess={handleAuthSuccess} />
        );
      case 'admin-users':
        return isAdmin ? (
          <AdminUsers onNavigate={setCurrentPage} />
        ) : (
          <AdminAuth onAuthSuccess={handleAuthSuccess} />
        );
      default:
        return <Home onDestinationSelect={handleDestinationSelect} onNavigate={setCurrentPage} />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold">TQ</span>
          </div>
          <p className="text-gray-600">Loading TravelQuest...</p>
        </div>
      </div>
    );
  }

  // Don't show navigation on auth pages
  const showNavigation = !['auth', 'admin-auth'].includes(currentPage);

  return (
    <div className="min-h-screen bg-background">
      {showNavigation && (
        <Navigation 
          currentPage={currentPage} 
          onNavigate={setCurrentPage} 
          user={user}
          isAdmin={isAdmin}
        />
      )}
      <main className={showNavigation ? 'pt-16' : ''}>
        {renderPage()}
      </main>
      <Toaster />
    </div>
  );
}