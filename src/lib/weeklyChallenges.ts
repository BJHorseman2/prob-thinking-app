// Weekly challenge rotation system
export const challengePool = [
  // Week 1 challenges
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
  
  // Week 2 challenges
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
  
  // Week 3 challenges
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
  },
  
  // Week 4 - Poker Psychology
  {
    id: 'poker-tilt-control',
    title: '🃏 Poker Tilt Management',
    description: 'Can you control your emotions after a bad beat?',
    timeToComplete: '2 min',
    points: 85,
    question: 'You just lost a huge pot with pocket aces to a river suck-out. You\'re steaming. The very next hand you get pocket kings. What\'s the optimal play?',
    type: 'choice',
    options: ['Play aggressively to win back the money', 'Play your normal strategy - ignore the last hand', 'Fold and take a 5-minute break', 'Bet bigger to intimidate opponents'],
    correctAnswer: 'Play your normal strategy - ignore the last hand',
    explanation: 'Going on "tilt" after bad beats destroys more bankrolls than bad cards. Each hand is independent - your kings are just as strong whether you won or lost the last hand. Emotional control separates winning players from fish.'
  },
  {
    id: 'poker-pot-odds',
    title: '🎲 Pot Odds vs Gut Feeling',
    description: 'Math vs intuition at the poker table',
    timeToComplete: '3 min',
    points: 90,
    question: 'You have a flush draw (9 outs) on the turn. Pot is $100, opponent bets $50. You need to call $50 to win $150. Pot odds: 3:1. Your odds: 4:1. But you have a "feeling" opponent is bluffing. What do you do?',
    type: 'choice',
    options: ['Call - the pot odds are close enough', 'Fold - you\'re not getting proper odds', 'Raise - trust your read', 'Call - always trust your gut'],
    correctAnswer: 'Fold - you\'re not getting proper odds',
    explanation: 'Math doesn\'t care about feelings! You need 3:1 odds but only getting 4:1. Even if you "feel" they\'re bluffing, you\'re making a -EV call. Winning poker players trust math over emotions.'
  },
  {
    id: 'poker-bankroll-management',
    title: '💰 Bankroll Risk Management',
    description: 'How much should you risk?',
    timeToComplete: '2 min',
    points: 80,
    question: 'You have a $2,000 poker bankroll. A juicy $5/$10 cash game is running, but it\'s above your normal $1/$2 stakes. The game looks soft. What\'s the smart move?',
    type: 'choice',
    options: ['Jump in - the game is too good to miss', 'Stay at $1/$2 - stick to your bankroll rules', 'Play $5/$10 but with a shorter session', 'Risk half your bankroll on this great opportunity'],
    correctAnswer: 'Stay at $1/$2 - stick to your bankroll rules',
    explanation: 'Bankroll management is the difference between pros and broke players. $2k isn\'t enough for $5/$10 (need 40+ buy-ins). "Soft" games become less profitable when you\'re scared money. Discipline > opportunity.'
  },
  {
    id: 'poker-variance-tolerance',
    title: '📊 Understanding Poker Variance',
    description: 'Can you handle the swings?',
    timeToComplete: '3 min',
    points: 95,
    question: 'You\'re a winning player (3bb/100 winrate). After 10,000 hands, you\'re down $2,000. Your friend says "maybe you\'re not as good as you think." What\'s the truth?',
    type: 'choice',
    options: ['He\'s right - good players don\'t have losing streaks', 'This is normal variance - keep playing your A-game', 'Take a break to analyze your game', 'Move down stakes until you\'re winning again'],
    correctAnswer: 'This is normal variance - keep playing your A-game',
    explanation: 'Poker variance is brutal! Even winning players can lose for 10K+ hands. With 3bb/100 winrate, you still have 30% chance of losing after 10K hands. Most players quit during normal downswings, not understanding math.'
  },

  // Week 5 - Blackjack & Casino Psychology
  {
    id: 'blackjack-basic-strategy',
    title: '🃏 Blackjack Basic Strategy',
    description: 'Math vs intuition at the table',
    timeToComplete: '2 min',
    points: 75,
    question: 'You have 16, dealer shows 10. Basic strategy says hit, but you\'ve busted the last 3 times with 16. The other players are telling you to "stand - never bust." What do you do?',
    type: 'choice',
    options: ['Stand - avoid the bust', 'Hit - follow basic strategy', 'Split the difference and sometimes hit', 'Ask the dealer what they would do'],
    correctAnswer: 'Hit - follow basic strategy',
    explanation: 'Basic strategy is mathematically optimal over millions of hands. Your recent bust streak is irrelevant - each hand is independent. Standing on 16 vs 10 loses 54% of the time, hitting loses 52%. Math doesn\'t care about your feelings.'
  },
  {
    id: 'gamblers-fallacy-roulette',
    title: '🎰 The Gambler\'s Fallacy',
    description: 'Red or black - does the wheel have memory?',
    timeToComplete: '90 sec',
    points: 70,
    question: 'At roulette, red has come up 7 times in a row. A player next to you says "black is due!" and bets $500 on black. What\'s the probability the next spin is black?',
    type: 'estimate',
    correctAnswer: 47,
    explanation: 'Still 47.4%! The wheel has no memory. Each spin is independent. "Due" is a cognitive illusion. Red could easily hit 10+ times in a row. The gambler\'s fallacy destroys more bankrolls than bad luck.'
  },
  {
    id: 'house-edge-understanding',
    title: '🏠 Understanding House Edge',
    description: 'Why the casino always wins',
    timeToComplete: '3 min',
    points: 85,
    question: 'American roulette has 38 numbers, pays 35:1 on single numbers. You bet $100 on red (18 numbers win). What\'s your expected value per spin?',
    type: 'estimate',
    correctAnswer: -5,
    explanation: 'You lose $5.26 per spin on average! Red wins 18/38 times (47.4%), loses 20/38 times (52.6%). EV = (18/38 × $100) - (20/38 × $100) = -$5.26. The house edge grinds everyone down over time.'
  },
  {
    id: 'card-counting-risk',
    title: '🎯 Card Counting Risk vs Reward',
    description: 'Is advantage play worth it?',
    timeToComplete: '3 min',
    points: 100,
    question: 'You\'re a skilled card counter with 1.5% edge over the house. You have $10,000 bankroll. Betting $100/hand, what\'s your risk of going broke?',
    type: 'estimate',
    correctAnswer: 25,
    explanation: 'About 25% risk of ruin! Even with an edge, variance is brutal. You need 200+ bets in your bankroll to survive the swings. Plus casinos ban counters. Risk of arrest, backoff, and lost time makes it barely profitable for most.'
  },

  // Week 6 - Market Psychology & Trading
  {
    id: 'bull-market-overconfidence',
    title: '📈 Bull Market Overconfidence',
    description: 'When everyone\'s a genius',
    timeToComplete: '2 min',
    points: 80,
    question: 'During a bull market, your stock picks are up 40% this year. You start thinking you\'re the next Warren Buffett. What\'s the biggest risk?',
    type: 'choice',
    options: ['Missing out on bigger gains', 'Increasing position sizes due to overconfidence', 'Not taking profits soon enough', 'Other traders copying your strategy'],
    correctAnswer: 'Increasing position sizes due to overconfidence',
    explanation: 'Bull markets make everyone feel like geniuses. Overconfidence leads to larger bets, more risk, and eventual blowups. Don\'t confuse brains with a bull market - your success might be luck, not skill.'
  },
  {
    id: 'loss-aversion-trading',
    title: '💸 Loss Aversion in Trading',
    description: 'Why we hold losers and sell winners',
    timeToComplete: '2 min',
    points: 85,
    question: 'You have two positions: Stock A is up 20%, Stock B is down 20%. You need to sell one to raise cash. Which do you sell?',
    type: 'choice',
    options: ['Sell Stock A - lock in the gain', 'Sell Stock B - cut your losses', 'Hold both and find cash elsewhere', 'Sell whichever has worse future prospects'],
    correctAnswer: 'Sell whichever has worse future prospects',
    explanation: 'Most sell winners (Stock A) and hold losers (Stock B) due to loss aversion. But sunk costs are irrelevant! Only future prospects matter. Prospect theory shows we feel losses 2x more than equivalent gains.'
  },
  {
    id: 'market-timing-illusion',
    title: '⏰ Market Timing Illusion',
    description: 'Can you time the market?',
    timeToComplete: '3 min',
    points: 90,
    question: 'Studies show 90% of active traders lose money. You\'ve been successfully day trading for 6 months. What\'s the most likely explanation?',
    type: 'choice',
    options: ['You\'re in the top 10% of traders', 'You\'re experiencing a lucky streak', 'You\'ve discovered a new strategy', 'The market has been unusually predictable'],
    correctAnswer: 'You\'re experiencing a lucky streak',
    explanation: 'Short-term success is usually luck, not skill. Even random trading can work for months. Survivorship bias makes us think we\'re special. The traders who failed already quit. Keep trading long enough and regression to the mean kicks in.'
  },
  {
    id: 'momentum-vs-mean-reversion',
    title: '📊 Momentum vs Mean Reversion',
    description: 'Which force is stronger?',
    timeToComplete: '3 min',
    points: 95,
    question: 'A stock has dropped 30% in 3 days on no news. Do you: A) Buy the dip (mean reversion), or B) Wait for trend confirmation (momentum)?',
    type: 'choice',
    options: ['Buy the dip - it\'s oversold', 'Wait for trend confirmation', 'Depends on the broader market context', 'Split the difference and buy half now'],
    correctAnswer: 'Depends on the broader market context',
    explanation: 'Both momentum and mean reversion work in different contexts! Small moves often revert, large moves often continue. Time frame matters. Sector rotation, earnings, macro events all influence which force dominates. Context is king.'
  }
]

