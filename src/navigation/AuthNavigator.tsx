import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { LoginScreen } from '../screens/auth/LoginScreen'
import { EmpresaSelectScreen } from '../screens/auth/EmpresaSelectScreen'

export type AuthStackParamList = {
  Login: undefined
  EmpresaSelect: undefined
}

const Stack = createNativeStackNavigator<AuthStackParamList>()

export function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="EmpresaSelect" component={EmpresaSelectScreen} />
    </Stack.Navigator>
  )
}
