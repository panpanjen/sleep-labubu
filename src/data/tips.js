// ─── 30 Sleep Tips — all in Labubu's voice ──────────────────────────────────
// Categories: screens | routine | environment | food | mind

export const SLEEP_TIPS = [
  // 📱 Light & Screens (6 tips)
  {
    id: 1, category: 'screens', emoji: '📱',
    content: 'Blue light from screens suppresses melatonin production.',
    labubuDialogue: 'ok so— your phone is literally tricking your brain into thinking it\'s daytime. turns out blue light kills melatonin. your sleep hormone. switch to night mode NOW. your future self says thank you.',
    hoursBeforeBed: 1,
  },
  {
    id: 2, category: 'screens', emoji: '🌙',
    content: 'Dim your screen brightness 2 hours before bed.',
    labubuDialogue: 'ok but actually— bright screens 2 hours before bed delay your body clock by up to 3 hours. THREE. dim everything. lights too. even your vibe.',
    hoursBeforeBed: 2,
  },
  {
    id: 3, category: 'screens', emoji: '📺',
    content: 'Watching exciting content before bed activates your stress response.',
    labubuDialogue: 'wait wait wait— that thriller you\'re watching? your brain can\'t tell it\'s not real. cortisol spikes. heart rate up. NOT the vibe before sleep. maybe choose something boring. I suggest: nothing.',
    hoursBeforeBed: 1,
  },
  {
    id: 4, category: 'screens', emoji: '🔕',
    content: 'Even notification sounds during sleep can fragment your sleep cycles.',
    labubuDialogue: 'ok one more thing (I promise)— those notification sounds at 2am? even if you don\'t wake up fully, your brain reacts. sleep gets fragmented. phone on silent. or across the room. or BOTH.',
    hoursBeforeBed: 0.5,
  },
  {
    id: 5, category: 'screens', emoji: '⌚',
    content: 'Checking the time when you can\'t sleep makes anxiety worse.',
    labubuDialogue: 'did you know?? did you KNOW?? checking the clock when you can\'t sleep makes it harder to fall asleep. your brain starts calculating. "I have 5 hours if I fall asleep NOW—" stop. flip the clock. just… stop.',
    hoursBeforeBed: null,
  },
  {
    id: 6, category: 'screens', emoji: '🌅',
    content: 'Morning sunlight exposure helps reset your circadian rhythm.',
    labubuDialogue: 'go find some sunlight. no seriously. your eyes need bright light within an hour of waking. it sets your body clock for the whole day. I\'ll wait. go. GO.',
    hoursAfterWake: 1,
  },

  // 🔁 Routine & Consistency (6 tips)
  {
    id: 7, category: 'routine', emoji: '⏰',
    content: 'Waking up at the same time every day is more important than bedtime.',
    labubuDialogue: 'good morning!! fun fact: waking up at the same time every day is actually more important than when you go to bed. wild right?? consistent wake time = anchored body clock. even on weekends. I know. I know.',
    hoursAfterWake: 0,
  },
  {
    id: 8, category: 'routine', emoji: '📅',
    content: 'Your body clock runs on a ~24-hour cycle and loves consistency.',
    labubuDialogue: 'ok so— your circadian rhythm is basically a very anxious schedule keeper. it needs the same bedtime. every. night. irregular sleep times confuse it. like showing up to class on a different day each week. chaos.',
    hoursBeforeBed: 2,
  },
  {
    id: 9, category: 'routine', emoji: '🛁',
    content: 'A warm bath or shower 1–2 hours before bed helps you fall asleep faster.',
    labubuDialogue: 'wait— taking a warm bath or shower before bed actually LOWERS your core body temp when you get out. and lower body temp = faster sleep onset. science is weird and I love it.',
    hoursBeforeBed: 1.5,
  },
  {
    id: 10, category: 'routine', emoji: '📖',
    content: 'Reading a physical book (not a screen) helps you wind down.',
    labubuDialogue: 'ok but actually— physical books are one of the best pre-sleep activities. no blue light. engages your imagination but not your stress response. also you feel very sophisticated. win-win.',
    hoursBeforeBed: 1,
  },
  {
    id: 11, category: 'routine', emoji: '🌙',
    content: 'A consistent 30-minute wind-down routine signals your brain that sleep is coming.',
    labubuDialogue: 'ok. 30 minutes. same thing. every night. your brain will start associating it with sleep. like pavlov\'s dog but instead of salivating you just… get sleepy. which is better.',
    hoursBeforeBed: 0.5,
  },
  {
    id: 12, category: 'routine', emoji: '🏃',
    content: 'Regular exercise improves sleep quality — but not right before bed.',
    labubuDialogue: 'exercise is great for sleep!! but vigorous exercise within 2 hours of bed raises your core temp and heart rate. harder to fall asleep. gentle stretching is fine. Lazuzu approves of gentle stretching.',
    hoursBeforeBed: 2,
  },

  // 🌡️ Environment (6 tips)
  {
    id: 13, category: 'environment', emoji: '🌡️',
    content: 'The ideal sleep temperature is 16–18°C (60–65°F).',
    labubuDialogue: 'wait— did you know your body temperature has to DROP to fall asleep? that means being cold = good actually. 16-18 degrees is the sweet spot. being cold at night isn\'t suffering. it\'s science. ok. goodnight.',
    hoursBeforeBed: 0,
  },
  {
    id: 14, category: 'environment', emoji: '🌑',
    content: 'Complete darkness improves melatonin production significantly.',
    labubuDialogue: 'ok so— even tiny amounts of light during sleep can suppress melatonin. streetlights through curtains. phone charging light. ALL OF IT. blackout curtains or sleep mask. I have one. it has stars on it.',
    hoursBeforeBed: 0,
  },
  {
    id: 15, category: 'environment', emoji: '🔇',
    content: 'White noise or earplugs can reduce the impact of environmental noise on sleep.',
    labubuDialogue: 'random sounds during sleep cause micro-arousals your brain responds to even if you don\'t fully wake up. white noise masks them. your brain stops reacting. deeper sleep. the science!! it\'s everywhere!!',
    hoursBeforeBed: null,
  },
  {
    id: 16, category: 'environment', emoji: '🛏️',
    content: 'Only use your bed for sleep and sex — not work, scrolling, or TV.',
    labubuDialogue: 'ok this one is important. your brain learns associations. if you do everything in bed, it stops associating bed with sleep. bed = sleep only. (this is called stimulus control therapy and it actually works)',
    hoursBeforeBed: null,
  },
  {
    id: 17, category: 'environment', emoji: '🌿',
    content: 'Fresh air circulation improves sleep quality.',
    labubuDialogue: 'slightly stuffy room? crack a window. CO2 builds up in unventilated rooms and reduces sleep quality. fresh air good. stuffy air bad. I don\'t make the rules. (plants also help but slowly. be patient.)',
    hoursBeforeBed: null,
  },
  {
    id: 18, category: 'environment', emoji: '🧸',
    content: 'Weighted blankets reduce anxiety and improve sleep onset.',
    labubuDialogue: 'weighted blankets activate the parasympathetic nervous system. that\'s the chill one. it literally signals your body to calm down. like being hugged by science. which is the best kind of hug.',
    hoursBeforeBed: null,
  },

  // ☕ Food & Drink (6 tips)
  {
    id: 19, category: 'food', emoji: '☕',
    content: 'Caffeine has a half-life of ~5-6 hours — time your last coffee carefully.',
    labubuDialogue: 'ok LISTEN. if your bedtime is 11pm, your last coffee should be no later than 3-4pm. caffeine has a 5-6 hour half-life. that 5pm coffee is still 50% active at bedtime. I\'m not saying don\'t have coffee. I\'m saying do the maths.',
    hoursBeforeBed: 6,
  },
  {
    id: 20, category: 'food', emoji: '🍷',
    content: 'Alcohol reduces REM sleep and causes sleep fragmentation.',
    labubuDialogue: 'I\'m not saying don\'t have fun. I\'m saying alcohol makes you fall asleep FAST but sleep BADLY. it suppresses REM sleep. the good stuff. the dream sleep. the memory-consolidation sleep. have fun. but maybe not tonight.',
    hoursBeforeBed: 3,
  },
  {
    id: 21, category: 'food', emoji: '🍔',
    content: 'Heavy meals within 3 hours of bed impair sleep quality.',
    labubuDialogue: 'big meal alert 🚨 your digestive system working overtime = higher body temp = harder to fall asleep. if you\'re eating heavy, do it now. in 3 hours? your sleep (and I) will suffer. and I will remember.',
    hoursBeforeBed: 3,
  },
  {
    id: 22, category: 'food', emoji: '🥛',
    content: 'Warm milk or herbal tea promotes relaxation before bed.',
    labubuDialogue: 'ok herbal tea time!! chamomile has apigenin — a compound that binds to GABA receptors in your brain. that\'s the calm-down receptor. your brain has a calm-down receptor!! science is incredible. drink the tea.',
    hoursBeforeBed: 1,
  },
  {
    id: 23, category: 'food', emoji: '💧',
    content: 'Staying hydrated during the day reduces night-time waking.',
    labubuDialogue: 'dehydration at night = more likely to wake up. but drinking lots RIGHT before bed = also waking up. the solution is: drink enough water DURING THE DAY. revolutionary concept. I know.',
    hoursBeforeBed: null,
    hoursAfterWake: 1,
  },
  {
    id: 24, category: 'food', emoji: '🍌',
    content: 'Magnesium-rich foods (bananas, nuts, leafy greens) support sleep quality.',
    labubuDialogue: 'wait wait wait— magnesium deficiency is extremely common and linked to poor sleep. bananas. almonds. spinach. dark chocolate (yes really). add them to your day. your GABA receptors will thank you. whatever those are.',
    hoursBeforeBed: null,
  },

  // 🧠 Mind & Body (6 tips)
  {
    id: 25, category: 'mind', emoji: '🧠',
    content: 'Writing a to-do list before bed reduces intrusive thoughts and helps you fall asleep.',
    labubuDialogue: 'ok one thing before you go— if you can\'t stop thinking about tomorrow, write it down. studies show offloading your to-do list onto paper before bed reduces cognitive arousal. your brain goes "ok someone\'s handling it" and relaxes. wild.',
    hoursBeforeBed: 1,
  },
  {
    id: 26, category: 'mind', emoji: '🫁',
    content: '4-7-8 breathing activates the parasympathetic nervous system.',
    labubuDialogue: '4-7-8 breathing: inhale 4 seconds. hold 7. exhale 8. do it 4 times. it activates your parasympathetic nervous system. the chill one. try it right now. I\'ll wait. (did you do it? you feel calmer. right?)',
    hoursBeforeBed: 0.5,
  },
  {
    id: 27, category: 'mind', emoji: '😟',
    content: 'Worrying in bed reinforces the association between your bed and anxiety.',
    labubuDialogue: 'if you\'re lying awake worrying, GET OUT OF BED. I know. sounds wrong. but lying there anxious teaches your brain to associate bed with anxiety. get up. do something boring. come back when sleepy. it\'s called sleep restriction therapy.',
    hoursBeforeBed: null,
  },
  {
    id: 28, category: 'mind', emoji: '🌊',
    content: 'Progressive muscle relaxation reduces physical tension and aids sleep.',
    labubuDialogue: 'progressive muscle relaxation: tense each muscle group for 5 seconds then release. toes. calves. thighs. stomach. chest. arms. face. by the time you finish, you\'ll be so relaxed you\'ll forget what you were anxious about.',
    hoursBeforeBed: 0.5,
  },
  {
    id: 29, category: 'mind', emoji: '⏱️',
    content: 'If you can\'t sleep after 20 minutes, get up rather than lying awake.',
    labubuDialogue: 'the 20-minute rule: if you\'re not asleep in 20 minutes, get up. do something calm in dim light. return when sleepy. lying awake in bed trains your brain to stay awake in bed. we are untraining that. together.',
    hoursBeforeBed: null,
  },
  {
    id: 30, category: 'mind', emoji: '🧘',
    content: 'Mindfulness meditation improves both sleep quality and duration.',
    labubuDialogue: 'ok so mindfulness. I know. I KNOW. but hear me out— even 10 minutes of meditation before bed reduces cortisol and improves sleep quality measurably. you don\'t have to like it. you just have to do it. (you might like it.)',
    hoursBeforeBed: 1,
  },
]

const TIP_KEY = 'labubu_tipIndex'

// Returns the current tip — persists across sessions until advanceTip() is called
export function getTodayTip() {
  let idx = localStorage.getItem(TIP_KEY)
  if (idx === null) {
    idx = Math.floor(Math.random() * SLEEP_TIPS.length)
    localStorage.setItem(TIP_KEY, idx)
  }
  return SLEEP_TIPS[Number(idx) % SLEEP_TIPS.length]
}

// Call after each rise & shine to rotate to a new tip
export function advanceTip() {
  const current = Number(localStorage.getItem(TIP_KEY) ?? 0)
  const next = (current + 1 + Math.floor(Math.random() * (SLEEP_TIPS.length - 1))) % SLEEP_TIPS.length
  localStorage.setItem(TIP_KEY, next)
}

// Returns the tip that should be shown at a given hours-before-bed window
export function getTipForWindow(hoursBeforeBed) {
  const candidates = SLEEP_TIPS.filter(t => t.hoursBeforeBed === hoursBeforeBed)
  if (!candidates.length) return null
  const dayOfYear = Math.floor(
    (new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000
  )
  return candidates[dayOfYear % candidates.length]
}
