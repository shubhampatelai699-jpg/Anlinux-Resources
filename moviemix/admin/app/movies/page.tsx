import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase';

export default async function MoviesPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: movies } = await supabase
    .from('contents')
    .select('id,title,type,published,archived,created_at')
    .eq('type', 'movie')
    .order('created_at', { ascending: false });

  return (
    <main className="p-8">
      <h1 className="mb-6 text-3xl font-bold">Movies</h1>
      <table className="w-full border-collapse border border-border">
        <thead className="bg-surface">
          <tr>
            <th className="border border-border p-3 text-left">Title</th>
            <th className="border border-border p-3 text-left">Status</th>
            <th className="border border-border p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {(movies ?? []).map((m) => (
            <tr key={m.id}>
              <td className="border border-border p-3">{m.title}</td>
              <td className="border border-border p-3">
                {m.archived ? 'Archived' : m.published ? 'Published' : 'Draft'}
              </td>
              <td className="border border-border p-3">
                <button className="mr-2 rounded bg-primary px-3 py-1 text-sm">{m.published ? 'Unpublish' : 'Publish'}</button>
                <button className="rounded border border-border px-3 py-1 text-sm">{m.archived ? 'Restore' : 'Archive'}</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
