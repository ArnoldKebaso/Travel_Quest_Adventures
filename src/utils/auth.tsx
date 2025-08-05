import { Auth, Hub } from 'aws-amplify';

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
    Hub.listen('auth', () => {
      this.refreshUser();
    });
  }

  private async initialize() {
    await this.refreshUser();
    this.setState({ loading: false });
  }

  private async refreshUser() {
    try {
      const cognitoUser = await Auth.currentAuthenticatedUser();
      const session = await Auth.currentSession();
      const idToken = session.getIdToken().getJwtToken();
      localStorage.setItem('id_token', idToken);
      this.setState({
        user: {
          id: cognitoUser.attributes.sub,
          email: cognitoUser.attributes.email,
          name: cognitoUser.attributes.name || cognitoUser.attributes.email,
        },
        error: null,
      });
    } catch {
      localStorage.removeItem('id_token');
      this.setState({ user: null, error: null });
    }
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

  async signIn(email: string, password: string) {
    this.setState({ loading: true, error: null });
    try {
      await Auth.signIn(email, password);
      await this.refreshUser();
      this.setState({ loading: false });
      return { success: true };
    } catch (error: any) {
      this.setState({ loading: false, error: error.message });
      return { success: false, error: error.message };
    }
  }

  async signUp(email: string, password: string, name: string) {
    this.setState({ loading: true, error: null });
    try {
      await Auth.signUp({ username: email, password, attributes: { email, name } });
      this.setState({ loading: false });
      return { success: true };
    } catch (error: any) {
      this.setState({ loading: false, error: error.message });
      return { success: false, error: error.message };
    }
  }

  async signOut() {
    try {
      await Auth.signOut();
      localStorage.removeItem('id_token');
      this.setState({ user: null });
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
}

export const authService = new AuthService();
