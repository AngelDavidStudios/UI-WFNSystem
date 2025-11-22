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
    const supabase = supabaseService.getClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      throw new Error('No authenticated session');
    }

    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-users/list`,
      {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      console.error('Error fetching users:', error);
      throw new Error(error.error || 'Failed to fetch users');
    }

    const { users } = await response.json();
    return users;
  }

  async createUser(registration: UserRegistration): Promise<void> {
    const supabase = supabaseService.getClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      throw new Error('No authenticated session');
    }

    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-users/create`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: registration.email,
          password: registration.password,
          role_id: registration.role_id,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      console.error('Error creating user:', error);
      throw new Error(error.error || 'Failed to create user');
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
    const supabase = supabaseService.getClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      throw new Error('No authenticated session');
    }

    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-users/delete/${userId}`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      console.error('Error deleting user:', error);
      throw new Error(error.error || 'Failed to delete user');
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

  async createRole(role: { name: string; description: string }): Promise<void> {
    const { error } = await supabaseService
      .getClient()
      .from('roles')
      .insert({
        name: role.name,
        description: role.description,
      });

    if (error) {
      console.error('Error creating role:', error);
      throw error;
    }
  }

  async updateRole(roleId: string, role: { name: string; description: string }): Promise<void> {
    const { error } = await supabaseService
      .getClient()
      .from('roles')
      .update({
        name: role.name,
        description: role.description,
      })
      .eq('id', roleId);

    if (error) {
      console.error('Error updating role:', error);
      throw error;
    }
  }

  async deleteRole(roleId: string): Promise<void> {
    const { error } = await supabaseService
      .getClient()
      .from('roles')
      .delete()
      .eq('id', roleId);

    if (error) {
      console.error('Error deleting role:', error);
      throw error;
    }
  }

  async createPermission(permission: { resource: string; action: string; description: string }): Promise<void> {
    const { error } = await supabaseService
      .getClient()
      .from('permissions')
      .insert({
        resource: permission.resource,
        action: permission.action,
        description: permission.description,
      });

    if (error) {
      console.error('Error creating permission:', error);
      throw error;
    }
  }

  async updatePermission(permissionId: string, permission: { resource: string; action: string; description: string }): Promise<void> {
    const { error } = await supabaseService
      .getClient()
      .from('permissions')
      .update({
        resource: permission.resource,
        action: permission.action,
        description: permission.description,
      })
      .eq('id', permissionId);

    if (error) {
      console.error('Error updating permission:', error);
      throw error;
    }
  }

  async deletePermission(permissionId: string): Promise<void> {
    const { error } = await supabaseService
      .getClient()
      .from('permissions')
      .delete()
      .eq('id', permissionId);

    if (error) {
      console.error('Error deleting permission:', error);
      throw error;
    }
  }
}

export default new RolesFacade();
