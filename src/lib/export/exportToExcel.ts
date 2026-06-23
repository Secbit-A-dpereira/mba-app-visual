import * as XLSX from 'xlsx';
import type { MBAState } from '@/types/mba';

type SheetRow = Record<string, string | number | boolean | undefined>;

function addSheet(wb: XLSX.WorkBook, name: string, data: SheetRow[], colWidths?: number[]) {
  const ws = XLSX.utils.json_to_sheet(data);
  if (colWidths) {
    ws['!cols'] = colWidths.map(w => ({ wch: w }));
  }
  XLSX.utils.book_append_sheet(wb, ws, name.slice(0, 31));
}

/* ── Helpers ── */
const pct = (n: number) => `${(n * 100).toFixed(1)}%`;
const curr = (n: number) => new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(n);

/* ── Chapter export functions ── */

function exportCh1(s: MBAState): SheetRow[] {
  const p = s.chapter1.profile;
  return [
    { Traço: 'Visão', Score: p.vision },
    { Traço: 'Decisão', Score: p.decision },
    { Traço: 'Comunicação', Score: p.communication },
    { Traço: 'Empatia', Score: p.empathy },
    { Traço: 'Adaptabilidade', Score: p.adaptability },
    { Traço: 'Integridade', Score: p.integrity },
    { Traço: 'Média', Score: ((p.vision + p.decision + p.communication + p.empathy + p.adaptability + p.integrity) / 6).toFixed(1) },
  ];
}

function exportCh2(s: MBAState): SheetRow[] {
  const sc = s.chapter3.scores;
  const res = s.chapter3.result;
  const rows: SheetRow[] = [
    { Dimensão: 'Mercado', 'Tamanho': sc.market.size, 'CAGR': sc.market.cagr, 'Fricção Aquisição': sc.market.acquisitionFriction },
    { Dimensão: 'Management', 'Execução': sc.management.execution, 'Expertise Domínio': sc.management.domainExpertise },
    { Dimensão: 'Money', 'Intensidade Capital': sc.money.capitalIntensity, 'Time to Profitability': sc.money.timeToProfitability },
  ];
  if (res) {
    rows.push({ Dimensão: 'Resultados', 'Score Mercado': res.marketScore, 'Score Management': res.managementScore, 'Score Money': res.moneyScore, 'Score Total': res.totalScore, 'Recomendação': res.recommendation });
  }
  return rows;
}

function exportCh3(s: MBAState): { forces: SheetRow[]; vrio: SheetRow[] } {
  const f = s.chapter10.forces;
  return {
    forces: [
      { 'Força': 'Rivalidade', 'Score': f.rivalry },
      { 'Força': 'Novos Entrantes', 'Score': f.threatOfNewEntrants },
      { 'Força': 'Substitutos', 'Score': f.threatOfSubstitutes },
      { 'Força': 'Poder Clientes', 'Score': f.buyerPower },
      { 'Força': 'Poder Fornecedores', 'Score': f.supplierPower },
    ],
    vrio: s.chapter10.assets.map(a => ({
      'Ativo': a.name,
      'Valioso': a.valuable ? 'Sim' : 'Não',
      'Raro': a.rare ? 'Sim' : 'Não',
      'Inimitável': a.inimitable ? 'Sim' : 'Não',
      'Organizado': a.organized ? 'Sim' : 'Não',
      'Implicação': '',
    })),
  };
}

function exportCh4(s: MBAState): SheetRow[] {
  const a = s.chapter14.alignment;
  return [
    { 'Elemento': 'Estratégia', 'Score': a.strategy },
    { 'Elemento': 'Estrutura', 'Score': a.structure },
    { 'Elemento': 'Sistemas', 'Score': a.systems },
    { 'Elemento': 'Valores Partilhados', 'Score': a.sharedValues },
    { 'Elemento': 'Estilo', 'Score': a.style },
    { 'Elemento': 'Staff', 'Score': a.staff },
    { 'Elemento': 'Skills', 'Score': a.skills },
    { 'Elemento': 'Média', 'Score': ((a.strategy + a.structure + a.systems + a.sharedValues + a.style + a.staff + a.skills) / 7).toFixed(1) },
  ];
}

