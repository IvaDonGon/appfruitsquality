import React, { useEffect, useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { supabase } from '../services/supabaseClient'
import { useAuthStore } from '../stores/authStore'
import { useEmpresaStore } from '../stores/empresaStore'
import { obtenerEmpresasUsuario } from '../services/empresaService'
import { AuthNavigator } from './AuthNavigator'
import { AppNavigator } from './AppNavigator'
import { LoadingScreen } from '../components/ui/LoadingScreen'
import { colors } from '../constants/colors'

export function RootNavigator() {
  const [listo, setListo] = useState(false)

  const { session, setSession } = useAuthStore()
  const { setEmpresaActiva, setEmpresasUsuario, limpiar } = useEmpresaStore()

  useEffect(() => {
    let montado = true

    // Carga inicial: obtiene sesión y empresas en secuencia, LUEGO muestra la app
    const inicializar = async () => {
      try {
        const { data: { session: sesionActual } } = await supabase.auth.getSession()
        if (!montado) return

        setSession(sesionActual)

        if (sesionActual?.user?.id) {
          await cargarEmpresas(sesionActual.user.id)
        }
      } catch (err) {
        console.warn('[RootNavigator] init error:', err)
      } finally {
        if (montado) setListo(true)
      }
    }

    inicializar()

    const timeout = setTimeout(() => {
      if (montado) {
        console.warn('[RootNavigator] timeout de seguridad activado')
        setListo(true)
      }
    }, 8000)

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, nuevaSesion) => {
        if (!montado) return

        // INITIAL_SESSION lo maneja inicializar() arriba.
        // El listener solo reacciona a cambios de sesión posteriores al arranque.
        if (event === 'INITIAL_SESSION') return

        setSession(nuevaSesion)

        if (event === 'SIGNED_IN' && nuevaSesion?.user?.id) {
          await cargarEmpresas(nuevaSesion.user.id)
          if (montado) setListo(true)
        }

        if (event === 'SIGNED_OUT') {
          limpiar()
          if (montado) setListo(true)
        }
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
      console.log(`[RootNavigator] ${empresas.length} empresa(s) encontrada(s)`)
      setEmpresasUsuario(empresas)
      if (empresas.length === 1) {
        setEmpresaActiva(empresas[0])
      }
    } catch (err) {
      console.warn('[RootNavigator] Error cargando empresas:', err)
    }
  }

  if (!listo) {
    return <LoadingScreen message="Iniciando aplicación..." />
  }

  return (
    <NavigationContainer>
      {session ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  )
}
