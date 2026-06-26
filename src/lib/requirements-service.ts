import db from '@/lib/db';
import { jwtVerify } from 'jose';
import type { RowDataPacket } from 'mysql2';
import {
  DOCUMENT_DEFINITIONS,
  MAX_FILE_SIZE_BYTES,
  STAND_DOCUMENTS,
  ALLOWED_EXTENSIONS,
  ALLOWED_MIME_TYPES
} from '@/components/requirements/requirements.config';

export type RequirementsStandType = 'free_space' | 'comfort_plus' | 'equipped';
export type RequirementsRole = 'admin' | 'exhibitor' | 'exhibitorplus' | 'editor';
export type RequirementsDocStatus = 'pending_upload' | 'in_review' | 'rejected' | 'authorized';

export interface RequirementsActor {
  id: number;
  role: RequirementsRole;
  name: string;
  email: string;
}

interface UserRow extends RowDataPacket {
  id: number;
  name: string;
  email: string;
  role: RequirementsRole;
}

interface RecordRow extends RowDataPacket {
  id: number;
  user_id: number;
  stand_type: RequirementsStandType;
  general_status: string;
  submitted_at: string | null;
  last_draft_at: string | null;
}

interface DocumentRow extends RowDataPacket {
  id: number;
  record_id: number;
  document_key: string;
  document_kind: 'required' | 'optional';
  is_required: number;
  status: RequirementsDocStatus;
  file_name: string | null;
  file_path: string | null;
  file_url: string | null;
  file_size: number | null;
  file_mime: string | null;
  file_fingerprint: string | null;
  uploaded_at: string | null;
  reviewed_at: string | null;
  reviewed_by: number | null;
  reviewed_by_name: string | null;
  admin_comment: string | null;
  comment_updated_at: string | null;
  exhibitor_confirmed_at: string | null;
  design_response: 'yes' | 'no' | null;
}

interface MountingLetterRow extends RowDataPacket {
  id: number;
  record_id: number;
  file_name: string | null;
  file_path: string | null;
  file_url: string | null;
  file_size: number | null;
  file_mime: string | null;
  admin_comment: string | null;
  emitted_at: string | null;
  uploaded_by: number | null;
  uploaded_by_name: string | null;
}

interface HistoryRow extends RowDataPacket {
  id: number;
  document_id: number | null;
  action: string;
  detail: string | null;
  actor_user_id: number;
  actor_role: string;
  actor_name: string | null;
  created_at: string;
}

const normalizeStandType = (value: string | null | undefined): RequirementsStandType => {
  if (value === 'comfort_plus' || value === 'equipped') return value;
  return 'free_space';
};

const allDocumentKeys = (): string[] => {
  return Array.from(
    new Set([
      ...STAND_DOCUMENTS.free_space.required,
      ...STAND_DOCUMENTS.free_space.optional,
      ...STAND_DOCUMENTS.comfort_plus.required,
      ...STAND_DOCUMENTS.comfort_plus.optional,
      ...STAND_DOCUMENTS.equipped.required,
      ...STAND_DOCUMENTS.equipped.optional
    ])
  );
};

const standKeys = (standType: RequirementsStandType): { required: string[]; optional: string[]; all: string[] } => {
  const required = STAND_DOCUMENTS[standType].required;
  const optional = STAND_DOCUMENTS[standType].optional;
  return { required, optional, all: [...required, ...optional] };
};

const ensureValidDocumentKeyForStand = (standType: RequirementsStandType, key: string) => {
  const { all } = standKeys(standType);
  if (!all.includes(key)) {
    throw new Error('Documento no permitido para el tipo de stand seleccionado');
  }
};

const computeGeneralStatus = (
  requiredDocs: Array<{ status: RequirementsDocStatus }>,
  hasMountingLetter: boolean
): string => {
  if (hasMountingLetter) return 'mounting_letter_issued';
  if (requiredDocs.some((doc) => doc.status === 'rejected')) return 'with_observations';
  if (requiredDocs.some((doc) => doc.status === 'pending_upload')) return 'incomplete';
  if (requiredDocs.some((doc) => doc.status === 'in_review')) return 'in_review';
  if (requiredDocs.length > 0 && requiredDocs.every((doc) => doc.status === 'authorized')) return 'authorized';
  return 'incomplete';
};

