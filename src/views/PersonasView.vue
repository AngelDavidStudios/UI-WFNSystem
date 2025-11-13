<template>
  <div>
    <div class="mb-8 flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-blueprint-primary text-shadow-glow mb-2">PERSONAS</h1>
        <p class="text-blueprint-light">Gestión de Personas del Sistema</p>
      </div>
      <BlueprintButton @click="openCreateModal">
        <PlusIcon class="h-5 w-5 inline-block mr-2" />
        Nueva Persona
      </BlueprintButton>
    </div>

    <div v-if="personaStore.error" class="mb-4 p-4 border border-red-400/30 bg-red-400/10 text-red-400">
      {{ personaStore.error }}
    </div>

    <BlueprintCard>
      <div v-if="personaStore.isLoading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blueprint-primary"></div>
        <p class="text-blueprint-light mt-4">Cargando personas...</p>
      </div>

      <div v-else-if="personaStore.personas.length === 0" class="text-center py-12">
        <UsersIcon class="h-16 w-16 text-blueprint-primary mx-auto mb-4" />
        <p class="text-blueprint-light">No hay personas registradas</p>
        <BlueprintButton @click="openCreateModal" class="mt-4">
          Crear Primera Persona
        </BlueprintButton>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-white/20">
              <th class="px-4 py-3 text-left text-xs font-medium text-blueprint-primary uppercase tracking-wider">DNI</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-blueprint-primary uppercase tracking-wider">Nombre Completo</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-blueprint-primary uppercase tracking-wider">Género</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-blueprint-primary uppercase tracking-wider">Edad</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-blueprint-primary uppercase tracking-wider">Correo</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-blueprint-primary uppercase tracking-wider">Teléfono</th>
              <th class="px-4 py-3 text-right text-xs font-medium text-blueprint-primary uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-white/10">
            <tr
              v-for="persona in personaStore.personas"
              :key="persona.iD_Persona"
              class="hover:bg-white/5 transition-colors"
            >
              <td class="px-4 py-4 whitespace-nowrap text-sm text-white">{{ persona.dni }}</td>
              <td class="px-4 py-4 whitespace-nowrap text-sm text-white">
                {{ persona.primerNombre }} {{ persona.segundoNombre }} {{ persona.apellidoPaterno }} {{ persona.apellidoMaterno }}
              </td>
              <td class="px-4 py-4 whitespace-nowrap text-sm text-blueprint-light">{{ persona.gender }}</td>
              <td class="px-4 py-4 whitespace-nowrap text-sm text-blueprint-light">{{ persona.edad }}</td>
              <td class="px-4 py-4 text-sm text-blueprint-light">
                <span v-if="persona.correo && persona.correo.length > 0">{{ persona.correo[0] }}</span>
                <span v-if="persona.correo && persona.correo.length > 1" class="text-xs text-blueprint-primary ml-1">+{{ persona.correo.length - 1 }}</span>
                <span v-if="!persona.correo || persona.correo.length === 0" class="text-gray-500">-</span>
              </td>
              <td class="px-4 py-4 text-sm text-blueprint-light">
                <span v-if="persona.telefono && persona.telefono.length > 0">{{ persona.telefono[0] }}</span>
                <span v-if="persona.telefono && persona.telefono.length > 1" class="text-xs text-blueprint-primary ml-1">+{{ persona.telefono.length - 1 }}</span>
                <span v-if="!persona.telefono || persona.telefono.length === 0" class="text-gray-500">-</span>
              </td>
              <td class="px-4 py-4 whitespace-nowrap text-right text-sm">
                <button
                  @click="openEditModal(persona)"
                  class="text-blueprint-primary hover:text-white transition-colors mr-3"
                  title="Editar"
                >
                  <PencilIcon class="h-5 w-5" />
                </button>
                <button
                  @click="openDeleteModal(persona)"
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
      :show="showFormModal"
      :title="isEditing ? 'Editar Persona' : 'Nueva Persona'"
      @close="closeFormModal"
      @confirm="handleSubmit"
    >
      <PersonaForm
        v-model="formData"
        :persona="selectedPersona"
        @submit="handleSubmit"
      />

      <template #footer>
        <BlueprintButton variant="secondary" @click="closeFormModal">
          Cancelar
        </BlueprintButton>
        <BlueprintButton @click="handleSubmit">
          {{ isEditing ? 'Actualizar' : 'Crear' }}
        </BlueprintButton>
      </template>
    </BlueprintModal>

    <BlueprintModal
      :show="showDeleteModal"
      title="Confirmar Eliminación"
      @close="closeDeleteModal"
      @confirm="handleDelete"
    >
      <div class="py-4">
        <p class="text-white mb-4">
          ¿Está seguro que desea eliminar a esta persona?
        </p>
        <div v-if="selectedPersona" class="blueprint-card p-4">
          <p class="text-blueprint-light">
            <span class="text-blueprint-primary font-semibold">Nombre:</span>
            {{ selectedPersona.primerNombre }} {{ selectedPersona.segundoNombre }} {{ selectedPersona.apellidoPaterno }} {{ selectedPersona.apellidoMaterno }}
          </p>
          <p class="text-blueprint-light mt-2">
            <span class="text-blueprint-primary font-semibold">DNI:</span>
            {{ selectedPersona.dni }}
          </p>
        </div>
        <p class="text-red-400 text-sm mt-4">
          Esta acción no se puede deshacer.
        </p>
      </div>

      <template #footer>
        <BlueprintButton variant="secondary" @click="closeDeleteModal">
          Cancelar
        </BlueprintButton>
        <BlueprintButton @click="handleDelete">
          Eliminar
        </BlueprintButton>
      </template>
    </BlueprintModal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { PlusIcon, PencilIcon, TrashIcon, UsersIcon } from '@heroicons/vue/24/outline';
