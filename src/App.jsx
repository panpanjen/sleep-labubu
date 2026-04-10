import { useState, useEffect } from 'react'
import './index.css'
import HomeScreen      from './screens/HomeScreen'
import OnboardingScreen from './screens/OnboardingScreen'
import TuckInScreen    from './screens/TuckInScreen'
import RiseShineScreen from './screens/RiseShineScreen'
import DiaryScreen     from './screens/DiaryScreen'
import LearnScreen     from './screens/LearnScreen'
import SettingsScreen  from './screens/SettingsScreen'
import { getUser, createUser, getPetState, upsertPetState } from './lib/db'
import { advanceTip, getTodayTip } from './data/tips'
import { getStageFromStreak } from './data/evolution'

export default function App() {
  const [loading, setLoading]             = useState(true)
  const [onboardingDone, setOnboardingDone] = useState(false)
  const [screen, setScreen]               = useState('home')
  const [user, setUser]                   = useState(null)
  const [pet, setPet]                     = useState(null)
  const [currentTip, setCurrentTip]       = useState(() => getTodayTip())

  // ── Bootstrap: load user + pet from Supabase on mount ──────────────────────
  useEffect(() => {
    async function bootstrap() {
      try {
        const userData = await getUser()
        if (userData?.onboarding_complete) {
          const petData = await getPetState()
          setUser(userData)
          setPet(buildPetObject(userData, petData))
          setOnboardingDone(true)
        }
      } catch (err) {
        console.error('Bootstrap error:', err)
        // Last-resort fallback: read localStorage directly
        try {
          const saved = localStorage.getItem('sleepLabubu_user')
          if (saved) {
            const u = JSON.parse(saved)
            setUser(u)
            setPet(buildPetFromLocal(u))
            setOnboardingDone(true)
          }
        } catch (_) {}
      } finally {
        setLoading(false)
      }
    }
    bootstrap()
  }, [])

  // ── Onboarding complete handler ─────────────────────────────────────────────
  const handleOnboardingComplete = async (formData) => {
    try {
      const userData = await createUser(formData)
      const petData  = await upsertPetState({
        happiness_score:  80,
        evolution_stage:  1,
        streak_days:      0,
      })
      setUser(userData)
      setPet(buildPetObject(userData, petData))
    } catch (err) {
      console.error('Onboarding save error:', err)
      // Fallback: save to localStorage if Supabase fails
      localStorage.setItem('sleepLabubu_user', JSON.stringify(formData))
      setPet(buildPetFromLocal(formData))
    }
    setOnboardingDone(true)
    setScreen('home')
  }

  // ── Loading splash ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div
        className="app-container flex items-center justify-center stars-bg"
        style={{ background: 'linear-gradient(180deg, #0a0a1a 0%, #0f0520 100%)' }}
      >
        <div className="flex flex-col items-center gap-4">
          <img
            src="./assets/labubu-sleeping.png"
            alt="Loading"
            className="pixel-img animate-float"
            style={{ width: 120, height: 120, objectFit: 'contain' }}
          />
          <p className="font-pixel text-purple-400" style={{ fontSize: '0.5rem' }}>
            loading…
          </p>
        </div>
      </div>
    )
  }

  // ── First-time user → onboarding ───────────────────────────────────────────
  if (!onboardingDone) {
    return (
      <div className="app-container" style={{ background: 'var(--night-bg)' }}>
        <OnboardingScreen onComplete={handleOnboardingComplete} />
      </div>
    )
  }

  // ── Refresh user + pet from Supabase ───────────────────────────────────────
  const refreshState = async () => {
    try {
      const [userData, petData] = await Promise.all([getUser(), getPetState()])
      if (userData) setUser(userData)
      if (petData && userData) setPet(buildPetObject(userData, petData))
    } catch (_) {}
  }

  // ── Apply settings changes directly to state (works without Supabase) ───────
  const handleSettingsUpdate = ({ name, labubuName, targetBedtime, targetWakeTime }) => {
    setUser(prev => prev ? {
      ...prev,
      name,
      labubu_name:      labubuName,
      target_bedtime:   targetBedtime,
      target_wake_time: targetWakeTime,
    } : prev)
    setPet(prev => prev ? {
      ...prev,
      name:           labubuName,
      userName:       name,
      targetBedtime,
      targetWakeTime,
    } : prev)
    refreshState()  // sync with Supabase in background if available
  }

  // ── Tuck-in complete ────────────────────────────────────────────────────────
  const handleTuckInComplete = async () => {
    // Optimistically mark as sleeping so the UI updates immediately,
    // even if Supabase is unavailable and refreshState fails silently.
    setPet(prev => prev ? { ...prev, isSleeping: true } : prev)
    setScreen('home')
    refreshState()   // sync in background; will overwrite if Supabase responds
  }

  // ── Rise & shine complete ───────────────────────────────────────────────────
  const handleRiseShineComplete = async () => {
    advanceTip()
    setCurrentTip(getTodayTip())   // re-read so HomeScreen gets the new tip immediately
    setPet(prev => prev ? { ...prev, isSleeping: false } : prev)
    setScreen('home')
    refreshState()   // sync in background
  }

  // ── Main app ────────────────────────────────────────────────────────────────
  return (
    <div className="app-container" style={{ background: 'var(--night-bg)' }}>
      {screen === 'home' && (
        <HomeScreen pet={pet} onNavigate={setScreen} tip={currentTip} />
      )}

      {screen === 'tuckin' && (
        <TuckInScreen
          pet={pet}
          onComplete={handleTuckInComplete}
          onBack={() => setScreen('home')}
        />
      )}

      {screen === 'riseshine' && (
        <RiseShineScreen
          pet={pet}
          onComplete={handleRiseShineComplete}
          onBack={() => setScreen('home')}
        />
      )}

      {screen === 'diary' && (
        <DiaryScreen pet={pet} onNavigate={setScreen} />
      )}

      {screen === 'learn' && (
        <LearnScreen onNavigate={setScreen} />
      )}

      {screen === 'settings' && (
        <SettingsScreen
          pet={pet}
          user={user}
          onNavigate={setScreen}
          onUpdate={handleSettingsUpdate}
          onReset={refreshState}
        />
      )}
    </div>
  )
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function buildPetObject(userData, petData) {
  const streakDays = petData?.streak_days ?? 0
  return {
    name:               userData.labubu_name ?? userData.labubuName,
    userName:           userData.name ?? userData.userName,
    targetBedtime:      userData.target_bedtime ?? userData.targetBedtime,
    targetWakeTime:     userData.target_wake_time ?? userData.targetWakeTime,
    evolutionStage:     petData?.evolution_stage ?? getStageFromStreak(streakDays).stage,
    happinessScore:     petData?.happiness_score ?? 80,
    streakDays,
    graduated:          petData?.graduated ?? false,
    lastSleepScore:     null,
    daysSinceLastCheckIn: daysSince(petData?.last_woken_up),
    hoursSinceLastAction: hoursSinceLastAction(petData?.last_tucked_in, petData?.last_woken_up),
    isSleeping:         isSleepWindow(petData?.last_tucked_in, petData?.last_woken_up),
  }
}

