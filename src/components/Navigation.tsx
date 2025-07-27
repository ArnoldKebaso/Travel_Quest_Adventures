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
import { User, Menu, LogOut, Heart, Shield } from 'lucide-react';
import { supabase } from '../utils/supabase/client';
import { toast } from 'sonner';
import type { User as SupabaseUser } from '@supabase/supabase-js';

type Page = 'home' | 'listings' | 'destination' | 'account' | 'saved' | 'auth' | 'admin-auth' | 'admin-dashboard' | 'admin-add-guide' | 'admin-comments' | 'admin-users';

interface NavigationProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  user: SupabaseUser | null;
  isAdmin?: boolean;
}

export function Navigation({ currentPage, onNavigate, user, isAdmin }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);

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

  const navItems = [
    { label: 'Home', page: 'home' as Page },
    { label: 'Destinations', page: 'listings' as Page },
  ];

  const adminNavItems = [
    { label: 'Dashboard', page: 'admin-dashboard' as Page },
    { label: 'Add Guide', page: 'admin-add-guide' as Page },
    { label: 'Comments', page: 'admin-comments' as Page },
    { label: 'Users', page: 'admin-users' as Page },
  ];

  const isAdminPage = currentPage.startsWith('admin-');

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 h-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">TQ</span>
              </div>
              <span className="hidden sm:block font-bold text-gray-900">TravelQuest</span>
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {!isAdminPage ? (
              <>
                {navItems.map((item) => (
                  <button
                    key={item.page}
                    onClick={() => onNavigate(item.page)}
                    className={`px-3 py-2 text-sm font-medium cursor-pointer transition-colors ${
                      currentPage === item.page 
                        ? 'text-orange-500 border-b-2 border-orange-500' 
                        : 'text-gray-700 hover:text-orange-500'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </>
            ) : (
              <>
                {adminNavItems.map((item) => (
                  <button
                    key={item.page}
                    onClick={() => onNavigate(item.page)}
                    className={`px-3 py-2 text-sm font-medium cursor-pointer transition-colors ${
                      currentPage === item.page 
                        ? 'text-orange-500 border-b-2 border-orange-500' 
                        : 'text-gray-700 hover:text-orange-500'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </>
            )}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {isAdmin && (
              <Badge variant="secondary" className="bg-orange-100 text-orange-700 border-orange-200">
                <Shield className="w-3 h-3 mr-1" />
                Admin
              </Badge>
            )}
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full cursor-pointer">
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
                  className="cursor-pointer text-xs"
                >
                  <Shield className="w-3 h-3 mr-1" />
                  Admin
                </Button>
                <Button 
                  onClick={handleSignIn} 
                  className="bg-orange-500 hover:bg-orange-600 cursor-pointer"
                >
                  Sign In
                </Button>
              </div>
            )}

            {/* Mobile menu button */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden cursor-pointer">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col space-y-4 mt-8">
                  {!user && (
                    <div className="space-y-2 pb-4 border-b">
                      <Button 
                        onClick={() => {
                          handleSignIn();
                          setIsOpen(false);
                        }}
                        className="w-full bg-orange-500 hover:bg-orange-600 cursor-pointer"
                      >
                        Sign In
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => {
                          handleAdminSignIn();
                          setIsOpen(false);
                        }}
                        className="w-full cursor-pointer"
                      >
                        <Shield className="w-4 h-4 mr-2" />
                        Admin Login
                      </Button>
                    </div>
                  )}
                  
                  {!isAdminPage ? (
                    <>
                      {navItems.map((item) => (
                        <button
                          key={item.page}
                          onClick={() => {
                            onNavigate(item.page);
                            setIsOpen(false);
                          }}
                          className={`text-left px-4 py-2 text-lg font-medium cursor-pointer transition-colors ${
                            currentPage === item.page 
                              ? 'text-orange-500 bg-orange-50' 
                              : 'text-gray-700 hover:text-orange-500'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </>
                  ) : (
                    <>
                      {adminNavItems.map((item) => (
                        <button
                          key={item.page}
                          onClick={() => {
                            onNavigate(item.page);
                            setIsOpen(false);
                          }}
                          className={`text-left px-4 py-2 text-lg font-medium cursor-pointer transition-colors ${
                            currentPage === item.page 
                              ? 'text-orange-500 bg-orange-50' 
                              : 'text-gray-700 hover:text-orange-500'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </>
                  )}

                  {user && (
                    <div className="pt-4 border-t space-y-2">
                      <button
                        onClick={() => {
                          onNavigate('account');
                          setIsOpen(false);
                        }}
                        className="text-left px-4 py-2 text-lg font-medium cursor-pointer text-gray-700 hover:text-orange-500 w-full"
                      >
                        Account
                      </button>
                      <button
                        onClick={() => {
                          onNavigate('saved');
                          setIsOpen(false);
                        }}
                        className="text-left px-4 py-2 text-lg font-medium cursor-pointer text-gray-700 hover:text-orange-500 w-full"
                      >
                        Saved Destinations
                      </button>
                      {isAdmin && (
                        <button
                          onClick={() => {
                            onNavigate(isAdminPage ? 'home' : 'admin-dashboard');
                            setIsOpen(false);
                          }}
                          className="text-left px-4 py-2 text-lg font-medium cursor-pointer text-gray-700 hover:text-orange-500 w-full"
                        >
                          {isAdminPage ? 'Exit Admin' : 'Admin Dashboard'}
                        </button>
                      )}
                      <button
                        onClick={() => {
                          handleSignOut();
                          setIsOpen(false);
                        }}
                        className="text-left px-4 py-2 text-lg font-medium cursor-pointer text-red-600 hover:text-red-700 w-full"
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