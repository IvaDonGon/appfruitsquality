import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { Analisis } from '../../types'
import { TIPO_ANALISIS_LABEL } from '../../constants/tiposAnalisis'
import { colors } from '../../constants/colors'
import { EstadoBadge } from './EstadoBadge'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface AnalisisCardProps {
  analisis: Analisis
  onPress: () => void
}

export function AnalisisCard({ analisis, onPress }: AnalisisCardProps) {
  const tipoLabel = TIPO_ANALISIS_LABEL[analisis.tipo_analisis] ?? analisis.tipo_analisis

  let fechaFormateada = analisis.fecha
  try {
    fechaFormateada = format(new Date(analisis.fecha + 'T00:00:00'), "d MMM yyyy", { locale: es })
  } catch {}

  return (
    <TouchableOpacity activeOpacity={0.75} onPress={onPress} style={styles.card}>
      <View style={styles.top}>
        <View style={styles.topLeft}>
          <Text style={styles.fecha}>{fechaFormateada}</Text>
          <Text style={styles.tipo}>{tipoLabel}</Text>
        </View>
        <View style={styles.topRight}>
          <EstadoBadge estado={analisis.estado} />
        </View>
      </View>

      <Text style={styles.productor}>
        {analisis.productores?.nombre ?? 'Sin productor'}
      </Text>

      {(analisis.especies || analisis.variedades) ? (
        <Text style={styles.especieVariedad}>
          {[analisis.especies?.nombre, analisis.variedades?.nombre]
            .filter(Boolean)
            .join(' · ')}
        </Text>
      ) : null}

      {(analisis.lote || analisis.numero_pallet) ? (
        <View style={styles.loteRow}>
          {analisis.lote ? (
            <Text style={styles.loteTag}>Lote: {analisis.lote}</Text>
          ) : null}
          {analisis.numero_pallet ? (
            <Text style={styles.loteTag}>Pallet: {analisis.numero_pallet}</Text>
          ) : null}
        </View>
      ) : null}

      <View style={styles.chevronRow}>
        <Text style={styles.chevron}>›</Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.borderLight,
    padding: 16,
    marginBottom: 10,
  },
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  topLeft: {
    flex: 1,
    marginRight: 8,
  },
  topRight: {},
  fecha: {
    fontSize: 12,
    color: colors.textTertiary,
    marginBottom: 2,
  },
  tipo: {
    fontSize: 12,
    color: colors.accent,
    fontWeight: '600',
  },
  productor: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 3,
  },
  especieVariedad: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 6,
  },
  loteRow: {
    flexDirection: 'row',
    gap: 8,
  },
  loteTag: {
    fontSize: 11,
    color: colors.textTertiary,
    backgroundColor: colors.slate50,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  chevronRow: {
    position: 'absolute',
    right: 14,
    bottom: 14,
  },
  chevron: {
    fontSize: 20,
    color: colors.textTertiary,
  },
})
