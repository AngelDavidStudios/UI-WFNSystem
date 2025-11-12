<template>
  <div class="space-y-6">
    <div class="flex items-center gap-4 mb-6">
      <BlueprintButton @click="goBack" variant="secondary">
        ← Volver
      </BlueprintButton>
      <div class="flex-1">
        <h1 class="text-3xl font-bold text-blueprint-primary text-shadow-glow">
          {{ getWorkspaceName() }}
        </h1>
        <p class="text-blueprint-light/60 text-sm mt-1">
          {{ formatDateRange() }}
        </p>
      </div>
      <span
        :class="[
          'px-4 py-2 rounded-lg text-sm font-semibold',
          currentWorkspace?.estado === 0
            ? 'bg-green-500/20 text-green-400'
            : 'bg-gray-500/20 text-gray-400'
        ]"
      >
        {{ currentWorkspace?.estado === 0 ? 'Activo' : 'Cerrado' }}
      </span>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <BlueprintCard class="text-center">
        <p class="text-blueprint-light/60 text-sm mb-1">Total Nóminas</p>
        <p class="text-3xl font-bold text-blueprint-primary">
          {{ currentWorkspace?.nominas?.length || 0 }}
        </p>
      </BlueprintCard>
      <BlueprintCard class="text-center">
        <p class="text-blueprint-light/60 text-sm mb-1">Total Ingresos</p>
        <p class="text-3xl font-bold text-green-400">
          ${{ totalIngresos.toFixed(2) }}
        </p>
      </BlueprintCard>
      <BlueprintCard class="text-center">
        <p class="text-blueprint-light/60 text-sm mb-1">Total Egresos</p>
        <p class="text-3xl font-bold text-red-400">
          ${{ totalEgresos.toFixed(2) }}
        </p>
      </BlueprintCard>
      <BlueprintCard class="text-center">
        <p class="text-blueprint-light/60 text-sm mb-1">Neto a Pagar</p>
        <p class="text-3xl font-bold text-blueprint-primary">
          ${{ totalNeto.toFixed(2) }}
        </p>
      </BlueprintCard>
    </div>

    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-bold text-blueprint-primary">Nóminas</h2>
      <BlueprintButton @click="createNomina" icon="plus">
        Nueva Nómina
      </BlueprintButton>
    </div>

    <div v-if="workspaceStore.isLoading" class="text-center py-12">
      <p class="text-blueprint-light">Cargando nóminas...</p>
    </div>

    <div v-else-if="!currentWorkspace?.nominas || currentWorkspace.nominas.length === 0" class="text-center py-12">
      <p class="text-blueprint-light/60">No hay nóminas en este workspace</p>
    </div>

    <div v-else class="space-y-4">
      <BlueprintCard
        v-for="nomina in currentWorkspace.nominas"
        :key="nomina.iD_Nomina"
      >
        <div class="flex justify-between items-center">
          <div class="flex-1">
            <h3 class="text-lg font-bold text-blueprint-primary mb-2">
              {{ getEmpleadoName(nomina.iD_Empleado) }}
            </h3>
            <div class="grid grid-cols-4 gap-4 text-sm text-blueprint-light/80">
              <div>
                <p class="font-medium">Periodo</p>
                <p>{{ nomina.periodo }}</p>
              </div>
              <div>
                <p class="font-medium">Ingresos</p>
                <p class="text-green-400">${{ nomina.totalIngresos.toFixed(2) }}</p>
              </div>
              <div>
                <p class="font-medium">Egresos</p>
                <p class="text-red-400">${{ nomina.totalEgresos.toFixed(2) }}</p>
              </div>
              <div>
                <p class="font-medium">Neto a Pagar</p>
                <p class="text-blueprint-primary font-bold">${{ nomina.netoAPagar.toFixed(2) }}</p>
              </div>
            </div>
          </div>
          <div class="flex gap-2">
            <BlueprintButton @click="editNomina(nomina)" variant="secondary">
              Editar
            </BlueprintButton>
            <BlueprintButton @click="confirmDeleteNomina(nomina)" variant="secondary" class="!text-red-400">
              <TrashIcon class="h-5 w-5" />
            </BlueprintButton>
          </div>
        </div>
      </BlueprintCard>
    </div>

    <BlueprintModal
      :show="showDeleteModal"
      @close="showDeleteModal = false"
      title="Confirmar Eliminación"
    >
      <p class="text-blueprint-light mb-6">
        ¿Está seguro que desea eliminar esta nómina? Esta acción no se puede deshacer.
      </p>
      <template #footer>
        <BlueprintButton variant="secondary" @click="showDeleteModal = false">
          Cancelar
        </BlueprintButton>
        <BlueprintButton variant="primary" @click="handleDeleteNomina" class="!bg-red-500 hover:!bg-red-600">
          Eliminar
        </BlueprintButton>
      </template>
    </BlueprintModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { TrashIcon } from '@heroicons/vue/24/outline';
