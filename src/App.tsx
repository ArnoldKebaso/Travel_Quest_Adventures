import { useState, useEffect, useCallback, useMemo } from 'react';
import { Home } from './components/Home';
import { Home as NewHome } from './components/NewHome';
import { TravelListings } from './components/TravelListings';
import { NewTravelListings } from './components/NewTravelListings';
import { DestinationDetail } from './components/DestinationDetail';
import { NewDestinationDetail } from './components/NewDestinationDetail';
import { BlogsPage } from './components/BlogsPage';
import { ToursPage } from './components/ToursPage';
import { AboutUs } from './components/AboutUs';
import { ContactPage } from './components/ContactPage';
import { UserAccount } from './components/UserAccount';
import { SavedDestinations } from './components/SavedDestinations';
import { TourDetails } from './components/TourDetails';
import { BlogDetails } from './components/BlogDetails';
import { Auth } from './components/Auth';
import { AdminAuth } from './components/AdminAuth';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminAddGuide } from './components/AdminAddGuide';
import { AdminCommentModeration } from './components/AdminCommentModeration';
import { AdminUsers } from './components/AdminUsers';
import { NewNavigation } from './components/NewNavigation';
import { NotFound } from './components/NotFound';
import { ThemeProvider } from './components/ThemeProvider';
import { Toaster } from './components/ui/sonner';
import { supabase } from './utils/supabase/client';
import type { User } from '@supabase/supabase-js';

