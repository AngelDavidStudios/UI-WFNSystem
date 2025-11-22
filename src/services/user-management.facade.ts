import { supabase } from './supabase.service';

export interface SystemUser {
  id: string;
  email: string;
  created_at: string;
  roles: { id: string; name: string }[];
}

class UserManagementFacade {
  async getAllUsers(): Promise<SystemUser[]> {
    const { data: userRoles, error } = await supabase
      .from('user_roles')
      .select(`
        user_id,
        roles (
          id,
          name
        )
      `);

    if (error) throw error;

    const userMap = new Map<string, SystemUser>();

    for (const ur of userRoles || []) {
      if (!userMap.has(ur.user_id)) {
        const { data: { user } } = await supabase.auth.admin.getUserById(ur.user_id);

        if (user) {
          userMap.set(ur.user_id, {
            id: user.id,
            email: user.email || '',
            created_at: user.created_at,
            roles: [],
          });
        }
      }

      const systemUser = userMap.get(ur.user_id);
      if (systemUser && ur.roles) {
        systemUser.roles.push({
          id: (ur.roles as any).id,
          name: (ur.roles as any).name,
        });
      }
    }

    return Array.from(userMap.values());
  }

  async getUserRoles(userId: string): Promise<{ id: string; name: string }[]> {
    const { data, error } = await supabase
      .from('user_roles')
      .select(`
        roles (
          id,
          name
        )
      `)
      .eq('user_id', userId);

    if (error) throw error;
    return data?.map((ur: any) => ur.roles) || [];
  }

  async assignRoleToUser(userId: string, roleId: string): Promise<void> {
    const { error } = await supabase
      .from('user_roles')
      .insert({
        user_id: userId,
        role_id: roleId,
      });

    if (error) throw error;
  }

  async removeRoleFromUser(userId: string, roleId: string): Promise<void> {
    const { error } = await supabase
      .from('user_roles')
      .delete()
      .eq('user_id', userId)
      .eq('role_id', roleId);

    if (error) throw error;
  }

  async updateUserRoles(userId: string, roleIds: string[]): Promise<void> {
    const { error: deleteError } = await supabase
      .from('user_roles')
      .delete()
      .eq('user_id', userId);

    if (deleteError) throw deleteError;

    if (roleIds.length > 0) {
      const userRoles = roleIds.map(roleId => ({
        user_id: userId,
        role_id: roleId,
      }));

      const { error: insertError } = await supabase
        .from('user_roles')
        .insert(userRoles);

      if (insertError) throw insertError;
    }
  }

  async deleteUser(userId: string): Promise<void> {
    const { error } = await supabase.auth.admin.deleteUser(userId);
    if (error) throw error;
  }
}

export default new UserManagementFacade();
