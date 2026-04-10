import { useState } from 'react'

// Total steps: 0=welcome, 1=your name, 2=labubu name, 3=bedtime, 4=wake time, 5-8=ritual explainer slides
const TOTAL_STEPS = 9

const RITUAL_SLIDES = [
  {
    emoji: '🌙',
    title: 'tuck me in every night',
    sprite: 'sleeping',
    body: 'when you\'re ready for bed — open the app.\ntuck me in. it\'s our nightly signal.\nthen put your phone down. for real.\nsame time. every night. no skipping.',
  },
  {
    emoji: '☀️',
    title: 'our morning check-in',
    sprite: 'grumpy-morning',
    body: 'every morning, wake me up first.\n(I will be grumpy. very grumpy.)\ntell me how you slept — rate your night.\nyour sleep journal builds up over 21 days.',
  },
  {
    emoji: '💡',
    title: 'one sleep tip. every day.',
    sprite: 'happy',
    body: 'each day I\'ll share one sleep tip.\nsmall. practical. actually useful.\ncheck your tip card on the home screen.\none thing at a time. that\'s the whole idea.',
  },
  {
    emoji: '📚',
    title: 'learn when you\'re curious',
    sprite: 'graduating',
    body: 'the Learn tab has 30+ sleep tips.\nwind down routines. daily habits. the science.\nbrowse any time you want to go deeper.\n21 nights. we both graduate. 🎓',
  },
]

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

  const lastSlideStep = TOTAL_STEPS - 1  // step 8

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
              src="/assets/labubu-happy.png"
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

        {/* ── Step 1: User name ── */}
        {step === 1 && (
          <div className="flex flex-col items-center gap-6 animate-fade-in w-full">
            <img
              src="/assets/labubu-neutral.png"
              alt="Labubu"
              className="pixel-img animate-float"
              style={{ width: 120, height: 120, objectFit: 'contain' }}
            />
            <div className="text-center flex flex-col gap-2">
              <p className="font-pixel text-purple-300 leading-relaxed" style={{ fontSize: '0.6rem' }}>
                ok. first things first.
              </p>
              <p className="font-pixel text-yellow-200 leading-relaxed" style={{ fontSize: '0.6rem' }}>
                what do I call my buddy?
              </p>
            </div>
            <input
              type="text"
              value={userName}
              onChange={e => setUserName(e.target.value)}
              placeholder="your name"
              maxLength={20}
              className="w-full px-4 py-3 text-center border-2 border-purple-700 bg-purple-950/60 text-purple-100 placeholder-purple-600 outline-none focus:border-purple-400 transition-colors"
              style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1rem' }}
              onKeyDown={e => e.key === 'Enter' && userName.trim() && next()}
              autoFocus
            />
            <button
              className="btn-pixel btn-primary"
              style={{ minWidth: '200px', opacity: userName.trim() ? 1 : 0.4 }}
              onClick={() => userName.trim() && next()}
            >
              that's me →
            </button>
          </div>
        )}

        {/* ── Step 2: Labubu name ── */}
        {step === 2 && (
          <div className="flex flex-col items-center gap-6 animate-fade-in w-full">
            <img
              src="/assets/labubu-happy.png"
              alt="Labubu"
              className="pixel-img animate-bounce-soft"
              style={{ width: 120, height: 120, objectFit: 'contain' }}
            />
            <div className="text-center flex flex-col gap-2">
              <p className="font-pixel text-yellow-200 leading-relaxed" style={{ fontSize: '0.6rem' }}>
                hi {userName}!!
              </p>
              <p className="font-pixel text-purple-300 leading-relaxed" style={{ fontSize: '0.6rem' }}>
                now — what are you naming me?
              </p>
              <p className="font-pixel text-purple-400 leading-relaxed" style={{ fontSize: '0.5rem' }}>
                (choose wisely. you'll be saying this a lot.)
              </p>
            </div>
            <input
              type="text"
              value={labubuName}
              onChange={e => setLabubuName(e.target.value)}
              placeholder="my name"
              maxLength={20}
              className="w-full px-4 py-3 text-center border-2 border-purple-700 bg-purple-950/60 text-purple-100 placeholder-purple-600 outline-none focus:border-purple-400 transition-colors"
              style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1rem' }}
              onKeyDown={e => e.key === 'Enter' && labubuName.trim() && next()}
              autoFocus
            />
            <p className="text-purple-500 text-xs text-center">
              (skip to go with "Lazuzu")
            </p>
            <div className="flex gap-3">
              <button
                className="btn-pixel btn-night"
                onClick={() => { setLabubuName('Lazuzu'); next() }}
              >
                skip
              </button>
              <button
                className="btn-pixel btn-primary"
                style={{ opacity: labubuName.trim() ? 1 : 0.4 }}
                onClick={() => labubuName.trim() && next()}
              >
                perfect →
              </button>
            </div>
          </div>
        )}

        {/* ── Step 3: Bedtime ── */}
        {step === 3 && (
          <div className="flex flex-col items-center gap-6 animate-fade-in w-full">
            <img
              src="/assets/labubu-sleeping.png"
              alt="Labubu sleeping"
              className="pixel-img animate-float"
              style={{ width: 140, height: 140, objectFit: 'contain' }}
            />
            <div className="text-center flex flex-col gap-2">
              <p className="font-pixel text-purple-300 leading-relaxed" style={{ fontSize: '0.6rem' }}>
                ok {userName}. the big question.
              </p>
              <p className="font-pixel text-yellow-200 leading-relaxed" style={{ fontSize: '0.6rem' }}>
                what time are WE going to sleep?
              </p>
              <p className="font-pixel text-purple-400 leading-relaxed mt-1" style={{ fontSize: '0.5rem' }}>
                (that's right. we. you're my buddy now.)
              </p>
            </div>
            <input
              type="time"
              value={bedtime}
              onChange={e => setBedtime(e.target.value)}
              className="px-6 py-4 border-2 border-purple-700 bg-purple-950/60 text-purple-100 outline-none focus:border-purple-400 transition-colors text-center"
              style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1.5rem', minWidth: '160px' }}
            />
            <p className="font-pixel text-purple-500 text-center" style={{ fontSize: '0.45rem' }}>
              be honest. this is our commitment.
            </p>
            <button className="btn-pixel btn-primary" style={{ minWidth: '200px' }} onClick={next}>
              that's our bedtime →
            </button>
          </div>
        )}

        {/* ── Step 4: Wake time ── */}
        {step === 4 && (
          <div className="flex flex-col items-center gap-6 animate-fade-in w-full">
            <img
              src="/assets/labubu-grumpy-morning.png"
              alt="Labubu grumpy"
              className="pixel-img animate-wobble"
              style={{ width: 130, height: 130, objectFit: 'contain' }}
            />
            <div className="text-center flex flex-col gap-2">
              <p className="font-pixel text-purple-300 leading-relaxed" style={{ fontSize: '0.6rem' }}>
                ugh. fine.
              </p>
              <p className="font-pixel text-yellow-200 leading-relaxed" style={{ fontSize: '0.6rem' }}>
                and what time do WE wake up?
              </p>
              <p className="font-pixel text-purple-400 leading-relaxed mt-1" style={{ fontSize: '0.5rem' }}>
                (I will be grumpy. I'm warning you now.)
              </p>
            </div>
            <input
              type="time"
              value={wakeTime}
              onChange={e => setWakeTime(e.target.value)}
              className="px-6 py-4 border-2 border-purple-700 bg-purple-950/60 text-purple-100 outline-none focus:border-purple-400 transition-colors text-center"
              style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1.5rem', minWidth: '160px' }}
            />
            <p className="font-pixel text-purple-500 text-center" style={{ fontSize: '0.45rem' }}>
              stick to this. consistency is the whole point.
            </p>
            <button className="btn-pixel btn-primary" style={{ minWidth: '200px' }} onClick={next}>
              deal. let's do it →
            </button>
          </div>
        )}

        {/* ── Steps 5–8: Ritual explainer slides ── */}
        {step >= 5 && step <= lastSlideStep && (
          <RitualSlide
            slide={RITUAL_SLIDES[step - 5]}
            onNext={step < lastSlideStep ? next : finish}
            isLast={step === lastSlideStep}
            labubuName={labubuName || 'Lazuzu'}
          />
        )}

      </div>
    </div>
  )
}

function RitualSlide({ slide, onNext, isLast, labubuName }) {
  return (
    <div className="flex flex-col items-center gap-6 animate-fade-in text-center w-full">
      <div className="text-4xl">{slide.emoji}</div>
      <img
        src={`/assets/labubu-${slide.sprite}.png`}
        alt={slide.title}
        className="pixel-img animate-float"
        style={{ width: 130, height: 130, objectFit: 'contain' }}
      />
      <div className="flex flex-col gap-3">
        <p className="font-pixel text-yellow-300" style={{ fontSize: '0.65rem' }}>
          {slide.title}
        </p>
        {slide.body.split('\n').map((line, i) => (
          <p key={i} className="font-pixel text-purple-200 leading-relaxed" style={{ fontSize: '0.5rem' }}>
            {line.replace(/Labubu/g, labubuName)}
          </p>
        ))}
      </div>
      <button className="btn-pixel btn-primary mt-2" style={{ minWidth: '200px' }} onClick={onNext}>
        {isLast ? `I'm in. let's start 🌙` : 'got it →'}
      </button>
    </div>
  )
}
