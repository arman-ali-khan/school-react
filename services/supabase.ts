
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (process.env as any).SUPABASE_URL || 'https://govnpshiusxsjfysklzg.supabase.co';
const supabaseAnonKey = (process.env as any).SUPABASE_ANON_KEY || 'sb_publishable_yNXwrDN3HIyQNBnRBrYtSw_DrqslQvQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
