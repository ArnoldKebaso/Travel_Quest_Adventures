import React, { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { Avatar, AvatarFallback } from './ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from './ui/dropdown-menu';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './ui/popover';
import { User, Menu, LogOut, Heart, Shield, MoreHorizontal, Moon, Sun } from 'lucide-react';
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

export function Navigation({ currentPage, onNavigate, user, isAdmin }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [savedCount] = useState(3); // Mock saved count - in real app, get from user's saved destinations

  const handleSignIn = () => {
    onNavigate('auth');
  };

  const handleAdminSignIn = () => {
    onNavigate('admin-auth');
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      onNavigate('home');
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // In a real app, you'd implement actual dark mode logic here
    toast.info('Dark mode toggle coming soon!');
  };

  const navItems = [
    { label: 'Home', page: 'home' as Page },
    { label: 'Destinations', page: 'listings' as Page },
    { label: 'Tours', page: 'tours' as Page },
    { label: 'Blogs', page: 'blogs' as Page },
    { label: 'About', page: 'about' as Page },
    { label: 'Contact', page: 'contact' as Page },
  ];

  const adminNavItems = [
    { label: 'Dashboard', page: 'admin-dashboard' as Page },
    { label: 'Add Guide', page: 'admin-add-guide' as Page },
    { label: 'Comments', page: 'admin-comments' as Page },
    { label: 'Users', page: 'admin-users' as Page },
  ];

  const isAdminPage = currentPage.startsWith('admin-');

  // Function to render nav items with responsive behavior
  const renderNavItems = (items: typeof navItems, isMobile = false) => {
    if (isMobile) {
      return items.map((item) => (
        <button
          key={item.page}
          onClick={() => {
            onNavigate(item.page);
            setIsOpen(false);
          }}
          className={`text-left px-4 py-3 text-lg font-medium cursor-pointer transition-all duration-200 rounded-lg ${
            currentPage === item.page 
              ? 'text-orange-500 bg-orange-50' 
              : 'text-gray-700 hover:text-orange-500 hover:bg-gray-50'
          }`}
        >
          {item.label}
        </button>
      ));
    }

    // For desktop, show first 4 items, rest in overflow menu
    const visibleItems = items.slice(0, 4);
    const overflowItems = items.slice(4);

    return (
      <>
        {visibleItems.map((item) => (
          <button
            key={item.page}
            onClick={() => onNavigate(item.page)}
            className={`px-4 py-2 text-sm font-medium cursor-pointer transition-all duration-200 whitespace-nowrap rounded-md hover:bg-gray-50 ${
              currentPage === item.page 
                ? 'text-orange-500 bg-orange-50' 
                : 'text-gray-700 hover:text-orange-500'
            }`}
          >
            {item.label}
          </button>
        ))}
        
        {overflowItems.length > 0 && (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="px-3 hover:bg-gray-50">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48" align="end">
              <div className="space-y-1">
                {overflowItems.map((item) => (
                  <button
                    key={item.page}
                    onClick={() => onNavigate(item.page)}
                    className={`w-full text-left px-3 py-2 text-sm cursor-pointer transition-all duration-200 rounded-md ${
                      currentPage === item.page 
                        ? 'text-orange-500 bg-orange-50' 
                        : 'text-gray-700 hover:text-orange-500 hover:bg-gray-50'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        )}
      </>
    );
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 h-16 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center space-x-3 cursor-pointer group transition-all duration-200 hover:scale-105"
            >
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center group-hover:bg-orange-600 transition-colors duration-200">
                <span className="text-white font-bold text-sm">TQ</span>
              </div>
              <span className="hidden sm:block font-bold text-gray-900 group-hover:text-orange-500 transition-colors duration-200">TravelQuest</span>
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-2 overflow-x-auto scrollbar-hide">
            {!isAdminPage ? renderNavItems(navItems) : renderNavItems(adminNavItems)}
          </div>

          {/* Favorites Button - Desktop */}
          {!isAdminPage && (
            <div className="hidden lg:block">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigate('saved')}
                className="relative cursor-pointer hover:bg-orange-50 transition-all duration-200"
              >
                <Heart className="h-5 w-5 text-gray-600 hover:text-orange-500 transition-colors duration-200" />
                {savedCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs animate-pulse"
                  >
                    {savedCount}
                  </Badge>
                )}
              </Button>
            </div>
          )}

          {/* User Menu & Controls */}
          <div className="flex items-center space-x-3">
            {isAdmin && (
              <Badge variant="secondary" className="bg-orange-100 text-orange-700 border-orange-200">
                <Shield className="w-3 h-3 mr-1" />
                Admin
              </Badge>
            )}
            
            {/* Dark Mode Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleDarkMode}
              className="cursor-pointer hover:bg-gray-50 transition-all duration-200"
            >
              {isDarkMode ? <Sun className="h-4 w-4 text-gray-600" /> : <Moon className="h-4 w-4 text-gray-600" />}
            </Button>
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full cursor-pointer hover:bg-gray-50 transition-all duration-200">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-orange-100 text-orange-700">
                        {user.email?.[0]?.toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user.user_metadata?.full_name || user.email}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onNavigate('account')} className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    Account
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onNavigate('saved')} className="cursor-pointer">
                    <Heart className="mr-2 h-4 w-4" />
                    Saved Destinations
                    {savedCount > 0 && (
                      <Badge variant="destructive" className="ml-auto text-xs">
                        {savedCount}
                      </Badge>
                    )}
                  </DropdownMenuItem>
                  {isAdmin && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => onNavigate(isAdminPage ? 'home' : 'admin-dashboard')} 
                        className="cursor-pointer"
                      >
                        <Shield className="mr-2 h-4 w-4" />
                        {isAdminPage ? 'Exit Admin' : 'Admin Dashboard'}
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleAdminSignIn} 
                  className="cursor-pointer text-xs hover:bg-gray-50 transition-all duration-200"
                >
                  <Shield className="w-3 h-3 mr-1" />
                  Admin
                </Button>
                <Button 
                  onClick={handleSignIn} 
                  className="bg-orange-500 hover:bg-orange-600 cursor-pointer transition-all duration-200 hover:scale-105"
                >
                  Sign In
                </Button>
              </div>
            )}

            {/* Mobile menu button */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden cursor-pointer hover:bg-gray-50 transition-all duration-200">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col space-y-4 mt-8">
                  {/* Mobile Favorites Button */}
                  {!isAdminPage && (
                    <div className="pb-4 border-b">
                      <Button
                        onClick={() => {
                          onNavigate('saved');
                          setIsOpen(false);
                        }}
                        variant="outline"
                        className="w-full justify-start cursor-pointer hover:bg-orange-50 transition-all duration-200"
                      >
                        <Heart className="mr-2 h-4 w-4" />
                        Favorites
                        {savedCount > 0 && (
                          <Badge variant="destructive" className="ml-auto">
                            {savedCount}
                          </Badge>
                        )}
                      </Button>
                    </div>
                  )}

                  {!user && (
                    <div className="space-y-2 pb-4 border-b">
                      <Button 
                        onClick={() => {
                          handleSignIn();
                          setIsOpen(false);
                        }}
                        className="w-full bg-orange-500 hover:bg-orange-600 cursor-pointer transition-all duration-200"
                      >
                        Sign In
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => {
                          handleAdminSignIn();
                          setIsOpen(false);
                        }}
                        className="w-full cursor-pointer hover:bg-gray-50 transition-all duration-200"
                      >
                        <Shield className="w-4 h-4 mr-2" />
                        Admin Login
                      </Button>
                    </div>
                  )}
                  
                  {/* Navigation Items */}
                  <div className="space-y-1">
                    {!isAdminPage ? renderNavItems(navItems, true) : renderNavItems(adminNavItems, true)}
                  </div>

                  {user && (
                    <div className="pt-4 border-t space-y-1">
                      <button
                        onClick={() => {
                          onNavigate('account');
                          setIsOpen(false);
                        }}
                        className="text-left px-4 py-3 text-lg font-medium cursor-pointer text-gray-700 hover:text-orange-500 hover:bg-gray-50 w-full rounded-lg transition-all duration-200"
                      >
                        Account
                      </button>
                      {isAdmin && (
                        <button
                          onClick={() => {
                            onNavigate(isAdminPage ? 'home' : 'admin-dashboard');
                            setIsOpen(false);
                          }}
                          className="text-left px-4 py-3 text-lg font-medium cursor-pointer text-gray-700 hover:text-orange-500 hover:bg-gray-50 w-full rounded-lg transition-all duration-200"
                        >
                          {isAdminPage ? 'Exit Admin' : 'Admin Dashboard'}
                        </button>
                      )}
                      <button
                        onClick={() => {
                          handleSignOut();
                          setIsOpen(false);
                        }}
                        className="text-left px-4 py-3 text-lg font-medium cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50 w-full rounded-lg transition-all duration-200"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}