<template>
  <div>
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-blueprint-primary text-shadow-glow mb-2">DASHBOARD</h1>
      <p class="text-blueprint-light">Panel de Control Principal</p>
    </div>

    <div v-if="isLoading" class="text-center py-12">
      <p class="text-blueprint-light">Cargando datos...</p>
    </div>

    <div v-else>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <BlueprintCard class="blueprint-glow cursor-pointer hover:scale-105 transition-transform" @click="navigateTo('/personas')">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-blueprint-light text-sm uppercase tracking-wide mb-1">Total Personas</p>
              <h3 class="text-3xl font-bold text-white">{{ stats.totalPersonas }}</h3>
            </div>
            <div class="w-12 h-12 border-2 border-blueprint-primary flex items-center justify-center">
              <UsersIcon class="h-6 w-6 text-blueprint-primary" />
            </div>
          </div>
        </BlueprintCard>

        <BlueprintCard class="blueprint-glow cursor-pointer hover:scale-105 transition-transform" @click="navigateTo('/empleados')">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-blueprint-light text-sm uppercase tracking-wide mb-1">Empleados</p>
              <h3 class="text-3xl font-bold text-white">{{ stats.totalEmpleados }}</h3>
            </div>
            <div class="w-12 h-12 border-2 border-blueprint-primary flex items-center justify-center">
              <UserGroupIcon class="h-6 w-6 text-blueprint-primary" />
            </div>
          </div>
        </BlueprintCard>

        <BlueprintCard class="blueprint-glow cursor-pointer hover:scale-105 transition-transform" @click="navigateTo('/departamentos')">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-blueprint-light text-sm uppercase tracking-wide mb-1">Departamentos</p>
              <h3 class="text-3xl font-bold text-white">{{ stats.totalDepartamentos }}</h3>
            </div>
            <div class="w-12 h-12 border-2 border-blueprint-primary flex items-center justify-center">
              <BuildingOfficeIcon class="h-6 w-6 text-blueprint-primary" />
            </div>
          </div>
        </BlueprintCard>

        <BlueprintCard class="blueprint-glow cursor-pointer hover:scale-105 transition-transform" @click="navigateTo('/workspaces')">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-blueprint-light text-sm uppercase tracking-wide mb-1">Workspaces</p>
              <h3 class="text-3xl font-bold text-white">{{ stats.totalWorkspaces }}</h3>
            </div>
            <div class="w-12 h-12 border-2 border-green-500 flex items-center justify-center">
              <BriefcaseIcon class="h-6 w-6 text-green-500" />
            </div>
          </div>
        </BlueprintCard>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <BlueprintCard>
          <h2 class="text-xl font-bold text-blueprint-primary mb-4">Distribución por Departamento</h2>
          <div class="h-64">
            <Bar :data="departmentChartData" :options="chartOptions" />
          </div>
        </BlueprintCard>

        <BlueprintCard>
          <h2 class="text-xl font-bold text-blueprint-primary mb-4">Nóminas por Workspace</h2>
          <div class="h-64">
            <Doughnut :data="nominaChartData" :options="doughnutOptions" />
          </div>
        </BlueprintCard>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <BlueprintCard class="blueprint-glow">
          <div class="text-center">
            <p class="text-blueprint-light text-sm uppercase tracking-wide mb-2">Total Ingresos</p>
            <h3 class="text-3xl font-bold text-green-400">${{ stats.totalIngresos.toFixed(2) }}</h3>
          </div>
        </BlueprintCard>

        <BlueprintCard class="blueprint-glow">
          <div class="text-center">
            <p class="text-blueprint-light text-sm uppercase tracking-wide mb-2">Total Egresos</p>
            <h3 class="text-3xl font-bold text-red-400">${{ stats.totalEgresos.toFixed(2) }}</h3>
          </div>
        </BlueprintCard>

        <BlueprintCard class="blueprint-glow">
          <div class="text-center">
            <p class="text-blueprint-light text-sm uppercase tracking-wide mb-2">Neto a Pagar</p>
            <h3 class="text-3xl font-bold text-blueprint-primary">${{ stats.netoTotal.toFixed(2) }}</h3>
          </div>
        </BlueprintCard>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BlueprintCard>
          <h2 class="text-xl font-bold text-blueprint-primary mb-4">Últimos Workspaces</h2>
          <div class="space-y-3">
            <div
              v-for="workspace in recentWorkspaces"
              :key="workspace.iD_Workspace"
              class="flex items-center justify-between p-3 border border-blueprint-primary/30 rounded cursor-pointer hover:bg-blueprint-primary/10 transition-colors"
              @click="navigateTo(`/workspaces/${workspace.iD_Workspace}`)"
            >
              <div>
                <p class="text-white font-semibold">{{ workspace.nombre }}</p>
                <p class="text-blueprint-light text-sm">{{ workspace.periodo }}</p>
              </div>
              <span :class="[
                'px-3 py-1 rounded text-xs font-semibold',
                workspace.estado === 0 ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
              ]">
                {{ workspace.estado === 0 ? 'Activo' : 'Cerrado' }}
              </span>
            </div>
            <div v-if="recentWorkspaces.length === 0" class="text-center py-8 text-blueprint-light/60">
              No hay workspaces disponibles
            </div>
          </div>
        </BlueprintCard>

        <BlueprintCard>
          <h2 class="text-xl font-bold text-blueprint-primary mb-4">Estado del Sistema</h2>
          <div class="space-y-4">
            <div class="flex items-center justify-between p-3 border border-blueprint-primary/30 rounded">
              <div class="flex items-center gap-3">
                <span class="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                <span class="text-blueprint-light">Base de Datos</span>
              </div>
              <span class="text-green-400 font-semibold">Conectada</span>
            </div>
            <div class="flex items-center justify-between p-3 border border-blueprint-primary/30 rounded">
              <div class="flex items-center gap-3">
                <span class="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                <span class="text-blueprint-light">API Externa</span>
              </div>
              <span class="text-green-400 font-semibold">Activa</span>
            </div>
            <div class="flex items-center justify-between p-3 border border-blueprint-primary/30 rounded">
              <div class="flex items-center gap-3">
                <span class="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                <span class="text-blueprint-light">Módulos</span>
              </div>
              <span class="text-green-400 font-semibold">Operativos</span>
            </div>
          </div>
        </BlueprintCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Bar, Doughnut } from 'vue-chartjs';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import BlueprintCard from '@/components/common/BlueprintCard.vue';
