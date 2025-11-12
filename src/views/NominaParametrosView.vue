<template>
  <div>
    <div class="mb-8 flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold text-blueprint-primary text-shadow-glow mb-2">NÓMINA - PARÁMETROS</h1>
        <p class="text-blueprint-light">Configuración de Parámetros de Nómina</p>
      </div>
      <BlueprintButton @click="openCreateModal" variant="primary">
        <PlusIcon class="h-5 w-5 mr-2" />
        Nuevo Parámetro
      </BlueprintButton>
    </div>

    <BlueprintCard v-if="parametroStore.isLoading" class="text-center py-12">
      <div class="flex justify-center items-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blueprint-primary"></div>
      </div>
    </BlueprintCard>

    <BlueprintCard v-else>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-blueprint-primary/20">
              <th class="text-left py-4 px-4 text-blueprint-light font-semibold">Tipo</th>
              <th class="text-left py-4 px-4 text-blueprint-light font-semibold">Descripción</th>
              <th class="text-left py-4 px-4 text-blueprint-light font-semibold">Fecha Creación</th>
              <th class="text-center py-4 px-4 text-blueprint-light font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="parametro in parametroStore.parametros"
              :key="parametro.iD_Parametro"
              class="border-b border-blueprint-primary/10 hover:bg-blueprint-primary/5 transition-colors"
            >
              <td class="py-4 px-4 text-blueprint-light font-medium">
                {{ parametro.tipo }}
              </td>
              <td class="py-4 px-4 text-blueprint-light">
                {{ parametro.descripcion }}
              </td>
              <td class="py-4 px-4 text-blueprint-light">
                {{ formatDate(parametro.dateCreated) }}
              </td>
              <td class="py-4 px-4">
                <div class="flex justify-center gap-2">
                  <button
                    @click="openEditModal(parametro)"
                    class="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors"
                    title="Editar"
                  >
                    <PencilIcon class="h-5 w-5" />
                  </button>
                  <button
                    @click="handleDelete(parametro.iD_Parametro!)"
                    class="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                    title="Eliminar"
                  >
                    <TrashIcon class="h-5 w-5" />
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="parametroStore.parametros.length === 0">
              <td colspan="4" class="py-12 text-center text-blueprint-light">
                No hay parámetros registrados
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </BlueprintCard>

    <BlueprintModal
      :show="showModal"
      :title="isEditMode ? 'Editar Parámetro' : 'Nuevo Parámetro'"
      @close="closeModal"
    >
      <ParametroForm
        :parametro="selectedParametro"
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
import ParametroForm from '@/components/forms/ParametroForm.vue';
import { useParametroStore } from '@/stores/parametro.store';
import type { Parametro, ParametroFormData } from '@/types';

const parametroStore = useParametroStore();

const showModal = ref(false);
const isEditMode = ref(false);
const selectedParametro = ref<Parametro | undefined>(undefined);

const formatDate = (dateString?: string): string => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('es-EC', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

const openCreateModal = () => {
  isEditMode.value = false;
  selectedParametro.value = undefined;
  showModal.value = true;
};

const openEditModal = (parametro: Parametro) => {
  isEditMode.value = true;
  selectedParametro.value = parametro;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  selectedParametro.value = undefined;
};

const handleSubmit = async (data: ParametroFormData) => {
  let success = false;

  if (isEditMode.value && selectedParametro.value?.iD_Parametro) {
    success = await parametroStore.update(selectedParametro.value.iD_Parametro, data);
  } else {
    success = await parametroStore.create(data);
  }

  if (success) {
    await parametroStore.fetchAll();
    closeModal();
  }
};

const handleDelete = async (id: string) => {
  if (confirm('¿Está seguro de que desea eliminar este parámetro?')) {
    const success = await parametroStore.remove(id);
    if (success) {
      await parametroStore.fetchAll();
    }
  }
};

onMounted(async () => {
  await parametroStore.fetchAll();
});
</script>
