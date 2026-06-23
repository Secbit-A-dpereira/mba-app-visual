// Core types for The Visual MBA - Executive Sandbox & Decision Engine

// ─── Chapter 1: Leadership ───────────────────────────────────────
export interface LeadershipProfile {
  vision: number; decision: number; communication: number;
  empathy: number; adaptability: number; integrity: number;
}

// ─── Chapter 2: Financial Reporting ─────────────────────────────
export interface FinancialStatement {
  revenue: number; cogs: number; operatingExpenses: number;
  depreciation: number; interest: number; taxes: number;
  sharesOutstanding: number;
}
export interface FinancialRatios {
  grossMargin: number; operatingMargin: number; netMargin: number;
  currentRatio: number; debtToEquity: number; eps: number; roe: number;
}

// ─── Chapter 3: 3M Framework ────────────────────────────────────
export interface ThreeMScore {
  market: { size: number; cagr: number; acquisitionFriction: number };
  management: { execution: number; domainExpertise: number };
  money: { capitalIntensity: number; timeToProfitability: number };
}
export interface ThreeMResult {
  marketScore: number; managementScore: number; moneyScore: number;
  totalScore: number; recommendation: string;
}

// ─── Chapter 4: Managerial Accounting ───────────────────────────
export interface CostVolumeProfit {
  sellingPrice: number; variableCost: number; fixedCost: number;
}
export interface CVPResult {
  contributionMargin: number; breakEvenUnits: number;
  breakEvenRevenue: number; marginOfSafety: number;
}

// ─── Chapter 5: Business Finance ────────────────────────────────
export interface NPVInput {
  initialInvestment: number; cashFlows: number[];
  discountRate: number;
}
export interface BusinessFinanceResult {
  npv: number; irr: number; paybackPeriod: number;
  profitabilityIndex: number;
}

// ─── Chapter 6: Marketing ───────────────────────────────────────
export interface BrandLadder {
  attributes: string; functionalBenefit: string;
  emotionalBenefit: string; brandEssence: string;
}
export interface PositioningStatement {
  target: string; brand: string; category: string;
  differentiator: string;
}

// ─── Chapter 7: Operations ──────────────────────────────────────
export interface OperationsMetrics {
  throughput: number; inventory: number; flowTime: number;
  defectRate: number; oee: number;
}

// ─── Chapter 8: HR 9-Box ────────────────────────────────────────
export interface TeamMember {
  id: string; name: string; role: string;
  performance: 1|2|3; potential: 1|2|3;
}
export type NineBoxPosition = { performance: 1|2|3; potential: 1|2|3 };

// ─── Chapter 9: Negotiations ────────────────────────────────────
export interface NegotiationProfile {
  batna: number; reservationPrice: number; aspirationPrice: number;
  isBuyer: boolean;
}

// ─── Chapter 10: Strategy ───────────────────────────────────────
export interface PortersFiveForces {
  rivalry: number; threatOfNewEntrants: number;
  threatOfSubstitutes: number; buyerPower: number; supplierPower: number;
}
export interface VRIOAsset {
  id: string; name: string; valuable: boolean; rare: boolean;
  inimitable: boolean; organized: boolean;
}
export type VRIOImplication =
  | 'Competitive Disadvantage' | 'Competitive Parity'
  | 'Temporary Advantage' | 'Sustained Competitive Advantage';

// ─── Chapter 11: Ethics ─────────────────────────────────────────
export interface EthicalDecision {
  question: string; answer: boolean | null;
  warning?: string;
}

// ─── Chapter 12: Entrepreneurial Finance ────────────────────────
export interface StartupFinance {
  seedInvestment: number; monthlyBurn: number; monthlyRevenue: number;
  growthRate: number; churnRate: number;
}
export interface StartupMetrics {
  runway: number; ltv: number; cac: number; ltvCacRatio: number;
  breakEvenMonth: number;
}

// ─── Chapter 13: Decision Making ────────────────────────────────
export interface BiasChecklist {
  sunkCost: boolean; confirmationBias: boolean; statusQuo: boolean;
  anchoring: boolean; overconfidence: boolean; framing: boolean;
  availability: boolean; hindsight: boolean; dunningKruger: boolean;
  groupthink: boolean;
}
export type BiasRiskRating = 'Safe' | 'Moderate' | 'Critical';

