import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Persona, PersonaFormData } from '@/types';
import personaFacade from '@/services/persona.facade';

export const usePersonaStore = defineStore('persona', () => {
  const personas = ref<Persona[]>([]);
  const currentPersona = ref<Persona | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

const fetchAll = async (): Promise<void> => {
  isLoading.value = true;
  error.value = null;

  try {
    const data = await personaFacade.getAll();

    // 🔧 Normalizamos los campos nulos o undefined
    personas.value = data.map((p: Persona) => ({
      ...p,
      correo: Array.isArray(p.correo) ? p.correo : (p.correo ? [p.correo] : []),
      telefono: Array.isArray(p.telefono) ? p.telefono : (p.telefono ? [p.telefono] : []),
      direcciones: Array.isArray(p.direcciones) ? p.direcciones : (p.direcciones ? [p.direcciones] : [{
        calle: '',
        numero: '',
        piso: '',
      }]),
    }));
  } catch (err) {
    error.value = 'Error al cargar las personas';
    console.error(err);
  } finally {
    isLoading.value = false;
  }
};


  const fetchById = async (id: string): Promise<void> => {
    isLoading.value = true;
    error.value = null;

    try {
      currentPersona.value = await personaFacade.getById(id);
    } catch (err) {
      error.value = 'Error al cargar la persona';
      console.error(err);
    } finally {
      isLoading.value = false;
    }
  };

  const create = async (persona: PersonaFormData): Promise<boolean> => {
    isLoading.value = true;
    error.value = null;

    try {
      const newPersona = await personaFacade.create(persona);
      personas.value.push(newPersona);
      return true;
    } catch (err) {
      error.value = 'Error al crear la persona';
      console.error(err);
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  const update = async (id: string, persona: PersonaFormData): Promise<boolean> => {
    isLoading.value = true;
    error.value = null;

    try {
      const originalPersona = personas.value.find(p => p.iD_Persona === id);
      const updatedPersona = await personaFacade.update(id, persona, originalPersona);
      const index = personas.value.findIndex(p => p.iD_Persona === id);
      if (index !== -1) {
        personas.value[index] = updatedPersona;
      }
      return true;
    } catch (err) {
      error.value = 'Error al actualizar la persona';
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
      await personaFacade.delete(id);
      personas.value = personas.value.filter(p => p.iD_Persona !== id);
      return true;
    } catch (err) {
      error.value = 'Error al eliminar la persona';
      console.error(err);
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    personas,
    currentPersona,
    isLoading,
    error,
    fetchAll,
    fetchById,
    create,
    update,
    remove,
  };
});
