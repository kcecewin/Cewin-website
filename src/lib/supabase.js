import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL?.trim();
const publicKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

// VITE_ variables are visible in the browser. Use only a public/anon key.
let supabase = null;
let configurationError = '';

if (!url || !publicKey) {
  configurationError = 'Authentication is not configured. Add the Supabase URL and public key to .env, then restart npm run dev.';
} else {
  try {
    // Catch accidentally pasted secret keys before creating a client.
    let role;
    if (publicKey.startsWith('eyJ')) {
      const payload = publicKey.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      role = JSON.parse(atob(payload)).role;
    }
    if (publicKey.startsWith('sb_secret_') || role === 'service_role') {
      throw new Error('Use a public/anon key, never a secret or service-role key.');
    }
    supabase = createClient(url, publicKey);
  } catch {
    configurationError = 'Invalid Supabase configuration. Check the project URL and public/anon key in .env. Never use a service-role or secret key.';
  }
}

export { supabase, configurationError };
