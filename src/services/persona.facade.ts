import apiService from './api.service';
import type { Persona, PersonaFormData } from '@/types';

class PersonaFacade {
  private readonly baseURL: string;

  constructor() {
    this.baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
  }

  private normalizePersona(persona: any): Persona {
    return {
      ...persona,
      correo: persona.correo || [],
      telefono: persona.telefono || [],
      direcciones: persona.direcciones || []
    };
  }

  async getAll(): Promise<Persona[]> {
    try {
      const response = await apiService.get<Persona[]>(`${this.baseURL}/api/Persona`);
      return response.data.map(p => this.normalizePersona(p));
    } catch (error) {
      console.error('Error fetching personas:', error);
      throw error;
    }
  }

  async getById(id: string): Promise<Persona> {
    try {
      const response = await apiService.get<Persona>(`${this.baseURL}/api/Persona/${id}`);
      return this.normalizePersona(response.data);
    } catch (error) {
      console.error('Error fetching persona:', error);
      throw error;
    }
  }

  private formatDate(date: string): string {
    if (!date) return '';
    const [year, month, day] = date.split('-');
    return `${day}-${month}-${year}`;
  }

  private generateGUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  private getCurrentDate(): string {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    return `${day}-${month}-${year}`;
  }

  async create(persona: PersonaFormData): Promise<Persona> {
    try {
      const correos = persona.correo.filter(c => c && c.trim() !== '');
      const telefonos = persona.telefono.filter(t => t && t.trim() !== '');
      const direcciones = persona.direcciones
        .filter(d => d.calle && d.numero && d.piso && d.calle.trim() !== '' && d.numero.trim() !== '' && d.piso.trim() !== '')
        .map(d => ({
          calle: d.calle.trim(),
          numero: d.numero.trim(),
          piso: d.piso.trim()
        }));

      const payload: any = {
        iD_Persona: this.generateGUID(),
        dni: persona.dni?.trim() || '',
        gender: persona.gender?.trim() || '',
        primerNombre: persona.primerNombre?.trim() || '',
        segundoNombre: persona.segundoNombre?.trim() || '',
        apellidoMaterno: persona.apellidoMaterno?.trim() || '',
        apellidoPaterno: persona.apellidoPaterno?.trim() || '',
        dateBirthday: this.formatDate(persona.dateBirthday),
        edad: Number(persona.edad) || 0,
        correo: correos.length > 0 ? correos : null,
        telefono: telefonos.length > 0 ? telefonos : null,
        direcciones: direcciones,
        dateCreated: this.getCurrentDate()
      };

      const response = await apiService.post<Persona>(`${this.baseURL}/api/Persona`, payload);
      return this.normalizePersona(response.data);
    } catch (error) {
      console.error('Error creating persona:', error);
      throw error;
    }
  }

  async update(id: string, persona: PersonaFormData, originalPersona?: Persona): Promise<Persona> {
    try {
      const correos = persona.correo.filter(c => c && c.trim() !== '');
      const telefonos = persona.telefono.filter(t => t && t.trim() !== '');
      const direcciones = persona.direcciones
        .filter(d => d.calle && d.numero && d.piso && d.calle.trim() !== '' && d.numero.trim() !== '' && d.piso.trim() !== '')
        .map(d => {
          const result: any = {
            calle: d.calle.trim(),
            numero: d.numero.trim(),
            piso: d.piso.trim()
          };

          if (d.iD_Direccion) {
            result.iD_Direccion = d.iD_Direccion;
          }

          return result;
        });

      const payload: any = {
        iD_Persona: id,
        dni: persona.dni?.trim() || '',
        gender: persona.gender?.trim() || '',
        primerNombre: persona.primerNombre?.trim() || '',
        segundoNombre: persona.segundoNombre?.trim() || '',
        apellidoMaterno: persona.apellidoMaterno?.trim() || '',
        apellidoPaterno: persona.apellidoPaterno?.trim() || '',
        dateBirthday: this.formatDate(persona.dateBirthday),
        edad: Number(persona.edad) || 0,
        correo: correos.length > 0 ? correos : null,
        telefono: telefonos.length > 0 ? telefonos : null,
        direcciones: direcciones,
        dateCreated: originalPersona?.dateCreated || this.getCurrentDate()
      };

      console.log('=== UPDATING PAYLOAD ===');
      console.log(JSON.stringify(payload, null, 2));

      const response = await apiService.put<Persona>(`${this.baseURL}/api/Persona/${id}`, payload);
      return this.normalizePersona(response.data);
    } catch (error) {
      console.error('=== ERROR UPDATING PERSONA ===');
      console.error('Error:', error);
      if ((error as any).response) {
        console.error('Response data:', JSON.stringify((error as any).response.data, null, 2));
        console.error('Response status:', (error as any).response.status);
      }
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await apiService.delete(`${this.baseURL}/api/Persona/${id}`);
    } catch (error) {
      console.error('Error deleting persona:', error);
      throw error;
    }
  }
}

export default new PersonaFacade();
