import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { colors } from '../../constants/colors'

interface ProgressBarProps {
  pasos: string[]
  pasoActual: number
}

export function ProgressBar({ pasos, pasoActual }: ProgressBarProps) {
  const total = pasos.length
  const porcentaje = total > 1 ? (pasoActual / (total - 1)) * 100 : 100

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.stepCount}>
          Paso {pasoActual + 1} de {total}
        </Text>
        <Text style={styles.stepName}>{pasos[pasoActual]}</Text>
      </View>

      <View style={styles.track}>
        <View style={[styles.fill, { width: `${porcentaje}%` }]} />
      </View>

      <View style={styles.dots}>
        {pasos.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              index <= pasoActual ? styles.dotActive : styles.dotInactive,
            ]}
          />
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepCount: {
    fontSize: 12,
    color: colors.textTertiary,
    fontWeight: '500',
  },
  stepName: {
    fontSize: 13,
    color: colors.accent,
    fontWeight: '600',
  },
  track: {
    height: 4,
    backgroundColor: colors.borderLight,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 8,
  },
  fill: {
    height: '100%',
    backgroundColor: colors.accent,
    borderRadius: 2,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    backgroundColor: colors.accent,
  },
  dotInactive: {
    backgroundColor: colors.border,
  },
})
