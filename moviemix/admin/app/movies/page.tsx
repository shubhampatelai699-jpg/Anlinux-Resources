'use client';

import { useEffect, useState } from 'react';

export default function MoviesPage() {
  const [movies, setMovies] = useState<any[]>([]);
  const [form, setForm] = useState({ title: '', status: 'draft', featured: false });

  async function load() {
    const res = await fetch('/api/admin/movies');
    if (res.ok) setMovies(await res.json());
  }

  async function create(e: React.FormEvent) {
    e.preventDefault();
    await fetch('/api/admin/movies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setForm({ title: '', status: 'draft', featured: false });
    load();
  }

  async function updateStatus(id: string, status: string) {
    await fetch(`/api/admin/movies/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) });
    load();
  }

  useEffect(() => { load(); }, []);

  return (
    <main className="p-8">
      <h1 className="mb-6 text-3xl font-bold">Movies</h1>
      <form onSubmit={create} className="mb-6 flex gap-2">
        <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Title" className="rounded bg-surface p-2" />
        <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="rounded bg-surface p-2">
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
        <button type="submit" className="rounded bg-primary px-4 py-2">Add</button>
      </form>
      <table className="w-full border-collapse border border-border">
        <thead className="bg-surface">
          <tr><th className="border border-border p-3 text-left">Title</th><th className="border border-border p-3 text-left">Status</th><th className="border border-border p-3 text-left">Actions</th></tr>
        </thead>
        <tbody>
          {movies.map((m) => (
            <tr key={m.id}>
              <td className="border border-border p-3">{m.title}</td>
              <td className="border border-border p-3">{m.status}</td>
              <td className="border border-border p-3">
                <button onClick={() => updateStatus(m.id, m.status === 'published' ? 'draft' : 'published')} className="mr-2 rounded bg-primary px-3 py-1 text-sm">{m.status === 'published' ? 'Unpublish' : 'Publish'}</button>
                <button onClick={() => updateStatus(m.id, 'archived')} className="rounded border border-border px-3 py-1 text-sm">Archive</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
