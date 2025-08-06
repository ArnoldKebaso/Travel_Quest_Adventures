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
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        this.state.user = JSON.parse(stored);
      } catch {
        localStorage.removeItem('user');
      }
    }
    this.state.loading = false;
  }

  private setState(newState: Partial<AuthState>) {
    this.state = { ...this.state, ...newState };
    this.listeners.forEach((listener) => listener(this.state));
  }

  subscribe(listener: (state: AuthState) => void) {
    this.listeners.push(listener);
    listener(this.state);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  getState() {
    return this.state;
  }

  async signIn(email: string, password: string): Promise<{ success: boolean; error?: string }> {
    this.setState({ loading: true, error: null });
    void password;
    const user: User = { id: email, email, name: email };
    localStorage.setItem('user', JSON.stringify(user));
    this.setState({ user, loading: false });
    return { success: true };
  }

  async signUp(email: string, password: string, name: string): Promise<{ success: boolean; error?: string }> {
    this.setState({ loading: true, error: null });
    void password;
    const user: User = { id: email, email, name };
    localStorage.setItem('user', JSON.stringify(user));
    this.setState({ user, loading: false });
    return { success: true };
  }

  async signOut(): Promise<{ success: boolean; error?: string }> {
    localStorage.removeItem('user');
    this.setState({ user: null });
    return { success: true };
  }
}

export const authService = new AuthService();
