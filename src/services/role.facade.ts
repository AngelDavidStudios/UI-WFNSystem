import { supabase } from './supabase.service';

export interface Role {
  id: string;
  name: string;
  description: string;
  created_at: string;
}

export interface Permission {
  id: string;
  resource: string;
  action: string;
  description: string;
  created_at: string;
}

export interface RolePermission {
  id: string;
  role_id: string;
  permission_id: string;
  created_at: string;
}

class RoleFacade {
  async getAllRoles(): Promise<Role[]> {
    const { data, error } = await supabase
      .from('roles')
      .select('*')
      .order('name');

    if (error) throw error;
    return data || [];
  }

  async getAllPermissions(): Promise<Permission[]> {
    const { data, error } = await supabase
      .from('permissions')
      .select('*')
      .order('resource, action');

    if (error) throw error;
    return data || [];
  }

  async getRolePermissions(roleId: string): Promise<Permission[]> {
    const { data, error } = await supabase
      .from('role_permissions')
      .select(`
        permissions (
          id,
          resource,
          action,
          description,
          created_at
        )
      `)
      .eq('role_id', roleId);

    if (error) throw error;
    return data?.map((rp: any) => rp.permissions) || [];
  }

  async updateRolePermissions(roleId: string, permissionIds: string[]): Promise<void> {
    const { error: deleteError } = await supabase
      .from('role_permissions')
      .delete()
      .eq('role_id', roleId);

    if (deleteError) throw deleteError;

    if (permissionIds.length > 0) {
      const rolePermissions = permissionIds.map(permissionId => ({
        role_id: roleId,
        permission_id: permissionId,
      }));

      const { error: insertError } = await supabase
        .from('role_permissions')
        .insert(rolePermissions);

      if (insertError) throw insertError;
    }
  }

  async createRole(name: string, description: string): Promise<Role> {
    const { data, error } = await supabase
      .from('roles')
      .insert({ name, description })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateRole(id: string, name: string, description: string): Promise<Role> {
    const { data, error } = await supabase
      .from('roles')
      .update({ name, description })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteRole(id: string): Promise<void> {
    const { error } = await supabase
      .from('roles')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}

export default new RoleFacade();
