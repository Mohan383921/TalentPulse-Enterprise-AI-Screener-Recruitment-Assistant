import { createClient, SupabaseClient } from '@supabase/supabase-js';

export const DEFAULT_SUPABASE_URL = 'https://lkimcygvkoeqnuobwhac.supabase.co';
export const DEFAULT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxraW1jeWd2a29lcW51b2J3aGFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM1ODMyNjIsImV4cCI6MjA5OTE1OTI2Mn0.yCvb-0ZIB9vclmG4O4_u8kXkiAuCzgbr0XBLiihPvXU';

let cachedClient: SupabaseClient | null = null;
let lastKeyUsed: string | null = null;
let lastUrlUsed: string | null = null;

export const getSupabaseUrl = (): string => {
  const envUrl = import.meta.env?.VITE_SUPABASE_URL;
  const localUrl = typeof window !== 'undefined' ? localStorage.getItem('talentpulse_supabase_url') : null;
  if (localUrl && localUrl !== 'MY_SUPABASE_URL' && localUrl.startsWith('http')) return localUrl;
  if (envUrl && envUrl !== 'MY_SUPABASE_URL' && envUrl.startsWith('http')) return envUrl;
  return DEFAULT_SUPABASE_URL;
};

export const getSupabaseAnonKey = (): string => {
  const envKey = import.meta.env?.VITE_SUPABASE_ANON_KEY;
  const localKey = typeof window !== 'undefined' ? localStorage.getItem('talentpulse_supabase_key') : null;
  
  if (envKey && envKey !== 'MY_SUPABASE_ANON_KEY' && envKey.startsWith('eyJ')) {
    return envKey;
  }
  if (localKey && localKey !== 'MY_SUPABASE_ANON_KEY' && localKey.startsWith('eyJ')) {
    return localKey;
  }
  if (envKey && envKey !== 'MY_SUPABASE_ANON_KEY' && envKey.length > 20) {
    return envKey;
  }
  if (localKey && localKey !== 'MY_SUPABASE_ANON_KEY' && localKey.length > 20 && !localKey.startsWith('sb_publishable_')) {
    return localKey;
  }
  return DEFAULT_SUPABASE_ANON_KEY;
};

export const getSupabaseClient = (url?: string, key?: string): SupabaseClient | null => {
  const targetUrl = url || getSupabaseUrl();
  const targetKey = key || getSupabaseAnonKey();

  if (!targetUrl || !targetKey || targetKey === 'MY_SUPABASE_ANON_KEY' || targetKey.length < 10) {
    return null;
  }

  if (cachedClient && lastUrlUsed === targetUrl && lastKeyUsed === targetKey) {
    return cachedClient;
  }

  try {
    cachedClient = createClient(targetUrl, targetKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
    lastUrlUsed = targetUrl;
    lastKeyUsed = targetKey;
    return cachedClient;
  } catch (e) {
    console.error('Error creating Supabase client:', e);
    return null;
  }
};

export const setSupabaseAnonKey = (newKey: string): SupabaseClient | null => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('talentpulse_supabase_key', newKey.trim());
  }
  cachedClient = null;
  lastKeyUsed = null;
  return getSupabaseClient(getSupabaseUrl(), newKey.trim());
};

export const createCustomSupabaseClient = getSupabaseClient;

export const isSupabaseConfigured = (): boolean => {
  return getSupabaseClient() !== null;
};

// Proxy export so `supabase.auth` or `supabase.from` always uses the latest configured client
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const client = getSupabaseClient();
    if (!client) {
      return undefined;
    }
    const val = (client as any)[prop];
    if (typeof val === 'function') {
      return val.bind(client);
    }
    return val;
  },
});
