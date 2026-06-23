'use client';
import dynamic from 'next/dynamic';
import { useMBA } from '@/context/MBAContext';

const CHAPTER_COMPONENTS: Record<number, React.ComponentType> = {
  // ── FASE 1: Fundação ──
  1: dynamic(() => import('./Ch1Leadership')),
  2: dynamic(() => import('./Ch3ThreeM')),
  3: dynamic(() => import('./Ch10Strategy')),
  4: dynamic(() => import('./Ch14SevenS')),
  5: dynamic(() => import('./Ch13DecisionMaking')),
  // ── FASE 2: Finanças ──
  6: dynamic(() => import('./Ch2FinancialReporting')),
  7: dynamic(() => import('./Ch4CostVolumeProfit')),
  8: dynamic(() => import('./Ch5BusinessFinance')),
  9: dynamic(() => import('./Ch12EntrepreneurialFinance')),
  // ── FASE 3: Produto & Operações ──
  10: dynamic(() => import('./Ch7Operations')),
  11: dynamic(() => import('./Ch21LaunchReadiness')),
  12: dynamic(() => import('./Ch26OperatingCadences')),
  13: dynamic(() => import('./Ch27ActivityBasedCosting')),
  14: dynamic(() => import('./Ch28VarianceAnalysis')),
  // ── FASE 4: Go-To-Market ──
  15: dynamic(() => import('./Ch6Marketing')),
  16: dynamic(() => import('./Ch9Negotiations')),
  17: dynamic(() => import('./Ch17StartupMarketing')),
  18: dynamic(() => import('./Ch22PipelineForecast')),
  19: dynamic(() => import('./Ch23CustomerJourney')),
  20: dynamic(() => import('./Ch24GTMLaunchPlan')),
  21: dynamic(() => import('./Ch25RevenueDashboard')),
  22: dynamic(() => import('./Ch29PricingDecisions')),
  23: dynamic(() => import('./Ch30MarketingAudit')),
  // ── FASE 5: Pessoas & Cultura ──
  24: dynamic(() => import('./Ch8NineBox')),
  25: dynamic(() => import('./Ch11Ethics')),
  26: dynamic(() => import('./Ch15BlueOcean')),
  27: dynamic(() => import('./Ch16SCAMPER')),
  28: dynamic(() => import('./Ch18BalancedScorecard')),
  29: dynamic(() => import('./Ch19CAGE')),
};

export default function ChapterView({ chapterId }: { chapterId: number }) {
  const { state } = useMBA();
  const Comp = CHAPTER_COMPONENTS[chapterId];

  if (!Comp) {
    return (
      <div className="flex items-center justify-center h-full text-slate-400">
        <p>Chapter {chapterId} — coming soon</p>
      </div>
    );
  }

  return (
    <div className="chapter-content">
      <Comp />
    </div>
  );
}
