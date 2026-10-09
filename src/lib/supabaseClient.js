import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// Only the public "anon" key is used here. It is safe in the browser because
// Row Level Security (see supabase/schema.sql) decides what each user can read or write.
// Never put any secret/admin key in this project.
export const supabase = isSupabaseConfigured ? createClient(supabaseUrl, supabaseAnonKey) : null;