// ─── Chapter 14: General Manager ────────────────────────────────
export interface SevenSAlignment {
  strategy: number; structure: number; systems: number;
  sharedValues: number; style: number; staff: number; skills: number;
}

// ─── Chapter 15: Blue Ocean ─────────────────────────────────────
export interface ERRCItem {
  id: string; text: string; quadrant: 'eliminate'|'reduce'|'raise'|'create';
}

// ─── Chapter 16: Creativity ─────────────────────────────────────
export interface SCAMPERItem {
  id: string; category: string; idea: string;
}

// ─── Chapter 17: Startup Marketing ──────────────────────────────
export interface StartupMarketingMetrics {
  targetAudienceReach: number; conversionRate: number;
  cac: number; viralCoefficient: number;
}

// ─── Chapter 18: Balanced Scorecard ─────────────────────────────
export interface BSCItem {
  id: string; perspective: 'financial'|'customer'|'internal'|'learning';
  objective: string; kpi: string; target: number; status: 'on_track'|'at_risk'|'delayed';
}

// ─── Chapter 19: CAGE ───────────────────────────────────────────
export interface CAGEInput {
  cultural: number; administrative: number;
  geographical: number; economic: number;
  homeCountry: string; targetCountry: string;
}

// ─── Chapter 21: RevOps Launch Readiness ─────────────────────────
export interface LaunchReadinessItem {
  id: string;
  name: string;
  category: 'Sales' | 'Marketing' | 'Product' | 'Customer Success' | 'Finance';
  score: number;
}

// ─── Chapter 22: Pipeline & Forecast ────────────────────────────
export interface PipelineStage {
  name: string;
  amount: number;
  probability: number;
}

// ─── Chapter 23: Customer Journey Map ───────────────────────────
export interface JourneyStage {
  stage: 'Awareness' | 'Consideration' | 'Purchase' | 'Onboarding' | 'Retention' | 'Advocacy';
  touchpoints: string;
  metrics: string;
  owner: string;
  status: 'Not Started' | 'In Progress' | 'Optimized';
  score: number;
}

// ─── Chapter 24: GTM Launch Plan ────────────────────────────────
export interface BudgetAllocation {
  product: number;
  marketing: number;
  sales: number;
  cs: number;
}
export interface MarketSize {
  tam: number;
  sam: number;
  som: number;
}
export interface ChannelAllocation {
  channelName: string;
  percentage: number;
}
export interface TimelinePhase {
  phase: 'Pre-launch' | 'Launch' | 'Post-launch';
  weeks: number;
  status: 'Planned' | 'In Progress' | 'Completed';
  tasks: string;
}

// ─── Chapter 25: Revenue Dashboard ──────────────────────────────
export interface MonthTrend {
  month: string;
  revenue: number;
  arr: number;
  churn: number;
}
export interface LeadingIndicator {
  name: string;
  value: number;
  target: number;
}
export interface BenchmarkComparison {
  nrr: number;
  ltvCac: number;
  churn: number;
  payback: number;
}

// ─── Chapter 26: Operating Cadences ─────────────────────────────
export interface CadenceItem {
  name: string;
  frequency: 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly';
  duration: number;
  attendees: string;
  agenda: string;
  effectiveness: number;
}

// ─── Global MBA State ──────────────────────────────────────────
export interface MBAState {
  chapter1: { profile: LeadershipProfile };
  chapter2: { statement: FinancialStatement; ratios: FinancialRatios | null };
  chapter3: { scores: ThreeMScore; result: ThreeMResult | null };
  chapter4: { cvp: CostVolumeProfit; result: CVPResult | null };
  chapter5: { npv: NPVInput; result: BusinessFinanceResult | null };
  chapter6: { ladder: BrandLadder; positioning: PositioningStatement };
  chapter7: { metrics: OperationsMetrics };
  chapter8: { team: TeamMember[] };
  chapter9: { negotiation: NegotiationProfile };
  chapter10: { forces: PortersFiveForces; assets: VRIOAsset[] };
  chapter11: { decisions: EthicalDecision[] };
  chapter12: { startup: StartupFinance; metrics: StartupMetrics | null };
  chapter13: { bias: BiasChecklist; risk: BiasRiskRating | null };
  chapter14: { alignment: SevenSAlignment };
  chapter15: { errc: ERRCItem[] };
  chapter16: { scamper: SCAMPERItem[] };
  chapter17: { marketing: StartupMarketingMetrics };
  chapter18: { scorecard: BSCItem[] };
  chapter19: { cage: CAGEInput; frictionIndex: number | null };
  chapter21: { items: LaunchReadinessItem[] };
  chapter22: { stages: PipelineStage[]; forecastTarget: number; actualClosed: number };
  chapter23: { stages: JourneyStage[] };
  chapter24: { mode: 'top-down' | 'bottom-up'; marketSize: MarketSize; channels: ChannelAllocation[]; budget: BudgetAllocation; phases: TimelinePhase[] };
  chapter25: { trends: MonthTrend[]; indicators: LeadingIndicator[]; benchmarks: BenchmarkComparison };
  chapter26: { cadences: CadenceItem[] };
}