const nowIso = () => new Date().toISOString().slice(0, 19).replace('T', ' ');

const createHistory = async (
  recordId: number,
  documentId: number | null,
  action: string,
  detail: string | null,
  actor: RequirementsActor
) => {
  try {
    await db.query(
      `INSERT INTO requirements_history
        (record_id, document_id, action, detail, actor_user_id, actor_role, actor_name, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)` ,
      [recordId, documentId, action, detail, actor.id, actor.role, actor.name, nowIso()]
    );
  } catch (error: any) {
    const message = String(error?.message || '');
    const missingActorNameColumn =
      message.includes("Unknown column 'actor_name'") ||
      message.includes('Unknown column \"actor_name\"');

    if (!missingActorNameColumn) throw error;

    await db.query(
      `INSERT INTO requirements_history
        (record_id, document_id, action, detail, actor_user_id, actor_role, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)` ,
      [recordId, documentId, action, detail, actor.id, actor.role, nowIso()]
    );
  }
};

export async function resolveActorFromToken(token: string | undefined): Promise<RequirementsActor | null> {
  if (!token || !process.env.JWT_SECRET) return null;

  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  const { payload } = (await jwtVerify(token, secret)) as {
    payload: { id: number; email: string; role: string };
  };

  const [rows] = await db.query<UserRow[]>(
    'SELECT id, name, email, role FROM users WHERE id = ? LIMIT 1',
    [payload.id]
  );

  if (!rows.length) return null;

  return {
    id: rows[0].id,
    role: rows[0].role,
    name: rows[0].name,
    email: rows[0].email
  };
}

const canAccessTarget = (actor: RequirementsActor, targetUserId: number): boolean => {
  if (actor.role === 'admin') return true;
  return actor.id === targetUserId;
};

export async function ensureRequirementsRecord(targetUserId: number, standType?: RequirementsStandType): Promise<RecordRow> {
  const [rows] = await db.query<RecordRow[]>(
    'SELECT * FROM requirements_records WHERE user_id = ? LIMIT 1',
    [targetUserId]
  );

  if (rows.length) return rows[0];

  const safeStand = standType || 'free_space';
  const [insertResult] = await db.query<any>(
    `INSERT INTO requirements_records (user_id, stand_type, general_status, created_at, updated_at)
     VALUES (?, ?, 'incomplete', NOW(), NOW())`,
    [targetUserId, safeStand]
  );

  const [createdRows] = await db.query<RecordRow[]>(
    'SELECT * FROM requirements_records WHERE id = ? LIMIT 1',
    [insertResult.insertId]
  );

  return createdRows[0];
}

export async function syncDocumentsByStand(recordId: number, standType: RequirementsStandType) {
  const keys = standKeys(standType);

  for (const key of keys.required) {
    await db.query(
      `INSERT INTO requirements_documents
      (record_id, document_key, document_kind, is_required, status, created_at, updated_at)
      VALUES (?, ?, 'required', 1, 'pending_upload', NOW(), NOW())
      ON DUPLICATE KEY UPDATE
      document_kind = VALUES(document_kind),
      is_required = VALUES(is_required),
      updated_at = NOW()`,
      [recordId, key]
    );
  }

  for (const key of keys.optional) {
    await db.query(
      `INSERT INTO requirements_documents
      (record_id, document_key, document_kind, is_required, status, created_at, updated_at)
      VALUES (?, ?, 'optional', 0, 'pending_upload', NOW(), NOW())
      ON DUPLICATE KEY UPDATE
      document_kind = VALUES(document_kind),
      is_required = VALUES(is_required),
      updated_at = NOW()`,
      [recordId, key]
    );
  }
}

