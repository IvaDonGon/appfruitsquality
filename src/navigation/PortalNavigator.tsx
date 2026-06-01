import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { PortalDashboardScreen } from '../screens/portal/PortalDashboardScreen'
import { PortalAnalisisDetailScreen } from '../screens/portal/PortalAnalisisDetailScreen'

export type PortalStackParamList = {
  PortalDashboard: undefined
  PortalAnalisisDetail: { id: string }
}

const Stack = createNativeStackNavigator<PortalStackParamList>()

export function PortalNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="PortalDashboard" component={PortalDashboardScreen} />
      <Stack.Screen name="PortalAnalisisDetail" component={PortalAnalisisDetailScreen} />
    </Stack.Navigator>
  )
}
