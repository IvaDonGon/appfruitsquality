import React, { useEffect, useState } from 'react'
import { View, StyleSheet } from 'react-native'
import { KeyboardAwareView } from '../../../components/common/KeyboardAwareView'
import { Input } from '../../../components/ui/Input'
import { Select } from '../../../components/ui/Select'
import { Button } from '../../../components/ui/Button'
import { Alert } from '../../../components/ui/Alert'
import { useAnalisisFormStore } from '../../../stores/analisisFormStore'
import { useEmpresaStore } from '../../../stores/empresaStore'
import {
  listarProductores,
  listarEspecies,
  listarVariedades,
} from '../../../services/catalogoService'
import { TIPO_ANALISIS_OPTIONS } from '../../../constants/tiposAnalisis'
import { Productor, Especie, Variedad } from '../../../types'

interface Props {
  onNext: () => void
}

export function Paso1DatosScreen({ onNext }: Props) {
  const { form, updateForm } = useAnalisisFormStore()
  const { empresaActiva } = useEmpresaStore()

  const [productores, setProductores] = useState<Productor[]>([])
  const [especies, setEspecies] = useState<Especie[]>([])
  const [variedades, setVariedades] = useState<Variedad[]>([])
  const [variedadesFiltradas, setVariedadesFiltradas] = useState<Variedad[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    if (!empresaActiva) return
    Promise.all([
      listarProductores(empresaActiva.id),
      listarEspecies(empresaActiva.id),
      listarVariedades(empresaActiva.id),
    ]).then(([p, e, v]) => {
      setProductores(p as Productor[])
      setEspecies(e as Especie[])
      setVariedades(v as Variedad[])
    }).catch(() => {})
  }, [empresaActiva])

  useEffect(() => {
    if (form.especie_id) {
      setVariedadesFiltradas(variedades.filter((v) => v.especie_id === form.especie_id))
    } else {
      setVariedadesFiltradas(variedades)
    }
  }, [form.especie_id, variedades])

  function validar() {
    if (!form.tipo_analisis) {
      setError('El tipo de análisis es obligatorio.')
      return false
    }
    if (!form.fecha) {
      setError('La fecha es obligatoria.')
      return false
    }
    setError('')
    return true
  }

  return (
    <KeyboardAwareView contentStyle={styles.content}>
      {error ? <Alert message={error} variant="error" /> : null}

      <Input
        label="Fecha"
        value={form.fecha}
        onChangeText={(v) => updateForm({ fecha: v })}
        placeholder="AAAA-MM-DD"
        required
      />

      <Input
        label="Hora"
        value={form.hora}
        onChangeText={(v) => updateForm({ hora: v })}
        placeholder="HH:MM"
        keyboardType="numbers-and-punctuation"
      />

      <Select
        label="Tipo de análisis"
        value={form.tipo_analisis}
        onValueChange={(v) => updateForm({ tipo_analisis: v })}
        options={TIPO_ANALISIS_OPTIONS}
        required
      />

      <Select
        label="Productor"
        value={form.productor_id}
        onValueChange={(v) => updateForm({ productor_id: v })}
        options={productores.map((p) => ({ value: p.id, label: p.nombre }))}
        placeholder="Seleccionar productor..."
      />

      <Select
        label="Especie"
        value={form.especie_id}
        onValueChange={(v) => updateForm({ especie_id: v, variedad_id: '' })}
        options={especies.map((e) => ({ value: e.id, label: e.nombre }))}
        placeholder="Seleccionar especie..."
      />

      <Select
        label="Variedad"
        value={form.variedad_id}
        onValueChange={(v) => updateForm({ variedad_id: v })}
        options={variedadesFiltradas.map((v) => ({ value: v.id, label: v.nombre }))}
        placeholder="Seleccionar variedad..."
      />

      <Input
        label="Lote"
        value={form.lote}
        onChangeText={(v) => updateForm({ lote: v })}
        placeholder="Número de lote"
      />

      <Input
        label="N° Guía de despacho"
        value={form.numero_guia}
        onChangeText={(v) => updateForm({ numero_guia: v })}
        placeholder="Número de guía"
        keyboardType="numeric"
      />

      <Input
        label="N° Pallet"
        value={form.numero_pallet}
        onChangeText={(v) => updateForm({ numero_pallet: v })}
        placeholder="Número de pallet"
        keyboardType="numeric"
      />

      <Input
        label="Turno"
        value={form.turno}
        onChangeText={(v) => updateForm({ turno: v })}
        placeholder="Mañana / Tarde / Noche"
      />

      <View style={styles.footer}>
        <Button
          label="Siguiente →"
          onPress={() => validar() && onNext()}
          fullWidth
          size="lg"
        />
      </View>
    </KeyboardAwareView>
  )
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  footer: {
    marginTop: 8,
  },
})
