import bcrypt from 'bcryptjs';

interface User {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  created_at: Date;
}

interface UserCredentials {
  email: string;
  password: string;
}

interface UserRegistration {
  email: string;
  password: string;
}

declare global {
  interface Window {
    Capacitor?: {
      isNative: boolean;
    };
  }
}

export class UserService {
  private static readonly TOKEN_KEY = 'auth_token';
  private static readonly USER_KEY = 'user_data';
  private readonly EMAIL_DOMAIN = 'traxis.gr';

  private static getApiUrl(): string {
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
      return 'http://localhost:3000';
    }
    return process.env.NEXT_PUBLIC_API_URL || '';
  }

  private validateEmail(email: string): boolean {
    return email.endsWith(`@${this.EMAIL_DOMAIN}`);
  }

  private extractNameFromEmail(email: string): string {
    const name = email.split('@')[0];
    return name
      .split(/[.-]/)
      .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join(' ');
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  private async comparePasswords(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  static async login(email: string, password: string): Promise<void> {
    try {
      console.log('Login attempt for:', email);
      const apiUrl = UserService.getApiUrl();
      console.log('Using API URL:', apiUrl);

      const url = `${apiUrl}/api/auth/login`;
      console.log('Making request to:', url);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers));

      const data = await response.json();
      console.log('Response data:', { ...data, token: data.token ? '[REDACTED]' : undefined });

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      console.log('Login successful, storing data...');
      localStorage.setItem(UserService.TOKEN_KEY, data.token);
      localStorage.setItem(UserService.USER_KEY, JSON.stringify(data));
      console.log('Data stored in localStorage');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  static async register(email: string, password: string): Promise<void> {
    try {
      const response = await fetch(`${UserService.getApiUrl()}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      const data = await response.json();
      localStorage.setItem(UserService.TOKEN_KEY, data.token);
      localStorage.setItem(UserService.USER_KEY, JSON.stringify(data.user));
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  static logout(): void {
    localStorage.removeItem(UserService.TOKEN_KEY);
    localStorage.removeItem(UserService.USER_KEY);
  }

  static isAuthenticated(): boolean {
    return !!localStorage.getItem(UserService.TOKEN_KEY);
  }

  static getCurrentUser(): User | null {
    const userData = localStorage.getItem(UserService.USER_KEY);
    return userData ? JSON.parse(userData) : null;
  }
} 