import { supabase } from '../config/supabase';
import { Event } from '../types/models';
import { logger } from '../config/logger';

export class EventStorage {
  async getEventById(eventId: string, churchId: string): Promise<Event | null> {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', eventId)
        .eq('church_id', churchId)
        .single();

      if (error) {
        return null;
      }

      return data as Event;
    } catch (err) {
      logger.error('EventStorage.getEventById error:', err);
      return null;
    }
  }

  async listByChurch(
    churchId: string,
    filters?: { status?: string; ministry_id?: string; startDate?: string; endDate?: string }
  ): Promise<Event[]> {
    try {
      let query = supabase
        .from('events')
        .select('*')
        .eq('church_id', churchId);

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      if (filters?.ministry_id) {
        query = query.eq('ministry_id', filters.ministry_id);
      }

      if (filters?.startDate) {
        query = query.gte('date', filters.startDate);
      }

      if (filters?.endDate) {
        query = query.lte('date', filters.endDate);
      }

      const { data, error } = await query.order('date', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return (data || []) as Event[];
    } catch (err) {
      logger.error('EventStorage.listByChurch error:', err);
      throw err;
    }
  }

  async createEvent(event: Partial<Event>): Promise<Event> {
    try {
      const { data, error } = await supabase
        .from('events')
        .insert([event])
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data as Event;
    } catch (err) {
      logger.error('EventStorage.createEvent error:', err);
      throw err;
    }
  }

  async updateEvent(eventId: string, churchId: string, updates: Partial<Event>): Promise<Event | null> {
    try {
      const { data, error } = await supabase
        .from('events')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', eventId)
        .eq('church_id', churchId)
        .select()
        .single();

      if (error) {
        logger.error('Error updating event:', error);
        return null;
      }

      return data as Event;
    } catch (err) {
      logger.error('EventStorage.updateEvent error:', err);
      return null;
    }
  }

  async deleteEvent(eventId: string, churchId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId)
        .eq('church_id', churchId);

      if (error) {
        logger.error('Error deleting event:', error);
        return false;
      }

      return true;
    } catch (err) {
      logger.error('EventStorage.deleteEvent error:', err);
      return false;
    }
  }

  async getUpcomingEvents(churchId: string, limit: number = 5): Promise<Event[]> {
    try {
      const today = new Date().toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('church_id', churchId)
        .gte('date', today)
        .order('date', { ascending: true })
        .limit(limit);

      if (error) {
        throw new Error(error.message);
      }

      return (data || []) as Event[];
    } catch (err) {
      logger.error('EventStorage.getUpcomingEvents error:', err);
      return [];
    }
  }

  async publishEvent(eventId: string, churchId: string): Promise<Event | null> {
    try {
      const { data, error } = await supabase
        .from('events')
        .update({
          status: 'published',
          is_draft: false,
          updated_at: new Date().toISOString(),
        })
        .eq('id', eventId)
        .eq('church_id', churchId)
        .select()
        .single();

      if (error) {
        logger.error('Error publishing event:', error);
        return null;
      }

      return data as Event;
    } catch (err) {
      logger.error('EventStorage.publishEvent error:', err);
      return null;
    }
  }
}
