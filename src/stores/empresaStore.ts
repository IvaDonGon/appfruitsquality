import { create } from 'zustand'
import { Empresa } from '../types'

interface EmpresaState {
  empresaActiva: Empresa | null
  empresasUsuario: Empresa[]
  setEmpresaActiva: (empresa: Empresa) => void
  setEmpresasUsuario: (empresas: Empresa[]) => void
  limpiar: () => void
}

export const useEmpresaStore = create<EmpresaState>((set) => ({
  empresaActiva: null,
  empresasUsuario: [],
  setEmpresaActiva: (empresa) => set({ empresaActiva: empresa }),
  setEmpresasUsuario: (empresas) => set({ empresasUsuario: empresas }),
  limpiar: () => set({ empresaActiva: null, empresasUsuario: [] }),
}))
