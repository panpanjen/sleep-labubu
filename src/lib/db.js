import { supabase } from './supabase'

// ─── User identity ────────────────────────────────────────────────────────────
export function getDeviceUserId() {
  let id = localStorage.getItem('sleepLabubu_userId')
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem('sleepLabubu_userId', id)
  }
  return id
}

// ─── localStorage keys ────────────────────────────────────────────────────────
const LS_PET   = 'sleepLabubu_petState'
const LS_LOGS  = 'sleepLabubu_sleepLogs'  // array of log objects keyed by date

// ─── Users ────────────────────────────────────────────────────────────────────

export async function createUser({ name, userName, labubuName, targetBedtime, targetWakeTime }) {
  const resolvedName = name ?? userName ?? 'you'
  if (!supabase) {
    const user = {
      name: resolvedName,
      labubuName,
      labubu_name: labubuName,
      targetBedtime,
      target_bedtime: targetBedtime,
      targetWakeTime,
      target_wake_time: targetWakeTime,
      onboarding_complete: true,
    }
    localStorage.setItem('sleepLabubu_user', JSON.stringify(user))
    return user
  }
  const userId = getDeviceUserId()
  const { data, error } = await supabase
    .from('users')
    .upsert({
      id: userId,
      name: resolvedName,
      labubu_name: labubuName,
      target_bedtime: targetBedtime,
      target_wake_time: targetWakeTime,
      onboarding_complete: true,
    }, { onConflict: 'id' })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getUser() {
  if (!supabase) {
    const saved = localStorage.getItem('sleepLabubu_user')
    if (!saved) return null
    const user = JSON.parse(saved)
    // Old format (saved before onboarding_complete field was added) still counts as done
    return { onboarding_complete: true, ...user }
  }
  const userId = getDeviceUserId()
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return data ?? null
}

export async function updateUser(fields) {
  if (!supabase) {
    const existing = JSON.parse(localStorage.getItem('sleepLabubu_user') ?? '{}')
    const updated = { ...existing, ...fields }
    localStorage.setItem('sleepLabubu_user', JSON.stringify(updated))
    return updated
  }
  const userId = getDeviceUserId()
  const { data, error } = await supabase
    .from('users')
    .update(fields)
    .eq('id', userId)
    .select()
    .single()

  if (error) throw error
  return data
}

// ─── Pet state ────────────────────────────────────────────────────────────────

export async function getPetState() {
  if (!supabase) {
    const saved = localStorage.getItem(LS_PET)
    return saved ? JSON.parse(saved) : null
  }
  const userId = getDeviceUserId()
  const { data, error } = await supabase
    .from('pet_state')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return data ?? null
}

export async function upsertPetState(fields) {
  if (!supabase) {
    const existing = JSON.parse(localStorage.getItem(LS_PET) ?? '{}')
    const updated = { ...existing, ...fields, last_updated: new Date().toISOString() }
    localStorage.setItem(LS_PET, JSON.stringify(updated))
    return updated
  }
  const userId = getDeviceUserId()
  const { data, error } = await supabase
    .from('pet_state')
    .upsert({ user_id: userId, ...fields, last_updated: new Date().toISOString() }, { onConflict: 'user_id' })
    .select()
    .single()

  if (error) throw error
  return data
}

// ─── Sleep logs ───────────────────────────────────────────────────────────────

function getLocalLogs() {
  const saved = localStorage.getItem(LS_LOGS)
  return saved ? JSON.parse(saved) : []
}

function saveLocalLogs(logs) {
  localStorage.setItem(LS_LOGS, JSON.stringify(logs))
}

export async function getTodaySleepLog() {
  const today = new Date().toISOString().split('T')[0]
  if (!supabase) {
    return getLocalLogs().find(l => l.date === today) ?? null
  }
  const userId = getDeviceUserId()
  const { data, error } = await supabase
    .from('sleep_logs')
    .select('*')
    .eq('user_id', userId)
    .eq('date', today)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return data ?? null
}

export async function upsertSleepLog(fields) {
  const today = new Date().toISOString().split('T')[0]
  if (!supabase) {
    const logs = getLocalLogs()
    const idx  = logs.findIndex(l => l.date === today)
    const updated = { date: today, ...(idx >= 0 ? logs[idx] : {}), ...fields }
    if (idx >= 0) logs[idx] = updated
    else logs.push(updated)
    saveLocalLogs(logs)
    return updated
  }
  const userId = getDeviceUserId()
  const { data, error } = await supabase
    .from('sleep_logs')
    .upsert({ user_id: userId, date: today, ...fields }, { onConflict: 'user_id,date' })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getRecentSleepLogs(days = 7) {
  if (!supabase) {
    return getLocalLogs()
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, days)
  }
  const userId = getDeviceUserId()
  const { data, error } = await supabase
    .from('sleep_logs')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false })
    .limit(days)

  if (error) throw error
  return data ?? []
}
