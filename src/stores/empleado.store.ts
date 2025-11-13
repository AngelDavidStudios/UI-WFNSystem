import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Empleado, EmpleadoFormData } from '@/types';
import empleadoFacade from '@/services/empleado.facade';

export const useEmpleadoStore = defineStore('empleado', () => {
  const empleados = ref<Empleado[]>([]);
  const currentEmpleado = ref<Empleado | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const fetchAll = async (): Promise<void> => {
    isLoading.value = true;
    error.value = null;

    try {
      empleados.value = await empleadoFacade.getAll();
    } catch (err) {
      error.value = 'Error al cargar los empleados';
      console.error(err);
    } finally {
      isLoading.value = false;
    }
  };

  const create = async (empleado: EmpleadoFormData): Promise<boolean> => {
    isLoading.value = true;
    error.value = null;

    try {
      await empleadoFacade.create(empleado);
      await fetchAll();
      return true;
    } catch (err) {
      error.value = 'Error al crear el empleado';
      console.error(err);
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  const update = async (id: string, empleado: EmpleadoFormData): Promise<boolean> => {
    isLoading.value = true;
    error.value = null;

    try {
      const currentEmpleado = empleados.value.find(e => e.iD_Empleado === id);
      await empleadoFacade.update(id, empleado, currentEmpleado);
      await fetchAll();
      return true;
    } catch (err) {
      error.value = 'Error al actualizar el empleado';
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
      await empleadoFacade.delete(id);
      empleados.value = empleados.value.filter(e => e.iD_Empleado !== id);
      return true;
    } catch (err) {
      error.value = 'Error al eliminar el empleado';
      console.error(err);
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    empleados,
    currentEmpleado,
    isLoading,
    error,
    fetchAll,
    create,
    update,
    remove,
  };
});
