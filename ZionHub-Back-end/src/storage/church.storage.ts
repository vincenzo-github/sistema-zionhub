import { supabase } from '../config/supabase';
import { Church } from '../types/models';
import { logger } from '../config/logger';

export class ChurchStorage {
  async getChurchById(churchId: string): Promise<Church | null> {
    try {
      const { data, error } = await supabase
        .from('churches')
        .select('*')
        .eq('id', churchId)
        .single();

      if (error) {
        logger.error('Error fetching church:', error);
        return null;
      }

      return data as Church;
    } catch (err) {
      logger.error('ChurchStorage.getChurchById error:', err);
      return null;
    }
  }

  async getChurchByEmail(email: string): Promise<Church | null> {
    try {
      const { data, error } = await supabase
        .from('churches')
        .select('*')
        .eq('email', email)
        .single();

      if (error) {
        return null;
      }

      return data as Church;
    } catch (err) {
      logger.error('ChurchStorage.getChurchByEmail error:', err);
      return null;
    }
  }

  async createChurch(church: Partial<Church>): Promise<Church> {
    try {
      const { data, error } = await supabase
        .from('churches')
        .insert([church])
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      logger.info(`Church created: ${data.id}`);
      return data as Church;
    } catch (err) {
      logger.error('ChurchStorage.createChurch error:', err);
      throw err;
    }
  }

  async getAllChurches(): Promise<Church[]> {
    try {
      const { data, error } = await supabase
        .from('churches')
        .select('id, name, email')
        .eq('status', 'active')
        .order('name', { ascending: true });

      if (error) {
        logger.error('Error fetching all churches:', error);
        return [];
      }

      return (data || []) as Church[];
    } catch (err) {
      logger.error('ChurchStorage.getAllChurches error:', err);
      return [];
    }
  }

  async updateChurch(churchId: string, updates: Partial<Church>): Promise<Church | null> {
    try {
      const { data, error } = await supabase
        .from('churches')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', churchId)
        .select()
        .single();

      if (error) {
        logger.error('Error updating church:', error);
        return null;
      }

      return data as Church;
    } catch (err) {
      logger.error('ChurchStorage.updateChurch error:', err);
      return null;
    }
  }

  async markSetupCompleted(churchId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('churches')
        .update({
          setup_completed: true,
          updated_at: new Date().toISOString(),
        })
        .eq('id', churchId);

      if (error) {
        logger.error('Error marking setup completed:', error);
        return false;
      }

      return true;
    } catch (err) {
      logger.error('ChurchStorage.markSetupCompleted error:', err);
      return false;
    }
  }
}