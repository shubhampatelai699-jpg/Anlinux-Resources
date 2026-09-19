'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState({ users: 0, movies: 0, series: 0, activeSubs: 0, plays24h: 0, storageUsed: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/stats')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (d) setStats(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  async function signOut() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  }

  return (
    <main className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <button onClick={signOut} className="rounded border border-border px-4 py-2">Sign Out</button>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Object.entries(stats).map(([k, v]) => (
          <div key={k} className="rounded-lg border border-border bg-surface p-6">
            <p className="text-sm text-gray-400">{k}</p>
            <p className="text-2xl font-bold">{loading ? '—' : v}</p>
          </div>
        ))}
      </div>
      <div className="mt-8 flex gap-4">
        <Link href="/movies" className="rounded bg-primary px-4 py-2">Manage Movies</Link>
        <Link href="/series" className="rounded bg-primary px-4 py-2">Manage Series</Link>
        <Link href="/genres" className="rounded bg-primary px-4 py-2">Genres</Link>
        <Link href="/users" className="rounded bg-primary px-4 py-2">Users</Link>
      </div>
    </main>
  );
}