export const DEFAULT_MBA_STATE: MBAState = {
  chapter1: { profile: { vision: 5, decision: 5, communication: 5, empathy: 5, adaptability: 5, integrity: 5 } },
  chapter2: { statement: { revenue: 1000000, cogs: 400000, operatingExpenses: 300000, depreciation: 50000, interest: 20000, taxes: 50000, sharesOutstanding: 100000 }, ratios: null },
  chapter3: { scores: { market: { size: 5, cagr: 5, acquisitionFriction: 5 }, management: { execution: 5, domainExpertise: 5 }, money: { capitalIntensity: 5, timeToProfitability: 5 } }, result: null },
  chapter4: { cvp: { sellingPrice: 100, variableCost: 60, fixedCost: 50000 }, result: null },
  chapter5: { npv: { initialInvestment: 100000, cashFlows: [30000, 40000, 50000, 40000, 30000], discountRate: 10 }, result: null },
  chapter6: { ladder: { attributes: '', functionalBenefit: '', emotionalBenefit: '', brandEssence: '' }, positioning: { target: '', brand: '', category: '', differentiator: '' } },
  chapter7: { metrics: { throughput: 100, inventory: 500, flowTime: 5, defectRate: 2, oee: 85 } },
  chapter8: { team: [] },
  chapter9: { negotiation: { batna: 50, reservationPrice: 70, aspirationPrice: 100, isBuyer: true } },
  chapter10: { forces: { rivalry: 5, threatOfNewEntrants: 5, threatOfSubstitutes: 5, buyerPower: 5, supplierPower: 5 }, assets: [] },
  chapter11: { decisions: [] },
  chapter12: { startup: { seedInvestment: 500000, monthlyBurn: 50000, monthlyRevenue: 20000, growthRate: 10, churnRate: 5 }, metrics: null },
  chapter13: { bias: { sunkCost: false, confirmationBias: false, statusQuo: false, anchoring: false, overconfidence: false, framing: false, availability: false, hindsight: false, dunningKruger: false, groupthink: false }, risk: null },
  chapter14: { alignment: { strategy: 5, structure: 5, systems: 5, sharedValues: 5, style: 5, staff: 5, skills: 5 } },
  chapter15: { errc: [] },
  chapter16: { scamper: [] },
  chapter17: { marketing: { targetAudienceReach: 10000, conversionRate: 3, cac: 50, viralCoefficient: 0.5 } },
  chapter18: { scorecard: [] },
  chapter19: { cage: { cultural: 3, administrative: 3, geographical: 3, economic: 3, homeCountry: '', targetCountry: '' }, frictionIndex: null },
  chapter21: {
    items: [
      { id: '1', name: 'Sales team trained on pricing & features', category: 'Sales', score: 4 },
      { id: '2', name: 'CRM fields & sales pipeline configured', category: 'Sales', score: 5 },
      { id: '3', name: 'Sales deck & battlecards completed', category: 'Sales', score: 3 },
      { id: '4', name: 'Launch marketing campaign & emails ready', category: 'Marketing', score: 4 },
      { id: '5', name: 'Press release & blog posts written', category: 'Marketing', score: 2 },
      { id: '6', name: 'Website copy & product pages updated', category: 'Marketing', score: 5 },
      { id: '7', name: 'Product build certified & QA complete', category: 'Product', score: 5 },
      { id: '8', name: 'Provisioning & self-serve checkout tested', category: 'Product', score: 3 },
      { id: '9', name: 'Telemetry & usage analytics set up', category: 'Product', score: 2 },
      { id: '10', name: 'CS team trained on support handbook', category: 'Customer Success', score: 4 },
      { id: '11', name: 'Knowledge Base articles written & published', category: 'Customer Success', score: 4 },
      { id: '12', name: 'Service Level Agreements (SLA) finalized', category: 'Customer Success', score: 5 },
      { id: '13', name: 'Billing system configured & SKUs created', category: 'Finance', score: 3 },
      { id: '14', name: 'Revenue recognition rules defined', category: 'Finance', score: 2 },
      { id: '15', name: 'Comp plans & SPIFs updated for sales team', category: 'Finance', score: 4 },
    ]
  },
  chapter22: {
    stages: [
      { name: 'Awareness', amount: 150000, probability: 10 },
      { name: 'Interest', amount: 120000, probability: 20 },
      { name: 'Evaluation', amount: 90000, probability: 40 },
      { name: 'Proposal', amount: 70000, probability: 60 },
      { name: 'Negotiation', amount: 50000, probability: 80 },
      { name: 'Closed', amount: 30000, probability: 100 },
    ],
    forecastTarget: 200000,
    actualClosed: 180000,
  },
  chapter23: {
    stages: [
      { stage: 'Awareness', touchpoints: 'Blog, Ads, Social Media', metrics: 'Traffic, Impressions', owner: 'Marketing', status: 'Optimized', score: 4 },
      { stage: 'Consideration', touchpoints: 'Whitepapers, Webinars, Demos', metrics: 'Lead CTR, Demo Request Rate', owner: 'Marketing/Sales', status: 'In Progress', score: 3 },
      { stage: 'Purchase', touchpoints: 'Proposal, Contract, Checkout', metrics: 'Win Rate, Deal Cycle Time', owner: 'Sales', status: 'Optimized', score: 5 },
      { stage: 'Onboarding', touchpoints: 'Kickoff Call, Setup Guide, Training', metrics: 'Time to First Value, Setup Rate', owner: 'Customer Success', status: 'In Progress', score: 2 },
      { stage: 'Retention', touchpoints: 'Monthly QBRs, Support Tickets, Updates', metrics: 'Churn Rate, Net Retention (NRR)', owner: 'Customer Success', status: 'In Progress', score: 2 },
      { stage: 'Advocacy', touchpoints: 'Referral Program, Case Studies, Reviews', metrics: 'Net Promoter Score (NPS), Referrals', owner: 'Marketing', status: 'Not Started', score: 1 },
    ],
  },
  chapter24: {
    mode: 'top-down',
    marketSize: { tam: 10000000, sam: 4000000, som: 1000000 },
    channels: [
      { channelName: 'Direct Sales', percentage: 50 },
      { channelName: 'Partner/Channel', percentage: 30 },
      { channelName: 'Online/Inbound', percentage: 20 },
    ],
    budget: { product: 100000, marketing: 150000, sales: 200000, cs: 50000 },
    phases: [
      { phase: 'Pre-launch', weeks: 8, status: 'Completed', tasks: 'Market research, beta program, product training, pricing strategy' },
      { phase: 'Launch', weeks: 4, status: 'In Progress', tasks: 'Press release, email blast, sales outreach, webinars' },
      { phase: 'Post-launch', weeks: 12, status: 'Planned', tasks: 'Customer feedback loop, NRR optimization, feature iterations' },
    ],
  },
  chapter25: {
    trends: [
      { month: 'Jan', revenue: 50000, arr: 600000, churn: 1.5 },
      { month: 'Feb', revenue: 55000, arr: 660000, churn: 1.2 },
      { month: 'Mar', revenue: 62000, arr: 744000, churn: 1.4 },
      { month: 'Apr', revenue: 70000, arr: 840000, churn: 1.0 },
      { month: 'May', revenue: 78000, arr: 936000, churn: 0.9 },
      { month: 'Jun', revenue: 90000, arr: 1080000, churn: 0.8 },
    ],
    indicators: [
      { name: 'Pipeline Coverage Ratio', value: 3.2, target: 3.0 },
      { name: 'Demo Bookings / Week', value: 45, target: 40 },
      { name: 'Active Trials / Month', value: 120, target: 100 },
    ],
    benchmarks: {
      nrr: 112,
      ltvCac: 4.2,
      churn: 4.5,
      payback: 10,
    },
  },
  chapter26: {
    cadences: [
      { name: 'Daily Standup', frequency: 'Daily', duration: 15, attendees: 'Product, Sales, CS Leads', agenda: 'Blockers, daily targets, instant sync', effectiveness: 4 },
      { name: 'Weekly Pipeline Review', frequency: 'Weekly', duration: 45, attendees: 'Sales Managers, RevOps', agenda: 'Deal progression, pipe gen, warning flags', effectiveness: 5 },
      { name: 'Monthly Forecast Align', frequency: 'Monthly', duration: 60, attendees: 'CRO, Finance, RevOps', agenda: 'Commit vs Best Case, target reconciliation', effectiveness: 3 },
      { name: 'Quarterly Business Review', frequency: 'Quarterly', duration: 180, attendees: 'Executives, GTM Directors', agenda: 'Board reporting, LTV/CAC trends, annual strategy pivot', effectiveness: 4 },
    ],
  },
};