async function getRecordAndDocs(targetUserId: number) {
  const record = await ensureRequirementsRecord(targetUserId);
  await syncDocumentsByStand(record.id, normalizeStandType(record.stand_type));

  const standType = normalizeStandType(record.stand_type);
  const keys = standKeys(standType);

  const [docsRows] = await db.query<DocumentRow[]>(
    `SELECT d.*, reviewer.name AS reviewed_by_name
     FROM requirements_documents d
     LEFT JOIN users reviewer ON reviewer.id = d.reviewed_by
     WHERE d.record_id = ? AND d.document_key IN (${keys.all.map(() => '?').join(',')})
     ORDER BY d.is_required DESC, d.document_key ASC`,
    [record.id, ...keys.all]
  );

  const [mountingRows] = await db.query<MountingLetterRow[]>(
    `SELECT m.*, uploader.name AS uploaded_by_name
     FROM requirements_mounting_letters m
     LEFT JOIN users uploader ON uploader.id = m.uploaded_by
     WHERE m.record_id = ?
     LIMIT 1`,
    [record.id]
  );

  const requiredDocs = docsRows.filter((doc) => doc.is_required === 1);
  const optionalDocs = docsRows.filter((doc) => doc.is_required === 0);
  const generalStatus = computeGeneralStatus(requiredDocs, Boolean(mountingRows[0]?.file_url));

  await db.query('UPDATE requirements_records SET general_status = ?, updated_at = NOW() WHERE id = ?', [generalStatus, record.id]);

  const mapDoc = (doc: DocumentRow) => ({
    id: doc.id,
    documentKey: doc.document_key,
    documentKind: doc.document_kind,
    isRequired: doc.is_required === 1,
    status: doc.status,
    title: DOCUMENT_DEFINITIONS[doc.document_key]?.title || doc.document_key,
    description: DOCUMENT_DEFINITIONS[doc.document_key]?.description || '',
    fileName: doc.file_name,
    filePath: doc.file_path,
    fileUrl: doc.file_url,
    fileSize: doc.file_size,
    fileMime: doc.file_mime,
    fileFingerprint: doc.file_fingerprint,
    uploadedAt: doc.uploaded_at,
    reviewedAt: doc.reviewed_at,
    reviewedBy: doc.reviewed_by,
    reviewedByName: doc.reviewed_by_name,
    adminComment: doc.admin_comment,
    commentUpdatedAt: doc.comment_updated_at,
    exhibitorConfirmedAt: doc.exhibitor_confirmed_at,
    designResponse: doc.design_response || undefined,
    history: []
  });

  const requiredMapped = requiredDocs.map(mapDoc);
  const optionalMapped = optionalDocs.map(mapDoc);

  const requiredLoaded = requiredMapped.filter(
    (doc) => !!doc.fileUrl || (doc.documentKey === 'comfort_plus_design' && doc.designResponse === 'yes')
  ).length;
  const optionalLoaded = optionalMapped.filter((doc) => !!doc.fileUrl).length;
  const requiredTotal = requiredMapped.length;

  return {
    recordId: record.id,
    userId: targetUserId,
    standType,
    generalStatus,
    requiredDocuments: requiredMapped,
    optionalDocuments: optionalMapped,
    summary: {
      requiredLoaded,
      requiredTotal,
      requiredPending: Math.max(0, requiredTotal - requiredLoaded),
      optionalLoaded,
      totalLoaded: requiredLoaded + optionalLoaded,
      progress: requiredTotal > 0 ? (requiredLoaded / requiredTotal) * 100 : 0
    },
    mountingLetter: mountingRows[0]
      ? {
          id: mountingRows[0].id,
          fileName: mountingRows[0].file_name,
          filePath: mountingRows[0].file_path,
          fileUrl: mountingRows[0].file_url,
          fileSize: mountingRows[0].file_size,
          fileMime: mountingRows[0].file_mime,
          adminComment: mountingRows[0].admin_comment,
          emittedAt: mountingRows[0].emitted_at,
          uploadedBy: mountingRows[0].uploaded_by,
          uploadedByName: mountingRows[0].uploaded_by_name,
          history: []
        }
      : null
  };
}

export async function getRequirementsRecord(actor: RequirementsActor, targetUserId?: number) {
  const resolvedTargetId = targetUserId || actor.id;
  if (!canAccessTarget(actor, resolvedTargetId)) {
    throw new Error('No autorizado para consultar este expediente');
  }

  return getRecordAndDocs(resolvedTargetId);
}

