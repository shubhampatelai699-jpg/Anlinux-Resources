import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';
import api from '@/lib/api';

interface Billing {
  plan: string;
  usage_seconds_month: number;
  limit_seconds_month: number;
  max_members: number;
  member_count: number;
}

interface Props {
  studioId: string;
  billing: Billing;
  isOwner: boolean;
  onUpdate: () => void;
}

const PLANS = ['free', 'pro', 'enterprise'];

const PLAN_COLORS: Record<string, string> = {
  free: 'bg-gray-100 text-gray-600',
  pro: 'bg-brand-100 text-brand-700',
  enterprise: 'bg-purple-100 text-purple-700',
};

function fmtSeconds(s: number): string {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

export default function BillingOverview({ studioId, billing, isOwner, onUpdate }: Props) {
  const { t } = useTranslation('common');
  const [upgrading, setUpgrading] = useState(false);
  const [upgradeError, setUpgradeError] = useState<string | null>(null);

  const usagePct = Math.min(100, Math.round((billing.usage_seconds_month / billing.limit_seconds_month) * 100));

  const handleUpgrade = async (plan: string) => {
    setUpgrading(true);
    setUpgradeError(null);
    try {
      await api.post(`/api/studios/${studioId}/billing/upgrade?plan=${plan}`);
      onUpdate();
    } catch (err: any) {
      setUpgradeError(err?.response?.data?.detail ?? t('form.error'));
    } finally {
      setUpgrading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="font-semibold text-gray-700">{t('studios.billing.title')}</h3>

      {/* Plan badge */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-500">{t('studios.billing.plan')}</span>
        <span
          className={`px-3 py-1 rounded-full text-sm font-bold capitalize ${
            PLAN_COLORS[billing.plan] ?? 'bg-gray-100 text-gray-600'
          }`}
        >
          {t(`studios.billing.plans.${billing.plan}`)}
        </span>
      </div>

      {/* Usage bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">{t('studios.billing.usage')}</span>
          <span className="text-gray-700 font-medium">
            {fmtSeconds(billing.usage_seconds_month)}{' '}
            <span className="text-gray-400">
              {t('studios.billing.of')} {fmtSeconds(billing.limit_seconds_month)}
            </span>
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className={`h-2.5 rounded-full transition-all ${
              usagePct > 90 ? 'bg-red-500' : usagePct > 70 ? 'bg-yellow-400' : 'bg-brand-500'
            }`}
            style={{ width: `${usagePct}%` }}
          />
        </div>
        <p className="text-xs text-gray-400">{usagePct}% used</p>
      </div>

      {/* Team members */}
      <div className="flex justify-between text-sm">
        <span className="text-gray-500">{t('studios.billing.members')}</span>
        <span className="text-gray-700 font-medium">
          {billing.member_count} / {billing.max_members === 9999 ? '∞' : billing.max_members}
        </span>
      </div>

      {/* Upgrade options (owner only) */}
      {isOwner && (
        <div className="pt-4 border-t border-gray-100 space-y-3">
          <h4 className="text-sm font-semibold text-gray-600">{t('studios.billing.upgrade')}</h4>
          <div className="grid grid-cols-3 gap-3">
            {PLANS.map((plan) => (
              <button
                key={plan}
                onClick={() => handleUpgrade(plan)}
                disabled={upgrading || billing.plan === plan}
                className={`py-3 px-2 rounded-xl border text-sm font-semibold transition-colors ${
                  billing.plan === plan
                    ? 'border-brand-500 bg-brand-50 text-brand-700 cursor-default'
                    : 'border-gray-200 hover:border-brand-500 hover:bg-brand-50 text-gray-600 hover:text-brand-700'
                } disabled:opacity-50`}
              >
                {t(`studios.billing.plans.${plan}`)}
              </button>
            ))}
          </div>
          {upgradeError && <p className="text-red-500 text-xs">{upgradeError}</p>}
        </div>
      )}
    </div>
  );
}