type Page = 'home' | 'listings' | 'destination' | 'account' | 'saved' | 'auth' | 'admin-auth' | 'admin-dashboard' | 'admin-add-guide' | 'admin-comments' | 'admin-users' | 'not-found' | 'blogs' | 'tours' | 'about' | 'contact' | 'tour-details' | 'blog-details';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedDestination, setSelectedDestination] = useState<string | null>(null);
  const [selectedTourId, setSelectedTourId] = useState<string | null>(null);
  const [selectedBlogId, setSelectedBlogId] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const useNewDesign = true; // Using new modern design

  // Valid routes mapping
  const validRoutes = useMemo(() => ({
    '/': 'home',
    '/home': 'home',
    '/listings': 'listings',
    '/destination': 'destination',
    '/blogs': 'blogs',
    '/tours': 'tours',
    '/tour-details': 'tour-details',
    '/blog-details': 'blog-details',
    '/about': 'about',
    '/contact': 'contact',
    '/account': 'account',
    '/saved': 'saved',
    '/auth': 'auth',
    '/admin-auth': 'admin-auth',
    '/admin-dashboard': 'admin-dashboard',
    '/admin-add-guide': 'admin-add-guide',
    '/admin-comments': 'admin-comments',
    '/admin-users': 'admin-users',
    '/404': 'not-found'
  } as Record<string, Page>), []);

  // Function to get page from URL
  const getPageFromURL = useCallback((): Page => {
    const pathname = window.location.pathname;
    
    // Handle destination with query params
    if (pathname === '/destination' && window.location.search) {
      const params = new URLSearchParams(window.location.search);
      const destinationId = params.get('id');
      if (destinationId) {
        setSelectedDestination(destinationId);
      }
    }
    
    // Handle tour details with query params
    if (pathname === '/tour-details' && window.location.search) {
      const params = new URLSearchParams(window.location.search);
      const tourId = params.get('id');
      if (tourId) {
        setSelectedTourId(tourId);
      }
    }
    
    // Handle blog details with query params
    if (pathname === '/blog-details' && window.location.search) {
      const params = new URLSearchParams(window.location.search);
      const blogId = params.get('id');
      if (blogId) {
        setSelectedBlogId(blogId);
      }
    }
    
    return validRoutes[pathname] || 'not-found';
  }, [validRoutes]);

  // Function to update URL when page changes
  const updateURL = useCallback((page: Page) => {
    const url = Object.keys(validRoutes).find(key => validRoutes[key] === page);
    if (page === 'not-found') {
      window.history.replaceState(null, '', '/404');
    } else if (url && window.location.pathname !== url) {
      window.history.pushState(null, '', url);
    }
  }, [validRoutes]);

  // Enhanced setCurrentPage that syncs with URL
  const navigateToPage = useCallback((page: Page) => {
    setCurrentPage(page);
    updateURL(page);
  }, [updateURL]);

  const checkAdminStatus = (currentUser: User | null) => {
    if (!currentUser) return false;
    
    // Check if user is admin through multiple methods
    const isAdminByEmail = currentUser.email?.includes('admin');
    const isAdminByMetadata = currentUser.user_metadata?.role === 'admin';
    const isAdminByAppMetadata = currentUser.app_metadata?.role === 'admin';
    
    return isAdminByEmail || isAdminByMetadata || isAdminByAppMetadata;
  };

  useEffect(() => {
    // Set initial page based on URL
    const initialPage = getPageFromURL();
    setCurrentPage(initialPage);

    // Handle browser back/forward navigation
    const handlePopState = () => {
      const page = getPageFromURL();
      setCurrentPage(page);
    };

    window.addEventListener('popstate', handlePopState);

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
          navigateToPage('admin-dashboard');
        } else {
          // Redirect regular users to account page
          navigateToPage('account');
        }
      }

      // Handle sign out
      if (event === 'SIGNED_OUT') {
        navigateToPage('home');
      }
    });

    // Listen for mock auth changes (for demo mode)
    const handleMockAuthChange = (event: Event) => {
      const customEvent = event as CustomEvent;
      const { event: authEvent, session } = customEvent.detail;
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      
      const adminStatus = checkAdminStatus(currentUser);
      setIsAdmin(adminStatus);

      // Handle post-login redirection
      if (authEvent === 'SIGNED_IN' && currentUser) {
        if (adminStatus) {
          navigateToPage('admin-dashboard');
        } else {
          navigateToPage('account');
        }
      }

      if (authEvent === 'SIGNED_OUT') {
        navigateToPage('home');
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('supabase-auth-change', handleMockAuthChange);
    }

    return () => {
      subscription?.unsubscribe();
      window.removeEventListener('popstate', handlePopState);
      if (typeof window !== 'undefined') {
        window.removeEventListener('supabase-auth-change', handleMockAuthChange);
      }
    };
  }, [getPageFromURL, navigateToPage]);

  const handleDestinationSelect = (destinationId: string) => {
    setSelectedDestination(destinationId);
    setCurrentPage('destination');
    // Update URL with destination ID as query parameter
    window.history.pushState(null, '', `/destination?id=${destinationId}`);
  };

  const handleTourSelect = (tourId: string) => {
    setSelectedTourId(tourId);
    setCurrentPage('tour-details');
    // Update URL with tour ID as query parameter
    window.history.pushState(null, '', `/tour-details?id=${tourId}`);
  };

  const handleBlogSelect = (blogId: string) => {
    setSelectedBlogId(blogId);
    setCurrentPage('blog-details');
    // Update URL with blog ID as query parameter
    window.history.pushState(null, '', `/blog-details?id=${blogId}`);
  };

  const handleAuthSuccess = () => {
    // This will be handled by the auth state change listener
    // but we can add immediate feedback here if needed
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return useNewDesign ? (
          <NewHome onDestinationSelect={handleDestinationSelect} onNavigate={navigateToPage} />
        ) : (
          <Home onDestinationSelect={handleDestinationSelect} onNavigate={navigateToPage} />
        );
      case 'listings':
        return useNewDesign ? (
          <NewTravelListings onDestinationSelect={handleDestinationSelect} onNavigate={navigateToPage} user={user} isAdmin={isAdmin} />
        ) : (
          <TravelListings onDestinationSelect={handleDestinationSelect} />
        );
      case 'destination':
        return useNewDesign ? (
          <NewDestinationDetail 
            destinationId={selectedDestination} 
            onBack={() => navigateToPage('listings')} 
            onNavigate={navigateToPage}
            user={user}
            isAdmin={isAdmin}
          />
        ) : (
          <DestinationDetail 
            destinationId={selectedDestination} 
            onBack={() => navigateToPage('listings')} 
            user={user}
          />
        );
      case 'account':
        return user ? (
          <UserAccount user={user} onNavigate={navigateToPage} />
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
        return <Auth onAuthSuccess={handleAuthSuccess} onNavigate={navigateToPage} user={user} isAdmin={isAdmin} />;
      case 'admin-auth':
        return <AdminAuth onAuthSuccess={handleAuthSuccess} onNavigate={navigateToPage} user={user} isAdmin={isAdmin} />;
      case 'admin-dashboard':
        return isAdmin ? (
          <AdminDashboard onNavigate={navigateToPage} />
        ) : (
          <AdminAuth onAuthSuccess={handleAuthSuccess} onNavigate={navigateToPage} user={user} isAdmin={isAdmin} />
        );
      case 'admin-add-guide':
        return isAdmin ? (
          <AdminAddGuide onNavigate={navigateToPage} user={user} isAdmin={isAdmin} />
        ) : (
          <AdminAuth onAuthSuccess={handleAuthSuccess} onNavigate={navigateToPage} user={user} isAdmin={isAdmin} />
        );
      case 'admin-comments':
        return isAdmin ? (
          <AdminCommentModeration onNavigate={navigateToPage} user={user} isAdmin={isAdmin} />
        ) : (
          <AdminAuth onAuthSuccess={handleAuthSuccess} onNavigate={navigateToPage} user={user} isAdmin={isAdmin} />
        );
      case 'admin-users':
        return isAdmin ? (
          <AdminUsers onNavigate={navigateToPage} user={user} isAdmin={isAdmin} />
        ) : (
          <AdminAuth onAuthSuccess={handleAuthSuccess} onNavigate={navigateToPage} user={user} isAdmin={isAdmin} />
        );
      case 'blogs':
        return <BlogsPage onNavigate={navigateToPage} onBlogSelect={handleBlogSelect} user={user} isAdmin={isAdmin} />;
      case 'blog-details':
        return <BlogDetails blogId={selectedBlogId || "1"} onNavigate={navigateToPage} user={user} isAdmin={isAdmin} />;
      case 'tours':
        return <ToursPage onNavigate={navigateToPage} onTourSelect={handleTourSelect} user={user} isAdmin={isAdmin} />;
      case 'tour-details':
        return <TourDetails tourId={selectedTourId || "1"} onNavigate={navigateToPage} user={user} isAdmin={isAdmin} />;
      case 'about':
        return <AboutUs onNavigate={navigateToPage} user={user} isAdmin={isAdmin} />;
      case 'contact':
        return <ContactPage onNavigate={navigateToPage} user={user} isAdmin={isAdmin} />;
      case 'not-found':
        return <NotFound onNavigate={navigateToPage} />;
      default:
        return <NotFound onNavigate={navigateToPage} />;
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
    <ThemeProvider>
      <div className="min-h-screen bg-background">
        {showNavigation && (
          <NewNavigation 
            currentPage={currentPage} 
            onNavigate={navigateToPage} 
            user={user}
            isAdmin={isAdmin}
          />
        )}
        <main className="">
          {renderPage()}
        </main>
        <Toaster />
      </div>
    </ThemeProvider>
  );
}