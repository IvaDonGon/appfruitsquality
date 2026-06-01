import { useEmpresaStore } from '../stores/empresaStore'

export function useEmpresa() {
  const { empresaActiva, empresasUsuario, setEmpresaActiva, limpiar } = useEmpresaStore()
  return { empresaActiva, empresasUsuario, setEmpresaActiva, limpiar }
}
