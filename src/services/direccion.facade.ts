import apiService from './api.service';
import type { Direccion, DireccionFormData } from '@/types';

class DireccionFacade {
  private baseURL: string;

  constructor() {
    this.baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
  }

  private generateGUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  async getByPersonaId(personaId: string): Promise<Direccion[]> {
    try {
      const response = await apiService.get<Direccion[]>(`${this.baseURL}/api/Direccion/persona/${personaId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching direcciones:', error);
      throw error;
    }
  }

  async create(personaId: string, direccion: DireccionFormData): Promise<Direccion> {
    try {
      const newId = this.generateGUID();
      const payload = {
        iD_Direccion: newId,
        calle: direccion.calle?.trim() || '',
        numero: direccion.numero?.trim() || '',
        piso: direccion.piso?.trim() || ''
      };

      console.log('=== CREATING DIRECCION ===');
      console.log('PersonaId:', personaId);
      console.log('Payload:', JSON.stringify(payload, null, 2));

      const response = await apiService.post(`${this.baseURL}/api/Direccion/persona/${personaId}`, payload);

      console.log('=== RESPONSE ===');
      console.log('Type:', typeof response.data);
      console.log('Data:', response.data);

      if (typeof response.data === 'string') {
        return payload as Direccion;
      }

      return response.data as Direccion;
    } catch (error) {
      console.error('Error creating direccion:', error);
      throw error;
    }
  }

  async update(personaId: string, direccionId: string, direccion: DireccionFormData): Promise<Direccion> {
    try {
      const payload = {
        iD_Direccion: direccionId,
        calle: direccion.calle?.trim() || '',
        numero: direccion.numero?.trim() || '',
        piso: direccion.piso?.trim() || ''
      };

      console.log('=== UPDATING DIRECCION ===');
      console.log('PersonaId:', personaId);
      console.log('DireccionId:', direccionId);
      console.log('Payload:', JSON.stringify(payload, null, 2));

      const response = await apiService.put(`${this.baseURL}/api/Direccion/persona/${personaId}/direccion/${direccionId}`, payload);

      console.log('=== RESPONSE ===');
      console.log('Type:', typeof response.data);
      console.log('Data:', response.data);

      if (typeof response.data === 'string') {
        return payload as Direccion;
      }

      return response.data as Direccion;
    } catch (error) {
      console.error('Error updating direccion:', error);
      throw error;
    }
  }

  async delete(personaId: string, direccionId: string): Promise<void> {
    try {
      await apiService.delete(`${this.baseURL}/api/Direccion/persona/${personaId}/direccion/${direccionId}`);
    } catch (error) {
      console.error('Error deleting direccion:', error);
      throw error;
    }
  }
}

export default new DireccionFacade();