function exportCh5(s: MBAState): SheetRow[] {
  const b = s.chapter13.bias;
  const active = Object.entries(b).filter(([_, v]) => v).map(([k]) => k);
  const risk = s.chapter13.risk;
  return [
    { 'Viés': 'Sunk Cost', 'Ativo': b.sunkCost ? 'Sim' : 'Não' },
    { 'Viés': 'Confirmation Bias', 'Ativo': b.confirmationBias ? 'Sim' : 'Não' },
    { 'Viés': 'Status Quo', 'Ativo': b.statusQuo ? 'Sim' : 'Não' },
    { 'Viés': 'Anchoring', 'Ativo': b.anchoring ? 'Sim' : 'Não' },
    { 'Viés': 'Overconfidence', 'Ativo': b.overconfidence ? 'Sim' : 'Não' },
    { 'Viés': 'Framing', 'Ativo': b.framing ? 'Sim' : 'Não' },
    { 'Viés': 'Availability', 'Ativo': b.availability ? 'Sim' : 'Não' },
    { 'Viés': 'Hindsight', 'Ativo': b.hindsight ? 'Sim' : 'Não' },
    { 'Viés': 'Dunning-Kruger', 'Ativo': b.dunningKruger ? 'Sim' : 'Não' },
    { 'Viés': 'Groupthink', 'Ativo': b.groupthink ? 'Sim' : 'Não' },
    { 'Risco': risk || '—', 'Vieses Ativos': active.length, 'Detalhe': active.length > 0 ? active.join(', ') : 'Nenhum' },
  ];
}

function exportCh6(s: MBAState): { statement: SheetRow[]; ratios: SheetRow[] } {
  const st = s.chapter2.statement;
  const rt = s.chapter2.ratios;
  return {
    statement: [
      { 'Conta': 'Receita', 'Valor': st.revenue },
      { 'Conta': 'COGS', 'Valor': st.cogs },
      { 'Conta': 'Despesas Operacionais', 'Valor': st.operatingExpenses },
      { 'Conta': 'Depreciação', 'Valor': st.depreciation },
      { 'Conta': 'Juros', 'Valor': st.interest },
      { 'Conta': 'Impostos', 'Valor': st.taxes },
      { 'Conta': 'Ações em Circulação', 'Valor': st.sharesOutstanding },
    ],
    ratios: rt ? [
      { 'Rácio': 'Margem Bruta', 'Valor': pct(rt.grossMargin) },
      { 'Rácio': 'Margem Operacional', 'Valor': pct(rt.operatingMargin) },
      { 'Rácio': 'Margem Líquida', 'Valor': pct(rt.netMargin) },
      { 'Rácio': 'Current Ratio', 'Valor': rt.currentRatio.toFixed(2) },
      { 'Rácio': 'Debt/Equity', 'Valor': rt.debtToEquity.toFixed(2) },
      { 'Rácio': 'EPS', 'Valor': curr(rt.eps) },
      { 'Rácio': 'ROE', 'Valor': pct(rt.roe) },
    ] : [{ 'Rácio': 'Sem dados', 'Valor': '—' }],
  };
}

