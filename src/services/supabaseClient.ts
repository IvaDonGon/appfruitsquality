import 'react-native-url-polyfill/auto'
import { createClient } from '@supabase/supabase-js'
import { MMKV } from 'react-native-mmkv'

const storage = new MMKV({ id: 'supabase-storage' })

const mmkvStorage = {
  getItem: (key: string) => {
    const value = storage.getString(key)
    return value ?? null
  },
  setItem: (key: string, value: string) => {
    storage.set(key, value)
  },
  removeItem: (key: string) => {
    storage.delete(key)
  },
}

const SUPABASE_URL = 'https://rwbaxyhsiwgadhcfooli.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_YDk4YUL8eQ8PWh6dI3McDg_u9_yrmab'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: mmkvStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    flowType: 'pkce',
  },
  realtime: {
    params: {
      eventsPerSecond: -1,
    },
  },
  global: {
    fetch: fetch.bind(globalThis),
  },
})
