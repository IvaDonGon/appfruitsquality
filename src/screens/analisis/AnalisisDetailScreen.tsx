import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from 'react-native'
import { useRoute, useNavigation } from '@react-navigation/native'
import { colors } from '../../constants/colors'
import { Card } from '../../components/ui/Card'
import { LoadingScreen } from '../../components/ui/LoadingScreen'
import { Alert } from '../../components/ui/Alert'
import { EstadoBadge } from '../../components/analisis/EstadoBadge'
import { DecisionBadge } from '../../components/analisis/DecisionBadge'
import { AppHeader } from '../../components/common/AppHeader'
import {
  obtenerAnalisis,
  obtenerDefectosAnalisis,
  obtenerCalibresAnalisis,
} from '../../services/analisisService'
import { Analisis, DefectoAnalisis, CalibreAnalisis } from '../../types'
import { TIPO_ANALISIS_LABEL } from '../../constants/tiposAnalisis'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

export function AnalisisDetailScreen() {
  const route = useRoute<any>()
  const navigation = useNavigation()
  const { id } = route.params as { id: string }

  const [analisis, setAnalisis] = useState<Analisis | null>(null)
  const [defectos, setDefectos] = useState<DefectoAnalisis[]>([])
  const [calibres, setCalibres] = useState<CalibreAnalisis[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function cargar() {
      try {
        const [a, d, c] = await Promise.all([
          obtenerAnalisis(id),
          obtenerDefectosAnalisis(id),
          obtenerCalibresAnalisis(id),
        ])
        setAnalisis(a)
        setDefectos(d)
        setCalibres(c)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    cargar()
  }, [id])

  if (loading) return <LoadingScreen message="Cargando análisis..." />

  return (
    <SafeAreaView style={styles.safe}>
      <AppHeader
        title="Detalle de análisis"
        leftAction={{ label: '‹ Volver', onPress: () => navigation.goBack() }}
      />

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {error ? (
          <View style={styles.pad}>
            <Alert message={error} variant="error" />
          </View>
        ) : null}

        {analisis ? (
          <>
            {/* Estado y decisión */}
            <Card style={styles.card}>
              <View style={styles.badgeRow}>
                <EstadoBadge estado={analisis.estado} />
                {analisis.decision ? (
                  <DecisionBadge decision={analisis.decision} />
                ) : null}
              </View>
              <Text style={styles.tipoTitle}>
                {TIPO_ANALISIS_LABEL[analisis.tipo_analisis] ?? analisis.tipo_analisis}
              </Text>
              <Text style={styles.fechaText}>
                {formatFecha(analisis.fecha)}
                {analisis.hora ? ` · ${analisis.hora}` : ''}
              </Text>
            </Card>

            {/* Identificación */}
            <SectionCard title="Identificación">
              <Row label="Productor" value={analisis.productores?.nombre} />
              <Row label="Especie" value={analisis.especies?.nombre} />
              <Row label="Variedad" value={analisis.variedades?.nombre} />
              <Row label="Lote" value={analisis.lote} />
              <Row label="N° Pallet" value={analisis.numero_pallet} />
              <Row label="N° Guía" value={analisis.numero_guia} />
            </SectionCard>

            {/* Parámetros */}
            <SectionCard title="Parámetros">
              <Row label="Brix" value={analisis.brix?.toString()} suffix="°" />
              <Row label="Firmeza" value={analisis.firmeza} />
              <Row label="Temp. pulpa" value={analisis.temperatura_pulpa?.toString()} suffix="°C" />
              <Row label="Temp. ambiente" value={analisis.temperatura_ambiente?.toString()} suffix="°C" />
              <Row label="Color" value={analisis.color} />
              <Row label="Condición" value={analisis.condicion_general} />
              <Row label="Peso muestra" value={analisis.peso_muestra?.toString()} suffix="g" />
              <Row label="N° frutos" value={analisis.cantidad_frutos?.toString()} />
            </SectionCard>

            {/* Defectos */}
            {defectos.length > 0 ? (
              <SectionCard title={`Defectos (${defectos.length})`}>
                {defectos.map((d) => (
                  <View key={d.id} style={styles.defectoRow}>
                    <View style={styles.defectoInfo}>
                      <Text style={styles.defectoNombre}>
                        {d.defectos_catalogo?.nombre ?? d.defecto}
                      </Text>
                      <Text style={styles.defectoCategoria}>{d.categoria}</Text>
                    </View>
                    {d.porcentaje != null ? (
                      <Text style={styles.defectoPct}>{d.porcentaje}%</Text>
                    ) : null}
                  </View>
                ))}
              </SectionCard>
            ) : null}

            {/* Calibres */}
            {calibres.length > 0 ? (
              <SectionCard title={`Calibres (${calibres.length})`}>
                <View style={styles.calibresRow}>
                  {calibres.map((c) => (
                    <View key={c.id} style={styles.calibreChip}>
                      <Text style={styles.calibreLabel}>{c.calibre}</Text>
                      {c.porcentaje != null ? (
                        <Text style={styles.calibrePct}>{c.porcentaje}%</Text>
                      ) : null}
                    </View>
                  ))}
                </View>
              </SectionCard>
            ) : null}

            {/* Resultado */}
            <SectionCard title="Resultado">
              <Row label="Puntaje final" value={analisis.puntaje_final?.toString()} />
              <Row label="Categoría" value={analisis.categoria_resultado} />
              <Row label="Observación final" value={analisis.observacion_final} />
              <Row label="Recomendación" value={analisis.recomendacion} />
            </SectionCard>
          </>
        ) : null}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  )
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card style={styles.card}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </Card>
  )
}

function Row({ label, value, suffix }: { label: string; value?: string | null; suffix?: string }) {
  if (!value) return null
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>
        {value}{suffix ?? ''}
      </Text>
    </View>
  )
}

function formatFecha(fecha: string) {
  try {
    return format(new Date(fecha + 'T00:00:00'), "d 'de' MMMM yyyy", { locale: es })
  } catch {
    return fecha
  }
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
  pad: { padding: 16 },
  card: { marginHorizontal: 16, marginTop: 12 },
  badgeRow: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  tipoTitle: { fontSize: 20, fontWeight: '700', color: colors.text, marginBottom: 4 },
  fechaText: { fontSize: 13, color: colors.textSecondary },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  rowLabel: { fontSize: 14, color: colors.textSecondary, flex: 1 },
  rowValue: { fontSize: 14, color: colors.text, fontWeight: '500', flex: 1, textAlign: 'right' },
  defectoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  defectoInfo: { flex: 1 },
  defectoNombre: { fontSize: 14, color: colors.text, fontWeight: '500' },
  defectoCategoria: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  defectoPct: { fontSize: 15, fontWeight: '700', color: colors.danger },
  calibresRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  calibreChip: {
    backgroundColor: colors.accentLight,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: 'center',
    minWidth: 70,
  },
  calibreLabel: { fontSize: 14, fontWeight: '700', color: colors.accent },
  calibrePct: { fontSize: 11, color: colors.accent, marginTop: 2 },
})