// Get current week number of the year
function getWeekNumber(date: Date): number {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1)
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)
}

// Get weekly challenges based on current week
export function getWeeklyChallenges(): any[] {
  const today = new Date()
  const weekNumber = getWeekNumber(today)
  
  // Rotate through challenges in groups of 4 per week
  const startIndex = ((weekNumber - 1) * 4) % challengePool.length
  const weeklyChallenges = []
  
  for (let i = 0; i < 4; i++) {
    const index = (startIndex + i) % challengePool.length
    weeklyChallenges.push(challengePool[index])
  }
  
  return weeklyChallenges
}

// Get next week's challenges for preview
export function getNextWeeksChallenges(): any[] {
  const nextWeek = new Date()
  nextWeek.setDate(nextWeek.getDate() + 7)
  const weekNumber = getWeekNumber(nextWeek)
  
  const startIndex = ((weekNumber - 1) * 4) % challengePool.length
  const challenges = []
  
  for (let i = 0; i < 4; i++) {
    const index = (startIndex + i) % challengePool.length
    challenges.push(challengePool[index])
  }
  
  return challenges
}

// Check if user has already completed this week's challenges
export function hasCompletedThisWeek(completedChallenges: string[]): boolean {
  const weeksChallenges = getWeeklyChallenges()
  return weeksChallenges.every(challenge => completedChallenges.includes(challenge.id))
}

// Get days until next week's challenges
export function getDaysUntilNextWeek(): number {
  const today = new Date()
  const dayOfWeek = today.getDay()
  // Assuming week starts on Monday (1)
  const daysUntilMonday = dayOfWeek === 0 ? 1 : (8 - dayOfWeek)
  return daysUntilMonday
} 