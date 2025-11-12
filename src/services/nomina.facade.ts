import apiService from './api.service';
import type { Nomina, NominaFormData, Ingreso, Egreso } from '@/types';

class NominaFacade {
  private baseURL: string;

  constructor() {
    this.baseURL = import.meta.env.VITE_API_BASE_URL || '';
  }

  async getAll(): Promise<Nomina[]> {
    try {
      const response = await apiService.get(`${this.baseURL}/api/Nomina`);
      return response.data as Nomina[];
    } catch (error) {
      console.error('Error fetching nominas:', error);
      throw error;
    }
  }

  async getById(id: string): Promise<Nomina> {
    try {
      const response = await apiService.get(`${this.baseURL}/api/Nomina/${id}`);
      return response.data as Nomina;
    } catch (error) {
      console.error('Error fetching nomina:', error);
      throw error;
    }
  }

  async getByEmpleado(idEmpleado: string): Promise<Nomina[]> {
    try {
      const response = await apiService.get(`${this.baseURL}/api/Nomina/empleado/${idEmpleado}`);
      return response.data as Nomina[];
    } catch (error) {
      console.error('Error fetching nominas by empleado:', error);
      throw error;
    }
  }

  calculateIngresoTotals(novedades: any[]): { subTotal_Gravado_IESS: number; subTotal_No_Gravado_IESS: number; totalIngresos: number } {
    let subTotal_Gravado_IESS = 0;
    let subTotal_No_Gravado_IESS = 0;

    novedades.forEach(novedad => {
      if (novedad.is_Gravable) {
        subTotal_Gravado_IESS += novedad.montoAplicado;
      } else {
        subTotal_No_Gravado_IESS += novedad.montoAplicado;
      }
    });

    return {
      subTotal_Gravado_IESS,
      subTotal_No_Gravado_IESS,
      totalIngresos: subTotal_Gravado_IESS + subTotal_No_Gravado_IESS
    };
  }

  calculateEgresoTotal(novedades: any[]): number {
    return novedades.reduce((total, novedad) => total + novedad.montoAplicado, 0);
  }

  async create(data: NominaFormData): Promise<Nomina> {
    try {
      const newId = crypto.randomUUID();

      const ingresos: Ingreso[] = data.ingresos.map(ingreso => {
        const totals = this.calculateIngresoTotals(ingreso.novedades);
        return {
          iD_Ingreso: crypto.randomUUID(),
          novedades: ingreso.novedades,
          ...totals,
          dateCreated: new Date().toISOString()
        };
      });

      const egresos: Egreso[] = data.egresos.map(egreso => {
        return {
          iD_Egreso: crypto.randomUUID(),
          novedades: egreso.novedades,
          totalEgresos: this.calculateEgresoTotal(egreso.novedades),
          dateCreated: new Date().toISOString()
        };
      });

      const totalIngresos = ingresos.reduce((sum, ing) => sum + ing.totalIngresos, 0);
      const totalEgresos = egresos.reduce((sum, egr) => sum + egr.totalEgresos, 0);

      const payload: Nomina = {
        iD_Nomina: newId,
        iD_Empleado: data.iD_Empleado,
        periodo: data.periodo,
        ingresos,
        egresos,
        totalIngresos,
        totalEgresos,
        netoAPagar: totalIngresos - totalEgresos
      };

      const response = await apiService.post(`${this.baseURL}/api/Nomina`, payload);

      if (typeof response.data === 'string') {
        return payload;
      }

      return response.data as Nomina;
    } catch (error) {
      console.error('Error creating nomina:', error);
      throw error;
    }
  }

  async update(id: string, data: NominaFormData): Promise<Nomina> {
    try {
      const ingresos: Ingreso[] = data.ingresos.map(ingreso => {
        const totals = this.calculateIngresoTotals(ingreso.novedades);
        return {
          iD_Ingreso: crypto.randomUUID(),
          novedades: ingreso.novedades,
          ...totals,
          dateCreated: new Date().toISOString()
        };
      });

      const egresos: Egreso[] = data.egresos.map(egreso => {
        return {
          iD_Egreso: crypto.randomUUID(),
          novedades: egreso.novedades,
          totalEgresos: this.calculateEgresoTotal(egreso.novedades),
          dateCreated: new Date().toISOString()
        };
      });

      const totalIngresos = ingresos.reduce((sum, ing) => sum + ing.totalIngresos, 0);
      const totalEgresos = egresos.reduce((sum, egr) => sum + egr.totalEgresos, 0);

      const payload: Nomina = {
        iD_Nomina: id,
        iD_Empleado: data.iD_Empleado,
        periodo: data.periodo,
        ingresos,
        egresos,
        totalIngresos,
        totalEgresos,
        netoAPagar: totalIngresos - totalEgresos
      };

      const response = await apiService.put(`${this.baseURL}/api/Nomina/${id}`, payload);

      if (typeof response.data === 'string') {
        return payload;
      }

      return response.data as Nomina;
    } catch (error) {
      console.error('Error updating nomina:', error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await apiService.delete(`${this.baseURL}/api/Nomina/${id}`);
    } catch (error: any) {
      console.error('Error deleting nomina:', error);

      if (error.response?.status === 500 && error.response?.data?.includes('not found')) {
        console.warn('Nomina not found in backend, treating as already deleted');
        return;
      }

      throw error;
    }
  }
}

export default new NominaFacade();
