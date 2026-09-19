import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.43.0';

serve(async (req) => {
  const { q } = await req.json();
  if (!q || q.length < 2) return new Response(JSON.stringify([]), { headers: { 'Content-Type': 'application/json' } });

  const authHeader = req.headers.get('Authorization')!;
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,
    { global: { headers: { Authorization: authHeader } } }
  );

  const { data, error } = await supabase.rpc('search_movies_series_people', { query_text: q });
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });

  return new Response(JSON.stringify(data ?? []), { headers: { 'Content-Type': 'application/json' } });
});
