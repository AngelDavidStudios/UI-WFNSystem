import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';
import LoginView from '@/views/LoginView.vue';
import AppLayout from '@/components/layout/AppLayout.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { requiresAuth: false },
  },
  {
    path: '/',
    component: AppLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        redirect: '/dashboard',
      },
      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import('@/views/DashboardView.vue'),
      },
      {
        path: 'personas',
        name: 'personas',
        component: () => import('@/views/PersonasView.vue'),
      },
      {
        path: 'departamentos',
        name: 'departamentos',
        component: () => import('@/views/DepartamentosView.vue'),
      },
      {
        path: 'bancos',
        name: 'bancos',
        component: () => import('@/views/BancosView.vue'),
      },
      {
        path: 'direcciones',
        name: 'direcciones',
        component: () => import('@/views/DireccionesView.vue'),
      },
      {
        path: 'empleados',
        name: 'empleados',
        component: () => import('@/views/EmpleadosView.vue'),
      },
      {
        path: 'provisiones',
        name: 'provisiones',
        component: () => import('@/views/ProvisionesView.vue'),
      },
      {
        path: 'workspaces',
        name: 'workspaces',
        component: () => import('@/views/WorkspacesView.vue'),
      },
      {
        path: 'workspaces/:id',
        name: 'workspace-detail',
        component: () => import('@/views/WorkspaceDetailView.vue'),
      },
      {
        path: 'workspaces/:id/nominas/crear',
        name: 'workspace-nomina-crear',
        component: () => import('@/views/NominaBuilderView.vue'),
      },
      {
        path: 'workspaces/:id/nominas/:nominaId',
        name: 'workspace-nomina-editar',
        component: () => import('@/views/NominaBuilderView.vue'),
      },
      {
        path: 'nomina-workspace',
        redirect: '/nomina-workspace/novedades',
      },
      {
        path: 'nomina-workspace/novedades',
        name: 'nomina-novedades',
        component: () => import('@/views/NominaNovedadesView.vue'),
      },
      {
        path: 'nomina-workspace/parametros',
        name: 'nomina-parametros',
        component: () => import('@/views/NominaParametrosView.vue'),
      },
      {
        path: 'users',
        name: 'users',
        component: () => import('@/views/UserManagementView.vue'),
        meta: { requiresAdmin: true },
      },
      {
        path: 'roles',
        name: 'roles',
        component: () => import('@/views/RoleManagementView.vue'),
        meta: { requiresAdmin: true },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, _from, next) => {
  const authStore = useAuthStore();
  await authStore.checkAuth();

  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const requiresAdmin = to.matched.some((record) => record.meta.requiresAdmin);

  if (requiresAuth && !authStore.isAuthenticated) {
    next('/login');
  } else if (to.path === '/login' && authStore.isAuthenticated) {
    next('/dashboard');
  } else if (requiresAdmin && !authStore.isAdmin) {
    next('/dashboard');
  } else {
    next();
  }
});

export default router;
