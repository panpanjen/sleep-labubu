import { useState } from 'react'
import { SLEEP_TIPS, getTodayTip } from '../data/tips'
import BottomNav from '../components/BottomNav'

const CATEGORIES = [
  { id: 'screens',     label: '📱 Screens'     },
  { id: 'routine',     label: '🔁 Routine'     },
  { id: 'environment', label: '🌡️ Environ'     },
  { id: 'food',        label: '☕ Food'         },
  { id: 'mind',        label: '🧠 Mind'         },
]

export default function LearnScreen({ onNavigate }) {
  const [activeCat, setActiveCat]     = useState('screens')
  const [expandedTip, setExpandedTip] = useState(null)

  const todayTip = getTodayTip()
  const tips     = SLEEP_TIPS.filter(t => t.category === activeCat)

  return (
    <div
      className="flex flex-col h-full stars-bg"
      style={{ background: 'linear-gradient(180deg, #0a0a1a 0%, #0f0520 60%, #0a0a1a 100%)' }}
    >
      {/* ── Header ── */}
      <header className="px-5 pt-12 pb-3 relative z-10">
        <h1 className="font-pixel text-purple-300 text-xs">sleep school</h1>
        <p className="font-pixel text-purple-600 mt-1" style={{ fontSize: '0.42rem' }}>
          30 things Lazuzu wants you to know
        </p>
      </header>

      {/* ── Category tabs ── */}
      <div className="px-3 pb-2 relative z-10">
        <div className="flex gap-1.5 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => { setActiveCat(cat.id); setExpandedTip(null) }}
              className="flex-shrink-0 border-2 transition-all font-pixel"
              style={{
                fontSize:    '0.38rem',
                padding:     '8px 12px',
                borderColor: activeCat === cat.id ? '#7c3aed' : '#2d1a5e',
                background:  activeCat === cat.id ? '#3b1a6e' : 'transparent',
                color:       activeCat === cat.id ? '#c4b5fd' : '#6b21a8',
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Tips list ── */}
      <div className="flex-1 overflow-y-auto px-4 relative z-10 pb-2">
        <div className="flex flex-col gap-2">
          {tips.map(tip => {
            const isToday    = tip.id === todayTip?.id
            const isExpanded = expandedTip === tip.id

            return (
              <div
                key={tip.id}
                className="border-2 cursor-pointer transition-colors"
                style={{
                  borderColor: isToday   ? '#fb923c'
                             : isExpanded ? '#7c3aed'
                             : '#2d1a5e',
                  background: isExpanded ? 'rgba(59,26,110,0.5)' : 'rgba(10,5,32,0.5)',
                }}
                onClick={() => setExpandedTip(isExpanded ? null : tip.id)}
              >
                <div className="flex items-start gap-3 px-4 py-3">
                  <span className="text-lg flex-shrink-0 mt-0.5">{tip.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-pixel text-purple-200 leading-relaxed" style={{ fontSize: '0.44rem' }}>
                      {tip.content}
                    </p>
                    {isToday && (
                      <span
                        className="font-pixel text-orange-400 mt-1 inline-block"
                        style={{ fontSize: '0.36rem' }}
                      >
                        ← today's tip
                      </span>
                    )}
                  </div>
                  <span className="text-purple-600 flex-shrink-0 text-xs mt-0.5">
                    {isExpanded ? '▲' : '▼'}
                  </span>
                </div>

                {isExpanded && (
                  <div className="px-4 pb-4 animate-fade-in">
                    <div className="border-t border-purple-800 pt-3">
                      <p className="font-pixel text-yellow-200 leading-relaxed" style={{ fontSize: '0.42rem' }}>
                        {tip.labubuDialogue}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      <BottomNav active="learn" onNavigate={onNavigate} />
    </div>
  )
}
