import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Role, Permission, UserWithRole, UserRegistration } from '@/types';
import rolesFacade from '@/services/roles.facade';

export const useRolesStore = defineStore('roles', () => {
  const roles = ref<Role[]>([]);
  const permissions = ref<Permission[]>([]);
  const users = ref<UserWithRole[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const loadRoles = async (): Promise<void> => {
    isLoading.value = true;
    error.value = null;

    try {
      roles.value = await rolesFacade.getRoles();
    } catch (err) {
      error.value = 'Error al cargar roles';
      console.error(err);
    } finally {
      isLoading.value = false;
    }
  };

  const loadPermissions = async (): Promise<void> => {
    isLoading.value = true;
    error.value = null;

    try {
      permissions.value = await rolesFacade.getPermissions();
    } catch (err) {
      error.value = 'Error al cargar permisos';
      console.error(err);
    } finally {
      isLoading.value = false;
    }
  };

  const loadUsers = async (): Promise<void> => {
    isLoading.value = true;
    error.value = null;

    try {
      users.value = await rolesFacade.getAllUsers();
    } catch (err) {
      error.value = 'Error al cargar usuarios';
      console.error(err);
    } finally {
      isLoading.value = false;
    }
  };

  const createUser = async (registration: UserRegistration): Promise<boolean> => {
    isLoading.value = true;
    error.value = null;

    try {
      await rolesFacade.createUser(registration);
      await loadUsers();
      return true;
    } catch (err) {
      error.value = 'Error al crear usuario';
      console.error(err);
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  const updateUserRole = async (userId: string, roleId: string): Promise<boolean> => {
    isLoading.value = true;
    error.value = null;

    try {
      await rolesFacade.updateUserRole(userId, roleId);
      await loadUsers();
      return true;
    } catch (err) {
      error.value = 'Error al actualizar rol de usuario';
      console.error(err);
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  const deleteUser = async (userId: string): Promise<boolean> => {
    isLoading.value = true;
    error.value = null;

    try {
      await rolesFacade.deleteUser(userId);
      await loadUsers();
      return true;
    } catch (err) {
      error.value = 'Error al eliminar usuario';
      console.error(err);
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  const getRolePermissions = async (roleId: string): Promise<Permission[]> => {
    try {
      return await rolesFacade.getRolePermissions(roleId);
    } catch (err) {
      console.error(err);
      return [];
    }
  };

  const assignRolePermission = async (roleId: string, permissionId: string): Promise<boolean> => {
    isLoading.value = true;
    error.value = null;

    try {
      await rolesFacade.assignRolePermission(roleId, permissionId);
      return true;
    } catch (err) {
      error.value = 'Error al asignar permiso';
      console.error(err);
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  const removeRolePermission = async (roleId: string, permissionId: string): Promise<boolean> => {
    isLoading.value = true;
    error.value = null;

    try {
      await rolesFacade.removeRolePermission(roleId, permissionId);
      return true;
    } catch (err) {
      error.value = 'Error al remover permiso';
      console.error(err);
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    roles,
    permissions,
    users,
    isLoading,
    error,
    loadRoles,
    loadPermissions,
    loadUsers,
    createUser,
    updateUserRole,
    deleteUser,
    getRolePermissions,
    assignRolePermission,
    removeRolePermission,
  };
});
