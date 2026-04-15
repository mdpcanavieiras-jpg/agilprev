import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string || 'https://xfznmbkzgysdgqiboghr.supabase.co';
const SUPABASE_ANON = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON);

export async function getPaymentStatus(sessionId: string): Promise<string> {
  const { data } = await supabase
    .from('agil_payments')
    .select('status')
    .eq('session_id', sessionId)
    .single();
  return data?.status || 'not_found';
}
