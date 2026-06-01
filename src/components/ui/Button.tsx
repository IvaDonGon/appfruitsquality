import React from 'react'
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native'
import { colors } from '../../constants/colors'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps {
  label: string
  onPress: () => void
  variant?: Variant
  loading?: boolean
  disabled?: boolean
  fullWidth?: boolean
  size?: Size
  style?: ViewStyle
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  fullWidth = false,
  size = 'md',
  style,
}: ButtonProps) {
  const isDisabled = disabled || loading

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.75}
      style={[
        styles.base,
        styles[variant],
        styles[size],
        fullWidth && styles.fullWidth,
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' || variant === 'danger' ? colors.white : colors.accent}
          size="small"
        />
      ) : (
        <Text style={[styles.label, styles[`label_${variant}` as keyof typeof styles] as TextStyle]}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
  // variants
  primary: {
    backgroundColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.slate100,
    borderWidth: 1,
    borderColor: colors.border,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  danger: {
    backgroundColor: colors.danger,
  },
  // sizes
  sm: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  md: {
    paddingVertical: 13,
    paddingHorizontal: 20,
  },
  lg: {
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  // label colors
  label: {
    fontWeight: '600',
    fontSize: 15,
  },
  label_primary: {
    color: colors.white,
  },
  label_secondary: {
    color: colors.primary,
  },
  label_ghost: {
    color: colors.accent,
  },
  label_danger: {
    color: colors.white,
  },
})
