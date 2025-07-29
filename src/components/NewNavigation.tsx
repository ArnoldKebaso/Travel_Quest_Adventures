import { useState } from 'react';
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
import { ThemeToggle } from './ThemeToggle';
import { supabase } from '../utils/supabase/client';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import type { User as SupabaseUser } from '@supabase/supabase-js';

type Page = 'home' | 'listings' | 'destination' | 'account' | 'saved' | 'auth' | 'admin-auth' | 'admin-dashboard' | 'admin-add-guide' | 'admin-comments' | 'admin-users' | 'not-found' | 'blogs' | 'tours' | 'about' | 'contact' | 'tour-details' | 'blog-details';

interface NewNavigationProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  user: SupabaseUser | null;
  isAdmin?: boolean;
}

export function NewNavigation({ currentPage, onNavigate, user, isAdmin }: NewNavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [savedCount] = useState(3); // Mock saved count - in real app, get from user's saved destinations

  const handleSignIn = () => {
    onNavigate('auth');
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
      return items.map((item, index) => (
        <motion.button
          key={item.page}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1, duration: 0.3 }}
          onClick={() => {
            onNavigate(item.page);
            setIsOpen(false);
          }}
          className={`text-left px-4 py-3 text-lg font-medium cursor-pointer transition-colors rounded-lg ${
            currentPage === item.page 
              ? 'text-primary bg-primary/10 dark:bg-primary/20' 
              : 'text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800'
          }`}
        >
          {item.label}
        </motion.button>
      ));
    }

    // For desktop, show all items with responsive wrapping
    return (
      <div className="flex items-center space-x-1 md:space-x-4 flex-wrap">
        {items.map((item) => (
          <button
            key={item.page}
            onClick={() => onNavigate(item.page)}
            className={`px-2 md:px-3 py-2 text-sm font-medium cursor-pointer transition-colors whitespace-nowrap rounded-md ${
              currentPage === item.page 
                ? 'text-primary bg-primary/10 dark:bg-primary/20' 
                : 'text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    );
  };



  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 h-16"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div 
            className="flex items-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center space-x-2 cursor-pointer group"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center group-hover:shadow-lg transition-shadow">
                <span className="text-white font-bold text-sm">TQ</span>
              </div>
              <span className="hidden sm:block font-bold text-gray-900 dark:text-white">TravelQuest</span>
            </button>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center justify-center flex-1 mx-8">
            {!isAdminPage ? renderNavItems(navItems) : renderNavItems(adminNavItems)}
          </div>

          {/* Right Side Controls */}
          <div className="flex items-center space-x-2">
            {/* Favorites Button - Desktop Only */}
            {!isAdminPage && (
              <div className="hidden lg:block">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onNavigate('saved')}
                    className="relative cursor-pointer"
                    aria-label="View saved destinations"
                  >
                    <Heart className="h-5 w-5" />
                    {savedCount > 0 && (
                      <Badge 
                        variant="destructive" 
                        className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                      >
                        {savedCount}
                      </Badge>
                    )}
                  </Button>
                </motion.div>
              </div>
            )}

            {/* Admin Badge */}
            {isAdmin && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", duration: 0.5 }}
              >
                <Badge variant="secondary" className="bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-700">
                  <Shield className="w-3 h-3 mr-1" />
                  Admin
                </Badge>
              </motion.div>
            )}
            
            {/* Theme Toggle */}
            <ThemeToggle />
            
            {/* User Menu */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full cursor-pointer">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary/10 text-primary dark:bg-primary/20">
                          {user.email?.[0]?.toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </motion.div>
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
              <div className="hidden sm:flex items-center space-x-2">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    onClick={handleSignIn} 
                    className="bg-primary hover:bg-primary/90 cursor-pointer"
                  >
                    Sign In
                  </Button>
                </motion.div>
              </div>
            )}

            {/* Mobile menu button */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="ghost" size="icon" className="md:hidden cursor-pointer">
                    <Menu className="h-6 w-6" />
                  </Button>
                </motion.div>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col space-y-4 mt-8">
                  {/* Mobile Favorites Button */}
                  {!isAdminPage && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="pb-4 border-b border-gray-200 dark:border-gray-700"
                    >
                      <Button
                        onClick={() => {
                          onNavigate('saved');
                          setIsOpen(false);
                        }}
                        variant="outline"
                        className="w-full justify-start cursor-pointer"
                      >
                        <Heart className="mr-2 h-4 w-4" />
                        Favorites
                        {savedCount > 0 && (
                          <Badge variant="destructive" className="ml-auto">
                            {savedCount}
                          </Badge>
                        )}
                      </Button>
                    </motion.div>
                  )}

                  {/* Mobile Auth Buttons */}
                  {!user && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1, duration: 0.3 }}
                      className="space-y-2 pb-4 border-b border-gray-200 dark:border-gray-700"
                    >
                      <Button 
                        onClick={() => {
                          handleSignIn();
                          setIsOpen(false);
                        }}
                        className="w-full bg-primary hover:bg-primary/90 cursor-pointer"
                      >
                        Sign In
                      </Button>
                    </motion.div>
                  )}
                  
                  {/* Navigation Items */}
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.3 }}
                    className="space-y-1"
                  >
                    {!isAdminPage ? renderNavItems(navItems, true) : renderNavItems(adminNavItems, true)}
                  </motion.div>

                  {/* User Menu Items */}
                  {user && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.3 }}
                      className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-1"
                    >
                      <button
                        onClick={() => {
                          onNavigate('account');
                          setIsOpen(false);
                        }}
                        className="text-left px-4 py-3 text-lg font-medium cursor-pointer text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800 w-full rounded-lg transition-colors"
                      >
                        Account
                      </button>
                      {isAdmin && (
                        <button
                          onClick={() => {
                            onNavigate(isAdminPage ? 'home' : 'admin-dashboard');
                            setIsOpen(false);
                          }}
                          className="text-left px-4 py-3 text-lg font-medium cursor-pointer text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800 w-full rounded-lg transition-colors"
                        >
                          {isAdminPage ? 'Exit Admin' : 'Admin Dashboard'}
                        </button>
                      )}
                      <button
                        onClick={() => {
                          handleSignOut();
                          setIsOpen(false);
                        }}
                        className="text-left px-4 py-3 text-lg font-medium cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 w-full rounded-lg transition-colors"
                      >
                        Sign Out
                      </button>
                    </motion.div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
