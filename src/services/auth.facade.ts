import type { LoginCredentials, User } from '@/types';
import supabaseService from './supabase.service';
import rolesFacade from './roles.facade';

class AuthFacade {
  async login(credentials: LoginCredentials): Promise<User | null> {
    try {
      const { data, error } = await supabaseService
        .getClient()
        .auth.signInWithPassword({
          email: credentials.email,
          password: credentials.password,
        });

      if (error) {
        console.error('Login error:', error);
        return null;
      }

      if (data.user) {
        const role = await rolesFacade.getUserRole(data.user.id);
        const permissions = role ? await rolesFacade.getRolePermissions(role.id) : [];

        const user: User = {
          id: data.user.id,
          email: data.user.email || '',
          isAuthenticated: true,
          role: role || undefined,
          permissions,
        };

        return user;
      }

      return null;
    } catch (error) {
      console.error('Login error:', error);
      return null;
    }
  }

  async logout(): Promise<void> {
    await supabaseService.getClient().auth.signOut();
  }

  async getCurrentUser(): Promise<User | null> {
    const { data: { user } } = await supabaseService.getClient().auth.getUser();

    if (!user) return null;

    const role = await rolesFacade.getUserRole(user.id);
    const permissions = role ? await rolesFacade.getRolePermissions(role.id) : [];

    return {
      id: user.id,
      email: user.email || '',
      isAuthenticated: true,
      role: role || undefined,
      permissions,
    };
  }

  async isAuthenticated(): Promise<boolean> {
    const { data: { session } } = await supabaseService.getClient().auth.getSession();
    return !!session;
  }

  hasPermission(user: User | null, resource: string, action: string): boolean {
    if (!user || !user.permissions) return false;
    return user.permissions.some(p => p.resource === resource && p.action === action);
  }

  hasRole(user: User | null, roleName: string): boolean {
    if (!user || !user.role) return false;
    return user.role.name === roleName;
  }
}

export default new AuthFacade();