export async function updateStandType(actor: RequirementsActor, nextStandType: RequirementsStandType, targetUserId?: number) {
  const resolvedTargetId = targetUserId || actor.id;
  if (!canAccessTarget(actor, resolvedTargetId)) {
    throw new Error('No autorizado para editar este expediente');
  }

  const record = await ensureRequirementsRecord(resolvedTargetId);
  const safeStandType = normalizeStandType(nextStandType);

  await db.query(
    'UPDATE requirements_records SET stand_type = ?, updated_at = NOW() WHERE id = ?',
    [safeStandType, record.id]
  );

  await syncDocumentsByStand(record.id, safeStandType);
  await createHistory(record.id, null, 'stand_type_changed', `Nuevo tipo de stand: ${safeStandType}`, actor);

  return getRecordAndDocs(resolvedTargetId);
}

const validateStoredFile = (fileName: string, fileSize: number, fileMime: string) => {
  const extension = fileName.split('.').pop()?.toLowerCase() || '';
  if (!ALLOWED_EXTENSIONS.includes(extension)) {
    throw new Error('Formato de archivo no valido. Solo se permiten archivos PDF o DOCX.');
  }
  if (!ALLOWED_MIME_TYPES.includes(fileMime)) {
    throw new Error('Formato de archivo no valido. Solo se permiten archivos PDF o DOCX.');
  }
  if (fileSize > MAX_FILE_SIZE_BYTES) {
    throw new Error('El archivo supera el limite maximo permitido de 10 MB.');
  }
};

export async function uploadRequirementDocument(
  actor: RequirementsActor,
  params: {
    targetUserId?: number;
    documentKey: string;
    fileName: string;
    filePath: string;
    fileUrl: string;
    fileSize: number;
    fileMime: string;
    fileFingerprint: string;
    replaceAuthorizedConfirmed?: boolean;
  }
) {
  const targetUserId = params.targetUserId || actor.id;
  if (!canAccessTarget(actor, targetUserId)) {
    throw new Error('No autorizado para subir archivos en este expediente');
  }

  validateStoredFile(params.fileName, params.fileSize, params.fileMime);

  const record = await ensureRequirementsRecord(targetUserId);
  await syncDocumentsByStand(record.id, normalizeStandType(record.stand_type));
  const safeStandType = normalizeStandType(record.stand_type);

  ensureValidDocumentKeyForStand(safeStandType, params.documentKey);

  const [duplicateRows] = await db.query<DocumentRow[]>(
    `SELECT id FROM requirements_documents
     WHERE record_id = ? AND document_key != ? AND file_fingerprint = ? AND file_fingerprint IS NOT NULL
     LIMIT 1`,
    [record.id, params.documentKey, params.fileFingerprint]
  );

  if (duplicateRows.length) {
    throw new Error('Este archivo ya fue cargado en otro documento. Evita duplicados accidentales.');
  }

  const [documentRows] = await db.query<DocumentRow[]>(
    'SELECT * FROM requirements_documents WHERE record_id = ? AND document_key = ? LIMIT 1',
    [record.id, params.documentKey]
  );

  if (!documentRows.length) {
    throw new Error('Documento no encontrado para el expediente actual');
  }

  const existing = documentRows[0];
  if (existing.status === 'authorized' && existing.file_url && !params.replaceAuthorizedConfirmed) {
    throw new Error('Documento autorizado requiere confirmacion para reemplazo');
  }

  await db.query(
    `UPDATE requirements_documents
     SET status = 'in_review',
         file_name = ?,
         file_path = ?,
         file_url = ?,
         file_size = ?,
         file_mime = ?,
         file_fingerprint = ?,
         uploaded_at = NOW(),
         reviewed_at = NULL,
         reviewed_by = NULL,
         admin_comment = NULL,
         comment_updated_at = NULL,
         updated_at = NOW()
     WHERE id = ?`,
    [
      params.fileName,
      params.filePath,
      params.fileUrl,
      params.fileSize,
      params.fileMime,
      params.fileFingerprint,
      existing.id
    ]
  );

  await createHistory(
    record.id,
    existing.id,
    existing.file_url ? 'file_replaced' : 'file_uploaded',
    params.fileName,
    actor
  );

  return getRecordAndDocs(targetUserId);
}