import { UsersIcon, BuildingOfficeIcon, UserGroupIcon, BriefcaseIcon } from '@heroicons/vue/24/outline';
import { usePersonaStore } from '@/stores/persona.store';
import { useEmpleadoStore } from '@/stores/empleado.store';
import { useDepartamentoStore } from '@/stores/departamento.store';
import { useWorkspaceStore } from '@/stores/workspace.store';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const router = useRouter();
const personaStore = usePersonaStore();
const empleadoStore = useEmpleadoStore();
const departamentoStore = useDepartamentoStore();
const workspaceStore = useWorkspaceStore();

const isLoading = ref(true);

const stats = computed(() => ({
  totalPersonas: personaStore.personas.length,
  totalEmpleados: empleadoStore.empleados.length,
  totalDepartamentos: departamentoStore.departamentos.length,
  totalWorkspaces: workspaceStore.workspaces.length,
  totalIngresos: workspaceStore.workspaces.reduce((sum, w) =>
    sum + (w.nominas?.reduce((nSum, n) => nSum + (n.totalIngresos || 0), 0) || 0), 0
  ),
  totalEgresos: workspaceStore.workspaces.reduce((sum, w) =>
    sum + (w.nominas?.reduce((nSum, n) => nSum + (n.totalEgresos || 0), 0) || 0), 0
  ),
  netoTotal: workspaceStore.workspaces.reduce((sum, w) =>
    sum + (w.nominas?.reduce((nSum, n) => nSum + (n.netoAPagar || 0), 0) || 0), 0
  )
}));

const recentWorkspaces = computed(() => {
  return workspaceStore.workspaces.slice(0, 5);
});

const departmentChartData = computed(() => {
  const deptCounts: Record<string, number> = {};

  empleadoStore.empleados.forEach(emp => {
    const dept = departamentoStore.departamentos.find(d => d.iD_Departamento === emp.iD_Departamento);
    const deptName = dept?.nombre || 'Sin Departamento';
    deptCounts[deptName] = (deptCounts[deptName] || 0) + 1;
  });

  return {
    labels: Object.keys(deptCounts),
    datasets: [{
      label: 'Empleados',
      data: Object.values(deptCounts),
      backgroundColor: 'rgba(0, 255, 255, 0.6)',
      borderColor: 'rgba(0, 255, 255, 1)',
      borderWidth: 1
    }]
  };
});

const nominaChartData = computed(() => {
  const nominaCounts = workspaceStore.workspaces.map(w => w.nominas?.length || 0);
  const labels = workspaceStore.workspaces.map(w => w.nombre);

  return {
    labels,
    datasets: [{
      label: 'Nóminas',
      data: nominaCounts,
      backgroundColor: [
        'rgba(0, 255, 255, 0.6)',
        'rgba(0, 255, 0, 0.6)',
        'rgba(255, 255, 0, 0.6)',
        'rgba(255, 0, 255, 0.6)',
        'rgba(255, 128, 0, 0.6)'
      ],
      borderColor: [
        'rgba(0, 255, 255, 1)',
        'rgba(0, 255, 0, 1)',
        'rgba(255, 255, 0, 1)',
        'rgba(255, 0, 255, 1)',
        'rgba(255, 128, 0, 1)'
      ],
      borderWidth: 2
    }]
  };
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        color: '#00ffff'
      },
      grid: {
        color: 'rgba(0, 255, 255, 0.1)'
      }
    },
    x: {
      ticks: {
        color: '#00ffff'
      },
      grid: {
        color: 'rgba(0, 255, 255, 0.1)'
      }
    }
  }
};

const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: {
        color: '#00ffff',
        padding: 15
      }
    }
  }
};

const navigateTo = (path: string) => {
  router.push(path);
};

onMounted(async () => {
  isLoading.value = true;
  try {
    await Promise.all([
      personaStore.fetchAll(),
      empleadoStore.fetchAll(),
      departamentoStore.fetchAll(),
      workspaceStore.fetchAll()
    ]);
  } catch (error) {
    console.error('Error loading dashboard data:', error);
  } finally {
    isLoading.value = false;
  }
});
</script>
