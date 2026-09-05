import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ibvpqdutgnscklnukwpu.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_FrBPQhsceLIfd-jcKleKQw_ew3XeRiP';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
