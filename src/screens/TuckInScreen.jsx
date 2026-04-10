import { useState, useEffect } from 'react'
import { getTodayStall } from '../data/stallDialogues'
import { upsertSleepLog, upsertPetState } from '../lib/db'

// ─── Phase order ─────────────────────────────────────────────────────────────
// entering → bedtime → stall → response → goodnight → sleeping
// ─────────────────────────────────────────────────────────────────────────────

export default function TuckInScreen({ pet, onComplete, onBack }) {
  const [phase, setPhase]           = useState('entering')
  const [stall]                     = useState(() => getTodayStall())
  const [chosenOption, setChosen]   = useState(null)   // 'A' | 'B'
  const [saving, setSaving]         = useState(false)
  const [dialogueIndex, setDialogue] = useState(0)

  // Auto-advance from entering → bedtime
  useEffect(() => {
    if (phase === 'entering') {
      const t = setTimeout(() => setPhase('bedtime'), 1000)
      return () => clearTimeout(t)
    }
  }, [phase])

  // Auto-advance from response → goodnight
  useEffect(() => {
    if (phase === 'response') {
      const t = setTimeout(() => setPhase('goodnight'), 2800)
      return () => clearTimeout(t)
    }
  }, [phase])

  const handleOptionTap = (option) => {
    setChosen(option)
    setPhase('response')
  }

  const handleGoodnight = async () => {
    setSaving(true)
    const now = new Date().toISOString()
    try {
      await Promise.all([
        upsertSleepLog({ bedtime_timestamp: now, tip_shown: stall.id }),
        upsertPetState({ last_tucked_in: now }),
      ])
    } catch (err) {
      console.error('Tuck-in save error:', err)
    }
    setSaving(false)
    setPhase('sleeping')
  }

  const handleDone = () => {
    onComplete({ tuckedInAt: new Date() })
  }

  return (
    <div
      className="flex flex-col h-full relative overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #04040f 0%, #0a0520 40%, #0d0028 100%)',
        transition: 'background 1s ease',
      }}
    >
      {/* ── Stars ── */}
      <Stars />

      {/* ── Moon ── */}
      <div
        className="absolute top-8 right-8"
        style={{ zIndex: 1 }}
      >
        <div
          className="rounded-full"
          style={{
            width: 48, height: 48,
            background: 'radial-gradient(circle at 35% 35%, #fde68a, #fbbf24)',
            boxShadow: '0 0 20px rgba(251, 191, 36, 0.4), 0 0 40px rgba(251, 191, 36, 0.15)',
          }}
        />
      </div>

      {/* ── Back button (only before goodnight) ── */}
      {(phase === 'bedtime' || phase === 'stall') && (
        <button
          onClick={onBack}
          className="absolute top-12 left-4 text-purple-600 hover:text-purple-400 transition-colors z-20 p-2"
          style={{ fontSize: '0.7rem', fontFamily: 'Press Start 2P, monospace' }}
        >
          ←
        </button>
      )}

      {/* ── Content area ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 relative z-10">

        {/* ── PHASE: entering ── */}
        {phase === 'entering' && (
          <div className="animate-fade-in text-center">
            <p className="font-pixel text-purple-400" style={{ fontSize: '0.55rem' }}>
              dimming the lights…
            </p>
          </div>
        )}

        {/* ── PHASE: bedtime ── */}
        {phase === 'bedtime' && (
          <div className="flex flex-col items-center gap-6 animate-fade-in text-center w-full">
            <img
              src="/assets/labubu-sleeping.png"
              alt="Labubu in bed"
              className="pixel-img"
              style={{ width: 200, height: 200, objectFit: 'contain' }}
            />
            <div className="flex flex-col gap-3 max-w-xs">
              <p className="font-pixel text-purple-300 leading-relaxed" style={{ fontSize: '0.55rem' }}>
                ok. I'm in bed.
              </p>
              <p className="font-pixel text-purple-200 leading-relaxed" style={{ fontSize: '0.55rem' }}>
                lights are almost out.
              </p>
              <p className="font-pixel text-yellow-200 leading-relaxed" style={{ fontSize: '0.55rem' }}>
                …but wait.
              </p>
            </div>
            <button
              className="btn-pixel btn-night mt-2"
              style={{ minWidth: '200px' }}
              onClick={() => setPhase('stall')}
            >
              what is it? →
            </button>
          </div>
        )}

        {/* ── PHASE: stall ── */}
        {phase === 'stall' && (
          <div className="flex flex-col items-center gap-5 animate-fade-in text-center w-full">
            <img
              src="/assets/labubu-neutral.png"
              alt="Labubu stalling"
              className="pixel-img animate-float"
              style={{ width: 140, height: 140, objectFit: 'contain' }}
            />

            {/* Setup line */}
            <p className="font-pixel text-yellow-300" style={{ fontSize: '0.6rem' }}>
              {stall.setup}
            </p>

            {/* Fact bubble */}
            <div
              className="border-2 border-purple-700 bg-purple-950/70 px-5 py-4 max-w-xs"
              style={{ borderColor: '#4c1d95' }}
            >
              <p className="font-pixel text-purple-100 leading-relaxed text-left" style={{ fontSize: '0.5rem' }}>
                {stall.fact}
              </p>
            </div>

            {/* Question */}
            <p className="font-pixel text-purple-300 leading-relaxed" style={{ fontSize: '0.5rem' }}>
              {stall.question}
            </p>

            {/* Two options */}
            <div className="flex flex-col gap-3 w-full max-w-xs">
              <button
                className="btn-pixel btn-night w-full"
                onClick={() => handleOptionTap('A')}
              >
                {stall.optionA.label}
              </button>
              <button
                className="btn-pixel btn-night w-full"
                onClick={() => handleOptionTap('B')}
              >
                {stall.optionB.label}
              </button>
            </div>
          </div>
        )}

        {/* ── PHASE: response ── */}
        {phase === 'response' && chosenOption && (
          <div className="flex flex-col items-center gap-6 animate-fade-in text-center w-full">
            <img
              src="/assets/labubu-happy.png"
              alt="Labubu reacting"
              className="pixel-img animate-bounce-soft"
              style={{ width: 140, height: 140, objectFit: 'contain' }}
            />
            <div className="flex flex-col gap-3 max-w-xs">
              <p className="font-pixel text-yellow-200 leading-relaxed" style={{ fontSize: '0.5rem' }}>
                {chosenOption === 'A' ? stall.optionA.response : stall.optionB.response}
              </p>
              <p className="font-pixel text-purple-400 leading-relaxed mt-2" style={{ fontSize: '0.5rem' }}>
                ok. ok I'm done.
              </p>
              <p className="font-pixel text-purple-400 leading-relaxed" style={{ fontSize: '0.5rem' }}>
                goodnight for real this time.
              </p>
            </div>
          </div>
        )}

        {/* ── PHASE: goodnight ── */}
        {phase === 'goodnight' && (
          <div className="flex flex-col items-center gap-6 animate-slide-up text-center w-full">
            <div className="relative">
              <img
                src="/assets/labubu-sleeping.png"
                alt="Labubu almost asleep"
                className="pixel-img animate-float"
                style={{ width: 200, height: 200, objectFit: 'contain' }}
              />
              <ZzzBubbles />
            </div>

            <div className="flex flex-col gap-2 max-w-xs">
              <p className="font-pixel text-purple-300 leading-relaxed" style={{ fontSize: '0.55rem' }}>
                ok. lights out.
              </p>
              <p className="font-pixel text-silver-300 leading-relaxed" style={{ fontSize: '0.55rem', color: '#c4b5fd' }}>
                tap when you're ready. 🌙
              </p>
            </div>

            <button
              className="btn-pixel btn-night animate-pulse-glow"
              style={{ minWidth: '240px', fontSize: '0.6rem' }}
              onClick={handleGoodnight}
              disabled={saving}
            >
              {saving ? 'tucking in…' : `goodnight ${pet.name} 🌙`}
            </button>
          </div>
        )}

        {/* ── PHASE: sleeping ── */}
        {phase === 'sleeping' && (
          <SleepingScene pet={pet} onDone={handleDone} />
        )}

      </div>
    </div>
  )
}

