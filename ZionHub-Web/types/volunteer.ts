export type VolunteerStatus = 'active' | 'inactive' | 'suspended'
export type AvailabilityStatus = 'available' | 'unavailable' | 'limited'

export interface Volunteer {
  id: string
  church_id: string
  full_name: string
  email: string
  phone?: string
  whatsapp?: string
  photo?: string
  status: VolunteerStatus
  availability: AvailabilityStatus
  bio?: string
  position?: string
  joined_date: string
  last_event?: string
  skills?: string[]
  roles?: string[]
  ministries?: string[]
  total_events: number
  total_hours: number
  attendance_rate: number
  preferred_roles?: string[]
  created_at: string
  updated_at: string
}

export interface VolunteerFilters {
  status?: VolunteerStatus | 'all'
  availability?: AvailabilityStatus | 'all'
  ministry_id?: string
  skill?: string
  search?: string
}

export interface CreateVolunteerInput {
  full_name: string
  email: string
  phone?: string
  whatsapp?: string
  bio?: string
  position?: string
  skills?: string[]
  roles?: string[]
  ministries?: string[]
  preferred_roles?: string[]
}

export interface VolunteerStats {
  total_volunteers: number
  active_volunteers: number
  available_volunteers: number
  total_events: number
  total_hours: number
  average_attendance: number
}

export interface ParticipationHistory {
  id: string
  event_id: string
  event_name: string
  date: string
  role: string
  status: 'attended' | 'confirmed' | 'no_show' | 'cancelled'
  hours: number
}
