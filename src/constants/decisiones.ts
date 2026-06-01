export const DECISION_LABEL: Record<string, string> = {
  APTO_EXPORTACION:     'Apto exportación',
  APTO_MERCADO_INTERNO: 'Apto mercado interno',
  APTO_PROCESO:         'Apto proceso',
  REQUIERE_REVISION:    'Requiere revisión',
  RECHAZADO:            'Rechazado',
  RETENER_LOTE:         'Retener lote',
  LIBERAR_LOTE:         'Liberar lote',
}

export const DECISION_OPTIONS = Object.entries(DECISION_LABEL).map(
  ([value, label]) => ({ value, label }),
)
