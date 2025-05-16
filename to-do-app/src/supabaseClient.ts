import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Add an event listener to handle authentication state changes
supabase.auth.onAuthStateChange((_, session) => {
  if (session) {
    // Store session in local storage
    localStorage.setItem('supabase.auth.token', JSON.stringify(session));
  } else {
    // Remove session from local storage
    localStorage.removeItem('supabase.auth.token');
  }
}); 