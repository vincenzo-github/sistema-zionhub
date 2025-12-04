import { supabase } from '../config/supabase';
import { EventAssignment } from '../types/models';
import { logger } from '../config/logger';

export class AssignmentStorage {
  async getAssignmentById(assignmentId: string): Promise<EventAssignment | null> {
    try {
      const { data, error } = await supabase
        .from('event_assignments')
        .select('*')
        .eq('id', assignmentId)
        .single();

      if (error) {
        return null;
      }

      return data as EventAssignment;
    } catch (err) {
      logger.error('AssignmentStorage.getAssignmentById error:', err);
      return null;
    }
  }

  async getEventAssignments(eventId: string): Promise<EventAssignment[]> {
    try {
      const { data, error } = await supabase
        .from('event_assignments')
        .select('*')
        .eq('event_id', eventId);

      if (error) {
        throw new Error(error.message);
      }

      return (data || []) as EventAssignment[];
    } catch (err) {
      logger.error('AssignmentStorage.getEventAssignments error:', err);
      return [];
    }
  }

  async getUserAssignments(userId: string, filters?: { status?: string }): Promise<EventAssignment[]> {
    try {
      let query = supabase
        .from('event_assignments')
        .select('*')
        .eq('user_id', userId);

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      const { data, error } = await query.order('assigned_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return (data || []) as EventAssignment[];
    } catch (err) {
      logger.error('AssignmentStorage.getUserAssignments error:', err);
      return [];
    }
  }

  async createAssignment(assignment: Partial<EventAssignment>): Promise<EventAssignment> {
    try {
      const { data, error } = await supabase
        .from('event_assignments')
        .insert([assignment])
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data as EventAssignment;
    } catch (err) {
      logger.error('AssignmentStorage.createAssignment error:', err);
      throw err;
    }
  }

  async updateAssignment(
    assignmentId: string,
    updates: Partial<EventAssignment>
  ): Promise<EventAssignment | null> {
    try {
      const { data, error } = await supabase
        .from('event_assignments')
        .update(updates)
        .eq('id', assignmentId)
        .select()
        .single();

      if (error) {
        logger.error('Error updating assignment:', error);
        return null;
      }

      return data as EventAssignment;
    } catch (err) {
      logger.error('AssignmentStorage.updateAssignment error:', err);
      return null;
    }
  }

  async deleteAssignment(assignmentId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('event_assignments')
        .delete()
        .eq('id', assignmentId);

      if (error) {
        logger.error('Error deleting assignment:', error);
        return false;
      }

      return true;
    } catch (err) {
      logger.error('AssignmentStorage.deleteAssignment error:', err);
      return false;
    }
  }

  async checkIn(assignmentId: string): Promise<EventAssignment | null> {
    try {
      const { data, error } = await supabase
        .from('event_assignments')
        .update({
          status: 'checked_in',
          check_in_time: new Date().toISOString(),
        })
        .eq('id', assignmentId)
        .select()
        .single();

      if (error) {
        logger.error('Error checking in:', error);
        return null;
      }

      return data as EventAssignment;
    } catch (err) {
      logger.error('AssignmentStorage.checkIn error:', err);
      return null;
    }
  }

  async checkOut(assignmentId: string): Promise<EventAssignment | null> {
    try {
      const { data, error } = await supabase
        .from('event_assignments')
        .update({
          status: 'checked_out',
          check_out_time: new Date().toISOString(),
        })
        .eq('id', assignmentId)
        .select()
        .single();

      if (error) {
        logger.error('Error checking out:', error);
        return null;
      }

      return data as EventAssignment;
    } catch (err) {
      logger.error('AssignmentStorage.checkOut error:', err);
      return null;
    }
  }

  async countByStatus(eventId: string, status: string): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('event_assignments')
        .select('*', { count: 'exact' })
        .eq('event_id', eventId)
        .eq('status', status);

      if (error) {
        return 0;
      }

      return count || 0;
    } catch (err) {
      logger.error('AssignmentStorage.countByStatus error:', err);
      return 0;
    }
  }

  async getPendingAssignments(churchId: string, limit: number = 10): Promise<EventAssignment[]> {
    try {
      const { data, error } = await supabase
        .from('event_assignments')
        .select(`
          *,
          events(name, date),
          users(full_name)
        `)
        .eq('status', 'pending')
        .order('assigned_at', { ascending: false })
        .limit(limit);

      if (error) {
        throw new Error(error.message);
      }

      return (data || []) as EventAssignment[];
    } catch (err) {
      logger.error('AssignmentStorage.getPendingAssignments error:', err);
      return [];
    }
  }
}
