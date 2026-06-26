'use client';

import type { StandType } from './types';
import { STAND_OPTIONS } from './requirements.config';

type StandTypeSelectorProps = {
  value: StandType;
  disabled?: boolean;
  onChange: (next: StandType) => void;
};

export function StandTypeSelector({ value, onChange, disabled }: StandTypeSelectorProps) {
  return (
    <div className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">Tipo de stand</p>
      <div className="grid gap-3 md:grid-cols-3">
        {STAND_OPTIONS.map((option) => {
          const active = option.value === value;
          return (
            <button
              key={option.value}
              type="button"
              disabled={disabled}
              onClick={() => onChange(option.value)}
              className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                active
                  ? 'border-blue-500/50 bg-blue-500/15 text-blue-100'
                  : 'border-white/10 bg-slate-900/70 text-slate-300 hover:border-white/30 hover:text-white'
              } ${disabled ? 'cursor-not-allowed opacity-60' : ''}`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