import BlueprintCard from '@/components/common/BlueprintCard.vue';
import BlueprintButton from '@/components/common/BlueprintButton.vue';
import BlueprintModal from '@/components/common/BlueprintModal.vue';
import { useWorkspaceStore } from '@/stores/workspace.store';
import { useEmpleadoStore } from '@/stores/empleado.store';
import type { Nomina } from '@/types';

const route = useRoute();
const router = useRouter();
const workspaceStore = useWorkspaceStore();
const empleadoStore = useEmpleadoStore();

const showDeleteModal = ref(false);
const nominaToDelete = ref<Nomina | null>(null);

const currentWorkspace = computed(() => workspaceStore.currentWorkspace);

const totalIngresos = computed(() => {
  return currentWorkspace.value?.nominas?.reduce((sum, n) => sum + n.totalIngresos, 0) || 0;
});

const totalEgresos = computed(() => {
  return currentWorkspace.value?.nominas?.reduce((sum, n) => sum + n.totalEgresos, 0) || 0;
});

const totalNeto = computed(() => {
  return currentWorkspace.value?.nominas?.reduce((sum, n) => sum + n.netoAPagar, 0) || 0;
});

const goBack = () => {
  router.push('/workspaces');
};

const createNomina = () => {
  router.push(`/workspaces/${route.params.id}/nominas/crear`);
};

const editNomina = (nomina: Nomina) => {
  router.push(`/workspaces/${route.params.id}/nominas/${nomina.iD_Nomina}`);
};

const confirmDeleteNomina = (nomina: Nomina) => {
  nominaToDelete.value = nomina;
  showDeleteModal.value = true;
};

const handleDeleteNomina = async () => {
  if (nominaToDelete.value && currentWorkspace.value) {
    const updatedNominas = currentWorkspace.value.nominas.filter(
      n => n.iD_Nomina !== nominaToDelete.value?.iD_Nomina
    );

    await workspaceStore.update(currentWorkspace.value.iD_Workspace!, {
      nominas: updatedNominas
    });

    showDeleteModal.value = false;
    nominaToDelete.value = null;
  }
};

const getWorkspaceName = () => {
  if (!currentWorkspace.value) return '';
  const date = new Date(currentWorkspace.value.fechaCreacion);
  return `${date.toLocaleString('es-ES', { month: 'long' })} ${date.getFullYear()}`.toUpperCase();
};

const formatDateRange = () => {
  if (!currentWorkspace.value) return '';
  const inicio = new Date(currentWorkspace.value.fechaCreacion);
  const fin = new Date(currentWorkspace.value.fechaCierre);
  return `${inicio.toLocaleDateString('es-ES')} - ${fin.toLocaleDateString('es-ES')}`;
};

const getEmpleadoName = (idEmpleado: string) => {
  const empleado = empleadoStore.empleados.find(e => e.iD_Empleado === idEmpleado);
  return empleado ? `Empleado ${idEmpleado.substring(0, 8)}...` : 'Desconocido';
};

onMounted(async () => {
  const workspaceId = route.params.id as string;
  if (workspaceId) {
    await workspaceStore.fetchById(workspaceId);
  }
  if (empleadoStore.empleados.length === 0) {
    await empleadoStore.fetchAll();
  }
});
</script>