// Blank state — all fields zeroed/empty for a fresh canvas
export const BLANK_MBA_STATE: MBAState = {
  chapter1: { profile: { vision: 0, decision: 0, communication: 0, empathy: 0, adaptability: 0, integrity: 0 } },
  chapter2: { statement: { revenue: 0, cogs: 0, operatingExpenses: 0, depreciation: 0, interest: 0, taxes: 0, sharesOutstanding: 0 }, ratios: null },
  chapter3: { scores: { market: { size: 0, cagr: 0, acquisitionFriction: 0 }, management: { execution: 0, domainExpertise: 0 }, money: { capitalIntensity: 0, timeToProfitability: 0 } }, result: null },
  chapter4: { cvp: { sellingPrice: 0, variableCost: 0, fixedCost: 0 }, result: null },
  chapter5: { npv: { initialInvestment: 0, cashFlows: [0, 0, 0, 0, 0], discountRate: 0 }, result: null },
  chapter6: { ladder: { attributes: '', functionalBenefit: '', emotionalBenefit: '', brandEssence: '' }, positioning: { target: '', brand: '', category: '', differentiator: '' } },
  chapter7: { metrics: { throughput: 0, inventory: 0, flowTime: 0, defectRate: 0, oee: 0 } },
  chapter8: { team: [] },
  chapter9: { negotiation: { batna: 0, reservationPrice: 0, aspirationPrice: 0, isBuyer: true } },
  chapter10: { forces: { rivalry: 0, threatOfNewEntrants: 0, threatOfSubstitutes: 0, buyerPower: 0, supplierPower: 0 }, assets: [] },
  chapter11: { decisions: [] },
  chapter12: { startup: { seedInvestment: 0, monthlyBurn: 0, monthlyRevenue: 0, growthRate: 0, churnRate: 0 }, metrics: null },
  chapter13: { bias: { sunkCost: false, confirmationBias: false, statusQuo: false, anchoring: false, overconfidence: false, framing: false, availability: false, hindsight: false, dunningKruger: false, groupthink: false }, risk: null },
  chapter14: { alignment: { strategy: 0, structure: 0, systems: 0, sharedValues: 0, style: 0, staff: 0, skills: 0 } },
  chapter15: { errc: [] },
  chapter16: { scamper: [] },
  chapter17: { marketing: { targetAudienceReach: 0, conversionRate: 0, cac: 0, viralCoefficient: 0 } },
  chapter18: { scorecard: [] },
  chapter19: { cage: { cultural: 0, administrative: 0, geographical: 0, economic: 0, homeCountry: '', targetCountry: '' }, frictionIndex: null },
  chapter21: {
    items: [
      { id: '1', name: 'Sales team trained on pricing & features', category: 'Sales', score: 0 },
      { id: '2', name: 'CRM fields & sales pipeline configured', category: 'Sales', score: 0 },
      { id: '3', name: 'Sales deck & battlecards completed', category: 'Sales', score: 0 },
      { id: '4', name: 'Launch marketing campaign & emails ready', category: 'Marketing', score: 0 },
      { id: '5', name: 'Press release & blog posts written', category: 'Marketing', score: 0 },
      { id: '6', name: 'Website copy & product pages updated', category: 'Marketing', score: 0 },
      { id: '7', name: 'Product build certified & QA complete', category: 'Product', score: 0 },
      { id: '8', name: 'Provisioning & self-serve checkout tested', category: 'Product', score: 0 },
      { id: '9', name: 'Telemetry & usage analytics set up', category: 'Product', score: 0 },
      { id: '10', name: 'CS team trained on support handbook', category: 'Customer Success', score: 0 },
      { id: '11', name: 'Knowledge Base articles written & published', category: 'Customer Success', score: 0 },
      { id: '12', name: 'Service Level Agreements (SLA) finalized', category: 'Customer Success', score: 0 },
      { id: '13', name: 'Billing system configured & SKUs created', category: 'Finance', score: 0 },
      { id: '14', name: 'Revenue recognition rules defined', category: 'Finance', score: 0 },
      { id: '15', name: 'Comp plans & SPIFs updated for sales team', category: 'Finance', score: 0 },
    ]
  },
  chapter22: {
    stages: [
      { name: 'Awareness', amount: 0, probability: 10 },
      { name: 'Interest', amount: 0, probability: 20 },
      { name: 'Evaluation', amount: 0, probability: 40 },
      { name: 'Proposal', amount: 0, probability: 60 },
      { name: 'Negotiation', amount: 0, probability: 80 },
      { name: 'Closed', amount: 0, probability: 100 },
    ],
    forecastTarget: 0,
    actualClosed: 0,
  },
  chapter23: {
    stages: [
      { stage: 'Awareness', touchpoints: '', metrics: '', owner: '', status: 'Not Started', score: 0 },
      { stage: 'Consideration', touchpoints: '', metrics: '', owner: '', status: 'Not Started', score: 0 },
      { stage: 'Purchase', touchpoints: '', metrics: '', owner: '', status: 'Not Started', score: 0 },
      { stage: 'Onboarding', touchpoints: '', metrics: '', owner: '', status: 'Not Started', score: 0 },
      { stage: 'Retention', touchpoints: '', metrics: '', owner: '', status: 'Not Started', score: 0 },
      { stage: 'Advocacy', touchpoints: '', metrics: '', owner: '', status: 'Not Started', score: 0 },
    ],
  },
  chapter24: {
    mode: 'top-down',
    marketSize: { tam: 0, sam: 0, som: 0 },
    channels: [
      { channelName: 'Direct Sales', percentage: 0 },
      { channelName: 'Partner/Channel', percentage: 0 },
      { channelName: 'Online/Inbound', percentage: 0 },
    ],
    budget: { product: 0, marketing: 0, sales: 0, cs: 0 },
    phases: [
      { phase: 'Pre-launch', weeks: 0, status: 'Planned', tasks: '' },
      { phase: 'Launch', weeks: 0, status: 'Planned', tasks: '' },
      { phase: 'Post-launch', weeks: 0, status: 'Planned', tasks: '' },
    ],
  },
  chapter25: {
    trends: [
      { month: 'Jan', revenue: 0, arr: 0, churn: 0 },
      { month: 'Feb', revenue: 0, arr: 0, churn: 0 },
      { month: 'Mar', revenue: 0, arr: 0, churn: 0 },
      { month: 'Apr', revenue: 0, arr: 0, churn: 0 },
      { month: 'May', revenue: 0, arr: 0, churn: 0 },
      { month: 'Jun', revenue: 0, arr: 0, churn: 0 },
    ],
    indicators: [
      { name: 'Pipeline Coverage Ratio', value: 0, target: 0 },
      { name: 'Demo Bookings / Week', value: 0, target: 0 },
      { name: 'Active Trials / Month', value: 0, target: 0 },
    ],
    benchmarks: {
      nrr: 0,
      ltvCac: 0,
      churn: 0,
      payback: 0,
    },
  },
  chapter26: {
    cadences: [
      { name: 'Daily Standup', frequency: 'Daily', duration: 0, attendees: '', agenda: '', effectiveness: 0 },
      { name: 'Weekly Pipeline Review', frequency: 'Weekly', duration: 0, attendees: '', agenda: '', effectiveness: 0 },
      { name: 'Monthly Forecast Align', frequency: 'Monthly', duration: 0, attendees: '', agenda: '', effectiveness: 0 },
      { name: 'Quarterly Business Review', frequency: 'Quarterly', duration: 0, attendees: '', agenda: '', effectiveness: 0 },
    ],
  },
};