function exportCh7(s: MBAState): SheetRow[] {
  const c = s.chapter4.cvp;
  const r = s.chapter4.result;
  const rows: SheetRow[] = [
    { 'Input': 'Preço Venda', 'Valor': c.sellingPrice },
    { 'Input': 'Custo Variável', 'Valor': c.variableCost },
    { 'Input': 'Custos Fixos', 'Valor': c.fixedCost },
  ];
  if (r) {
    rows.push({ 'Resultado': 'Margem Contribuição', 'Valor': curr(r.contributionMargin) });
    rows.push({ 'Resultado': 'BEP Unidades', 'Valor': r.breakEvenUnits });
    rows.push({ 'Resultado': 'BEP Receita', 'Valor': curr(r.breakEvenRevenue) });
    rows.push({ 'Resultado': 'Margem Segurança', 'Valor': pct(r.marginOfSafety) });
  }
  return rows;
}

function exportCh8(s: MBAState): SheetRow[] {
  const npv = s.chapter5.npv;
  const r = s.chapter5.result;
  const rows: SheetRow[] = [
    { 'Input': 'Investimento Inicial', 'Valor': curr(npv.initialInvestment) },
    { 'Input': 'Discount Rate', 'Valor': `${npv.discountRate}%` },
    { 'Input': 'Cash Flows', 'Valor': npv.cashFlows.join(', ') },
  ];
  if (r) {
    rows.push({ 'Resultado': 'NPV', 'Valor': curr(r.npv) });
    rows.push({ 'Resultado': 'IRR', 'Valor': `${r.irr.toFixed(2)}%` });
    rows.push({ 'Resultado': 'Payback', 'Valor': `${r.paybackPeriod} anos` });
    rows.push({ 'Resultado': 'Profitability Index', 'Valor': r.profitabilityIndex.toFixed(2) });
  }
  return rows;
}

function exportCh9(s: MBAState): SheetRow[] {
  const st = s.chapter12.startup;
  const m = s.chapter12.metrics;
  const rows: SheetRow[] = [
    { 'Input': 'Seed Investment', 'Valor': curr(st.seedInvestment) },
    { 'Input': 'Monthly Burn', 'Valor': curr(st.monthlyBurn) },
    { 'Input': 'Monthly Revenue', 'Valor': curr(st.monthlyRevenue) },
    { 'Input': 'Growth Rate', 'Valor': `${st.growthRate}%` },
    { 'Input': 'Churn Rate', 'Valor': `${st.churnRate}%` },
  ];
  if (m) {
    rows.push({ 'Resultado': 'Runway', 'Valor': `${m.runway} meses` });
    rows.push({ 'Resultado': 'LTV', 'Valor': curr(m.ltv) });
    rows.push({ 'Resultado': 'CAC', 'Valor': curr(m.cac) });
    rows.push({ 'Resultado': 'LTV:CAC', 'Valor': `${m.ltvCacRatio.toFixed(1)}x` });
  }
  return rows;
}

function exportCh10(s: MBAState): SheetRow[] {
  const m = s.chapter7.metrics;
  return [
    { 'Métrica': 'Throughput', 'Valor': m.throughput, 'Unidade': 'u/h' },
    { 'Métrica': 'Inventory (WIP)', 'Valor': m.inventory, 'Unidade': 'unidades' },
    { 'Métrica': 'Flow Time', 'Valor': m.flowTime, 'Unidade': 'dias' },
    { 'Métrica': 'Defect Rate', 'Valor': `${m.defectRate}%`, 'Unidade': '%' },
    { 'Métrica': 'OEE', 'Valor': `${m.oee}%`, 'Unidade': '%' },
  ];
}

function exportCh11(s: MBAState): SheetRow[] {
  return s.chapter21.items.map(item => ({
    'ID': item.id,
    'Nome': item.name,
    'Categoria': item.category,
    'Score': item.score,
    'Status': item.score >= 4 ? '✅ Pronto' : item.score >= 2 ? '⚠️ Em Progresso' : '🔴 Não Iniciado',
  }));
}

function exportCh12(s: MBAState): SheetRow[] {
  return s.chapter26.cadences.map(c => ({
    'Nome': c.name,
    'Frequência': c.frequency,
    'Duração (min)': c.duration,
    'Participantes': c.attendees,
    'Agenda': c.agenda,
    'Eficácia': c.effectiveness,
  }));
}

