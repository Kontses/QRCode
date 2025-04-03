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
  private static apiUrl: string = typeof window !== 'undefined' && window.location.hostname === 'localhost' 
    ? 'http://localhost:3000'
    : (process.env.NEXT_PUBLIC_API_URL || '');
  private readonly EMAIL_DOMAIN = 'traxis.gr';
  private static readonly TOKEN_KEY = 'auth_token';
  private static readonly USER_KEY = 'user_data';

  private static isCapacitorApp(): boolean {
    const isCapacitor = typeof window !== 'undefined' && window.Capacitor?.isNative === true;
    console.log('isCapacitorApp:', isCapacitor);
    console.log('window.Capacitor:', window?.Capacitor);
    return isCapacitor;
  }

  private static getApiUrl(): string {
    console.log('Getting API URL...');
    console.log('window.location.hostname:', typeof window !== 'undefined' ? window.location.hostname : 'undefined');
    console.log('NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);
    
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
      console.log('Using localhost URL');
      return 'http://localhost:3000';
    }
    
    // For Capacitor app, use the API URL
    if (UserService.isCapacitorApp()) {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
      console.log('Using Capacitor API URL:', apiUrl);
      return apiUrl;
    }
    
    // For browser, use relative URLs
    console.log('Using relative URL');
    return '';
  }

  constructor() {
    // Empty constructor
  }

  private validateEmail(email: string): boolean {
    return email.endsWith(`@${this.EMAIL_DOMAIN}`);
  }

  private extractNameFromEmail(email: string): string {
    const name = email.split('@')[0];
    // Convert to title case and replace dots/dashes with spaces
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

  async register(userData: UserRegistration): Promise<User> {
    try {
      if (!this.validateEmail(userData.email)) {
        throw new Error(`Only ${this.EMAIL_DOMAIN} email addresses are allowed`);
      }

      const name = this.extractNameFromEmail(userData.email);
      const password_hash = await this.hashPassword(userData.password);
      
      const url = UserService.isCapacitorApp()
        ? `${UserService.getApiUrl()}/api/users/register`
        : '/api/users/register';

      console.log('Register URL:', url);
      console.log('API URL:', UserService.getApiUrl());

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email: userData.email,
          password_hash,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Registration failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  static async login(email: string, password: string): Promise<void> {
    try {
      console.log('Starting login process...');
      console.log('API URL:', UserService.getApiUrl());
      console.log('Environment:', {
        window: typeof window !== 'undefined',
        Capacitor: typeof window !== 'undefined' ? window.Capacitor : undefined,
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL
      });

      const url = UserService.isCapacitorApp()
        ? `${UserService.getApiUrl()}/api/users/login`
        : '/api/users/login';

      console.log('Login URL:', url);
      console.log('Request payload:', { email, password: '***' });

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      
      // Log response headers
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      
      // Get response text first to see what we're getting
      const responseText = await response.text();
      console.log('Raw response:', responseText);

      if (!response.ok) {
        throw new Error(`Login failed with status ${response.status}: ${responseText}`);
      }

      // Try to parse JSON only if response is ok
      const data = JSON.parse(responseText);
      console.log('Login successful, storing tokens...');

      if (typeof window !== 'undefined') {
        window.localStorage.setItem(UserService.TOKEN_KEY, data.token);
        window.localStorage.setItem(UserService.USER_KEY, JSON.stringify(data.user));
        console.log('Tokens stored successfully');
      }
    } catch (error) {
      console.error('Login error:', error);
      console.error('Error stack:', error.stack);
      throw error;
    }
  }

  static async logout(): Promise<void> {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(UserService.TOKEN_KEY);
      window.localStorage.removeItem(UserService.USER_KEY);
    }
  }

  static async checkAuth(): Promise<boolean> {
    if (typeof window === 'undefined') {
      return false;
    }

    const token = window.localStorage.getItem(UserService.TOKEN_KEY);
    if (!token) {
      console.log('No token found');
      return false;
    }

    try {
      console.log('Checking auth...');
      console.log('API URL:', UserService.getApiUrl());

      const url = UserService.isCapacitorApp()
        ? `${UserService.getApiUrl()}/api/users/me`
        : '/api/users/me';

      console.log('CheckAuth URL:', url);
      console.log('Token:', token.substring(0, 10) + '...');

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('Auth check response:', response.status);
      return response.ok;
    } catch (error) {
      console.error('Auth check error:', error);
      console.error('Error stack:', error.stack);
      return false;
    }
  }

  static getUser(): any {
    if (typeof window === 'undefined') {
      return null;
    }
    const userData = window.localStorage.getItem(UserService.USER_KEY);
    return userData ? JSON.parse(userData) : null;
  }
} 