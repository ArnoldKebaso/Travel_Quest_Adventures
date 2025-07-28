import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { Avatar, AvatarFallback } from './ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from './ui/dropdown-menu';
import { User, Menu, LogOut, Heart, Shield, Sun, Moon } from 'lucide-react';
import { supabase } from '../utils/supabase/client';
import { toast } from 'sonner';
import type { User as SupabaseUser } from '@supabase/supabase-js';

type Page = 'home' | 'listings' | 'destination' | 'account' | 'saved' | 'auth' | 'admin-auth' | 'admin-dashboard' | 'admin-add-guide' | 'admin-comments' | 'admin-users' | 'not-found' | 'blogs' | 'tours' | 'about' | 'contact';

interface NavigationProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  user: SupabaseUser | null;
  isAdmin?: boolean;
}

// Navigation items
const navItems = [
  { label: 'Home', page: 'home' as Page },
  { label: 'Destinations', page: 'listings' as Page },
  { label: 'Tours', page: 'tours' as Page },
  { label: 'Blogs', page: 'blogs' as Page },
  { label: 'About', page: 'about' as Page },
  { label: 'Contact', page: 'contact' as Page }
];

export function NewNavigation({ currentPage, onNavigate, user, isAdmin }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Check for dark mode preference on mount
  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setIsDarkMode(isDark);
  }, []);

  const handleSignIn = () => {
    onNavigate('auth');
    setIsOpen(false);
  };

  const handleAdminAccess = () => {
    onNavigate('admin-auth');
    setIsOpen(false);
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast.success('Signed out successfully');
      onNavigate('home');
      setIsOpen(false);
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Error signing out');
    }
  };

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    
    if (newMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleNavClick = (page: Page) => {
    onNavigate(page);
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 dark:bg-gray-900/95 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center space-x-2 text-xl font-bold text-gray-900 dark:text-white hover:text-primary transition-colors"
            >
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">ATE</span>
              </div>
              <span className="hidden sm:block">Aussie Travel Explorer</span>
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavClick(item.page)}
                className={`relative px-3 py-2 text-sm font-medium transition-colors hover:text-primary ${
                  currentPage === item.page
                    ? 'text-primary'
                    : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                {item.label}
                {currentPage === item.page && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                )}
              </button>
            ))}
          </div>

          {/* Right side actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Dark mode toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 text-gray-700 dark:text-gray-300 hover:text-primary transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-sm">
                        {user.email?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onNavigate('account')} className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onNavigate('saved')} className="cursor-pointer">
                    <Heart className="mr-2 h-4 w-4" />
                    <span>Saved Destinations</span>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem 
                      onClick={() => onNavigate(currentPage.startsWith('admin') ? 'home' : 'admin-dashboard')} 
                      className="cursor-pointer"
                    >
                      <Shield className="mr-2 h-4 w-4" />
                      <span>{currentPage.startsWith('admin') ? 'Exit Admin' : 'Admin Panel'}</span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-600 dark:text-red-400">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" onClick={handleSignIn}>
                  Login
                </Button>
                <Button onClick={handleSignIn}>
                  Sign Up
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Dark mode toggle for mobile */}
            <button
              onClick={toggleDarkMode}
              className="p-2 text-gray-700 dark:text-gray-300 hover:text-primary transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                <div className="flex flex-col h-full">
                  {/* Logo in mobile menu */}
                  <div className="flex items-center space-x-2 mb-8">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-sm">ATE</span>
                    </div>
                    <span className="text-xl font-bold">Aussie Travel Explorer</span>
                  </div>

                  {/* Navigation items */}
                  <div className="flex-1 space-y-4">
                    {navItems.map((item) => (
                      <button
                        key={item.label}
                        onClick={() => handleNavClick(item.page)}
                        className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                          currentPage === item.page
                            ? 'bg-primary text-white'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}

                    {/* User section in mobile */}
                    <div className="border-t pt-4 mt-8">
                      {user ? (
                        <div className="space-y-2">
                          <div className="flex items-center space-x-3 px-4 py-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="text-sm">
                                {user.email?.charAt(0).toUpperCase() || 'U'}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm text-gray-600 dark:text-gray-400 truncate">
                              {user.email}
                            </span>
                          </div>
                          
                          <button
                            onClick={() => handleNavClick('account')}
                            className="w-full text-left px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                          >
                            <User className="inline-block mr-3 h-4 w-4" />
                            Profile
                          </button>
                          
                          <button
                            onClick={() => handleNavClick('saved')}
                            className="w-full text-left px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                          >
                            <Heart className="inline-block mr-3 h-4 w-4" />
                            Saved Destinations
                          </button>

                          {isAdmin && (
                            <button
                              onClick={() => handleNavClick(currentPage.startsWith('admin') ? 'home' : 'admin-dashboard')}
                              className="w-full text-left px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            >
                              <Shield className="inline-block mr-3 h-4 w-4" />
                              {currentPage.startsWith('admin') ? 'Exit Admin' : 'Admin Panel'}
                            </button>
                          )}
                          
                          <button
                            onClick={handleSignOut}
                            className="w-full text-left px-4 py-3 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                          >
                            <LogOut className="inline-block mr-3 h-4 w-4" />
                            Log out
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Button 
                            onClick={handleSignIn}
                            className="w-full"
                          >
                            Login / Sign Up
                          </Button>
                          {!isAdmin && (
                            <Button 
                              variant="outline"
                              onClick={handleAdminAccess}
                              className="w-full"
                            >
                              Admin Access
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
