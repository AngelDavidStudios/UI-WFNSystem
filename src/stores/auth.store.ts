import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import authFacade, { type AuthUser, type LoginCredentials } from '@/services/auth.facade';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<AuthUser | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const isAuthenticated = computed(() => !!user.value);
  const isAdmin = computed(() => authFacade.isAdmin(user.value));
  const userRoles = computed(() => user.value?.roles || []);
  const userPermissions = computed(() => user.value?.permissions || []);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    isLoading.value = true;
    error.value = null;

    try {
      const loggedUser = await authFacade.login(credentials);

      if (loggedUser) {
        user.value = loggedUser;
        return true;
      }

      error.value = 'Invalid credentials';
      return false;
    } catch (err: any) {
      error.value = err.message || 'Login failed';
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  const logout = async (): Promise<void> => {
    await authFacade.logout();
    user.value = null;
  };

  const checkAuth = async (): Promise<void> => {
    try {
      const isAuth = await authFacade.isAuthenticated();
      if (isAuth) {
        user.value = await authFacade.getCurrentUser();
      } else {
        user.value = null;
      }
    } catch (err) {
      console.error('Check auth error:', err);
      user.value = null;
    }
  };

  const hasRole = (role: string): boolean => {
    return authFacade.hasRole(user.value, role);
  };

  const hasPermission = (resource: string, action: string): boolean => {
    return authFacade.hasPermission(user.value, resource, action);
  };

  return {
    user,
    isLoading,
    error,
    isAuthenticated,
    isAdmin,
    userRoles,
    userPermissions,
    login,
    logout,
    checkAuth,
    hasRole,
    hasPermission,
  };
});
