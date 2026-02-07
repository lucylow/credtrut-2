// Massive Mock Data Generators for CredTrust AI Agents Dashboard
// Generates realistic wallets, enclaves, loans, campaigns, and chart data

const hex = (len: number) => Array.from({ length: len }, () => '0123456789abcdef'[Math.floor(Math.random() * 16)]).join('');
const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomFloat = (min: number, max: number, dec = 2) => parseFloat((Math.random() * (max - min) + min).toFixed(dec));
const randomChoice = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const weightedChoice = <T>(items: T[], weights: number[]): T => {
  const total = weights.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (let i = 0; i < items.length; i++) { r -= weights[i]; if (r <= 0) return items[i]; }
  return items[items.length - 1];
};

// ─── Wallet Types ───
export interface MockWallet {
  address: string;
  balance: number;
  nfts: number;
  defiVolume: number;
  ageMonths: number;
  protocols: string[];
  txCount90d: number;
  score: number;
  tier: string;
  category: 'whale' | 'defi_active' | 'low_activity';
  lastActive: string;
}

const PROTOCOLS = ['aave', 'compound', 'uniswap', 'curve', 'makerdao', 'lido', 'yearn', 'sushiswap', 'balancer', 'convex'];
const TIERS = ['A++', 'A+', 'A', 'B+', 'B', 'C+', 'C', 'D'];

export function generateWallets(count = 500): MockWallet[] {
  return Array.from({ length: count }, (_, i) => {
    const category = weightedChoice<MockWallet['category']>(['whale', 'defi_active', 'low_activity'], [20, 50, 30]);
    const balance = category === 'whale' ? randomFloat(10, 125) : category === 'defi_active' ? randomFloat(0.5, 15) : randomFloat(0.01, 1);
    const nfts = category === 'whale' ? randomInt(5, 50) : randomInt(0, 8);
    const defiVolume = category === 'whale' ? randomInt(50000, 500000) : category === 'defi_active' ? randomInt(5000, 80000) : randomInt(100, 5000);
    const score = category === 'whale' ? randomInt(780, 850) : category === 'defi_active' ? randomInt(680, 790) : randomInt(400, 680);
    const tierIdx = score >= 800 ? 0 : score >= 770 ? 1 : score >= 740 ? 2 : score >= 710 ? 3 : score >= 680 ? 4 : score >= 640 ? 5 : score >= 580 ? 6 : 7;
    
    const numProtocols = category === 'whale' ? randomInt(4, 8) : category === 'defi_active' ? randomInt(2, 5) : randomInt(0, 2);
    const shuffled = [...PROTOCOLS].sort(() => Math.random() - 0.5);
    
    return {
      address: `0x${hex(40)}`,
      balance,
      nfts,
      defiVolume,
      ageMonths: randomInt(1, 48),
      protocols: shuffled.slice(0, numProtocols),
      txCount90d: category === 'whale' ? randomInt(100, 500) : category === 'defi_active' ? randomInt(20, 150) : randomInt(1, 20),
      score,
      tier: TIERS[tierIdx],
      category,
      lastActive: new Date(Date.now() - randomInt(0, 7 * 86400000)).toISOString(),
    };
  });
}

// ─── Enclave Types ───
export interface MockEnclave {
  taskId: string;
  agent: string;
  agentColor: string;
  status: 'RUNNING' | 'COMPLETED' | 'PENDING' | 'FAILED';
  mrenclave: string;
  progress: number;
  wallet: string;
  timestamp: string;
  duration: number;
  cpuUsage: number;
  memoryMb: number;
}

const AGENTS: { name: string; color: string; count: number }[] = [
  { name: 'CreditAgent', color: 'emerald', count: 12 },
  { name: 'LendingAgent', color: 'blue', count: 10 },
  { name: 'RiskAnalyst', color: 'amber', count: 15 },
  { name: 'Orchestrator', color: 'purple', count: 8 },
  { name: 'PortfolioAgent', color: 'cyan', count: 2 },
];

