import React, { useEffect, useRef } from 'react'
import {
  View, Text, StyleSheet, Animated, Easing, SafeAreaView,
} from 'react-native'
import { Leaf } from 'lucide-react-native'
import { colors } from '../../constants/colors'

interface LoadingScreenProps {
  message?: string
}

export function LoadingScreen({ message = 'Cargando...' }: LoadingScreenProps) {
  const progressAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(progressAnim, {
          toValue: 1,
          duration: 1600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
        Animated.timing(progressAnim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: false,
        }),
      ])
    ).start()
  }, [])

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  })

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.content}>
        <View style={styles.logoCircle}>
          <Leaf size={40} color={colors.white} strokeWidth={1.5} />
        </View>
        <Text style={styles.appName}>FruitsQuality</Text>
        <Text style={styles.subtitle}>Control de calidad de fruta</Text>
      </View>

      <View style={styles.bottomCard}>
        <View style={styles.progressTrack}>
          <Animated.View style={[styles.progressBar, { width: progressWidth }]} />
        </View>
        <Text style={styles.message}>{message}</Text>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  appName: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.white,
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
  },
  bottomCard: {
    backgroundColor: colors.background,
    paddingHorizontal: 32,
    paddingTop: 28,
    paddingBottom: 40,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  progressTrack: {
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 16,
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.accent,
    borderRadius: 2,
  },
  message: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
  },
})
