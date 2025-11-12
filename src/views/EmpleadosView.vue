<template>
  <div>
    <div class="mb-8 flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold text-blueprint-primary text-shadow-glow mb-2">EMPLEADOS</h1>
        <p class="text-blueprint-light">Gestión de Empleados</p>
      </div>
      <BlueprintButton @click="openCreateModal" variant="primary">
        <PlusIcon class="h-5 w-5 mr-2" />
        Nuevo Empleado
      </BlueprintButton>
    </div>

    <BlueprintCard>
      <div v-if="empleadoStore.isLoading" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blueprint-primary mx-auto"></div>
        <p class="text-blueprint-light mt-4">Cargando empleados...</p>
      </div>

      <div v-else-if="empleadoStore.empleados.length === 0" class="text-center py-12">
        <UserGroupIcon class="h-16 w-16 text-blueprint-primary mx-auto mb-4" />
        <p class="text-blueprint-light">No hay empleados registrados</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-blueprint-border">
          <thead>
            <tr class="border-b border-blueprint-border">
              <th class="px-4 py-4 text-left text-xs font-semibold text-blueprint-primary uppercase tracking-wider">Persona</th>
              <th class="px-4 py-4 text-left text-xs font-semibold text-blueprint-primary uppercase tracking-wider">Departamento</th>
              <th class="px-4 py-4 text-left text-xs font-semibold text-blueprint-primary uppercase tracking-wider">Fecha Ingreso</th>
              <th class="px-4 py-4 text-left text-xs font-semibold text-blueprint-primary uppercase tracking-wider">Salario</th>
              <th class="px-4 py-4 text-left text-xs font-semibold text-blueprint-primary uppercase tracking-wider">Cuentas</th>
              <th class="px-4 py-4 text-left text-xs font-semibold text-blueprint-primary uppercase tracking-wider">Estado</th>
              <th class="px-4 py-4 text-right text-xs font-semibold text-blueprint-primary uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-blueprint-border/30">
            <tr
              v-for="empleado in empleadoStore.empleados"
              :key="empleado.iD_Empleado"
              class="hover:bg-blueprint-card/30 transition-colors"
            >
              <td class="px-4 py-4 whitespace-nowrap text-sm text-white">
                {{ getPersonaName(empleado.iD_Persona) }}
              </td>
              <td class="px-4 py-4 whitespace-nowrap text-sm text-blueprint-light">
                {{ getDepartamentoName(empleado.iD_Departamento) }}
              </td>
              <td class="px-4 py-4 whitespace-nowrap text-sm text-blueprint-light">
                {{ formatDate(empleado.fechaIngreso) }}
              </td>
              <td class="px-4 py-4 whitespace-nowrap text-sm text-blueprint-light">
                ${{ empleado.salarioBase.toFixed(2) }}
              </td>
              <td class="px-4 py-4 text-sm text-blueprint-light">
                <span class="inline-flex items-center px-2 py-1 rounded bg-blueprint-primary/20 text-blueprint-primary text-xs">
                  {{ empleado.bankingAccounts.length }} cuenta(s)
                </span>
              </td>
              <td class="px-4 py-4 whitespace-nowrap text-sm">
                <span
                  :class="[
                    'inline-flex items-center px-2 py-1 rounded text-xs font-medium',
                    empleado.statusLaboral === 1
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-red-500/20 text-red-400'
                  ]"
                >
                  {{ empleado.statusLaboral === 1 ? 'Activo' : 'Inactivo' }}
                </span>
              </td>
              <td class="px-4 py-4 whitespace-nowrap text-right text-sm">
                <button
                  @click="openEditModal(empleado)"
                  class="text-blueprint-primary hover:text-white transition-colors mr-3"
                  title="Editar"
                >
                  <PencilIcon class="h-5 w-5" />
                </button>
                <button
                  @click="handleDelete(empleado.iD_Empleado!)"
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
      :title="isEditing ? 'Editar Empleado' : 'Nuevo Empleado'"
      @close="closeModal"
    >
      <EmpleadoForm
        :empleado="selectedEmpleado"
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
import { useEmpleadoStore } from '@/stores/empleado.store';
import { usePersonaStore } from '@/stores/persona.store';
import { useDepartamentoStore } from '@/stores/departamento.store';
import BlueprintCard from '@/components/common/BlueprintCard.vue';
import BlueprintButton from '@/components/common/BlueprintButton.vue';
import BlueprintModal from '@/components/common/BlueprintModal.vue';
import EmpleadoForm from '@/components/forms/EmpleadoForm.vue';
import { UserGroupIcon, PlusIcon, PencilIcon, TrashIcon } from '@heroicons/vue/24/outline';
import type { Empleado, EmpleadoFormData } from '@/types';

const empleadoStore = useEmpleadoStore();
const personaStore = usePersonaStore();
const departamentoStore = useDepartamentoStore();

const isModalOpen = ref(false);
const isEditing = ref(false);
const selectedEmpleado = ref<Empleado | null>(null);

onMounted(async () => {
  await Promise.all([
    empleadoStore.fetchAll(),
    personaStore.fetchAll(),
    departamentoStore.fetchAll()
  ]);
});

const getPersonaName = (personaId: string): string => {
  const persona = personaStore.personas.find(p => p.iD_Persona === personaId);
  if (persona) {
    return `${persona.primerNombre} ${persona.apellidoPaterno}`;
  }
  return 'N/A';
};

const getDepartamentoName = (departamentoId: string): string => {
  const departamento = departamentoStore.departamentos.find(d => d.iD_Departamento === departamentoId);
  return departamento ? departamento.nombre : 'N/A';
};

const formatDate = (dateString: string): string => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' });
};

const openCreateModal = () => {
  isEditing.value = false;
  selectedEmpleado.value = null;
  isModalOpen.value = true;
};

const openEditModal = (empleado: Empleado) => {
  isEditing.value = true;
  selectedEmpleado.value = empleado;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  selectedEmpleado.value = null;
  isEditing.value = false;
};

const handleSubmit = async (formData: EmpleadoFormData) => {
  let success = false;

  if (isEditing.value && selectedEmpleado.value?.iD_Empleado) {
    success = await empleadoStore.update(selectedEmpleado.value.iD_Empleado, formData);
  } else {
    success = await empleadoStore.create(formData);
  }

  if (success) {
    closeModal();
  }
};

const handleDelete = async (id: string) => {
  if (confirm('¿Está seguro de que desea eliminar este empleado?')) {
    await empleadoStore.remove(id);
  }
};
</script>
