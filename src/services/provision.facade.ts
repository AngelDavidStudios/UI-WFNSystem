import apiService from './api.service';
import type { Provision, ProvisionFormData } from '@/types';

class ProvisionFacade {
  private baseURL: string;

  constructor() {
    this.baseURL = import.meta.env.VITE_API_BASE_URL || '';
  }

  async getAll(): Promise<Provision[]> {
    try {
      const response = await apiService.get(`${this.baseURL}/api/Provision`);
      return response.data as Provision[];
    } catch (error) {
      console.error('Error fetching provisiones:', error);
      throw error;
    }
  }

  async create(provision: ProvisionFormData): Promise<Provision> {
    try {
      const newId = crypto.randomUUID();

      const payload = {
        iD_Provision: newId,
        ...provision
      };

      const response = await apiService.post(`${this.baseURL}/api/Provision`, payload);

      if (typeof response.data === 'string') {
        return { ...payload } as Provision;
      }

      return response.data as Provision;
    } catch (error) {
      console.error('Error creating provision:', error);
      throw error;
    }
  }

  async update(id: string, provision: ProvisionFormData): Promise<Provision> {
    try {
      const payload = {
        iD_Provision: id,
        ...provision
      };

      console.log('=== UPDATING PROVISION ===');
      console.log('ID:', id);
      console.log('Payload:', JSON.stringify(payload, null, 2));

      const response = await apiService.put(`${this.baseURL}/api/Provision/${id}`, payload);

      console.log('=== RESPONSE ===');
      console.log('Type:', typeof response.data);
      console.log('Data:', response.data);

      if (typeof response.data === 'string') {
        return { ...payload } as Provision;
      }

      return response.data as Provision;
    } catch (error) {
      console.error('Error updating provision:', error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      console.log('=== DELETING PROVISION ===');
      console.log('ID:', id);
      console.log('URL:', `${this.baseURL}/api/Provision/${id}`);

      const response = await apiService.delete(`${this.baseURL}/api/Provision/${id}`);

      console.log('=== DELETE RESPONSE ===');
      console.log('Status:', response.status);
      console.log('Data:', response.data);
    } catch (error: any) {
      console.error('Error deleting provision:', error);

      if (error.response?.status === 500 && error.response?.data?.includes('not found')) {
        console.warn('Provision not found in backend, treating as already deleted');
        return;
      }

      if (error instanceof Error) {
        console.error('Error message:', error.message);
      }
      throw error;
    }
  }
}

export default new ProvisionFacade();
