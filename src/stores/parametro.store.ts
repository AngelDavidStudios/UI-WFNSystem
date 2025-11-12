import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Parametro, ParametroFormData } from '@/types';
import parametroFacade from '@/services/parametro.facade';

export const useParametroStore = defineStore('parametro', () => {
  const parametros = ref<Parametro[]>([]);
  const currentParametro = ref<Parametro | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const fetchAll = async (): Promise<void> => {
    isLoading.value = true;
    error.value = null;

    try {
      parametros.value = await parametroFacade.getAll();
    } catch (err) {
      error.value = 'Error al cargar los parámetros';
      console.error(err);
    } finally {
      isLoading.value = false;
    }
  };

  const create = async (parametro: ParametroFormData): Promise<boolean> => {
    isLoading.value = true;
    error.value = null;

    try {
      const newParametro = await parametroFacade.create(parametro);
      parametros.value.push(newParametro);
      return true;
    } catch (err) {
      error.value = 'Error al crear el parámetro';
      console.error(err);
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  const update = async (id: string, parametro: ParametroFormData): Promise<boolean> => {
    isLoading.value = true;
    error.value = null;

    try {
      const updatedParametro = await parametroFacade.update(id, parametro);
      const index = parametros.value.findIndex(p => p.iD_Parametro === id);
      if (index !== -1) {
        parametros.value[index] = updatedParametro;
      }
      return true;
    } catch (err) {
      error.value = 'Error al actualizar el parámetro';
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
      await parametroFacade.delete(id);
      parametros.value = parametros.value.filter(p => p.iD_Parametro !== id);
      return true;
    } catch (err) {
      error.value = 'Error al eliminar el parámetro';
      console.error(err);
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    parametros,
    currentParametro,
    isLoading,
    error,
    fetchAll,
    create,
    update,
    remove,
  };
});
