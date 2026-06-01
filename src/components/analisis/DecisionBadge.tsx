import React from 'react'
import { Badge } from '../ui/Badge'
import { DECISION_LABEL } from '../../constants/decisiones'

const DECISION_VARIANT: Record<string, 'success' | 'warning' | 'danger' | 'info' | 'default'> = {
  APTO_EXPORTACION:     'success',
  APTO_MERCADO_INTERNO: 'success',
  APTO_PROCESO:         'info',
  REQUIERE_REVISION:    'warning',
  RECHAZADO:            'danger',
  RETENER_LOTE:         'danger',
  LIBERAR_LOTE:         'success',
}

interface DecisionBadgeProps {
  decision: string
}

export function DecisionBadge({ decision }: DecisionBadgeProps) {
  const label = DECISION_LABEL[decision] ?? decision
  const variant = DECISION_VARIANT[decision] ?? 'default'
  return <Badge label={label} variant={variant} />
}