function exportCh15(s: MBAState): SheetRow[] {
  const l = s.chapter6.ladder;
  const p = s.chapter6.positioning;
  return [
    { 'Elemento': 'Attributes', 'Valor': l.attributes },
    { 'Elemento': 'Functional Benefit', 'Valor': l.functionalBenefit },
    { 'Elemento': 'Emotional Benefit', 'Valor': l.emotionalBenefit },
    { 'Elemento': 'Brand Essence', 'Valor': l.brandEssence },
    { 'Elemento': 'Target', 'Valor': p.target },
    { 'Elemento': 'Brand', 'Valor': p.brand },
    { 'Elemento': 'Category', 'Valor': p.category },
    { 'Elemento': 'Differentiator', 'Valor': p.differentiator },
  ];
}

function exportCh16(s: MBAState): SheetRow[] {
  const n = s.chapter9.negotiation;
  return [
    { 'Parâmetro': 'BATNA', 'Valor': curr(n.batna) },
    { 'Parâmetro': 'Preço Reserva', 'Valor': curr(n.reservationPrice) },
    { 'Parâmetro': 'Preço Aspiração', 'Valor': curr(n.aspirationPrice) },
    { 'Parâmetro': 'É Comprador', 'Valor': n.isBuyer ? 'Sim' : 'Não' },
    { 'Parâmetro': 'ZOPA', 'Valor': curr(n.isBuyer ? Math.max(0, n.reservationPrice - n.aspirationPrice) : Math.max(0, n.aspirationPrice - n.reservationPrice)) },
  ];
}

function exportCh17(s: MBAState): SheetRow[] {
  const m = s.chapter17.marketing;
  return [
    { 'Métrica': 'Target Audience Reach', 'Valor': m.targetAudienceReach },
    { 'Métrica': 'Conversion Rate', 'Valor': `${m.conversionRate}%` },
    { 'Métrica': 'CAC', 'Valor': curr(m.cac) },
    { 'Métrica': 'Viral Coefficient', 'Valor': m.viralCoefficient },
  ];
}

function exportCh18(s: MBAState): { stages: SheetRow[]; summary: SheetRow[] } {
  return {
    stages: s.chapter22.stages.map(st => ({
      'Estágio': st.name,
      'Montante': curr(st.amount),
      'Probabilidade': `${st.probability}%`,
      'Valor Esperado': curr(st.amount * st.probability / 100),
    })),
    summary: [
      { 'Métrica': 'Forecast Target', 'Valor': curr(s.chapter22.forecastTarget) },
      { 'Métrica': 'Actual Closed', 'Valor': curr(s.chapter22.actualClosed) },
      { 'Métrica': 'Hit Rate', 'Valor': s.chapter22.forecastTarget > 0 ? `${(s.chapter22.actualClosed / s.chapter22.forecastTarget * 100).toFixed(1)}%` : '—' },
    ],
  };
}

function exportCh19(s: MBAState): SheetRow[] {
  return s.chapter23.stages.map(st => ({
    'Etapa': st.stage,
    'Touchpoints': st.touchpoints,
    'Métricas': st.metrics,
    'Owner': st.owner,
    'Status': st.status,
    'Score': st.score,
  }));
}

function exportCh20(s: MBAState): { market: SheetRow[]; budget: SheetRow[]; phases: SheetRow[] } {
  const mkt = s.chapter24.marketSize;
  const bg = s.chapter24.budget;
  return {
    market: [
      { 'Métrica': 'TAM', 'Valor': curr(mkt.tam) },
      { 'Métrica': 'SAM', 'Valor': curr(mkt.sam) },
      { 'Métrica': 'SOM', 'Valor': curr(mkt.som) },
    ],
    budget: [
      { 'Departamento': 'Produto', 'Orçamento': curr(bg.product) },
      { 'Departamento': 'Marketing', 'Orçamento': curr(bg.marketing) },
      { 'Departamento': 'Vendas', 'Orçamento': curr(bg.sales) },
      { 'Departamento': 'Customer Success', 'Orçamento': curr(bg.cs) },
    ],
    phases: s.chapter24.phases.map(p => ({
      'Fase': p.phase,
      'Semanas': p.weeks,
      'Status': p.status,
      'Tarefas': p.tasks,
    })),
  };
}

