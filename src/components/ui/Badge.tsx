import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { colors } from '../../constants/colors'

type Variant = 'success' | 'warning' | 'danger' | 'info' | 'default'

interface BadgeProps {
  label: string
  variant?: Variant
}

const variantStyles: Record<Variant, { bg: string; text: string }> = {
  success: { bg: colors.successLight, text: colors.success },
  warning: { bg: colors.warningLight, text: colors.warning },
  danger:  { bg: colors.dangerLight,  text: colors.danger },
  info:    { bg: colors.accentLight,  text: colors.accent },
  default: { bg: colors.slate100,     text: colors.textSecondary },
}

export function Badge({ label, variant = 'default' }: BadgeProps) {
  const { bg, text } = variantStyles[variant]
  return (
    <View style={[styles.pill, { backgroundColor: bg }]}>
      <Text style={[styles.text, { color: text }]}>{label}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  pill: {
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
  },
})
