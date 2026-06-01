export const TIPO_ANALISIS_LABEL: Record<string, string> = {
  RECEPCION:          'Recepción',
  PROCESO:            'Proceso',
  PRODUCTO_TERMINADO: 'Producto terminado',
  PRE_EMBARQUE:       'Pre embarque',
  CAMARA:             'Cámara',
  DESPACHO:           'Despacho',
  RECLAMO:            'Reclamo',
  CONTROL_INTERNO:    'Control interno',
}

export const TIPO_ANALISIS_OPTIONS = Object.entries(TIPO_ANALISIS_LABEL).map(
  ([value, label]) => ({ value, label }),
)
