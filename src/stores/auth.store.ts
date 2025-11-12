import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { User, LoginCredentials } from '@/types';
import authFacade from '@/services/auth.facade';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const isAuthenticated = computed(() => user.value?.isAuthenticated ?? false);

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
    } catch (err) {
      error.value = 'Login failed';
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  const logout = async (): Promise<void> => {
    await authFacade.logout();
    user.value = null;
  };

  const checkAuth = (): void => {
    if (authFacade.isAuthenticated()) {
      user.value = authFacade.getCurrentUser();
    }
  };

  return {
    user,
    isLoading,
    error,
    isAuthenticated,
    login,
    logout,
    checkAuth,
  };
});
