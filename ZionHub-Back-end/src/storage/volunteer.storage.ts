import { supabase } from '../config/supabase';
import { User } from '../types/models';
import { logger } from '../config/logger';

export class VolunteerStorage {
  async listVolunteers(churchId: string, search?: string): Promise<User[]> {
    try {
      let query = supabase
        .from('users')
        .select('id, email, full_name, phone, whatsapp, role, status, created_at')
        .eq('church_id', churchId)
        .neq('is_master', true)
        .order('full_name', { ascending: true });

      if (search) {
        query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`);
      }

      const { data, error } = await query;

      if (error) {
        logger.error('Error listing volunteers:', error);
        throw new Error(error.message);
      }

      return data || [];
    } catch (error) {
      logger.error('VolunteerStorage.listVolunteers error:', error);
      throw error;
    }
  }

  async getVolunteerById(churchId: string, volunteerId: string): Promise<User> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', volunteerId)
        .eq('church_id', churchId)
        .neq('is_master', true)
        .single();

      if (error) {
        logger.error('Error fetching volunteer:', error);
        throw new Error('Volunteer not found');
      }

      return data;
    } catch (error) {
      logger.error('VolunteerStorage.getVolunteerById error:', error);
      throw error;
    }
  }

  async updateVolunteer(
    churchId: string,
    volunteerId: string,
    updates: Partial<User>
  ): Promise<User> {
    try {
      const { data, error } = await supabase
        .from('users')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', volunteerId)
        .eq('church_id', churchId)
        .neq('is_master', true)
        .select()
        .single();

      if (error) {
        logger.error('Error updating volunteer:', error);
        throw new Error(error.message);
      }

      return data;
    } catch (error) {
      logger.error('VolunteerStorage.updateVolunteer error:', error);
      throw error;
    }
  }

  async activateVolunteer(churchId: string, volunteerId: string): Promise<User> {
    try {
      return this.updateVolunteer(churchId, volunteerId, { status: 'active' });
    } catch (error) {
      logger.error('VolunteerStorage.activateVolunteer error:', error);
      throw error;
    }
  }

  async deactivateVolunteer(churchId: string, volunteerId: string): Promise<User> {
    try {
      return this.updateVolunteer(churchId, volunteerId, { status: 'inactive' });
    } catch (error) {
      logger.error('VolunteerStorage.deactivateVolunteer error:', error);
      throw error;
    }
  }
}
