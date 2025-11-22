import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { User, LoginCredentials } from '@/types';
import authFacade from '@/services/auth.facade';
import supabaseService from '@/services/supabase.service';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const isAuthenticated = computed(() => user.value?.isAuthenticated ?? false);
  const userRole = computed(() => user.value?.role?.name || null);
  const isAdmin = computed(() => authFacade.hasRole(user.value, 'Admin'));
  const isGerente = computed(() => authFacade.hasRole(user.value, 'Gerente'));
  const isJefe = computed(() => authFacade.hasRole(user.value, 'Jefe'));

  const hasPermission = (resource: string, action: string): boolean => {
    return authFacade.hasPermission(user.value, resource, action);
  };

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    isLoading.value = true;
    error.value = null;

    try {
      const loggedUser = await authFacade.login(credentials);

      if (loggedUser) {
        user.value = loggedUser;
        return true;
      }

      error.value = 'Credenciales inválidas';
      return false;
    } catch (err) {
      error.value = 'Error al iniciar sesión';
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
    isLoading.value = true;
    try {
      const isAuth = await authFacade.isAuthenticated();
      if (isAuth) {
        user.value = await authFacade.getCurrentUser();
      }
    } catch (err) {
      console.error('Error checking auth:', err);
      user.value = null;
    } finally {
      isLoading.value = false;
    }
  };

  const initAuthListener = (): void => {
    supabaseService.getClient().auth.onAuthStateChange((event: string, session: any) => {
      (async () => {
        if (event === 'SIGNED_IN' && session) {
          user.value = await authFacade.getCurrentUser();
        } else if (event === 'SIGNED_OUT') {
          user.value = null;
        }
      })();
    });
  };

  return {
    user,
    isLoading,
    error,
    isAuthenticated,
    userRole,
    isAdmin,
    isGerente,
    isJefe,
    hasPermission,
    login,
    logout,
    checkAuth,
    initAuthListener,
  };
});
