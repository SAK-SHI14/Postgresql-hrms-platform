import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    alert('CRITICAL ERROR: Missing Supabase URL or Anon Key in .env file!');
    console.error('Missing Supabase URL or Anon Key');
} else {
    // Temporary debug alert (Remove after fixing)
    // alert('Supabase URL loaded: ' + supabaseUrl);
}


export const supabase = createClient(supabaseUrl, supabaseAnonKey)
