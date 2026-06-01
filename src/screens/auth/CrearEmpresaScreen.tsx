import React, { useState } from 'react'
import {
  View, Text, StyleSheet, ScrollView,
  SafeAreaView, KeyboardAvoidingView, Platform, TouchableOpacity,
} from 'react-native'
import { useAuthStore } from '../../stores/authStore'
import { useEmpresaStore } from '../../stores/empresaStore'
import { crearEmpresaConUsuario } from '../../services/empresaService'
import { colors } from '../../constants/colors'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'

interface Props {
  onVolver: () => void
}

export function CrearEmpresaScreen({ onVolver }: Props) {
  const { user } = useAuthStore()
  const { setEmpresaActiva, setEmpresasUsuario } = useEmpresaStore()

  const [nombre,  setNombre]  = useState('')
  const [rut,     setRut]     = useState('')
  const [ciudad,  setCiudad]  = useState('')
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  const handleCrear = async () => {
    if (!nombre.trim()) {
      setError('El nombre de la empresa es requerido.')
      return
    }
    if (!user?.id) {
      setError('No hay sesión activa.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const empresaCreada = await crearEmpresaConUsuario({
        userId: user.id,
        empresa: {
          nombre: nombre.trim(),
          rut:    rut.trim()    || undefined,
          ciudad: ciudad.trim() || undefined,
        },
      })

      setEmpresasUsuario([empresaCreada])
      setEmpresaActiva(empresaCreada)
      // AppNavigator detecta empresaActiva !== null y muestra los tabs
    } catch (err: any) {
      setError(err.message || 'Error al crear la empresa.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={onVolver} style={styles.backBtn}>
            <Text style={styles.backText}>← Volver</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Crear empresa</Text>
          <Text style={styles.subtitle}>
            Ingresa los datos de tu empresa para comenzar.
          </Text>
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          {error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <Input
            label="Nombre empresa"
            value={nombre}
            onChangeText={setNombre}
            placeholder="Mi Empresa SpA"
            autoCapitalize="words"
            required
          />

          <Input
            label="RUT (opcional)"
            value={rut}
            onChangeText={setRut}
            placeholder="76.123.456-7"
          />

          <Input
            label="Ciudad (opcional)"
            value={ciudad}
            onChangeText={setCiudad}
            placeholder="Santiago"
            autoCapitalize="words"
          />

          <View style={styles.actions}>
            <Button
              label={loading ? 'Creando...' : 'Crear empresa'}
              onPress={handleCrear}
              disabled={loading}
              loading={loading}
              fullWidth
              size="lg"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 28,
  },
  backBtn: {
    marginBottom: 12,
  },
  backText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '500',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.white,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.75)',
    lineHeight: 20,
  },
  content: {
    padding: 20,
    gap: 16,
  },
  errorBox: {
    backgroundColor: '#fef2f2',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  errorText: {
    color: colors.danger,
    fontSize: 13,
  },
  actions: {
    marginTop: 8,
  },
})
