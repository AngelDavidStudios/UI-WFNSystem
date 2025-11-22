import supabaseService from './supabase.service';
import type { Workspace, WorkspaceFormData } from '@/types';

class WorkspaceFacade {
  private readonly tableName = 'workspaces';

  async getAll(): Promise<Workspace[]> {
    const { data, error } = await supabaseService
      .getClient()
      .from(this.tableName)
      .select('*')
      .order('fechaCreacion', { ascending: false });

    if (error) {
      console.error('Error fetching workspaces:', error);
      throw new Error(error.message);
    }

    return data || [];
  }

  async getById(id: string): Promise<Workspace> {
    const { data, error } = await supabaseService
      .getClient()
      .from(this.tableName)
      .select('*')
      .eq('iD_Workspace', id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching workspace:', error);
      throw new Error(error.message);
    }

    if (!data) {
      throw new Error('Workspace no encontrado');
    }

    return data;
  }

  async create(formData: WorkspaceFormData): Promise<Workspace> {
    const date = new Date(formData.fechaCreacion);
    const nombre = `${date.toLocaleString('es-ES', { month: 'long' })} ${date.getFullYear()}`.toUpperCase();
    const periodo = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

    const workspace = {
      nombre,
      periodo,
      nominas: [],
      fechaCreacion: formData.fechaCreacion,
      fechaCierre: formData.fechaCierre,
      estado: formData.estado,
    };

    const { data, error } = await supabaseService
      .getClient()
      .from(this.tableName)
      .insert(workspace)
      .select()
      .single();

    if (error) {
      console.error('Error creating workspace:', error);
      throw new Error(error.message);
    }

    return data;
  }

  async update(id: string, updateData: Partial<Workspace>): Promise<Workspace> {
    const { data, error } = await supabaseService
      .getClient()
      .from(this.tableName)
      .update(updateData)
      .eq('iD_Workspace', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating workspace:', error);
      throw new Error(error.message);
    }

    return data;
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabaseService
      .getClient()
      .from(this.tableName)
      .delete()
      .eq('iD_Workspace', id);

    if (error) {
      console.error('Error deleting workspace:', error);
      throw new Error(error.message);
    }
  }
}

export const workspaceFacade = new WorkspaceFacade();
