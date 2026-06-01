import React, { useEffect } from 'react'
import { View, StyleSheet, SafeAreaView } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { colors } from '../../../constants/colors'
import { ProgressBar } from '../../../components/ui/ProgressBar'
import { AppHeader } from '../../../components/common/AppHeader'
import { useAnalisisFormStore } from '../../../stores/analisisFormStore'
import { Paso1DatosScreen } from './Paso1DatosScreen'
import { Paso2ParametrosScreen } from './Paso2ParametrosScreen'
import { Paso3DefectosScreen } from './Paso3DefectosScreen'
import { Paso4CalibresScreen } from './Paso4CalibresScreen'
import { Paso5ResultadoScreen } from './Paso5ResultadoScreen'

const PASOS = ['Datos', 'Parámetros', 'Defectos', 'Calibres', 'Resultado']

export function AnalisisNuevoScreen() {
  const navigation = useNavigation()
  const { pasoActual, setPaso, resetForm } = useAnalisisFormStore()

  useEffect(() => {
    resetForm()
    return () => {
      // Limpia al desmontar
    }
  }, [])

  function handleAtras() {
    if (pasoActual === 0) {
      navigation.goBack()
    } else {
      setPaso(pasoActual - 1)
    }
  }

  function siguientePaso() {
    if (pasoActual < PASOS.length - 1) {
      setPaso(pasoActual + 1)
    }
  }

  const pasoComponent = [
    <Paso1DatosScreen key="p1" onNext={siguientePaso} />,
    <Paso2ParametrosScreen key="p2" onNext={siguientePaso} />,
    <Paso3DefectosScreen key="p3" onNext={siguientePaso} />,
    <Paso4CalibresScreen key="p4" onNext={siguientePaso} />,
    <Paso5ResultadoScreen key="p5" />,
  ]

  return (
    <SafeAreaView style={styles.safe}>
      <AppHeader
        title="Nuevo análisis"
        leftAction={{ label: pasoActual === 0 ? '✕ Cancelar' : '‹ Atrás', onPress: handleAtras }}
      />
      <ProgressBar pasos={PASOS} pasoActual={pasoActual} />
      <View style={styles.content}>
        {pasoComponent[pasoActual]}
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { flex: 1 },
})
