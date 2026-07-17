import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';
import api from '@/lib/api';
import { LANGUAGES } from '@/lib/constants';

interface Speaker {
  id: string;
  label: string;
  display_name: string | null;
  voice_id: string | null;
  confirmed: boolean;
}

interface Props {
  jobId: string;
  speakers: Speaker[];
  onConfirmed: () => void;
}

// A small preset of ElevenLabs-style voice IDs for selection
const PRESET_VOICES = [
  { id: 'rachel', name: 'Rachel (Female, EN)' },
  { id: 'josh', name: 'Josh (Male, EN)' },
  { id: 'bella', name: 'Bella (Female, EN)' },
  { id: 'adam', name: 'Adam (Male, EN)' },
  { id: 'elli', name: 'Elli (Female, EN)' },
  { id: 'sam', name: 'Sam (Male, EN)' },
];

export default function SpeakerConfirmation({ jobId, speakers, onConfirmed }: Props) {
  const { t } = useTranslation('common');
  const [local, setLocal] = useState<Speaker[]>(speakers);
  const [saving, setSaving] = useState(false);

  const update = (id: string, field: keyof Speaker, val: string) => {
    setLocal((prev) => prev.map((s) => (s.id === id ? { ...s, [field]: val } : s)));
  };

  const handleConfirmAll = async () => {
    setSaving(true);
    try {
      await Promise.all(
        local.map((s) =>
          api.patch(`/api/speakers/${s.id}`, {
            display_name: s.display_name,
            voice_id: s.voice_id,
          })
        )
      );
      await api.post(`/api/speakers/job/${jobId}/confirm-all`);
      onConfirmed();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-800">{t('speakers.title')}</h2>
      <p className="text-sm text-gray-500">{t('speakers.description')}</p>
      <div className="space-y-3">
        {local.map((s) => (
          <div key={s.id} className="flex flex-col sm:flex-row gap-3 p-4 border border-gray-200 rounded-xl">
            <div className="flex-1">
              <label className="text-xs text-gray-400">{t('speakers.label')}</label>
              <p className="font-mono text-sm text-gray-700">{s.label}</p>
            </div>
            <div className="flex-1">
              <label className="text-xs text-gray-400">{t('speakers.displayName')}</label>
              <input
                className="mt-1 w-full border border-gray-300 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                value={s.display_name ?? ''}
                placeholder={s.label}
                onChange={(e) => update(s.id, 'display_name', e.target.value)}
              />
            </div>
            <div className="flex-1">
              <label className="text-xs text-gray-400">{t('speakers.voice')}</label>
              <select
                className="mt-1 w-full border border-gray-300 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                value={s.voice_id ?? ''}
                onChange={(e) => update(s.id, 'voice_id', e.target.value)}
              >
                <option value="">{t('speakers.autoSelect')}</option>
                {PRESET_VOICES.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={handleConfirmAll}
        disabled={saving}
        className="w-full sm:w-auto px-6 py-2 bg-brand-500 text-white font-semibold rounded-xl hover:bg-brand-700 disabled:opacity-50 transition-colors"
      >
        {saving ? t('speakers.saving') : t('speakers.confirmAll')}
      </button>
    </div>
  );
}
