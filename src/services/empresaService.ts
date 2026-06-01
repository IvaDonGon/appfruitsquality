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
  const { data, error } = await supabase
    .from('usuarios_empresas')
    .select(`
      id, estado, empresa_id, rol,
      empresas (
        id, nombre, rut, giro, email,
        telefono, direccion, ciudad, pais,
        logo_url, color_principal, estado
      )
    `)
    .eq('user_id', userId)
    .eq('estado', 'ACTIVO')

  if (error) {
    console.warn('obtenerEmpresasUsuario error:', error.message)
    return []
  }

  return (data ?? [])
    .filter((item: any) => item.empresas)
    .map((item: any) => ({ ...item.empresas, rol: item.rol ?? 'ANALISTA' }))
}
