<template>
  <div>
    <div class="mb-8 flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold text-blueprint-primary text-shadow-glow mb-2">NÓMINA - NOVEDADES</h1>
        <p class="text-blueprint-light">Gestión de Novedades en Nómina</p>
      </div>
      <BlueprintButton @click="openCreateModal" variant="primary">
        <PlusIcon class="h-5 w-5 mr-2" />
        Nueva Novedad
      </BlueprintButton>
    </div>

    <BlueprintCard v-if="novedadStore.isLoading" class="text-center py-12">
      <div class="flex justify-center items-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blueprint-primary"></div>
      </div>
    </BlueprintCard>

    <BlueprintCard v-else>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-blueprint-primary/20">
              <th class="text-left py-4 px-4 text-blueprint-light font-semibold">Parámetro</th>
              <th class="text-left py-4 px-4 text-blueprint-light font-semibold">Tipo Novedad</th>
              <th class="text-left py-4 px-4 text-blueprint-light font-semibold">Descripción</th>
              <th class="text-left py-4 px-4 text-blueprint-light font-semibold">Fecha</th>
              <th class="text-right py-4 px-4 text-blueprint-light font-semibold">Monto</th>
              <th class="text-center py-4 px-4 text-blueprint-light font-semibold">Gravable</th>
              <th class="text-center py-4 px-4 text-blueprint-light font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="novedad in novedadStore.novedades"
              :key="novedad.iD_Novedad"
              class="border-b border-blueprint-primary/10 hover:bg-blueprint-primary/5 transition-colors"
            >
              <td class="py-4 px-4 text-blueprint-light">
                {{ getParametroName(novedad.iD_Parametro) }}
              </td>
              <td class="py-4 px-4 text-blueprint-light font-medium">
                {{ novedad.tipoNovedad }}
              </td>
              <td class="py-4 px-4 text-blueprint-light">
                {{ novedad.descripcion }}
              </td>
              <td class="py-4 px-4 text-blueprint-light">
                {{ formatDate(novedad.fechaIngresada) }}
              </td>
              <td class="py-4 px-4 text-right text-blueprint-light font-mono">
                ${{ novedad.montoAplicado.toFixed(2) }}
              </td>
              <td class="py-4 px-4 text-center">
                <span
                  :class="novedad.is_Gravable ? 'bg-green-400/10 text-green-400' : 'bg-gray-400/10 text-gray-400'"
                  class="px-2 py-1 rounded text-xs font-medium"
                >
                  {{ novedad.is_Gravable ? 'Sí' : 'No' }}
                </span>
              </td>
              <td class="py-4 px-4">
                <div class="flex justify-center gap-2">
                  <button
                    @click="openEditModal(novedad)"
                    class="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors"
                    title="Editar"
                  >
                    <PencilIcon class="h-5 w-5" />
                  </button>
                  <button
                    @click="handleDelete(novedad.iD_Novedad!)"
                    class="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                    title="Eliminar"
                  >
                    <TrashIcon class="h-5 w-5" />
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="novedadStore.novedades.length === 0">
              <td colspan="7" class="py-12 text-center text-blueprint-light">
                No hay novedades registradas
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </BlueprintCard>

    <BlueprintModal
      :show="showModal"
      :title="isEditMode ? 'Editar Novedad' : 'Nueva Novedad'"
      @close="closeModal"
    >
      <NovedadForm
        :novedad="selectedNovedad"
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
import NovedadForm from '@/components/forms/NovedadForm.vue';
import { useNovedadStore } from '@/stores/novedad.store';
import { useParametroStore } from '@/stores/parametro.store';
import type { Novedad, NovedadFormData } from '@/types';

const novedadStore = useNovedadStore();
const parametroStore = useParametroStore();

const showModal = ref(false);
const isEditMode = ref(false);
const selectedNovedad = ref<Novedad | undefined>(undefined);

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-EC', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

const getParametroName = (parametroId: string): string => {
  const parametro = parametroStore.parametros.find(p => p.iD_Parametro === parametroId);
  return parametro ? `${parametro.tipo}` : 'N/A';
};

const openCreateModal = () => {
  isEditMode.value = false;
  selectedNovedad.value = undefined;
  showModal.value = true;
};

const openEditModal = (novedad: Novedad) => {
  isEditMode.value = true;
  selectedNovedad.value = novedad;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  selectedNovedad.value = undefined;
};

const handleSubmit = async (data: NovedadFormData) => {
  let success = false;

  if (isEditMode.value && selectedNovedad.value?.iD_Novedad) {
    success = await novedadStore.update(selectedNovedad.value.iD_Novedad, data);
  } else {
    success = await novedadStore.create(data);
  }

  if (success) {
    await novedadStore.fetchAll();
    closeModal();
  }
};

const handleDelete = async (id: string) => {
  if (confirm('¿Está seguro de que desea eliminar esta novedad?')) {
    const success = await novedadStore.remove(id);
    if (success) {
      await novedadStore.fetchAll();
    }
  }
};

onMounted(async () => {
  await parametroStore.fetchAll();
  await novedadStore.fetchAll();
});
</script>
