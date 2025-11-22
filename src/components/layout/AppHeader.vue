<template>
  <header class="h-16 border-b border-white/20 bg-blueprint-dark/80 backdrop-blur-sm flex items-center justify-between px-6 sticky top-0 z-40">
    <div class="flex items-center gap-4">
      <button
        @click="uiStore.toggleSidebar"
        class="text-blueprint-primary hover:text-white transition-colors p-2 hover:bg-white/5"
      >
        <Bars3Icon class="h-6 w-6" />
      </button>

      <div class="flex items-center gap-3">
        <div class="w-8 h-8 border-2 border-blueprint-primary flex items-center justify-center">
          <span class="text-blueprint-primary font-bold text-lg">B</span>
        </div>
        <h1 class="text-xl font-bold text-blueprint-primary text-shadow-glow hidden sm:block">BLUEPRINT ADMIN</h1>
      </div>
    </div>

    <div class="relative">
      <button
        @click="toggleAccountMenu"
        class="flex items-center gap-3 px-4 py-2 border border-white/20 hover:border-blueprint-primary transition-colors blueprint-glow"
      >
        <UserCircleIcon class="h-6 w-6 text-blueprint-primary" />
        <span class="text-sm text-white hidden sm:block">{{ authStore.user?.username }}</span>
        <ChevronDownIcon class="h-4 w-4 text-blueprint-light" />
      </button>

      <Transition
        enter-active-class="transition ease-out duration-200"
        enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition ease-in duration-150"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-95"
      >
        <div
          v-if="accountMenuOpen"
          class="absolute right-0 mt-2 w-48 bg-blueprint-dark border border-white/20 shadow-lg shadow-blueprint-primary/20"
        >
          <div class="py-1">
            <button
              @click="handleProfile"
              class="w-full text-left px-4 py-2 text-sm text-white hover:bg-white/5 hover:text-blueprint-primary transition-colors flex items-center gap-2"
            >
              <UserIcon class="h-4 w-4" />
              Perfil
            </button>
            <button
              @click="handleLogout"
              class="w-full text-left px-4 py-2 text-sm text-white hover:bg-white/5 hover:text-red-400 transition-colors flex items-center gap-2"
            >
              <ArrowRightOnRectangleIcon class="h-4 w-4" />
              Cerrar Sesión
            </button>
          </div>
        </div>
      </Transition>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';
import { useUIStore } from '@/stores/ui.store';
import {
  Bars3Icon,
  UserCircleIcon,
  ChevronDownIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/vue/24/outline';

const router = useRouter();
const authStore = useAuthStore();
const uiStore = useUIStore();

const accountMenuOpen = ref(false);

const toggleAccountMenu = () => {
  accountMenuOpen.value = !accountMenuOpen.value;
};

const handleProfile = () => {
  accountMenuOpen.value = false;
};

const handleLogout = async () => {
  await authStore.logout();
  router.push('/login');
};

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (!target.closest('.relative')) {
    accountMenuOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>
