import { supabase } from '../config/supabase';
import { logger } from '../config/logger';

export interface DashboardStats {
  totalVolunteers: number;
  activeVolunteers: number;
  totalEvents: number;
  upcomingEvents: number;
  totalAssignments: number;
  checkedInAssignments: number;
  gamificationPoints: number;
}

export class DashboardStorage {
  async getChurchDashboard(churchId: string): Promise<DashboardStats> {
    try {
      // Get volunteer counts
      const { count: totalVolunteers } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('church_id', churchId)
        .neq('is_master', true);

      const { count: activeVolunteers } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('church_id', churchId)
        .eq('status', 'active')
        .neq('is_master', true);

      // Get event counts
      const { count: totalEvents } = await supabase
        .from('events')
        .select('*', { count: 'exact', head: true })
        .eq('church_id', churchId);

      const { count: upcomingEvents } = await supabase
        .from('events')
        .select('*', { count: 'exact', head: true })
        .eq('church_id', churchId)
        .gt('event_date', new Date().toISOString())
        .eq('status', 'published');

      // Get assignment counts
      const { count: totalAssignments } = await supabase
        .from('event_assignments')
        .select('ea.*, e(church_id)', { count: 'exact', head: true })
        .eq('e.church_id', churchId);

      const { count: checkedInAssignments } = await supabase
        .from('event_assignments')
        .select('ea.*, e(church_id)', { count: 'exact', head: true })
        .eq('e.church_id', churchId)
        .eq('status', 'checked_in');

      // Get total gamification points for church members
      const { data: pointsData } = await supabase
        .from('gamification_points')
        .select('points', { count: 'exact' })
        .eq('user.church_id', churchId);

      const gamificationPoints = pointsData?.reduce(
        (sum: number, item: any) => sum + (item.points || 0),
        0
      ) || 0;

      return {
        totalVolunteers: totalVolunteers || 0,
        activeVolunteers: activeVolunteers || 0,
        totalEvents: totalEvents || 0,
        upcomingEvents: upcomingEvents || 0,
        totalAssignments: totalAssignments || 0,
        checkedInAssignments: checkedInAssignments || 0,
        gamificationPoints,
      };
    } catch (error) {
      logger.error('DashboardStorage.getChurchDashboard error:', error);
      throw error;
    }
  }

  async getUserDashboard(churchId: string, userId: string) {
    try {
      // Get user's assignments
      const { data: userAssignments, error: assignmentError } = await supabase
        .from('event_assignments')
        .select('*, events(id, name, event_date, location)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(10);

      if (assignmentError) {
        logger.error('Error fetching user assignments:', assignmentError);
        throw new Error(assignmentError.message);
      }

      // Get user's upcoming assignments
      const { count: upcomingAssignments } = await supabase
        .from('event_assignments')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .in('status', ['pending', 'confirmed']);

      // Get user's total points
      const { data: userPoints } = await supabase
        .from('gamification_points')
        .select('points')
        .eq('user_id', userId);

      const totalPoints = userPoints?.reduce(
        (sum: number, item: any) => sum + (item.points || 0),
        0
      ) || 0;

      return {
        recentAssignments: userAssignments,
        upcomingAssignments: upcomingAssignments || 0,
        totalPoints,
      };
    } catch (error) {
      logger.error('DashboardStorage.getUserDashboard error:', error);
      throw error;
    }
  }

  async getEventAnalytics(churchId: string, eventId: string) {
    try {
      // Get event details
      const { data: event, error: eventError } = await supabase
        .from('events')
        .select('*')
        .eq('id', eventId)
        .eq('church_id', churchId)
        .single();

      if (eventError) {
        logger.error('Error fetching event:', eventError);
        throw new Error('Event not found');
      }

      // Get assignment statistics
      const { data: assignments, error: assignmentError } = await supabase
        .from('event_assignments')
        .select('status')
        .eq('event_id', eventId);

      if (assignmentError) {
        logger.error('Error fetching assignments:', assignmentError);
        throw new Error(assignmentError.message);
      }

      // Count assignments by status
      const stats = {
        total: assignments?.length || 0,
        pending: assignments?.filter((a: any) => a.status === 'pending').length || 0,
        confirmed: assignments?.filter((a: any) => a.status === 'confirmed').length || 0,
        checked_in: assignments?.filter((a: any) => a.status === 'checked_in').length || 0,
        no_show: assignments?.filter((a: any) => a.status === 'no_show').length || 0,
      };

      return {
        event,
        assignmentStats: stats,
      };
    } catch (error) {
      logger.error('DashboardStorage.getEventAnalytics error:', error);
      throw error;
    }
  }
}
