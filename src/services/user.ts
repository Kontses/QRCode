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

export class UserService {
  private static apiUrl: string = process.env.NEXT_PUBLIC_API_URL || '';
  private readonly EMAIL_DOMAIN = 'traxis.gr';
  private static readonly TOKEN_KEY = 'auth_token';
  private static readonly USER_KEY = 'user_data';

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
      
      const response = await fetch(`${UserService.apiUrl}/api/users/register`, {
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
      const response = await fetch(`${UserService.apiUrl}/api/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Invalid credentials');
      }

      const data = await response.json();
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(UserService.TOKEN_KEY, data.token);
        window.localStorage.setItem(UserService.USER_KEY, JSON.stringify(data.user));
      }
    } catch (error) {
      console.error('Login error:', error);
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
      return false;
    }

    try {
      const response = await fetch(`${UserService.apiUrl}/api/users/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      return response.ok;
    } catch (error) {
      console.error('Auth check error:', error);
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