import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import nominaFacade from '@/services/nomina.facade';
import type { Nomina, NominaFormData } from '@/types';

export const useNominaStore = defineStore('nomina', () => {
  const nominas = ref<Nomina[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const nominasByEmpleado = computed(() => {
    return (idEmpleado: string) => {
      return nominas.value.filter(n => n.iD_Empleado === idEmpleado);
    };
  });

  const fetchAll = async (): Promise<void> => {
    loading.value = true;
    error.value = null;
    try {
      nominas.value = await nominaFacade.getAll();
    } catch (err) {
      error.value = 'Error al cargar las nóminas';
      console.error(err);
    } finally {
      loading.value = false;
    }
  };

  const fetchById = async (id: string): Promise<Nomina | null> => {
    loading.value = true;
    error.value = null;
    try {
      return await nominaFacade.getById(id);
    } catch (err) {
      error.value = 'Error al cargar la nómina';
      console.error(err);
      return null;
    } finally {
      loading.value = false;
    }
  };

  const fetchByEmpleado = async (idEmpleado: string): Promise<void> => {
    loading.value = true;
    error.value = null;
    try {
      const empleadoNominas = await nominaFacade.getByEmpleado(idEmpleado);
      nominas.value = [...nominas.value.filter(n => n.iD_Empleado !== idEmpleado), ...empleadoNominas];
    } catch (err) {
      error.value = 'Error al cargar las nóminas del empleado';
      console.error(err);
    } finally {
      loading.value = false;
    }
  };

  const create = async (data: NominaFormData): Promise<boolean> => {
    loading.value = true;
    error.value = null;
    try {
      const newNomina = await nominaFacade.create(data);
      nominas.value.push(newNomina);
      return true;
    } catch (err) {
      error.value = 'Error al crear la nómina';
      console.error(err);
      return false;
    } finally {
      loading.value = false;
    }
  };

  const update = async (id: string, data: NominaFormData): Promise<boolean> => {
    loading.value = true;
    error.value = null;
    try {
      const updatedNomina = await nominaFacade.update(id, data);
      const index = nominas.value.findIndex(n => n.iD_Nomina === id);
      if (index !== -1) {
        nominas.value[index] = updatedNomina;
      }
      return true;
    } catch (err) {
      error.value = 'Error al actualizar la nómina';
      console.error(err);
      return false;
    } finally {
      loading.value = false;
    }
  };

  const remove = async (id: string): Promise<boolean> => {
    loading.value = true;
    error.value = null;
    try {
      await nominaFacade.delete(id);
      nominas.value = nominas.value.filter(n => n.iD_Nomina !== id);
      return true;
    } catch (err) {
      error.value = 'Error al eliminar la nómina';
      console.error(err);
      return false;
    } finally {
      loading.value = false;
    }
  };

  return {
    nominas,
    loading,
    error,
    nominasByEmpleado,
    fetchAll,
    fetchById,
    fetchByEmpleado,
    create,
    update,
    remove
  };
});
