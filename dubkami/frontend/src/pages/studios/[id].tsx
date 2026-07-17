import React, { useCallback, useEffect, useState } from 'react';
import type { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import ProjectList from '@/components/ProjectList';
import TeamManagement from '@/components/TeamManagement';
import BillingOverview from '@/components/BillingOverview';
import api from '@/lib/api';

type Tab = 'projects' | 'team' | 'billing';

interface Studio {
  id: string;
  name: string;
  plan: string;
  owner_id: string;
  member_count: number;
  created_at: string;
}

interface Member {
  id: string;
  email: string;
  role: string;
  pending: boolean;
  created_at: string;
}

interface Job {
  id: string;
  original_filename: string;
  status: string;
  source_language: string;
  target_languages: string[];
  progress: number;
  created_at: string;
}

interface Billing {
  plan: string;
  usage_seconds_month: number;
  limit_seconds_month: number;
  max_members: number;
  member_count: number;
}

export default function StudioPage() {
  const router = useRouter();
  const { id } = router.query as { id: string };
  const { t } = useTranslation('common');

  const [activeTab, setActiveTab] = useState<Tab>('projects');
  const [studio, setStudio] = useState<Studio | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [billing, setBilling] = useState<Billing | null>(null);
  const [loading, setLoading] = useState(true);
  const [renaming, setRenaming] = useState(false);
  const [newName, setNewName] = useState('');
  const [renameError, setRenameError] = useState<string | null>(null);

  const currentUserId = typeof window !== 'undefined' ? localStorage.getItem('dubkami_user_id') : null;

  const fetchAll = useCallback(async () => {
    if (!id) return;
    try {
      const [studioRes, membersRes, jobsRes, billingRes] = await Promise.all([
        api.get(`/api/studios/${id}`),
        api.get(`/api/studios/${id}/members`),
        api.get(`/api/studios/${id}/jobs`),
        api.get(`/api/studios/${id}/billing`),
      ]);
      setStudio(studioRes.data);
      setMembers(membersRes.data);
      setJobs(jobsRes.data);
      setBilling(billingRes.data);
      setNewName(studioRes.data.name);
    } catch {
      // silently ignore – user may not be authenticated
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const isOwner = !!studio && studio.owner_id === currentUserId;
  const isAdmin = isOwner || members.some((m) => m.user_id === currentUserId && m.role === 'admin');

  const handleRename = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setRenameError(null);
    try {
      const { data } = await api.put(`/api/studios/${id}`, { name: newName.trim() });
      setStudio(data);
      setRenaming(false);
    } catch (err: any) {
      setRenameError(err?.response?.data?.detail ?? t('form.error'));
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Delete "${studio?.name}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/api/studios/${id}`);
      router.push('/studios');
    } catch {
      // ignore
    }
  };

  const TABS: Tab[] = ['projects', 'team', 'billing'];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-400">
        Loading…
      </div>
    );
  }

  if (!studio) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Studio not found.</p>
          <Link href="/studios" className="text-brand-500 hover:underline">← Back to Studios</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <Link href="/studios" className="text-brand-500 text-sm hover:underline">
              ← {t('studios.title')}
            </Link>
            {renaming ? (
              <form onSubmit={handleRename} className="flex items-center gap-2 mt-1">
                <input
                  autoFocus
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="text-2xl font-bold text-gray-800 border-b-2 border-brand-500 bg-transparent focus:outline-none"
                />
                <button type="submit" className="text-xs text-brand-600 font-semibold hover:underline">
                  {t('studios.save')}
                </button>
                <button
                  type="button"
                  onClick={() => { setRenaming(false); setNewName(studio.name); setRenameError(null); }}
                  className="text-xs text-gray-400 hover:underline"
                >
                  {t('studios.cancel')}
                </button>
              </form>
            ) : (
              <h1 className="text-2xl font-bold text-gray-800 mt-1">{studio.name}</h1>
            )}
            {renameError && <p className="text-red-500 text-xs mt-1">{renameError}</p>}
          </div>
          {isAdmin && !renaming && (
            <div className="flex gap-2">
              <button
                onClick={() => setRenaming(true)}
                className="text-xs text-gray-500 hover:text-brand-600 px-3 py-1.5 rounded-lg hover:bg-brand-50 transition-colors"
              >
                {t('studios.rename')}
              </button>
              {isOwner && (
                <button
                  onClick={handleDelete}
                  className="text-xs text-red-500 hover:text-red-700 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
                >
                  {t('studios.delete')}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Tab bar */}
        <div className="flex gap-1 bg-white rounded-2xl p-1 shadow-sm">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 text-sm font-semibold rounded-xl transition-colors ${
                activeTab === tab
                  ? 'bg-brand-500 text-white'
                  : 'text-gray-500 hover:text-brand-600 hover:bg-brand-50'
              }`}
            >
              {t(`studios.tabs.${tab}`)}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          {activeTab === 'projects' && (
            <ProjectList jobs={jobs} studioId={studio.id} />
          )}
          {activeTab === 'team' && (
            <TeamManagement
              studioId={studio.id}
              members={members}
              isAdmin={isAdmin}
              onUpdate={fetchAll}
            />
          )}
          {activeTab === 'billing' && billing && (
            <BillingOverview
              studioId={studio.id}
              billing={billing}
              isOwner={isOwner}
              onUpdate={fetchAll}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'en', ['common'])),
  },
});
