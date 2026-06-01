import React from 'react'
import { View, StyleSheet } from 'react-native'
import { KeyboardAwareView } from '../../../components/common/KeyboardAwareView'
import { Input } from '../../../components/ui/Input'
import { Button } from '../../../components/ui/Button'
import { useAnalisisFormStore } from '../../../stores/analisisFormStore'

interface Props {
  onNext: () => void
}

export function Paso2ParametrosScreen({ onNext }: Props) {
  const { form, updateForm } = useAnalisisFormStore()

  return (
    <KeyboardAwareView contentStyle={styles.content}>
      <Input
        label="Peso de muestra"
        value={form.peso_muestra}
        onChangeText={(v) => updateForm({ peso_muestra: v })}
        keyboardType="decimal-pad"
        suffix="g"
        placeholder="0"
      />

      <Input
        label="Cantidad de frutos"
        value={form.cantidad_frutos}
        onChangeText={(v) => updateForm({ cantidad_frutos: v })}
        keyboardType="number-pad"
        placeholder="0"
      />

      <Input
        label="Temperatura de pulpa"
        value={form.temperatura_pulpa}
        onChangeText={(v) => updateForm({ temperatura_pulpa: v })}
        keyboardType="decimal-pad"
        suffix="°C"
        placeholder="0.0"
      />

      <Input
        label="Temperatura ambiente"
        value={form.temperatura_ambiente}
        onChangeText={(v) => updateForm({ temperatura_ambiente: v })}
        keyboardType="decimal-pad"
        suffix="°C"
        placeholder="0.0"
      />

      <Input
        label="Brix (°Brix)"
        value={form.brix}
        onChangeText={(v) => updateForm({ brix: v })}
        keyboardType="decimal-pad"
        suffix="°"
        placeholder="0.0"
      />

      <Input
        label="Firmeza"
        value={form.firmeza}
        onChangeText={(v) => updateForm({ firmeza: v })}
        placeholder="Ej: 8.5 libras / firme"
      />

      <Input
        label="Color"
        value={form.color}
        onChangeText={(v) => updateForm({ color: v })}
        placeholder="Descripción del color"
      />

      <Input
        label="Condición general"
        value={form.condicion_general}
        onChangeText={(v) => updateForm({ condicion_general: v })}
        placeholder="Buena / Regular / Deficiente"
      />

      <Input
        label="Observación general"
        value={form.observacion_general}
        onChangeText={(v) => updateForm({ observacion_general: v })}
        placeholder="Observaciones adicionales..."
        multiline
        numberOfLines={3}
      />

      <View style={styles.footer}>
        <Button label="Siguiente →" onPress={onNext} fullWidth size="lg" />
      </View>
    </KeyboardAwareView>
  )
}

const styles = StyleSheet.create({
  content: { padding: 16, paddingBottom: 32 },
  footer: { marginTop: 8 },
})
