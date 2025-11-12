<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-3xl font-bold text-blueprint-primary text-shadow-glow">
        WORKSPACES
      </h1>
      <BlueprintButton @click="openCreateModal" icon="plus">
        Nuevo Workspace
      </BlueprintButton>
    </div>

    <div v-if="workspaceStore.isLoading" class="text-center py-12">
      <p class="text-blueprint-light">Cargando workspaces...</p>
    </div>

    <div v-else-if="workspaceStore.error" class="text-center py-12">
      <p class="text-red-400">{{ workspaceStore.error }}</p>
    </div>

    <div v-else-if="workspaces.length === 0" class="text-center py-12">
      <p class="text-blueprint-light/60">No hay workspaces registrados</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <BlueprintCard
        v-for="workspace in workspaces"
        :key="workspace.iD_Workspace"
        class="cursor-pointer hover:border-blueprint-primary/60 transition-all"
      >
        <div class="space-y-4">
          <div class="flex justify-between items-start">
            <div class="flex-1">
              <h3 class="text-xl font-bold text-blueprint-primary mb-2">
                {{ getWorkspaceName(workspace) }}
              </h3>
              <div class="space-y-1 text-sm text-blueprint-light/80">
                <p>
                  <span class="font-medium">Creación:</span>
                  {{ formatDate(workspace.fechaCreacion) }}
                </p>
                <p>
                  <span class="font-medium">Cierre:</span>
                  {{ formatDate(workspace.fechaCierre) }}
                </p>
                <p>
                  <span class="font-medium">Nóminas:</span>
                  {{ workspace.nominas?.length || 0 }}
                </p>
              </div>
            </div>
            <span
              :class="[
                'px-3 py-1 rounded-full text-xs font-semibold',
                workspace.estado === 0
                  ? 'bg-green-500/20 text-green-400'
                  : 'bg-gray-500/20 text-gray-400'
              ]"
            >
              {{ workspace.estado === 0 ? 'Activo' : 'Cerrado' }}
            </span>
          </div>

          <div class="flex gap-2 pt-4 border-t border-blueprint-primary/20">
            <BlueprintButton
              @click.stop="openWorkspace(workspace)"
              variant="primary"
              class="flex-1"
            >
              Abrir
            </BlueprintButton>
            <BlueprintButton
              @click.stop="openEditModal(workspace)"
              variant="secondary"
            >
              Editar
            </BlueprintButton>
            <BlueprintButton
              @click.stop="confirmDelete(workspace)"
              variant="secondary"
              class="!text-red-400 hover:!text-red-300"
            >
              <TrashIcon class="h-5 w-5" />
            </BlueprintButton>
          </div>
        </div>
      </BlueprintCard>
    </div>

    <BlueprintModal
      :show="showFormModal"
      @close="closeFormModal"
      :title="isEditMode ? 'Editar Workspace' : 'Crear Workspace'"
    >
      <WorkspaceForm
        :workspace="selectedWorkspace"
        :is-edit-mode="isEditMode"
        @submit="handleSubmit"
        @cancel="closeFormModal"
      />
    </BlueprintModal>

    <BlueprintModal
      :show="showDeleteModal"
      @close="showDeleteModal = false"
      title="Confirmar Eliminación"
    >
      <p class="text-blueprint-light mb-6">
        ¿Está seguro que desea eliminar este workspace?
        Esta acción no se puede deshacer y se eliminarán todas las nóminas asociadas.
      </p>
      <template #footer>
        <BlueprintButton variant="secondary" @click="showDeleteModal = false">
          Cancelar
        </BlueprintButton>
        <BlueprintButton variant="primary" @click="handleDelete" class="!bg-red-500 hover:!bg-red-600">
          Eliminar
        </BlueprintButton>
      </template>
    </BlueprintModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { TrashIcon } from '@heroicons/vue/24/outline';
import BlueprintCard from '@/components/common/BlueprintCard.vue';
import BlueprintButton from '@/components/common/BlueprintButton.vue';
import BlueprintModal from '@/components/common/BlueprintModal.vue';
import WorkspaceForm from '@/components/forms/WorkspaceForm.vue';
import { useWorkspaceStore } from '@/stores/workspace.store';
import type { Workspace, WorkspaceFormData } from '@/types';

const router = useRouter();
const workspaceStore = useWorkspaceStore();

const showFormModal = ref(false);
const showDeleteModal = ref(false);
const selectedWorkspace = ref<Workspace | undefined>();
const isEditMode = ref(false);
const workspaceToDelete = ref<Workspace | null>(null);

const workspaces = computed(() => workspaceStore.workspaces);

const openCreateModal = () => {
  selectedWorkspace.value = undefined;
  isEditMode.value = false;
  showFormModal.value = true;
};

const openEditModal = (workspace: Workspace) => {
  selectedWorkspace.value = workspace;
  isEditMode.value = true;
  showFormModal.value = true;
};

const closeFormModal = () => {
  showFormModal.value = false;
  selectedWorkspace.value = undefined;
  isEditMode.value = false;
};

const handleSubmit = async (data: WorkspaceFormData) => {
  try {
    if (isEditMode.value && selectedWorkspace.value?.iD_Workspace) {
      await workspaceStore.update(selectedWorkspace.value.iD_Workspace, data);
    } else {
      await workspaceStore.create(data);
    }
    closeFormModal();
  } catch (error) {
    console.error('Error al guardar workspace:', error);
  }
};

const confirmDelete = (workspace: Workspace) => {
  workspaceToDelete.value = workspace;
  showDeleteModal.value = true;
};

const handleDelete = async () => {
  if (workspaceToDelete.value?.iD_Workspace) {
    try {
      await workspaceStore.remove(workspaceToDelete.value.iD_Workspace);
      showDeleteModal.value = false;
      workspaceToDelete.value = null;
    } catch (error) {
      console.error('Error al eliminar workspace:', error);
    }
  }
};

const openWorkspace = (workspace: Workspace) => {
  workspaceStore.setCurrentWorkspace(workspace);
  router.push(`/workspaces/${workspace.iD_Workspace}`);
};

const getWorkspaceName = (workspace: Workspace) => {
  const date = new Date(workspace.fechaCreacion);
  return `${date.toLocaleString('es-ES', { month: 'long' })} ${date.getFullYear()}`.toUpperCase();
};

const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

onMounted(async () => {
  try {
    await workspaceStore.fetchAll();
    console.log('Workspaces cargados:', workspaceStore.workspaces);
  } catch (error) {
    console.error('Error al cargar workspaces:', error);
  }
});
</script>
