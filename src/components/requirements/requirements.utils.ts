import {
  ALLOWED_EXTENSIONS,
  ALLOWED_MIME_TYPES,
  DOCUMENT_DEFINITIONS,
  MAX_FILE_SIZE_BYTES,
  MAX_FILE_SIZE_MB,
  STAND_DOCUMENTS
} from './requirements.config';
import type {
  DocumentDefinition,
  DocumentState,
  DocumentStatus,
  GeneralStatus,
  HistoryEntry,
  RoleType,
  StandType
} from './types';

const toExt = (fileName: string): string => {
  const parts = fileName.toLowerCase().split('.');
  return parts.length > 1 ? parts[parts.length - 1] : '';
};

export function formatBytes(size: number): string {
  if (!Number.isFinite(size) || size <= 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  let value = size;
  let index = 0;
  while (value >= 1024 && index < units.length - 1) {
    value /= 1024;
    index += 1;
  }
  return `${value.toFixed(value >= 10 || index === 0 ? 0 : 1)} ${units[index]}`;
}

export function formatDateTime(value?: string): string {
  if (!value) return '--';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '--';
  return date.toLocaleString('es-MX', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function statusLabel(status: DocumentStatus): string {
  if (status === 'pending_upload') return 'Pendiente de carga';
  if (status === 'in_review') return 'En revision';
  if (status === 'rejected') return 'Rechazado';
  return 'Autorizado';
}

export function statusTone(status: DocumentStatus): string {
  if (status === 'pending_upload') return 'border-slate-600 bg-slate-900/60 text-slate-300';
  if (status === 'in_review') return 'border-amber-500/40 bg-amber-500/10 text-amber-200';
  if (status === 'rejected') return 'border-red-500/50 bg-red-500/10 text-red-200';
  return 'border-emerald-500/50 bg-emerald-500/10 text-emerald-200';
}

export function getDefinitionsByStand(stand: StandType): {
  required: DocumentDefinition[];
  optional: DocumentDefinition[];
} {
  const required = STAND_DOCUMENTS[stand].required.map((id) => DOCUMENT_DEFINITIONS[id]);
  const optional = STAND_DOCUMENTS[stand].optional.map((id) => DOCUMENT_DEFINITIONS[id]);
  return { required, optional };
}

export function validateFile(file: File, maxBytes = MAX_FILE_SIZE_BYTES): string | null {
  const ext = toExt(file.name);
  if (!ALLOWED_EXTENSIONS.includes(ext) || !ALLOWED_MIME_TYPES.includes(file.type)) {
    return 'Formato de archivo no valido. Solo se permiten archivos PDF o DOCX.';
  }
  if (file.size > maxBytes) {
    return `El archivo supera el limite maximo permitido de ${MAX_FILE_SIZE_MB} MB.`;
  }
  return null;
}

export function fileFingerprint(file: File): string {
  return `${file.name}::${file.size}::${file.lastModified}`;
}

export function buildHistory(
  action: HistoryEntry['action'],
  user: string,
  role: RoleType,
  detail?: string
): HistoryEntry {
  return {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    action,
    date: new Date().toISOString(),
    user,
    role,
    detail
  };
}

export function computeGeneralStatus(
  requiredDocs: DocumentState[],
  hasMountingLetter: boolean
): GeneralStatus {
  if (hasMountingLetter) return 'mounting_letter_issued';
  if (requiredDocs.some((doc) => doc.status === 'rejected')) return 'with_observations';
  if (requiredDocs.some((doc) => doc.status === 'pending_upload')) return 'incomplete';
  if (requiredDocs.some((doc) => doc.status === 'in_review')) return 'in_review';
  if (requiredDocs.every((doc) => doc.status === 'authorized')) return 'authorized';
  return 'incomplete';
}

export function generalStatusLabel(status: GeneralStatus): string {
  if (status === 'incomplete') return 'Documentacion incompleta';
  if (status === 'in_review') return 'Documentacion en revision';
  if (status === 'with_observations') return 'Documentacion con observaciones';
  if (status === 'authorized') return 'Documentacion autorizada';
  return 'Carta de montaje emitida';
}

export function canAdminUploadMountingLetter(requiredDocs: DocumentState[]): boolean {
  return requiredDocs.length > 0 && requiredDocs.every((doc) => doc.status === 'authorized');
}

export function canExhibitorReplace(status: DocumentStatus): boolean {
  return status === 'rejected' || status === 'in_review' || status === 'pending_upload' || status === 'authorized';
}

export function nextStatusOnUpload(): DocumentStatus {
  return 'in_review';
}
