import apiService from './api.service';
import type { Novedad, NovedadFormData } from '@/types';

class NovedadFacade {
  private baseURL: string;

  constructor() {
    this.baseURL = import.meta.env.VITE_API_BASE_URL || '';
  }

  async getAll(): Promise<Novedad[]> {
    try {
      console.log('=== FETCHING NOVEDADES ===');
      console.log('URL:', `${this.baseURL}/api/Novedad`);
      const response = await apiService.get(`${this.baseURL}/api/Novedad`);
      console.log('Response:', response.data);
      console.log('Total novedades:', Array.isArray(response.data) ? response.data.length : 0);
      return response.data as Novedad[];
    } catch (error) {
      console.error('Error fetching novedades:', error);
      throw error;
    }
  }

  async create(novedad: NovedadFormData): Promise<Novedad> {
    try {
      const newId = crypto.randomUUID();

      const payload = {
        iD_Novedad: newId,
        ...novedad,
        fechaIngresada: novedad.fechaIngresada.includes('T')
          ? novedad.fechaIngresada
          : `${novedad.fechaIngresada}T00:00:00.000Z`
      };

      console.log('=== CREATING NOVEDAD ===');
      console.log('Payload:', JSON.stringify(payload, null, 2));

      const response = await apiService.post(`${this.baseURL}/api/Novedad`, payload);

      console.log('=== RESPONSE ===');
      console.log('Type:', typeof response.data);
      console.log('Data:', response.data);

      if (typeof response.data === 'string') {
        return { ...payload } as Novedad;
      }

      return response.data as Novedad;
    } catch (error) {
      console.error('Error creating novedad:', error);
      throw error;
    }
  }

  async update(id: string, novedad: NovedadFormData): Promise<Novedad> {
    try {
      const payload = {
        iD_Novedad: id,
        ...novedad,
        fechaIngresada: novedad.fechaIngresada.includes('T')
          ? novedad.fechaIngresada
          : `${novedad.fechaIngresada}T00:00:00.000Z`
      };

      console.log('=== UPDATING NOVEDAD ===');
      console.log('ID:', id);
      console.log('Payload:', JSON.stringify(payload, null, 2));

      const response = await apiService.put(`${this.baseURL}/api/Novedad/${id}`, payload);

      console.log('=== RESPONSE ===');
      console.log('Type:', typeof response.data);
      console.log('Data:', response.data);

      if (typeof response.data === 'string') {
        return { ...payload } as Novedad;
      }

      return response.data as Novedad;
    } catch (error) {
      console.error('Error updating novedad:', error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await apiService.delete(`${this.baseURL}/api/Novedad/${id}`);
    } catch (error: any) {
      console.error('Error deleting novedad:', error);

      if (error.response?.status === 500 && error.response?.data?.includes('not found')) {
        console.warn('Novedad not found in backend, treating as already deleted');
        return;
      }

      throw error;
    }
  }
}

export default new NovedadFacade();
