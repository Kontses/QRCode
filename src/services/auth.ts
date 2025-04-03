import { User } from '@/types/user';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export class AuthService {
  private static readonly API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      console.log('AuthService login - Environment:', {
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
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('AuthService login error:', error);
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
      console.error('AuthService register error:', error);
      throw error;
    }
  }
} 