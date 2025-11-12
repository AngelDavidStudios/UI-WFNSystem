import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Novedad, NovedadFormData } from '@/types';
import novedadFacade from '@/services/novedad.facade';

export const useNovedadStore = defineStore('novedad', () => {
  const novedades = ref<Novedad[]>([]);
  const currentNovedad = ref<Novedad | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const fetchAll = async (): Promise<void> => {
    isLoading.value = true;
    error.value = null;

    try {
      novedades.value = await novedadFacade.getAll();
    } catch (err) {
      error.value = 'Error al cargar las novedades';
      console.error(err);
    } finally {
      isLoading.value = false;
    }
  };

  const create = async (novedad: NovedadFormData): Promise<boolean> => {
    isLoading.value = true;
    error.value = null;

    try {
      const newNovedad = await novedadFacade.create(novedad);
      novedades.value.push(newNovedad);
      return true;
    } catch (err) {
      error.value = 'Error al crear la novedad';
      console.error(err);
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  const update = async (id: string, novedad: NovedadFormData): Promise<boolean> => {
    isLoading.value = true;
    error.value = null;

    try {
      const updatedNovedad = await novedadFacade.update(id, novedad);
      const index = novedades.value.findIndex(n => n.iD_Novedad === id);
      if (index !== -1) {
        novedades.value[index] = updatedNovedad;
      }
      return true;
    } catch (err) {
      error.value = 'Error al actualizar la novedad';
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
      await novedadFacade.delete(id);
      novedades.value = novedades.value.filter(n => n.iD_Novedad !== id);
      return true;
    } catch (err) {
      error.value = 'Error al eliminar la novedad';
      console.error(err);
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    novedades,
    currentNovedad,
    isLoading,
    error,
    fetchAll,
    create,
    update,
    remove,
  };
});
