import { User } from '@/types/user';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export class UserService {
  private static readonly API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
  private readonly EMAIL_DOMAIN = 'traxis.gr';

  static async login(email: string, password: string): Promise<void> {
    try {
      console.log('UserService login - Environment:', {
        isBrowser: typeof window !== 'undefined',
        isServer: typeof window === 'undefined',
        isProduction: process.env.NODE_ENV === 'production',
        apiUrl: this.API_URL
      });

      const response = await fetch(`${this.API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();
      console.log('Login response:', { ...data, token: '[REDACTED]' });
      
      // Αποθηκεύουμε το token και τα user data
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
      }
    } catch (error) {
      console.error('UserService login error:', error);
      throw error;
    }
  }

  static async register(userData: Partial<User>): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('UserService register error:', error);
      throw error;
    }
  }

  static async getCurrentUser(): Promise<User | null> {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (!token) return null;

      const response = await fetch(`${this.API_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }

      const user = await response.json();
      return user;
    } catch (error) {
      console.error('UserService getCurrentUser error:', error);
      return null;
    }
  }

  static logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }
} 