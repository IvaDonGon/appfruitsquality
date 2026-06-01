import { create } from 'zustand'
import { AnalisisFormData } from '../types'

const FORM_INICIAL: AnalisisFormData = {
  fecha: new Date().toISOString().slice(0, 10),
  hora: '',
  tipo_analisis: 'RECEPCION',
  productor_id: '',
  especie_id: '',
  variedad_id: '',
  lote: '',
  numero_guia: '',
  numero_pallet: '',
  turno: '',
  linea_proceso: '',
  camara: '',
  cliente_destino: '',
  mercado_destino: '',
  observacion_general: '',
  peso_muestra: '',
  cantidad_frutos: '',
  temperatura_pulpa: '',
  temperatura_ambiente: '',
  brix: '',
  firmeza: '',
  color: '',
  condicion_general: '',
  puntaje_final: '',
  categoria_resultado: '',
  decision: '',
  observacion_final: '',
  recomendacion: '',
  estado: 'BORRADOR',
}

interface AnalisisFormState {
  form: AnalisisFormData
  defectos: any[]
  calibres: any[]
  pasoActual: number
  loading: boolean
  updateForm: (fields: Partial<AnalisisFormData>) => void
  setDefectos: (defectos: any[]) => void
  setCalibres: (calibres: any[]) => void
  setPaso: (paso: number) => void
  setLoading: (loading: boolean) => void
  resetForm: () => void
}

export const useAnalisisFormStore = create<AnalisisFormState>((set) => ({
  form: FORM_INICIAL,
  defectos: [],
  calibres: [],
  pasoActual: 0,
  loading: false,
  updateForm: (fields) =>
    set((state) => ({ form: { ...state.form, ...fields } })),
  setDefectos: (defectos) => set({ defectos }),
  setCalibres: (calibres) => set({ calibres }),
  setPaso: (pasoActual) => set({ pasoActual }),
  setLoading: (loading) => set({ loading }),
  resetForm: () =>
    set({
      form: { ...FORM_INICIAL, fecha: new Date().toISOString().slice(0, 10) },
      defectos: [],
      calibres: [],
      pasoActual: 0,
    }),
}))
