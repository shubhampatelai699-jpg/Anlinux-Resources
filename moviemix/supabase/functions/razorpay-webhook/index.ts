import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.43.0';
import { hmac } from 'https://deno.land/x/hmac@v2.0.1/mod.ts';

serve(async (req) => {
  const secret = Deno.env.get('RAZORPAY_WEBHOOK_SECRET')!;
  const body = await req.text();
  const signature = req.headers.get('x-razorpay-signature');
  const expected = hmac('sha256', secret, body, 'utf8', 'hex');
  if (signature !== expected) return new Response('Invalid signature', { status: 400 });

  const event = JSON.parse(body);
  const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);

  if (event.event === 'subscription.activated' || event.event === 'subscription.charged') {
    const sub = event.payload.subscription.entity;
    const profileId = sub.notes?.profile_id;
    if (!profileId) return new Response('Missing profile_id', { status: 400 });

    const subscriptionStatus = sub.status === 'active' ? 'active' : 'cancelled';
    const profileStatus = subscriptionStatus === 'active' ? 'active' : 'inactive';

    await supabase.from('subscriptions').upsert({
      profile_id: profileId,
      provider: 'razorpay',
      provider_subscription_id: sub.id,
      status: subscriptionStatus,
      current_period_end: new Date(sub.current_end * 1000).toISOString(),
    }, { onConflict: 'provider_subscription_id' });

    await supabase.from('profiles').update({ subscription_status: profileStatus }).eq('id', profileId);
  }

  if (event.event === 'subscription.cancelled' || event.event === 'subscription.halted') {
    const sub = event.payload.subscription.entity;
    const profileId = sub.notes?.profile_id;
    if (!profileId) return new Response('Missing profile_id', { status: 400 });

    await supabase.from('subscriptions').update({ status: 'cancelled' }).eq('provider_subscription_id', sub.id);
    await supabase.from('profiles').update({ subscription_status: 'inactive' }).eq('id', profileId);
  }

  return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json' } });
});
