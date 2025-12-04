export interface JWTPayload {
  userId: string;
  churchId: string;
  email: string;
  role: 'master' | 'leader_ministry' | 'leader_dept' | 'member';
  isMaster: boolean;
}

export interface Church {
  id: string;
  name: string;
  email: string;
  phone?: string;
  whatsapp?: string;
  logo?: string;
  plan_id?: string;
  cakto_id?: string;
  status: 'active' | 'inactive' | 'pending';
  setup_completed: boolean;
  setup_token?: string;
  setup_token_expires_at?: string;
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
  activation_token?: string;
  activation_token_expires_at?: string;
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
  event_template_id?: string;
  schedule_template_id?: string;
  setlist_id?: string;
  recurrence_group_id?: string;
  qrcode?: string;
  is_draft: boolean;
  workflow_stage: string;
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
  assigned_by?: string;
  check_in_time?: string;
  check_out_time?: string;
  notes?: string;
  assigned_at: string;
}

export interface Volunteer {
  id: string;
  church_id: string;
  email: string;
  full_name: string;
  phone?: string;
  whatsapp?: string;
  created_at: string;
  updated_at: string;
}

export interface RequestWithAuth extends Express.Request {
  userId?: string;
  churchId?: string;
  userRole?: string;
  isMaster?: boolean;
}
