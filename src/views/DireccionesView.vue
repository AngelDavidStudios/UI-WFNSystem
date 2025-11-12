<template>
  <div>
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-blueprint-primary text-shadow-glow mb-2">DIRECCIONES</h1>
      <p class="text-blueprint-light">Gestión de Direcciones por Persona</p>
    </div>

    <div class="mb-6">
      <BlueprintCard>
        <div class="p-4">
          <label class="block text-sm font-medium text-blueprint-primary mb-2">
            Seleccionar Persona
          </label>
          <select
            v-model="selectedPersonaId"
            @change="handlePersonaChange"
            class="w-full bg-blueprint-dark border border-blueprint-border rounded px-4 py-2 text-white focus:outline-none focus:border-blueprint-primary"
          >
            <option value="">-- Seleccione una persona --</option>
            <option
              v-for="persona in personaStore.personas"
              :key="persona.iD_Persona"
              :value="persona.iD_Persona"
            >
              {{ persona.primerNombre }} {{ persona.apellidoPaterno }} ({{ persona.dni }})
            </option>
          </select>
        </div>
      </BlueprintCard>
    </div>

    <BlueprintCard v-if="selectedPersonaId">
      <div class="mb-4 flex justify-between items-center">
        <h2 class="text-xl font-semibold text-blueprint-primary">
          Direcciones de {{ getPersonaName() }}
        </h2>
        <BlueprintButton @click="openCreateModal" variant="primary">
          <PlusIcon class="h-5 w-5 mr-2" />
          Nueva Dirección
        </BlueprintButton>
      </div>

      <div v-if="direccionStore.isLoading" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blueprint-primary mx-auto"></div>
        <p class="text-blueprint-light mt-4">Cargando direcciones...</p>
      </div>

      <div v-else-if="direccionStore.direcciones.length === 0" class="text-center py-12">
        <MapPinIcon class="h-16 w-16 text-blueprint-primary mx-auto mb-4" />
        <p class="text-blueprint-light">No hay direcciones registradas para esta persona</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-blueprint-border">
          <thead>
            <tr class="border-b border-blueprint-border">
              <th class="px-4 py-4 text-left text-xs font-semibold text-blueprint-primary uppercase tracking-wider">Calle</th>
              <th class="px-4 py-4 text-left text-xs font-semibold text-blueprint-primary uppercase tracking-wider">Número</th>
              <th class="px-4 py-4 text-left text-xs font-semibold text-blueprint-primary uppercase tracking-wider">Piso</th>
              <th class="px-4 py-4 text-right text-xs font-semibold text-blueprint-primary uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-blueprint-border/30">
            <tr
              v-for="direccion in direccionStore.direcciones"
              :key="direccion.iD_Direccion"
              class="hover:bg-blueprint-card/30 transition-colors"
            >
              <td class="px-4 py-4 text-sm text-white">{{ direccion.calle }}</td>
              <td class="px-4 py-4 text-sm text-blueprint-light">{{ direccion.numero }}</td>
              <td class="px-4 py-4 text-sm text-blueprint-light">{{ direccion.piso }}</td>
              <td class="px-4 py-4 whitespace-nowrap text-right text-sm">
                <button
                  @click="openEditModal(direccion)"
                  class="text-blueprint-primary hover:text-white transition-colors mr-3"
                  title="Editar"
                >
                  <PencilIcon class="h-5 w-5" />
                </button>
                <button
                  @click="handleDelete(direccion.iD_Direccion!)"
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

    <BlueprintCard v-else>
      <div class="text-center py-12">
        <MapPinIcon class="h-16 w-16 text-blueprint-primary mx-auto mb-4" />
        <p class="text-blueprint-light">Seleccione una persona para ver sus direcciones</p>
      </div>
    </BlueprintCard>

    <BlueprintModal
      :show="isModalOpen"
      :title="isEditing ? 'Editar Dirección' : 'Nueva Dirección'"
      @close="closeModal"
    >
      <DireccionForm
        :direccion="selectedDireccion"
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
import { usePersonaStore } from '@/stores/persona.store';
import { useDireccionStore } from '@/stores/direccion.store';
import BlueprintCard from '@/components/common/BlueprintCard.vue';
import BlueprintButton from '@/components/common/BlueprintButton.vue';
import BlueprintModal from '@/components/common/BlueprintModal.vue';
import DireccionForm from '@/components/forms/DireccionForm.vue';
import { MapPinIcon, PlusIcon, PencilIcon, TrashIcon } from '@heroicons/vue/24/outline';
import type { Direccion, DireccionFormData } from '@/types';

const personaStore = usePersonaStore();
const direccionStore = useDireccionStore();
const selectedPersonaId = ref<string>('');
const isModalOpen = ref(false);
const isEditing = ref(false);
const selectedDireccion = ref<Direccion | null>(null);

onMounted(async () => {
  await personaStore.fetchAll();
});

const handlePersonaChange = async () => {
  if (selectedPersonaId.value) {
    await direccionStore.fetchByPersonaId(selectedPersonaId.value);
  } else {
    direccionStore.clearDirecciones();
  }
};

const getPersonaName = () => {
  const persona = personaStore.personas.find(p => p.iD_Persona === selectedPersonaId.value);
  if (persona) {
    return `${persona.primerNombre} ${persona.apellidoPaterno}`;
  }
  return '';
};

const openCreateModal = () => {
  isEditing.value = false;
  selectedDireccion.value = null;
  isModalOpen.value = true;
};

const openEditModal = (direccion: Direccion) => {
  isEditing.value = true;
  selectedDireccion.value = direccion;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  selectedDireccion.value = null;
  isEditing.value = false;
};

const handleSubmit = async (formData: DireccionFormData) => {
  if (!selectedPersonaId.value) return;

  let success = false;

  if (isEditing.value && selectedDireccion.value?.iD_Direccion) {
    success = await direccionStore.update(
      selectedPersonaId.value,
      selectedDireccion.value.iD_Direccion,
      formData
    );
  } else {
    success = await direccionStore.create(selectedPersonaId.value, formData);
  }

  if (success) {
    closeModal();
  }
};

const handleDelete = async (direccionId: string) => {
  if (!selectedPersonaId.value) return;

  if (confirm('¿Está seguro de que desea eliminar esta dirección?')) {
    await direccionStore.remove(selectedPersonaId.value, direccionId);
  }
};
</script>
