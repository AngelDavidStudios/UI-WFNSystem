import { defineStore } from 'pinia';
import { ref } from 'vue';
import userManagementFacade, { type SystemUser } from '@/services/user-management.facade';
import authFacade, { type RegisterData } from '@/services/auth.facade';

export const useUserManagementStore = defineStore('userManagement', () => {
  const users = ref<SystemUser[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const fetchUsers = async (): Promise<void> => {
    isLoading.value = true;
    error.value = null;
    try {
      users.value = await userManagementFacade.getAllUsers();
    } catch (err: any) {
      error.value = err.message || 'Error al cargar usuarios';
      console.error(err);
    } finally {
      isLoading.value = false;
    }
  };

  const createUser = async (data: RegisterData): Promise<boolean> => {
    isLoading.value = true;
    error.value = null;
    try {
      await authFacade.register(data);
      await fetchUsers();
      return true;
    } catch (err: any) {
      error.value = err.message || 'Error al crear usuario';
      console.error(err);
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  const updateUserRoles = async (userId: string, roleIds: string[]): Promise<boolean> => {
    isLoading.value = true;
    error.value = null;
    try {
      await userManagementFacade.updateUserRoles(userId, roleIds);
      await fetchUsers();
      return true;
    } catch (err: any) {
      error.value = err.message || 'Error al actualizar roles';
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
      await userManagementFacade.deleteUser(userId);
      users.value = users.value.filter(u => u.id !== userId);
      return true;
    } catch (err: any) {
      error.value = err.message || 'Error al eliminar usuario';
      console.error(err);
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    users,
    isLoading,
    error,
    fetchUsers,
    createUser,
    updateUserRoles,
    deleteUser,
  };
});