export function generateEnclaves(count = 47): MockEnclave[] {
  const enclaves: MockEnclave[] = [];
  let remaining = count;
  
  for (const agent of AGENTS) {
    const n = Math.min(agent.count, remaining);
    for (let i = 0; i < n; i++) {
      const status = weightedChoice<MockEnclave['status']>(['RUNNING', 'COMPLETED', 'PENDING', 'FAILED'], [60, 25, 10, 5]);
      enclaves.push({
        taskId: `0x${hex(16)}`,
        agent: agent.name,
        agentColor: agent.color,
        status,
        mrenclave: `0x${hex(64)}`,
        progress: status === 'COMPLETED' ? 100 : status === 'FAILED' ? randomInt(10, 60) : randomInt(15, 95),
        wallet: `0x${hex(40)}`,
        timestamp: new Date(Date.now() - randomInt(0, 3600000)).toISOString(),
        duration: randomFloat(0.8, 12.5),
        cpuUsage: randomFloat(20, 95),
        memoryMb: randomInt(128, 2048),
      });
      remaining--;
    }
    if (remaining <= 0) break;
  }
  return enclaves;
}

// ─── Loan Types ───
export interface MockLoan {
  id: string;
  pool: string;
  protocol: string;
  requiredTier: string;
  apr: number;
  termDays: number;
  ltv: number;
  amount: number;
  funded: number;
  status: 'Active' | 'Funded' | 'Expired' | 'Defaulted';
  borrower: string;
  collateralType: string;
  createdAt: string;
}

const POOLS = ['Aave V3', 'Compound III', 'Uniswap V4', 'Morpho Blue', 'Spark Protocol', 'Euler Finance'];
const COLLATERAL = ['ETH', 'WBTC', 'stETH', 'USDC', 'DAI', 'ARB', 'RWA Bond'];

export function generateLoans(count = 250): MockLoan[] {
  return Array.from({ length: count }, () => {
    const amount = randomInt(1000, 500000);
    const funded = randomFloat(0, amount);
    return {
      id: `loan-${hex(8)}`,
      pool: randomChoice(POOLS),
      protocol: randomChoice(['Arbitrum', 'Ethereum', 'Optimism']),
      requiredTier: randomChoice(['A++', 'A+', 'A', 'B+', 'B', 'C']),
      apr: randomFloat(3.2, 7.8),
      termDays: randomChoice([30, 60, 90, 180, 365]),
      ltv: randomFloat(45, 87),
      amount,
      funded,
      status: weightedChoice<MockLoan['status']>(['Active', 'Funded', 'Expired', 'Defaulted'], [50, 30, 15, 5]),
      borrower: `0x${hex(40)}`,
      collateralType: randomChoice(COLLATERAL),
      createdAt: new Date(Date.now() - randomInt(0, 30 * 86400000)).toISOString(),
    };
  });
}

// ─── Campaign Types ───
export interface MockCampaign {
  id: string;
  type: 'Web3Mail' | 'Push' | 'Telegram';
  subject: string;
  status: 'sent' | 'failed' | 'pending' | 'bounced';
  recipientCount: number;
  deliveryRate: number;
  rlcCost: number;
  protectedDataHash: string;
  sentAt: string;
}

const SUBJECTS = [
  'Your Credit Score Updated', 'New Loan Opportunity Available', 'TEE Attestation Complete',
  'Portfolio Rebalancing Alert', 'Risk Tier Upgrade Notice', 'Lending Pool Rate Change',
  'Weekly DeFi Summary', 'Collateral Ratio Warning', 'New Agent Deployed', 'Governance Vote'
];

export function generateCampaigns(count = 247): MockCampaign[] {
  return Array.from({ length: count }, () => ({
    id: `camp-${hex(6)}`,
    type: weightedChoice<MockCampaign['type']>(['Web3Mail', 'Push', 'Telegram'], [60, 25, 15]),
    subject: randomChoice(SUBJECTS),
    status: weightedChoice<MockCampaign['status']>(['sent', 'failed', 'pending', 'bounced'], [90, 4, 4, 2]),
    recipientCount: randomInt(1, 500),
    deliveryRate: randomFloat(92, 99.9),
    rlcCost: randomFloat(0.005, 0.05, 3),
    protectedDataHash: `0x${hex(64)}`,
    sentAt: new Date(Date.now() - randomInt(0, 14 * 86400000)).toISOString(),
  }));
}

