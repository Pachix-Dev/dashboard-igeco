'use client';

import { useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { formatBytes, formatDateTime, statusLabel, statusTone } from './requirements.utils';
import type { DocumentState, DocumentStatus, RoleType } from './types';

type DocumentCardProps = {
  role: RoleType;
  item: DocumentState;
  onUpload: (file: File, mode: 'upload' | 'replace') => void;
  onDelete: () => void;
  onView: () => void;
  onDownload: () => void;
  onStatusChange: (status: DocumentStatus) => void;
  onCommentChange: (value: string) => void;
  onCommentSave: () => void;
  onDesignConfirmation: (confirmed: 'yes' | 'no') => void;
  savingComment?: boolean;
};

export function DocumentCard({
  role,
  item,
  onUpload,
  onDelete,
  onView,
  onDownload,
  onStatusChange,
  onCommentChange,
  onCommentSave,
  onDesignConfirmation,
  savingComment = false
}: DocumentCardProps) {
  const t = useTranslations();
  const resolveText = (value: string) => (value.startsWith('Requirements.') ? t(value) : value);
  const [dragging, setDragging] = useState(false);
  const [uploadMode, setUploadMode] = useState<'upload' | 'replace'>('upload');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const hasFile = Boolean(item.fileMeta?.fileUrl);
  const canUpload = role === 'exhibitor' && !hasFile;
  const canModify = role === 'exhibitor' && hasFile;
  const lockedByAuthorization = item.status === 'authorized';
  const isComfortPlusDesign = item.definition.id === 'comfort_plus_design';

  const handleFileSelect = (file?: File | null) => {
    if (!file) return;
    onUpload(file, uploadMode);
  };

  const triggerFileDialog = (mode: 'upload' | 'replace') => {
    setUploadMode(mode);
    fileInputRef.current?.click();
  };

  return (
    <article className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h4 className="text-base font-semibold text-white">{resolveText(item.definition.title)}</h4>
          <p className="mt-1 text-sm text-slate-400">{resolveText(item.definition.description)}</p>
          <p className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            {item.kind === 'required' ? t('Requirements.labels.required') : t('Requirements.labels.optional')}
          </p>
        </div>
        <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusTone(item.status)}`}>
          {t(statusLabel(item.status))}
        </span>
      </div>

      {role === 'exhibitor' && !isComfortPlusDesign && (
        <div
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(event) => {
            event.preventDefault();
            setDragging(false);
            const file = event.dataTransfer?.files?.[0];
            if (!file) return;
            onUpload(file, hasFile ? 'replace' : 'upload');
          }}
          className={`rounded-xl border border-dashed p-4 text-sm transition ${
            dragging ? 'border-blue-400 bg-blue-500/10 text-blue-100' : 'border-white/20 bg-slate-900/60 text-slate-300'
          }`}
        >
          {t('Requirements.messages.drag_drop_instruction')}
        </div>
      )}

      {isComfortPlusDesign && (
        <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 p-4 text-sm text-cyan-50">
          <p className="font-semibold">{t('Requirements.titles.design_mandatory')}</p>
          <p className="mt-1 text-cyan-100/80">
            {t('Requirements.messages.design_question')} </p>
          {role === 'exhibitor' ? (
            <div className="mt-3 space-y-3">
              <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-cyan-100/80">{t('Requirements.labels.answer')}</label>
              <select
                value={item.designResponse || ''}
                onChange={(event) => {
                  const next = event.target.value as 'yes' | 'no' | '';
                  if (!next) return;
                  onDesignConfirmation(next);
                }}
                disabled={lockedByAuthorization}
                className={`w-full rounded-lg border px-3 py-2 text-sm outline-none ${
                  lockedByAuthorization
                    ? 'cursor-not-allowed border-slate-700 bg-slate-800 text-slate-500'
                    : 'border-cyan-400/40 bg-slate-950 text-cyan-50'
                }`}
              >
                <option value="">{t('Requirements.messages.select_answer')}</option>
                <option value="yes">{t('Requirements.messages.yes')}</option>
                <option value="no">{t('Requirements.messages.no')}</option>
              </select>

              <div className="rounded-lg border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-slate-100">
                <span className="text-slate-400">{t('Requirements.labels.answer_registered')}</span>
                {item.designResponse === 'yes' ? t('Requirements.messages.yes') : item.designResponse === 'no' ? t('Requirements.messages.no') : t('Requirements.messages.pending')}
              </div>

              {item.exhibitorConfirmedAt && (
                <p className="text-xs text-cyan-100/80">{t('Requirements.labels.updated')} {formatDateTime(item.exhibitorConfirmedAt)}</p>
              )}
            </div>
          ) : (
            <div className="mt-3 rounded-lg border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-slate-100">
              <p><span className="text-slate-400">{t('Requirements.labels.exhibitor_answer')}</span>{item.designResponse === 'yes' ? t('Requirements.messages.yes') : item.designResponse === 'no' ? t('Requirements.messages.no') : t('Requirements.messages.pending')}</p>
              {item.exhibitorConfirmedAt && <p className="mt-1 text-xs text-slate-400">{t('Requirements.labels.updated')} {formatDateTime(item.exhibitorConfirmedAt)}</p>}
            </div>
          )}
        </div>
      )}

      {hasFile && !isComfortPlusDesign && (
        <div className="rounded-xl border border-white/10 bg-slate-900/70 p-3 text-sm text-slate-300">
          <p>
            <span className="text-slate-500">{t('Requirements.labels.file')}</span>
            {item.fileMeta?.fileName}
          </p>
        </div>
      )}

      {item.error && <p className="text-sm font-semibold text-red-300">{item.error}</p>}

      {item.adminComment && (
        <div
          className={`rounded-xl border p-3 text-sm ${
            item.status === 'rejected' ? 'border-red-500/40 bg-red-500/10 text-red-100' : 'border-white/10 bg-slate-900/60 text-slate-300'
          }`}
        >
          <p className="font-semibold">{t('Requirements.titles.admin_comment')}</p>
          <p className="mt-1">{item.adminComment}</p>
          {item.commentUpdatedAt && <p className="mt-1 text-xs text-slate-400">{t('Requirements.labels.updated')} {formatDateTime(item.commentUpdatedAt)}</p>}
        </div>
      )}

      {role === 'admin' && (
        <div className="space-y-3 rounded-xl border border-white/10 bg-slate-900/70 p-3">
          <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{t('Requirements.labels.status_label')}</label>
          <select
            value={item.status}
            onChange={(event) => onStatusChange(event.target.value as DocumentStatus)}
            className="w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white outline-none"
          >
            <option value="pending_upload">{t('Requirements.status.pending_upload')}</option>
            <option value="in_review">{t('Requirements.status.in_review')}</option>
            <option value="rejected">{t('Requirements.status.rejected')}</option>
            <option value="authorized">{t('Requirements.status.authorized')}</option>
          </select>

          <div className="rounded-lg border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-slate-100">
            <p><span className="text-slate-400">{t('Requirements.labels.exhibitor_answer')}</span>{item.designResponse === 'yes' ? t('Requirements.messages.yes') : item.designResponse === 'no' ? t('Requirements.messages.no') : t('Requirements.messages.pending')}</p>
            {item.exhibitorConfirmedAt && <p className="mt-1 text-xs text-slate-400">{t('Requirements.labels.updated')} {formatDateTime(item.exhibitorConfirmedAt)}</p>}
          </div>

          <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{t('Requirements.titles.admin_comment')}</label>
          <textarea
            value={item.adminComment || ''}
            onChange={(event) => onCommentChange(event.target.value)}
            placeholder={t('Requirements.messages.comment_placeholder')}
            className="min-h-[90px] w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white outline-none"
          />
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onCommentSave}
              disabled={savingComment}
              className={`rounded-lg border px-3 py-2 text-xs font-semibold ${
                savingComment
                  ? 'cursor-not-allowed border-slate-700 bg-slate-800 text-slate-500'
                  : 'border-blue-500/40 bg-blue-600/20 text-blue-100'
              }`}
            >
              {savingComment ? t('Requirements.buttons.saving_comment') : t('Requirements.buttons.save_comment')}
            </button>
          </div>
          <p className="text-xs text-slate-500">{t('Requirements.messages.comment_required')}</p>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {canUpload && !isComfortPlusDesign && (
          <button
            type="button"
            onClick={() => triggerFileDialog('upload')}
            className="rounded-lg border border-blue-500/40 bg-blue-600/20 px-3 py-2 text-xs font-semibold text-blue-100"
          >
            {t('Requirements.buttons.load_file')}
          </button>
        )}

        {hasFile && !isComfortPlusDesign && (
          <>
            <button type="button" onClick={onView} className="rounded-lg border border-white/15 px-3 py-2 text-xs font-semibold text-slate-200">
              {t('Requirements.buttons.view')}
            </button>
            <button type="button" onClick={onDownload} className="rounded-lg border border-white/15 px-3 py-2 text-xs font-semibold text-slate-200">
              {t('Requirements.buttons.download')}
            </button>
          </>
        )}

        {canModify && !isComfortPlusDesign && (
          <button
            type="button"
            onClick={() => triggerFileDialog('replace')}
            disabled={lockedByAuthorization}
            className={`rounded-lg border px-3 py-2 text-xs font-semibold ${
              lockedByAuthorization
                ? 'cursor-not-allowed border-slate-700 bg-slate-800 text-slate-500'
                : 'border-amber-500/40 bg-amber-500/10 text-amber-100'
            }`}
          >
            {t('Requirements.buttons.replace')}
          </button>
        )}

        {canModify && !isComfortPlusDesign && (
          <button
            type="button"
            onClick={onDelete}
            disabled={lockedByAuthorization}
            className={`rounded-lg border px-3 py-2 text-xs font-semibold ${
              lockedByAuthorization
                ? 'cursor-not-allowed border-slate-700 bg-slate-800 text-slate-500'
                : 'border-red-500/40 bg-red-500/10 text-red-100'
            }`}
          >
            {t('Requirements.buttons.delete')}
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        onChange={(event) => {
          handleFileSelect(event.target.files?.[0]);
          event.currentTarget.value = '';
        }}
        className="hidden"
      />
    </article>
  );
}
