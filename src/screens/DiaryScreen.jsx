import { useState, useEffect } from 'react'
import { getRecentSleepLogs } from '../lib/db'
import BottomNav from '../components/BottomNav'

const STATE_EMOJI = { happy: '😄', neutral: '😐', sad: '😢', sleepy: '😴' }

function scoreToState(score) {
  if (score == null) return null
  if (score >= 75) return 'happy'
  if (score >= 50) return 'neutral'
  if (score >= 25) return 'sad'
  return 'sleepy'
}

function formatDayLabel(dateStr) {
  const d = new Date(dateStr + 'T12:00:00')
  return d.toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 3).toLowerCase()
}

function formatTime(ts) {
  if (!ts) return '—'
  const d = new Date(ts)
  const h = d.getHours() % 12 || 12
  const m = String(d.getMinutes()).padStart(2, '0')
  return `${h}:${m}${d.getHours() >= 12 ? 'pm' : 'am'}`
}

export default function DiaryScreen({ pet, onNavigate }) {
  const [logs, setLogs]       = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)  // selected day dateStr

  useEffect(() => {
    getRecentSleepLogs(7)
      .then(data => { setLogs(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  // Build 7-day array: Mon → Sun of the current week
  const days = Array.from({ length: 7 }, (_, i) => {
    const today = new Date()
    const dayOfWeek = today.getDay() // 0=Sun, 1=Mon, …, 6=Sat
    const mondayOffset = (dayOfWeek === 0 ? -6 : 1 - dayOfWeek)
    const d = new Date(today)
    d.setDate(today.getDate() + mondayOffset + i)
    const dateStr = d.toISOString().split('T')[0]
    const log = logs.find(l => l.date === dateStr) ?? null
    return { dateStr, label: formatDayLabel(dateStr), log }
  })

  const avgScore = logs.length
    ? Math.round(logs.reduce((s, l) => s + (l.sleep_score ?? 0), 0) / logs.length)
    : null

  const selectedLog = days.find(d => d.dateStr === selected)?.log ?? null

  const streakMessage = (() => {
    const n = pet?.streakDays ?? 0
    if (n === 0)   return 'tuck in tonight to start your streak!'
    if (n < 3)     return `${3 - n} more night${3 - n === 1 ? '' : 's'} to gold star 🌟`
    if (n < 7)     return `${7 - n} more night${7 - n === 1 ? '' : 's'} to sleep scholar 📚`
    if (n < 14)    return `${14 - n} more to top of the class 🏆`
    if (n < 21)    return `${21 - n} more to graduation!! 🎓`
    return 'graduated!! sleep school complete 🎓'
  })()

  return (
    <div
      className="flex flex-col h-full stars-bg"
      style={{ background: 'linear-gradient(180deg, #0a0a1a 0%, #0f0520 60%, #0a0a1a 100%)' }}
    >
      {/* ── Header ── */}
      <header className="px-5 pt-12 pb-3 relative z-10">
        <h1 className="font-pixel text-purple-300 text-xs">sleep diary</h1>
        {avgScore !== null && (
          <p className="font-pixel text-purple-600 mt-1" style={{ fontSize: '0.42rem' }}>
            7-day avg: <span className="text-yellow-300">{avgScore}</span>
          </p>
        )}
      </header>

      {/* ── Bar chart ── */}
      <div className="px-4 relative z-10">
        <div className="border-2 border-purple-900 bg-purple-950/40 p-4">
          <div className="flex items-end gap-2" style={{ height: '130px' }}>
            {days.map(({ dateStr, label, log }) => {
              const hours    = log?.duration_hours ?? 0
              const heightPct = log ? Math.min(100, (hours / 9) * 100) : 0
              const state    = scoreToState(log?.sleep_score)
              const barColor = state === 'happy'   ? '#fbbf24'
                             : state === 'neutral' ? '#c4b5fd'
                             : state === 'sad'     ? '#818cf8'
                             : state === 'sleepy'  ? '#6b7280'
                             : '#1e1040'
              const isSelected = selected === dateStr

              return (
                <button
                  key={dateStr}
                  className="flex-1 flex flex-col items-center gap-1 focus:outline-none"
                  onClick={() => setSelected(isSelected ? null : dateStr)}
                >
                  {/* Emotion */}
                  <span style={{ fontSize: '0.75rem', height: '16px', lineHeight: '16px' }}>
                    {state ? STATE_EMOJI[state] : ''}
                  </span>
                  {/* Bar column */}
                  <div className="w-full flex items-end" style={{ height: '90px' }}>
                    <div
                      className="w-full transition-all duration-700"
                      style={{
                        height:     log ? `${Math.max(5, heightPct)}%` : '4px',
                        background: barColor,
                        opacity:    log ? 1 : 0.25,
                        border:     !log ? '1px solid #2d1a5e' : 'none',
                        outline:    isSelected ? '2px solid #fb923c' : 'none',
                      }}
                    />
                  </div>
                  {/* Hours */}
                  <span className="font-pixel text-purple-500" style={{ fontSize: '0.33rem' }}>
                    {log?.duration_hours ? `${log.duration_hours.toFixed(1)}h` : '—'}
                  </span>
                  {/* Day */}
                  <span
                    className="font-pixel"
                    style={{
                      fontSize: '0.36rem',
                      color: isSelected ? '#fb923c' : '#7c3aed',
                    }}
                  >
                    {label}
                  </span>
                </button>
              )
            })}
          </div>
          <div className="flex justify-between mt-1">
            <span className="font-pixel text-purple-800" style={{ fontSize: '0.32rem' }}>tap a bar for details</span>
            <span className="font-pixel text-purple-800" style={{ fontSize: '0.32rem' }}>9h = max ✓</span>
          </div>
        </div>
      </div>

      {/* ── Selected day detail ── */}
      {selected && (
        <div className="px-4 mt-2 relative z-10 animate-fade-in">
          {selectedLog ? (
            <div className="border border-purple-800 bg-purple-950/50 px-4 py-3">
              {/* date + score */}
              <div className="flex justify-between items-center mb-3">
                <p className="font-pixel text-purple-400" style={{ fontSize: '0.44rem' }}>{selected}</p>
                {selectedLog.sleep_score != null && (
                  <span className="font-pixel text-yellow-300" style={{ fontSize: '0.5rem' }}>
                    {selectedLog.sleep_score} pts
                  </span>
                )}
              </div>

              {/* sleep time + wake time — primary row */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex-1 border border-purple-900 bg-purple-950/60 px-3 py-2 text-center">
                  <p className="font-pixel text-purple-500 mb-1" style={{ fontSize: '0.35rem' }}>🌙 tucked in</p>
                  <p className="font-pixel text-purple-100" style={{ fontSize: '0.55rem' }}>
                    {formatTime(selectedLog.bedtime_timestamp)}
                  </p>
                </div>

                <div className="flex flex-col items-center gap-0.5 px-1">
                  <span className="font-pixel text-purple-700" style={{ fontSize: '0.35rem' }}>
                    {selectedLog.duration_hours ? `${selectedLog.duration_hours.toFixed(1)}h` : '—'}
                  </span>
                  <div className="h-px w-6 bg-purple-800" />
                </div>

                <div className="flex-1 border border-purple-900 bg-purple-950/60 px-3 py-2 text-center">
                  <p className="font-pixel text-purple-500 mb-1" style={{ fontSize: '0.35rem' }}>☀️ woke up</p>
                  <p className="font-pixel text-purple-100" style={{ fontSize: '0.55rem' }}>
                    {formatTime(selectedLog.wake_timestamp)}
                  </p>
                </div>
              </div>

              {/* quality */}
              {selectedLog.quality_rating != null && (
                <div className="flex items-center gap-2">
                  <p className="font-pixel text-purple-600" style={{ fontSize: '0.35rem' }}>quality</p>
                  <p className="font-pixel text-yellow-400" style={{ fontSize: '0.42rem' }}>
                    {'★'.repeat(selectedLog.quality_rating)}{'☆'.repeat(5 - selectedLog.quality_rating)}
                  </p>
                </div>
              )}

              {selectedLog.notes && (
                <p className="text-purple-400 text-xs mt-2" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                  "{selectedLog.notes}"
                </p>
              )}
            </div>
          ) : (
            <div className="border border-purple-900 bg-purple-950/30 px-4 py-3 text-center">
              <p className="font-pixel text-purple-600" style={{ fontSize: '0.44rem' }}>no data for this day</p>
            </div>
          )}
        </div>
      )}

      {/* ── Streak card ── */}
      <div className="px-4 mt-3 relative z-10">
        <div className="border-2 border-purple-900 bg-purple-950/40 px-4 py-3 flex items-center gap-3">
          <span className="text-2xl">🔥</span>
          <div>
            <p className="font-pixel text-orange-300" style={{ fontSize: '0.55rem' }}>
              {pet?.streakDays ?? 0} day streak
            </p>
            <p className="font-pixel text-purple-500 mt-1" style={{ fontSize: '0.4rem' }}>
              {streakMessage}
            </p>
          </div>
        </div>
      </div>

      {/* ── Empty state ── */}
      {!loading && logs.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center px-6 relative z-10">
          <img src="./assets/labubu-sleeping.png" alt="Labubu"
            className="pixel-img animate-float"
            style={{ width: 90, height: 90, objectFit: 'contain' }}
          />
          <p className="font-pixel text-purple-600 text-center mt-4" style={{ fontSize: '0.46rem', lineHeight: 1.8 }}>
            no sleep data yet.<br />tuck in tonight to start!
          </p>
        </div>
      )}

      <div className="flex-1" />

      <BottomNav active="diary" onNavigate={onNavigate} />
    </div>
  )
}
