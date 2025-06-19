// Daily challenge rotation system
export const challengePool = [
  // Day 1-4 (Current challenges)
  {
    id: 'kahneman-fast-slow',
    title: '🧠 Kahneman\'s Two Systems',
    description: 'Can you resist System 1 thinking?',
    timeToComplete: '2 min',
    points: 75,
    question: 'A bat and a ball cost $1.10 in total. The bat costs $1.00 more than the ball. How much does the ball cost?',
    type: 'estimate',
    correctAnswer: 5,
    explanation: 'Your System 1 (fast thinking) screams "10 cents!" But that\'s wrong. If the ball costs 10¢ and the bat costs $1 more (110¢), the total would be 120¢. The ball actually costs 5¢. This is from Kahneman\'s "Thinking, Fast and Slow" - our intuitive mind often gives us the wrong answer.',
    hint: 'Think in cents, not dollars'
  },
  {
    id: 'thaler-endowment',
    title: '🎫 Thaler\'s Endowment Effect',
    description: 'How much do you value what you own?',
    timeToComplete: '90 sec',
    points: 60,
    question: 'You just won a concert ticket worth $100 in a lottery. Minutes later, someone offers to buy it from you. What\'s the minimum you\'d accept?',
    type: 'estimate',
    correctAnswer: 100,
    explanation: 'Most people demand $150+ to sell something they just got for free! This is Thaler\'s "endowment effect" - we overvalue things simply because we own them. Rational? No. Human? Absolutely.',
    anchor: 100
  },
  {
    id: 'duke-outcome-bias',
    title: '🎲 Annie Duke\'s Outcome Bias',
    description: 'Can you judge the decision, not the result?',
    timeToComplete: '2 min',
    points: 80,
    question: 'A CEO decides to launch a risky new product with a 30% chance of success but huge upside. It fails spectacularly. The board fires him. Was this the right decision?',
    type: 'choice',
    options: ['Fire him - the product failed', 'Keep him - it was a good bet'],
    correctAnswer: 'Keep him - it was a good bet',
    explanation: 'Annie Duke calls this "resulting" - judging decisions by outcomes instead of process. The CEO made a GOOD decision with the information available: a 30% chance of huge upside is often worth taking! Yes, it failed, but that was expected 70% of the time. Firing him punishes good decision-making just because of an unlucky outcome. This bias destroys rational thinking in business, poker, and life.',
  },
  {
    id: 'kahneman-availability',
    title: '📺 Availability Heuristic',
    description: 'What kills more Americans yearly?',
    timeToComplete: '1 min',
    points: 50,
    question: 'Which kills more people in the US each year: shark attacks or falling airplane parts?',
    type: 'choice',
    options: ['Shark attacks', 'Falling airplane parts'],
    correctAnswer: 'Falling airplane parts',
    explanation: 'Falling airplane parts kill ~25 people/year, sharks kill ~1. But shark attacks get massive media coverage! Kahneman showed we judge probability by how easily examples come to mind. The news makes rare dramatic events feel common.'
  },
  
  // Day 5-8
  {
    id: 'anchoring-bias',
    title: '⚓ Anchoring Effect',
    description: 'Can you escape the anchor?',
    timeToComplete: '90 sec',
    points: 70,
    question: 'The population of Turkey is 84 million. What\'s your estimate for the population of Canada?',
    type: 'estimate',
    correctAnswer: 38,
    explanation: 'Most people guess 60-80 million, anchored by Turkey\'s 84 million. But Canada has only 38 million people! This is anchoring bias - the first number you hear heavily influences your estimate, even when it\'s irrelevant.',
    anchor: 84
  },
  {
    id: 'conjunction-fallacy',
    title: '🎯 Linda Problem',
    description: 'Kahneman\'s famous probability puzzle',
    timeToComplete: '2 min',
    points: 85,
    question: 'Linda is 31, single, outspoken, and very bright. She majored in philosophy and was deeply concerned with discrimination and social justice. Which is more probable?',
    type: 'choice',
    options: ['Linda is a bank teller', 'Linda is a bank teller and active in the feminist movement'],
    correctAnswer: 'Linda is a bank teller',
    explanation: 'Most choose option 2, but that\'s mathematically impossible! The probability of A AND B can never exceed the probability of A alone. Our brain creates a compelling story that overrides basic logic.'
  },
  {
    id: 'sunk-cost-fallacy',
    title: '💸 Sunk Cost Trap',
    description: 'Can you let go of past investments?',
    timeToComplete: '2 min',
    points: 75,
    question: 'You bought a $100 ticket to a ski trip weeks ago. On the day, there\'s a terrible storm making driving dangerous. Your friend invites you to a free local event you\'d enjoy more. What do you do?',
    type: 'choice',
    options: ['Go skiing - you paid $100!', 'Skip skiing - stay safe and have fun locally'],
    correctAnswer: 'Skip skiing - stay safe and have fun locally',
    explanation: 'The $100 is gone whether you ski or not - it\'s a sunk cost! Risking your safety because you already paid is irrational. Yet most people can\'t ignore sunk costs, leading to bad decisions in investing, relationships, and projects.'
  },
  {
    id: 'base-rate-neglect',
    title: '🏥 Base Rate Fallacy',
    description: 'Can you think like a statistician?',
    timeToComplete: '3 min',
    points: 90,
    question: 'A test for a rare disease (affects 1 in 1000) is 99% accurate. You test positive. What\'s the probability you actually have the disease?',
    type: 'estimate',
    correctAnswer: 9,
    explanation: 'Only about 9%! Most guess 99%, ignoring the base rate. With 1000 people: 1 has the disease (tests positive), 999 don\'t (but ~10 test false positive). So only 1 of 11 positive tests are real. Always consider base rates!'
  },
  
  // Day 9-12
  {
    id: 'framing-effect',
    title: '🖼️ Framing Effect',
    description: 'Same facts, different frame',
    timeToComplete: '90 sec',
    points: 65,
    question: 'A disease outbreak will kill 600 people. Program A saves 200 lives. Program B has 1/3 chance to save all 600, 2/3 chance to save none. Which do you choose?',
    type: 'choice',
    options: ['Program A - Save 200 for sure', 'Program B - 1/3 chance to save all'],
    correctAnswer: 'Program A - Save 200 for sure',
    explanation: 'Most choose A when framed as "saves lives" but B when framed as "400 will die" vs "1/3 chance none die". Same math, different frame! Thaler showed how framing manipulates our choices.'
  },
  {
    id: 'mental-accounting',
    title: '💰 Mental Accounting',
    description: 'Is a dollar always a dollar?',
    timeToComplete: '2 min',
    points: 70,
    question: 'You\'re buying a $125 jacket and $15 calculator. The clerk says the calculator is $5 cheaper at another store 20 minutes away. Do you go?',
    type: 'choice',
    options: ['Yes - save $5', 'No - not worth 20 minutes'],
    correctAnswer: 'Yes - save $5',
    explanation: 'Most say yes for the calculator but no if the jacket is $5 off! Yet it\'s the same $5 and 20 minutes. Thaler\'s mental accounting shows we irrationally categorize money instead of viewing it fungibly.'
  },
  {
    id: 'overconfidence-bias',
    title: '📊 Overconfidence Effect',
    description: 'How well do you know what you know?',
    timeToComplete: '2 min',
    points: 80,
    question: 'What percentage of US adults have a passport? Give your 90% confidence interval (range you\'re 90% sure contains the true answer).',
    type: 'estimate',
    correctAnswer: 42,
    explanation: 'It\'s 42%. Most people give ranges like 60-80% or 20-40%, far too narrow! We\'re systematically overconfident in our knowledge. Good calibration means your 90% intervals should contain the truth 90% of the time.'
  },
  {
    id: 'planning-fallacy',
    title: '📅 Planning Fallacy',
    description: 'Why projects always run late',
    timeToComplete: '2 min',
    points: 75,
    question: 'A team estimates their project will take 4 months. Based on similar past projects taking 6-10 months, what\'s your best guess for completion time?',
    type: 'estimate',
    correctAnswer: 8,
    explanation: 'History suggests 8 months, but teams ignore base rates! Kahneman found we focus on best-case scenarios and ignore past data. This is why construction, software, and homework always take longer than planned.'
  }
]

// Get daily challenges based on current date
export function getDailyChallenges(): any[] {
  const today = new Date()
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000)
  
  // Rotate through challenges in groups of 4
  const startIndex = (dayOfYear * 4) % challengePool.length
  const dailyChallenges = []
  
  for (let i = 0; i < 4; i++) {
    const index = (startIndex + i) % challengePool.length
    dailyChallenges.push(challengePool[index])
  }
  
  return dailyChallenges
}

// Get tomorrow's challenges for preview
export function getTomorrowsChallenges(): any[] {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const dayOfYear = Math.floor((tomorrow.getTime() - new Date(tomorrow.getFullYear(), 0, 0).getTime()) / 86400000)
  
  const startIndex = (dayOfYear * 4) % challengePool.length
  const challenges = []
  
  for (let i = 0; i < 4; i++) {
    const index = (startIndex + i) % challengePool.length
    challenges.push(challengePool[index])
  }
  
  return challenges
}

// Check if user has already completed today's challenges
export function hasCompletedToday(completedChallenges: string[]): boolean {
  const todaysChallenges = getDailyChallenges()
  return todaysChallenges.every(challenge => completedChallenges.includes(challenge.id))
} 