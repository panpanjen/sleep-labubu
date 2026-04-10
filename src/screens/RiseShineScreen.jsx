import { useState, useEffect } from 'react'
import { STALL_DIALOGUES } from '../data/stallDialogues'
import { getTodayTip } from '../data/tips'
import { getTodaySleepLog, upsertSleepLog, upsertPetState, getPetState } from '../lib/db'
import {
  calculateSleepScore, calcDurationHours, blendHappiness, calcNewStreak, calcEvolutionStage
} from '../lib/sleepScore'
import { getStateFromScore } from '../lib/labubuState'

// ─── Quality options ─────────────────────────────────────────────────────────
const QUALITY_OPTIONS = [
  { value: 1, emoji: '😵', label: 'dead log' },
  { value: 2, emoji: '😞', label: 'rough' },
  { value: 3, emoji: '😐', label: 'ok I guess' },
  { value: 4, emoji: '😊', label: 'pretty good' },
  { value: 5, emoji: '☁️', label: 'actual cloud' },
]

const SCORE_REACTIONS = {
  happy:   "7-9 hours?? PERFECT. that's literally what scientists ordered. I'm so proud of us.",
  neutral: "ok. not bad. not amazing. we've had better nights. we've had worse. tomorrow though.",
  sad:     "less than 6 hours. Lazuzu is… not okay. are YOU okay? let's fix this tonight.",
  sleepy:  "…your circadian rhythm called. it's lost. it doesn't know where it is anymore.",
}

const SPRITE_FOR_STATE = {
  happy:   '/assets/labubu-happy.png',
  neutral: '/assets/labubu-neutral.png',
  sad:     '/assets/labubu-sad.png',
  sleepy:  '/assets/labubu-sleepy.png',
}

// ─── Phases: sleeping → grumpy1 → quiz? → checkin → score → tip ──────────────

