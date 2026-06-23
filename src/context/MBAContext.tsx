'use client';
import React, { createContext, useContext, useState, useCallback } from 'react';
import type { MBAState } from '@/types/mba';
import { DEFAULT_MBA_STATE, BLANK_MBA_STATE } from '@/types/mba';

interface MBAContextType {
  state: MBAState;
  updateChapter: <K extends keyof MBAState>(chapter: K, data: Partial<MBAState[K]>) => void;
  resetToExample: () => void;
  resetToBlank: () => void;
  getDashboardSnapshot: () => Record<string, any>;
  isBlank: boolean;
}

const MBAContext = createContext<MBAContextType | null>(null);

export function MBAProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<MBAState>(DEFAULT_MBA_STATE);
  const [isBlank, setIsBlank] = useState(false);

  const updateChapter = useCallback(<K extends keyof MBAState>(chapter: K, data: Partial<MBAState[K]>) => {
    setState(prev => ({
      ...prev,
      [chapter]: { ...prev[chapter], ...data },
    }));
  }, []);

  const resetToExample = useCallback(() => {
    setState(DEFAULT_MBA_STATE);
    setIsBlank(false);
  }, []);

  const resetToBlank = useCallback(() => {
    setState(BLANK_MBA_STATE);
    setIsBlank(true);
  }, []);

  const getDashboardSnapshot = useCallback((): Record<string, any> => {
    return {
      financialRatios: state.chapter2.ratios,
      breakEven: state.chapter4.result?.breakEvenUnits,
      npv: state.chapter5.result?.npv,
      ltvCac: state.chapter12.metrics?.ltvCacRatio,
      vrioAssets: state.chapter10.assets.map(a => ({ name: a.name, implication: calcVrio(a) })),
      biasRisk: state.chapter13.risk,
      bscStatus: {
        onTrack: state.chapter18.scorecard.filter(i => i.status === 'on_track').length,
        atRisk: state.chapter18.scorecard.filter(i => i.status === 'at_risk').length,
        delayed: state.chapter18.scorecard.filter(i => i.status === 'delayed').length,
      },
      cageFriction: state.chapter19.frictionIndex,
    };
  }, [state]);

  return (
    <MBAContext.Provider value={{ state, updateChapter, resetToExample, resetToBlank, getDashboardSnapshot, isBlank }}>
      {children}
    </MBAContext.Provider>
  );
}

function calcVrio(a: { valuable: boolean; rare: boolean; inimitable: boolean; organized: boolean }): string {
  if (!a.valuable) return 'Disadvantage';
  if (!a.rare) return 'Parity';
  if (!a.inimitable) return 'Temp. Advantage';
  if (!a.organized) return 'Temp. Adv. (unused)';
  return 'Sustained Advantage';
}

export function useMBA(): MBAContextType {
  const ctx = useContext(MBAContext);
  if (!ctx) throw new Error('useMBA must be used within MBAProvider');
  return ctx;
}
