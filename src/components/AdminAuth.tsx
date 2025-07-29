import { Auth } from './Auth';
import type { User as SupabaseUser } from '@supabase/supabase-js';

type Page = 'home' | 'listings' | 'destination' | 'account' | 'saved' | 'auth' | 'admin-auth' | 'admin-dashboard' | 'admin-add-guide' | 'admin-comments' | 'admin-users' | 'not-found' | 'blogs' | 'tours' | 'about' | 'contact' | 'tour-details' | 'blog-details';

interface AdminAuthProps {
  onAuthSuccess?: () => void;
  onNavigate?: (page: Page) => void;
  user?: SupabaseUser | null;
  isAdmin?: boolean;
}

export function AdminAuth({ onAuthSuccess, onNavigate, user, isAdmin }: AdminAuthProps) {
  return (
    <Auth 
      isAdminAuth={true} 
      onAuthSuccess={onAuthSuccess} 
      onNavigate={onNavigate}
      user={user}
      isAdmin={isAdmin}
    />
  );
}