// ─── Sleeping done scene ──────────────────────────────────────────────────────
function SleepingScene({ pet, onDone }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(t)
  }, [])

  // Format wake time nicely
  const wakeTimeFormatted = (() => {
    const [h, m] = (pet?.targetWakeTime ?? '07:00').split(':').map(Number)
    const ampm = h >= 12 ? 'pm' : 'am'
    const h12  = h % 12 || 12
    return `${h12}:${String(m).padStart(2, '0')} ${ampm}`
  })()

  return (
    <div
      className="flex flex-col items-center gap-6 text-center w-full"
      style={{ opacity: visible ? 1 : 0, transition: 'opacity 1.5s ease' }}
    >
      {/* Bed scene */}
      <div className="relative">
        <img
          src="/assets/labubu-sleeping.png"
          alt="Labubu sleeping"
          className="pixel-img animate-float"
          style={{ width: 220, height: 220, objectFit: 'contain' }}
        />
        <ZzzBubbles large />

        {/* Glow halo */}
        <div
          className="absolute rounded-full"
          style={{
            bottom: 10, left: '50%', transform: 'translateX(-50%)',
            width: 180, height: 40,
            background: 'rgba(124, 58, 237, 0.2)',
            filter: 'blur(12px)',
          }}
        />
      </div>

      <div className="flex flex-col gap-3 max-w-xs">
        <p className="font-pixel text-purple-300 leading-relaxed" style={{ fontSize: '0.55rem' }}>
          sweet dreams. 🌙
        </p>
        <p className="font-pixel text-purple-500 leading-relaxed" style={{ fontSize: '0.48rem' }}>
          I'll see you at {wakeTimeFormatted}.
        </p>
        <p className="font-pixel text-purple-600 leading-relaxed" style={{ fontSize: '0.45rem' }}>
          (I'll be grumpy. just so you know.)
        </p>
      </div>

      <button
        className="btn-pixel btn-night mt-2"
        style={{ minWidth: '200px' }}
        onClick={onDone}
      >
        close app 💤
      </button>
    </div>
  )
}

