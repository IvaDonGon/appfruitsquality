import { create } from 'zustand'
import { supabase } from '../services/supabaseClient'

interface AuthState {
  user: any | null
  session: any | null
  loading: boolean
  setUser: (user: any) => void
  setSession: (session: any) => void
  setLoading: (loading: boolean) => void
  logout: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  loading: true,
  setUser: (user) => set({ user }),
  setSession: (session) => set({ session, user: session?.user ?? null }),
  setLoading: (loading) => set({ loading }),
  logout: async () => {
    await supabase.auth.signOut()
    set({ user: null, session: null })
  },
}))
