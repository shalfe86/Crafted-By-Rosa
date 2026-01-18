import { createClient } from '@supabase/supabase-js';

// Default values provided to ensure connection works even if env vars are missing in deployment
const DEFAULT_SUPABASE_URL = "https://yghlvikbveuobqksbhqo.supabase.co";
const DEFAULT_SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlnaGx2aWtidmV1b2Jxa3NiaHFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg3NTU5MDcsImV4cCI6MjA4NDMzMTkwN30.dT6-B7PFES6Zc5A_l0TyZKDhKebaOzzlx_CBer2xvO0";

let supabaseUrl = DEFAULT_SUPABASE_URL;
let supabaseAnonKey = DEFAULT_SUPABASE_KEY;

try {
  // Safely check if import.meta.env exists before accessing properties
  // @ts-ignore
  if (import.meta && import.meta.env) {
    // @ts-ignore
    const env = import.meta.env;
    if (env.VITE_SUPABASE_URL) {
      supabaseUrl = env.VITE_SUPABASE_URL;
    }
    if (env.VITE_SUPABASE_ANON_KEY) {
      supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY;
    }
  }
} catch (e) {
  console.warn("Environment variables not accessible, using defaults.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
