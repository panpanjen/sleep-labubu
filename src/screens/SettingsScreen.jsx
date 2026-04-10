import { useState } from 'react'
import { updateUser, upsertPetState } from '../lib/db'
import BottomNav from '../components/BottomNav'

export default function SettingsScreen({ pet, user, onNavigate, onUpdate, onReset }) {
  const [name,       setName]       = useState(user?.name       ?? pet?.userName      ?? '')
  const [labName,    setLabName]    = useState(user?.labubu_name ?? pet?.name         ?? 'Labubu')
  const [bedtime,    setBedtime]    = useState(user?.target_bedtime  ?? pet?.targetBedtime  ?? '22:30')
  const [wakeTime,   setWakeTime]   = useState(user?.target_wake_time ?? pet?.targetWakeTime ?? '07:00')
  const [saving,     setSaving]     = useState(false)
  const [saved,      setSaved]      = useState(false)
  const [showProtest,  setShowProtest]  = useState(false)
  const [showConfirm,  setShowConfirm]  = useState(false)
  const [resetting,    setResetting]    = useState(false)

  const handleSave = async () => {
    setSaving(true)
    try {
      await updateUser({
        name:             name.trim()    || user?.name,
        labubu_name:      labName.trim() || user?.labubu_name,
        target_bedtime:   bedtime,
        target_wake_time: wakeTime,
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
      onUpdate?.({ name: name.trim() || user?.name, labubuName: labName.trim() || user?.labubu_name, targetBedtime: bedtime, targetWakeTime: wakeTime })
    } catch (err) {
      console.error('Settings save error:', err)
    }
    setSaving(false)
  }

  // Labubu protests dramatically, then confirmation appears
  const handleResetRequest = () => {
    setShowProtest(true)
    setTimeout(() => {
      setShowProtest(false)
      setShowConfirm(true)
    }, 2200)
  }

  const handleResetConfirm = async () => {
    setResetting(true)
    try {
      await upsertPetState({
        happiness_score:        80,
        evolution_stage:        1,
        streak_days:            0,
        graduated:              false,
        last_tucked_in:         null,
        last_woken_up:          null,
        graduation_date:        null,
        post_grad_checkin_count: 0,
      })
      setShowConfirm(false)
      onReset?.()
    } catch (err) {
      console.error('Reset error:', err)
    }
    setResetting(false)
  }

  return (
    <div
      className="flex flex-col h-full stars-bg"
      style={{ background: 'linear-gradient(180deg, #0a0a1a 0%, #0f0520 60%, #0a0a1a 100%)' }}
    >
      {/* ── Protest popup ── */}
      {showProtest && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/75">
          <div
            className="border-2 border-red-500 bg-purple-950 px-6 py-6 max-w-xs text-center animate-pop-in"
          >
            <img src="./assets/labubu-sad.png" alt="Labubu sad"
              className="pixel-img mx-auto mb-4 animate-wobble"
              style={{ width: 90, height: 90, objectFit: 'contain' }}
            />
            <p className="font-pixel text-red-400 leading-relaxed" style={{ fontSize: '0.52rem' }}>
              wait WHAT.
            </p>
            <p className="font-pixel text-purple-300 leading-relaxed mt-2" style={{ fontSize: '0.52rem' }}>
              no. NO.
            </p>
            <p className="font-pixel text-purple-500 leading-relaxed mt-1" style={{ fontSize: '0.45rem' }}>
              …you wouldn't.
            </p>
          </div>
        </div>
      )}

      {/* ── Confirm popup ── */}
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/75">
          <div className="border-2 border-red-500 bg-purple-950 px-6 py-6 max-w-xs text-center">
            <img src="./assets/labubu-sad.png" alt="Labubu sad"
              className="pixel-img mx-auto mb-3"
              style={{ width: 80, height: 80, objectFit: 'contain' }}
            />
            <p className="font-pixel text-red-400 leading-relaxed mb-4" style={{ fontSize: '0.46rem' }}>
              …you're really doing this?<br />
              all my progress. gone.<br />
              my streak. my stage.<br />
              <br />
              ok. fine. I guess.
            </p>
            <div className="flex gap-3">
              <button
                className="btn-pixel btn-night flex-1"
                onClick={() => setShowConfirm(false)}
              >
                wait, no →
              </button>
              <button
                className="btn-pixel flex-1"
                style={{ background: '#7f1d1d', borderColor: '#ef4444', color: '#fca5a5', boxShadow: '3px 3px 0 #7f1d1d' }}
                onClick={handleResetConfirm}
                disabled={resetting}
              >
                {resetting ? '…' : 'reset'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Header ── */}
      <header className="px-5 pt-12 pb-4 relative z-10">
        <h1 className="font-pixel text-purple-300 text-xs">settings</h1>
      </header>

      <div className="flex-1 overflow-y-auto px-5 relative z-10 pb-4">

        {/* Your name */}
        <div className="mb-5">
          <label className="font-pixel text-purple-400 block mb-2" style={{ fontSize: '0.46rem' }}>
            your name
          </label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            maxLength={20}
            className="w-full px-4 py-3 border-2 border-purple-700 bg-purple-950/60 text-purple-100 outline-none focus:border-purple-400 transition-colors"
            style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1rem' }}
          />
        </div>

        {/* Lazuzu name */}
        <div className="mb-5">
          <label className="font-pixel text-purple-400 block mb-2" style={{ fontSize: '0.46rem' }}>
            lazuzu's name
          </label>
          <input
            type="text"
            value={labName}
            onChange={e => setLabName(e.target.value)}
            maxLength={20}
            className="w-full px-4 py-3 border-2 border-purple-700 bg-purple-950/60 text-purple-100 outline-none focus:border-purple-400 transition-colors"
            style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1rem' }}
          />
        </div>

        {/* Target bedtime */}
        <div className="mb-5">
          <label className="font-pixel text-purple-400 block mb-2" style={{ fontSize: '0.46rem' }}>
            target bedtime
          </label>
          <input
            type="time"
            value={bedtime}
            onChange={e => setBedtime(e.target.value)}
            className="w-full px-4 py-3 border-2 border-purple-700 bg-purple-950/60 text-purple-100 outline-none focus:border-purple-400 transition-colors"
            style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1.2rem' }}
          />
        </div>

        {/* Target wake time */}
        <div className="mb-6">
          <label className="font-pixel text-purple-400 block mb-2" style={{ fontSize: '0.46rem' }}>
            target wake time
          </label>
          <input
            type="time"
            value={wakeTime}
            onChange={e => setWakeTime(e.target.value)}
            className="w-full px-4 py-3 border-2 border-purple-700 bg-purple-950/60 text-purple-100 outline-none focus:border-purple-400 transition-colors"
            style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1.2rem' }}
          />
        </div>

        {/* Save button */}
        <button
          className="btn-pixel btn-primary w-full mb-6"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? 'saving…' : saved ? 'saved ✓' : 'save changes'}
        </button>

        {/* Divider */}
        <div className="border-t border-purple-900 mb-6" />

        {/* Danger zone */}
        <div>
          <p className="font-pixel text-purple-700 mb-3" style={{ fontSize: '0.42rem' }}>
            danger zone
          </p>
          <button
            className="btn-pixel w-full"
            style={{
              background:  'transparent',
              borderColor: '#7f1d1d',
              color:       '#fca5a5',
              boxShadow:   '4px 4px 0px #7f1d1d',
            }}
            onClick={handleResetRequest}
          >
            reset 💀
          </button>
          <p
            className="text-purple-700 text-xs mt-2 text-center"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          >
            resets streak, stage, and happiness. cannot be undone.
          </p>
        </div>
      </div>

      <BottomNav active="settings" onNavigate={onNavigate} />
    </div>
  )
}
