// ─── Sleep Score Calculator ──────────────────────────────────────────────────
// Spec from labubu-state-rules.md:
//   Duration (40 pts): 7-9h=40, 6-6.9h=25, 9-10h=20, 5-5.9h=10, <5h=0
//   Quality  (30 pts): 5★=30, 4★=22, 3★=15, 2★=7, 1★=0
//   Consistency (30 pts): ±15min=30, ±30min=20, ±60min=10, 60+min=0
// Total → happy 75-100 / neutral 50-74 / sad 25-49 / sleepy 0-24

import { getStageFromStreak } from '../data/evolution'

export function calculateSleepScore({ durationHours, qualityRating, targetBedtime, actualBedtimeTs }) {
  const d = durationScore(durationHours ?? 0)
  const q = qualityScore(qualityRating ?? 3)
  const c = consistencyScore(targetBedtime, actualBedtimeTs)
  return Math.min(100, d + q + c)
}

function durationScore(hours) {
  if (hours >= 7 && hours <= 9) return 40
  if (hours > 9 && hours <= 10) return 20   // oversleeping
  if (hours >= 6)               return 25   // 6–6.9
  if (hours >= 5)               return 10   // 5–5.9
  return 0
}

function qualityScore(rating) {
  const map = { 5: 30, 4: 22, 3: 15, 2: 7, 1: 0 }
  return map[rating] ?? 15
}

function consistencyScore(targetBedtime, actualBedtimeTs) {
  if (!targetBedtime || !actualBedtimeTs) return 10
  const [th, tm] = targetBedtime.split(':').map(Number)
  const actual     = new Date(actualBedtimeTs)
  const targetMins = th * 60 + tm
  const actualMins = actual.getHours() * 60 + actual.getMinutes()
  let diffMins     = Math.abs(actualMins - targetMins)
  if (diffMins > 720) diffMins = 1440 - diffMins  // midnight wrap
  if (diffMins <= 15) return 30
  if (diffMins <= 30) return 20
  if (diffMins <= 60) return 10
  return 0
}

// Duration in hours from two ISO timestamps
export function calcDurationHours(bedtimeTs, wakeTs) {
  if (!bedtimeTs || !wakeTs) return null
  const ms = new Date(wakeTs).getTime() - new Date(bedtimeTs).getTime()
  return Math.max(0, ms / (1000 * 60 * 60))
}

// Blend happiness: 70% new score + 30% previous
export function blendHappiness(prev, newScore) {
  return Math.round(newScore * 0.7 + (prev ?? 80) * 0.3)
}

// Increment streak based on sleep session, not raw time elapsed.
// A new session is defined by a tuck-in that happened after the last wake-up.
export function calcNewStreak(currentStreak, lastWokenUp, lastTuckedIn) {
  if (!lastWokenUp) return (currentStreak ?? 0) + 1

  // New tuck-in after last wake-up → this is a fresh sleep session → always increment
  if (lastTuckedIn && new Date(lastTuckedIn) > new Date(lastWokenUp)) {
    return (currentStreak ?? 0) + 1
  }

  // Fallback: time-based (e.g. last_tucked_in not recorded)
  const hoursDiff = (Date.now() - new Date(lastWokenUp).getTime()) / (1000 * 60 * 60)
  if (hoursDiff < 18) return currentStreak ?? 0        // already checked in today
  if (hoursDiff < 36) return (currentStreak ?? 0) + 1  // consecutive day
  return 1                                              // streak broken
}

export function calcEvolutionStage(streakDays) {
  return getStageFromStreak(streakDays).stage
}
