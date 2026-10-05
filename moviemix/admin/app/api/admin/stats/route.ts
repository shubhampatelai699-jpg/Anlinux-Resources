import { createClient } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.app_metadata?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { count: users } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
  const { count: movies } = await supabase.from('movies').select('*', { count: 'exact', head: true });
  const { count: series } = await supabase.from('series').select('*', { count: 'exact', head: true });
  const { count: activeSubs } = await supabase.from('subscriptions').select('*', { count: 'exact', head: true }).eq('status', 'active');

  return NextResponse.json({ users: users ?? 0, movies: movies ?? 0, series: series ?? 0, activeSubs: activeSubs ?? 0, plays24h: 0, storageUsed: 0 });
}