export async function deleteRequirementDocument(actor: RequirementsActor, params: { targetUserId?: number; documentKey: string }) {
  const targetUserId = params.targetUserId || actor.id;
  if (!canAccessTarget(actor, targetUserId)) {
    throw new Error('No autorizado para eliminar archivos en este expediente');
  }

  const record = await ensureRequirementsRecord(targetUserId);
  await syncDocumentsByStand(record.id, normalizeStandType(record.stand_type));

  const [rows] = await db.query<DocumentRow[]>(
    'SELECT * FROM requirements_documents WHERE record_id = ? AND document_key = ? LIMIT 1',
    [record.id, params.documentKey]
  );

  if (!rows.length) throw new Error('Documento no encontrado');

  await db.query(
    `UPDATE requirements_documents
     SET status = 'pending_upload',
         file_name = NULL,
         file_path = NULL,
         file_url = NULL,
         file_size = NULL,
         file_mime = NULL,
         file_fingerprint = NULL,
         uploaded_at = NULL,
         reviewed_at = NULL,
         reviewed_by = NULL,
         updated_at = NOW()
     WHERE id = ?`,
    [rows[0].id]
  );

  await createHistory(record.id, rows[0].id, 'file_deleted', null, actor);

  return getRecordAndDocs(targetUserId);
}

export async function reviewRequirementDocument(
  actor: RequirementsActor,
  params: {
    targetUserId: number;
    documentKey: string;
    status: RequirementsDocStatus;
    adminComment?: string;
  }
) {
  if (actor.role !== 'admin') throw new Error('Solo administrador puede revisar documentos');

  const record = await ensureRequirementsRecord(params.targetUserId);
  const [rows] = await db.query<DocumentRow[]>(
    'SELECT * FROM requirements_documents WHERE record_id = ? AND document_key = ? LIMIT 1',
    [record.id, params.documentKey]
  );

  if (!rows.length) throw new Error('Documento no encontrado');

  const comment = (params.adminComment || '').trim();
  if (params.status === 'rejected' && !comment) {
    throw new Error('Si el documento es rechazado, el comentario es obligatorio');
  }

  await db.query(
    `UPDATE requirements_documents
     SET status = ?,
         reviewed_at = NOW(),
         reviewed_by = ?,
         admin_comment = ?,
         comment_updated_at = ?,
         updated_at = NOW()
     WHERE id = ?`,
    [params.status, actor.id, comment || null, comment ? nowIso() : null, rows[0].id]
  );

  await createHistory(record.id, rows[0].id, 'status_changed', `Nuevo estatus: ${params.status}`, actor);
  if (comment) {
    await createHistory(record.id, rows[0].id, 'comment_updated', comment, actor);
  }

  return getRecordAndDocs(params.targetUserId);
}

export async function updateRequirementDocumentComment(
  actor: RequirementsActor,
  params: {
    targetUserId: number;
    documentKey: string;
    adminComment?: string;
  }
) {
  if (actor.role !== 'admin') throw new Error('Solo administrador puede comentar documentos');

  const record = await ensureRequirementsRecord(params.targetUserId);
  const [rows] = await db.query<DocumentRow[]>(
    'SELECT * FROM requirements_documents WHERE record_id = ? AND document_key = ? LIMIT 1',
    [record.id, params.documentKey]
  );

  if (!rows.length) throw new Error('Documento no encontrado');

  const comment = (params.adminComment || '').trim();
  await db.query(
    `UPDATE requirements_documents
     SET admin_comment = ?,
         comment_updated_at = ?,
         updated_at = NOW()
     WHERE id = ?`,
    [comment || null, comment ? nowIso() : null, rows[0].id]
  );

  await createHistory(record.id, rows[0].id, rows[0].admin_comment ? 'comment_updated' : 'comment_added', comment || null, actor);

  return getRecordAndDocs(params.targetUserId);
}

