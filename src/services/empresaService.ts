import { supabase } from './supabaseClient'
import { Empresa } from '../types'

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
