import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';
import api from '@/lib/api';

interface Member {
  id: string;
  email: string;
  role: string;
  pending: boolean;
  created_at: string;
}

interface Props {
  studioId: string;
  members: Member[];
  isAdmin: boolean;
  onUpdate: () => void;
}

const ROLES = ['member', 'admin'];

export default function TeamManagement({ studioId, members, isAdmin, onUpdate }: Props) {
  const { t } = useTranslation('common');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('member');
  const [inviting, setInviting] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;
    setInviting(true);
    setInviteError(null);
    try {
      await api.post(`/api/studios/${studioId}/members`, {
        email: inviteEmail,
        role: inviteRole,
      });
      setInviteEmail('');
      onUpdate();
    } catch (err: any) {
      setInviteError(err?.response?.data?.detail ?? t('form.error'));
    } finally {
      setInviting(false);
    }
  };

  const handleRemove = async (memberId: string) => {
    try {
      await api.delete(`/api/studios/${studioId}/members/${memberId}`);
      onUpdate();
    } catch {
      // ignore
    }
  };

  const handleRoleChange = async (memberId: string, role: string) => {
    try {
      await api.patch(`/api/studios/${studioId}/members/${memberId}`, { role });
      onUpdate();
    } catch {
      // ignore
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="font-semibold text-gray-700">{t('studios.team.title')}</h3>

      {/* Member list */}
      <ul className="divide-y divide-gray-100">
        {members.map((m) => (
          <li key={m.id} className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-medium text-gray-800">{m.email}</p>
              <p className="text-xs text-gray-400 mt-0.5">
                {t(`studios.team.roles.${m.role}`)}
                {m.pending && (
                  <span className="ml-2 px-1.5 py-0.5 rounded text-xs bg-yellow-100 text-yellow-700">
                    {t('studios.team.pending')}
                  </span>
                )}
              </p>
            </div>
            {isAdmin && m.role !== 'owner' && (
              <div className="flex items-center gap-2">
                <select
                  value={m.role}
                  onChange={(e) => handleRoleChange(m.id, e.target.value)}
                  className="text-xs border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-brand-500"
                >
                  {ROLES.map((r) => (
                    <option key={r} value={r}>
                      {t(`studios.team.roles.${r}`)}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => handleRemove(m.id)}
                  className="text-xs text-red-500 hover:text-red-700 transition-colors px-2 py-1 rounded hover:bg-red-50"
                >
                  {t('studios.team.remove')}
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>

      {/* Invite form */}
      {isAdmin && (
        <form onSubmit={handleInvite} className="pt-4 border-t border-gray-100 space-y-3">
          <h4 className="text-sm font-semibold text-gray-600">{t('studios.team.invite')}</h4>
          <div className="flex gap-2">
            <input
              type="email"
              required
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder={t('studios.team.inviteEmail')}
              className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value)}
              className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {t(`studios.team.roles.${r}`)}
                </option>
              ))}
            </select>
            <button
              type="submit"
              disabled={inviting}
              className="px-4 py-2 bg-brand-500 hover:bg-brand-700 disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition-colors"
            >
              {t('studios.team.sendInvite')}
            </button>
          </div>
          {inviteError && <p className="text-red-500 text-xs">{inviteError}</p>}
        </form>
      )}
    </div>
  );
}