import { usePersonaStore } from '@/stores/persona.store';
import BlueprintCard from '@/components/common/BlueprintCard.vue';
import BlueprintButton from '@/components/common/BlueprintButton.vue';
import BlueprintModal from '@/components/common/BlueprintModal.vue';
import PersonaForm from '@/components/forms/PersonaForm.vue';
import type { Persona, PersonaFormData } from '@/types';

const personaStore = usePersonaStore();

const showFormModal = ref(false);
const showDeleteModal = ref(false);
const isEditing = ref(false);
const selectedPersona = ref<Persona | null>(null);

const formData = ref<PersonaFormData>({
  dni: '',
  gender: '',
  primerNombre: '',
  segundoNombre: '',
  apellidoMaterno: '',
  apellidoPaterno: '',
  dateBirthday: '',
  edad: 0,
  correo: [''],
  telefono: [''],
});

const resetFormData = () => {
  formData.value = {
    dni: '',
    gender: '',
    primerNombre: '',
    segundoNombre: '',
    apellidoMaterno: '',
    apellidoPaterno: '',
    dateBirthday: '',
    edad: 0,
    correo: [''],
    telefono: [''],
  };
};

const openCreateModal = () => {
  isEditing.value = false;
  selectedPersona.value = null;
  resetFormData();
  showFormModal.value = true;
};

const openEditModal = async (persona: Persona) => {
  isEditing.value = true;

  if (persona.iD_Persona) {
    await personaStore.fetchById(persona.iD_Persona);
    selectedPersona.value = personaStore.personas.find(p => p.iD_Persona === persona.iD_Persona) || persona;
  } else {
    selectedPersona.value = persona;
  }

  showFormModal.value = true;
};

const closeFormModal = () => {
  showFormModal.value = false;
  selectedPersona.value = null;
  resetFormData();
};

const openDeleteModal = (persona: Persona) => {
  selectedPersona.value = persona;
  showDeleteModal.value = true;
};

const closeDeleteModal = () => {
  showDeleteModal.value = false;
  selectedPersona.value = null;
};

const handleSubmit = async () => {
  personaStore.error = null;
  let success = false;

  if (isEditing.value && selectedPersona.value?.iD_Persona) {
    success = await personaStore.update(selectedPersona.value.iD_Persona, formData.value);
  } else {
    success = await personaStore.create(formData.value);
  }

  if (success) {
    closeFormModal();
    await personaStore.fetchAll();
  }
};

const handleDelete = async () => {
  if (selectedPersona.value?.iD_Persona) {
    const success = await personaStore.remove(selectedPersona.value.iD_Persona);
    if (success) {
      closeDeleteModal();
    }
  }
};

onMounted(() => {
  personaStore.fetchAll();
});
</script>
