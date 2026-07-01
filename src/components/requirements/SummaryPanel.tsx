'use client';

import { useTranslations } from 'next-intl';
import { generalStatusLabel } from './requirements.utils';
import type { GeneralStatus } from './types';

type SummaryPanelProps = {
  requiredLoaded: number;
  requiredTotal: number;
  requiredPending: number;
  optionalLoaded: number;
  progress: number;
  generalStatus: GeneralStatus;
  canSubmit: boolean;
  deadlineLabel: string;
  showActions?: boolean;
  onSaveDraft: () => void;
  onSubmit: () => void;
};

export function SummaryPanel({
  requiredLoaded,
  requiredTotal,
  requiredPending,
  optionalLoaded,
  progress,
  generalStatus,
  canSubmit,
  deadlineLabel,
  showActions = true,
  onSaveDraft,
  onSubmit
}: SummaryPanelProps) {
  const t = useTranslations();

  return (
    <section className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-5">
      <h3 className="text-lg font-semibold text-white">{t('Requirements.titles.summary')}</h3>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-white/10 bg-slate-900/70 p-3 text-sm text-slate-200">
          <p className="text-slate-400">{t('Requirements.labels.required_loaded')}</p>
          <p className="text-lg font-semibold text-white">{requiredLoaded}/{requiredTotal}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-slate-900/70 p-3 text-sm text-slate-200">
          <p className="text-slate-400">{t('Requirements.labels.required_pending')}</p>
          <p className="text-lg font-semibold text-white">{requiredPending}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-slate-900/70 p-3 text-sm text-slate-200">
          <p className="text-slate-400">{t('Requirements.labels.optional_loaded')}</p>
          <p className="text-lg font-semibold text-white">{optionalLoaded}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-slate-900/70 p-3 text-sm text-slate-200">
          <p className="text-slate-400">{t('Requirements.labels.general_status')}</p>
          <p className="text-sm font-semibold text-white">{t(generalStatusLabel(generalStatus))}</p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-300">
          <span>{t('Requirements.labels.progress')}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 w-full rounded-full bg-slate-800">
          <div className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-emerald-400" style={{ width: `${Math.min(progress, 100)}%` }} />
        </div>
      </div>

      {showActions && (
        <div className="flex flex-wrap justify-end gap-3 pt-1">
          <button
            type="button"
            onClick={onSaveDraft}
            className="rounded-xl border border-white/15 px-4 py-2 text-sm font-semibold text-slate-200 hover:border-white/30"
          >
            {t('Requirements.buttons.save_draft')}
          </button>
          <button
            type="button"
            disabled={!canSubmit}
            onClick={onSubmit}
            className={`rounded-xl px-4 py-2 text-sm font-semibold ${
              canSubmit
                ? 'border border-blue-500/40 bg-blue-600/20 text-blue-100 hover:bg-blue-600/30'
                : 'cursor-not-allowed border border-slate-700 bg-slate-800 text-slate-500'
            }`}
          >
            {t('Requirements.buttons.send_documents')}
          </button>
        </div>
      )}
    </section>
  );
}
