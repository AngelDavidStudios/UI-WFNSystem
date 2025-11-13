import apiService from './api.service';
import type { Departamento, DepartamentoFormData } from '@/types';

class DepartamentoFacade {
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

  async getAll(): Promise<Departamento[]> {
    try {
      const response = await apiService.get<Departamento[]>(`${this.baseURL}/api/Departamento`);
      return response.data;
    } catch (error) {
      console.error('Error fetching departamentos:', error);
      throw error;
    }
  }

  async getById(id: string): Promise<Departamento> {
    try {
      const response = await apiService.get<Departamento>(`${this.baseURL}/api/Departamento/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching departamento:', error);
      throw error;
    }
  }

  async create(departamento: DepartamentoFormData): Promise<Departamento> {
    try {
      const newId = this.generateGUID();
      const payload = {
        iD_Departamento: newId,
        nombre: departamento.nombre?.trim() || '',
        ubicacion: departamento.ubicacion?.trim() || '',
        email: departamento.email?.trim() || '',
        telefono: departamento.telefono?.trim() || '',
        cargo: departamento.cargo?.trim() || '',
        centroCosto: departamento.centroCosto?.trim() || ''
      };

      const response = await apiService.post(`${this.baseURL}/api/Departamento`, payload);

      if (typeof response.data === 'string') {
        return payload as Departamento;
      }

      return response.data as Departamento;
    } catch (error) {
      console.error('Error creating departamento:', error);
      throw error;
    }
  }

  async update(id: string, departamento: DepartamentoFormData): Promise<Departamento> {
    try {
      const payload = {
        iD_Departamento: id,
        nombre: departamento.nombre?.trim() || '',
        ubicacion: departamento.ubicacion?.trim() || '',
        email: departamento.email?.trim() || '',
        telefono: departamento.telefono?.trim() || '',
        cargo: departamento.cargo?.trim() || '',
        centroCosto: departamento.centroCosto?.trim() || ''
      };

      const response = await apiService.put(`${this.baseURL}/api/Departamento/${id}`, payload);

      if (typeof response.data === 'string') {
        return payload as Departamento;
      }

      return response.data as Departamento;
    } catch (error) {
      console.error('Error updating departamento:', error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await apiService.delete(`${this.baseURL}/api/Departamento/${id}`);
    } catch (error) {
      console.error('Error deleting departamento:', error);
      throw error;
    }
  }
}

export default new DepartamentoFacade();
