import { useEffect, useState } from 'react'

// Maps each state to its image file and animation class
const STATE_CONFIG = {
  happy: {
    src: '/assets/labubu-happy.png',
    animation: 'animate-bounce-soft',
    glow: 'rgba(251, 191, 36, 0.3)',
  },
  neutral: {
    src: '/assets/labubu-neutral.png',
    animation: 'animate-float',
    glow: 'rgba(124, 58, 237, 0.2)',
  },
  sad: {
    src: '/assets/labubu-sad.png',
    animation: '',   // slumped — no float
    glow: 'rgba(99, 102, 241, 0.15)',
  },
  sleepy: {
    src: '/assets/labubu-sleepy.png',
    animation: 'animate-wobble',
    glow: 'rgba(99, 102, 241, 0.1)',
  },
  sleeping: {
    src: '/assets/labubu-sleeping.png',
    animation: 'animate-float',
    glow: 'rgba(124, 58, 237, 0.25)',
  },
  'grumpy-morning': {
    src: '/assets/labubu-grumpy-morning.png',
    animation: 'animate-wobble',
    glow: 'rgba(251, 146, 60, 0.2)',
  },
  graduating: {
    src: '/assets/labubu-graduating.png',
    animation: 'animate-bounce-soft',
    glow: 'rgba(251, 191, 36, 0.5)',
  },
  'miss-you': {
    src: '/assets/labubu-miss-you.png',
    animation: '',
    glow: 'rgba(99, 102, 241, 0.1)',
  },
}

export default function LabubuSprite({ state = 'neutral', size = 160 }) {
  const [visible, setVisible] = useState(false)
  const [currentState, setCurrentState] = useState(state)

  // Fade transition when state changes
  useEffect(() => {
    setVisible(false)
    const t = setTimeout(() => {
      setCurrentState(state)
      setVisible(true)
    }, 200)
    return () => clearTimeout(t)
  }, [state])

  useEffect(() => {
    setVisible(true)
  }, [])

  const config = STATE_CONFIG[currentState] || STATE_CONFIG.neutral

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      {/* Glow ring behind sprite */}
      <div
        className="absolute rounded-full transition-all duration-700"
        style={{
          width: size * 0.85,
          height: size * 0.85,
          background: config.glow,
          filter: 'blur(20px)',
        }}
      />

      {/* Sprite image */}
      <img
        src={config.src}
        alt={`Labubu ${currentState}`}
        className={`
          pixel-img relative z-10
          ${config.animation}
          transition-opacity duration-200
        `}
        style={{
          width: size,
          height: size,
          objectFit: 'contain',
          opacity: visible ? 1 : 0,
        }}
      />

      {/* Zzz bubbles for sleeping state */}
      {(currentState === 'sleeping' || currentState === 'sleepy') && (
        <ZzzBubbles />
      )}

      {/* Sparkles for happy/graduating */}
      {(currentState === 'happy' || currentState === 'graduating') && (
        <Sparkles />
      )}
    </div>
  )
}

function ZzzBubbles() {
  return (
    <div className="absolute top-0 right-0 pointer-events-none" style={{ zIndex: 20 }}>
      <span
        className="absolute font-pixel text-purple-300"
        style={{
          fontSize: '0.55rem',
          top: '8px',
          right: '-4px',
          animation: 'zzz-float 2.5s ease-in-out infinite',
        }}
      >z</span>
      <span
        className="absolute font-pixel text-purple-400"
        style={{
          fontSize: '0.7rem',
          top: '-4px',
          right: '8px',
          animation: 'zzz-float 2.5s ease-in-out 0.8s infinite',
        }}
      >z</span>
      <span
        className="absolute font-pixel text-purple-300"
        style={{
          fontSize: '0.85rem',
          top: '-14px',
          right: '20px',
          animation: 'zzz-float-2 2.5s ease-in-out 1.6s infinite',
        }}
      >Z</span>
    </div>
  )
}

function Sparkles() {
  const positions = [
    { top: '5%',  left: '10%',  delay: '0s',    size: '10px' },
    { top: '10%', right: '8%',  delay: '0.4s',  size: '8px'  },
    { top: '30%', left: '2%',   delay: '0.8s',  size: '12px' },
    { top: '20%', right: '2%',  delay: '1.2s',  size: '9px'  },
    { top: '0%',  left: '40%',  delay: '0.6s',  size: '8px'  },
  ]
  return (
    <>
      {positions.map((pos, i) => (
        <span
          key={i}
          className="absolute text-yellow-300 pointer-events-none"
          style={{
            ...pos,
            fontSize: pos.size,
            animation: `star-twinkle 1.5s ease-in-out ${pos.delay} infinite`,
            zIndex: 20,
          }}
        >✦</span>
      ))}
    </>
  )
}
