'use client';

import { useTranslations } from 'next-intl';
import type { StandType } from './types';
import { STAND_OPTIONS_KEYS } from './requirements.config';

type StandTypeSelectorProps = {
  value: StandType;
  disabled?: boolean;
  onChange: (next: StandType) => void;
};

export function StandTypeSelector({ value, onChange, disabled }: StandTypeSelectorProps) {
  const t = useTranslations();

  return (
    <div className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">{t('Requirements.labels.type')}</p>
      <label className="block">
        <span className="sr-only">{t('Requirements.labels.type')}</span>
        <select
          value={value}
          disabled={disabled}
          onChange={(event) => onChange(event.target.value as StandType)}
          className={`w-full rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm font-semibold text-white outline-none transition focus:border-blue-400/60 ${disabled ? 'cursor-not-allowed opacity-60' : ''}`}
        >
          {STAND_OPTIONS_KEYS.map((option) => (
            <option key={option.value} value={option.value}>
              {t(option.translationKey)}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
