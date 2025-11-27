// =====================================================
// TIPOS Y INTERFACES PARA EL MÓDULO DE PROGRAMA
// =====================================================

export interface Escenario {
  id: number
  name: string
  description?: string
  location?: string
  capacity?: number
  active: boolean
  created_at: string
  updated_at: string
}

export interface ProgramaDia {
  id: number
  escenario_id: number
  date: string
  name?: string
  description?: string
  active: boolean
  created_at: string
  updated_at: string
  escenario?: Escenario
}

export type ConferenciaType = 'keynote' | 'panel' | 'workshop' | 'presentation' | 'networking' | 'other'
export type PonenteRole = 'speaker' | 'moderator' | 'panelist' | 'guest'

export interface Conferencia {
  id: number
  dia_id: number
  title: string
  description?: string
  start_time: string
  end_time: string
  room?: string
  type: ConferenciaType
  capacity?: number
  tags?: string[]
  active: boolean
  created_at: string
  updated_at: string
  dia?: ProgramaDia
  ponentes?: ConferenciaPonente[]
}

export interface ConferenciaPonente {
  id: number
  conferencia_id: number
  ponente_id: number
  role: PonenteRole
  order_index: number
  created_at: string
  ponente?: {
    id: number
    name: string
    position?: string
    company?: string
    email?: string
    photo?: string
  }
}

export interface ProgramaCompleto {
  escenario_id: number
  escenario_name: string
  escenario_location?: string
  dia_id: number
  dia_date: string
  dia_name?: string
  conferencia_id: number
  conferencia_title: string
  conferencia_description?: string
  start_time: string
  end_time: string
  room?: string
  conferencia_type: ConferenciaType
  capacity?: number
  ponentes_info?: string
}

// Tipos para formularios
export interface EscenarioForm {
  name: string
  description?: string
  location?: string
  capacity?: number
}

export interface DiaForm {
  escenario_id: number
  date: string
  name?: string
  description?: string
}

export interface ConferenciaForm {
  dia_id: number
  title: string
  title_eng?: string
  description?: string
  description_eng?: string
  start_time: string
  end_time: string
  room?: string
  type: ConferenciaType  
  tags?: string[]
  ponentes: {
    ponente_id: number
    role: PonenteRole
    order_index: number
  }[]
}

// Respuestas de API
export interface ApiResponse<T = any> {
  message: string
  status: number
  data?: T
}
