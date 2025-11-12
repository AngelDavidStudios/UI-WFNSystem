import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Direccion, DireccionFormData } from '@/types';
import direccionFacade from '@/services/direccion.facade';

export const useDireccionStore = defineStore('direccion', () => {
  const direcciones = ref<Direccion[]>([]);
  const currentPersonaId = ref<string | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const fetchByPersonaId = async (personaId: string): Promise<void> => {
    isLoading.value = true;
    error.value = null;
    currentPersonaId.value = personaId;

    try {
      direcciones.value = await direccionFacade.getByPersonaId(personaId);
    } catch (err) {
      error.value = 'Error al cargar las direcciones';
      console.error(err);
    } finally {
      isLoading.value = false;
    }
  };

  const create = async (personaId: string, direccion: DireccionFormData): Promise<boolean> => {
    isLoading.value = true;
    error.value = null;

    try {
      const newDireccion = await direccionFacade.create(personaId, direccion);
      direcciones.value.push(newDireccion);
      return true;
    } catch (err) {
      error.value = 'Error al crear la dirección';
      console.error(err);
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  const update = async (personaId: string, direccionId: string, direccion: DireccionFormData): Promise<boolean> => {
    isLoading.value = true;
    error.value = null;

    try {
      const updatedDireccion = await direccionFacade.update(personaId, direccionId, direccion);
      const index = direcciones.value.findIndex(d => d.iD_Direccion === direccionId);
      if (index !== -1) {
        direcciones.value[index] = updatedDireccion;
      }
      return true;
    } catch (err) {
      error.value = 'Error al actualizar la dirección';
      console.error(err);
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  const remove = async (personaId: string, direccionId: string): Promise<boolean> => {
    isLoading.value = true;
    error.value = null;

    try {
      await direccionFacade.delete(personaId, direccionId);
      direcciones.value = direcciones.value.filter(d => d.iD_Direccion !== direccionId);
      return true;
    } catch (err) {
      error.value = 'Error al eliminar la dirección';
      console.error(err);
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  const clearDirecciones = () => {
    direcciones.value = [];
    currentPersonaId.value = null;
  };

  return {
    direcciones,
    currentPersonaId,
    isLoading,
    error,
    fetchByPersonaId,
    create,
    update,
    remove,
    clearDirecciones,
  };
});
