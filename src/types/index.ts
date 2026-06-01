export interface Empresa {
  id: string
  nombre: string
  rut?: string
  giro?: string
  logo_url?: string
  color_principal?: string
  estado: string
  rol: string
}

export interface Productor {
  id: string
  empresa_id: string
  nombre: string
  rut?: string
  email?: string
  codigo?: string
}

export interface Especie {
  id: string
  empresa_id: string
  nombre: string
}

export interface Variedad {
  id: string
  empresa_id: string
  especie_id: string
  nombre: string
  especies?: { nombre: string }
}

export interface Analisis {
  id: string
  empresa_id: string
  fecha: string
  hora?: string
  tipo_analisis: string
  estado: string
  decision?: string
  productor_id?: string
  especie_id?: string
  variedad_id?: string
  lote?: string
  numero_pallet?: string
  numero_guia?: string
  brix?: number
  firmeza?: string
  temperatura_pulpa?: number
  temperatura_ambiente?: number
  color?: string
  condicion_general?: string
  peso_muestra?: number
  cantidad_frutos?: number
  puntaje_final?: number
  categoria_resultado?: string
  observacion_final?: string
  recomendacion?: string
  creado_por?: string
  created_at?: string
  productores?: { nombre: string }
  especies?: { nombre: string }
  variedades?: { nombre: string }
}

export interface DefectoAnalisis {
  id: string
  empresa_id: string
  analisis_id: string
  defecto_catalogo_id?: string
  defecto: string
  categoria: string
  porcentaje?: number
  observacion?: string
  defectos_catalogo?: {
    nombre: string
    tipo: string
    tolerancia_porcentaje?: number
    bloquea_aprobacion?: boolean
  }
}

export interface CalibreAnalisis {
  id: string
  empresa_id: string
  analisis_id: string
  calibre: string
  cantidad?: number
  porcentaje?: number
  peso?: number
}

export interface DefectoCatalogo {
  id: string
  empresa_id: string
  nombre: string
  tipo: string
  tolerancia_porcentaje?: number
  bloquea_aprobacion?: boolean
  activo: boolean
}

export interface AnalisisFormData {
  fecha: string
  hora: string
  tipo_analisis: string
  productor_id: string
  especie_id: string
  variedad_id: string
  lote: string
  numero_guia: string
  numero_pallet: string
  turno: string
  linea_proceso: string
  camara: string
  cliente_destino: string
  mercado_destino: string
  observacion_general: string
  peso_muestra: string
  cantidad_frutos: string
  temperatura_pulpa: string
  temperatura_ambiente: string
  brix: string
  firmeza: string
  color: string
  condicion_general: string
  puntaje_final: string
  categoria_resultado: string
  decision: string
  observacion_final: string
  recomendacion: string
  estado: string
}
