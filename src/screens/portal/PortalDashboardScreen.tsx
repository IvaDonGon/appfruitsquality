import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
} from 'react-native'
import { colors } from '../../constants/colors'

export function PortalDashboardScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>Portal de clientes</Text>
        <Text style={styles.subtitle}>Próximamente disponible.</Text>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  title: { fontSize: 22, fontWeight: '700', color: colors.text, marginBottom: 8 },
  subtitle: { fontSize: 15, color: colors.textSecondary },
})
