export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'choice' | 'estimate';
  question: string;
  options?: string[];
  correctAnswer: any[];
  explanation: string;
  points: number;
  bias?: string;
  hint?: string;
  anchor?: number;
  acceptableRange?: [number, number];
}

export interface ChallengeStage {
  id: string;
  title: string;
  description: string;
  challenges: Challenge[];
}

export interface ChallengePath {
  id: string;
  title: string;
  description: string;
  stages: ChallengeStage[];
  badge: string;
}

export const challengePaths: ChallengePath[] = [
  {
    id: 'rookie-trader-academy',
    title: "🎯 Rookie Trader Academy",
    description: "Master the basics while avoiding the rookie mistakes that blow up accounts.",
    badge: 'Disciplined Trader',
    stages: [
      {
        id: 'first-trade-survival',
        title: 'Stage 1: First Trade Survival',
        description: 'Learn to survive your first trades without blowing up your account',
        challenges: [
          {
            id: 'rookie-1',
            title: 'The YOLO Trade',
            description: 'You have $10,000 to start trading. Your friend just made 500% on GameStop.',
            type: 'choice',
            question: `You have $10,000 for trading. Your friend shows screenshots of turning $2,000 into $10,000 on a meme stock in one week. What's your first move?`,
            options: [
              'Put all $10,000 into the same stock - follow the money!',
              'Start with $500 to test your strategy',
              'Research the company fundamentals first',
              'Paper trade for a month before risking real money'
            ],
            correctAnswer: [1, 3],
            explanation: `Rookie mistake #1: Going all-in on your first trade. Professional traders risk 1-2% per trade. Paper trading and small position sizing prevent account blow-ups.`,
            points: 100,
            bias: 'overconfidence',
            hint: 'What would a professional trader risk on their first trade?'
          },
          {
            id: 'rookie-2',
            title: 'The Loss That Won\'t Quit',
            description: 'Your first stock is down 15%. Everyone says "just hold, it will come back."',
            type: 'choice',
            question: `You bought Tesla at $300, now it's $255 (-15%). Your trading group says "diamond hands, it always comes back!" What do you do?`,
            options: [
              'Hold and wait for it to recover',
              'Buy more to average down',
              'Cut the loss at -20% max',
              'Hold until break-even no matter what'
            ],
            correctAnswer: [2],
            explanation: `Rookie mistake #2: No exit plan. Professional traders cut losses at 7-10%. "It always comes back" destroyed more accounts than any other phrase in trading.`,
            points: 150,
            bias: 'loss-aversion',
            hint: 'What would protect your capital for future opportunities?'
          },
          {
            id: 'rookie-3',
            title: 'The Hot Tip Gold Rush',
            description: 'A Discord channel with 50,000 members is pumping a "guaranteed winner."',
            type: 'choice',
            question: `"MoonRocket Corp" is being hyped by a huge trading Discord. The DD looks solid, 50K members are buying. They say "this is financial advice!" What's your move?`,
            options: [
              'Buy immediately before you miss out',
              'Wait for a dip to enter',
              'Check who\'s actually making money from these tips',
              'Only invest what you can afford to lose'
            ],
            correctAnswer: [2, 3],
            explanation: `Rookie mistake #3: Following the crowd. Most "tip" groups are pump-and-dumps. Always check if the tipsters are actually profitable long-term.`,
            points: 200,
            bias: 'social-proof',
            hint: 'Who profits when thousands follow the same tip?'
          },
          {
            id: 'rookie-4',
            title: 'The Revenge Trade',
            description: 'You just lost $2,000 on a bad trade. You want to make it back immediately.',
            type: 'choice',
            question: `You lost $2,000 today on a stupid mistake. You want to win it back before market close. You find a volatile stock that could 2x quickly. What do you do?`,
            options: [
              'Go all-in to win back the loss',
              'Risk double to make back the money faster',
              'Take a break and analyze what went wrong',
              'Make smaller trades to slowly recover'
            ],
            correctAnswer: [2],
            explanation: `Rookie mistake #4: Revenge trading. Emotional trading leads to bigger losses. Take a break, analyze mistakes, come back with a clear head tomorrow.`,
            points: 200,
            bias: 'loss-aversion',
            hint: 'What would a professional do after a big loss?'
          },
          {
            id: 'rookie-5',
            title: 'The Beginner\'s Luck Trap',
            description: 'Your first 5 trades were all winners. You\'re feeling invincible.',
            type: 'estimate',
            question: `You've won 5 trades in a row, turning $5,000 into $8,000. You feel like you've "cracked the code." What's the realistic probability your next 5 trades will also be winners?`,
            correctAnswer: [15, 25],
            explanation: `Rookie mistake #5: Confusing luck with skill. Early success is often random. The market will humble you. Most profitable traders win 40-60% of trades, not 100%.`,
            points: 250,
            bias: 'overconfidence',
            acceptableRange: [5, 40],
            hint: 'Even the best traders lose regularly'
          }
        ]
      }
    ]
  },
  {
    id: 'wall-street-legends',
    title: "🏛️ Wall Street Legends",
    description: "Learn from the greatest investors and their biggest mistakes. Even legends get humbled.",
    badge: 'Market Historian',
    stages: [
      {
        id: 'legend-lessons',
        title: 'Stage 1: Legend Lessons',
        description: 'Learn what made the greats great (and what brought them down)',
        challenges: [
          {
            id: 'legend-1',
            title: 'Buffett\'s Biggest Mistake',
            description: 'Even Warren Buffett admits to massive investing mistakes.',
            type: 'choice',
            question: `Warren Buffett called buying Berkshire Hathaway "the $200 billion mistake." He also avoided tech stocks for decades, missing Microsoft, Amazon, Google. What's the lesson?`,
            options: [
              'Even legends make huge mistakes',
              'Stick to what you understand, never adapt',
              'Value investing is outdated',
              'You should copy everything Buffett does'
            ],
            correctAnswer: [0],
            explanation: `Legend lesson: Even the GOAT admits massive mistakes. Buffett's humility and willingness to adapt (eventually buying Apple) is what made him great. Nobody's perfect.`,
            points: 150,
            bias: 'overconfidence'
          },
          {
            id: 'legend-2',
            title: 'Soros Breaks the Bank',
            description: 'George Soros made $1 billion shorting the British pound in 1992.',
            type: 'estimate',
            question: `Soros bet $10 billion against the British pound, risking his entire fund. How much did he risk as a percentage of his assets?`,
            correctAnswer: [80, 100],
            explanation: `Soros risked everything on one trade - nearly 100% of his fund. This "bet the farm" strategy worked but could have destroyed him. High conviction + massive risk = legendary gains or total ruin.`,
            points: 200,
            bias: 'overconfidence',
            acceptableRange: [50, 100],
            hint: 'He literally bet his entire fund'
          },
          {
            id: 'legend-3',
            title: 'Tiger Woods of Trading',
            description: 'Jesse Livermore made and lost $100 million+ multiple times in the early 1900s.',
            type: 'choice',
            question: `Jesse Livermore, the greatest trader ever, made $100M+ three different times - and lost it all three times. He eventually committed suicide broke. What killed his success?`,
            options: [
              'Bad stock picks',
              'Market crashes he couldn\'t predict',
              'Overconfidence and poor risk management',
              'He wasn\'t actually that good'
            ],
            correctAnswer: [2],
            explanation: `Livermore's genius was reading market psychology, but success bred overconfidence. He'd bet everything on single trades. Talent without discipline = eventual ruin.`,
            points: 200,
            bias: 'overconfidence'
          },
          {
            id: 'legend-4',
            title: 'The Dot-Com Destruction',
            description: 'In 2000, even legendary fund managers lost 50-90% during the dot-com crash.',
            type: 'choice',
            question: `During the dot-com crash, legendary managers like Julian Robertson (Tiger Fund) lost billions and shut down. What destroyed even the pros?`,
            options: [
              'They were bad at picking stocks',
              'They refused to adapt to the "new economy"',
              'Momentum and growth bias in a changing market',
              'They panicked and sold at the bottom'
            ],
            correctAnswer: [2],
            explanation: `Even legends get trapped in biases. Growth managers couldn't adapt when momentum died. Markets change, strategies must evolve or die.`,
            points: 200,
            bias: 'confirmation-bias'
          },
          {
            id: 'legend-5',
            title: 'Long-Term Capital\'s Short Life',
            description: 'LTCM had 2 Nobel Prize winners and "risk-free" models. They lost 90% in 4 months.',
            type: 'choice',
            question: `Long-Term Capital Management had Nobel Prize winners, perfect models, and generated 40% returns. Then they lost 90% in 1998. What happened?`,
            options: [
              'Their models were wrong',
              'Black swan events their models couldn\'t predict',
              'Massive leverage amplified a small mistake',
              'Market manipulation by competitors'
            ],
            correctAnswer: [2],
            explanation: `LTCM used 30:1 leverage. When models failed slightly, leverage turned small losses into fund-killing disasters. Even Nobel Prize winners can blow up with too much leverage.`,
            points: 250,
            bias: 'overconfidence'
          }
        ]
      }
    ]
  },
  {
    id: 'sports-betting-psychology',
    title: "🏈 Sports Betting Psychology",
    description: "Master the mental game where emotion and bias destroy even the sharpest sports minds.",
    badge: 'Sharp Bettor',
    stages: [
      {
        id: 'sports-mind-games',
        title: 'Stage 1: Sports Mind Games',
        description: 'Overcome the psychological traps that turn sports knowledge into gambling losses',
        challenges: [
          {
            id: 'sports-1',
            title: 'The Home Team Bias',
            description: 'You\'re betting on your favorite team in the playoffs.',
            type: 'choice',
            question: `Your team is in the playoffs but favored by only 3 points despite being "obviously better." You know more about this team than any other. Should you bet?`,
            options: [
              'Bet big - you know this team better than Vegas',
              'Avoid betting on your favorite team entirely',
              'Bet the opponent to hedge your emotions',
              'Only bet if the line seems way off'
            ],
            correctAnswer: [1],
            explanation: `Home team bias makes you overconfident and miss red flags. Even experts can't beat the market when emotions cloud judgment. The best bettors avoid their favorite teams.`,
            points: 150,
            bias: 'confirmation-bias'
          },
          {
            id: 'sports-2',
            title: 'The Hot Streak Illusion',
            description: 'A player just scored 30+ points in 5 straight games.',
            type: 'estimate',
            question: `Jayson Tatum scored 30+ in 5 straight games. What's the probability he scores 30+ in game 6?`,
            correctAnswer: [25, 35],
            explanation: `The "hot hand" feels real but often regresses to mean. Tatum's season average matters more than recent streak. Chasing streaks is how bettors go broke.`,
            points: 150,
            bias: 'availability',
            acceptableRange: [15, 50],
            hint: 'What\'s his season average?'
          },
          {
            id: 'sports-3',
            title: 'The Revenge Game Narrative',
            description: 'Tom Brady returns to face his former team after a bitter departure.',
            type: 'choice',
            question: `Brady returns to New England after leaving for Tampa Bay. Sports media hyping "revenge game." He's extra motivated. How should this affect your bet?`,
            options: [
              'Bet Brady - extra motivation means better performance',
              'Fade Brady - too much pressure and emotion',
              'Ignore the narrative - it\'s priced into the line',
              'Bet the under - these games are always sloppy'
            ],
            correctAnswer: [2],
            explanation: `"Revenge games" sound compelling but rarely perform as expected. Vegas knows these narratives and prices them in. Emotional stories lose to statistical analysis.`,
            points: 200,
            bias: 'narrative-fallacy'
          },
          {
            id: 'sports-4',
            title: 'The Chase Strategy',
            description: 'You\'re down $500 after a bad weekend of betting.',
            type: 'choice',
            question: `You lost $500 betting NFL games this weekend. Monday Night Football has a "sure thing" - Mahomes at home vs. a terrible defense. What's your play?`,
            options: [
              'Bet $500 to break even for the week',
              'Bet $1000 to make up for the losses',
              'Skip this game and reset next week',
              'Bet smaller until you rebuild confidence'
            ],
            correctAnswer: [2],
            explanation: `"Chase betting" is how sharp bettors become broke gamblers. No bet is ever a sure thing. Taking time off after losses prevents emotional spiral into bigger losses.`,
            points: 200,
            bias: 'loss-aversion'
          },
          {
            id: 'sports-5',
            title: 'The Public Money Trap',
            description: '85% of public money is on the Warriors in a playoff game.',
            type: 'choice',
            question: `Game 7: Warriors vs. Nuggets. 85% of public bets are on the Warriors. The line hasn't moved much. What does this tell you?`,
            options: [
              'Bet Warriors - the public is right this time',
              'Bet Nuggets - fade the public',
              'Sharp money is offsetting public money',
              'Avoid the game - too unpredictable'
            ],
            correctAnswer: [2],
            explanation: `When heavy public money doesn't move the line, smart money is taking the other side. Sportsbooks need balanced action. Follow the sharp money, not the public.`,
            points: 250,
            bias: 'social-proof'
          }
        ]
      }
    ]
  },
  {
    id: 'crypto-casino',
    title: "₿ Crypto Casino",
    description: "Navigate the wild west of crypto where fortunes are made and lost in minutes.",
    badge: 'Diamond Hands',
    stages: [
      {
        id: 'crypto-madness',
        title: 'Stage 1: Crypto Madness',
        description: 'Survive the psychological warfare of cryptocurrency markets',
        challenges: [
          {
            id: 'crypto-1',
            title: 'The Altcoin Roulette',
            description: 'A new altcoin is up 2,000% this week with celebrity endorsements.',
            type: 'choice',
            question: `"SafeMoonDoge" is up 2,000% this week. Elon tweeted about it. Influencers calling it "the next Bitcoin." $100 could become $50,000. What do you do?`,
            options: [
              'Throw $1,000 at it - this could be life-changing',
              'Put in $100 you can afford to lose',
              'Research the team and tokenomics first',
              'Avoid - sounds like a pump and dump'
            ],
            correctAnswer: [3],
            explanation: `Most altcoins with "Safe" and "Moon" in the name are pump and dumps. Celebrity endorsements are often paid. When something sounds too good to be true in crypto, it usually is.`,
            points: 150,
            bias: 'fomo'
          },
          {
            id: 'crypto-2',
            title: 'The Diamond Hands Test',
            description: 'Your crypto portfolio is down 70% from all-time highs.',
            type: 'choice',
            question: `Your crypto portfolio went from $50,000 to $15,000. Crypto Twitter keeps saying "diamond hands" and "buy the dip." What's your move?`,
            options: [
              'HODL - diamond hands forever',
              'Buy more - it\'s on sale',
              'Sell some to preserve capital',
              'Depends on your original investment thesis'
            ],
            correctAnswer: [3],
            explanation: `"Diamond hands" culture ignores risk management. If your thesis changed or you're risking money you need, cutting losses makes sense. Slogans don't pay bills.`,
            points: 200,
            bias: 'loss-aversion'
          },
          {
            id: 'crypto-3',
            title: 'The NFT Mania',
            description: 'Everyone in your group chat is flipping NFTs for massive profits.',
            type: 'estimate',
            question: `Your friends are making $10K+ flipping NFTs. BAYC average sale is $100K. What percentage of NFT buyers actually make money long-term?`,
            correctAnswer: [10, 20],
            explanation: `Most NFT buyers lose money. Like any speculative bubble, early adopters win while late buyers hold worthless JPEGs. Only 10-20% make money long-term.`,
            points: 200,
            bias: 'availability',
            acceptableRange: [5, 30],
            hint: 'How many people win in speculative bubbles?'
          },
          {
            id: 'crypto-4',
            title: 'The Leverage Liquidation',
            description: 'You can trade Bitcoin with 100x leverage on this new exchange.',
            type: 'choice',
            question: `A crypto exchange offers 100x leverage on Bitcoin. You could turn $1,000 into $100,000 if Bitcoin moves 1%. What's the catch?`,
            options: [
              'No catch - it\'s free money if you\'re right',
              'You get liquidated if Bitcoin moves 1% against you',
              'The exchange takes huge fees',
              'It\'s illegal in your country'
            ],
            correctAnswer: [1],
            explanation: `100x leverage means a 1% move against you = 100% loss. Crypto is volatile. Most leveraged traders get liquidated within days. High leverage = guaranteed destruction.`,
            points: 200,
            bias: 'overconfidence'
          },
          {
            id: 'crypto-5',
            title: 'The DeFi Yield Farm',
            description: 'A new DeFi protocol offers 500% APY for staking your tokens.',
            type: 'choice',
            question: `"YieldFarmCoin" offers 500% APY for staking. The smart contract is "audited" and the team is "doxxed." TVL is growing fast. What's the red flag?`,
            options: [
              'APY is too high to be sustainable',
              'All new DeFi protocols are scams',
              'Audits guarantee nothing can go wrong',
              'The team being known makes it safe'
            ],
            correctAnswer: [0],
            explanation: `500% APY is unsustainable without massive risk. Most high-yield farms are Ponzi schemes that collapse when new money stops flowing. If it sounds too good to be true...`,
            points: 250,
            bias: 'greed'
          }
        ]
      }
    ]
  },
  {
    id: 'market-crash-survival',
    title: "📉 Market Crash Survival",
    description: "Learn to thrive when everyone else is panicking. Crashes create millionaires and destroy fortunes.",
    badge: 'Crisis Alpha',
    stages: [
      {
        id: 'crash-psychology',
        title: 'Stage 1: Crash Psychology',
        description: 'Master the mental game when markets are falling apart',
        challenges: [
          {
            id: 'crash-1',
            title: 'The COVID Crash',
            description: 'March 2020: Markets are down 30% in 3 weeks. Experts predict depression.',
            type: 'choice',
            question: `March 2020: S&P 500 dropped 30% in 3 weeks. News screaming "worst crash since 1929." Your portfolio is destroyed. What do you do?`,
            options: [
              'Sell everything before it gets worse',
              'Buy the dip - stocks are on sale',
              'Wait for the bottom before buying',
              'Dollar cost average during the decline'
            ],
            correctAnswer: [1, 3],
            explanation: `March 2020 was the best buying opportunity in decades. Those who bought the dip or DCA'd during the crash saw massive gains. Selling at the bottom locked in losses.`,
            points: 200,
            bias: 'availability'
          },
          {
            id: 'crash-2',
            title: 'The Media Panic Machine',
            description: 'CNBC shows red screens and "MARKET MELTDOWN" graphics all day.',
            type: 'choice',
            question: `During crashes, financial media shows red screens, scary graphics, and panic interviews. How should this affect your decisions?`,
            options: [
              'Follow the news - they know what\'s happening',
              'Ignore the media completely',
              'Use media panic as a contrarian indicator',
              'Only watch for factual updates'
            ],
            correctAnswer: [2],
            explanation: `Media makes money from fear and clicks, not good investment advice. Peak media panic often coincides with market bottoms. When everyone's terrified, smart money is buying.`,
            points: 150,
            bias: 'availability'
          },
          {
            id: 'crash-3',
            title: 'The Flash Crash Algorithm',
            description: 'The market drops 10% in 30 minutes due to algorithmic trading.',
            type: 'choice',
            question: `The market drops 10% in 30 minutes due to algorithmic selling. Your stop losses trigger automatically. What happened?`,
            options: [
              'Fundamental news caused the crash',
              'Algorithms created a temporary distortion',
              'This is the start of a bear market',
              'Someone knows something you don\'t'
            ],
            correctAnswer: [1],
            explanation: `Flash crashes are often algorithmic glitches, not fundamental changes. Smart traders buy these temporary distortions while others panic. Technology can create opportunities.`,
            points: 200,
            bias: 'availability'
          },
          {
            id: 'crash-4',
            title: 'The Margin Call Massacre',
            description: 'Your broker calls demanding more money or they\'ll liquidate your positions.',
            type: 'choice',
            question: `You're using margin during a crash. Your broker calls: "Add $10,000 or we liquidate your positions at the low." What do you do?`,
            options: [
              'Add more money to save your positions',
              'Let them liquidate - preserve cash',
              'Negotiate more time to raise funds',
              'Panic and sell everything yourself'
            ],
            correctAnswer: [1],
            explanation: `Margin calls during crashes force you to sell at the worst possible time. Better to preserve cash and live to fight another day than chase good money after bad.`,
            points: 200,
            bias: 'loss-aversion'
          },
          {
            id: 'crash-5',
            title: 'The Recovery Rally',
            description: 'After months of decline, the market suddenly rallies 20% in two weeks.',
            type: 'choice',
            question: `After a brutal bear market, stocks suddenly rally 20% in two weeks. Media calls it a "recovery." Is this the bottom?`,
            options: [
              'Yes - the worst is over',
              'No - this is a dead cat bounce',
              'Maybe - need more data to confirm',
              'Doesn\'t matter - stick to your plan'
            ],
            correctAnswer: [2, 3],
            explanation: `Bear market rallies are common and brutal for shorts. Could be a bottom or dead cat bounce. Rather than predict, stick to your systematic approach and let time reveal the truth.`,
            points: 250,
            bias: 'confirmation-bias'
          }
        ]
      }
    ]
  },
  {
    id: 'options-assassin',
    title: "🎲 Options Assassin",
    description: "Master the most dangerous weapons in finance. Options can create or destroy wealth instantly.",
    badge: 'Volatility Hunter',
    stages: [
      {
        id: 'options-warfare',
        title: 'Stage 1: Options Warfare',
        description: 'Learn to wield options without blowing up your account',
        challenges: [
          {
            id: 'options-1',
            title: 'The Weekly Lottery Ticket',
            description: 'Tesla calls expiring Friday could 10x if the stock moves 5%.',
            type: 'choice',
            question: `Tesla weekly calls cost $100 each. If Tesla moves 5% this week, they could be worth $1,000. Tesla moves 5%+ about 30% of weeks. Good bet?`,
            options: [
              'Yes - 30% chance to make 10x is great odds',
              'No - you lose 70% of the time',
              'Maybe - depends on your risk tolerance',
              'This is gambling, not investing'
            ],
            correctAnswer: [1, 3],
            explanation: `Weekly options are lottery tickets. Even with 30% win rate, time decay and volatility crush destroy most options buyers. Most profitable options traders are sellers, not buyers.`,
            points: 150,
            bias: 'overconfidence'
          },
          {
            id: 'options-2',
            title: 'The Gamma Squeeze',
            description: 'AMC call options are causing a "gamma squeeze" driving the stock higher.',
            type: 'choice',
            question: `AMC is squeezing higher due to massive call buying forcing market makers to buy shares. You can join the squeeze or sell puts. What's the risk?`,
            options: [
              'No risk - the squeeze will continue',
              'Gamma squeezes can reverse instantly',
              'Market makers always win',
              'Options volume doesn\'t affect stock prices'
            ],
            correctAnswer: [1],
            explanation: `Gamma squeezes are violent but temporary. When call buying stops, market makers sell their hedges and the stock crashes. Most retail traders buy at the top of squeezes.`,
            points: 200,
            bias: 'fomo'
          },
          {
            id: 'options-3',
            title: 'The Covered Call Trap',
            description: 'You own 100 shares of Apple and want to "generate income" selling calls.',
            type: 'choice',
            question: `You own 100 AAPL shares at $150. You can sell $160 calls for $500 premium. If AAPL hits $160, you keep the premium but lose upside. Smart strategy?`,
            options: [
              'Yes - free money if AAPL stays below $160',
              'No - you cap your upside for small premium',
              'Depends on your outlook for AAPL',
              'Only if you want to sell the shares anyway'
            ],
            correctAnswer: [2, 3],
            explanation: `Covered calls work in sideways markets but cap upside in bull markets. You get paid to potentially sell your shares. Only use if you're neutral/slightly bearish.`,
            points: 200,
            bias: 'income-bias'
          },
          {
            id: 'options-4',
            title: 'The Iron Condor Nightmare',
            description: 'You sold an iron condor expecting low volatility, but earnings caused a big move.',
            type: 'choice',
            question: `You sold an iron condor on NVDA expecting it to stay between $200-220. Earnings caused a move to $240. Your max loss is $1,000. What now?`,
            options: [
              'Hold and hope it comes back',
              'Close the trade and take the loss',
              'Roll the trade to next month',
              'Double down and sell more condors'
            ],
            correctAnswer: [1],
            explanation: `When your thesis is wrong, take the loss quickly. Iron condors profit from low volatility - when volatility explodes, cut losses fast rather than hope for mean reversion.`,
            points: 200,
            bias: 'loss-aversion'
          },
          {
            id: 'options-5',
            title: 'The Volatility Crush',
            description: 'You bought calls before earnings. The stock went up but your calls lost money.',
            type: 'choice',
            question: `You bought calls before AMZN earnings. AMZN beat and went up 3%, but your calls lost 20%. What happened?`,
            options: [
              'The options were overpriced',
              'Implied volatility dropped after earnings',
              'Time decay ate the premium',
              'Market makers manipulated the price'
            ],
            correctAnswer: [1],
            explanation: `Volatility crush: Options are expensive before earnings due to uncertainty. After earnings, uncertainty disappears and option prices collapse even if the stock moves favorably.`,
            points: 250,
            bias: 'overconfidence'
          }
        ]
      }
    ]
  }
];