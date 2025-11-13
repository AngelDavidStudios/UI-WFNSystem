import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Departamento, DepartamentoFormData } from '@/types';
import departamentoFacade from '@/services/departamento.facade';

export const useDepartamentoStore = defineStore('departamento', () => {
  const departamentos = ref<Departamento[]>([]);
  const currentDepartamento = ref<Departamento | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const fetchAll = async (): Promise<void> => {
    isLoading.value = true;
    error.value = null;

    try {
      departamentos.value = await departamentoFacade.getAll();
    } catch (err) {
      error.value = 'Error al cargar los departamentos';
      console.error(err);
    } finally {
      isLoading.value = false;
    }
  };

  const fetchById = async (id: string): Promise<void> => {
    isLoading.value = true;
    error.value = null;

    try {
      currentDepartamento.value = await departamentoFacade.getById(id);
    } catch (err) {
      error.value = 'Error al cargar el departamento';
      console.error(err);
    } finally {
      isLoading.value = false;
    }
  };

  const create = async (departamento: DepartamentoFormData): Promise<boolean> => {
    isLoading.value = true;
    error.value = null;

    try {
      await departamentoFacade.create(departamento);
      await fetchAll();
      return true;
    } catch (err) {
      error.value = 'Error al crear el departamento';
      console.error(err);
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  const update = async (id: string, departamento: DepartamentoFormData): Promise<boolean> => {
    isLoading.value = true;
    error.value = null;

    try {
      await departamentoFacade.update(id, departamento);
      await fetchAll();
      return true;
    } catch (err) {
      error.value = 'Error al actualizar el departamento';
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
      await departamentoFacade.delete(id);
      departamentos.value = departamentos.value.filter(d => d.iD_Departamento !== id);
      return true;
    } catch (err) {
      error.value = 'Error al eliminar el departamento';
      console.error(err);
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    departamentos,
    currentDepartamento,
    isLoading,
    error,
    fetchAll,
    fetchById,
    create,
    update,
    remove,
  };
});
