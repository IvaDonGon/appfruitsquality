import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { AnalisisListScreen } from '../screens/analisis/AnalisisListScreen'
import { AnalisisDetailScreen } from '../screens/analisis/AnalisisDetailScreen'

export type AnalisisStackParamList = {
  AnalisisList: undefined
  AnalisisDetail: { id: string }
}

const Stack = createNativeStackNavigator<AnalisisStackParamList>()

export function AnalisisNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="AnalisisList" component={AnalisisListScreen} />
      <Stack.Screen name="AnalisisDetail" component={AnalisisDetailScreen} />
    </Stack.Navigator>
  )
}
