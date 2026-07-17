import React, { useEffect, useState } from 'react';
import type { GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import api from '@/lib/api';

interface Studio {
  id: string;
  name: string;
  plan: string;
  owner_id: string;
  member_count: number;
  created_at: string;
}

const PLAN_COLORS: Record<string, string> = {
  free: 'bg-gray-100 text-gray-500',
  pro: 'bg-brand-100 text-brand-700',
  enterprise: 'bg-purple-100 text-purple-700',
};

export default function StudiosPage() {
  const { t } = useTranslation('common');
  const router = useRouter();
  const [studios, setStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const fetchStudios = async () => {
    try {
      const { data } = await api.get('/api/studios/');
      setStudios(data);
    } catch {
      // handle auth redirect
      if (typeof window !== 'undefined' && !localStorage.getItem('dubkami_token')) {
        router.push('/');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudios();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setCreating(true);
    setCreateError(null);
    try {
      const { data } = await api.post('/api/studios/', { name: newName.trim() });
      setShowCreate(false);
      setNewName('');
      router.push(`/studios/${data.id}`);
    } catch (err: any) {
      setCreateError(err?.response?.data?.detail ?? t('form.error'));
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4">
      <header className="mb-10 text-center w-full max-w-3xl">
        <div className="flex items-center justify-between">
          <div>
            <Link href="/" className="text-brand-500 text-sm hover:underline">← Dubkami</Link>
            <h1 className="text-3xl font-bold text-brand-700 mt-1">{t('studios.title')}</h1>
            <p className="text-gray-400 mt-1">{t('studios.tagline')}</p>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="px-5 py-2.5 bg-brand-500 hover:bg-brand-700 text-white font-semibold rounded-xl transition-colors text-sm"
          >
            + {t('studios.newStudio')}
          </button>
        </div>
      </header>

      <main className="w-full max-w-3xl space-y-4">
        {/* Create studio modal */}
        {showCreate && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4">
              <h2 className="text-xl font-bold text-gray-800 mb-4">{t('studios.newStudio')}</h2>
              <form onSubmit={handleCreate} className="space-y-4">
                <input
                  type="text"
                  required
                  autoFocus
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder={t('studios.studioName')}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
                {createError && <p className="text-red-500 text-sm">{createError}</p>}
                <div className="flex gap-3 justify-end">
                  <button
                    type="button"
                    onClick={() => { setShowCreate(false); setCreateError(null); }}
                    className="px-4 py-2 text-gray-500 hover:text-gray-700 text-sm"
                  >
                    {t('studios.cancel')}
                  </button>
                  <button
                    type="submit"
                    disabled={creating}
                    className="px-5 py-2 bg-brand-500 hover:bg-brand-700 disabled:opacity-50 text-white font-semibold rounded-xl text-sm transition-colors"
                  >
                    {t('studios.create')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-16 text-gray-400">Loading…</div>
        ) : studios.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl shadow-sm">
            <p className="text-gray-500 font-medium mb-2">{t('studios.noStudios')}</p>
            <p className="text-gray-400 text-sm mb-6">{t('studios.createFirst')}</p>
            <button
              onClick={() => setShowCreate(true)}
              className="px-6 py-2.5 bg-brand-500 hover:bg-brand-700 text-white font-semibold rounded-xl transition-colors"
            >
              + {t('studios.newStudio')}
            </button>
          </div>
        ) : (
          studios.map((studio) => (
            <Link
              key={studio.id}
              href={`/studios/${studio.id}`}
              className="block bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">{studio.name}</h2>
                  <p className="text-xs text-gray-400 mt-1">
                    {studio.member_count} member{studio.member_count !== 1 ? 's' : ''} ·{' '}
                    Created {new Date(studio.created_at).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${
                    PLAN_COLORS[studio.plan] ?? 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {t(`studios.billing.plans.${studio.plan}`)}
                </span>
              </div>
            </Link>
          ))
        )}
      </main>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'en', ['common'])),
  },
});
