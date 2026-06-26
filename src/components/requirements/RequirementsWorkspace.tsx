'use client';

import { useEffect, useMemo, useState } from 'react';
import { useToaster } from '@/context/ToasterContext';
import { DOCUMENTS_DEADLINE_LABEL, STAND_OPTIONS, MAX_FILE_SIZE_MB } from './requirements.config';
import { DocumentCard } from './DocumentCard';
import { SendConfirmationModal } from './SendConfirmationModal';
import { StandTypeSelector } from './StandTypeSelector';
import { SummaryPanel } from './SummaryPanel';
import {
  canAdminUploadMountingLetter,
  fileFingerprint,
  formatBytes,
  formatDateTime,
  getDefinitionsByStand,
  generalStatusLabel,
  validateFile
} from './requirements.utils';
import type {
  DocumentState,
  DocumentStatus,
  HistoryEntry,
  MountingLetterState,
  GeneralStatus,
  RoleType,
  StandType
} from './types';

type RequirementsWorkspaceProps = {
  role: RoleType;
  currentUserName: string;
  exhibitorName?: string;
  initialStand?: StandType;
  targetUserId?: number;
  allowStandSelection?: boolean;
};

type ApiHistory = {
  id: number;
  action: string;
  detail: string | null;
  actorRole: string;
  actorName: string;
  createdAt: string;
};

type ApiDocument = {
  id: number;
  documentKey: string;
  documentKind: 'required' | 'optional';
  isRequired: boolean;
  status: DocumentStatus;
  title: string;
  description: string;
  fileName: string | null;
  fileUrl: string | null;
  fileSize: number | null;
  fileMime: string | null;
  fileFingerprint: string | null;
  uploadedAt: string | null;
  reviewedAt: string | null;
  reviewedByName: string | null;
  adminComment: string | null;
  commentUpdatedAt: string | null;
  exhibitorConfirmedAt: string | null;
  designResponse: 'yes' | 'no' | null;
  history: ApiHistory[];
};

type ApiMountingLetter = {
  fileName: string | null;
  fileUrl: string | null;
  fileSize: number | null;
  fileMime: string | null;
  adminComment: string | null;
  emittedAt: string | null;
  uploadedByName: string | null;
  history: ApiHistory[];
} | null;

type ApiRequirementsData = {
  recordId: number;
  userId: number;
  standType: StandType;
  generalStatus: GeneralStatus;
  requiredDocuments: ApiDocument[];
  optionalDocuments: ApiDocument[];
  summary: {
    requiredLoaded: number;
    requiredTotal: number;
    requiredPending: number;
    optionalLoaded: number;
    totalLoaded: number;
    progress: number;
  };
  mountingLetter: ApiMountingLetter;
};

const mapHistory = (entries: ApiHistory[]): HistoryEntry[] => {
  return entries.map((entry) => ({
    id: String(entry.id),
    action: entry.action as HistoryEntry['action'],
    date: entry.createdAt,
    user: entry.actorName || 'Sistema',
    role: (entry.actorRole === 'admin' ? 'admin' : 'exhibitor') as RoleType,
    detail: entry.detail || undefined
  }));
};

const mapDocument = (item: ApiDocument): DocumentState => {
  const definition = {
    id: item.documentKey,
    title: item.title,
    description: item.description
  };

  return {
    definition,
    kind: item.documentKind,
    status: item.status,
    fileMeta: item.fileUrl
      ? {
          fileName: item.fileName || item.documentKey,
          fileSize: item.fileSize || 0,
          fileMime: item.fileMime || '',
          fileUrl: item.fileUrl,
              fileFingerprint: item.fileFingerprint || undefined,
          uploadedAt: item.uploadedAt || ''
        }
      : undefined,
    adminComment: item.adminComment || undefined,
    commentUpdatedAt: item.commentUpdatedAt || undefined,
    exhibitorConfirmedAt: item.exhibitorConfirmedAt || undefined,
    designResponse: item.designResponse || undefined,
    reviewedAt: item.reviewedAt || undefined,
    reviewedBy: item.reviewedByName || undefined,
    history: mapHistory(item.history || []),
    error: undefined
  };
};

