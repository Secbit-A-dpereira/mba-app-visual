'use client';
import React, { useMemo } from 'react';
import { useMBA } from '@/context/MBAContext';
import { calcCAGEFriction, calcBSCStatus } from '@/lib/math';
import { currency, pct } from '@/lib/math';
import ExportButton from '@/components/export/ExportButton';

/* ── Dashboard Card wrapper ── */
function Card({ icon, title, color, children, className = '' }: { icon: string; title: string; color: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden ${className}`}>
      <div className={`px-3 py-2 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r ${color}`}>
        <div className="flex items-center gap-2">
          <span className="text-base">{icon}</span>
          <h4 className="text-base font-semibold text-white">{title}</h4>
        </div>
      </div>
      <div className="p-3 space-y-1.5">{children}</div>
    </div>
  );
}

function StatRow({ label, value, sub, good }: { label: string; value: string; sub?: string; good?: boolean }) {
  const color = good !== undefined ? (good ? 'text-emerald-400' : 'text-red-400') : 'text-slate-200';
  return (
    <div className="flex items-center justify-between">
      <span className="text-base text-slate-400">{label}</span>
      <div className="text-right">
        <span className={`text-base font-semibold tabular-nums ${color}`}>{value}</span>
        {sub && <span className="text-base text-slate-500 ml-1">{sub}</span>}
      </div>
    </div>
  );
}

function PhaseHeader({ number, title, subtitle }: { number: string; title: string; subtitle: string }) {
  return (
    <div className="col-span-full flex items-start gap-3 mt-4 mb-1">
      <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white text-base font-bold shrink-0">
        {number}
      </div>
      <div>
        <h4 className="text-base font-bold text-slate-100">{title}</h4>
        <p className="text-base text-slate-500">{subtitle}</p>
      </div>
      <div className="flex-1 border-t border-slate-700/60 mt-4" />
    </div>
  );
}

export default function Ch20Dashboard() {
  const { state } = useMBA();
  const s = state;

  const bscSummary = useMemo(() => calcBSCStatus(s.chapter18.scorecard), [s.chapter18.scorecard]);
  const cageIndex = s.chapter19.frictionIndex ?? calcCAGEFriction(s.chapter19.cage);
  const startupM = s.chapter12.metrics;

  // Ch1 - Leadership avg
  const leadershipAvg = (() => {
    const p = s.chapter1.profile;
    return ((p.vision + p.decision + p.communication + p.empathy + p.adaptability + p.integrity) / 6).toFixed(1);
  })();

  const threeM = s.chapter3.result;
  const cvp = s.chapter4.result;
  const fin = s.chapter5.result;
  const ops = s.chapter7.metrics;
  const neg = s.chapter9.negotiation;
  const zopaSize = neg.isBuyer
    ? Math.max(0, neg.reservationPrice - neg.aspirationPrice)
    : Math.max(0, neg.aspirationPrice - neg.reservationPrice);
  const vrioCount = s.chapter10.assets.length;
  const sustained = s.chapter10.assets.filter(a => a.valuable && a.rare && a.inimitable && a.organized).length;
  const biasCount = Object.values(s.chapter13.bias).filter(Boolean).length;
  const sevenS = s.chapter14.alignment;
  const sevenSAvg = ((sevenS.strategy + sevenS.structure + sevenS.systems + sevenS.sharedValues + sevenS.style + sevenS.staff + sevenS.skills) / 7).toFixed(1);
  const launchItems = s.chapter21.items;
  const launchScore = launchItems.length > 0 ? Math.round(launchItems.reduce((a, b) => a + b.score, 0) / launchItems.length * 20) : 0;
  const pipelineTotal = s.chapter22.stages.reduce((a, s) => a + s.amount, 0);
  const journeyAvg = s.chapter23.stages.length > 0
    ? (s.chapter23.stages.reduce((a, s) => a + s.score, 0) / s.chapter23.stages.length).toFixed(1)
    : '—';
  const marketSize = s.chapter24.marketSize;
  const trends = s.chapter25.trends;
  const latestRev = trends.length > 0 ? trends[trends.length - 1].revenue : 0;
  const latestArr = trends.length > 0 ? trends[trends.length - 1].arr : 0;
  const latestChurn = trends.length > 0 ? trends[trends.length - 1].churn : 0;
  const cadenceCount = s.chapter26.cadences.length;
  const avgEffectiveness = cadenceCount > 0 ? (s.chapter26.cadences.reduce((a, c) => a + c.effectiveness, 0) / cadenceCount).toFixed(1) : '—';

  // Ch17 - Startup Marketing
  const mkt = s.chapter17.marketing;

  return (
    <div className="space-y-2">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-base font-semibold text-slate-100">🖥️ Dashboard — Visão Geral</h3>
          <p className="text-base text-slate-500 mt-0.5">Todos os indicadores organizados por fase de lançamento</p>
        </div>
        <ExportButton />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">

        {/* ═══════════════════════════════════════════════════════
           FASE 1 — FUNDAÇÃO (Estratégia & Liderança)
           ═══════════════════════════════════════════════════════ */}
        <PhaseHeader number="1" title="Fundação" subtitle="Estratégia, liderança e visão — o alicerce do negócio" />

        <Card icon="👤" title="Ch.1 Liderança" color="from-sky-600 to-sky-700">
          <StatRow label="Score Médio" value={`${leadershipAvg}/10`} good={Number(leadershipAvg) >= 6} />
          <StatRow label="Visão" value={`${s.chapter1.profile.vision}/10`} />
          <StatRow label="Decisão" value={`${s.chapter1.profile.decision}/10`} />
        </Card>

        <Card icon="🔍" title="Ch.2 3M Framework" color="from-indigo-600 to-indigo-700">
          {threeM ? (
            <>
              <StatRow label="Score Total" value={`${threeM.totalScore.toFixed(1)}/10`} good={threeM.totalScore >= 6} />
              <StatRow label="Mercado" value={`${threeM.marketScore.toFixed(1)}/10`} />
              <StatRow label="Management" value={`${threeM.managementScore.toFixed(1)}/10`} />
              <StatRow label="Money" value={`${threeM.moneyScore.toFixed(1)}/10`} />
              <p className="text-base text-slate-500 mt-1">{threeM.recommendation}</p>
            </>
          ) : (
            <p className="text-base text-slate-500 italic">Sem dados</p>
          )}
        </Card>

        <Card icon="♟️" title="Ch.3 Estratégia" color="from-blue-600 to-blue-700">
          <StatRow label="Ativos VRIO" value={`${vrioCount}`} />
          <StatRow label="Vant. Sustentável" value={`${sustained}`} good={sustained > 0} />
          <StatRow label="Rivalidade (5F)" value={`${s.chapter10.forces.rivalry}/10`} good={s.chapter10.forces.rivalry <= 5} />
        </Card>

        <Card icon="🏛️" title="Ch.4 7S" color="from-cyan-600 to-cyan-700">
          <StatRow label="Alinhamento Médio" value={`${sevenSAvg}/10`} good={Number(sevenSAvg) >= 6} />
          <StatRow label="Estratégia" value={`${sevenS.strategy}/10`} />
          <StatRow label="Valores Partilh." value={`${sevenS.sharedValues}/10`} />
        </Card>

        <Card icon="🧠" title="Ch.5 Vieses" color="from-purple-600 to-purple-700">
          <StatRow label="Riscos Ativos" value={`${biasCount}/10`} good={biasCount <= 3} />
          <StatRow label="Classificação" value={biasCount === 0 ? '✅ Seguro' : biasCount <= 3 ? '⚠️ Moderado' : '🚨 Crítico'} good={biasCount <= 3} />
        </Card>

        {/* ═══════════════════════════════════════════════════════
           FASE 2 — FINANÇAS (Planeamento & Viabilidade)
           ═══════════════════════════════════════════════════════ */}
        <PhaseHeader number="2" title="Finanças" subtitle="Viabilidade económica, rentabilidade e planeamento financeiro" />

        <Card icon="📊" title="Ch.6 Finanças" color="from-emerald-600 to-emerald-700">
          {s.chapter2.ratios ? (
            <>
              <StatRow label="Margem Bruta" value={pct(s.chapter2.ratios.grossMargin)} good={s.chapter2.ratios.grossMargin >= 0.4} />
              <StatRow label="Margem Líquida" value={pct(s.chapter2.ratios.netMargin)} good={s.chapter2.ratios.netMargin >= 0.1} />
              <StatRow label="ROE" value={pct(s.chapter2.ratios.roe)} good={s.chapter2.ratios.roe >= 0.15} />
            </>
          ) : (
            <p className="text-base text-slate-500 italic">Sem dados</p>
          )}
        </Card>

        <Card icon="🧮" title="Ch.7 CVP" color="from-teal-600 to-teal-700">
          {cvp ? (
            <>
              <StatRow label="BEP (unid)" value={`${cvp.breakEvenUnits}`} />
              <StatRow label="BEP (receita)" value={currency(cvp.breakEvenRevenue)} />
              <StatRow label="Margem Contrib." value={currency(cvp.contributionMargin)} />
            </>
          ) : (
            <p className="text-base text-slate-500 italic">Sem dados</p>
          )}
        </Card>

        <Card icon="💰" title="Ch.8 Business Finance" color="from-green-600 to-green-700">
          {fin ? (
            <>
              <StatRow label="NPV" value={currency(fin.npv)} good={fin.npv >= 0} />
              <StatRow label="IRR" value={`${fin.irr.toFixed(1)}%`} good={fin.irr >= 10} />
              <StatRow label="Payback" value={`${fin.paybackPeriod} anos`} good={fin.paybackPeriod <= 3} />
            </>
          ) : (
            <p className="text-base text-slate-500 italic">Sem dados</p>
          )}
        </Card>

        <Card icon="🚀" title="Ch.9 Startup" color="from-orange-600 to-orange-700">
          {startupM ? (
            <>
              <StatRow label="Runway" value={`${startupM.runway} meses`} good={startupM.runway >= 12} />
              <StatRow label="LTV:CAC" value={`${startupM.ltvCacRatio.toFixed(1)}x`} good={startupM.ltvCacRatio >= 3} />
              <StatRow label="LTV" value={currency(startupM.ltv)} />
            </>
          ) : (
            <p className="text-base text-slate-500 italic">Sem dados</p>
          )}
        </Card>

        {/* ═══════════════════════════════════════════════════════
           FASE 3 — PRODUTO (Operações & Execução)
           ═══════════════════════════════════════════════════════ */}
        <PhaseHeader number="3" title="Produto & Operações" subtitle="Eficiência operacional, qualidade e prontidão para lançar" />

        <Card icon="⚙️" title="Ch.10 Operações" color="from-amber-600 to-amber-700">
          <StatRow label="OEE" value={`${ops.oee}%`} good={ops.oee >= 85} />
          <StatRow label="Defeitos" value={`${ops.defectRate}%`} good={ops.defectRate <= 2} />
          <StatRow label="Throughput" value={`${ops.throughput} u/h`} good={ops.throughput >= 200} />
        </Card>

        <Card icon="🚀" title="Ch.11 Launch Readiness" color="from-pink-600 to-pink-700">
          <StatRow label="Prontidão" value={`${launchScore}%`} good={launchScore >= 70} />
          <StatRow label="Itens" value={`${launchItems.length}`} />
        </Card>

        <Card icon="📅" title="Ch.12 Cadências" color="from-amber-600 to-amber-700">
          <StatRow label="Reuniões" value={`${cadenceCount}`} />
          <StatRow label="Eficácia Média" value={`${avgEffectiveness}/5`} good={Number(avgEffectiveness) >= 3} />
        </Card>

        {/* ═══════════════════════════════════════════════════════
           FASE 4 — GO-TO-MARKET (Vendas, Marketing & Receita)
           ═══════════════════════════════════════════════════════ */}
        <PhaseHeader number="4" title="Go-To-Market" subtitle="Pipeline, receita, negociação e penetração no mercado" />

        <Card icon="📢" title="Ch.15 Marketing & Brand" color="from-violet-600 to-violet-700">
          <StatRow label="Brand Essence" value={s.chapter6.ladder.brandEssence || '—'} />
          <StatRow label="Target" value={s.chapter6.positioning.target || '—'} />
          <StatRow label="Diferenciador" value={s.chapter6.positioning.differentiator || '—'} />
        </Card>

        <Card icon="🤝" title="Ch.16 Negociação" color="from-rose-600 to-rose-700">
          <StatRow label="BATNA" value={currency(neg.batna)} />
          <StatRow label="Reserva" value={currency(neg.reservationPrice)} />
          <StatRow label="ZOPA" value={currency(zopaSize)} good={zopaSize > 0} />
        </Card>

        <Card icon="📈" title="Ch.17 Startup Marketing" color="from-violet-600 to-violet-700">
          <StatRow label="Reach" value={`${mkt.targetAudienceReach.toLocaleString()}`} />
          <StatRow label="Conversão" value={`${mkt.conversionRate}%`} good={mkt.conversionRate >= 5} />
          <StatRow label="CAC" value={currency(mkt.cac)} good={mkt.cac <= 50} />
        </Card>

        <Card icon="📊" title="Ch.18 Pipeline" color="from-blue-600 to-blue-700">
          <StatRow label="Pipeline Total" value={currency(pipelineTotal)} />
          <StatRow label="Target" value={currency(s.chapter22.forecastTarget)} />
          <StatRow label="Closed" value={currency(s.chapter22.actualClosed)} good={s.chapter22.actualClosed >= s.chapter22.forecastTarget} />
        </Card>

        <Card icon="🗺️" title="Ch.19 Jornada" color="from-teal-600 to-teal-700">
          <StatRow label="Score Médio" value={`${journeyAvg}/5`} good={Number(journeyAvg) >= 3} />
          <StatRow label="Etapas" value={`${s.chapter23.stages.length}`} />
        </Card>

        <Card icon="🎯" title="Ch.20 GTM" color="from-indigo-600 to-indigo-700">
          <StatRow label="TAM" value={currency(marketSize.tam)} />
          <StatRow label="SAM" value={currency(marketSize.sam)} />
          <StatRow label="SOM" value={currency(marketSize.som)} />
        </Card>

        <Card icon="📈" title="Ch.21 Revenue" color="from-green-600 to-green-700">
          <StatRow label="Receita (mês)" value={currency(latestRev)} good={latestRev > 0} />
          <StatRow label="ARR" value={currency(latestArr)} />
          <StatRow label="Churn" value={`${latestChurn}%`} good={latestChurn <= 1.5} />
        </Card>

        {/* ═══════════════════════════════════════════════════════
           FASE 5 — PESSOAS & CULTURA (Equipa & Avaliação)
           ═══════════════════════════════════════════════════════ */}
        <PhaseHeader number="5" title="Pessoas & Cultura" subtitle="Equipa, avaliação de desempenho e expansão internacional" />

        <Card icon="👥" title="Ch.24 HR 9-Box" color="from-violet-600 to-violet-700">
          <StatRow label="Membros" value={`${s.chapter8.team.length}`} />
          {(() => {
            const t = s.chapter8.team;
            return (
              <>
                <StatRow label="Top Performance" value={`${t.filter(m => m.performance === 3).length}`} />
                <StatRow label="Alto Potencial" value={`${t.filter(m => m.potential === 3).length}`} />
              </>
            );
          })()}
        </Card>

        <Card icon="🎯" title="Ch.28 BSC" color="from-emerald-600 to-emerald-700">
          {s.chapter18.scorecard.length > 0 ? (
            <>
              <StatRow label="On Track" value={`${bscSummary.onTrack}`} good={bscSummary.onTrack >= bscSummary.atRisk} />
              <StatRow label="At Risk" value={`${bscSummary.atRisk}`} good={bscSummary.atRisk === 0} />
              <StatRow label="Saúde" value={bscSummary.total > 0 ? `${Math.round((bscSummary.onTrack / bscSummary.total) * 100)}%` : '—'} good={bscSummary.total > 0 && (bscSummary.onTrack / bscSummary.total) >= 0.7} />
            </>
          ) : (
            <p className="text-base text-slate-500 italic">Sem dados</p>
          )}
        </Card>

        <Card icon="🌍" title="Ch.29 CAGE" color="from-sky-600 to-sky-700">
          <StatRow label="Índice Fricção" value={`${cageIndex.toFixed(1)}/10`} good={cageIndex < 4} />
          <StatRow label="Cultural" value={`${s.chapter19.cage.cultural}/10`} />
          <StatRow label="Económico" value={`${s.chapter19.cage.economic}/10`} />
        </Card>

      </div>
    </div>
  );
}
