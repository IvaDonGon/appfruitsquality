import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { colors } from '../../constants/colors'

type AlertVariant = 'error' | 'success' | 'warning' | 'info'

interface AlertProps {
  message: string
  variant?: AlertVariant
}

const variantConfig: Record<AlertVariant, { bg: string; text: string; border: string }> = {
  error:   { bg: colors.dangerLight,  text: colors.danger,  border: colors.danger },
  success: { bg: colors.successLight, text: colors.success, border: colors.success },
  warning: { bg: colors.warningLight, text: colors.warning, border: colors.warning },
  info:    { bg: colors.accentLight,  text: colors.accent,  border: colors.accent },
}

export function Alert({ message, variant = 'error' }: AlertProps) {
  const cfg = variantConfig[variant]
  return (
    <View
      style={[
        styles.container,
        { backgroundColor: cfg.bg, borderLeftColor: cfg.border },
      ]}
    >
      <Text style={[styles.text, { color: cfg.text }]}>{message}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    borderLeftWidth: 3,
    padding: 12,
    marginBottom: 14,
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
})
