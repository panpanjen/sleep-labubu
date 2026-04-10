import { useState } from 'react'

// Total steps: 0=welcome, 1=names, 2=times, 3=how it works
const TOTAL_STEPS = 4

export default function OnboardingScreen({ onComplete }) {
  const [step, setStep] = useState(0)
  const [userName, setUserName] = useState('')
  const [labubuName, setLabubuName] = useState('')
  const [bedtime, setBedtime] = useState('22:30')
  const [wakeTime, setWakeTime] = useState('07:00')

  const next = () => setStep(s => s + 1)
  const back = () => setStep(s => s - 1)

  const finish = () => {
    onComplete({
      userName: userName.trim() || 'you',
      labubuName: labubuName.trim() || 'Lazuzu',
      targetBedtime: bedtime,
      targetWakeTime: wakeTime,
    })
  }

  return (
    <div
      className="flex flex-col h-full stars-bg relative"
      style={{ background: 'linear-gradient(180deg, #0a0a1a 0%, #0f0520 60%, #0a0a1a 100%)' }}
    >
      {/* Back arrow */}
      {step > 0 && (
        <button
          onClick={back}
          className="absolute top-12 left-5 z-20 text-purple-400 hover:text-purple-200 transition-colors p-2"
          aria-label="Go back"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </button>
      )}

      {/* Progress dots */}
      {step > 0 && (
        <div className="flex justify-center gap-1.5 pt-14 pb-2 relative z-10">
          {Array.from({ length: TOTAL_STEPS - 1 }).map((_, i) => (
            <div
              key={i}
              className="rounded-full transition-all duration-300"
              style={{
                width: i < step - 1 ? '20px' : '6px',
                height: '6px',
                background: i < step - 1 ? '#7c3aed' : i === step - 1 ? '#c4b5fd' : '#1e1040',
              }}
            />
          ))}
        </div>
      )}

      <div className="flex-1 flex flex-col items-center justify-center px-6 relative z-10">

        {/* ── Step 0: Welcome ── */}
        {step === 0 && (
          <div className="flex flex-col items-center gap-6 animate-fade-in text-center">
            <img
              src="./assets/labubu-happy.png"
              alt="Labubu"
              className="pixel-img animate-bounce-soft"
              style={{ width: 160, height: 160, objectFit: 'contain' }}
            />
            <div className="flex flex-col gap-3">
              <p className="font-pixel text-yellow-200 leading-relaxed" style={{ fontSize: '0.65rem' }}>
                hi there, sleep buddy!! 👋
              </p>
              <p className="font-pixel text-purple-200 leading-relaxed" style={{ fontSize: '0.55rem' }}>
                I'm Labubu — and I am SO excited.
              </p>
              <p className="font-pixel text-purple-200 leading-relaxed" style={{ fontSize: '0.55rem' }}>
                we're doing a 21-day sleep challenge.
              </p>
              <p className="font-pixel text-purple-300 leading-relaxed" style={{ fontSize: '0.55rem' }}>
                better sleep. daily tips. a journal.
              </p>
              <p className="font-pixel text-yellow-300 leading-relaxed mt-1" style={{ fontSize: '0.6rem' }}>
                are you ready to start?
              </p>
            </div>
            <button className="btn-pixel btn-primary mt-2" onClick={next} style={{ minWidth: '200px' }}>
              yes. let's go →
            </button>
          </div>
        )}

        {/* ── Step 1: Names (merged) ── */}
        {step === 1 && (
          <div className="flex flex-col items-center gap-5 animate-fade-in w-full">
            <img
              src="./assets/labubu-happy.png"
              alt="Labubu"
              className="pixel-img animate-bounce-soft"
              style={{ width: 110, height: 110, objectFit: 'contain' }}
            />
            <div className="text-center flex flex-col gap-1">
              <p className="font-pixel text-yellow-200 leading-relaxed" style={{ fontSize: '0.6rem' }}>
                let's get acquainted.
              </p>
            </div>
            <div className="w-full flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="font-pixel text-purple-400" style={{ fontSize: '0.45rem' }}>your name</label>
                <input
                  type="text"
                  value={userName}
                  onChange={e => setUserName(e.target.value)}
                  placeholder="your name"
                  maxLength={20}
                  className="w-full px-4 py-3 text-center border-2 border-purple-700 bg-purple-950/60 text-purple-100 placeholder-purple-600 outline-none focus:border-purple-400 transition-colors"
                  style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1rem' }}
                  autoFocus
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-pixel text-purple-400" style={{ fontSize: '0.45rem' }}>name your labubu <span className="text-purple-600">(skip for "Lazuzu")</span></label>
                <input
                  type="text"
                  value={labubuName}
                  onChange={e => setLabubuName(e.target.value)}
                  placeholder="Lazuzu"
                  maxLength={20}
                  className="w-full px-4 py-3 text-center border-2 border-purple-700 bg-purple-950/60 text-purple-100 placeholder-purple-600 outline-none focus:border-purple-400 transition-colors"
                  style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1rem' }}
                  onKeyDown={e => e.key === 'Enter' && userName.trim() && next()}
                />
              </div>
            </div>
            <button
              className="btn-pixel btn-primary"
              style={{ minWidth: '200px', opacity: userName.trim() ? 1 : 0.4 }}
              onClick={() => userName.trim() && next()}
            >
              that's us →
            </button>
          </div>
        )}

        {/* ── Step 2: Times (merged) ── */}
        {step === 2 && (
          <div className="flex flex-col items-center gap-5 animate-fade-in w-full">
            <img
              src="./assets/labubu-sleeping.png"
              alt="Labubu sleeping"
              className="pixel-img animate-float"
              style={{ width: 110, height: 110, objectFit: 'contain' }}
            />
            <div className="text-center flex flex-col gap-1">
              <p className="font-pixel text-yellow-200 leading-relaxed" style={{ fontSize: '0.6rem' }}>
                ok {userName || 'you'}. the big question.
              </p>
              <p className="font-pixel text-purple-400 leading-relaxed" style={{ fontSize: '0.5rem' }}>
                be honest. this is our commitment.
              </p>
            </div>
            <div className="w-full flex flex-col gap-4">
              <div className="flex flex-col gap-1 items-center">
                <label className="font-pixel text-purple-400" style={{ fontSize: '0.45rem' }}>🌙 bedtime</label>
                <input
                  type="time"
                  value={bedtime}
                  onChange={e => setBedtime(e.target.value)}
                  className="px-6 py-3 border-2 border-purple-700 bg-purple-950/60 text-purple-100 outline-none focus:border-purple-400 transition-colors text-center"
                  style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1.4rem', minWidth: '160px' }}
                />
              </div>
              <div className="flex flex-col gap-1 items-center">
                <label className="font-pixel text-purple-400" style={{ fontSize: '0.45rem' }}>☀️ wake time</label>
                <input
                  type="time"
                  value={wakeTime}
                  onChange={e => setWakeTime(e.target.value)}
                  className="px-6 py-3 border-2 border-purple-700 bg-purple-950/60 text-purple-100 outline-none focus:border-purple-400 transition-colors text-center"
                  style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1.4rem', minWidth: '160px' }}
                />
              </div>
            </div>
            <button className="btn-pixel btn-primary" style={{ minWidth: '200px' }} onClick={next}>
              deal. let's do it →
            </button>
          </div>
        )}

        {/* ── Step 3: How it works (single screen) ── */}
        {step === 3 && (
          <div className="flex flex-col items-center gap-5 animate-fade-in text-center w-full">
            <img
              src="./assets/labubu-graduating.png"
              alt="Labubu"
              className="pixel-img animate-float"
              style={{ width: 110, height: 110, objectFit: 'contain' }}
            />
            <p className="font-pixel text-yellow-300" style={{ fontSize: '0.65rem' }}>
              here's how this works
            </p>
            <div className="w-full flex flex-col gap-3 text-left">
              {[
                { emoji: '🌙', text: 'tuck me in every night — it\'s our bedtime signal. phone down after.' },
                { emoji: '☀️', text: 'wake me up every morning — tell me how you slept.' },
                { emoji: '💡', text: 'get one sleep tip a day on the home screen.' },
                { emoji: '🎓', text: '21 nights. we both graduate. let\'s go.' },
              ].map(({ emoji, text }) => (
                <div key={emoji} className="flex items-start gap-3 border border-purple-900 bg-purple-950/40 px-3 py-2">
                  <span style={{ fontSize: '1rem', flexShrink: 0 }}>{emoji}</span>
                  <p className="font-pixel text-purple-200 leading-relaxed" style={{ fontSize: '0.48rem' }}>{text}</p>
                </div>
              ))}
            </div>
            <button className="btn-pixel btn-primary mt-1" style={{ minWidth: '200px' }} onClick={finish}>
              I'm in. let's start 🌙
            </button>
          </div>
        )}

      </div>
    </div>
  )
}
