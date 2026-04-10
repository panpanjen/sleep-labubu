// ─── Tuck-In Stall Dialogues ─────────────────────────────────────────────────
// Labubu's "one more thing" before sleeping.
// Both options always lead forward — no wrong answer.
// The chosen fact is saved as tip_shown for the morning quiz.

export const STALL_DIALOGUES = [
  {
    id: 1,
    setup: 'ok ok. one more thing.',
    fact: 'did you know your body temperature has to DROP to fall asleep? that means being cold is actually… good. wild. I know.',
    question: 'are you cold enough right now?',
    optionA: { label: 'actually yes ✓', response: 'perfect. optimal sleep conditions achieved. I\'m genuinely proud of you.' },
    optionB: { label: 'I\'m too warm', response: 'ok. crack a window or lose a layer. 18 degrees is the sweet spot. science said.' },
  },
  {
    id: 2,
    setup: 'wait wait wait—',
    fact: 'your brain literally rehearses memories while you sleep. like it\'s doing homework. for you. for free.',
    question: 'anything worth remembering today?',
    optionA: { label: 'yeah actually', response: 'good. your brain\'s got it. sleep will file it away properly. you\'re welcome.' },
    optionB: { label: 'not really lol', response: 'that\'s ok. your brain will find something. it\'s very thorough.' },
  },
  {
    id: 3,
    setup: 'ok but actually—',
    fact: 'humans are the only mammals that deliberately delay sleep. every other animal just… goes to sleep when they\'re tired. every. single. one.',
    question: 'and yet here we are.',
    optionA: { label: 'I\'m so normal', response: 'you are doing it RIGHT NOW though. going to sleep. you\'re basically an animal. I mean that nicely.' },
    optionB: { label: 'ok fair point', response: 'yes. fair point. now sleep. like a normal mammal. go.' },
  },
  {
    id: 4,
    setup: 'one more thing (I promise)—',
    fact: 'the phase before you fall asleep — hypnagogia — is when random images and sounds pop into your head. that\'s not weird. that\'s just your brain switching modes.',
    question: 'do you ever get those random flashes?',
    optionA: { label: 'yes!! all the time', response: 'totally normal. your brain is buffering. let it buffer.' },
    optionB: { label: 'not really', response: 'some people don\'t notice it. but it\'s happening. brains are doing so much.' },
  },
  {
    id: 5,
    setup: 'did you know?? did you KNOW??',
    fact: 'being awake for 17 hours straight impairs you as much as a blood alcohol level of 0.05%. at 24 hours it\'s 0.10%. sleep deprivation is basically… being a bit drunk.',
    question: 'how many hours have you been awake today?',
    optionA: { label: 'too many honestly', response: 'exactly my point. sleep now. immediately. this is not a drill.' },
    optionB: { label: 'like a normal amount', response: 'good! then sleeping now will keep it that way. excellent decision.' },
  },
  {
    id: 6,
    setup: 'ok last thing I promise—',
    fact: 'your brain actually shrinks slightly during the day from all the thinking — and sleep is when it physically cleans out the metabolic waste. like a tiny brain dishwasher.',
    question: 'how was your brain today?',
    optionA: { label: 'overworked tbh', response: 'perfect timing for the dishwasher cycle then. sleep well. your brain deserves it.' },
    optionB: { label: 'pretty good actually', response: 'still needs the clean though. the dishwasher runs every night regardless. very reliable.' },
  },
  {
    id: 7,
    setup: 'wait—',
    fact: 'there\'s a stage of sleep called REM where your eyes move rapidly and your body is actually paralysed. to stop you acting out your dreams. which is very thoughtful of your brain.',
    question: 'what do you think you\'ll dream about?',
    optionA: { label: 'no idea honestly', response: 'the mystery is part of it. good luck in there. I\'ll be watching. from outside the dream. not creepy.' },
    optionB: { label: 'something chaotic probably', response: 'valid. dreams are chaos. your brain is on its own in there. I believe in it.' },
  },
  {
    id: 8,
    setup: 'ok ok ok—',
    fact: 'the world record for staying awake is 11 days. the person hallucinated, became paranoid, and couldn\'t recognise objects. so like. sleep is pretty important.',
    question: 'glad we\'re not attempting that.',
    optionA: { label: 'absolutely not', response: 'correct answer. sleep now. immediately. you\'re making the right call.' },
    optionB: { label: 'sounds like a challenge', response: 'it is NOT a challenge. please sleep. I\'m begging. on behalf of your brain.' },
  },
  {
    id: 9,
    setup: 'one more thing—',
    fact: 'consistent sleep and wake times train your body to release melatonin earlier and earlier. meaning: the more you stick to a schedule, the easier it gets to fall asleep. like a superpower you build.',
    question: 'we\'re literally building that superpower right now.',
    optionA: { label: 'that\'s actually cool', response: 'it IS cool!! science!! sleep science!! ok goodnight for real now.' },
    optionB: { label: 'ok I\'m convinced', response: 'good. I\'ve done my job. sleep well. I\'m going to as well.' },
  },
  {
    id: 10,
    setup: 'last one I swear—',
    fact: 'naps between 10–20 minutes are "power naps" and improve alertness without causing sleep inertia. naps over 30 minutes make you feel worse. the sweet spot is extremely specific.',
    question: 'anyway. not relevant right now. this is full sleep time.',
    optionA: { label: 'noted for tomorrow', response: 'excellent. file it away. your brain will handle the paperwork. goodnight.' },
    optionB: { label: 'ok closing my eyes now', response: 'finally. goodnight. I love you. sleep well.' },
  },

  // ── 10 more stalls for daily variety ─────────────────────────────────────
  {
    id: 11,
    setup: 'ok ok wait—',
    fact: 'dreams happen almost entirely in REM sleep, which you get more of in the LAST two hours of a full night. cut sleep short and you lose the most vivid dreaming. and memory consolidation. rude.',
    question: 'do you want your brain\'s highlight reel tonight?',
    optionA: { label: 'yes please', response: 'then sleep the full 8. your brain has plans for those last two hours. exciting plans.' },
    optionB: { label: 'I\'ll risk it', response: 'bold. your future self may disagree. I said what I said. goodnight.' },
  },
  {
    id: 12,
    setup: 'one more thing—',
    fact: 'your liver detoxes, your skin repairs, your immune system activates, and your brain clears waste — all simultaneously — while you sleep. it\'s genuinely the most productive thing you do all day.',
    question: 'wild, right?',
    optionA: { label: 'ok sleep is impressive', response: 'VERY impressive. and it\'s free. and it feels good. goodnight, you productive sleeper.' },
    optionB: { label: 'more impressive than I thought', response: 'exactly my point. now let your body do its thing. eyes closed. go.' },
  },
  {
    id: 13,
    setup: 'wait I just—',
    fact: 'there is a gene mutation called ADRB1 that lets some people function on 6 hours. only about 3% of people have it. if you\'re not tired on 6 hours, great. if you are tired, you don\'t have it. sorry.',
    question: 'are you genuinely a 6-hour person?',
    optionA: { label: 'honestly? no.', response: 'respect the honesty. more sleep needed. let\'s get you some. starting now.' },
    optionB: { label: 'I think maybe yes?', response: 'if you wake up refreshed, maybe! if not — you\'re just tired. get the 8. go.' },
  },
  {
    id: 14,
    setup: 'did you know?? did you KNOW??',
    fact: 'light exercise like a 10-minute walk can improve sleep quality more than sleeping pills in some studies. your body WANTS to be tired. help it out during the day and it rewards you at night.',
    question: 'did you move today?',
    optionA: { label: 'yeah actually', response: 'excellent. your body knows what to do. let it sleep now. earned.' },
    optionB: { label: 'not really', response: 'ok. tomorrow: short walk. your future sleepy self is pre-thanking you. goodnight.' },
  },
  {
    id: 15,
    setup: 'ok but actually—',
    fact: 'the sound of rain is scientifically relaxing. it\'s called "pink noise" — frequencies that match the brain\'s natural resting state. rain apps aren\'t weird. they\'re neuroscience.',
    question: 'have you tried rain sounds?',
    optionA: { label: 'yes it works!!', response: 'right?? pink noise!! your brain likes patterns. rain is a pattern. science wins again.' },
    optionB: { label: 'sounds a bit much', response: 'fair. worth trying once though. low volume. 10 minutes. report back. goodnight.' },
  },
  {
    id: 16,
    setup: 'wait wait wait—',
    fact: 'sleeping on your side (especially the left) helps your brain clear waste faster, reduces acid reflux, and is better for your heart. your sleeping position literally matters. who knew.',
    question: 'are you a side sleeper?',
    optionA: { label: 'yes, left side ✓', response: 'optimal. your glymphatic system is going to have such a good night. I\'m almost jealous.' },
    optionB: { label: 'back or stomach person', response: 'both fine too. if you can, try left side eventually. just a suggestion. from science.' },
  },
  {
    id: 17,
    setup: 'last one I mean it—',
    fact: 'feeling like you didn\'t sleep well when you actually did is called "sleep state misperception." your perception of bad sleep causes the same cognitive effects as actual bad sleep. your brain is powerful and also kind of dramatic.',
    question: 'are you a "I barely slept" person when actually you did?',
    optionA: { label: 'honestly, yes.', response: 'noted. tomorrow, tell yourself you slept fine. your brain will believe it. science says so.' },
    optionB: { label: 'no I sleep deeply', response: 'love that for you. sleep state confidence is powerful. keep it. goodnight.' },
  },
  {
    id: 18,
    setup: 'ok ok ok—',
    fact: 'being too hot disrupts sleep more than being too cold. your body needs to drop its core temperature by 1–2 degrees to initiate sleep. being stubbornly warm is literally fighting your own biology.',
    question: 'temperature check: too warm in here?',
    optionA: { label: 'I should open a window', response: 'yes. do it. right now if you can. cold room = faster sleep. trust the science.' },
    optionB: { label: 'I\'m just right', response: 'optimal. 18 degrees is the dream. literally. goodnight, temperature-conscious person.' },
  },
  {
    id: 19,
    setup: 'one more. for real.',
    fact: 'writing down what you\'re grateful for before bed reduces pre-sleep anxiety and improves sleep quality. your brain shifts from threat-scanning mode to reward mode. it takes 3 minutes and it actually works.',
    question: 'one thing you\'re grateful for today?',
    optionA: { label: 'a few things actually', response: 'your brain is already switching modes. well done. goodnight, grateful person.' },
    optionB: { label: 'I\'ll think about it', response: 'that counts. thinking = brain shift beginning. you\'re already winning. goodnight.' },
  },
  {
    id: 20,
    setup: 'wait—',
    fact: 'your brain\'s prefrontal cortex — the part that makes good decisions — is the first region impaired by sleep loss. tired you literally has worse judgment than rested you. every time.',
    question: 'have you made any questionable decisions today?',
    optionA: { label: 'possibly one or two', response: 'noted. well-rested you would handle it better. let\'s get you well-rested. goodnight.' },
    optionB: { label: 'I was very sensible today', response: 'excellent. sleep will protect that streak. prefrontal cortex says thank you. goodnight.' },
  },
]

// Pick a random stall each time — called once per tuck-in via useState initialiser
export function getTodayStall(overrideIndex = null) {
  if (overrideIndex !== null) return STALL_DIALOGUES[overrideIndex % STALL_DIALOGUES.length]
  const idx = Math.floor(Math.random() * STALL_DIALOGUES.length)
  return STALL_DIALOGUES[idx]
}
