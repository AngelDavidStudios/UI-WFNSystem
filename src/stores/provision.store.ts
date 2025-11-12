import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Provision, ProvisionFormData } from '@/types';
import provisionFacade from '@/services/provision.facade';

export const useProvisionStore = defineStore('provision', () => {
  const provisiones = ref<Provision[]>([]);
  const currentProvision = ref<Provision | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const fetchAll = async (): Promise<void> => {
    isLoading.value = true;
    error.value = null;

    try {
      provisiones.value = await provisionFacade.getAll();
    } catch (err) {
      error.value = 'Error al cargar las provisiones';
      console.error(err);
    } finally {
      isLoading.value = false;
    }
  };

  const create = async (provision: ProvisionFormData): Promise<boolean> => {
    isLoading.value = true;
    error.value = null;

    try {
      const newProvision = await provisionFacade.create(provision);
      provisiones.value.push(newProvision);
      return true;
    } catch (err) {
      error.value = 'Error al crear la provisión';
      console.error(err);
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  const update = async (id: string, provision: ProvisionFormData): Promise<boolean> => {
    isLoading.value = true;
    error.value = null;

    try {
      const updatedProvision = await provisionFacade.update(id, provision);
      const index = provisiones.value.findIndex(p => p.iD_Provision === id);
      if (index !== -1) {
        provisiones.value[index] = updatedProvision;
      }
      return true;
    } catch (err) {
      error.value = 'Error al actualizar la provisión';
      console.error(err);
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  const remove = async (id: string): Promise<boolean> => {
    isLoading.value = true;
    error.value = null;

    try {
      await provisionFacade.delete(id);
      provisiones.value = provisiones.value.filter(p => p.iD_Provision !== id);
      return true;
    } catch (err) {
      error.value = 'Error al eliminar la provisión';
      console.error(err);
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    provisiones,
    currentProvision,
    isLoading,
    error,
    fetchAll,
    create,
    update,
    remove,
  };
});
