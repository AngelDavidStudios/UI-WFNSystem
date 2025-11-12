<template>
  <div>
    <div class="mb-8 flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold text-blueprint-primary text-shadow-glow mb-2">PROVISIONES</h1>
        <p class="text-blueprint-light">Gestión de Provisiones</p>
      </div>
      <BlueprintButton @click="openCreateModal" variant="primary">
        <PlusIcon class="h-5 w-5 mr-2" />
        Nueva Provisión
      </BlueprintButton>
    </div>

    <BlueprintCard v-if="provisionStore.isLoading" class="text-center py-12">
      <div class="flex justify-center items-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blueprint-primary"></div>
      </div>
    </BlueprintCard>

    <BlueprintCard v-else>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-blueprint-primary/20">
              <th class="text-left py-4 px-4 text-blueprint-light font-semibold">Empleado</th>
              <th class="text-left py-4 px-4 text-blueprint-light font-semibold">Tipo</th>
              <th class="text-left py-4 px-4 text-blueprint-light font-semibold">Periodo</th>
              <th class="text-right py-4 px-4 text-blueprint-light font-semibold">Mensual</th>
              <th class="text-right py-4 px-4 text-blueprint-light font-semibold">Acumulado</th>
              <th class="text-right py-4 px-4 text-blueprint-light font-semibold">Total</th>
              <th class="text-center py-4 px-4 text-blueprint-light font-semibold">Estado</th>
              <th class="text-center py-4 px-4 text-blueprint-light font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="provision in provisionStore.provisiones"
              :key="provision.iD_Provision"
              class="border-b border-blueprint-primary/10 hover:bg-blueprint-primary/5 transition-colors"
            >
              <td class="py-4 px-4 text-blueprint-light">
                {{ getEmpleadoName(provision.iD_Empleado) }}
              </td>
              <td class="py-4 px-4 text-blueprint-light">
                {{ provision.tipoProvision }}
              </td>
              <td class="py-4 px-4 text-blueprint-light">
                {{ provision.periodo }}
              </td>
              <td class="py-4 px-4 text-right text-blueprint-light">
                ${{ provision.valorMensual.toFixed(2) }}
              </td>
              <td class="py-4 px-4 text-right text-blueprint-light">
                ${{ provision.acumulado.toFixed(2) }}
              </td>
              <td class="py-4 px-4 text-right text-blueprint-light">
                ${{ provision.total.toFixed(2) }}
              </td>
              <td class="py-4 px-4 text-center">
                <span
                  :class="[
                    'px-3 py-1 rounded-full text-xs font-medium',
                    provision.isTrasnferred
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-yellow-500/20 text-yellow-400'
                  ]"
                >
                  {{ provision.isTrasnferred ? 'Transferido' : 'Pendiente' }}
                </span>
              </td>
              <td class="py-4 px-4">
                <div class="flex justify-center gap-2">
                  <button
                    @click="openEditModal(provision)"
                    class="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors"
                    title="Editar"
                  >
                    <PencilIcon class="h-5 w-5" />
                  </button>
                  <button
                    @click="handleDelete(provision.iD_Provision!)"
                    class="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                    title="Eliminar"
                  >
                    <TrashIcon class="h-5 w-5" />
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="provisionStore.provisiones.length === 0">
              <td colspan="8" class="py-12 text-center text-blueprint-light">
                No hay provisiones registradas
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </BlueprintCard>

    <BlueprintModal
      :show="showModal"
      :title="isEditMode ? 'Editar Provisión' : 'Nueva Provisión'"
      @close="closeModal"
    >
      <ProvisionForm
        :provision="selectedProvision"
        :is-edit-mode="isEditMode"
        @submit="handleSubmit"
        @cancel="closeModal"
      />
    </BlueprintModal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/vue/24/outline';
import BlueprintCard from '@/components/common/BlueprintCard.vue';
import BlueprintButton from '@/components/common/BlueprintButton.vue';
import BlueprintModal from '@/components/common/BlueprintModal.vue';
import ProvisionForm from '@/components/forms/ProvisionForm.vue';
import { useProvisionStore } from '@/stores/provision.store';
import { useEmpleadoStore } from '@/stores/empleado.store';
import { usePersonaStore } from '@/stores/persona.store';
import type { Provision, ProvisionFormData } from '@/types';

const provisionStore = useProvisionStore();
const empleadoStore = useEmpleadoStore();
const personaStore = usePersonaStore();

const showModal = ref(false);
const isEditMode = ref(false);
const selectedProvision = ref<Provision | undefined>(undefined);

const getEmpleadoName = (empleadoId: string): string => {
  const empleado = empleadoStore.empleados.find(e => e.iD_Empleado === empleadoId);
  if (empleado) {
    const persona = personaStore.personas.find(p => p.iD_Persona === empleado.iD_Persona);
    if (persona) {
      return `${persona.primerNombre} ${persona.apellidoPaterno}`;
    }
  }
  return empleadoId;
};

const openCreateModal = () => {
  isEditMode.value = false;
  selectedProvision.value = undefined;
  showModal.value = true;
};

const openEditModal = (provision: Provision) => {
  isEditMode.value = true;
  selectedProvision.value = provision;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  selectedProvision.value = undefined;
};

const handleSubmit = async (data: ProvisionFormData) => {
  let success = false;

  if (isEditMode.value && selectedProvision.value?.iD_Provision) {
    success = await provisionStore.update(selectedProvision.value.iD_Provision, data);
  } else {
    success = await provisionStore.create(data);
  }

  if (success) {
    await provisionStore.fetchAll();
    closeModal();
  }
};

const handleDelete = async (id: string) => {
  if (confirm('¿Está seguro de que desea eliminar esta provisión?')) {
    const success = await provisionStore.remove(id);
    if (success) {
      await provisionStore.fetchAll();
    }
  }
};

onMounted(async () => {
  await provisionStore.fetchAll();
  if (empleadoStore.empleados.length === 0) {
    await empleadoStore.fetchAll();
  }
  if (personaStore.personas.length === 0) {
    await personaStore.fetchAll();
  }
});
</script>
