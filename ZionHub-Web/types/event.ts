export type EventStatus = 'draft' | 'published' | 'in_progress' | 'completed' | 'cancelled'

export interface Event {
  id: string
  name: string
  type: string
  date: string
  start_time: string
  end_time: string
  location: string
  description?: string
  status: EventStatus
  is_draft: boolean
  ministry_id?: string
  ministry_name?: string
  volunteers: {
    current: number
    total: number
  }
  ministries: string[]
  emoji?: string
  created_at: string
  updated_at: string
}

export interface EventFilters {
  status?: EventStatus | 'all'
  ministry_id?: string
  start_date?: string
  end_date?: string
  search?: string
}

export interface CreateEventInput {
  name: string
  type: string
  date: string
  start_time: string
  end_time: string
  location: string
  description?: string
  ministry_id?: string
}

export interface Volunteer {
  id: string
  full_name: string
  photo?: string
  email: string
  status: 'available' | 'unavailable'
  skills: string[]
  is_favorite: boolean
}

export interface Role {
  id: string
  name: string
  description?: string
  max_volunteers: number
  assigned: Volunteer[]
}

export interface Assignment {
  id: string
  event_id: string
  user_id: string
  role_id: string
  status: 'pending' | 'confirmed' | 'declined'
  user: Volunteer
  role: Role
}
