<template>
  <div>
    <div class="mb-8 flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold text-blueprint-primary text-shadow-glow mb-2">DEPARTAMENTOS</h1>
        <p class="text-blueprint-light">Gestión de Departamentos</p>
      </div>
      <BlueprintButton @click="openCreateModal" variant="primary">
        <PlusIcon class="h-5 w-5 mr-2" />
        Nuevo Departamento
      </BlueprintButton>
    </div>

    <BlueprintCard>
      <div v-if="departamentoStore.isLoading" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blueprint-primary mx-auto"></div>
        <p class="text-blueprint-light mt-4">Cargando departamentos...</p>
      </div>

      <div v-else-if="departamentoStore.departamentos.length === 0" class="text-center py-12">
        <BuildingOfficeIcon class="h-16 w-16 text-blueprint-primary mx-auto mb-4" />
        <p class="text-blueprint-light">No hay departamentos registrados</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-blueprint-border">
          <thead>
            <tr class="border-b border-blueprint-border">
              <th class="px-4 py-4 text-left text-xs font-semibold text-blueprint-primary uppercase tracking-wider">Nombre</th>
              <th class="px-4 py-4 text-left text-xs font-semibold text-blueprint-primary uppercase tracking-wider">Ubicación</th>
              <th class="px-4 py-4 text-left text-xs font-semibold text-blueprint-primary uppercase tracking-wider">Email</th>
              <th class="px-4 py-4 text-left text-xs font-semibold text-blueprint-primary uppercase tracking-wider">Teléfono</th>
              <th class="px-4 py-4 text-left text-xs font-semibold text-blueprint-primary uppercase tracking-wider">Cargo</th>
              <th class="px-4 py-4 text-left text-xs font-semibold text-blueprint-primary uppercase tracking-wider">Centro de Costo</th>
              <th class="px-4 py-4 text-right text-xs font-semibold text-blueprint-primary uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-blueprint-border/30">
            <tr
              v-for="departamento in departamentoStore.departamentos"
              :key="departamento.iD_Departamento"
              class="hover:bg-blueprint-card/30 transition-colors"
            >
              <td class="px-4 py-4 whitespace-nowrap text-sm text-white">{{ departamento.nombre }}</td>
              <td class="px-4 py-4 whitespace-nowrap text-sm text-blueprint-light">{{ departamento.ubicacion }}</td>
              <td class="px-4 py-4 text-sm text-blueprint-light">{{ departamento.email }}</td>
              <td class="px-4 py-4 text-sm text-blueprint-light">{{ departamento.telefono }}</td>
              <td class="px-4 py-4 text-sm text-blueprint-light">{{ departamento.cargo }}</td>
              <td class="px-4 py-4 text-sm text-blueprint-light">{{ departamento.centroCosto }}</td>
              <td class="px-4 py-4 whitespace-nowrap text-right text-sm">
                <button
                  @click="openEditModal(departamento)"
                  class="text-blueprint-primary hover:text-white transition-colors mr-3"
                  title="Editar"
                >
                  <PencilIcon class="h-5 w-5" />
                </button>
                <button
                  @click="handleDelete(departamento.iD_Departamento!)"
                  class="text-red-400 hover:text-red-300 transition-colors"
                  title="Eliminar"
                >
                  <TrashIcon class="h-5 w-5" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </BlueprintCard>

    <BlueprintModal
      :show="isModalOpen"
      :title="isEditing ? 'Editar Departamento' : 'Nuevo Departamento'"
      @close="closeModal"
    >
      <DepartamentoForm
        :departamento="selectedDepartamento"
        :isEditing="isEditing"
        @submit="handleSubmit"
        @cancel="closeModal"
      />
      <template #footer>
        <span></span>
      </template>
    </BlueprintModal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useDepartamentoStore } from '@/stores/departamento.store';
import BlueprintCard from '@/components/common/BlueprintCard.vue';
import BlueprintButton from '@/components/common/BlueprintButton.vue';
import BlueprintModal from '@/components/common/BlueprintModal.vue';
import DepartamentoForm from '@/components/forms/DepartamentoForm.vue';
import { BuildingOfficeIcon, PlusIcon, PencilIcon, TrashIcon } from '@heroicons/vue/24/outline';
import type { Departamento, DepartamentoFormData } from '@/types';

const departamentoStore = useDepartamentoStore();
const isModalOpen = ref(false);
const isEditing = ref(false);
const selectedDepartamento = ref<Departamento | null>(null);

onMounted(async () => {
  await departamentoStore.fetchAll();
});

const openCreateModal = () => {
  isEditing.value = false;
  selectedDepartamento.value = null;
  isModalOpen.value = true;
};

const openEditModal = (departamento: Departamento) => {
  isEditing.value = true;
  selectedDepartamento.value = departamento;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  selectedDepartamento.value = null;
  isEditing.value = false;
};

const handleSubmit = async (formData: DepartamentoFormData) => {
  let success = false;

  if (isEditing.value && selectedDepartamento.value?.iD_Departamento) {
    success = await departamentoStore.update(selectedDepartamento.value.iD_Departamento, formData);
  } else {
    success = await departamentoStore.create(formData);
  }

  if (success) {
    closeModal();
  }
};

const handleDelete = async (id: string) => {
  if (confirm('¿Está seguro de que desea eliminar este departamento?')) {
    await departamentoStore.remove(id);
  }
};
</script>