// ─── Chart Data ───
export interface ChartDataPoint {
  date: string;
  scoreA: number;
  scoreB: number;
  scoreC: number;
  totalLoans: number;
  defaultRate: number;
  tvl: number;
  enclaveCount: number;
}

export function generateChartData(days = 30): ChartDataPoint[] {
  let tvl = 1800000;
  return Array.from({ length: days }, (_, i) => {
    tvl += randomInt(-50000, 80000);
    const date = new Date(Date.now() - (days - i) * 86400000);
    return {
      date: date.toISOString().split('T')[0],
      scoreA: randomFloat(40, 50),
      scoreB: randomFloat(25, 35),
      scoreC: randomFloat(15, 25),
      totalLoans: randomInt(200, 280),
      defaultRate: randomFloat(1.5, 4.2),
      tvl: Math.max(1000000, tvl),
      enclaveCount: randomInt(38, 55),
    };
  });
}

export interface TierDistribution {
  tier: string;
  percentage: number;
  count: number;
  color: string;
}

export function getTierDistribution(): TierDistribution[] {
  return [
    { tier: 'A++', percentage: 12, count: 60, color: '#10b981' },
    { tier: 'A+', percentage: 25, count: 125, color: '#34d399' },
    { tier: 'A', percentage: 18, count: 90, color: '#6ee7b7' },
    { tier: 'B+', percentage: 15, count: 75, color: '#3b82f6' },
    { tier: 'B', percentage: 12, count: 60, color: '#60a5fa' },
    { tier: 'C+', percentage: 8, count: 40, color: '#f59e0b' },
    { tier: 'C', percentage: 6, count: 30, color: '#fbbf24' },
    { tier: 'D', percentage: 4, count: 20, color: '#ef4444' },
  ];
}

// ─── Agent Chat Mock Responses ───
export interface MockAgentResponse {
  agent: string;
  patterns: { keywords: string[]; response: string; actions?: string[] }[];
}

export const AGENT_RESPONSES: MockAgentResponse[] = [
  {
    agent: 'CreditAgent',
    patterns: [
      { keywords: ['score', 'credit'], response: 'Based on TDX-attested analysis of 847 on-chain data points, wallet 0x742d...4b48 achieves a credit score of 812 (Tier A++). Key factors: 18-month wallet age (+45), 12 NFT holdings (+25 BAYC boost), $52.3k DeFi volume across 6 protocols (+38). Default probability: 2.1%.', actions: ['TDX_ATTESTATION', 'CREDIT_SCORE'] },
      { keywords: ['help', 'SME', 'Kenya'], response: 'For Kenyan SMEs, CredTrust enables M-Pesa transaction history to generate privacy-preserving credit scores via iExec TEE. Current stats: 127 active SME borrowers in East Africa, avg score 698 (Tier B+), avg loan size $2,400 at 5.2% APR. iExec Data Protector ensures financial data never leaves the enclave.', actions: ['MARKET_ANALYSIS'] },
      { keywords: ['default'], response: 'Portfolio default analysis (30d): Overall rate 2.8% across 250 active loans. Tier A: 0.4%, Tier B: 2.1%, Tier C: 5.7%, Tier D: 12.3%. Recommendation: Increase Tier A allocation by 15% to optimize risk-adjusted returns. Sharpe ratio would improve from 1.82 to 2.14.', actions: ['RISK_ANALYSIS'] },
    ]
  },
  {
    agent: 'LendingAgent',
    patterns: [
      { keywords: ['loan', 'borrow', 'rate'], response: 'Current best rates across 6 integrated pools:\n• Aave V3: 3.8% APR (Tier A required)\n• Compound III: 4.2% APR (Tier B+)\n• Morpho Blue: 3.5% APR (Tier A++)\n• Spark: 5.1% APR (Tier C+)\nTotal available liquidity: $2.4M. Your Tier A++ qualifies for all pools.', actions: ['LENDING_SCAN'] },
      { keywords: ['marketplace', 'risk'], response: 'Marketplace risk assessment: TVL $2.4M across 250 active loans. Concentration risk: 34% in Aave V3 (within tolerance). Liquidity ratio: 1.8x. Collateral health: 94% above liquidation threshold. No systemic risks detected. Next rebalance: 4h 23m.', actions: ['RISK_ANALYSIS', 'MARKET_ANALYSIS'] },
    ]
  },
  {
    agent: 'RiskAnalyst',
    patterns: [
      { keywords: ['analyze', 'risk', 'portfolio'], response: 'Running TEE-secured portfolio analysis across 47 active enclaves...\n\n📊 Risk Metrics:\n- VaR (95%): -$42,300\n- Expected Shortfall: -$68,100\n- Sharpe Ratio: 1.82\n- Max Drawdown: -8.4%\n- Beta to ETH: 0.67\n\nAll computations verified via Intel TDX attestation (MRENCLAVE: 0xdeadbeef...).', actions: ['TDX_ATTESTATION', 'RISK_ANALYSIS'] },
    ]
  },
  {
    agent: 'Orchestrator',
    patterns: [
      { keywords: ['news', 'crypto', 'sentiment'], response: 'Market Intelligence (real-time):\n\n📈 ETH: $3,847 (+2.3% 24h)\n📈 ARB: $1.24 (+5.1% 24h)\n💰 DeFi TVL: $48.2B (+1.8% 7d)\n\nSentiment: Bullish (72% confidence)\nKey events: Arbitrum Orbit launch, iExec TEE SDK v8 release, Fed meeting tomorrow.\n\n47 CredTrust enclaves processing 124 actions/hour.', actions: ['MARKET_ANALYSIS'] },
    ]
  },
];