export async function updateComfortPlusDesignResponse(
  actor: RequirementsActor,
  params: {
    targetUserId?: number;
    response: 'yes' | 'no';
  }
) {
  const targetUserId = params.targetUserId || actor.id;
  if (!canAccessTarget(actor, targetUserId)) {
    throw new Error('No autorizado para actualizar este expediente');
  }

  const record = await ensureRequirementsRecord(targetUserId);
  await syncDocumentsByStand(record.id, normalizeStandType(record.stand_type));

  const [rows] = await db.query<DocumentRow[]>(
    'SELECT * FROM requirements_documents WHERE record_id = ? AND document_key = ? LIMIT 1',
    [record.id, 'comfort_plus_design']
  );

  if (!rows.length) throw new Error('Documento de diseño no encontrado');

  if (rows[0].status === 'authorized') {
    throw new Error('El diseño ya fue autorizado y no puede modificarse');
  }

  await db.query(
    `UPDATE requirements_documents
     SET exhibitor_confirmed_at = ?,
         design_response = ?,
         status = ?,
         reviewed_at = NULL,
         reviewed_by = NULL,
         admin_comment = CASE WHEN ? = 'yes' THEN admin_comment ELSE NULL END,
         comment_updated_at = CASE WHEN ? = 'yes' THEN comment_updated_at ELSE NULL END,
         updated_at = NOW()
     WHERE id = ?`,
    [nowIso(), params.response, params.response === 'yes' ? 'in_review' : 'pending_upload', params.response, params.response, rows[0].id]
  );

  await createHistory(
    record.id,
    rows[0].id,
    params.response === 'yes' ? 'file_uploaded' : 'file_deleted',
    params.response === 'yes' ? 'Diseños enviados por correo' : 'Respuesta marcada como No',
    actor
  );

  return getRecordAndDocs(targetUserId);
}

export async function confirmComfortPlusDesignSent(
  actor: RequirementsActor,
  params: {
    targetUserId?: number;
    confirmed: boolean;
  }
) {
  return updateComfortPlusDesignResponse(actor, {
    targetUserId: params.targetUserId,
    response: params.confirmed ? 'yes' : 'no'
  });
}

export async function saveRequirementsDraft(actor: RequirementsActor, targetUserId?: number) {
  const resolvedTargetId = targetUserId || actor.id;
  if (!canAccessTarget(actor, resolvedTargetId)) throw new Error('No autorizado');

  const record = await ensureRequirementsRecord(resolvedTargetId);
  await db.query('UPDATE requirements_records SET last_draft_at = NOW(), updated_at = NOW() WHERE id = ?', [record.id]);
  await createHistory(record.id, null, 'draft_saved', null, actor);

  return getRecordAndDocs(resolvedTargetId);
}

export async function submitRequirements(actor: RequirementsActor, targetUserId?: number) {
  const resolvedTargetId = targetUserId || actor.id;
  if (!canAccessTarget(actor, resolvedTargetId)) throw new Error('No autorizado');

  const record = await ensureRequirementsRecord(resolvedTargetId);
  await db.query('UPDATE requirements_records SET submitted_at = NOW(), updated_at = NOW() WHERE id = ?', [record.id]);
  await createHistory(record.id, null, 'submitted', null, actor);

  return getRecordAndDocs(resolvedTargetId);
}

