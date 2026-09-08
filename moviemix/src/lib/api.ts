import { supabase } from './supabase';

export async function fetchRail(key: string) {
  const { data, error } = await supabase
    .from('contents')
    .select('id,title,poster_url,release_date,vote_average')
    .eq('published', true)
    .limit(20);
  if (error) throw error;
  return data ?? [];
}

export async function fetchContent(id: string) {
  const { data, error } = await supabase.from('contents').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
}

export async function getSignedPlaybackUrl(contentId: string) {
  const { data, error } = await supabase.functions.invoke('signed-playback', { body: { contentId } });
  if (error) throw error;
  return data as { url: string; expiration: number };
}

export async function upsertWatchlist(contentId: string, watched = false) {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error('Unauthorized');
  const { error } = await supabase.from('watchlists').upsert(
    { profile_id: userData.user.id, content_id: contentId, watched },
    { onConflict: 'profile_id,content_id' }
  );
  if (error) throw error;
}
