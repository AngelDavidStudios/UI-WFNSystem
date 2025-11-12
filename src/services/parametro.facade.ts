import apiService from './api.service';
import type { Parametro, ParametroFormData } from '@/types';

class ParametroFacade {
  private baseURL: string;

  constructor() {
    this.baseURL = import.meta.env.VITE_API_BASE_URL || '';
  }

  async getAll(): Promise<Parametro[]> {
    try {
      const response = await apiService.get(`${this.baseURL}/api/Parametro`);
      return response.data as Parametro[];
    } catch (error) {
      console.error('Error fetching parametros:', error);
      throw error;
    }
  }

  async create(parametro: ParametroFormData): Promise<Parametro> {
    try {
      const newId = crypto.randomUUID();

      const payload = {
        iD_Parametro: newId,
        ...parametro,
        dateCreated: new Date().toISOString()
      };

      const response = await apiService.post(`${this.baseURL}/api/Parametro`, payload);

      if (typeof response.data === 'string') {
        return { ...payload } as Parametro;
      }

      return response.data as Parametro;
    } catch (error) {
      console.error('Error creating parametro:', error);
      throw error;
    }
  }

  async update(id: string, parametro: ParametroFormData): Promise<Parametro> {
    try {
      const currentParametros = await this.getAll();
      const currentParametro = currentParametros.find(p => p.iD_Parametro === id);

      const payload = {
        iD_Parametro: id,
        ...parametro,
        dateCreated: currentParametro?.dateCreated || new Date().toISOString()
      };

      const response = await apiService.put(`${this.baseURL}/api/Parametro/${id}`, payload);

      if (typeof response.data === 'string') {
        return { ...payload } as Parametro;
      }

      return response.data as Parametro;
    } catch (error) {
      console.error('Error updating parametro:', error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await apiService.delete(`${this.baseURL}/api/Parametro/${id}`);
    } catch (error: any) {
      console.error('Error deleting parametro:', error);

      if (error.response?.status === 500 && error.response?.data?.includes('not found')) {
        console.warn('Parametro not found in backend, treating as already deleted');
        return;
      }

      throw error;
    }
  }
}

export default new ParametroFacade();
