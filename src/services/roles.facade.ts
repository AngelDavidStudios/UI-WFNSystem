import supabaseService from './supabase.service';
import type { Role, Permission, UserWithRole, UserRegistration } from '@/types';

class RolesFacade {
  async getRoles(): Promise<Role[]> {
    const { data, error } = await supabaseService
      .getClient()
      .from('roles')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching roles:', error);
      throw error;
    }

    return data || [];
  }

  async getPermissions(): Promise<Permission[]> {
    const { data, error } = await supabaseService
      .getClient()
      .from('permissions')
      .select('*')
      .order('resource, action');

    if (error) {
      console.error('Error fetching permissions:', error);
      throw error;
    }

    return data || [];
  }

  async getRolePermissions(roleId: string): Promise<Permission[]> {
    const { data, error } = await supabaseService
      .getClient()
      .from('role_permissions')
      .select('permission_id, permissions(*)')
      .eq('role_id', roleId);

    if (error) {
      console.error('Error fetching role permissions:', error);
      throw error;
    }

    return data?.map((rp: any) => rp.permissions) || [];
  }

  async getUserRole(userId: string): Promise<Role | null> {
    const { data, error } = await supabaseService
      .getClient()
      .from('user_roles')
      .select('role_id, roles(*)')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching user role:', error);
      throw error;
    }

    const roleData = data?.roles as Role | undefined;
    return roleData || null;
  }

  async getUserPermissions(userId: string): Promise<Permission[]> {
    const role = await this.getUserRole(userId);
    if (!role) return [];

    return this.getRolePermissions(role.id);
  }

  async hasPermission(userId: string, resource: string, action: string): Promise<boolean> {
    const permissions = await this.getUserPermissions(userId);
    return permissions.some(p => p.resource === resource && p.action === action);
  }

  async getAllUsers(): Promise<UserWithRole[]> {
    const { data: { users }, error } = await supabaseService
      .getClient()
      .auth.admin.listUsers();

    if (error) {
      console.error('Error fetching users:', error);
      throw error;
    }

    const usersWithRoles = await Promise.all(
      users.map(async (user: any) => {
        const role = await this.getUserRole(user.id);
        return {
          id: user.id,
          email: user.email || '',
          created_at: user.created_at,
          role: role || undefined,
        };
      })
    );

    return usersWithRoles;
  }

  async createUser(registration: UserRegistration): Promise<void> {
    const { data, error } = await supabaseService
      .getClient()
      .auth.admin.createUser({
        email: registration.email,
        password: registration.password,
        email_confirm: true,
      });

    if (error) {
      console.error('Error creating user:', error);
      throw error;
    }

    if (data.user) {
      const { error: roleError } = await supabaseService
        .getClient()
        .from('user_roles')
        .insert({
          user_id: data.user.id,
          role_id: registration.role_id,
        });

      if (roleError) {
        console.error('Error assigning role:', roleError);
        throw roleError;
      }
    }
  }

  async updateUserRole(userId: string, roleId: string): Promise<void> {
    const { error } = await supabaseService
      .getClient()
      .from('user_roles')
      .update({ role_id: roleId })
      .eq('user_id', userId);

    if (error) {
      console.error('Error updating user role:', error);
      throw error;
    }
  }

  async deleteUser(userId: string): Promise<void> {
    const { error } = await supabaseService
      .getClient()
      .auth.admin.deleteUser(userId);

    if (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  async assignRolePermission(roleId: string, permissionId: string): Promise<void> {
    const { error } = await supabaseService
      .getClient()
      .from('role_permissions')
      .insert({
        role_id: roleId,
        permission_id: permissionId,
      });

    if (error) {
      console.error('Error assigning permission to role:', error);
      throw error;
    }
  }

  async removeRolePermission(roleId: string, permissionId: string): Promise<void> {
    const { error } = await supabaseService
      .getClient()
      .from('role_permissions')
      .delete()
      .eq('role_id', roleId)
      .eq('permission_id', permissionId);

    if (error) {
      console.error('Error removing permission from role:', error);
      throw error;
    }
  }
}

export default new RolesFacade();
