import React, { useEffect, useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { ActivityIndicator, View } from 'react-native'
import { supabase } from '../services/supabaseClient'
import { useAuthStore } from '../stores/authStore'
import { useEmpresaStore } from '../stores/empresaStore'
import { obtenerEmpresasUsuario } from '../services/empresaService'
import { AuthNavigator } from './AuthNavigator'
import { AppNavigator } from './AppNavigator'
import { colors } from '../constants/colors'

export function RootNavigator() {
  // listo = terminó de verificar sesión + empresas
  const [listo, setListo] = useState(false)

  const { session, setSession } = useAuthStore()
  const { setEmpresaActiva, setEmpresasUsuario } = useEmpresaStore()

  useEffect(() => {
    let montado = true

    const inicializar = async () => {
      try {
        const { data: { session: sesionActual } } = await supabase.auth.getSession()

        if (!montado) return

        setSession(sesionActual)

        if (sesionActual?.user?.id) {
          await cargarEmpresas(sesionActual.user.id)
        }
      } catch (err) {
        console.warn('RootNavigator init error:', err)
      } finally {
        if (montado) setListo(true)
      }
    }

    inicializar()

    // Timeout de seguridad: si en 8 segundos no cargó, mostrar la app igual
    const timeout = setTimeout(() => {
      if (montado) {
        console.warn('RootNavigator: timeout de seguridad activado')
        setListo(true)
      }
    }, 8000)

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, nuevaSesion) => {
        if (!montado) return

        setSession(nuevaSesion)

        if (event === 'SIGNED_IN' && nuevaSesion?.user?.id) {
          await cargarEmpresas(nuevaSesion.user.id)
        }

        if (event === 'SIGNED_OUT') {
          setEmpresasUsuario([])
          setEmpresaActiva(null)
        }

        if (montado) setListo(true)
      }
    )

    return () => {
      montado = false
      subscription.unsubscribe()
      clearTimeout(timeout)
    }
  }, [])

  const cargarEmpresas = async (userId: string) => {
    try {
      const empresas = await obtenerEmpresasUsuario(userId)
      setEmpresasUsuario(empresas)
      if (empresas.length === 1) {
        setEmpresaActiva(empresas[0])
      }
    } catch (err) {
      console.warn('Error cargando empresas:', err)
      setEmpresasUsuario([])
    }
  }

  if (!listo) {
    return (
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
      }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    )
  }

  return (
    <NavigationContainer>
      {session ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  )
}
