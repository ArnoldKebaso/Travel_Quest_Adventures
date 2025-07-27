import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from './supabase/info';

const supabaseUrl = `https://${projectId}.supabase.co`;

export const supabase = createClient(supabaseUrl, publicAnonKey);

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

class AuthService {
  private listeners: ((state: AuthState) => void)[] = [];
  private state: AuthState = {
    user: null,
    loading: true,
    error: null,
  };

  constructor() {
    this.initialize();
  }

  private async initialize() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.access_token) {
        localStorage.setItem('supabase_auth_token', session.access_token);
        this.setState({
          user: {
            id: session.user.id,
            email: session.user.email!,
            name: session.user.user_metadata?.name || session.user.email!,
          },
          loading: false,
          error: null,
        });
      } else {
        localStorage.removeItem('supabase_auth_token');
        this.setState({
          user: null,
          loading: false,
          error: null,
        });
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      this.setState({
        user: null,
        loading: false,
        error: 'Failed to initialize authentication',
      });
    }

    // Listen for auth changes
    supabase.auth.onAuthStateChange((event, session) => {
      if (session?.access_token) {
        localStorage.setItem('supabase_auth_token', session.access_token);
        this.setState({
          user: {
            id: session.user.id,
            email: session.user.email!,
            name: session.user.user_metadata?.name || session.user.email!,
          },
          loading: false,
          error: null,
        });
      } else {
        localStorage.removeItem('supabase_auth_token');
        this.setState({
          user: null,
          loading: false,
          error: null,
        });
      }
    });
  }

  private setState(newState: Partial<AuthState>) {
    this.state = { ...this.state, ...newState };
    this.listeners.forEach(listener => listener(this.state));
  }

  subscribe(listener: (state: AuthState) => void) {
    this.listeners.push(listener);
    listener(this.state); // Call immediately with current state
    
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  getState() {
    return this.state;
  }

  async signIn(email: string, password: string) {
    try {
      this.setState({ loading: true, error: null });
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        this.setState({ loading: false, error: error.message });
        return { success: false, error: error.message };
      }

      return { success: true, user: data.user };
    } catch (error) {
      const errorMessage = 'Failed to sign in';
      this.setState({ loading: false, error: errorMessage });
      return { success: false, error: errorMessage };
    }
  }

  async signUp(email: string, password: string, name: string) {
    try {
      this.setState({ loading: true, error: null });
      
      // Use our custom signup endpoint
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-838db481/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({ email, password, name }),
      });

      const result = await response.json();

      if (!response.ok) {
        this.setState({ loading: false, error: result.error || 'Failed to create account' });
        return { success: false, error: result.error || 'Failed to create account' };
      }

      // Now sign in with the created user
      return await this.signIn(email, password);
    } catch (error) {
      const errorMessage = 'Failed to create account';
      this.setState({ loading: false, error: errorMessage });
      return { success: false, error: errorMessage };
    }
  }

  async signOut() {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem('supabase_auth_token');
      this.setState({
        user: null,
        loading: false,
        error: null,
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to sign out' };
    }
  }
}

export const authService = new AuthService();