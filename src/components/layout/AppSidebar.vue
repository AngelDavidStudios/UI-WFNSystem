<template>
  <div>
    <Transition
      enter-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-300"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="uiStore.sidebarOpen && uiStore.isMobile"
        @click="uiStore.closeSidebar"
        class="fixed inset-0 bg-black/50 z-40 lg:hidden"
      />
    </Transition>

    <aside
      :class="[
        'fixed lg:static inset-y-0 left-0 z-50 w-64 bg-blueprint-dark/90 backdrop-blur-sm border-r border-white/20 transform transition-transform duration-300 ease-in-out',
        uiStore.sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-0 lg:overflow-hidden'
      ]"
    >
      <nav class="h-full overflow-y-auto pt-6 pb-8 px-4">
        <div class="space-y-2">
          <SidebarItem
            v-for="item in menuItems"
            :key="item.id"
            :item="item"
            @navigate="handleNavigate"
          />
        </div>
      </nav>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue';
import { useUIStore } from '@/stores/ui.store';
import { useAuthStore } from '@/stores/auth.store';
import SidebarItem from './SidebarItem.vue';
import type { MenuItem } from '@/types';

const uiStore = useUIStore();
const authStore = useAuthStore();

const baseMenuItems: MenuItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
  },
  {
    id: 'personas',
    label: 'Personas',
    path: '/personas',
  },
  {
    id: 'departamentos',
    label: 'Departamentos',
    path: '/departamentos',
  },
  {
    id: 'bancos',
    label: 'Bancos',
    path: '/bancos',
  },
  {
    id: 'direcciones',
    label: 'Direcciones',
    path: '/direcciones',
  },
  {
    id: 'empleados',
    label: 'Empleados',
    path: '/empleados',
  },
  {
    id: 'provisiones',
    label: 'Provisiones',
    path: '/provisiones',
  },
  {
    id: 'workspaces',
    label: 'Workspaces',
    path: '/workspaces',
  },
  {
    id: 'nomina-workspace',
    label: 'Configuración Nómina',
    path: '',
    children: [
      {
        id: 'nomina-novedades',
        label: 'Novedades',
        path: '/nomina-workspace/novedades',
      },
      {
        id: 'nomina-parametros',
        label: 'Parámetros',
        path: '/nomina-workspace/parametros',
      },
    ],
  },
];

const adminMenuItems: MenuItem[] = [
  {
    id: 'admin-section',
    label: 'Administración',
    path: '',
    children: [
      {
        id: 'users',
        label: 'Usuarios',
        path: '/users',
      },
      {
        id: 'roles',
        label: 'Roles y Permisos',
        path: '/roles',
      },
    ],
  },
];

const menuItems = computed(() => {
  const items = [...baseMenuItems];
  if (authStore.isAdmin) {
    items.push(...adminMenuItems);
  }
  return items;
});

const handleNavigate = () => {
  if (uiStore.isMobile) {
    uiStore.closeSidebar();
  }
};

const handleResize = () => {
  uiStore.setMobile(window.innerWidth < 1024);
  if (window.innerWidth >= 1024) {
    uiStore.openSidebar();
  }
};

onMounted(() => {
  handleResize();
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});
</script>
