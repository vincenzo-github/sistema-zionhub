-- Create churches table
CREATE TABLE IF NOT EXISTS churches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  whatsapp TEXT,
  logo TEXT,
  plan_id TEXT DEFAULT 'basic',
  cakto_id TEXT UNIQUE,
  status TEXT DEFAULT 'active',
  setup_completed BOOLEAN DEFAULT false,
  setup_token TEXT,
  setup_token_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_churches_email ON churches(email);
CREATE INDEX idx_churches_cakto_id ON churches(cakto_id);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  church_id UUID NOT NULL REFERENCES churches(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  password TEXT NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  whatsapp TEXT,
  photo TEXT,
  role TEXT DEFAULT 'member',
  status TEXT DEFAULT 'active',
  is_master BOOLEAN DEFAULT false,
  position TEXT,
  activation_token TEXT,
  activation_token_expires_at TIMESTAMPTZ,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(church_id, email)
);

CREATE INDEX idx_users_church_id ON users(church_id);
CREATE INDEX idx_users_email ON users(email);

-- Create ministries table
CREATE TABLE IF NOT EXISTS ministries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  church_id UUID NOT NULL REFERENCES churches(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  color TEXT,
  leader_id UUID REFERENCES users(id),
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ministries_church_id ON ministries(church_id);

-- Create departments table
CREATE TABLE IF NOT EXISTS departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  church_id UUID NOT NULL REFERENCES churches(id) ON DELETE CASCADE,
  ministry_id UUID NOT NULL REFERENCES ministries(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  admin_id UUID REFERENCES users(id),
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_departments_church_id ON departments(church_id);
CREATE INDEX idx_departments_ministry_id ON departments(ministry_id);

-- Create department_roles table
CREATE TABLE IF NOT EXISTS department_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  department_id UUID NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_department_roles_department_id ON department_roles(department_id);

-- Create user_department_roles table
CREATE TABLE IF NOT EXISTS user_department_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  department_role_id UUID NOT NULL REFERENCES department_roles(id) ON DELETE CASCADE,
  proficiency_level TEXT DEFAULT 'intermediate',
  experience_time INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, department_role_id)
);

CREATE INDEX idx_user_dept_roles_user_id ON user_department_roles(user_id);

-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  church_id UUID NOT NULL REFERENCES churches(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  location TEXT,
  status TEXT DEFAULT 'draft',
  ministry_id UUID REFERENCES ministries(id),
  event_template_id UUID,
  schedule_template_id UUID,
  setlist_id UUID,
  recurrence_group_id UUID,
  qrcode TEXT,
  is_draft BOOLEAN DEFAULT true,
  workflow_stage TEXT DEFAULT 'created',
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_events_church_id ON events(church_id);
CREATE INDEX idx_events_date ON events(date);
CREATE INDEX idx_events_status ON events(status);

-- Create event_assignments table
CREATE TABLE IF NOT EXISTS event_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  department_role_id UUID NOT NULL REFERENCES department_roles(id),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending',
  assigned_by UUID REFERENCES users(id),
  check_in_time TIMESTAMPTZ,
  check_out_time TIMESTAMPTZ,
  notes TEXT,
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(event_id, user_id, department_role_id)
);

CREATE INDEX idx_event_assignments_event_id ON event_assignments(event_id);
CREATE INDEX idx_event_assignments_user_id ON event_assignments(user_id);
CREATE INDEX idx_event_assignments_status ON event_assignments(status);

-- Create gamification_points table
CREATE TABLE IF NOT EXISTS gamification_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  church_id UUID NOT NULL REFERENCES churches(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  points INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  rank_position INTEGER,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(church_id, user_id)
);

CREATE INDEX idx_gamification_church_id ON gamification_points(church_id);
CREATE INDEX idx_gamification_user_id ON gamification_points(user_id);

-- Enable RLS (Row Level Security)
ALTER TABLE churches ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE ministries ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE department_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_department_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE gamification_points ENABLE ROW LEVEL SECURITY;

-- RLS Policies for churches
CREATE POLICY "Users can view their own church" ON churches
  FOR SELECT USING (id IN (
    SELECT church_id FROM users WHERE id = auth.uid()
  ));

-- RLS Policies for users
CREATE POLICY "Users can view church members" ON users
  FOR SELECT USING (church_id IN (
    SELECT church_id FROM users WHERE id = auth.uid()
  ));

-- RLS Policies for events
CREATE POLICY "Users can view church events" ON events
  FOR SELECT USING (church_id IN (
    SELECT church_id FROM users WHERE id = auth.uid()
  ));

-- RLS Policies for event_assignments
CREATE POLICY "Users can view assignments" ON event_assignments
  FOR SELECT USING (user_id = auth.uid() OR event_id IN (
    SELECT id FROM events WHERE church_id IN (
      SELECT church_id FROM users WHERE id = auth.uid()
    )
  ));
