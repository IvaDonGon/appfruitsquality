import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { colors } from '../../constants/colors'

interface AppHeaderProps {
  title: string
  subtitle?: string
  leftAction?: { label: string; onPress: () => void }
  rightAction?: { label: string; onPress: () => void }
}

export function AppHeader({ title, subtitle, leftAction, rightAction }: AppHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        {leftAction ? (
          <TouchableOpacity onPress={leftAction.onPress}>
            <Text style={styles.actionText}>{leftAction.label}</Text>
          </TouchableOpacity>
        ) : null}
      </View>
      <View style={styles.center}>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text> : null}
      </View>
      <View style={styles.right}>
        {rightAction ? (
          <TouchableOpacity onPress={rightAction.onPress}>
            <Text style={styles.actionText}>{rightAction.label}</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    minHeight: 54,
  },
  left: {
    flex: 1,
    alignItems: 'flex-start',
  },
  center: {
    flex: 3,
    alignItems: 'center',
  },
  right: {
    flex: 1,
    alignItems: 'flex-end',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  subtitle: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 1,
  },
  actionText: {
    fontSize: 14,
    color: colors.accent,
    fontWeight: '500',
  },
})
