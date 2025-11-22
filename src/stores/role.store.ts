import { defineStore } from 'pinia';
import { ref } from 'vue';
import roleFacade, { type Role, type Permission } from '@/services/role.facade';

export const useRoleStore = defineStore('role', () => {
  const roles = ref<Role[]>([]);
  const permissions = ref<Permission[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const fetchRoles = async (): Promise<void> => {
    isLoading.value = true;
    error.value = null;
    try {
      roles.value = await roleFacade.getAllRoles();
    } catch (err: any) {
      error.value = err.message || 'Error al cargar roles';
      console.error(err);
    } finally {
      isLoading.value = false;
    }
  };

  const fetchPermissions = async (): Promise<void> => {
    isLoading.value = true;
    error.value = null;
    try {
      permissions.value = await roleFacade.getAllPermissions();
    } catch (err: any) {
      error.value = err.message || 'Error al cargar permisos';
      console.error(err);
    } finally {
      isLoading.value = false;
    }
  };

  const getRolePermissions = async (roleId: string): Promise<Permission[]> => {
    try {
      return await roleFacade.getRolePermissions(roleId);
    } catch (err: any) {
      error.value = err.message || 'Error al cargar permisos del rol';
      console.error(err);
      return [];
    }
  };

  const updateRolePermissions = async (roleId: string, permissionIds: string[]): Promise<boolean> => {
    isLoading.value = true;
    error.value = null;
    try {
      await roleFacade.updateRolePermissions(roleId, permissionIds);
      return true;
    } catch (err: any) {
      error.value = err.message || 'Error al actualizar permisos';
      console.error(err);
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  const createRole = async (name: string, description: string): Promise<boolean> => {
    isLoading.value = true;
    error.value = null;
    try {
      const newRole = await roleFacade.createRole(name, description);
      roles.value.push(newRole);
      return true;
    } catch (err: any) {
      error.value = err.message || 'Error al crear rol';
      console.error(err);
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  const updateRole = async (id: string, name: string, description: string): Promise<boolean> => {
    isLoading.value = true;
    error.value = null;
    try {
      const updatedRole = await roleFacade.updateRole(id, name, description);
      const index = roles.value.findIndex(r => r.id === id);
      if (index !== -1) {
        roles.value[index] = updatedRole;
      }
      return true;
    } catch (err: any) {
      error.value = err.message || 'Error al actualizar rol';
      console.error(err);
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  const deleteRole = async (id: string): Promise<boolean> => {
    isLoading.value = true;
    error.value = null;
    try {
      await roleFacade.deleteRole(id);
      roles.value = roles.value.filter(r => r.id !== id);
      return true;
    } catch (err: any) {
      error.value = err.message || 'Error al eliminar rol';
      console.error(err);
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    roles,
    permissions,
    isLoading,
    error,
    fetchRoles,
    fetchPermissions,
    getRolePermissions,
    updateRolePermissions,
    createRole,
    updateRole,
    deleteRole,
  };
});
