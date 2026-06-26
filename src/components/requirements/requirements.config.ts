import type { DocumentDefinition, StandDocumentsConfig, StandType } from './types';

export const MAX_FILE_SIZE_MB = 10;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export const ALLOWED_EXTENSIONS = ['pdf', 'docx'];
export const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

export const DOCUMENTS_DEADLINE_LABEL = '30/06/2026';
export const STAND_OPTIONS: Array<{ value: StandType; label: string }> = [
  { value: 'free_space', label: 'Espacio Libre' },
  { value: 'comfort_plus', label: 'Stand Comfort Plus' },
  { value: 'equipped', label: 'Stand Equipado' }
];

export const DOCUMENT_DEFINITIONS: Record<string, DocumentDefinition> = {
  exhibitor_manual: {
    id: 'exhibitor_manual',
    title: 'Manual del expositor firmado por el representante legal',
    description: 'Documento firmado por el representante legal de la empresa expositoria.'
  },
  free_space_approval: {
    id: 'free_space_approval',
    title: 'Formato de aprobacion de stand de superficie libre',
    description: 'Formato oficial para validar el diseno del stand de superficie libre.'
  },
  stand_render: {
    id: 'stand_render',
    title: 'Render del stand con medidas',
    description: 'Render con medidas de alto, ancho y profundidad.'
  },
  comfort_plus_format: {
    id: 'comfort_plus_format',
    title: 'Formato de Stand Comfort Plus',
    description: 'Formato oficial de Stand Comfort Plus con disenos y especificaciones.'
  },
  comfort_plus_design: {
    id: 'comfort_plus_design',
    title: 'Diseño obligatorio',
    description:
      'Envía los archivos del diseño del stand a damian.arias@igeco.mx y daniela.torres@igeco.mx. Incluye renders y material visual que muestren claramente la apariencia y distribución del stand, y asegura que cumpla con las especificaciones establecidas por la organización del evento.'
  },
  equipped_format: {
    id: 'equipped_format',
    title: 'Formato de stand equipado',
    description: 'Formato oficial para stand equipado.'
  },
  machinery_exhibition: {
    id: 'machinery_exhibition',
    title: 'Formato de exhibicion de maquinaria',
    description: 'Documento opcional para notificar exhibicion de maquinaria.'
  },
  activity_registry: {
    id: 'activity_registry',
    title: 'Formato de registro de actividades',
    description: 'Documento opcional para actividades adicionales en stand.'
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
