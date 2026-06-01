import React from 'react'
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native'
import { colors } from '../../constants/colors'

interface LoadingScreenProps {
  message?: string
}

export function LoadingScreen({ message }: LoadingScreenProps) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.accent} />
      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  message: {
    marginTop: 14,
    fontSize: 15,
    color: colors.textSecondary,
  },
})