export default function RiseShineScreen({ pet, onComplete, onBack }) {
  const [phase, setPhase]               = useState('sleeping')
  const [sleepLog, setSleepLog]         = useState(null)
  const [showQuiz, setShowQuiz]         = useState(false)
  const [quizOptions, setQuizOptions]   = useState([])
  const [quizAnswered, setQuizAnswered] = useState(false)
  const [quizCorrect, setQuizCorrect]   = useState(false)
  const [quality, setQuality]           = useState(null)
  const [notes, setNotes]               = useState('')
  const [sleepScore, setSleepScore]     = useState(null)
  const [scoreState, setScoreState]     = useState('neutral')
  const [saving, setSaving]             = useState(false)
  const [isDaytime, setIsDaytime]       = useState(false)

  // Capture wake time at mount so it's consistent even if user takes a while
  const [wakeTimestamp] = useState(() => new Date().toISOString())
  const tip = getTodayTip()

  // Fetch today's sleep log to get bedtime + tip_shown for quiz
  useEffect(() => {
    getTodaySleepLog().then(log => {
      setSleepLog(log)
      if (log?.tip_shown && Math.random() < 0.3) {
        const options = buildQuizOptions(log.tip_shown)
        if (options) {
          setQuizOptions(options)
          setShowQuiz(true)
        }
      }
    }).catch(() => {})
  }, [])

  function buildQuizOptions(tipShownId) {
    const correct = STALL_DIALOGUES.find(s => s.id === tipShownId)
    if (!correct) return null
    const wrongs = STALL_DIALOGUES
      .filter(s => s.id !== tipShownId)
      .sort(() => Math.random() - 0.5)
      .slice(0, 2)
    if (wrongs.length < 2) return null
    return [
      { id: correct.id,   snippet: snippetFact(correct.fact),   correct: true  },
      { id: wrongs[0].id, snippet: snippetFact(wrongs[0].fact), correct: false },
      { id: wrongs[1].id, snippet: snippetFact(wrongs[1].fact), correct: false },
    ].sort(() => Math.random() - 0.5)
  }

  function snippetFact(fact) {
    const key = fact.split('.')[0].split('?')[0].replace('did you know ', '')
    return key.length > 60 ? key.slice(0, 57) + '…' : key
  }

  // ── Handlers ─────────────────────────────────────────────────────────────

  const handleWakeTap = () => {
    setIsDaytime(true)
    setPhase('grumpy1')
    // Record wake timestamp immediately
    upsertSleepLog({ wake_timestamp: wakeTimestamp }).catch(() => {})
  }

  const handleGrumpyTap = () => {
    setPhase(showQuiz && quizOptions.length > 0 ? 'quiz' : 'checkin')
  }

  const handleQuizAnswer = (option) => {
    setQuizAnswered(true)
    setQuizCorrect(option.correct)
  }

  const handleCheckinSubmit = async () => {
    if (!quality) return
    setSaving(true)

    const durationHours = calcDurationHours(sleepLog?.bedtime_timestamp, wakeTimestamp)
    const score = calculateSleepScore({
      durationHours:    durationHours ?? 7,  // default if no bedtime recorded
      qualityRating:    quality,
      targetBedtime:    pet?.targetBedtime,
      actualBedtimeTs:  sleepLog?.bedtime_timestamp,
    })
    setSleepScore(score)
    setScoreState(getStateFromScore(score))

    try {
      const currentPet  = await getPetState()
      const newStreak   = calcNewStreak(currentPet?.streak_days ?? pet?.streakDays ?? 0, currentPet?.last_woken_up, currentPet?.last_tucked_in)
      const newHappiness = blendHappiness(currentPet?.happiness_score ?? pet?.happinessScore ?? 80, score)
      const newStage    = calcEvolutionStage(newStreak)

      await Promise.all([
        upsertSleepLog({
          wake_timestamp:  wakeTimestamp,
          quality_rating:  quality,
          notes:           notes.trim() || null,
          duration_hours:  durationHours ? parseFloat(durationHours.toFixed(2)) : null,
          sleep_score:     score,
        }),
        upsertPetState({
          happiness_score: newHappiness,
          evolution_stage: newStage,
          streak_days:     newStreak,
          last_woken_up:   wakeTimestamp,
          graduated:       newStreak >= 21,
        }),
      ])
    } catch (err) {
      console.error('Rise & shine save error:', err)
    }

    setSaving(false)
    setPhase('score')
  }

  // ── Background transition: night → dawn ────────────────────────────────────
  const bg = isDaytime
    ? 'linear-gradient(180deg, #120520 0%, #7c2d12 35%, #fed7aa 70%, #fff7ed 100%)'
    : 'linear-gradient(180deg, #04040f 0%, #0a0520 40%, #0d0028 100%)'

  return (
    <div
      className="flex flex-col h-full relative overflow-hidden"
      style={{ background: bg, transition: 'background 2s ease' }}
    >
      {!isDaytime && <Stars />}

      {/* Back button — only on sleeping phase */}
      {phase === 'sleeping' && (
        <button
          onClick={onBack}
          className="absolute top-12 left-4 text-purple-600 hover:text-purple-400 z-20 p-2"
          style={{ fontSize: '0.7rem', fontFamily: 'Press Start 2P, monospace' }}
        >←</button>
      )}

      <div className="flex-1 flex flex-col items-center justify-center px-6 relative z-10">

        {/* ── sleeping ── */}
        {phase === 'sleeping' && (
          <div className="flex flex-col items-center gap-6 animate-fade-in text-center w-full">
            <div className="relative">
              <img src="/assets/labubu-sleeping.png" alt="Labubu sleeping"
                className="pixel-img animate-float"
                style={{ width: 200, height: 200, objectFit: 'contain' }}
              />
              <ZzzBubbles />
            </div>
            <div className="flex flex-col gap-2">
              <p className="font-pixel text-purple-400 leading-relaxed" style={{ fontSize: '0.55rem' }}>
                …m'not getting up.
              </p>
              <p className="font-pixel text-purple-600 leading-relaxed" style={{ fontSize: '0.5rem' }}>
                five more minutes.
              </p>
            </div>
            <button
              className="btn-pixel btn-day mt-2"
              style={{ minWidth: '220px' }}
              onClick={handleWakeTap}
            >
              Wake up Lazuzu ☀️
            </button>
          </div>
        )}

        {/* ── grumpy1 ── */}
        {phase === 'grumpy1' && (
          <div className="flex flex-col items-center gap-6 animate-fade-in text-center w-full">
            <img src="/assets/labubu-grumpy-morning.png" alt="Labubu grumpy"
              className="pixel-img animate-wobble"
              style={{ width: 180, height: 180, objectFit: 'contain' }}
            />
            <div className="flex flex-col gap-2">
              <p className="font-pixel text-orange-300 leading-relaxed" style={{ fontSize: '0.55rem' }}>
                …
              </p>
              <p className="font-pixel text-orange-200 leading-relaxed" style={{ fontSize: '0.5rem' }}>
                one eye open.
              </p>
              <p className="font-pixel text-purple-300 leading-relaxed" style={{ fontSize: '0.5rem' }}>
                you're going to make me get up.
              </p>
              <p className="font-pixel text-purple-500 leading-relaxed" style={{ fontSize: '0.48rem' }}>
                aren't you.
              </p>
            </div>
            <button
              className="btn-pixel btn-day mt-2"
              style={{ minWidth: '210px' }}
              onClick={handleGrumpyTap}
            >
              come on, up you get →
            </button>
          </div>
        )}

        {/* ── quiz ── */}
        {phase === 'quiz' && !quizAnswered && (
          <div className="flex flex-col items-center gap-5 animate-fade-in text-center w-full">
            <img src="/assets/labubu-grumpy-morning.png" alt="Labubu"
              className="pixel-img animate-wobble"
              style={{ width: 120, height: 120, objectFit: 'contain' }}
            />
            <div className="flex flex-col gap-2">
              <p className="font-pixel text-orange-300 leading-relaxed" style={{ fontSize: '0.55rem' }}>
                ok fine. but FIRST.
              </p>
              <p className="font-pixel text-purple-200 leading-relaxed" style={{ fontSize: '0.5rem' }}>
                what did I tell you last night?
              </p>
            </div>
            <div className="flex flex-col gap-3 w-full">
              {quizOptions.map((opt, i) => (
                <button
                  key={i}
                  className="btn-pixel btn-night w-full"
                  style={{ fontSize: '0.44rem', lineHeight: 1.8, textAlign: 'left', padding: '12px 16px' }}
                  onClick={() => handleQuizAnswer(opt)}
                >
                  {opt.snippet}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── quiz answered ── */}
        {phase === 'quiz' && quizAnswered && (
          <div className="flex flex-col items-center gap-6 animate-fade-in text-center w-full">
            <img
              src={quizCorrect ? '/assets/labubu-happy.png' : '/assets/labubu-neutral.png'}
              alt="Labubu"
              className={`pixel-img ${quizCorrect ? 'animate-bounce-soft' : 'animate-float'}`}
              style={{ width: 140, height: 140, objectFit: 'contain' }}
            />
            <p className="font-pixel text-yellow-200 leading-relaxed max-w-xs" style={{ fontSize: '0.5rem' }}>
              {quizCorrect
                ? "CORRECT!! you were paying attention!! I'm so pleased."
                : "…really. REALLY. ok fine I'll get up anyway but I'm disappointed."}
            </p>
            <button
              className="btn-pixel btn-day mt-2"
              style={{ minWidth: '200px' }}
              onClick={() => setPhase('checkin')}
            >
              ok let's go →
            </button>
          </div>
        )}

        {/* ── checkin ── */}
        {phase === 'checkin' && (
          <div className="flex flex-col items-center gap-5 animate-slide-up w-full">
            <img src="/assets/labubu-neutral.png" alt="Labubu"
              className="pixel-img animate-float"
              style={{ width: 90, height: 90, objectFit: 'contain' }}
            />

            <div className="text-center">
              <p className="font-pixel text-orange-300 leading-relaxed" style={{ fontSize: '0.55rem' }}>
                ok. on a scale of
              </p>
              <p className="font-pixel text-yellow-200 leading-relaxed" style={{ fontSize: '0.55rem' }}>
                'dead log' to 'actual cloud'…
              </p>
              <p className="font-pixel text-orange-200 leading-relaxed mt-1" style={{ fontSize: '0.5rem' }}>
                how was it?
              </p>
            </div>

            {/* Quality selector */}
            <div className="grid grid-cols-5 gap-2 w-full">
              {QUALITY_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setQuality(opt.value)}
                  className="flex flex-col items-center gap-1 py-3 border-2 transition-all"
                  style={{
                    borderColor: quality === opt.value ? '#fb923c' : '#3b1a6e',
                    background:  quality === opt.value ? 'rgba(251,146,60,0.15)' : 'rgba(10,5,32,0.6)',
                    transform:   quality === opt.value ? 'scale(1.08)' : 'scale(1)',
                  }}
                >
                  <span style={{ fontSize: '1.3rem' }}>{opt.emoji}</span>
                  <span className="font-pixel text-purple-300" style={{ fontSize: '0.3rem', lineHeight: 1.5 }}>
                    {opt.label}
                  </span>
                </button>
              ))}
            </div>

            {/* Notes */}
            <div className="w-full">
              <p className="font-pixel text-purple-500 mb-2" style={{ fontSize: '0.45rem' }}>
                anything weird happen? spill. (optional)
              </p>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="dreams? existential thoughts at 3am?"
                rows={2}
                maxLength={200}
                className="w-full px-3 py-2 border-2 border-purple-700 bg-purple-950/60 text-white placeholder-white/50 outline-none focus:border-purple-400 resize-none transition-colors"
                style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.9rem' }}
              />
            </div>

            <button
              className="btn-pixel btn-day w-full"
              style={{ opacity: quality ? 1 : 0.4 }}
              onClick={quality && !saving ? handleCheckinSubmit : undefined}
              disabled={saving || !quality}
            >
              {saving ? 'calculating…' : 'see my score →'}
            </button>
          </div>
        )}

        {/* ── score ── */}
        {phase === 'score' && sleepScore !== null && (
          <ScoreReveal
            score={sleepScore}
            scoreState={scoreState}
            onNext={() => setPhase('tip')}
          />
        )}

        {/* ── tip ── */}
        {phase === 'tip' && (
          <div className="flex flex-col items-center gap-5 animate-fade-in text-center w-full">
            <img src="/assets/labubu-happy.png" alt="Labubu"
              className="pixel-img animate-bounce-soft"
              style={{ width: 110, height: 110, objectFit: 'contain' }}
            />
            <p className="font-pixel text-orange-300" style={{ fontSize: '0.55rem' }}>
              ok one thing before you go—
            </p>
            <div
              className="border-2 px-5 py-4 w-full max-w-xs"
              style={{ borderColor: '#fb923c', background: 'rgba(124,45,18,0.2)' }}
            >
              <p className="font-pixel text-yellow-200 leading-relaxed text-left" style={{ fontSize: '0.45rem' }}>
                {tip?.labubuDialogue}
              </p>
            </div>
            <button
              className="btn-pixel btn-day mt-2"
              style={{ minWidth: '200px' }}
              onClick={() => onComplete({ score: sleepScore })}
            >
              start the day ☀️
            </button>
          </div>
        )}

      </div>
    </div>
  )
}

// ─── Score reveal with count-up animation ────────────────────────────────────
function ScoreReveal({ score, scoreState, onNext }) {
  const [animScore, setAnimScore] = useState(0)

  useEffect(() => {
    let current = 0
    const tick = setInterval(() => {
      current += 3
      if (current >= score) {
        setAnimScore(score)
        clearInterval(tick)
      } else {
        setAnimScore(current)
      }
    }, 25)
    return () => clearInterval(tick)
  }, [score])

  const barColor = animScore >= 75 ? '#fbbf24'
                 : animScore >= 50 ? '#c4b5fd'
                 : animScore >= 25 ? '#818cf8'
                 : '#475569'

  return (
    <div className="flex flex-col items-center gap-5 animate-slide-up text-center w-full">
      <img
        src={SPRITE_FOR_STATE[scoreState]}
        alt="Labubu"
        className={`pixel-img ${scoreState === 'happy' ? 'animate-bounce-soft' : 'animate-float'}`}
        style={{ width: 150, height: 150, objectFit: 'contain' }}
      />

      <div className="flex flex-col items-center gap-3">
        <p className="font-pixel text-purple-400" style={{ fontSize: '0.48rem' }}>sleep score</p>
        <p className="font-pixel text-yellow-300" style={{ fontSize: '2.2rem', lineHeight: 1 }}>
          {animScore}
        </p>
        {/* Score bar */}
        <div className="w-48 h-3 border-2 border-purple-700 bg-purple-950/50">
          <div
            className="h-full transition-all duration-300"
            style={{ width: `${animScore}%`, background: barColor }}
          />
        </div>
      </div>

      <p className="font-pixel text-purple-200 leading-relaxed max-w-xs" style={{ fontSize: '0.46rem' }}>
        {SCORE_REACTIONS[scoreState]}
      </p>

      <button className="btn-pixel btn-day mt-2" style={{ minWidth: '200px' }} onClick={onNext}>
        ok keep going →
      </button>
    </div>
  )
}

// ─── Zzz bubbles ─────────────────────────────────────────────────────────────
function ZzzBubbles() {
  return (
    <div className="absolute top-0 right-0 pointer-events-none" style={{ zIndex: 20 }}>
      <span className="absolute font-pixel text-purple-300"
        style={{ fontSize: '0.55rem', top: '8px', right: '-4px', animation: 'zzz-float 2.5s ease-in-out infinite' }}>z</span>
      <span className="absolute font-pixel text-purple-400"
        style={{ fontSize: '0.7rem', top: '-4px', right: '8px', animation: 'zzz-float 2.5s ease-in-out 0.8s infinite' }}>z</span>
      <span className="absolute font-pixel text-purple-300"
        style={{ fontSize: '0.85rem', top: '-14px', right: '20px', animation: 'zzz-float-2 2.5s ease-in-out 1.6s infinite' }}>Z</span>
    </div>
  )
}

// ─── Stars background ─────────────────────────────────────────────────────────
function Stars() {
  const [stars] = useState(() =>
    Array.from({ length: 18 }, () => ({
      x:        Math.random() * 100,
      y:        Math.random() * 60,
      size:     Math.random() * 2 + 1,
      delay:    `${(Math.random() * 3).toFixed(1)}s`,
      duration: `${(Math.random() * 2 + 2).toFixed(1)}s`,
    }))
  )
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
      {stars.map((s, i) => (
        <div key={i} className="absolute rounded-full bg-white"
          style={{
            left: `${s.x}%`, top: `${s.y}%`,
            width: s.size, height: s.size,
            animation: `star-twinkle ${s.duration} ease-in-out ${s.delay} infinite`,
          }}
        />
      ))}
    </div>
  )
}
