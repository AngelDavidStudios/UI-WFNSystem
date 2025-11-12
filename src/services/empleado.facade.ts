import apiService from './api.service';
import bancoFacade from './banco.facade';
import type { Empleado, EmpleadoFormData, Banco } from '@/types';

class EmpleadoFacade {
  private baseURL: string;
  private bancosCache: Banco[] = [];

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

  private async getBancosData(): Promise<Banco[]> {
    if (this.bancosCache.length === 0) {
      this.bancosCache = await bancoFacade.getAll();
    }
    return this.bancosCache;
  }

  async getAll(): Promise<Empleado[]> {
    try {
      const response = await apiService.get<Empleado[]>(`${this.baseURL}/api/Empleado`);
      return response.data;
    } catch (error) {
      console.error('Error fetching empleados:', error);
      throw error;
    }
  }

  async create(empleado: EmpleadoFormData): Promise<Empleado> {
    try {
      const newId = this.generateGUID();

      const bancos = await this.getBancosData();
      const bankingAccounts = empleado.bankingAccounts
        .map(bankId => bancos.find(b => b.iD_Banking === bankId))
        .filter(b => b !== undefined) as Banco[];

      const payload = {
        iD_Empleado: newId,
        iD_Persona: empleado.iD_Persona,
        bankingAccounts: bankingAccounts,
        iD_Departamento: empleado.iD_Departamento,
        fechaIngreso: empleado.fechaIngreso,
        salarioBase: empleado.salarioBase,
        is_DecimoTercMensual: empleado.is_DecimoTercMensual,
        is_DecimoCuartoMensual: empleado.is_DecimoCuartoMensual,
        is_FondoReserva: empleado.is_FondoReserva,
        dateCreated: new Date().toISOString(),
        statusLaboral: empleado.statusLaboral
      };

      console.log('=== CREATING EMPLEADO ===');
      console.log('Payload:', JSON.stringify(payload, null, 2));

      const response = await apiService.post(`${this.baseURL}/api/Empleado`, payload);

      console.log('=== RESPONSE ===');
      console.log('Type:', typeof response.data);
      console.log('Data:', response.data);

      if (typeof response.data === 'string') {
        return { ...payload } as Empleado;
      }

      return response.data as Empleado;
    } catch (error) {
      console.error('Error creating empleado:', error);
      throw error;
    }
  }

  async update(id: string, empleado: EmpleadoFormData, currentEmpleado?: Empleado): Promise<Empleado> {
    try {
      const bancos = await this.getBancosData();
      const bankingAccounts = empleado.bankingAccounts
        .map(bankId => bancos.find(b => b.iD_Banking === bankId))
        .filter(b => b !== undefined) as Banco[];

      const payload = {
        iD_Empleado: id,
        iD_Persona: empleado.iD_Persona,
        bankingAccounts: bankingAccounts,
        iD_Departamento: empleado.iD_Departamento,
        fechaIngreso: empleado.fechaIngreso,
        salarioBase: empleado.salarioBase,
        is_DecimoTercMensual: empleado.is_DecimoTercMensual,
        is_DecimoCuartoMensual: empleado.is_DecimoCuartoMensual,
        is_FondoReserva: empleado.is_FondoReserva,
        dateCreated: currentEmpleado?.dateCreated || new Date().toISOString(),
        statusLaboral: empleado.statusLaboral
      };

      console.log('=== UPDATING EMPLEADO ===');
      console.log('Payload:', JSON.stringify(payload, null, 2));

      const response = await apiService.put(`${this.baseURL}/api/Empleado/${id}`, payload);

      console.log('=== RESPONSE ===');
      console.log('Type:', typeof response.data);
      console.log('Data:', response.data);

      if (typeof response.data === 'string') {
        return { ...payload } as Empleado;
      }

      return response.data as Empleado;
    } catch (error) {
      console.error('Error updating empleado:', error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await apiService.delete(`${this.baseURL}/api/Empleado/${id}`);
    } catch (error) {
      console.error('Error deleting empleado:', error);
      throw error;
    }
  }
}

export default new EmpleadoFacade();
