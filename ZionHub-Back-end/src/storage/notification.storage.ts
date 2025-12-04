import { supabase } from '../config/supabase'
import { Notification } from '../types/models'
import { logger } from '../config/logger'

export class NotificationStorage {
  async listByUser(churchId: string, userId: string): Promise<Notification[]> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('church_id', churchId)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) {
        logger.error('Error fetching notifications:', error)
        return []
      }

      return (data || []) as Notification[]
    } catch (err) {
      logger.error('NotificationStorage.listByUser error:', err)
      return []
    }
  }

  async getUnreadCount(churchId: string, userId: string): Promise<number> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('id', { count: 'exact' })
        .eq('church_id', churchId)
        .eq('user_id', userId)
        .eq('is_read', false)

      if (error) {
        logger.error('Error counting unread:', error)
        return 0
      }

      return data?.length || 0
    } catch (err) {
      logger.error('NotificationStorage.getUnreadCount error:', err)
      return 0
    }
  }

  async createNotification(notification: Partial<Notification>): Promise<Notification> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert([notification])
        .select()
        .single()

      if (error) {
        throw new Error(error.message)
      }

      logger.info(`Notification created: ${data.id}`)
      return data as Notification
    } catch (err) {
      logger.error('NotificationStorage.createNotification error:', err)
      throw err
    }
  }

  async markAsRead(churchId: string, notificationId: string): Promise<Notification | null> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .update({
          is_read: true,
          read_at: new Date().toISOString(),
        })
        .eq('id', notificationId)
        .eq('church_id', churchId)
        .select()
        .single()

      if (error) {
        logger.error('Error marking as read:', error)
        return null
      }

      logger.info(`Notification marked as read: ${notificationId}`)
      return data as Notification
    } catch (err) {
      logger.error('NotificationStorage.markAsRead error:', err)
      return null
    }
  }

  async markAllAsRead(churchId: string, userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({
          is_read: true,
          read_at: new Date().toISOString(),
        })
        .eq('church_id', churchId)
        .eq('user_id', userId)
        .eq('is_read', false)

      if (error) {
        logger.error('Error marking all as read:', error)
        return false
      }

      logger.info(`All notifications marked as read for user: ${userId}`)
      return true
    } catch (err) {
      logger.error('NotificationStorage.markAllAsRead error:', err)
      return false
    }
  }

  async deleteNotification(churchId: string, notificationId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId)
        .eq('church_id', churchId)

      if (error) {
        logger.error('Error deleting notification:', error)
        return false
      }

      logger.info(`Notification deleted: ${notificationId}`)
      return true
    } catch (err) {
      logger.error('NotificationStorage.deleteNotification error:', err)
      return false
    }
  }

  async createBulkNotifications(
    notifications: Partial<Notification>[]
  ): Promise<Notification[]> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert(notifications)
        .select()

      if (error) {
        throw new Error(error.message)
      }

      logger.info(`${data?.length || 0} notifications created`)
      return (data || []) as Notification[]
    } catch (err) {
      logger.error('NotificationStorage.createBulkNotifications error:', err)
      throw err
    }
  }
}
