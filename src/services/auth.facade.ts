import { supabase } from './supabase.service';

export interface AuthUser {
  id: string;
  email: string;
  roles: string[];
  permissions: { resource: string; action: string }[];
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  roleId: string;
}

class AuthFacade {
  async login(credentials: LoginCredentials): Promise<AuthUser | null> {
    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('No user returned');

      const user = await this.getUserWithRolesAndPermissions(authData.user.id);
      return user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async register(data: RegisterData): Promise<AuthUser | null> {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('No user returned');

      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({
          user_id: authData.user.id,
          role_id: data.roleId,
        });

      if (roleError) throw roleError;

      const user = await this.getUserWithRolesAndPermissions(authData.user.id);
      return user;
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      return await this.getUserWithRolesAndPermissions(user.id);
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  async getUserWithRolesAndPermissions(userId: string): Promise<AuthUser> {
    const { data: userRoles, error: rolesError } = await supabase
      .from('user_roles')
      .select(`
        roles (
          id,
          name,
          role_permissions (
            permissions (
              resource,
              action
            )
          )
        )
      `)
      .eq('user_id', userId);

    if (rolesError) throw rolesError;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not found');

    const roles = userRoles?.map((ur: any) => ur.roles.name) || [];
    const permissionsSet = new Set<string>();

    userRoles?.forEach((ur: any) => {
      ur.roles.role_permissions?.forEach((rp: any) => {
        permissionsSet.add(JSON.stringify({
          resource: rp.permissions.resource,
          action: rp.permissions.action,
        }));
      });
    });

    const permissions = Array.from(permissionsSet).map(p => JSON.parse(p));

    return {
      id: user.id,
      email: user.email || '',
      roles,
      permissions,
    };
  }

  async isAuthenticated(): Promise<boolean> {
    const { data: { session } } = await supabase.auth.getSession();
    return !!session;
  }

  hasRole(user: AuthUser | null, role: string): boolean {
    return user?.roles.includes(role) || false;
  }

  hasPermission(user: AuthUser | null, resource: string, action: string): boolean {
    return user?.permissions.some(p => p.resource === resource && p.action === action) || false;
  }

  isAdmin(user: AuthUser | null): boolean {
    return this.hasRole(user, 'Admin');
  }
}

export default new AuthFacade();