// Fallback when Supabase is unreachable — reads pet state from localStorage
function buildPetFromLocal(userData) {
  const petRaw     = localStorage.getItem('sleepLabubu_petState')
  const petData    = petRaw ? JSON.parse(petRaw) : null
  const streakDays = petData?.streak_days ?? 0
  return {
    name:               userData.labubuName ?? userData.labubu_name ?? 'Lazuzu',
    userName:           userData.name ?? userData.userName ?? 'you',
    targetBedtime:      userData.targetBedtime ?? userData.target_bedtime ?? '22:30',
    targetWakeTime:     userData.targetWakeTime ?? userData.target_wake_time ?? '07:00',
    evolutionStage:     petData?.evolution_stage ?? getStageFromStreak(streakDays).stage,
    happinessScore:     petData?.happiness_score ?? 80,
    streakDays,
    graduated:          petData?.graduated ?? false,
    lastSleepScore:     null,
    daysSinceLastCheckIn: daysSince(petData?.last_woken_up),
    hoursSinceLastAction: hoursSinceLastAction(petData?.last_tucked_in, petData?.last_woken_up),
    isSleeping:         isSleepWindow(petData?.last_tucked_in, petData?.last_woken_up),
  }
}

function daysSince(timestamp) {
  if (!timestamp) return 999
  const ms = Date.now() - new Date(timestamp).getTime()
  return Math.floor(ms / (1000 * 60 * 60 * 24))
}

function hoursSinceLastAction(lastTuckedIn, lastWokenUp) {
  const timestamps = [lastTuckedIn, lastWokenUp].filter(Boolean).map(t => new Date(t).getTime())
  if (timestamps.length === 0) return null
  const mostRecent = Math.max(...timestamps)
  return (Date.now() - mostRecent) / (1000 * 60 * 60)
}

function isSleepWindow(lastTuckedIn, lastWokenUp) {
  if (!lastTuckedIn) return false
  const tuckedInTime = new Date(lastTuckedIn).getTime()
  const wokenUpTime  = lastWokenUp ? new Date(lastWokenUp).getTime() : null
  if (wokenUpTime && wokenUpTime > tuckedInTime) return false
  return Date.now() > tuckedInTime
}
