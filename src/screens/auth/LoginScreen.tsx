import React, { useState } from 'react'
import {
  View, Text, StyleSheet, TouchableOpacity,
  KeyboardAvoidingView, Platform, ScrollView,
  ActivityIndicator, SafeAreaView,
} from 'react-native'
import { supabase } from '../../services/supabaseClient'
import { colors } from '../../constants/colors'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'

export function LoginScreen() {
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Ingresa tu email y contraseña.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email:    email.trim().toLowerCase(),
        password: password.trim(),
      })

      if (error) throw error
      // RootNavigator detecta el cambio de sesión automáticamente

    } catch (err: any) {
      const msg = err.message || ''
      if (msg.includes('Invalid login credentials')) {
        setError('Email o contraseña incorrectos.')
      } else if (msg.includes('Email not confirmed')) {
        setError('Debes confirmar tu email antes de ingresar.')
      } else if (msg.includes('network') || msg.includes('fetch')) {
        setError('Sin conexión. Verifica tu internet.')
      } else {
        setError(msg || 'Error al ingresar.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoEmoji}>🍎</Text>
            </View>
            <Text style={styles.appName}>Fruits Quality</Text>
            <Text style={styles.tagline}>Control de calidad de fruta</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Iniciar sesión</Text>

            {error ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <Input
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="usuario@empresa.cl"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              required
            />

            <Input
              label="Contraseña"
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              secureTextEntry
              required
            />

            <Button
              label={loading ? 'Ingresando...' : 'Ingresar'}
              onPress={handleLogin}
              disabled={loading}
              loading={loading}
              fullWidth
              size="lg"
            />
          </View>

          <Text style={styles.footer}>Fruits Quality © {new Date().getFullYear()}</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  container: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  logoEmoji: {
    fontSize: 36,
  },
  appName: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.white,
    letterSpacing: 0.5,
  },
  tagline: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.65)',
    marginTop: 4,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 24,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  errorBox: {
    backgroundColor: colors.dangerLight ?? '#fef2f2',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  errorText: {
    color: colors.danger,
    fontSize: 13,
  },
  footer: {
    textAlign: 'center',
    color: 'rgba(255,255,255,0.4)',
    fontSize: 12,
    marginTop: 24,
  },
})
