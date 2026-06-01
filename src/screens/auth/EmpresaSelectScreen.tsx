import React from 'react'
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
} from 'react-native'
import { colors } from '../../constants/colors'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { useEmpresaStore } from '../../stores/empresaStore'
import { useAuthStore } from '../../stores/authStore'
import { Empresa } from '../../types'

export function EmpresaSelectScreen() {
  const { empresasUsuario, setEmpresaActiva } = useEmpresaStore()
  const { user } = useAuthStore()

  function seleccionar(empresa: Empresa) {
    setEmpresaActiva(empresa)
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>Seleccionar empresa</Text>
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
            <Text style={styles.emptyText}>
              No tienes empresas asociadas. Contacta al administrador.
            </Text>
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
    paddingTop: 24,
    paddingBottom: 28,
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
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    color: colors.textSecondary,
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 22,
  },
})
