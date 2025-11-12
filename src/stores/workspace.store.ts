import { defineStore } from 'pinia';
import { ref } from 'vue';
import { workspaceFacade } from '@/services/workspace.facade';
import type { Workspace, WorkspaceFormData } from '@/types';

export const useWorkspaceStore = defineStore('workspace', () => {
  const workspaces = ref<Workspace[]>([]);
  const currentWorkspace = ref<Workspace | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const fetchAll = async () => {
    isLoading.value = true;
    error.value = null;
    try {
      workspaces.value = await workspaceFacade.getAll();
    } catch (e: any) {
      error.value = e.message || 'Error al cargar workspaces';
      throw e;
    } finally {
      isLoading.value = false;
    }
  };

  const fetchById = async (id: string) => {
    isLoading.value = true;
    error.value = null;
    try {
      currentWorkspace.value = await workspaceFacade.getById(id);
      return currentWorkspace.value;
    } catch (e: any) {
      error.value = e.message || 'Error al cargar workspace';
      throw e;
    } finally {
      isLoading.value = false;
    }
  };

  const create = async (data: WorkspaceFormData) => {
    isLoading.value = true;
    error.value = null;
    try {
      const newWorkspace = await workspaceFacade.create(data);
      workspaces.value.push(newWorkspace);
      return newWorkspace;
    } catch (e: any) {
      error.value = e.message || 'Error al crear workspace';
      throw e;
    } finally {
      isLoading.value = false;
    }
  };

  const update = async (id: string, data: Partial<Workspace>) => {
    isLoading.value = true;
    error.value = null;
    try {
      const updated = await workspaceFacade.update(id, data);
      const index = workspaces.value.findIndex(w => w.iD_Workspace === id);
      if (index !== -1) {
        workspaces.value[index] = updated;
      }
      if (currentWorkspace.value?.iD_Workspace === id) {
        currentWorkspace.value = updated;
      }
      return updated;
    } catch (e: any) {
      error.value = e.message || 'Error al actualizar workspace';
      throw e;
    } finally {
      isLoading.value = false;
    }
  };

  const remove = async (id: string) => {
    isLoading.value = true;
    error.value = null;
    try {
      await workspaceFacade.delete(id);
      workspaces.value = workspaces.value.filter(w => w.iD_Workspace !== id);
      if (currentWorkspace.value?.iD_Workspace === id) {
        currentWorkspace.value = null;
      }
    } catch (e: any) {
      error.value = e.message || 'Error al eliminar workspace';
      throw e;
    } finally {
      isLoading.value = false;
    }
  };

  const setCurrentWorkspace = (workspace: Workspace | null) => {
    currentWorkspace.value = workspace;
  };

  return {
    workspaces,
    currentWorkspace,
    isLoading,
    error,
    fetchAll,
    fetchById,
    create,
    update,
    remove,
    setCurrentWorkspace
  };
});
