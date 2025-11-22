import type { LoginCredentials, User } from '@/types';

class AuthFacade {
  async login(credentials: LoginCredentials): Promise<User | null> {
    try {
      if (credentials.username === 'Admin' && credentials.password === 'Admin') {
        const user: User = {
          username: credentials.username,
          isAuthenticated: true,
        };

        localStorage.setItem('authToken', 'mock-jwt-token');
        localStorage.setItem('currentUser', JSON.stringify(user));

        return user;
      }

      throw new Error('Invalid credentials');
    } catch (error) {
      console.error('Login error:', error);
      return null;
    }
  }

  async logout(): Promise<void> {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
  }

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  }
}

export default new AuthFacade();