// ─── Zzz component ─────────────────────────────────────────────────────────
function ZzzBubbles({ large = false }) {
  const base = large ? 1.3 : 1
  return (
    <div className="absolute pointer-events-none" style={{ top: 0, right: -10, zIndex: 20 }}>
      <span
        className="absolute font-pixel text-purple-400"
        style={{
          fontSize: `${0.5 * base}rem`,
          top: large ? 20 : 14,
          right: large ? 0 : -4,
          animation: 'zzz-float 2.5s ease-in-out infinite',
        }}
      >z</span>
      <span
        className="absolute font-pixel text-purple-300"
        style={{
          fontSize: `${0.65 * base}rem`,
          top: large ? 4 : 2,
          right: large ? 14 : 8,
          animation: 'zzz-float 2.5s ease-in-out 0.8s infinite',
        }}
      >z</span>
      <span
        className="absolute font-pixel text-purple-300"
        style={{
          fontSize: `${0.8 * base}rem`,
          top: large ? -14 : -10,
          right: large ? 28 : 20,
          animation: 'zzz-float-2 2.5s ease-in-out 1.6s infinite',
        }}
      >Z</span>
    </div>
  )
}

// ─── Twinkling stars background ────────────────────────────────────────────
function Stars() {
  const stars = Array.from({ length: 24 }, (_, i) => ({
    x: Math.random() * 100,
    y: Math.random() * 60,
    size: Math.random() * 2 + 1,
    delay: `${(Math.random() * 3).toFixed(1)}s`,
    duration: `${(Math.random() * 2 + 2).toFixed(1)}s`,
  }))

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
      {stars.map((s, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            left: `${s.x}%`,
            top:  `${s.y}%`,
            width:  s.size,
            height: s.size,
            animation: `star-twinkle ${s.duration} ease-in-out ${s.delay} infinite`,
          }}
        />
      ))}
    </div>
  )
}
