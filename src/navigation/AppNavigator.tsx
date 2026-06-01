import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { DashboardScreen } from '../screens/dashboard/DashboardScreen'
import { AnalisisNavigator } from './AnalisisNavigator'
import { AnalisisNuevoScreen } from '../screens/analisis/nuevo/AnalisisNuevoScreen'
import { ConfiguracionScreen } from '../screens/configuracion/ConfiguracionScreen'
import { EmpresaSelectScreen } from '../screens/auth/EmpresaSelectScreen'
import { useEmpresaStore } from '../stores/empresaStore'
import { colors } from '../constants/colors'

export type AppTabParamList = {
  Inicio: undefined
  Analisis: undefined
  Nuevo: undefined
  Configuracion: undefined
}

const Tab = createBottomTabNavigator<AppTabParamList>()

export function AppNavigator() {
  const { empresaActiva } = useEmpresaStore()

  if (!empresaActiva) {
    return <EmpresaSelectScreen />
  }

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarLabelStyle: styles.tabLabel,
        tabBarIcon: ({ color, focused }) => {
          if (route.name === 'Inicio') {
            return <Text style={[styles.tabEmoji, { opacity: focused ? 1 : 0.5 }]}>🏠</Text>
          }
          if (route.name === 'Analisis') {
            return <Text style={[styles.tabEmoji, { opacity: focused ? 1 : 0.5 }]}>📋</Text>
          }
          if (route.name === 'Nuevo') {
            return (
              <View style={styles.nuevoIconContainer}>
                <Text style={styles.nuevoIconText}>+</Text>
              </View>
            )
          }
          if (route.name === 'Configuracion') {
            return <Text style={[styles.tabEmoji, { opacity: focused ? 1 : 0.5 }]}>⚙️</Text>
          }
          return null
        },
      })}
    >
      <Tab.Screen
        name="Inicio"
        component={DashboardScreen}
        options={{ tabBarLabel: 'Inicio' }}
      />
      <Tab.Screen
        name="Analisis"
        component={AnalisisNavigator}
        options={{ tabBarLabel: 'Análisis' }}
      />
      <Tab.Screen
        name="Nuevo"
        component={AnalisisNuevoScreen}
        options={{
          tabBarLabel: '',
          tabBarItemStyle: styles.nuevoTab,
        }}
      />
      <Tab.Screen
        name="Configuracion"
        component={ConfiguracionScreen}
        options={{ tabBarLabel: 'Config' }}
      />
    </Tab.Navigator>
  )
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.white,
    borderTopColor: colors.border,
    borderTopWidth: 1,
    height: 72,
    paddingBottom: 10,
    paddingTop: 6,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
  tabEmoji: {
    fontSize: 22,
  },
  nuevoTab: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  nuevoIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  nuevoIconText: {
    fontSize: 30,
    color: colors.white,
    fontWeight: '300',
    lineHeight: 34,
  },
})
