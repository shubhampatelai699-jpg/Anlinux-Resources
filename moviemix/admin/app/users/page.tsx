'use client';

import { useEffect, useState } from 'react';

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);

  async function load() {
    const res = await fetch('/api/admin/users');
    if (res.ok) setUsers(await res.json());
  }

  async function toggleRole(id: string, role: string) {
    await fetch(`/api/admin/users/${id}/role`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ role }) });
    load();
  }

  useEffect(() => { load(); }, []);

  return (
    <main className="p-8">
      <h1 className="mb-6 text-3xl font-bold">Users</h1>
      <table className="w-full border-collapse border border-border">
        <thead className="bg-surface"><tr><th className="border border-border p-3 text-left">Email</th><th className="border border-border p-3 text-left">Role</th><th className="border border-border p-3 text-left">Actions</th></tr></thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td className="border border-border p-3">{u.email}</td>
              <td className="border border-border p-3">{u.role}</td>
              <td className="border border-border p-3">
                <button onClick={() => toggleRole(u.id, u.role === 'admin' ? 'user' : 'admin')} className="rounded bg-primary px-3 py-1 text-sm">{u.role === 'admin' ? 'Demote' : 'Promote'}</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
