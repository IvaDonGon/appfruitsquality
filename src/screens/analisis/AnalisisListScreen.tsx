import React, { useEffect, useState, useCallback } from 'react'
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  RefreshControl,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { colors } from '../../constants/colors'
import { LoadingScreen } from '../../components/ui/LoadingScreen'
import { EmptyState } from '../../components/ui/EmptyState'
import { Alert } from '../../components/ui/Alert'
import { AnalisisCard } from '../../components/analisis/AnalisisCard'
import { useEmpresaStore } from '../../stores/empresaStore'
import { listarAnalisisCalidad } from '../../services/analisisService'
import { Analisis } from '../../types'

const TABS = [
  { key: 'TODOS',      label: 'Todos' },
  { key: 'BORRADOR',   label: 'Borrador' },
  { key: 'EN_REVISION',label: 'Revisión' },
  { key: 'APROBADO',   label: 'Aprobado' },
  { key: 'RECHAZADO',  label: 'Rechazado' },
]

export function AnalisisListScreen() {
  const navigation = useNavigation<any>()
  const { empresaActiva } = useEmpresaStore()
  const [todos, setTodos] = useState<Analisis[]>([])
  const [filtrados, setFiltrados] = useState<Analisis[]>([])
  const [tabActivo, setTabActivo] = useState('TODOS')
  const [busqueda, setBusqueda] = useState('')
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')

  const cargar = useCallback(async () => {
    if (!empresaActiva) return
    try {
      setError('')
      const data = await listarAnalisisCalidad(empresaActiva.id)
      setTodos(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [empresaActiva])

  useEffect(() => { cargar() }, [cargar])

  useEffect(() => {
    let resultado = todos
    if (tabActivo !== 'TODOS') {
      resultado = resultado.filter((a) => a.estado === tabActivo)
    }
    if (busqueda.trim()) {
      const q = busqueda.trim().toLowerCase()
      resultado = resultado.filter(
        (a) =>
          a.productores?.nombre?.toLowerCase().includes(q) ||
          a.lote?.toLowerCase().includes(q) ||
          a.numero_pallet?.toLowerCase().includes(q),
      )
    }
    setFiltrados(resultado)
  }, [todos, tabActivo, busqueda])

  if (loading) return <LoadingScreen message="Cargando análisis..." />

  return (
    <SafeAreaView style={styles.safe}>
      {/* Search */}
      <View style={styles.searchBar}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por productor o lote..."
          placeholderTextColor={colors.textTertiary}
          value={busqueda}
          onChangeText={setBusqueda}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {busqueda ? (
          <TouchableOpacity onPress={() => setBusqueda('')}>
            <Text style={styles.clearSearch}>✕</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <FlatList
          horizontal
          data={TABS}
          keyExtractor={(item) => item.key}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsList}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.tab, tabActivo === item.key && styles.tabActive]}
              onPress={() => setTabActivo(item.key)}
            >
              <Text style={[styles.tabLabel, tabActivo === item.key && styles.tabLabelActive]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {error ? (
        <View style={styles.errorPad}>
          <Alert message={error} variant="error" />
        </View>
      ) : null}

      <FlatList
        data={filtrados}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); cargar() }} />}
        renderItem={({ item }) => (
          <AnalisisCard
            analisis={item}
            onPress={() => navigation.navigate('AnalisisDetail', { id: item.id })}
          />
        )}
        ListEmptyComponent={
          <EmptyState
            title="Sin resultados"
            subtitle={busqueda ? 'No coincide con la búsqueda.' : 'No hay análisis en esta categoría.'}
            icon="📋"
          />
        }
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  searchIcon: { fontSize: 16, marginRight: 8 },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
    paddingVertical: 4,
  },
  clearSearch: {
    fontSize: 14,
    color: colors.textTertiary,
    paddingLeft: 8,
  },
  tabs: {
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  tabsList: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
  },
  tab: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: colors.slate100,
  },
  tabActive: {
    backgroundColor: colors.accent,
  },
  tabLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  tabLabelActive: {
    color: colors.white,
    fontWeight: '700',
  },
  list: {
    padding: 16,
    flexGrow: 1,
  },
  errorPad: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
})
