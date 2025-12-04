export type NotificationType = 'assignment' | 'confirmation' | 'reminder' | 'checkin' | 'general'

export interface Notification {
  id: string
  church_id: string
  user_id: string
  title: string
  message: string
  type: NotificationType
  event_id?: string
  assignment_id?: string
  is_read: boolean
  read_at?: string
  created_at: string
  updated_at: string
}

export interface CreateNotificationInput {
  user_id: string
  title: string
  message: string
  type: NotificationType
  event_id?: string
  assignment_id?: string
}

export interface NotificationFilters {
  is_read?: boolean
  type?: NotificationType
}
