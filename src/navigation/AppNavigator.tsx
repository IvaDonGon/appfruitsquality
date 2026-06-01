import React from 'react'
import { View, Text, TouchableOpacity, Platform, StyleSheet } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import { Home, ClipboardList, Plus, Settings } from 'lucide-react-native'
import { DashboardScreen } from '../screens/dashboard/DashboardScreen'
import { AnalisisNavigator } from './AnalisisNavigator'
import { AnalisisNuevoScreen } from '../screens/analisis/nuevo/AnalisisNuevoScreen'
import { ConfiguracionScreen } from '../screens/configuracion/ConfiguracionScreen'
import { EmpresaOnboardingNavigator } from './EmpresaOnboardingNavigator'
import { useEmpresaStore } from '../stores/empresaStore'
import { colors } from '../constants/colors'

export type AppTabParamList = {
  Inicio: undefined
  Analisis: undefined
  Nuevo: undefined
  Configuracion: undefined
}

const Tab = createBottomTabNavigator<AppTabParamList>()

// ─── Íconos y labels por tab ──────────────────────────────────────────────────

const TAB_CONFIG = {
  Inicio:        { Icon: Home,          label: 'Inicio' },
  Analisis:      { Icon: ClipboardList, label: 'Análisis' },
  Nuevo:         { Icon: Plus,          label: 'Nuevo' },
  Configuracion: { Icon: Settings,      label: 'Config' },
} as const

// ─── CustomTabBar ─────────────────────────────────────────────────────────────

function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  return (
    <View style={styles.tabBar}>
      {state.routes.map((route, index) => {
        const focused  = state.index === index
        const isNuevo  = route.name === 'Nuevo'
        const config   = TAB_CONFIG[route.name as keyof typeof TAB_CONFIG]
        const { Icon, label } = config
        const color = focused ? colors.accent : colors.textTertiary

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          })
          if (!focused && !event.defaultPrevented) {
            navigation.navigate(route.name)
          }
        }

        if (isNuevo) {
          return (
            <TouchableOpacity
              key={route.key}
              style={styles.nuevoTab}
              onPress={onPress}
              activeOpacity={0.8}
            >
              <View style={styles.nuevoBtn}>
                <Plus size={26} color={colors.white} strokeWidth={2.5} />
              </View>
              <Text style={styles.nuevoLabel}>Nuevo</Text>
            </TouchableOpacity>
          )
        }

        return (
          <TouchableOpacity
            key={route.key}
            style={styles.tab}
            onPress={onPress}
            activeOpacity={0.7}
          >
            <Icon size={22} color={color} strokeWidth={focused ? 2.5 : 2} />
            <Text style={[styles.tabLabel, { color }]}>{label}</Text>
          </TouchableOpacity>
        )
      })}
    </View>
  )
}

// ─── AppNavigator ─────────────────────────────────────────────────────────────

export function AppNavigator() {
  const { empresaActiva } = useEmpresaStore()

  if (!empresaActiva) {
    return <EmpresaOnboardingNavigator />
  }

  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Inicio"        component={DashboardScreen} />
      <Tab.Screen name="Analisis"      component={AnalisisNavigator} />
      <Tab.Screen name="Nuevo"         component={AnalisisNuevoScreen} />
      <Tab.Screen name="Configuracion" component={ConfiguracionScreen} />
    </Tab.Navigator>
  )
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const tabBarPaddingBottom = Platform.OS === 'ios' ? 20 : 8

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 8,
    paddingBottom: tabBarPaddingBottom,
    paddingHorizontal: 8,
    overflow: 'visible',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    paddingVertical: 2,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
  },
  nuevoTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nuevoBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 3,
    marginTop: -14,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  nuevoLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.accent,
    marginTop: 3,
  },
})
