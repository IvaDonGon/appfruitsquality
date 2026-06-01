import React, { useState } from 'react'
import { View, StyleSheet, Alert as RNAlert } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { KeyboardAwareView } from '../../../components/common/KeyboardAwareView'
import { Input } from '../../../components/ui/Input'
import { Select } from '../../../components/ui/Select'
import { Button } from '../../../components/ui/Button'
import { Alert } from '../../../components/ui/Alert'
import { useAnalisisFormStore } from '../../../stores/analisisFormStore'
import { useEmpresaStore } from '../../../stores/empresaStore'
import { useAuthStore } from '../../../stores/authStore'
import { crearAnalisis } from '../../../services/analisisService'
import { DECISION_OPTIONS } from '../../../constants/decisiones'

const ESTADO_OPTIONS = [
  { value: 'BORRADOR',    label: 'Borrador' },
  { value: 'EN_REVISION', label: 'En revisión' },
  { value: 'APROBADO',    label: 'Aprobado' },
  { value: 'RECHAZADO',   label: 'Rechazado' },
]

const CATEGORIA_OPTIONS = [
  { value: 'PREMIUM',  label: 'Premium' },
  { value: 'PRIMERA',  label: 'Primera' },
  { value: 'SEGUNDA',  label: 'Segunda' },
  { value: 'TERCERA',  label: 'Tercera' },
  { value: 'DESCARTE', label: 'Descarte' },
]

export function Paso5ResultadoScreen() {
  const navigation = useNavigation<any>()
  const { form, defectos, calibres, updateForm, loading, setLoading, resetForm } =
    useAnalisisFormStore()
  const { empresaActiva } = useEmpresaStore()
  const { user } = useAuthStore()
  const [error, setError] = useState('')

  async function guardar() {
    if (!empresaActiva || !user) return
    setLoading(true)
    setError('')
    try {
      const defectosPayload = defectos.map((d: any) => ({
        defecto_catalogo_id: d.defecto_catalogo_id || undefined,
        defecto: d.defecto,
        categoria: d.categoria,
        porcentaje: d.porcentaje ? parseFloat(d.porcentaje) : undefined,
        observacion: d.observacion || undefined,
      }))

      const calibresPayload = calibres.map((c: any) => ({
        calibre: c.calibre,
        cantidad: c.cantidad ? parseInt(c.cantidad, 10) : undefined,
        porcentaje: c.porcentaje ? parseFloat(c.porcentaje) : undefined,
        peso: c.peso ? parseFloat(c.peso) : undefined,
      }))

      const id = await crearAnalisis(
        empresaActiva.id,
        user.id,
        form,
        defectosPayload,
        calibresPayload,
      )

      resetForm()

      RNAlert.alert(
        'Análisis guardado',
        'El análisis fue registrado exitosamente.',
        [
          {
            text: 'Ver detalle',
            onPress: () =>
              navigation.replace('Analisis', {
                screen: 'AnalisisDetail',
                params: { id },
              }),
          },
          {
            text: 'Nuevo análisis',
            onPress: () => navigation.replace('Nuevo'),
          },
          {
            text: 'Ir al inicio',
            style: 'cancel',
            onPress: () => navigation.navigate('Inicio'),
          },
        ],
      )
    } catch (err: any) {
      setError(err.message ?? 'Error al guardar el análisis.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <KeyboardAwareView contentStyle={styles.content}>
      {error ? <Alert message={error} variant="error" /> : null}

      <Input
        label="Puntaje final"
        value={form.puntaje_final}
        onChangeText={(v) => updateForm({ puntaje_final: v })}
        keyboardType="decimal-pad"
        placeholder="0 – 100"
      />

      <Select
        label="Categoría de resultado"
        value={form.categoria_resultado}
        onValueChange={(v) => updateForm({ categoria_resultado: v })}
        options={CATEGORIA_OPTIONS}
        placeholder="Seleccionar categoría..."
      />

      <Select
        label="Decisión"
        value={form.decision}
        onValueChange={(v) => updateForm({ decision: v })}
        options={DECISION_OPTIONS}
        placeholder="Seleccionar decisión..."
      />

      <Input
        label="Observación final"
        value={form.observacion_final}
        onChangeText={(v) => updateForm({ observacion_final: v })}
        placeholder="Observaciones del resultado..."
        multiline
        numberOfLines={3}
      />

      <Input
        label="Recomendación"
        value={form.recomendacion}
        onChangeText={(v) => updateForm({ recomendacion: v })}
        placeholder="Recomendaciones para el lote..."
        multiline
        numberOfLines={3}
      />

      <Select
        label="Estado"
        value={form.estado}
        onValueChange={(v) => updateForm({ estado: v })}
        options={ESTADO_OPTIONS}
        required
      />

      <View style={styles.footer}>
        <Button
          label={loading ? 'Guardando...' : 'Guardar análisis'}
          onPress={guardar}
          loading={loading}
          fullWidth
          size="lg"
        />
      </View>
    </KeyboardAwareView>
  )
}

const styles = StyleSheet.create({
  content: { padding: 16, paddingBottom: 32 },
  footer: { marginTop: 8 },
})
