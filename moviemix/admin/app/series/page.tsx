'use client';

import { useEffect, useState } from 'react';

export default function SeriesPage() {
  const [series, setSeries] = useState<any[]>([]);
  const [form, setForm] = useState({ title: '', status: 'draft', featured: false });

  async function load() {
    const res = await fetch('/api/admin/series');
    if (res.ok) setSeries(await res.json());
  }

  async function create(e: React.FormEvent) {
    e.preventDefault();
    await fetch('/api/admin/series', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    setForm({ title: '', status: 'draft', featured: false });
    load();
  }

  async function updateStatus(id: string, status: string) {
    await fetch(`/api/admin/series/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) });
    load();
  }

  useEffect(() => { load(); }, []);

  return (
    <main className="p-8">
      <h1 className="mb-6 text-3xl font-bold">Series</h1>
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
        <thead className="bg-surface"><tr><th className="border border-border p-3 text-left">Title</th><th className="border border-border p-3 text-left">Status</th><th className="border border-border p-3 text-left">Actions</th></tr></thead>
        <tbody>
          {series.map((s) => (
            <tr key={s.id}>
              <td className="border border-border p-3">{s.title}</td>
              <td className="border border-border p-3">{s.status}</td>
              <td className="border border-border p-3">
                <button onClick={() => updateStatus(s.id, s.status === 'published' ? 'draft' : 'published')} className="mr-2 rounded bg-primary px-3 py-1 text-sm">{s.status === 'published' ? 'Unpublish' : 'Publish'}</button>
                <button onClick={() => updateStatus(s.id, 'archived')} className="rounded border border-border px-3 py-1 text-sm">Archive</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
