import React, { useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  SafeAreaView,
  ViewStyle,
} from 'react-native'
import { ChevronDown, Check } from 'lucide-react-native'
import { colors } from '../../constants/colors'

interface Option {
  value: string
  label: string
}

interface SelectProps {
  label?: string
  value: string
  onValueChange: (value: string) => void
  options: Option[]
  placeholder?: string
  error?: string
  required?: boolean
  style?: ViewStyle
}

export function Select({
  label,
  value,
  onValueChange,
  options,
  placeholder = 'Seleccionar...',
  error,
  required = false,
  style,
}: SelectProps) {
  const [visible, setVisible] = useState(false)
  const selected = options.find((o) => o.value === value)

  return (
    <View style={[styles.container, style]}>
      {label ? (
        <Text style={styles.label}>
          {label}
          {required ? <Text style={styles.required}> *</Text> : null}
        </Text>
      ) : null}

      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => setVisible(true)}
        style={[styles.trigger, !!error && styles.triggerError]}
      >
        <Text style={[styles.triggerText, !selected && styles.placeholder]}>
          {selected ? selected.label : placeholder}
        </Text>
        <ChevronDown size={18} color={colors.textSecondary} />
      </TouchableOpacity>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={() => setVisible(false)}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setVisible(false)}
        />
        <SafeAreaView style={styles.sheet}>
          <View style={styles.sheetHandle} />
          {label ? (
            <Text style={styles.sheetTitle}>{label}</Text>
          ) : null}
          <FlatList
            data={options}
            keyExtractor={(item) => item.value}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.option}
                onPress={() => {
                  onValueChange(item.value)
                  setVisible(false)
                }}
              >
                <Text
                  style={[
                    styles.optionText,
                    item.value === value && styles.optionTextSelected,
                  ]}
                >
                  {item.label}
                </Text>
                {item.value === value ? (
                  <Check size={16} color={colors.accent} />
                ) : null}
              </TouchableOpacity>
            )}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        </SafeAreaView>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 14,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 6,
  },
  required: {
    color: colors.danger,
  },
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 10,
    backgroundColor: colors.white,
    paddingHorizontal: 12,
    paddingVertical: 13,
  },
  triggerError: {
    borderColor: colors.danger,
  },
  triggerText: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
  },
  placeholder: {
    color: colors.textTertiary,
  },
  error: {
    fontSize: 12,
    color: colors.danger,
    marginTop: 4,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  sheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '60%',
    paddingBottom: 16,
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
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  optionText: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
  },
  optionTextSelected: {
    color: colors.accent,
    fontWeight: '600',
  },
  separator: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginHorizontal: 20,
  },
})
