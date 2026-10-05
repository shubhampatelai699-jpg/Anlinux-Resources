'use client';

import { useEffect, useState } from 'react';

export default function GenresPage() {
  const [genres, setGenres] = useState<any[]>([]);
  const [form, setForm] = useState({ name: '', slug: '' });

  async function load() {
    const res = await fetch('/api/admin/genres');
    if (res.ok) setGenres(await res.json());
  }

  async function create(e: React.FormEvent) {
    e.preventDefault();
    await fetch('/api/admin/genres', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    setForm({ name: '', slug: '' });
    load();
  }

  useEffect(() => { load(); }, []);

  return (
    <main className="p-8">
      <h1 className="mb-6 text-3xl font-bold">Genres</h1>
      <form onSubmit={create} className="mb-6 flex gap-2">
        <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })} placeholder="Name" className="rounded bg-surface p-2" />
        <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="Slug" className="rounded bg-surface p-2" />
        <button type="submit" className="rounded bg-primary px-4 py-2">Add</button>
      </form>
      <ul className="space-y-2">
        {genres.map((g) => (
          <li key={g.id} className="rounded border border-border bg-surface p-3">{g.name} <span className="text-gray-400">({g.slug})</span></li>
        ))}
      </ul>
    </main>
  );
}
