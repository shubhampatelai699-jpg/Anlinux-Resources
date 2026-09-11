import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase';

export default async function DashboardPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const stats = [
    { label: 'Total Users', value: '—' },
    { label: 'Active Subscriptions', value: '—' },
    { label: 'Total Contents', value: '—' },
    { label: '24h Plays', value: '—' },
    { label: 'Pending Reviews', value: '—' },
    { label: 'Storage Used', value: '—' },
  ];

  return (
    <main className="p-8">
      <h1 className="mb-6 text-3xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-lg border border-border bg-surface p-6">
            <p className="text-sm text-gray-400">{s.label}</p>
            <p className="text-2xl font-bold">{s.value}</p>
          </div>
        ))}
      </div>
      <div className="mt-8 flex gap-4">
        <a href="/movies" className="rounded bg-primary px-4 py-2">Manage Movies</a>
        <button className="rounded border border-border px-4 py-2">Run Trending Recompute</button>
      </div>
    </main>
  );
}
