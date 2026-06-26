export type RoleType = 'admin' | 'exhibitor';

export type StandType = 'free_space' | 'comfort_plus' | 'equipped';

export type DocumentStatus =
  | 'pending_upload'
  | 'in_review'
  | 'rejected'
  | 'authorized';

export type GeneralStatus =
  | 'incomplete'
  | 'in_review'
  | 'with_observations'
  | 'authorized'
  | 'mounting_letter_issued';

export type DocumentKind = 'required' | 'optional';

export interface DocumentDefinition {
  id: string;
  title: string;
  description: string;
}

export interface UploadedFileMeta {
  fileName: string;
  fileSize: number;
  fileMime: string;
  fileUrl: string;
  fileFingerprint?: string;
  file?: File;
  uploadedAt: string;
}

export interface HistoryEntry {
  id: string;
  action:
    | 'file_uploaded'
    | 'file_replaced'
    | 'file_deleted'
    | 'status_changed'
    | 'comment_added'
    | 'comment_updated'
    | 'submitted'
    | 'draft_saved'
    | 'mounting_letter_uploaded'
    | 'mounting_letter_replaced'
    | 'mounting_letter_deleted';
  date: string;
  user: string;
  role: RoleType;
  detail?: string;
}

export interface DocumentState {
  definition: DocumentDefinition;
  kind: DocumentKind;
  status: DocumentStatus;
  fileMeta?: UploadedFileMeta;
  designResponse?: 'yes' | 'no';
  exhibitorConfirmedAt?: string;
  adminComment?: string;
  commentUpdatedAt?: string;
  reviewedAt?: string;
  reviewedBy?: string;
  error?: string;
  history: HistoryEntry[];
}

export interface MountingLetterState {
  fileMeta?: UploadedFileMeta;
  adminComment?: string;
  commentUpdatedAt?: string;
  emittedAt?: string;
  uploadedBy?: string;
  history: HistoryEntry[];
}

export interface StandDocumentsConfig {
  required: string[];
  optional: string[];
}