export async function uploadMountingLetter(
  actor: RequirementsActor,
  params: {
    targetUserId: number;
    fileName: string;
    filePath: string;
    fileUrl: string;
    fileSize: number;
    fileMime: string;
    adminComment?: string;
  }
) {
  if (actor.role !== 'admin') throw new Error('Solo administrador puede cargar Carta de montaje');

  validateStoredFile(params.fileName, params.fileSize, params.fileMime);

  const recordView = await getRecordAndDocs(params.targetUserId);
  if (recordView.requiredDocuments.some((doc) => doc.status !== 'authorized')) {
    throw new Error('No puedes cargar la Carta de montaje hasta autorizar todos los documentos obligatorios');
  }

  const [rows] = await db.query<MountingLetterRow[]>(
    'SELECT * FROM requirements_mounting_letters WHERE record_id = ? LIMIT 1',
    [recordView.recordId]
  );

  if (!rows.length) {
    await db.query(
      `INSERT INTO requirements_mounting_letters
      (record_id, file_name, file_path, file_url, file_size, file_mime, admin_comment, emitted_at, uploaded_by, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), ?, NOW(), NOW())`,
      [
        recordView.recordId,
        params.fileName,
        params.filePath,
        params.fileUrl,
        params.fileSize,
        params.fileMime,
        params.adminComment || null,
        actor.id
      ]
    );
  } else {
    await db.query(
      `UPDATE requirements_mounting_letters
       SET file_name = ?,
           file_path = ?,
           file_url = ?,
           file_size = ?,
           file_mime = ?,
           admin_comment = ?,
           emitted_at = NOW(),
           uploaded_by = ?,
           updated_at = NOW()
       WHERE id = ?`,
      [
        params.fileName,
        params.filePath,
        params.fileUrl,
        params.fileSize,
        params.fileMime,
        params.adminComment || null,
        actor.id,
        rows[0].id
      ]
    );
  }

  await createHistory(
    recordView.recordId,
    null,
    rows.length ? 'mounting_letter_replaced' : 'mounting_letter_uploaded',
    params.fileName,
    actor
  );

  return getRecordAndDocs(params.targetUserId);
}

export async function deleteMountingLetter(actor: RequirementsActor, targetUserId: number) {
  if (actor.role !== 'admin') throw new Error('Solo administrador puede eliminar Carta de montaje');

  const record = await ensureRequirementsRecord(targetUserId);
  await db.query('DELETE FROM requirements_mounting_letters WHERE record_id = ?', [record.id]);
  await createHistory(record.id, null, 'mounting_letter_deleted', null, actor);

  return getRecordAndDocs(targetUserId);
}

export async function updateMountingLetterComment(actor: RequirementsActor, targetUserId: number, comment: string) {
  if (actor.role !== 'admin') throw new Error('Solo administrador puede comentar Carta de montaje');

  const record = await ensureRequirementsRecord(targetUserId);
  await db.query(
    'UPDATE requirements_mounting_letters SET admin_comment = ?, updated_at = NOW() WHERE record_id = ?',
    [comment || null, record.id]
  );
  await createHistory(record.id, null, 'comment_updated', comment || null, actor);

  return getRecordAndDocs(targetUserId);
}

export async function listExhibitorsForRequirementsReview(actor: RequirementsActor) {
  if (actor.role !== 'admin') throw new Error('Solo administrador');

  const [rows] = await db.query<RowDataPacket[]>(
    `SELECT u.id, u.name, u.email, u.company, u.event, u.role,
            r.stand_type,
            r.general_status,
            r.updated_at
     FROM users u
     LEFT JOIN requirements_records r ON r.user_id = u.id
     WHERE u.role IN ('exhibitor', 'exhibitorplus')
     ORDER BY u.created_at DESC`
  );

  const snapshots = await Promise.all(
    rows.map(async (row) => {
      const userId = Number(row.id);
      const recordView = await getRequirementsRecord(actor, userId);

      return {
        id: userId,
        name: String(row.name || ''),
        email: String(row.email || ''),
        company: String(row.company || ''),
        event: String(row.event || ''),
        standType: recordView.standType,
        generalStatus: recordView.generalStatus,
        requiredLoaded: recordView.summary.requiredLoaded,
        requiredTotal: recordView.summary.requiredTotal,
        requiredPending: recordView.summary.requiredPending,
        optionalLoaded: recordView.summary.optionalLoaded,
        optionalTotal: Math.max(0, recordView.optionalDocuments.length),
        optionalPending: Math.max(0, recordView.optionalDocuments.length - recordView.summary.optionalLoaded),
        progress: recordView.summary.progress,
        mountingLetterSent: Boolean(recordView.mountingLetter?.fileUrl),
        updatedAt: row.updated_at || null
      };
    })
  );

  return snapshots;
}

export { allDocumentKeys, standKeys };
