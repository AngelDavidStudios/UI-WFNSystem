import apiService from './api.service';
import type { Banco, BancoFormData } from '@/types';

class BancoFacade {
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

  async getAll(): Promise<Banco[]> {
    try {
      const response = await apiService.get<Banco[]>(`${this.baseURL}/api/Banking`);
      return response.data;
    } catch (error) {
      console.error('Error fetching bancos:', error);
      throw error;
    }
  }

  async getById(id: string): Promise<Banco> {
    try {
      const response = await apiService.get<Banco>(`${this.baseURL}/api/Banking/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching banco:', error);
      throw error;
    }
  }

  async create(banco: BancoFormData): Promise<Banco> {
    try {
      const newId = this.generateGUID();
      const payload = {
        iD_Banking: newId,
        bankName: banco.bankName?.trim() || '',
        accountNumber: banco.accountNumber?.trim() || '',
        accountType: banco.accountType?.trim() || '',
        swiftCode: banco.swiftCode?.trim() || '',
        pais: banco.pais?.trim() || '',
        sucursal: banco.sucursal?.trim() || ''
      };

      console.log('=== CREATING BANCO ===');
      console.log('Payload:', JSON.stringify(payload, null, 2));

      const response = await apiService.post(`${this.baseURL}/api/Banking`, payload);

      console.log('=== RESPONSE ===');
      console.log('Type:', typeof response.data);
      console.log('Data:', response.data);

      if (typeof response.data === 'string') {
        return payload as Banco;
      }

      return response.data as Banco;
    } catch (error) {
      console.error('Error creating banco:', error);
      throw error;
    }
  }

  async update(id: string, banco: BancoFormData): Promise<Banco> {
    try {
      const payload = {
        iD_Banking: id,
        bankName: banco.bankName?.trim() || '',
        accountNumber: banco.accountNumber?.trim() || '',
        accountType: banco.accountType?.trim() || '',
        swiftCode: banco.swiftCode?.trim() || '',
        pais: banco.pais?.trim() || '',
        sucursal: banco.sucursal?.trim() || ''
      };

      console.log('=== UPDATING BANCO ===');
      console.log('Payload:', JSON.stringify(payload, null, 2));

      const response = await apiService.put(`${this.baseURL}/api/Banking/${id}`, payload);

      console.log('=== RESPONSE ===');
      console.log('Type:', typeof response.data);
      console.log('Data:', response.data);

      if (typeof response.data === 'string') {
        return payload as Banco;
      }

      return response.data as Banco;
    } catch (error) {
      console.error('Error updating banco:', error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await apiService.delete(`${this.baseURL}/api/Banking/${id}`);
    } catch (error) {
      console.error('Error deleting banco:', error);
      throw error;
    }
  }
}

export default new BancoFacade();
