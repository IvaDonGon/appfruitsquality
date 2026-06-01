import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardTypeOptions,
  ViewStyle,
} from 'react-native'
import { colors } from '../../constants/colors'

interface InputProps {
  label?: string
  value: string
  onChangeText: (text: string) => void
  placeholder?: string
  error?: string
  keyboardType?: KeyboardTypeOptions
  secureTextEntry?: boolean
  multiline?: boolean
  numberOfLines?: number
  required?: boolean
  suffix?: string
  editable?: boolean
  style?: ViewStyle
}

export function Input({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  keyboardType = 'default',
  secureTextEntry = false,
  multiline = false,
  numberOfLines = 1,
  required = false,
  suffix,
  editable = true,
  style,
}: InputProps) {
  const [focused, setFocused] = useState(false)

  return (
    <View style={[styles.container, style]}>
      {label ? (
        <Text style={styles.label}>
          {label}
          {required ? <Text style={styles.required}> *</Text> : null}
        </Text>
      ) : null}
      <View
        style={[
          styles.inputWrapper,
          focused && styles.inputWrapperFocused,
          !!error && styles.inputWrapperError,
          !editable && styles.inputWrapperDisabled,
        ]}
      >
        <TextInput
          style={[styles.input, multiline && { height: numberOfLines * 42 }]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textTertiary}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
          multiline={multiline}
          numberOfLines={multiline ? numberOfLines : undefined}
          textAlignVertical={multiline ? 'top' : 'center'}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          editable={editable}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {suffix ? <Text style={styles.suffix}>{suffix}</Text> : null}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
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
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 10,
    backgroundColor: colors.white,
    paddingHorizontal: 12,
  },
  inputWrapperFocused: {
    borderColor: colors.accent,
  },
  inputWrapperError: {
    borderColor: colors.danger,
  },
  inputWrapperDisabled: {
    backgroundColor: colors.slate50,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
    paddingVertical: 12,
  },
  suffix: {
    fontSize: 13,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  error: {
    fontSize: 12,
    color: colors.danger,
    marginTop: 4,
  },
})
