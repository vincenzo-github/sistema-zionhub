export interface EventQRCode {
  event_id: string
  qrcode_data: string
  qrcode_url: string
  generated_at: string
  event_name?: string
}

export interface CheckinRecord {
  id: string
  event_id: string
  user_id: string
  check_in_time: string
  check_out_time?: string
  status: 'checked_in' | 'checked_out'
  notes?: string
  created_at: string
  updated_at: string
}

export interface AttendanceRecord {
  id: string
  user_id: string
  full_name: string
  email: string
  check_in_time?: string
  check_out_time?: string
  status: 'pending' | 'checked_in' | 'checked_out'
  duration_minutes?: number
}

export interface EventAttendance {
  event_id: string
  event_name: string
  date: string
  total_expected: number
  total_checked_in: number
  total_checked_out: number
  attendees: AttendanceRecord[]
}

export interface CheckinInput {
  event_id: string
  user_id?: string
  qrcode_data?: string
  notes?: string
}

export interface CheckoutInput {
  event_id: string
  user_id: string
  notes?: string
}
