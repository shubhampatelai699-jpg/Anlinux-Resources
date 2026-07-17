import React from 'react';
import { useTranslation } from 'next-i18next';
import { LANGUAGES } from '@/lib/constants';

interface SingleProps {
  value: string;
  onChange: (code: string) => void;
  label: string;
}

export function SourceLanguageSelector({ value, onChange, label }: SingleProps) {
  const { t } = useTranslation('common');
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
      >
        <option value="">{t('language.select')}</option>
        {LANGUAGES.map((l) => (
          <option key={l.code} value={l.code}>
            {l.nativeName} ({l.name})
          </option>
        ))}
      </select>
    </div>
  );
}

interface MultiProps {
  value: string[];
  onChange: (codes: string[]) => void;
  label: string;
  exclude?: string;
}

export function TargetLanguageSelector({ value, onChange, label, exclude }: MultiProps) {
  const { t } = useTranslation('common');

  const toggle = (code: string) => {
    if (value.includes(code)) {
      onChange(value.filter((c) => c !== code));
    } else {
      onChange([...value, code]);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3">
        {LANGUAGES.filter((l) => l.code !== exclude).map((l) => {
          const selected = value.includes(l.code);
          return (
            <button
              key={l.code}
              type="button"
              onClick={() => toggle(l.code)}
              className={[
                'px-3 py-1 rounded-full text-sm font-medium border transition-colors',
                selected
                  ? 'bg-brand-500 text-white border-brand-500'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-brand-500',
              ].join(' ')}
            >
              {l.nativeName}
            </button>
          );
        })}
      </div>
      {value.length > 0 && (
        <p className="text-xs text-gray-400">
          {value.length} {t('language.selected')}
        </p>
      )}
    </div>
  );
}
