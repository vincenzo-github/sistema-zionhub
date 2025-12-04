export interface Church {
  id: string;
  name: string;
  email: string;
  phone?: string;
  whatsapp?: string;
  logo?: string;
  plan_id?: string;
  status: 'active' | 'inactive' | 'pending';
  setup_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  church_id: string;
  email: string;
  full_name: string;
  phone?: string;
  whatsapp?: string;
  photo?: string;
  role: 'master' | 'leader_ministry' | 'leader_dept' | 'member';
  status: 'active' | 'inactive';
  is_master: boolean;
  position?: string;
  last_login?: string;
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: string;
  church_id: string;
  name: string;
  type?: string;
  date: string;
  start_time: string;
  end_time: string;
  location?: string;
  status: 'draft' | 'published' | 'completed' | 'cancelled';
  ministry_id?: string;
  qrcode?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface EventAssignment {
  id: string;
  event_id: string;
  department_role_id: string;
  user_id: string;
  status: 'pending' | 'confirmed' | 'declined' | 'completed';
  check_in_time?: string;
  check_out_time?: string;
  notes?: string;
  assigned_at: string;
}

export interface DashboardStats {
  total_events: number;
  total_volunteers: number;
  pending_schedules: number;
  completion_rate: number;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ApiError {
  error: string;
  details?: any;
}