function exportCh21(s: MBAState): { trends: SheetRow[]; indicators: SheetRow[]; benchmarks: SheetRow[] } {
  return {
    trends: s.chapter25.trends.map(t => ({
      'Mês': t.month,
      'Receita': curr(t.revenue),
      'ARR': curr(t.arr),
      'Churn': `${t.churn}%`,
    })),
    indicators: s.chapter25.indicators.map(i => ({
      'Indicador': i.name,
      'Valor': i.value,
      'Target': i.target,
      'Status': i.value >= i.target ? '✅' : '⚠️',
    })),
    benchmarks: [{
      'Benchmark': 'NRR', 'Valor': `${s.chapter25.benchmarks.nrr}%`,
    }, {
      'Benchmark': 'LTV:CAC', 'Valor': `${s.chapter25.benchmarks.ltvCac.toFixed(1)}x`,
    }, {
      'Benchmark': 'Churn Anual', 'Valor': `${s.chapter25.benchmarks.churn}%`,
    }, {
      'Benchmark': 'Payback (meses)', 'Valor': s.chapter25.benchmarks.payback,
    }],
  };
}

function exportCh24(s: MBAState): SheetRow[] {
  return s.chapter8.team.map(m => ({
    'Nome': m.name,
    'Role': m.role,
    'Performance': m.performance,
    'Potencial': m.potential,
  }));
}

function exportCh25(s: MBAState): SheetRow[] {
  return s.chapter11.decisions.map(d => ({
    'Pergunta': d.question,
    'Resposta': d.answer === null ? '—' : d.answer ? 'Sim' : 'Não',
    'Warning': d.warning || '',
  }));
}

function exportCh26(s: MBAState): SheetRow[] {
  return s.chapter15.errc.map(item => ({
    'Quadrante': item.quadrant,
    'Texto': item.text,
  }));
}

function exportCh27(s: MBAState): SheetRow[] {
  return s.chapter16.scamper.map(item => ({
    'Categoria': item.category,
    'Ideia': item.idea,
  }));
}

function exportCh28(s: MBAState): SheetRow[] {
  return s.chapter18.scorecard.map(item => ({
    'Perspetiva': item.perspective,
    'Objetivo': item.objective,
    'KPI': item.kpi,
    'Target': item.target,
    'Status': item.status === 'on_track' ? 'On Track' : item.status === 'at_risk' ? 'At Risk' : 'Delayed',
  }));
}

function exportCh29(s: MBAState): SheetRow[] {
  const c = s.chapter19.cage;
  const fi = s.chapter19.frictionIndex;
  return [
    { 'Dimensão': 'Cultural', 'Score': c.cultural },
    { 'Dimensão': 'Administrativo', 'Score': c.administrative },
    { 'Dimensão': 'Geográfico', 'Score': c.geographical },
    { 'Dimensão': 'Económico', 'Score': c.economic },
    { 'Dimensão': 'País Origem', 'Score': c.homeCountry || '—' },
    { 'Dimensão': 'País Alvo', 'Score': c.targetCountry || '—' },
    { 'Dimensão': 'Friction Index', 'Score': fi !== null ? fi.toFixed(1) : '—' },
  ];
}

/* ── Main export function ── */

