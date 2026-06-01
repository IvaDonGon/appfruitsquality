import { supabase } from './supabaseClient'
import { Analisis, DefectoAnalisis, CalibreAnalisis, AnalisisFormData } from '../types'

export async function listarAnalisisCalidad(
  empresaId: string,
  filtros?: { estado?: string; busqueda?: string },
): Promise<Analisis[]> {
  let query = supabase
    .from('analisis_calidad')
    .select(`
      id, empresa_id, fecha, hora, tipo_analisis, estado, decision,
      productor_id, especie_id, variedad_id, lote, numero_pallet, numero_guia,
      brix, firmeza, temperatura_pulpa, temperatura_ambiente,
      color, condicion_general, peso_muestra, cantidad_frutos,
      puntaje_final, categoria_resultado, observacion_final, recomendacion,
      creado_por, created_at,
      productores(nombre), especies(nombre), variedades(nombre)
    `)
    .eq('empresa_id', empresaId)
    .order('created_at', { ascending: false })

  if (filtros?.estado && filtros.estado !== 'TODOS') {
    query = query.eq('estado', filtros.estado)
  }

  const { data, error } = await query
  if (error) throw new Error(error.message)
  return data as Analisis[]
}

export async function obtenerAnalisis(id: string): Promise<Analisis> {
  const { data, error } = await supabase
    .from('analisis_calidad')
    .select(`
      *,
      productores(nombre), especies(nombre), variedades(nombre)
    `)
    .eq('id', id)
    .single()
  if (error) throw new Error(error.message)
  return data as Analisis
}

export async function obtenerDefectosAnalisis(analisisId: string): Promise<DefectoAnalisis[]> {
  const { data, error } = await supabase
    .from('defectos_analisis')
    .select('*, defectos_catalogo(nombre, tipo, tolerancia_porcentaje, bloquea_aprobacion)')
    .eq('analisis_id', analisisId)
  if (error) throw new Error(error.message)
  return data as DefectoAnalisis[]
}

export async function obtenerCalibresAnalisis(analisisId: string): Promise<CalibreAnalisis[]> {
  const { data, error } = await supabase
    .from('calibres_analisis')
    .select('*')
    .eq('analisis_id', analisisId)
  if (error) throw new Error(error.message)
  return data as CalibreAnalisis[]
}

export async function obtenerResumenDashboard(empresaId: string) {
  const hoy = new Date().toISOString().slice(0, 10)

  const { data, error } = await supabase
    .from('analisis_calidad')
    .select('id, estado, decision, fecha')
    .eq('empresa_id', empresaId)

  if (error) throw new Error(error.message)

  const todos = data ?? []
  const hoyAnalisis = todos.filter((a) => a.fecha === hoy)

  return {
    totalHoy: hoyAnalisis.length,
    pendientes: todos.filter((a) => a.estado === 'EN_REVISION').length,
    aprobados: todos.filter(
      (a) =>
        a.decision === 'APTO_EXPORTACION' ||
        a.decision === 'APTO_MERCADO_INTERNO' ||
        a.decision === 'LIBERAR_LOTE',
    ).length,
    rechazados: todos.filter(
      (a) => a.decision === 'RECHAZADO' || a.decision === 'RETENER_LOTE',
    ).length,
    ultimos: todos.slice(0, 5),
  }
}

export async function crearAnalisis(
  empresaId: string,
  userId: string,
  form: AnalisisFormData,
  defectos: Omit<DefectoAnalisis, 'id' | 'empresa_id' | 'analisis_id'>[],
  calibres: Omit<CalibreAnalisis, 'id' | 'empresa_id' | 'analisis_id'>[],
): Promise<string> {
  const payload = {
    empresa_id: empresaId,
    creado_por: userId,
    fecha: form.fecha,
    hora: form.hora || null,
    tipo_analisis: form.tipo_analisis,
    estado: form.estado,
    decision: form.decision || null,
    productor_id: form.productor_id || null,
    especie_id: form.especie_id || null,
    variedad_id: form.variedad_id || null,
    lote: form.lote || null,
    numero_guia: form.numero_guia || null,
    numero_pallet: form.numero_pallet || null,
    turno: form.turno || null,
    linea_proceso: form.linea_proceso || null,
    camara: form.camara || null,
    cliente_destino: form.cliente_destino || null,
    mercado_destino: form.mercado_destino || null,
    observacion_general: form.observacion_general || null,
    peso_muestra: form.peso_muestra ? parseFloat(form.peso_muestra) : null,
    cantidad_frutos: form.cantidad_frutos ? parseInt(form.cantidad_frutos, 10) : null,
    temperatura_pulpa: form.temperatura_pulpa ? parseFloat(form.temperatura_pulpa) : null,
    temperatura_ambiente: form.temperatura_ambiente ? parseFloat(form.temperatura_ambiente) : null,
    brix: form.brix ? parseFloat(form.brix) : null,
    firmeza: form.firmeza || null,
    color: form.color || null,
    condicion_general: form.condicion_general || null,
    puntaje_final: form.puntaje_final ? parseFloat(form.puntaje_final) : null,
    categoria_resultado: form.categoria_resultado || null,
    observacion_final: form.observacion_final || null,
    recomendacion: form.recomendacion || null,
  }

  const { data, error } = await supabase
    .from('analisis_calidad')
    .insert(payload)
    .select('id')
    .single()

  if (error) throw new Error(error.message)
  const analisisId = data.id as string

  if (defectos.length > 0) {
    const defectosPayload = defectos.map((d) => ({
      ...d,
      empresa_id: empresaId,
      analisis_id: analisisId,
    }))
    const { error: errDef } = await supabase.from('defectos_analisis').insert(defectosPayload)
    if (errDef) throw new Error(errDef.message)
  }

  if (calibres.length > 0) {
    const calibresPayload = calibres.map((c) => ({
      ...c,
      empresa_id: empresaId,
      analisis_id: analisisId,
    }))
    const { error: errCal } = await supabase.from('calibres_analisis').insert(calibresPayload)
    if (errCal) throw new Error(errCal.message)
  }

  return analisisId
}

export async function actualizarEstadoAnalisis(
  id: string,
  estado: string,
  decision?: string,
) {
  const { error } = await supabase
    .from('analisis_calidad')
    .update({ estado, decision: decision ?? null })
    .eq('id', id)
  if (error) throw new Error(error.message)
}