export function getMockAgentResponse(agentName: string, message: string): { content: string; actions: string[] } {
  const agent = AGENT_RESPONSES.find(a => a.agent === agentName) || AGENT_RESPONSES[0];
  const lower = message.toLowerCase();
  
  for (const pattern of agent.patterns) {
    if (pattern.keywords.some(kw => lower.includes(kw))) {
      return { content: pattern.response, actions: pattern.actions || [] };
    }
  }
  
  return {
    content: `I've processed your request through the iExec TEE pipeline. Analysis complete:\n\n• 47 active TDX enclaves monitored\n• 500 wallets scored in current batch\n• Portfolio value: $2.4M AUM\n• System health: All enclaves operational\n\nWould you like me to run a deeper analysis on any specific metric?`,
    actions: ['TDX_ATTESTATION']
  };
}

// ─── Singleton cache ───
let _wallets: MockWallet[] | null = null;
let _enclaves: MockEnclave[] | null = null;
let _loans: MockLoan[] | null = null;
let _campaigns: MockCampaign[] | null = null;
let _chartData: ChartDataPoint[] | null = null;

export const mockData = {
  get wallets() { if (!_wallets) _wallets = generateWallets(); return _wallets; },
  get enclaves() { if (!_enclaves) _enclaves = generateEnclaves(); return _enclaves; },
  get loans() { if (!_loans) _loans = generateLoans(); return _loans; },
  get campaigns() { if (!_campaigns) _campaigns = generateCampaigns(); return _campaigns; },
  get chartData() { if (!_chartData) _chartData = generateChartData(); return _chartData; },
  get tierDistribution() { return getTierDistribution(); },
  
  refresh() {
    _wallets = generateWallets();
    _enclaves = generateEnclaves();
    _loans = generateLoans();
    _campaigns = generateCampaigns();
    _chartData = generateChartData();
  },
  
  get stats() {
    const w = this.wallets;
    const e = this.enclaves;
    const l = this.loans;
    return {
      totalWallets: w.length,
      avgScore: Math.round(w.reduce((s, x) => s + x.score, 0) / w.length),
      activeEnclaves: e.filter(x => x.status === 'RUNNING').length,
      totalEnclaves: e.length,
      activeLoans: l.filter(x => x.status === 'Active').length,
      totalVolume: l.reduce((s, x) => s + x.amount, 0),
      avgApr: parseFloat((l.reduce((s, x) => s + x.apr, 0) / l.length).toFixed(2)),
      actionsPerHour: randomInt(110, 140),
      aum: '$2.4M',
    };
  }
};
