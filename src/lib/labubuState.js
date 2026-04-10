// ─── Priority-based Labubu state resolver ──────────────────────────────────
// Priority: graduating > miss-you > sleeping > grumpy-morning > score-based

export function getLabubuState(pet, lastCheckIn = null, forceGrumpy = false) {
  // 1. Graduating — one-time celebration
  if (pet.graduating) return 'graduating'

  // 2. Dramatically sad — 1+ day away
  if (pet.daysSinceLastCheckIn >= 1) return 'miss-you'

  // 3. Sleeping — during sleep window (simplified: if tuckedIn flag set)
  if (pet.isSleeping) return 'sleeping'

  // 4. Grumpy morning — first 30 mins after wake tap
  if (forceGrumpy) return 'grumpy-morning'

  // 5. Score-based
  return getStateFromScore(pet.happinessScore ?? 80)
}

export function getStateFromScore(score) {
  if (score >= 75) return 'happy'
  if (score >= 50) return 'neutral'
  if (score >= 25) return 'sad'
  return 'sleepy'
}

// ─── CTA mode based on pet state + time of day ──────────────────────────────
// Priority: actual state (isSleeping) overrides time-based logic.
// Tuck-in and rise-and-shine can each only happen once per cycle.
export function getCTAMode(pet = {}) {
  const {
    isSleeping = false,
    targetBedtime = '22:00',
  } = pet

  // If Labubu is already sleeping, always prompt to wake up
  if (isSleeping) return 'riseshine'

  // Always allow tuck-in when Labubu is awake
  return 'tuckin'
}
