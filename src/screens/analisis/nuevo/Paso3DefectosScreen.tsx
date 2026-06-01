import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  SafeAreaView,
} from 'react-native'
import { X, Check } from 'lucide-react-native'
import { colors } from '../../../constants/colors'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'
import { useAnalisisFormStore } from '../../../stores/analisisFormStore'
import { useEmpresaStore } from '../../../stores/empresaStore'
import { listarDefectosCatalogo } from '../../../services/catalogoService'
import { DefectoCatalogo } from '../../../types'

interface Props {
  onNext: () => void
}

interface DefectoRow {
  defecto_catalogo_id?: string
  defecto: string
  categoria: string
  porcentaje: string
  observacion: string
}

export function Paso3DefectosScreen({ onNext }: Props) {
  const { defectos, setDefectos } = useAnalisisFormStore()
  const { empresaActiva } = useEmpresaStore()
  const [catalogo, setCatalogo] = useState<DefectoCatalogo[]>([])
  const [modalVisible, setModalVisible] = useState(false)
  const [porcentajes, setPorcentajes] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!empresaActiva) return
    listarDefectosCatalogo(empresaActiva.id)
      .then((data) => setCatalogo(data as DefectoCatalogo[]))
      .catch(() => {})
  }, [empresaActiva])

  function isSelected(id: string) {
    return defectos.some((d: DefectoRow) => d.defecto_catalogo_id === id)
  }

  function toggleDefecto(item: DefectoCatalogo) {
    if (isSelected(item.id)) {
      setDefectos(defectos.filter((d: DefectoRow) => d.defecto_catalogo_id !== item.id))
    } else {
      const nuevo: DefectoRow = {
        defecto_catalogo_id: item.id,
        defecto: item.nombre,
        categoria: item.tipo,
        porcentaje: '',
        observacion: '',
      }
      setDefectos([...defectos, nuevo])
    }
  }

  function actualizarPct(id: string, pct: string) {
    setDefectos(
      defectos.map((d: DefectoRow) =>
        d.defecto_catalogo_id === id ? { ...d, porcentaje: pct } : d,
      ),
    )
  }

  return (
    <View style={styles.flex}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Defectos registrados ({defectos.length})</Text>
        <Button
          label="+ Agregar"
          onPress={() => setModalVisible(true)}
          variant="secondary"
          size="sm"
        />
      </View>

      <FlatList
        data={defectos as DefectoRow[]}
        keyExtractor={(_, i) => i.toString()}
        contentContainerStyle={styles.list}
        renderItem={({ item, index }) => (
          <View style={styles.defectoCard}>
            <View style={styles.defectoRow}>
              <View style={styles.defectoInfo}>
                <Text style={styles.defectoNombre}>{item.defecto}</Text>
                <Text style={styles.defectoCategoria}>{item.categoria}</Text>
              </View>
              <View style={styles.pctInput}>
                <TextInput
                  style={styles.pctField}
                  value={item.porcentaje}
                  onChangeText={(v) => actualizarPct(item.defecto_catalogo_id!, v)}
                  keyboardType="decimal-pad"
                  placeholder="0"
                  placeholderTextColor={colors.textTertiary}
                />
                <Text style={styles.pctSuffix}>%</Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  const nuevo = [...defectos]
                  nuevo.splice(index, 1)
                  setDefectos(nuevo)
                }}
                style={styles.removeBtn}
              >
                <X size={16} color={colors.danger} />
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            Sin defectos registrados. Toca "+ Agregar" para seleccionar del catálogo.
          </Text>
        }
      />

      <View style={styles.footer}>
        <Button label="Siguiente →" onPress={onNext} fullWidth size="lg" />
      </View>

      {/* Modal catálogo */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        />
        <SafeAreaView style={styles.sheet}>
          <View style={styles.sheetHandle} />
          <Text style={styles.sheetTitle}>Catálogo de defectos</Text>
          <FlatList
            data={catalogo}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              const sel = isSelected(item.id)
              return (
                <TouchableOpacity
                  style={[styles.catalogoItem, sel && styles.catalogoItemSelected]}
                  onPress={() => toggleDefecto(item)}
                >
                  <View style={styles.catalogoInfo}>
                    <Text style={[styles.catalogoNombre, sel && styles.catalogoNombreSelected]}>
                      {item.nombre}
                    </Text>
                    <Text style={styles.catalogoTipo}>{item.tipo}</Text>
                  </View>
                  {sel ? <Check size={16} color={colors.accent} /> : null}
                </TouchableOpacity>
              )
            }}
            ItemSeparatorComponent={() => <View style={styles.sep} />}
          />
          <View style={styles.sheetFooter}>
            <Button
              label={`Confirmar (${defectos.length})`}
              onPress={() => setModalVisible(false)}
              fullWidth
            />
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  headerTitle: { fontSize: 15, fontWeight: '600', color: colors.text },
  list: { padding: 16, gap: 10, flexGrow: 1 },
  defectoCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  defectoRow: { flexDirection: 'row', alignItems: 'center' },
  defectoInfo: { flex: 1 },
  defectoNombre: { fontSize: 14, fontWeight: '600', color: colors.text },
  defectoCategoria: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  pctInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginHorizontal: 10,
    minWidth: 70,
  },
  pctField: { fontSize: 15, color: colors.text, paddingVertical: 6, width: 44, textAlign: 'right' },
  pctSuffix: { fontSize: 13, color: colors.textSecondary },
  removeBtn: { padding: 6 },
  emptyText: {
    textAlign: 'center',
    color: colors.textSecondary,
    fontSize: 14,
    paddingVertical: 40,
    lineHeight: 22,
  },
  footer: { padding: 16 },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)' },
  sheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
  },
  sheetHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 6,
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  catalogoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  catalogoItemSelected: { backgroundColor: colors.accentLight },
  catalogoInfo: { flex: 1 },
  catalogoNombre: { fontSize: 14, color: colors.text },
  catalogoNombreSelected: { color: colors.accent, fontWeight: '600' },
  catalogoTipo: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  sep: { height: 1, backgroundColor: colors.borderLight, marginHorizontal: 20 },
  sheetFooter: { padding: 16 },
})
