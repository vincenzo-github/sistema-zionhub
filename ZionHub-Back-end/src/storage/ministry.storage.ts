import { supabase } from '../config/supabase';
import { Ministry } from '../types/models';
import { logger } from '../config/logger';

export class MinistryStorage {
  async listByChurch(churchId: string): Promise<Ministry[]> {
    try {
      const { data, error } = await supabase
        .from('ministries')
        .select('*')
        .eq('church_id', churchId)
        .order('name', { ascending: true });

      if (error) {
        logger.error('Error fetching ministries:', error);
        return [];
      }

      return (data || []) as Ministry[];
    } catch (err) {
      logger.error('MinistryStorage.listByChurch error:', err);
      return [];
    }
  }

  async getMinistryById(churchId: string, ministryId: string): Promise<Ministry | null> {
    try {
      const { data, error } = await supabase
        .from('ministries')
        .select('*')
        .eq('id', ministryId)
        .eq('church_id', churchId)
        .single();

      if (error) {
        logger.error('Error fetching ministry:', error);
        return null;
      }

      return data as Ministry;
    } catch (err) {
      logger.error('MinistryStorage.getMinistryById error:', err);
      return null;
    }
  }

  async createMinistry(churchId: string, ministry: Partial<Ministry>): Promise<Ministry> {
    try {
      const { data, error } = await supabase
        .from('ministries')
        .insert([
          {
            church_id: churchId,
            ...ministry,
          },
        ])
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      logger.info(`Ministry created: ${data.id}`);
      return data as Ministry;
    } catch (err) {
      logger.error('MinistryStorage.createMinistry error:', err);
      throw err;
    }
  }

  async updateMinistry(
    churchId: string,
    ministryId: string,
    updates: Partial<Ministry>
  ): Promise<Ministry | null> {
    try {
      const { data, error } = await supabase
        .from('ministries')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', ministryId)
        .eq('church_id', churchId)
        .select()
        .single();

      if (error) {
        logger.error('Error updating ministry:', error);
        return null;
      }

      logger.info(`Ministry updated: ${ministryId}`);
      return data as Ministry;
    } catch (err) {
      logger.error('MinistryStorage.updateMinistry error:', err);
      return null;
    }
  }

  async deleteMinistry(churchId: string, ministryId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('ministries')
        .delete()
        .eq('id', ministryId)
        .eq('church_id', churchId);

      if (error) {
        logger.error('Error deleting ministry:', error);
        return false;
      }

      logger.info(`Ministry deleted: ${ministryId}`);
      return true;
    } catch (err) {
      logger.error('MinistryStorage.deleteMinistry error:', err);
      return false;
    }
  }
}
