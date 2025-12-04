import { createClient } from '@supabase/supabase-js';
import { logger } from './logger';

let supabaseClient: any = null;

function getSupabaseClient() {
  if (!supabaseClient) {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      throw new Error(
        'Missing Supabase credentials. Check SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env'
      );
    }

    supabaseClient = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }
  return supabaseClient;
}

// Cliente Supabase com service_role (para operações no backend)
export const supabase = new Proxy(
  {},
  {
    get: (target, prop) => {
      return getSupabaseClient()[prop];
    },
  }
) as any;

// Testar conexão
export async function testSupabaseConnection(): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('churches')
      .select('id')
      .limit(1);

    if (error) {
      logger.error('Supabase connection error:', error);
      return false;
    }

    logger.info('✅ Supabase connection successful');
    return true;
  } catch (err) {
    logger.error('Failed to test Supabase connection:', err);
    return false;
  }
}

export type SupabaseClient = typeof supabase;
