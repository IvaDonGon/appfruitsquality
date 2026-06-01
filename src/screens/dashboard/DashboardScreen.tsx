import React, { useEffect, useState, useCallback } from 'react'
import {
  View, Text, StyleSheet, ScrollView,
  RefreshControl, TouchableOpacity, ActivityIndicator, SafeAreaView,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useAuthStore } from '../../stores/authStore'
import { useEmpresaStore } from '../../stores/empresaStore'
import { supabase } from '../../services/supabaseClient'
import { colors } from '../../constants/colors'

interface Resumen {
  total: number
  hoy: number
  pendientes: number
  aprobados: number
  rechazados: number
  ultimos: any[]
}

const RESUMEN_INICIAL: Resumen = {
  total: 0,
  hoy: 0,
  pendientes: 0,
  aprobados: 0,
  rechazados: 0,
  ultimos: [],
}

export function DashboardScreen() {
  const navigation = useNavigation<any>()
  const { user } = useAuthStore()
  const { empresaActiva } = useEmpresaStore()

  const [resumen,    setResumen]    = useState<Resumen>(RESUMEN_INICIAL)
  const [loading,    setLoading]    = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [error,      setError]      = useState('')

  const cargar = useCallback(async (esRefresh = false) => {
    if (!empresaActiva?.id) return

    esRefresh ? setRefreshing(true) : setLoading(true)
    setError('')

    try {
      const hoy = new Date().toISOString().slice(0, 10)

      const [
        { data: conteos },
        { data: ultimos },
        { data: hoyData },
      ] = await Promise.all([
        supabase
          .from('analisis_calidad')
          .select('estado')
          .eq('empresa_id', empresaActiva.id)
          .eq('eliminado', false),

        supabase
          .from('analisis_calidad')
          .select(`
            id, fecha, tipo_analisis, estado, decision,
            productores ( nombre ),
            especies    ( nombre ),
            variedades  ( nombre )
          `)
          .eq('empresa_id', empresaActiva.id)
          .eq('eliminado', false)
          .order('created_at', { ascending: false })
          .limit(5),

        supabase
          .from('analisis_calidad')
          .select('id')
          .eq('empresa_id', empresaActiva.id)
          .eq('eliminado', false)
          .eq('fecha', hoy),
      ])

      const lista = conteos ?? []

      setResumen({
        total:      lista.length,
        hoy:        hoyData?.length ?? 0,
        pendientes: lista.filter(c =>
          ['BORRADOR', 'EN_REVISION'].includes(c.estado)
        ).length,
        aprobados:  lista.filter(c => c.estado === 'APROBADO').length,
        rechazados: lista.filter(c => c.estado === 'RECHAZADO').length,
        ultimos:    ultimos ?? [],
      })

    } catch (err: any) {
      setError(err.message || 'Error al cargar')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [empresaActiva?.id])

  useEffect(() => {
    cargar()
  }, [cargar])

  if (!empresaActiva) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyTitle}>Sin empresa activa</Text>
        <Text style={styles.emptySubtitle}>No tienes una empresa seleccionada.</Text>
      </View>
    )
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.accent} />
        <Text style={styles.loadingText}>Cargando dashboard...</Text>
      </View>
    )
  }

  const hora = new Date().getHours()
  const saludo = hora < 12 ? 'Buenos días' : hora < 18 ? 'Buenas tardes' : 'Buenas noches'
  const nombre = user?.user_metadata?.nombre ?? user?.email?.split('@')[0] ?? 'Usuario'

  const kpis = [
    { label: 'Análisis hoy', valor: resumen.hoy,        bg: '#eff6ff', text: '#1d4ed8' },
    { label: 'Pendientes',   valor: resumen.pendientes,  bg: '#fffbeb', text: '#d97706' },
    { label: 'Aprobados',    valor: resumen.aprobados,   bg: '#f0fdf4', text: '#16a34a' },
    { label: 'Rechazados',   valor: resumen.rechazados,  bg: '#fef2f2', text: '#dc2626' },
  ]

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => cargar(true)}
            tintColor={colors.accent}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.saludo}>{saludo}, {nombre} 👋</Text>
            <Text style={styles.empresa}>{empresaActiva.nombre}</Text>
          </View>
        </View>

        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hoy</Text>
          <View style={styles.kpiGrid}>
            {kpis.map((k) => (
              <View key={k.label} style={[styles.kpiCard, { backgroundColor: k.bg }]}>
                <Text style={[styles.kpiValor, { color: k.text }]}>{k.valor}</Text>
                <Text style={[styles.kpiLabel, { color: k.text }]}>{k.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionRow}>
            <Text style={styles.sectionTitle}>Últimos análisis</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Analisis')}>
              <Text style={styles.verTodos}>Ver todos</Text>
            </TouchableOpacity>
          </View>

          {resumen.ultimos.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyCardText}>No hay análisis registrados aún.</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Nuevo')}>
                <Text style={styles.emptyCardLink}>Crear primer análisis →</Text>
              </TouchableOpacity>
            </View>
          ) : (
            resumen.ultimos.map((a) => (
              <TouchableOpacity
                key={a.id}
                style={styles.analisisCard}
                onPress={() =>
                  navigation.navigate('Analisis', {
                    screen: 'AnalisisDetail',
                    params: { id: a.id },
                  })
                }
              >
                <View style={styles.analisisRow}>
                  <Text style={styles.analisisFecha}>{a.fecha}</Text>
                  <View style={[styles.estadoBadge,
                    { backgroundColor: a.estado === 'APROBADO' ? '#f0fdf4' : '#f1f5f9' }
                  ]}>
                    <Text style={[styles.estadoText,
                      { color: a.estado === 'APROBADO' ? '#16a34a' :
                        a.estado === 'RECHAZADO' ? '#dc2626' : '#64748b' }
                    ]}>
                      {a.estado}
                    </Text>
                  </View>
                </View>
                <Text style={styles.analisisProductor}>
                  {a.productores?.nombre ?? '—'}
                </Text>
                <Text style={styles.analisisEspecie}>
                  {[a.especies?.nombre, a.variedades?.nombre].filter(Boolean).join(' · ')}
                </Text>
              </TouchableOpacity>
            ))
          )}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('Nuevo')}
        activeOpacity={0.85}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe:              { flex: 1, backgroundColor: colors.background },
  scroll:            { flex: 1 },
  content:           { paddingBottom: 32 },
  centered:          { flex: 1, justifyContent: 'center', alignItems: 'center',
                       backgroundColor: colors.background, gap: 8 },
  loadingText:       { color: colors.textSecondary, fontSize: 14, marginTop: 8 },
  header:            { backgroundColor: colors.primary, paddingHorizontal: 20,
                       paddingTop: 20, paddingBottom: 28 },
  saludo:            { fontSize: 18, fontWeight: '700', color: colors.white, marginBottom: 4 },
  empresa:           { fontSize: 13, color: 'rgba(255,255,255,0.7)' },
  section:           { paddingHorizontal: 16, paddingTop: 20 },
  sectionTitle:      { fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: 12 },
  sectionRow:        { flexDirection: 'row', justifyContent: 'space-between',
                       alignItems: 'center', marginBottom: 12 },
  verTodos:          { fontSize: 13, color: colors.accent, fontWeight: '600' },
  kpiGrid:           { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  kpiCard:           { flex: 1, minWidth: '45%', borderRadius: 14,
                       padding: 14, alignItems: 'center' },
  kpiValor:          { fontSize: 32, fontWeight: '800', marginBottom: 4 },
  kpiLabel:          { fontSize: 12, fontWeight: '500', textAlign: 'center' },
  emptyCard:         { backgroundColor: colors.white, borderRadius: 14,
                       padding: 24, alignItems: 'center', gap: 8,
                       borderWidth: 1, borderColor: colors.border },
  emptyCardText:     { color: colors.textSecondary, fontSize: 14 },
  emptyCardLink:     { color: colors.accent, fontSize: 14, fontWeight: '600' },
  analisisCard:      { backgroundColor: colors.white, borderRadius: 14,
                       padding: 14, marginBottom: 8,
                       borderWidth: 1, borderColor: colors.border },
  analisisRow:       { flexDirection: 'row', justifyContent: 'space-between',
                       alignItems: 'center', marginBottom: 4 },
  analisisFecha:     { fontSize: 12, color: colors.textSecondary },
  estadoBadge:       { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3 },
  estadoText:        { fontSize: 11, fontWeight: '600' },
  analisisProductor: { fontSize: 14, fontWeight: '600', color: colors.text },
  analisisEspecie:   { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  emptyTitle:        { fontSize: 16, fontWeight: '600', color: colors.text },
  emptySubtitle:     { fontSize: 13, color: colors.textSecondary },
  errorBox:          { backgroundColor: '#fef2f2', borderRadius: 10,
                       padding: 12, margin: 16,
                       borderWidth: 1, borderColor: '#fecaca' },
  errorText:         { color: colors.danger, fontSize: 13 },
  fab:               { position: 'absolute', bottom: 90, right: 20,
                       width: 56, height: 56, borderRadius: 28,
                       backgroundColor: colors.accent,
                       justifyContent: 'center', alignItems: 'center',
                       elevation: 6, shadowColor: '#000',
                       shadowOffset: { width: 0, height: 3 },
                       shadowOpacity: 0.2, shadowRadius: 6 },
  fabText:           { fontSize: 28, color: colors.white, fontWeight: '300', marginTop: -2 },
})
