import React, { useState } from 'react'
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
import { X } from 'lucide-react-native'
import { colors } from '../../../constants/colors'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'
import { useAnalisisFormStore } from '../../../stores/analisisFormStore'

interface Props {
  onNext: () => void
}

interface CalibreRow {
  calibre: string
  cantidad: string
  porcentaje: string
  peso: string
}

const CALIBRES_COMUNES = [
  '36', '40', '48', '56', '64', '72', '80', '88', '96', '100',
  '110', '113', '125', '138', '150', '163', '175', '198', '216',
  'Extra Large', 'Large', 'Medium', 'Small',
]

export function Paso4CalibresScreen({ onNext }: Props) {
  const { calibres, setCalibres } = useAnalisisFormStore()
  const [modalVisible, setModalVisible] = useState(false)
  const [calibrePersonalizado, setCalibrePersonalizado] = useState('')

  function agregarCalibre(nombre: string) {
    if (!nombre.trim()) return
    const yaExiste = (calibres as CalibreRow[]).some((c) => c.calibre === nombre.trim())
    if (yaExiste) return
    const nuevo: CalibreRow = {
      calibre: nombre.trim(),
      cantidad: '',
      porcentaje: '',
      peso: '',
    }
    setCalibres([...calibres, nuevo])
  }

  function actualizarCalibre(index: number, campo: keyof CalibreRow, valor: string) {
    const nuevo = [...(calibres as CalibreRow[])]
    nuevo[index] = { ...nuevo[index], [campo]: valor }
    setCalibres(nuevo)
  }

  function eliminarCalibre(index: number) {
    const nuevo = [...calibres]
    nuevo.splice(index, 1)
    setCalibres(nuevo)
  }

  return (
    <View style={styles.flex}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Calibres ({calibres.length})</Text>
        <Button
          label="+ Agregar"
          onPress={() => setModalVisible(true)}
          variant="secondary"
          size="sm"
        />
      </View>

      <FlatList
        data={calibres as CalibreRow[]}
        keyExtractor={(_, i) => i.toString()}
        contentContainerStyle={styles.list}
        renderItem={({ item, index }) => (
          <View style={styles.calibreCard}>
            <View style={styles.calibreHeader}>
              <Text style={styles.calibreNombre}>{item.calibre}</Text>
              <TouchableOpacity onPress={() => eliminarCalibre(index)} style={{ padding: 4 }}>
                <X size={16} color={colors.danger} />
              </TouchableOpacity>
            </View>
            <View style={styles.calibreCampos}>
              <View style={styles.campoGroup}>
                <Text style={styles.campoLabel}>Cantidad</Text>
                <TextInput
                  style={styles.campoInput}
                  value={item.cantidad}
                  onChangeText={(v) => actualizarCalibre(index, 'cantidad', v)}
                  keyboardType="number-pad"
                  placeholder="0"
                  placeholderTextColor={colors.textTertiary}
                />
              </View>
              <View style={styles.campoGroup}>
                <Text style={styles.campoLabel}>%</Text>
                <TextInput
                  style={styles.campoInput}
                  value={item.porcentaje}
                  onChangeText={(v) => actualizarCalibre(index, 'porcentaje', v)}
                  keyboardType="decimal-pad"
                  placeholder="0"
                  placeholderTextColor={colors.textTertiary}
                />
              </View>
              <View style={styles.campoGroup}>
                <Text style={styles.campoLabel}>Peso (g)</Text>
                <TextInput
                  style={styles.campoInput}
                  value={item.peso}
                  onChangeText={(v) => actualizarCalibre(index, 'peso', v)}
                  keyboardType="decimal-pad"
                  placeholder="0"
                  placeholderTextColor={colors.textTertiary}
                />
              </View>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            Sin calibres. Toca "+ Agregar" para registrar.
          </Text>
        }
      />

      <View style={styles.footer}>
        <Button label="Siguiente →" onPress={onNext} fullWidth size="lg" />
      </View>

      {/* Modal selección calibre */}
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
          <Text style={styles.sheetTitle}>Seleccionar calibre</Text>

          <View style={styles.customRow}>
            <TextInput
              style={styles.customInput}
              value={calibrePersonalizado}
              onChangeText={setCalibrePersonalizado}
              placeholder="Calibre personalizado..."
              placeholderTextColor={colors.textTertiary}
            />
            <Button
              label="Agregar"
              onPress={() => {
                agregarCalibre(calibrePersonalizado)
                setCalibrePersonalizado('')
                setModalVisible(false)
              }}
              size="sm"
              variant="secondary"
            />
          </View>

          <FlatList
            data={CALIBRES_COMUNES}
            keyExtractor={(item) => item}
            numColumns={4}
            contentContainerStyle={styles.gridList}
            renderItem={({ item }) => {
              const sel = (calibres as CalibreRow[]).some((c) => c.calibre === item)
              return (
                <TouchableOpacity
                  style={[styles.gridItem, sel && styles.gridItemSelected]}
                  onPress={() => {
                    agregarCalibre(item)
                    setModalVisible(false)
                  }}
                >
                  <Text style={[styles.gridLabel, sel && styles.gridLabelSelected]}>
                    {item}
                  </Text>
                </TouchableOpacity>
              )
            }}
          />
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
  calibreCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  calibreHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  calibreNombre: { fontSize: 15, fontWeight: '700', color: colors.text },
  removeBtn: { padding: 4 },
  calibreCampos: { flexDirection: 'row', gap: 10 },
  campoGroup: { flex: 1, alignItems: 'center' },
  campoLabel: { fontSize: 11, color: colors.textSecondary, marginBottom: 4 },
  campoInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 8,
    fontSize: 14,
    color: colors.text,
    textAlign: 'center',
  },
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
  customRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  customInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: colors.text,
  },
  gridList: { padding: 12 },
  gridItem: {
    flex: 1,
    margin: 4,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: colors.slate100,
    alignItems: 'center',
  },
  gridItemSelected: { backgroundColor: colors.accentLight },
  gridLabel: { fontSize: 13, fontWeight: '500', color: colors.text },
  gridLabelSelected: { color: colors.accent, fontWeight: '700' },
})
