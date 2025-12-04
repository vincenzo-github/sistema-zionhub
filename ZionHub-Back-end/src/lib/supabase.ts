import { createClient } from '@supabase/supabase-js';
import { logger } from '../utils/logger';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error('Missing Supabase configuration');
}

export const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

export async function testConnection() {
  try {
    const { data, error } = await supabase
      .from('churches')
      .select('*')
      .limit(1);

    if (error) {
      logger.error('Database connection error:', error);
      return false;
    }

    logger.info('Database connection successful');
    return true;
  } catch (err) {
    logger.error('Failed to test database connection:', err);
    return false;
  }
}
