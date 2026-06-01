import React from 'react'
import { View, StyleSheet } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { DashboardScreen } from '../screens/dashboard/DashboardScreen'
import { AnalisisNavigator } from './AnalisisNavigator'
import { AnalisisNuevoScreen } from '../screens/analisis/nuevo/AnalisisNuevoScreen'
import { ConfiguracionScreen } from '../screens/configuracion/ConfiguracionScreen'
import { colors } from '../constants/colors'

export type AppTabParamList = {
  Inicio: undefined
  Analisis: undefined
  Nuevo: undefined
  Configuracion: undefined
}

const Tab = createBottomTabNavigator<AppTabParamList>()

export function AppNavigator() {
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
            return <Icon name="home-outline" size={24} color={color} />
          }
          if (route.name === 'Analisis') {
            return <Icon name="clipboard-list-outline" size={24} color={color} />
          }
          if (route.name === 'Nuevo') {
            return (
              <View style={styles.nuevoIconContainer}>
                <Icon name="plus" size={28} color={colors.white} />
              </View>
            )
          }
          if (route.name === 'Configuracion') {
            return <Icon name="cog-outline" size={24} color={color} />
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
})