export function RequirementsWorkspace({
  role,
  currentUserName,
  exhibitorName,
  initialStand = 'free_space',
  targetUserId,
  allowStandSelection = true
}: RequirementsWorkspaceProps) {
  const { notify } = useToaster();

  const [standType, setStandType] = useState<StandType>(initialStand);
  const [documentsMap, setDocumentsMap] = useState<Record<string, DocumentState>>({});
  const [generalStatus, setGeneralStatus] = useState<GeneralStatus>('incomplete');
  const [recordUserId, setRecordUserId] = useState<number>(targetUserId || 0);
  const [loading, setLoading] = useState(true);
  const [savingCommentFor, setSavingCommentFor] = useState<string | null>(null);
  const [sendModalOpen, setSendModalOpen] = useState(false);
  const [mountingLetter, setMountingLetter] = useState<MountingLetterState>({ history: [] });

  const applyRecordData = (data: ApiRequirementsData) => {
    setStandType(data.standType);
    setGeneralStatus(data.generalStatus);
    setRecordUserId(data.userId);

    const nextMap: Record<string, DocumentState> = {};
    [...data.requiredDocuments, ...data.optionalDocuments].forEach((item) => {
      nextMap[item.documentKey] = mapDocument(item);
    });
    setDocumentsMap(nextMap);

    setMountingLetter(
      data.mountingLetter
        ? {
            fileMeta: data.mountingLetter.fileUrl
              ? {
                  fileName: data.mountingLetter.fileName || 'Carta de montaje',
                  fileSize: data.mountingLetter.fileSize || 0,
                  fileMime: data.mountingLetter.fileMime || '',
                  fileUrl: data.mountingLetter.fileUrl,
                  uploadedAt: data.mountingLetter.emittedAt || ''
                }
              : undefined,
            adminComment: data.mountingLetter.adminComment || undefined,
            commentUpdatedAt: data.mountingLetter.emittedAt || undefined,
            emittedAt: data.mountingLetter.emittedAt || undefined,
            uploadedBy: data.mountingLetter.uploadedByName || undefined,
            history: mapHistory(data.mountingLetter.history || [])
          }
        : { history: [] }
    );
  };

  const loadRecord = async (overrideUserId?: number) => {
    setLoading(true);
    try {
      const queryUserId = overrideUserId || targetUserId;
      const url = queryUserId ? `/api/requirements?userId=${queryUserId}` : '/api/requirements';
      const response = await fetch(url, { cache: 'no-store' });
      const payload = await response.json();
      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message || 'No se pudo cargar el expediente');
      }

      applyRecordData(payload.data as ApiRequirementsData);
    } catch (error) {
      notify(error instanceof Error ? error.message : 'Error al cargar expediente', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecord(targetUserId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetUserId]);

  const standLabel = useMemo(
    () => STAND_OPTIONS.find((option) => option.value === standType)?.label || 'Sin definir',
    [standType]
  );

  const definitions = useMemo(() => getDefinitionsByStand(standType), [standType]);

  const requiredDocs = useMemo(
    () => definitions.required.map((doc) => documentsMap[doc.id]).filter(Boolean),
    [definitions.required, documentsMap]
  );
  const optionalDocs = useMemo(
    () => definitions.optional.map((doc) => documentsMap[doc.id]).filter(Boolean),
    [definitions.optional, documentsMap]
  );

  const requiredLoaded = requiredDocs.filter(
    (doc) => doc.fileMeta?.fileUrl || (doc.definition.id === 'comfort_plus_design' && doc.designResponse === 'yes')
  ).length;
  const optionalLoaded = optionalDocs.filter((doc) => doc.fileMeta?.fileUrl).length;
  const requiredTotal = requiredDocs.length;
  const requiredPending = requiredTotal - requiredLoaded;
  const totalLoaded = requiredLoaded + optionalLoaded;
  const progress = requiredTotal > 0 ? (requiredLoaded / requiredTotal) * 100 : 0;
  const canSubmit = totalLoaded > 0;
  const generalStatusLabelText = generalStatusLabel(generalStatus);

  const standHasRemovableFiles = (nextStand: StandType): { removableIds: string[]; removableNames: string[] } => {
    const nextDefs = getDefinitionsByStand(nextStand);
    const nextIds = new Set([...nextDefs.required, ...nextDefs.optional].map((doc) => doc.id));
    const removable = Object.values(documentsMap).filter((doc) => !nextIds.has(doc.definition.id) && doc.fileMeta?.fileUrl);

    return {
      removableIds: removable.map((doc) => doc.definition.id),
      removableNames: removable.map((doc) => doc.definition.title)
    };
  };

  const handleStandChange = async (nextStand: StandType) => {
    if (nextStand === standType) return;

    const { removableNames } = standHasRemovableFiles(nextStand);
    if (removableNames.length > 0) {
      const confirmed = window.confirm(
        `Al cambiar de tipo de stand, se eliminaran ${removableNames.length} documento(s) que ya no aplican:\n\n- ${removableNames.join(
          '\n- '
        )}\n\nDeseas continuar?`
      );
      if (!confirmed) return;
    }

    try {
      const response = await fetch('/api/requirements', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          standType: nextStand,
          targetUserId: targetUserId || undefined
        })
      });
      const payload = await response.json();
      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message || 'No se pudo actualizar el tipo de stand');
      }
      applyRecordData(payload.data as ApiRequirementsData);
      notify('Tipo de stand actualizado correctamente.', 'success');
    } catch (error) {
      notify(error instanceof Error ? error.message : 'Error al actualizar tipo de stand', 'error');
    }
  };

  const setDocumentError = (docId: string, error?: string) => {
    setDocumentsMap((prev) => ({
      ...prev,
      [docId]: {
        ...prev[docId],
        error
      }
    }));
  };

  const findDuplicateFile = (docId: string, file: File): boolean => {
    const targetFingerprint = fileFingerprint(file);
    const duplicated = Object.values(documentsMap).some((doc) => {
      if (doc.definition.id === docId) return false;
      if (!doc.fileMeta?.fileFingerprint) return false;
      return doc.fileMeta.fileFingerprint === targetFingerprint;
    });

    return duplicated;
  };

  const updateDocumentFile = async (docId: string, file: File, mode: 'upload' | 'replace') => {
    const validationError = validateFile(file);
    if (validationError) {
      setDocumentError(docId, validationError);
      notify(validationError, 'error');
      return;
    }

    if (findDuplicateFile(docId, file)) {
      const message = 'Este archivo ya fue cargado en otro documento. Evita duplicados accidentales.';
      setDocumentError(docId, message);
      notify(message, 'error');
      return;
    }

    const current = documentsMap[docId];
    if (!current) return;

    let replaceAuthorizedConfirmed = false;
    if (mode === 'replace' && current.status === 'authorized') {
      const confirmed = window.confirm(
        'Este documento ya esta autorizado. Al reemplazarlo volvera a En revision. Deseas continuar?'
      );
      if (!confirmed) return;
      replaceAuthorizedConfirmed = true;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('documentKey', docId);
      if (targetUserId) formData.append('targetUserId', String(targetUserId));
      if (replaceAuthorizedConfirmed) formData.append('replaceAuthorizedConfirmed', 'true');

      const response = await fetch('/api/requirements/documents/upload', {
        method: 'POST',
        body: formData
      });
      const payload = await response.json();
      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message || 'No se pudo cargar el archivo');
      }
      applyRecordData(payload.data as ApiRequirementsData);
      notify('Archivo cargado correctamente. Estatus actualizado a En revision.', 'success');
    } catch (error) {
      notify(error instanceof Error ? error.message : 'Error al cargar archivo', 'error');
    }
  };

  const handleDelete = async (docId: string) => {
    const current = documentsMap[docId];
    if (!current || !current.fileMeta?.fileUrl) return;

    const requiresConfirm = current.status === 'authorized';
    if (requiresConfirm) {
      const confirmed = window.confirm('El documento esta autorizado. Confirmas que deseas eliminarlo?');
      if (!confirmed) return;
    }

    try {
      const response = await fetch('/api/requirements/documents', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentKey: docId, targetUserId: targetUserId || undefined })
      });
      const payload = await response.json();
      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message || 'No se pudo eliminar el archivo');
      }
      applyRecordData(payload.data as ApiRequirementsData);
      notify('Archivo eliminado.', 'success');
    } catch (error) {
      notify(error instanceof Error ? error.message : 'Error al eliminar archivo', 'error');
    }
  };

  const openFile = (docId: string, mode: 'view' | 'download') => {
    const target = documentsMap[docId];
    const meta = target?.fileMeta;
    if (!meta?.fileUrl) return;

    const url = meta.fileUrl;
    if (mode === 'view') {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = meta.fileName;
      anchor.click();
    }
  };

  const handleAdminStatusChange = async (docId: string, nextStatus: DocumentStatus) => {
    if (role !== 'admin') return;

    const current = documentsMap[docId];
    if (!current) return;
    if (nextStatus === 'rejected' && !current.adminComment?.trim()) {
      notify('Para rechazar, debes agregar un comentario.', 'error');
      return;
    }

    try {
      const response = await fetch('/api/requirements/documents/review', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetUserId: targetUserId || recordUserId,
          documentKey: docId,
          status: nextStatus,
          adminComment: current.adminComment || ''
        })
      });
      const payload = await response.json();
      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message || 'No se pudo actualizar estatus');
      }
      applyRecordData(payload.data as ApiRequirementsData);
      notify('Estatus actualizado.', 'success');
    } catch (error) {
      notify(error instanceof Error ? error.message : 'Error al actualizar estatus', 'error');
    }
  };

  const handleAdminCommentChange = (docId: string, value: string) => {
    if (role !== 'admin') return;

    setDocumentsMap((prev) => {
      const current = prev[docId];
      if (!current) return prev;

      return {
        ...prev,
        [docId]: {
          ...current,
          adminComment: value,
          commentUpdatedAt: new Date().toISOString()
        }
      };
    });
  };

  const handleAdminCommentSave = async (docId: string) => {
    if (role !== 'admin') return;
    const current = documentsMap[docId];
    if (!current) return;

    setSavingCommentFor(docId);
    try {
      const response = await fetch('/api/requirements/documents/comment', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetUserId: targetUserId || recordUserId,
          documentKey: docId,
          adminComment: current.adminComment || ''
        })
      });
      const payload = await response.json();
      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message || 'No se pudo guardar comentario');
      }
      applyRecordData(payload.data as ApiRequirementsData);
      notify('Comentario guardado correctamente.', 'success');
    } catch (error) {
      notify(error instanceof Error ? error.message : 'Error al guardar comentario', 'error');
    } finally {
      setSavingCommentFor(null);
    }
  };

  const handleComfortPlusDesignConfirmation = async (designResponse: 'yes' | 'no') => {
    try {
      const apiResponse = await fetch('/api/requirements/documents/confirm-design', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetUserId: targetUserId || recordUserId,
          response: designResponse
        })
      });
      const payload = await apiResponse.json();
      if (!apiResponse.ok || !payload?.success) {
        throw new Error(payload?.message || 'No se pudo actualizar la confirmacion de diseño');
      }
      applyRecordData(payload.data as ApiRequirementsData);
      notify(designResponse === 'yes' ? 'Respuesta registrada.' : 'Respuesta actualizada.', 'success');
    } catch (error) {
      notify(error instanceof Error ? error.message : 'Error al actualizar la confirmación de diseño', 'error');
    }
  };

  const handleSaveDraft = async () => {
    try {
      const response = await fetch('/api/requirements/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUserId: targetUserId || undefined })
      });
      const payload = await response.json();
      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message || 'No se pudo guardar borrador');
      }
      applyRecordData(payload.data as ApiRequirementsData);
      notify('Borrador guardado correctamente.', 'success');
    } catch (error) {
      notify(error instanceof Error ? error.message : 'Error al guardar borrador', 'error');
    }
  };

  const handleSubmitIntent = () => {
    if (!canSubmit) {
      notify('Debes cargar al menos un archivo para enviar.', 'error');
      return;
    }
    setSendModalOpen(true);
  };

  const handleConfirmSend = async () => {
    try {
      const response = await fetch('/api/requirements/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUserId: targetUserId || undefined })
      });
      const payload = await response.json();
      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message || 'No se pudo enviar expediente');
      }
      applyRecordData(payload.data as ApiRequirementsData);
      setSendModalOpen(false);
      notify('Envio registrado. El expediente quedo en revision.', 'success');
    } catch (error) {
      notify(error instanceof Error ? error.message : 'Error al enviar expediente', 'error');
    }
  };

  const canUploadMountingLetter = canAdminUploadMountingLetter(requiredDocs);

  const handleMountingLetterUpload = async (file: File, mode: 'upload' | 'replace') => {
    if (role !== 'admin') return;

    const validationError = validateFile(file);
    if (validationError) {
      notify(validationError, 'error');
      return;
    }

    if (!canUploadMountingLetter && mode === 'upload') {
      notify('No puedes cargar la Carta de montaje hasta autorizar todos los documentos obligatorios.', 'error');
      return;
    }

    const confirmed = window.confirm(
      'Confirma que has revisado la documentacion obligatoria del expositor y que todos los documentos cumplen con los requisitos para autorizar el montaje.'
    );
    if (!confirmed) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('targetUserId', String(targetUserId || recordUserId));

    try {
      const response = await fetch('/api/requirements/mounting-letter/upload', {
        method: 'POST',
        body: formData
      });
      const payload = await response.json();
      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message || 'No se pudo cargar Carta de montaje');
      }
      applyRecordData(payload.data as ApiRequirementsData);
      notify('Carta de montaje cargada correctamente.', 'success');
    } catch (error) {
      notify(error instanceof Error ? error.message : 'Error al cargar Carta de montaje', 'error');
    }
  };

  const handleMountingLetterDelete = async () => {
    if (role !== 'admin' || !mountingLetter.fileMeta?.fileUrl) return;

    const confirmed = window.confirm('Confirma que deseas eliminar la Carta de montaje.');
    if (!confirmed) return;

    try {
      const response = await fetch('/api/requirements/mounting-letter', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUserId: targetUserId || recordUserId })
      });
      const payload = await response.json();
      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message || 'No se pudo eliminar Carta de montaje');
      }
      applyRecordData(payload.data as ApiRequirementsData);
      notify('Carta de montaje eliminada.', 'success');
    } catch (error) {
      notify(error instanceof Error ? error.message : 'Error al eliminar Carta de montaje', 'error');
    }
  };

  const handleOpenMountingLetter = (mode: 'view' | 'download') => {
    const fileMeta = mountingLetter.fileMeta;
    if (!fileMeta?.fileUrl) return;

    const url = fileMeta.fileUrl;
    if (mode === 'view') {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = fileMeta.fileName;
      anchor.click();
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-slate-300">
        Cargando expediente...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="space-y-2 rounded-2xl border border-white/10 bg-white/5 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
          {role === 'admin' ? 'Revision administrativa' : 'Portal del expositor'}
        </p>
        <h2 className="text-2xl font-bold text-white">
          {role === 'admin' ? `Validación de Expedientes - ${exhibitorName || 'Expositor'}` : 'Mi expediente'}
        </h2>
        <p className="text-sm text-slate-400">
          Gestiona la carga, revision y autorizacion de documentos segun el tipo de stand contratado.
        </p>
        <p className="text-xs text-slate-500">Estado general actual: {generalStatusLabelText}</p>
      </header>

      <StandTypeSelector value={standType} onChange={handleStandChange} disabled={!allowStandSelection} />

      <SummaryPanel
        requiredLoaded={requiredLoaded}
        requiredTotal={requiredTotal}
        requiredPending={requiredPending}
        optionalLoaded={optionalLoaded}
        progress={progress}
        generalStatus={generalStatus}
        canSubmit={canSubmit}
        deadlineLabel={DOCUMENTS_DEADLINE_LABEL}
        showActions={role === 'exhibitor'}
        onSaveDraft={handleSaveDraft}
        onSubmit={handleSubmitIntent}
      />

      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Documentos obligatorios</h3>
        <div className="grid gap-4 lg:grid-cols-2">
          {requiredDocs.map((item) => (
            <DocumentCard
              key={item.definition.id}
              role={role}
              item={item}
              onUpload={(file, mode) => updateDocumentFile(item.definition.id, file, mode)}
              onDelete={() => handleDelete(item.definition.id)}
              onView={() => openFile(item.definition.id, 'view')}
              onDownload={() => openFile(item.definition.id, 'download')}
              onStatusChange={(status) => handleAdminStatusChange(item.definition.id, status)}
              onCommentChange={(value) => handleAdminCommentChange(item.definition.id, value)}
              onCommentSave={() => handleAdminCommentSave(item.definition.id)}
              savingComment={savingCommentFor === item.definition.id}
              onDesignConfirmation={handleComfortPlusDesignConfirmation}
            />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Documentos opcionales en caso de requerirlo</h3>
        <div className="grid gap-4 lg:grid-cols-2">
          {optionalDocs.map((item) => (
            <DocumentCard
              key={item.definition.id}
              role={role}
              item={item}
              onUpload={(file, mode) => updateDocumentFile(item.definition.id, file, mode)}
              onDelete={() => handleDelete(item.definition.id)}
              onView={() => openFile(item.definition.id, 'view')}
              onDownload={() => openFile(item.definition.id, 'download')}
              onStatusChange={(status) => handleAdminStatusChange(item.definition.id, status)}
              onCommentChange={(value) => handleAdminCommentChange(item.definition.id, value)}
              onCommentSave={() => handleAdminCommentSave(item.definition.id)}
              savingComment={savingCommentFor === item.definition.id}
              onDesignConfirmation={handleComfortPlusDesignConfirmation}
            />
          ))}
        </div>
      </section>

      <section className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-5">
        <h3 className="text-lg font-semibold text-white">Carta de montaje</h3>

        {role === 'admin' && (
          <div className="rounded-xl border border-white/10 bg-slate-900/70 p-4 text-sm text-slate-300">
            <p>
              La carga de Carta de montaje se habilita solo cuando todos los documentos obligatorios esten autorizados.
            </p>
            <p className="mt-2 text-xs text-slate-500">
              Formatos permitidos: PDF y DOCX. Tamano maximo: {MAX_FILE_SIZE_MB} MB.
            </p>
          </div>
        )}

        {mountingLetter.fileMeta?.fileUrl ? (
          <div className="rounded-xl border border-white/10 bg-slate-900/70 p-4 text-sm text-slate-200">
            <p>
              <span className="text-slate-500">Archivo: </span>
              {mountingLetter.fileMeta.fileName}
            </p>
            <p>
              <span className="text-slate-500">Tamano: </span>
              {formatBytes(mountingLetter.fileMeta.fileSize)}
            </p>
            <p>
              <span className="text-slate-500">Fecha de emision: </span>
              {formatDateTime(mountingLetter.emittedAt)}
            </p>
            <p>
              <span className="text-slate-500">Cargado por: </span>
              {mountingLetter.uploadedBy || '--'}
            </p>
            {mountingLetter.adminComment && (
              <p className="mt-2 rounded-md border border-white/10 bg-black/30 p-2 text-slate-200">
                {mountingLetter.adminComment}
              </p>
            )}
            <div className="mt-3 flex flex-wrap gap-2">
              <button type="button" onClick={() => handleOpenMountingLetter('view')} className="rounded-lg border border-white/15 px-3 py-2 text-xs font-semibold">
                Visualizar
              </button>
              <button type="button" onClick={() => handleOpenMountingLetter('download')} className="rounded-lg border border-white/15 px-3 py-2 text-xs font-semibold">
                Descargar
              </button>
              {role === 'admin' && (
                <>
                  <label className="cursor-pointer rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs font-semibold text-amber-100">
                    Reemplazar
                    <input
                      type="file"
                      accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      className="hidden"
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        if (file) handleMountingLetterUpload(file, 'replace');
                        event.currentTarget.value = '';
                      }}
                    />
                  </label>
                  <button
                    type="button"
                    onClick={handleMountingLetterDelete}
                    className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-100"
                  >
                    Eliminar
                  </button>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-white/10 bg-slate-900/70 p-4 text-sm text-slate-300">
            <p>Aun no se ha emitido la Carta de montaje.</p>
            {role === 'admin' ? (
              <label className={`mt-3 inline-flex cursor-pointer rounded-lg border px-3 py-2 text-xs font-semibold ${
                canUploadMountingLetter
                  ? 'border-blue-500/40 bg-blue-600/20 text-blue-100'
                  : 'cursor-not-allowed border-slate-700 bg-slate-800 text-slate-500'
              }`}>
                Cargar Carta de montaje
                <input
                  type="file"
                  disabled={!canUploadMountingLetter}
                  accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  className="hidden"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) handleMountingLetterUpload(file, 'upload');
                    event.currentTarget.value = '';
                  }}
                />
              </label>
            ) : (
              <p className="mt-2 text-sm text-slate-500">Disponible cuando la revision administrativa este completa.</p>
            )}
          </div>
        )}

        {role === 'exhibitor' && mountingLetter.fileMeta?.fileUrl && (
          <p className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-3 text-sm text-emerald-100">
            Tu documentacion ha sido autorizada. La Carta de montaje ya se encuentra disponible para su consulta y descarga.
          </p>
        )}
      </section>

      <SendConfirmationModal
        open={sendModalOpen}
        standTypeLabel={standLabel}
        requiredLoaded={requiredLoaded}
        requiredTotal={requiredTotal}
        requiredPending={requiredPending}
        optionalLoaded={optionalLoaded}
        totalDocs={requiredTotal + optionalDocs.length}
        onCancel={() => setSendModalOpen(false)}
        onConfirm={handleConfirmSend}
      />
    </div>
  );
}
