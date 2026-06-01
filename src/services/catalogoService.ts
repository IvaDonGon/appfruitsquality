import { supabase } from './supabaseClient'

export async function listarProductores(empresaId: string) {
  const { data, error } = await supabase
    .from('productores')
    .select('*')
    .eq('empresa_id', empresaId)
    .order('nombre')
  if (error) throw new Error(error.message)
  return data
}

export async function listarEspecies(empresaId: string) {
  const { data, error } = await supabase
    .from('especies')
    .select('*')
    .eq('empresa_id', empresaId)
    .order('nombre')
  if (error) throw new Error(error.message)
  return data
}

export async function listarVariedades(empresaId: string) {
  const { data, error } = await supabase
    .from('variedades')
    .select('*, especies(id, nombre)')
    .eq('empresa_id', empresaId)
    .order('nombre')
  if (error) throw new Error(error.message)
  return data
}

export async function listarDefectosCatalogo(empresaId: string) {
  const { data, error } = await supabase
    .from('defectos_catalogo')
    .select('*')
    .eq('empresa_id', empresaId)
    .eq('activo', true)
    .order('nombre')
  if (error) throw new Error(error.message)
  return data
}
