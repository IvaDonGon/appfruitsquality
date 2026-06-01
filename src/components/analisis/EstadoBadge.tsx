import React from 'react'
import { Badge } from '../ui/Badge'

const ESTADO_CONFIG: Record<string, { label: string; variant: 'success' | 'warning' | 'danger' | 'info' | 'default' }> = {
  BORRADOR:    { label: 'Borrador',    variant: 'default' },
  EN_REVISION: { label: 'En revisión', variant: 'warning' },
  APROBADO:    { label: 'Aprobado',    variant: 'success' },
  RECHAZADO:   { label: 'Rechazado',   variant: 'danger' },
  ENVIADO:     { label: 'Enviado',     variant: 'info' },
}

interface EstadoBadgeProps {
  estado: string
}

export function EstadoBadge({ estado }: EstadoBadgeProps) {
  const cfg = ESTADO_CONFIG[estado] ?? { label: estado, variant: 'default' as const }
  return <Badge label={cfg.label} variant={cfg.variant} />
}
