import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { EmpresaSelectScreen } from '../screens/auth/EmpresaSelectScreen'
import { CrearEmpresaScreen } from '../screens/auth/CrearEmpresaScreen'

export type EmpresaOnboardingParamList = {
  EmpresaSelect: undefined
  CrearEmpresa: undefined
}

const Stack = createNativeStackNavigator<EmpresaOnboardingParamList>()

export function EmpresaOnboardingNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="EmpresaSelect" component={EmpresaSelectScreen} />
      <Stack.Screen name="CrearEmpresa" component={CrearEmpresaScreen} />
    </Stack.Navigator>
  )
}
