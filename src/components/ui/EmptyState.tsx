import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { colors } from '../../constants/colors'
import { Button } from './Button'

interface EmptyStateProps {
  title: string
  subtitle?: string
  icon?: string
  IconComponent?: React.ComponentType<{ size: number; color: string; strokeWidth?: number }>
  action?: {
    label: string
    onPress: () => void
  }
}

export function EmptyState({
  title,
  subtitle,
  icon = '📋',
  IconComponent,
  action,
}: EmptyStateProps) {
  return (
    <View style={styles.container}>
      {IconComponent ? (
        <View style={styles.iconWrapper}>
          <IconComponent size={48} color={colors.textTertiary} strokeWidth={1.5} />
        </View>
      ) : (
        <Text style={styles.icon}>{icon}</Text>
      )}
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      {action ? (
        <Button
          label={action.label}
          onPress={action.onPress}
          variant="primary"
          style={styles.button}
        />
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 48,
  },
  iconWrapper: {
    marginBottom: 16,
  },
  icon: {
    fontSize: 48,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  button: {
    marginTop: 20,
  },
})
