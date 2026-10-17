import db from '@/lib/db';
import type { RowDataPacket } from 'mysql2';
import {
  DOCUMENT_DEFINITIONS,
  STAND_DOCUMENTS
} from '@/components/requirements/requirements.config';
import type { StandType as RequirementsStandType } from '@/components/requirements/types';

type ComplianceUserRole = 'admin' | 'editor' | 'exhibitor' | 'exhibitorplus';

interface UserComplianceRow extends RowDataPacket {
  id: number;
  role: ComplianceUserRole;
  status: number;
  document_penalty_required: number;
  document_penalty_paid: number;
  document_penalty_waived: number;
  document_penalty_locked_by_admin: number;
}

interface RecordComplianceRow extends RowDataPacket {
  id: number;
  stand_type: RequirementsStandType;
}

interface DocumentComplianceRow extends RowDataPacket {
  document_key: string;
  file_url: string | null;
  design_response: 'yes' | 'no' | null;
}

export interface MissingRequiredDocument {
  key: string;
  titleKey: string;
}

export interface DocumentComplianceSnapshot {
  hasMissingRequiredDocuments: boolean;
  missingDocuments: MissingRequiredDocument[];
  requiredDocumentsTotal: number;
}

export interface DocumentPenaltyState {
  required: boolean;
  paid: boolean;
  waived: boolean;
  lockedByAdmin: boolean;
  shouldShowPayment: boolean;
}

const normalizeStandType = (value: string | null | undefined): RequirementsStandType => {
  if (value === 'comfort_plus' || value === 'equipped') return value;
  return 'free_space';
};

const shouldSkipComplianceByRole = (role: ComplianceUserRole) => {
  return role !== 'exhibitor' && role !== 'exhibitorplus';
};

export const resolveDocumentPenaltyState = (
  state: Pick<
    DocumentPenaltyState,
    'required' | 'paid' | 'waived' | 'lockedByAdmin'
  >
): DocumentPenaltyState => {
  const shouldShowPayment =
    state.lockedByAdmin || (state.required && !state.paid && !state.waived);

  return {
    ...state,
    shouldShowPayment
  };
};

export async function getDocumentComplianceSnapshot(userId: number): Promise<DocumentComplianceSnapshot> {
  const [recordRows] = await db.query<RecordComplianceRow[]>(
    'SELECT id, stand_type FROM requirements_records WHERE user_id = ? LIMIT 1',
    [userId]
  );

  const standType = normalizeStandType(recordRows[0]?.stand_type);
  const requiredKeys = STAND_DOCUMENTS[standType].required;

  if (!recordRows.length) {
    return {
      hasMissingRequiredDocuments: requiredKeys.length > 0,
      missingDocuments: requiredKeys.map((key) => ({
        key,
        titleKey: DOCUMENT_DEFINITIONS[key]?.title || key
      })),
      requiredDocumentsTotal: requiredKeys.length
    };
  }

  const [documentRows] = await db.query<DocumentComplianceRow[]>(
    `SELECT document_key, file_url, design_response
     FROM requirements_documents
     WHERE record_id = ? AND document_key IN (${requiredKeys.map(() => '?').join(',')})`,
    [recordRows[0].id, ...requiredKeys]
  );

  const byKey = new Map(documentRows.map((row) => [row.document_key, row]));
  const missingDocuments = requiredKeys
    .filter((key) => {
      const doc = byKey.get(key);
      if (!doc) return true;
      if (doc.file_url) return false;
      if (key === 'comfort_plus_design' && doc.design_response === 'yes') return false;
      return true;
    })
    .map((key) => ({
      key,
      titleKey: DOCUMENT_DEFINITIONS[key]?.title || key
    }));

  return {
    hasMissingRequiredDocuments: missingDocuments.length > 0,
    missingDocuments,
    requiredDocumentsTotal: requiredKeys.length
  };
}

export async function enforceUserDocumentCompliance(userId: number) {
  const [userRows] = await db.query<UserComplianceRow[]>(
    `SELECT id, role, status, document_penalty_required, document_penalty_paid,
            document_penalty_waived, document_penalty_locked_by_admin
     FROM users WHERE id = ? LIMIT 1`,
    [userId]
  );

  if (!userRows.length) {
    throw new Error('Usuario no encontrado para validación documental');
  }

  const user = userRows[0];
  if (shouldSkipComplianceByRole(user.role)) {
    const penaltyState = resolveDocumentPenaltyState({
      required: false,
      paid: true,
      waived: false,
      lockedByAdmin: false
    });

    return {
      currentStatus: Number(user.status ?? 1),
      penaltyState,
      snapshot: {
        hasMissingRequiredDocuments: false,
        missingDocuments: [],
        requiredDocumentsTotal: 0
      } as DocumentComplianceSnapshot
    };
  }

  const snapshot = await getDocumentComplianceSnapshot(userId);
  const requiredByCompliance = snapshot.hasMissingRequiredDocuments ? 1 : 0;

  if (Number(user.document_penalty_required ?? 0) !== requiredByCompliance) {
    await db.query(
      'UPDATE users SET document_penalty_required = ? WHERE id = ?',
      [requiredByCompliance, userId]
    );
  }

  const penaltyState = resolveDocumentPenaltyState({
    required: requiredByCompliance === 1,
    paid: Number(user.document_penalty_paid ?? 0) === 1,
    waived: Number(user.document_penalty_waived ?? 0) === 1,
    lockedByAdmin: Number(user.document_penalty_locked_by_admin ?? 0) === 1
  });

  return {
    currentStatus: Number(user.status ?? 1),
    penaltyState,
    snapshot
  };
}
