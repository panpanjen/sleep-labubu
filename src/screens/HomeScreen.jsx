import { useState, useEffect } from 'react'
import LabubuSprite from '../components/LabubuSprite'
import BottomNav from '../components/BottomNav'
import HappinessBar from '../components/HappinessBar'
import TipCard from '../components/TipCard'
import { getLabubuState, getCTAMode } from '../lib/labubuState'
import { getStage } from '../data/evolution'

export default function HomeScreen({ pet, onNavigate, tip }) {
  const [tipExpanded, setTipExpanded] = useState(false)

  const labubuState = getLabubuState(pet)
  const ctaMode = getCTAMode(pet)

  const stage = getStage(pet.evolutionStage)

  const ctaConfig = {
    tuckin:    { label: `Tuck in ${pet.name} 🌙`, action: () => onNavigate('tuckin'),    style: 'btn-night' },
    riseshine: { label: `Wake up ${pet.name} ☀️`, action: () => onNavigate('riseshine'), style: 'btn-day'   },
  }
  const cta = ctaConfig[ctaMode]

  return (
    <div
      className="flex flex-col h-full stars-bg"
      style={{ background: 'linear-gradient(180deg, #0a0a1a 0%, #0f0520 60%, #0a0a1a 100%)' }}
    >
      {/* ── Scrollable content ── */}
      <div className="flex-1 overflow-y-auto" style={{ paddingBottom: '60px' }}>
        {/* ── Header ── */}
        <header className="flex items-center justify-between px-5 pt-12 pb-2 relative z-10">
          <div className="flex-1" />
          <button
            onClick={() => onNavigate('settings')}
            className="text-purple-400 hover:text-purple-200 transition-colors p-2"
            aria-label="Settings"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
          </button>
        </header>

        {/* ── Pet name + stage ── */}
        <div className="px-5 relative z-10">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-pixel text-yellow-300 text-xs">{pet.name}</span>
            <span className="text-purple-400 text-xs">{stage.emoji}</span>
            <span className="font-pixel text-purple-400" style={{ fontSize: '0.45rem' }}>
              {stage.label}
              <span className="text-purple-600"> ({stage.subtitle})</span>
            </span>
          </div>

          {/* Streak */}
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-sm">🔥</span>
            <span className="font-pixel text-orange-300 text-xs">{pet.streakDays} day streak</span>
          </div>
        </div>

        {/* ── Happiness bar ── */}
        <div className="px-5 mt-3 relative z-10">
          <div className="flex items-center justify-between mb-1">
            <span className="font-pixel text-purple-400 text-xs">happiness</span>
            <span className="font-pixel text-purple-300 text-xs">{pet.happinessScore}/100</span>
          </div>
          <HappinessBar score={pet.happinessScore} />
        </div>

        {/* ── Labubu sprite ── */}
        <div className="flex items-center justify-center relative z-10 py-4">
          <LabubuSprite state={labubuState} size={200} />
        </div>

        {/* ── Tip card ── */}
        <div className="px-4 relative z-10 mb-3">
          <TipCard tip={tip} expanded={tipExpanded} onToggle={() => setTipExpanded(v => !v)} />
        </div>

        {/* ── CTA button ── */}
        <div className="px-6 pb-4 relative z-10">
          <button
            className={`btn-pixel ${cta.style} w-full`}
            onClick={cta.action || undefined}
            style={{ width: '100%' }}
          >
            {cta.label}
          </button>
        </div>
      </div>

      {/* ── Bottom nav (sticky) ── */}
      <div className="sticky-bottom-nav">
        <BottomNav active="home" onNavigate={onNavigate} />
      </div>
    </div>
  )
}
