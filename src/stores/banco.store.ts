import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Banco, BancoFormData } from '@/types';
import bancoFacade from '@/services/banco.facade';

export const useBancoStore = defineStore('banco', () => {
  const bancos = ref<Banco[]>([]);
  const currentBanco = ref<Banco | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const fetchAll = async (): Promise<void> => {
    isLoading.value = true;
    error.value = null;

    try {
      bancos.value = await bancoFacade.getAll();
    } catch (err) {
      error.value = 'Error al cargar los bancos';
      console.error(err);
    } finally {
      isLoading.value = false;
    }
  };

  const fetchById = async (id: string): Promise<void> => {
    isLoading.value = true;
    error.value = null;

    try {
      currentBanco.value = await bancoFacade.getById(id);
    } catch (err) {
      error.value = 'Error al cargar el banco';
      console.error(err);
    } finally {
      isLoading.value = false;
    }
  };

  const create = async (banco: BancoFormData): Promise<boolean> => {
    isLoading.value = true;
    error.value = null;

    try {
      const newBanco = await bancoFacade.create(banco);
      bancos.value.push(newBanco);
      return true;
    } catch (err) {
      error.value = 'Error al crear el banco';
      console.error(err);
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  const update = async (id: string, banco: BancoFormData): Promise<boolean> => {
    isLoading.value = true;
    error.value = null;

    try {
      const updatedBanco = await bancoFacade.update(id, banco);
      const index = bancos.value.findIndex(b => b.iD_Banking === id);
      if (index !== -1) {
        bancos.value[index] = updatedBanco;
      }
      return true;
    } catch (err) {
      error.value = 'Error al actualizar el banco';
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
      await bancoFacade.delete(id);
      bancos.value = bancos.value.filter(b => b.iD_Banking !== id);
      return true;
    } catch (err) {
      error.value = 'Error al eliminar el banco';
      console.error(err);
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    bancos,
    currentBanco,
    isLoading,
    error,
    fetchAll,
    fetchById,
    create,
    update,
    remove,
  };
});
