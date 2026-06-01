import { supabase } from './supabaseClient'
import { Empresa } from '../types'

export async function crearEmpresaConUsuario({
  userId,
  empresa,
}: {
  userId: string
  empresa: { nombre: string; rut?: string; ciudad?: string }
}): Promise<Empresa> {
  const { data: empresaData, error: empresaError } = await supabase
    .from('empresas')
    .insert({ nombre: empresa.nombre, rut: empresa.rut, ciudad: empresa.ciudad, estado: 'ACTIVO' })
    .select()
    .single()

  if (empresaError) throw new Error(empresaError.message)

  const { error: ueError } = await supabase
    .from('usuarios_empresas')
    .insert({ user_id: userId, empresa_id: empresaData.id, rol: 'ADMIN', estado: 'ACTIVO' })

  if (ueError) throw new Error(ueError.message)

  return { ...empresaData, rol: 'ADMIN' }
}

export async function obtenerEmpresasUsuario(userId: string): Promise<Empresa[]> {
  // Paso 1: obtener empresa_id y rol del usuario en usuarios_empresas
  const { data: ueRows, error: ueError } = await supabase
    .from('usuarios_empresas')
    .select('empresa_id, rol')
    .eq('user_id', userId)
    .eq('estado', 'ACTIVO')

  if (ueError) {
    console.warn('[empresaService] usuarios_empresas error:', ueError.message)
    return []
  }

  if (!ueRows?.length) {
    console.log('[empresaService] sin filas en usuarios_empresas para userId:', userId)
    return []
  }

  console.log('[empresaService] filas en usuarios_empresas:', ueRows.length)

  const ids   = ueRows.map((r: any) => r.empresa_id)
  const roles = Object.fromEntries(
    ueRows.map((r: any) => [r.empresa_id, r.rol ?? 'ANALISTA'])
  )

  // Paso 2: obtener datos de cada empresa por sus IDs
  const { data: empresas, error: eError } = await supabase
    .from('empresas')
    .select('id, nombre, rut, giro, logo_url, color_principal, estado')
    .in('id', ids)

  if (eError) {
    console.warn('[empresaService] empresas error:', eError.message)
    return []
  }

  console.log('[empresaService] empresas encontradas:', empresas?.length ?? 0)

  return (empresas ?? []).map((e: any) => ({
    ...e,
    rol: roles[e.id] ?? 'ANALISTA',
  }))
}
