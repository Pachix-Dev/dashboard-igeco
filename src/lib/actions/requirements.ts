'use server';

import { cookies } from 'next/headers';
import {
  deleteMountingLetter,
  deleteRequirementDocument,
  getRequirementsRecord,
  listExhibitorsForRequirementsReview,
  resolveActorFromToken,
  updateComfortPlusDesignResponse,
  reviewRequirementDocument,
  saveRequirementsDraft,
  submitRequirements,
  updateRequirementDocumentComment,
  updateMountingLetterComment,
  updateStandType,
  uploadMountingLetter,
  uploadRequirementDocument,
  type RequirementsDocStatus,
  type RequirementsStandType
} from '@/lib/requirements-service';

async function resolveActorOrThrow() {
  const token = cookies().get('access_token')?.value;
  const actor = await resolveActorFromToken(token);
  if (!actor) {
    throw new Error('No autenticado');
  }
  return actor;
}

export async function getRequirementsRecordAction(targetUserId?: number) {
  const actor = await resolveActorOrThrow();
  return getRequirementsRecord(actor, targetUserId);
}

export async function updateStandTypeAction(nextStandType: RequirementsStandType, targetUserId?: number) {
  const actor = await resolveActorOrThrow();
  return updateStandType(actor, nextStandType, targetUserId);
}

export async function uploadRequirementDocumentAction(params: {
  targetUserId?: number;
  documentKey: string;
  fileName: string;
  filePath: string;
  fileUrl: string;
  fileSize: number;
  fileMime: string;
  fileFingerprint: string;
  replaceAuthorizedConfirmed?: boolean;
}) {
  const actor = await resolveActorOrThrow();
  return uploadRequirementDocument(actor, params);
}

export async function deleteRequirementDocumentAction(params: { targetUserId?: number; documentKey: string }) {
  const actor = await resolveActorOrThrow();
  return deleteRequirementDocument(actor, params);
}

export async function reviewRequirementDocumentAction(params: {
  targetUserId: number;
  documentKey: string;
  status: RequirementsDocStatus;
  adminComment?: string;
}) {
  const actor = await resolveActorOrThrow();
  return reviewRequirementDocument(actor, params);
}

export async function updateRequirementDocumentCommentAction(params: {
  targetUserId: number;
  documentKey: string;
  adminComment?: string;
}) {
  const actor = await resolveActorOrThrow();
  return updateRequirementDocumentComment(actor, params);
}

export async function confirmComfortPlusDesignSentAction(params: { targetUserId?: number; confirmed: boolean }) {
  const actor = await resolveActorOrThrow();
  return updateComfortPlusDesignResponse(actor, {
    targetUserId: params.targetUserId,
    response: params.confirmed ? 'yes' : 'no'
  });
}

export async function saveRequirementsDraftAction(targetUserId?: number) {
  const actor = await resolveActorOrThrow();
  return saveRequirementsDraft(actor, targetUserId);
}

export async function submitRequirementsAction(targetUserId?: number) {
  const actor = await resolveActorOrThrow();
  return submitRequirements(actor, targetUserId);
}

export async function uploadMountingLetterAction(params: {
  targetUserId: number;
  fileName: string;
  filePath: string;
  fileUrl: string;
  fileSize: number;
  fileMime: string;
  adminComment?: string;
}) {
  const actor = await resolveActorOrThrow();
  return uploadMountingLetter(actor, params);
}

export async function deleteMountingLetterAction(targetUserId: number) {
  const actor = await resolveActorOrThrow();
  return deleteMountingLetter(actor, targetUserId);
}

export async function updateMountingLetterCommentAction(targetUserId: number, comment: string) {
  const actor = await resolveActorOrThrow();
  return updateMountingLetterComment(actor, targetUserId, comment);
}

export async function listExhibitorsForRequirementsReviewAction() {
  const actor = await resolveActorOrThrow();
  return listExhibitorsForRequirementsReview(actor);
}
