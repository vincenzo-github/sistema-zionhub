import { supabase } from '../config/supabase';
import { User } from '../types/models';
import { logger } from '../config/logger';

export class UserStorage {
  async getUserById(userId: string): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        return null;
      }

      return data as User;
    } catch (err) {
      logger.error('UserStorage.getUserById error:', err);
      return null;
    }
  }

  async getUserByEmail(churchId: string, email: string): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('church_id', churchId)
        .eq('email', email)
        .single();

      if (error) {
        return null;
      }

      return data as User;
    } catch (err) {
      logger.error('UserStorage.getUserByEmail error:', err);
      return null;
    }
  }

  async getUserByEmailGlobal(email: string): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (error) {
        return null;
      }

      return data as User;
    } catch (err) {
      logger.error('UserStorage.getUserByEmailGlobal error:', err);
      return null;
    }
  }

  async createUser(user: Partial<User>): Promise<User> {
    try {
      const { data, error } = await supabase
        .from('users')
        .insert([user])
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data as User;
    } catch (err) {
      logger.error('UserStorage.createUser error:', err);
      throw err;
    }
  }

  async updateUser(userId: string, updates: Partial<User>): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        logger.error('Error updating user:', error);
        return null;
      }

      return data as User;
    } catch (err) {
      logger.error('UserStorage.updateUser error:', err);
      return null;
    }
  }

  async listByChurch(churchId: string, filters?: { role?: string; status?: string }): Promise<User[]> {
    try {
      let query = supabase
        .from('users')
        .select('*')
        .eq('church_id', churchId)
        .eq('is_master', false);

      if (filters?.role) {
        query = query.eq('role', filters.role);
      }

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      const { data, error } = await query;

      if (error) {
        throw new Error(error.message);
      }

      return (data || []) as User[];
    } catch (err) {
      logger.error('UserStorage.listByChurch error:', err);
      throw err;
    }
  }

  async updateLastLogin(userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('users')
        .update({
          last_login: new Date().toISOString(),
        })
        .eq('id', userId);

      if (error) {
        logger.error('Error updating last login:', error);
        return false;
      }

      return true;
    } catch (err) {
      logger.error('UserStorage.updateLastLogin error:', err);
      return false;
    }
  }

  async deleteUser(userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);

      if (error) {
        logger.error('Error deleting user:', error);
        return false;
      }

      return true;
    } catch (err) {
      logger.error('UserStorage.deleteUser error:', err);
      return false;
    }
  }
}