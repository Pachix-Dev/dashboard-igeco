import type { DocumentDefinition, StandDocumentsConfig, StandType } from './types';

export const MAX_FILE_SIZE_MB = 10;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export const ALLOWED_EXTENSIONS = ['pdf', 'docx'];
export const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

// Translation keys - components should use useTranslations() to resolve actual values
export const DOCUMENTS_DEADLINE_KEY = 'Requirements.deadline.label';

// Stand types - keys for translation
export const STAND_OPTIONS_KEYS: Array<{ value: StandType; translationKey: string }> = [
  { value: 'free_space', translationKey: 'Requirements.standTypes.free_space' },
  { value: 'comfort_plus', translationKey: 'Requirements.standTypes.comfort_plus' },
  { value: 'equipped', translationKey: 'Requirements.standTypes.equipped' }
];

// Document definitions with translation keys instead of hardcoded strings
export const DOCUMENT_DEFINITIONS: Record<string, DocumentDefinition> = {
  exhibitor_manual: {
    id: 'exhibitor_manual',
    title: 'Requirements.documents.exhibitor_manual.title',
    description: 'Requirements.documents.exhibitor_manual.description'
  },
  free_space_approval: {
    id: 'free_space_approval',
    title: 'Requirements.documents.free_space_approval.title',
    description: 'Requirements.documents.free_space_approval.description'
  },
  stand_render: {
    id: 'stand_render',
    title: 'Requirements.documents.stand_render.title',
    description: 'Requirements.documents.stand_render.description'
  },
  comfort_plus_format: {
    id: 'comfort_plus_format',
    title: 'Requirements.documents.comfort_plus_format.title',
    description: 'Requirements.documents.comfort_plus_format.description'
  },
  comfort_plus_design: {
    id: 'comfort_plus_design',
    title: 'Requirements.documents.comfort_plus_design.title',
    description: 'Requirements.documents.comfort_plus_design.description'
  },
  equipped_format: {
    id: 'equipped_format',
    title: 'Requirements.documents.equipped_format.title',
    description: 'Requirements.documents.equipped_format.description'
  },
  machinery_exhibition: {
    id: 'machinery_exhibition',
    title: 'Requirements.documents.machinery_exhibition.title',
    description: 'Requirements.documents.machinery_exhibition.description'
  },
  activity_registry: {
    id: 'activity_registry',
    title: 'Requirements.documents.activity_registry.title',
    description: 'Requirements.documents.activity_registry.description'
  }
};

export const STAND_DOCUMENTS: Record<StandType, StandDocumentsConfig> = {
  free_space: {
    required: ['exhibitor_manual', 'free_space_approval', 'stand_render'],
    optional: ['machinery_exhibition', 'activity_registry']
  },
  comfort_plus: {
    required: ['exhibitor_manual', 'comfort_plus_format', 'comfort_plus_design'],
    optional: ['machinery_exhibition', 'activity_registry']
  },
  equipped: {
    required: ['exhibitor_manual', 'equipped_format'],
    optional: ['machinery_exhibition', 'activity_registry']
  }
};