export function exportAllToExcel(s: MBAState): void {
  const wb = XLSX.utils.book_new();

  // Fase 1 — Fundação
  addSheet(wb, 'Ch1_Lideranca', exportCh1(s), [30, 10]);
  addSheet(wb, 'Ch2_3MFramework', exportCh2(s), [20, 10, 10, 15, 10, 40]);
  const ch3 = exportCh3(s);
  addSheet(wb, 'Ch3_Estrategia_Forcas', ch3.forces, [25, 10]);
  if (ch3.vrio.length > 0) addSheet(wb, 'Ch3_VRIO', ch3.vrio, [25, 8, 8, 10, 10, 20]);
  addSheet(wb, 'Ch4_7S', exportCh4(s), [25, 10]);
  addSheet(wb, 'Ch5_Vieses', exportCh5(s), [25, 8]);

  // Fase 2 — Finanças
  const ch6 = exportCh6(s);
  addSheet(wb, 'Ch6_Demonstracao', ch6.statement, [30, 15]);
  addSheet(wb, 'Ch6_Racios', ch6.ratios, [25, 15]);
  addSheet(wb, 'Ch7_CVP', exportCh7(s), [25, 15]);
  addSheet(wb, 'Ch8_BusinessFinance', exportCh8(s), [25, 15]);
  addSheet(wb, 'Ch9_Startup', exportCh9(s), [25, 15]);

  // Fase 3 — Produto & Operações
  addSheet(wb, 'Ch10_Operacoes', exportCh10(s), [25, 10, 10]);
  addSheet(wb, 'Ch11_LaunchReadiness', exportCh11(s), [8, 50, 18, 8, 18]);
  addSheet(wb, 'Ch12_Cadencias', exportCh12(s), [25, 12, 14, 25, 40, 10]);

  // Fase 4 — Go-To-Market
  addSheet(wb, 'Ch15_MarketingBrand', exportCh15(s), [25, 50]);
  addSheet(wb, 'Ch16_Negociacao', exportCh16(s), [25, 15]);
  addSheet(wb, 'Ch17_StartupMarketing', exportCh17(s), [30, 15]);
  const ch18 = exportCh18(s);
  addSheet(wb, 'Ch18_Pipeline_Stages', ch18.stages, [20, 15, 15, 15]);
  addSheet(wb, 'Ch18_Pipeline_Summary', ch18.summary, [25, 15]);
  addSheet(wb, 'Ch19_Jornada', exportCh19(s), [18, 40, 30, 20, 18, 8]);
  const ch20 = exportCh20(s);
  addSheet(wb, 'Ch20_GTM_Market', ch20.market, [15, 15]);
  addSheet(wb, 'Ch20_GTM_Budget', ch20.budget, [20, 15]);
  addSheet(wb, 'Ch20_GTM_Timeline', ch20.phases, [15, 10, 15, 50]);
  const ch21 = exportCh21(s);
  addSheet(wb, 'Ch21_Revenue_Trends', ch21.trends, [8, 15, 15, 10]);
  addSheet(wb, 'Ch21_Indicators', ch21.indicators, [30, 10, 10, 8]);
  addSheet(wb, 'Ch21_Benchmarks', ch21.benchmarks, [20, 15]);

  // Fase 5 — Pessoas & Cultura
  addSheet(wb, 'Ch24_HR_9Box', exportCh24(s), [25, 20, 12, 12]);
  addSheet(wb, 'Ch25_Etica', exportCh25(s), [50, 10, 30]);
  addSheet(wb, 'Ch26_BlueOcean', exportCh26(s), [15, 60]);
  addSheet(wb, 'Ch27_SCAMPER', exportCh27(s), [15, 60]);
  addSheet(wb, 'Ch28_BSC', exportCh28(s), [15, 30, 20, 10, 12]);
  addSheet(wb, 'Ch29_CAGE', exportCh29(s), [25, 10]);

  // Generate and download
  const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([buf], { type: 'application/octet-stream' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `MBA_Export_${new Date().toISOString().slice(0, 10)}.xlsx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
