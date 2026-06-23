// Math engine for MBA calculations — all client-side, no deps

export function toCents(amount: number): number {
  return Math.round(amount * 100);
}
export function fromCents(cents: number): number {
  return cents / 100;
}
export function pct(n: number): string {
  return `${(n * 100).toFixed(1)}%`;
}
export function currency(n: number): string {
  return new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(n);
}
export function safeDivide(a: number, b: number): { value: number; isInfinite: boolean } {
  if (b === 0) return { value: Infinity, isInfinite: true };
  return { value: a / b, isInfinite: false };
}

// Chapter 2: Financial Ratios
export function calcFinancialRatios(stmt: { revenue: number; cogs: number; operatingExpenses: number; depreciation: number; interest: number; taxes: number; sharesOutstanding: number }) {
  const grossProfit = stmt.revenue - stmt.cogs;
  const operatingIncome = grossProfit - stmt.operatingExpenses - stmt.depreciation;
  const netIncome = operatingIncome - stmt.interest - stmt.taxes;
  const { value: eps } = safeDivide(netIncome, stmt.sharesOutstanding);
  const { value: roe } = safeDivide(netIncome, stmt.revenue * 0.5); // simplified equity
  return {
    grossMargin: grossProfit / stmt.revenue,
    operatingMargin: operatingIncome / stmt.revenue,
    netMargin: netIncome / stmt.revenue,
    currentRatio: 2.0, // placeholder; user inputs current/assets
    debtToEquity: 0.5,
    eps,
    roe,
  };
}

// Chapter 3: 3M Score
export function calcThreeM(scores: { market: { size: number; cagr: number; acquisitionFriction: number }; management: { execution: number; domainExpertise: number }; money: { capitalIntensity: number; timeToProfitability: number } }): { marketScore: number; managementScore: number; moneyScore: number; totalScore: number; recommendation: string } {
  const marketScore = (scores.market.size + scores.market.cagr + (10 - scores.market.acquisitionFriction)) / 3;
  const managementScore = (scores.management.execution + scores.management.domainExpertise) / 2;
  const moneyScore = ((10 - scores.money.capitalIntensity) + (10 - scores.money.timeToProfitability)) / 2;
  const totalScore = (marketScore + managementScore + moneyScore) / 3;
  let recommendation = 'Proceed with caution';
  if (totalScore >= 7) recommendation = 'Strong invest/launch signal';
  else if (totalScore >= 5) recommendation = 'Proceed with caution — address gaps';
  else recommendation = 'Reconsider or pivot';
  return { marketScore, managementScore, moneyScore, totalScore, recommendation };
}

// Chapter 4: CVP
export function calcCVP(cvp: { sellingPrice: number; variableCost: number; fixedCost: number }) {
  const contributionMargin = cvp.sellingPrice - cvp.variableCost;
  const breakEvenUnits = Math.ceil(cvp.fixedCost / contributionMargin);
  const breakEvenRevenue = breakEvenUnits * cvp.sellingPrice;
  return { contributionMargin, breakEvenUnits, breakEvenRevenue, marginOfSafety: 0.25 };
}

// Chapter 5: NPV / IRR
export function calcNPV(input: { initialInvestment: number; cashFlows: number[]; discountRate: number }) {
  const rate = input.discountRate / 100;
  let npv = -input.initialInvestment;
  input.cashFlows.forEach((cf, t) => { npv += cf / Math.pow(1 + rate, t + 1); });
  // Simple IRR approximation
  let irr = 0.1;
  for (let i = 0; i < 100; i++) {
    let npv2 = -input.initialInvestment;
    input.cashFlows.forEach((cf, t) => { npv2 += cf / Math.pow(1 + irr, t + 1); });
    if (Math.abs(npv2) < 0.01) break;
    irr += npv2 > 0 ? 0.01 : -0.01;
  }
  const totalInflows = input.cashFlows.reduce((a, b) => a + b, 0);
  let cumulative = -input.initialInvestment;
  let paybackPeriod = input.cashFlows.length;
  for (let t = 0; t < input.cashFlows.length; t++) {
    cumulative += input.cashFlows[t];
    if (cumulative >= 0) { paybackPeriod = t + 1; break; }
  }
  const pi = totalInflows / input.initialInvestment;
  return { npv: Math.round(npv * 100) / 100, irr: Math.round(irr * 10000) / 100, paybackPeriod, profitabilityIndex: Math.round(pi * 100) / 100 };
}

// Chapter 12: Startup Finance
export function calcStartupMetrics(s: { seedInvestment: number; monthlyBurn: number; monthlyRevenue: number; growthRate: number; churnRate: number }) {
  const runway = Math.floor(s.seedInvestment / (s.monthlyBurn - s.monthlyRevenue));
  const avgRevenuePerUser = s.monthlyRevenue / Math.max(1, s.monthlyRevenue / 10);
  const churnDecimal = s.churnRate / 100;
  const ltv = churnDecimal > 0 ? avgRevenuePerUser / churnDecimal : Infinity;
  const cac = 50; // simplified
  const ltvCacRatio = ltv / cac;
  let breakEvenMonth = runway;
  return { runway, ltv: Math.round(ltv), cac, ltvCacRatio: Math.round(ltvCacRatio * 10) / 10, breakEvenMonth };
}

// Chapter 10: VRIO
export function calcVRIOImplication(a: { valuable: boolean; rare: boolean; inimitable: boolean; organized: boolean }): string {
  if (!a.valuable) return 'Competitive Disadvantage';
  if (!a.rare) return 'Competitive Parity';
  if (!a.inimitable) return 'Temporary Advantage';
  if (!a.organized) return 'Temporary Advantage (unused)';
  return 'Sustained Competitive Advantage';
}

// Chapter 13: Bias Risk
export function calcBiasRisk(b: { [key: string]: boolean }): { rating: 'Safe' | 'Moderate' | 'Critical'; count: number } {
  const count = Object.values(b).filter(v => v).length;
  if (count === 0) return { rating: 'Safe', count };
  if (count <= 3) return { rating: 'Moderate', count };
  return { rating: 'Critical', count };
}

// Chapter 14: 7S Alignment
export function calcSevenSAlignment(a: Record<string, number>) {
  const values = Object.values(a);
  const avg = values.reduce((s, v) => s + v, 0) / values.length;
  const weak = Object.entries(a).filter(([_, v]) => v < 4).map(([k]) => k);
  return { averageAlignment: avg, weakNodes: weak };
}

// Chapter 19: CAGE Distance
export function calcCAGEFriction(cage: { cultural: number; administrative: number; geographical: number; economic: number }) {
  const avg = (cage.cultural + cage.administrative + cage.geographical + cage.economic) / 4;
  return Math.round(avg * 10) / 10;
}

// Chapter 18: Balanced Scorecard
export function calcBSCStatus(items: { status: string }[]) {
  const onTrack = items.filter(i => i.status === 'on_track').length;
  const atRisk = items.filter(i => i.status === 'at_risk').length;
  const delayed = items.filter(i => i.status === 'delayed').length;
  return { onTrack, atRisk, delayed, total: items.length };
}
