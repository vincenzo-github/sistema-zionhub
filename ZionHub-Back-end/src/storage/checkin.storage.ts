import { supabase } from '../config/supabase'
import { logger } from '../config/logger'

export class CheckinStorage {
  async checkIn(
    churchId: string,
    eventId: string,
    userId: string,
    notes?: string
  ): Promise<any | null> {
    try {
      const now = new Date().toISOString()

      const { data, error } = await supabase
        .from('event_assignments')
        .update({
          check_in_time: now,
          status: 'checked_in',
          notes: notes || null,
        })
        .eq('event_id', eventId)
        .eq('user_id', userId)
        .select()
        .single()

      if (error) {
        // Se não existe na tabela de assignments, criar nova entrada
        if (error.code === 'PGRST116') {
          const { data: newData, error: createError } = await supabase
            .from('event_assignments')
            .insert([
              {
                event_id: eventId,
                user_id: userId,
                check_in_time: now,
                status: 'checked_in',
                notes: notes || null,
              },
            ])
            .select()
            .single()

          if (createError) {
            logger.error('Error creating check-in record:', createError)
            return null
          }

          return newData
        }

        logger.error('Error checking in:', error)
        return null
      }

      logger.info(`Check-in recorded: event=${eventId}, user=${userId}`)
      return data
    } catch (err) {
      logger.error('CheckinStorage.checkIn error:', err)
      return null
    }
  }

  async checkOut(
    churchId: string,
    eventId: string,
    userId: string,
    notes?: string
  ): Promise<any | null> {
    try {
      const now = new Date().toISOString()

      const { data, error } = await supabase
        .from('event_assignments')
        .update({
          check_out_time: now,
          status: 'checked_out',
          notes: notes || null,
        })
        .eq('event_id', eventId)
        .eq('user_id', userId)
        .select()
        .single()

      if (error) {
        logger.error('Error checking out:', error)
        return null
      }

      logger.info(`Check-out recorded: event=${eventId}, user=${userId}`)
      return data
    } catch (err) {
      logger.error('CheckinStorage.checkOut error:', err)
      return null
    }
  }

  async getEventAttendance(eventId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('event_assignments')
        .select(`
          id,
          user_id,
          check_in_time,
          check_out_time,
          status,
          users:user_id(id, full_name, email)
        `)
        .eq('event_id', eventId)
        .order('check_in_time', { ascending: true })

      if (error) {
        logger.error('Error fetching attendance:', error)
        return []
      }

      return (data || []).map((record: any) => ({
        id: record.id,
        user_id: record.user_id,
        full_name: record.users?.full_name || 'Unknown',
        email: record.users?.email || '',
        check_in_time: record.check_in_time,
        check_out_time: record.check_out_time,
        status: record.status,
        duration_minutes: record.check_in_time && record.check_out_time
          ? Math.round((new Date(record.check_out_time).getTime() - new Date(record.check_in_time).getTime()) / (1000 * 60))
          : null,
      }))
    } catch (err) {
      logger.error('CheckinStorage.getEventAttendance error:', err)
      return []
    }
  }

  async getUserCheckinHistory(churchId: string, userId: string, limit = 20): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('event_assignments')
        .select(`
          id,
          event_id,
          check_in_time,
          check_out_time,
          status,
          events:event_id(name, date, start_time)
        `)
        .eq('user_id', userId)
        .not('check_in_time', 'is', null)
        .order('check_in_time', { ascending: false })
        .limit(limit)

      if (error) {
        logger.error('Error fetching checkin history:', error)
        return []
      }

      return (data || []).map((record: any) => ({
        id: record.id,
        event_id: record.event_id,
        event_name: record.events?.name,
        date: record.events?.date,
        start_time: record.events?.start_time,
        check_in_time: record.check_in_time,
        check_out_time: record.check_out_time,
        status: record.status,
      }))
    } catch (err) {
      logger.error('CheckinStorage.getUserCheckinHistory error:', err)
      return []
    }
  }

  async deleteCheckinRecord(eventId: string, userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('event_assignments')
        .update({
          check_in_time: null,
          check_out_time: null,
          status: 'pending',
        })
        .eq('event_id', eventId)
        .eq('user_id', userId)

      if (error) {
        logger.error('Error deleting checkin record:', error)
        return false
      }

      logger.info(`Check-in record deleted: event=${eventId}, user=${userId}`)
      return true
    } catch (err) {
      logger.error('CheckinStorage.deleteCheckinRecord error:', err)
      return false
    }
  }
}
