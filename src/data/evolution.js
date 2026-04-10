// ─── Sleep School Evolution Stages ──────────────────────────────────────────
// 21-day journey from clueless new kid → certified sleep school graduate

export const EVOLUTION_STAGES = [
  {
    stage: 1,
    emoji: '🎒',
    label: 'New Kid',
    subtitle: 'day 1 of sleep school',
    unlockDay: 0,
    unlockDialogue: null, // starting state, no unlock moment
    description: 'just enrolled. doesn\'t know the rules yet. staying up way too late.',
  },
  {
    stage: 2,
    emoji: '⭐',
    label: 'Gold Star Student',
    subtitle: '3-day streak',
    unlockDay: 3,
    unlockDialogue: 'WAIT. I got a gold star?? I have NEVER had a gold star. do I put it on the fridge??',
    description: 'mastered nap time. first gold star achieved. starting to get it.',
  },
  {
    stage: 3,
    emoji: '📚',
    label: 'Sleep Scholar',
    subtitle: '7-day streak',
    unlockDay: 7,
    unlockDialogue: 'I packed a sleep journal. and coloured pencils. I don\'t know why. it felt right.',
    description: 'taking notes. reading the tips. doing the homework. this is a whole thing.',
  },
  {
    stage: 4,
    emoji: '🏆',
    label: 'Top of the Class',
    subtitle: '14-day streak',
    unlockDay: 14,
    unlockDialogue: 'they put my name on a CERTIFICATE. top of the class. me. I\'m slightly overwhelmed.',
    description: 'model student. other Lazuzus look up to me now. (I pretend not to notice.)',
  },
  {
    stage: 5,
    emoji: '🎓',
    label: 'Sleep School Graduate',
    subtitle: '21-day streak',
    unlockDay: 21,
    unlockDialogue: 'WE DID IT. SLEEP SCHOOL. GRADUATED. I have a diploma AND a crown. I\'m not okay.',
    description: 'fully certified. circadian rhythm: stable. emotional state: crying happy tears.',
  },
]

// Quick lookup by stage number
export const getStage = (stageNum) =>
  EVOLUTION_STAGES.find(s => s.stage === stageNum) ?? EVOLUTION_STAGES[0]

// Get stage from streak days
export const getStageFromStreak = (streakDays) => {
  if (streakDays >= 21) return EVOLUTION_STAGES[4]
  if (streakDays >= 14) return EVOLUTION_STAGES[3]
  if (streakDays >= 7)  return EVOLUTION_STAGES[2]
  if (streakDays >= 3)  return EVOLUTION_STAGES[1]
  return EVOLUTION_STAGES[0]
}
