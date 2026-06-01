import React from 'react'
import {
  View, Text, FlatList, StyleSheet,
  SafeAreaView, TouchableOpacity,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { colors } from '../../constants/colors'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { useEmpresaStore } from '../../stores/empresaStore'
import { useAuthStore } from '../../stores/authStore'
import { Empresa } from '../../types'

export function EmpresaSelectScreen() {
  const navigation = useNavigation<any>()
  const { empresasUsuario, setEmpresaActiva } = useEmpresaStore()
  const { user, logout } = useAuthStore()

  function seleccionar(empresa: Empresa) {
    setEmpresaActiva(empresa)
    // AppNavigator detecta empresaActiva !== null y muestra los tabs
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Seleccionar empresa</Text>
          <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
            <Text style={styles.logoutText}>Cerrar sesión</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.subtitle}>
          Hola {user?.email ?? ''}. Elige con qué empresa quieres trabajar.
        </Text>
      </View>

      <FlatList
        data={empresasUsuario}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <View style={styles.cardRow}>
              <View style={styles.cardInfo}>
                <Text style={styles.empresaNombre}>{item.nombre}</Text>
                {item.rut ? (
                  <Text style={styles.empresaRut}>RUT: {item.rut}</Text>
                ) : null}
                <Text style={styles.rolTag}>{item.rol}</Text>
              </View>
              <Button
                label="Seleccionar"
                onPress={() => seleccionar(item)}
                variant="primary"
                size="sm"
              />
            </View>
          </Card>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>Sin empresas asociadas</Text>
            <Text style={styles.emptyText}>
              Tu cuenta no tiene empresas asignadas.{'\n'}
              Puedes crear una empresa para comenzar.
            </Text>
            <Button
              label="Crear empresa"
              onPress={() => navigation.navigate('CrearEmpresa')}
              variant="primary"
              size="sm"
            />
          </View>
        }
      />
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
    paddingTop: 20,
    paddingBottom: 28,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.white,
  },
  logoutBtn: {
    paddingVertical: 4,
    paddingHorizontal: 2,
  },
  logoutText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.75)',
    fontWeight: '500',
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.75)',
    lineHeight: 20,
  },
  list: {
    padding: 16,
    gap: 12,
  },
  card: {
    padding: 16,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  cardInfo: {
    flex: 1,
  },
  empresaNombre: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 3,
  },
  empresaRut: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  rolTag: {
    fontSize: 11,
    color: colors.accent,
    fontWeight: '600',
    backgroundColor: colors.accentLight,
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  empty: {
    flex: 1,
    padding: 40,
    alignItems: 'center',
    gap: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
})
