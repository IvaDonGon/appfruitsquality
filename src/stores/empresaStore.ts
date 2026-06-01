import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Empresa } from '../types'

interface EmpresaState {
  empresaActiva: Empresa | null
  empresasUsuario: Empresa[]
  setEmpresaActiva: (empresa: Empresa) => void
  setEmpresasUsuario: (empresas: Empresa[]) => void
  limpiar: () => void
}

export const useEmpresaStore = create<EmpresaState>()(
  persist(
    (set) => ({
      empresaActiva:   null,
      empresasUsuario: [],
      setEmpresaActiva:   (empresa) => set({ empresaActiva: empresa }),
      setEmpresasUsuario: (empresas) => set({ empresasUsuario: empresas }),
      limpiar: () => set({ empresaActiva: null, empresasUsuario: [] }),
    }),
    {
      name:    'empresa-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // Solo persiste datos; las funciones no son serializables
      partialize: (state) => ({
        empresaActiva:   state.empresaActiva,
        empresasUsuario: state.empresasUsuario,
      }),
    }
  )
)
