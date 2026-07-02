'use client';

import { useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { RequirementsWorkspace } from './RequirementsWorkspace';
import type { GeneralStatus, StandType } from './types';
import { useToaster } from '@/context/ToasterContext';

type AdminDocumentReviewProps = {
  adminName: string;
};

type ExhibitorItem = {
  id: number;
  name: string;
  company: string;
  standType: StandType;
  event: string;
  generalStatus: GeneralStatus;
  requiredPending: number;
  optionalPending: number;
  requiredLoaded: number;
  requiredTotal: number;
  optionalLoaded: number;
  optionalTotal: number;
  progress: number;
  mountingLetterSent: boolean;
};

type ReviewBucket = 'mountingLetter' | 'authorized' | 'pendingRequired' | 'pendingOptional';

export function AdminDocumentReview({ adminName }: AdminDocumentReviewProps) {
  const t = useTranslations();
  const { notify } = useToaster();
  const [exhibitors, setExhibitors] = useState<ExhibitorItem[]>([]);
  const [selectedId, setSelectedId] = useState<number>(0);

  const selected = exhibitors.find((item) => item.id === selectedId) || exhibitors[0];

  const sections = useMemo(() => {
    const grouped: Record<ReviewBucket, ExhibitorItem[]> = {
      mountingLetter: [],
      authorized: [],
      pendingRequired: [],
      pendingOptional: []
    };

    exhibitors.forEach((item) => {
      if (item.mountingLetterSent) {
        grouped.mountingLetter.push(item);
      } else if (item.generalStatus === 'authorized') {
        grouped.authorized.push(item);
      } else if (item.requiredPending > 0) {
        grouped.pendingRequired.push(item);
      } else if (item.optionalPending > 0) {
        grouped.pendingOptional.push(item);
      } else {
        grouped.authorized.push(item);
      }
    });

    return grouped;
  }, [exhibitors]);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const response = await fetch('/api/requirements/exhibitors', { cache: 'no-store' });
        const payload = await response.json();
        if (!response.ok || !payload?.success) {
          throw new Error(payload?.message || t('Requirements.errors.cannot_load_list'));
        }

        if (!mounted) return;

        const items: ExhibitorItem[] = (payload.data || []).map((item: any) => ({
          id: Number(item.id),
          name: String(item.name || ''),
          company: String(item.company || ''),
          standType: (item.standType || 'free_space') as StandType,
          event: String(item.event || ''),
          generalStatus: String(item.generalStatus || 'incomplete') as GeneralStatus,
          requiredPending: Number(item.requiredPending || 0),
          optionalPending: Number(item.optionalPending || 0),
          requiredLoaded: Number(item.requiredLoaded || 0),
          requiredTotal: Number(item.requiredTotal || 0),
          optionalLoaded: Number(item.optionalLoaded || 0),
          optionalTotal: Number(item.optionalTotal || 0),
          progress: Number(item.progress || 0),
          mountingLetterSent: Boolean(item.mountingLetterSent)
        }));
        setExhibitors(items);
        if (items.length > 0) {
          setSelectedId(items[0].id);
        }
      } catch (error) {
        notify(t('Requirements.errors.load_exhibitors_error'), 'error');
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [notify]);

  return (
    <div className="grid gap-6 xl:grid-cols-[300px_minmax(0,1fr)]">
      <aside className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-4">
        <div>
          <h3 className="text-lg font-semibold text-white">{t('Requirements.titles.validation')}</h3>
          <p className="text-sm text-slate-400">{t('Requirements.messages.exhibitor_selection')}</p>
        </div>

        {(
          [
            'mountingLetter',
            'authorized',
            'pendingRequired',
            'pendingOptional'
          ] as ReviewBucket[]
        ).map((bucket) => {
          const bucketItems = sections[bucket];
          
          const getBucketLabel = () => {
            const labels: Record<ReviewBucket, string> = {
              mountingLetter: t('Requirements.messages.section_buckets.mounting_letter_sent'),
              authorized: t('Requirements.messages.section_buckets.authorized'),
              pendingRequired: t('Requirements.messages.section_buckets.pending_required'),
              pendingOptional: t('Requirements.messages.section_buckets.pending_optional')
            };
            return labels[bucket];
          };

          return (
            <section key={bucket} className="space-y-2 rounded-xl border border-white/10 bg-slate-950/50 p-3">
              <div className="flex items-center justify-between gap-3">
                <h4 className="text-sm font-semibold text-white">{getBucketLabel()}</h4>
                <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-slate-300">{bucketItems.length}</span>
              </div>

              {bucketItems.length > 0 ? (
                <ul className="space-y-2">
                  {bucketItems.map((item) => {
                    const active = item.id === selected?.id;
                    return (
                      <li key={item.id}>
                        <button
                          type="button"
                          onClick={() => setSelectedId(item.id)}
                          className={`w-full rounded-xl border p-3 text-left transition ${
                            active
                              ? 'border-blue-500/40 bg-blue-500/10 text-blue-100'
                              : 'border-white/10 bg-slate-900/60 text-slate-200 hover:border-white/25'
                          }`}
                        >
                          <p className="text-sm font-semibold">{item.name}</p>
                          <p className="text-xs text-slate-400">{item.company}</p>
                          <p className="mt-1 text-xs text-slate-500">{item.event}</p>
                          <p className="mt-1 text-[11px] text-slate-500">
                            {item.requiredPending > 0
                              ? `${item.requiredPending} ${t('Requirements.labels.required_pending')}`
                              : item.optionalPending > 0
                                ? `${item.optionalPending} ${t('Requirements.labels.optional_loaded')}`
                                : item.mountingLetterSent
                                  ? t('Requirements.status.mounting_letter_sent')
                                  : t('Requirements.status.authorized_general')}
                          </p>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="text-xs text-slate-500">{t('Requirements.messages.no_exhibitors')}</p>
              )}
            </section>
          );
        })}
      </aside>

      {selected ? (
        <RequirementsWorkspace
          key={selected.id}
          role="admin"
          currentUserName={adminName}
          exhibitorName={selected.name}
          exhibitorCompany={selected.company}
          initialStand={selected.standType}
          targetUserId={selected.id}
          allowStandSelection={false}
        />
      ) : (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-slate-300">
          {t('Requirements.messages.no_exhibitors_available')}
        </div>
      )}
    </div>
  );
}
