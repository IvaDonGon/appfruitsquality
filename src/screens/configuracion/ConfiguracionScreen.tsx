import React from 'react'
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native'
import { colors } from '../../constants/colors'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { useAuthStore } from '../../stores/authStore'
import { useEmpresaStore } from '../../stores/empresaStore'

export function ConfiguracionScreen() {
  const { user, logout } = useAuthStore()
  const { empresaActiva, setEmpresaActiva, empresasUsuario, limpiar } = useEmpresaStore()

  function confirmarLogout() {
    Alert.alert(
      'Cerrar sesión',
      '¿Estás seguro que deseas salir?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cerrar sesión',
          style: 'destructive',
          onPress: async () => {
            limpiar()
            await logout()
          },
        },
      ],
    )
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Perfil */}
        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Cuenta</Text>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Email</Text>
            <Text style={styles.rowValue}>{user?.email ?? '-'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>ID Usuario</Text>
            <Text style={[styles.rowValue, styles.mono]} numberOfLines={1}>
              {user?.id?.slice(0, 12) ?? '-'}…
            </Text>
          </View>
        </Card>

        {/* Empresa activa */}
        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Empresa activa</Text>
          {empresaActiva ? (
            <>
              <View style={styles.row}>
                <Text style={styles.rowLabel}>Nombre</Text>
                <Text style={styles.rowValue}>{empresaActiva.nombre}</Text>
              </View>
              {empresaActiva.rut ? (
                <View style={styles.row}>
                  <Text style={styles.rowLabel}>RUT</Text>
                  <Text style={styles.rowValue}>{empresaActiva.rut}</Text>
                </View>
              ) : null}
              <View style={styles.row}>
                <Text style={styles.rowLabel}>Rol</Text>
                <Text style={styles.rowValue}>{empresaActiva.rol}</Text>
              </View>
            </>
          ) : (
            <Text style={styles.noData}>Sin empresa activa.</Text>
          )}

          {empresasUsuario.length > 1 ? (
            <View style={styles.empresasOtras}>
              <Text style={styles.otrasTitle}>Cambiar empresa:</Text>
              {empresasUsuario
                .filter((e) => e.id !== empresaActiva?.id)
                .map((e) => (
                  <TouchableOpacity
                    key={e.id}
                    style={styles.empresaOpcion}
                    onPress={() => setEmpresaActiva(e)}
                  >
                    <Text style={styles.empresaOpcionNombre}>{e.nombre}</Text>
                    <Text style={styles.empresaOpcionAccion}>Cambiar →</Text>
                  </TouchableOpacity>
                ))}
            </View>
          ) : null}
        </Card>

        {/* App info */}
        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Información</Text>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Aplicación</Text>
            <Text style={styles.rowValue}>Fruits Quality</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Versión</Text>
            <Text style={styles.rowValue}>1.0.0</Text>
          </View>
        </Card>

        {/* Logout */}
        <View style={styles.logoutSection}>
          <Button
            label="Cerrar sesión"
            onPress={confirmarLogout}
            variant="danger"
            fullWidth
            size="lg"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
  card: { marginHorizontal: 16, marginTop: 16 },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  rowLabel: { fontSize: 14, color: colors.textSecondary },
  rowValue: { fontSize: 14, color: colors.text, fontWeight: '500' },
  mono: { fontFamily: 'monospace', fontSize: 13 },
  noData: { color: colors.textSecondary, fontSize: 14 },
  empresasOtras: { marginTop: 12 },
  otrasTitle: { fontSize: 13, color: colors.textSecondary, marginBottom: 6 },
  empresaOpcion: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  empresaOpcionNombre: { fontSize: 14, color: colors.text, fontWeight: '500' },
  empresaOpcionAccion: { fontSize: 13, color: colors.accent },
  logoutSection: { padding: 20, marginTop: 8 },
})
