import { describe, it, expect } from 'vitest';
import {
  toCents,
  fromCents,
  pct,
  currency,
  safeDivide,
  calcFinancialRatios,
  calcThreeM,
  calcCVP,
  calcNPV,
  calcStartupMetrics,
  calcVRIOImplication,
  calcBiasRisk,
  calcSevenSAlignment,
  calcCAGEFriction,
  calcBSCStatus
} from './math';

describe('Math Engine', () => {
  describe('toCents / fromCents', () => {
    it('should convert correctly', () => {
      expect(toCents(1.23)).toBe(123);
      expect(fromCents(123)).toBe(1.23);
      expect(toCents(0)).toBe(0);
      expect(fromCents(0)).toBe(0);
    });
  });

  describe('Formatting functions', () => {
    it('pct should format percentages', () => {
      expect(pct(0.1234)).toBe('12.3%');
      expect(pct(1)).toBe('100.0%');
      expect(pct(0)).toBe('0.0%');
    });

    it('currency should format euros', () => {
      // Different node versions might have slight differences in how they space euros,
      // but they should include € and the number.
      const formatted = currency(1234.56);
      expect(formatted).toMatch(/€/);
      expect(formatted).toMatch(/1/);
      expect(formatted).toMatch(/234/);
    });
  });

  describe('safeDivide', () => {
    it('should divide normally when denominator is not 0', () => {
      expect(safeDivide(10, 2)).toEqual({ value: 5, isInfinite: false });
    });

    it('should handle division by zero safely', () => {
      expect(safeDivide(10, 0)).toEqual({ value: Infinity, isInfinite: true });
    });
  });

  describe('Financial Ratios', () => {
    it('should calculate ratios correctly', () => {
      const stmt = {
        revenue: 1000,
        cogs: 400,
        operatingExpenses: 200,
        depreciation: 50,
        interest: 20,
        taxes: 30,
        sharesOutstanding: 100
      };

      const ratios = calcFinancialRatios(stmt);

      // gross profit = 1000 - 400 = 600
      expect(ratios.grossMargin).toBe(600 / 1000);

      // operating income = 600 - 200 - 50 = 350
      expect(ratios.operatingMargin).toBe(350 / 1000);

      // net income = 350 - 20 - 30 = 300
      expect(ratios.netMargin).toBe(300 / 1000);

      expect(ratios.eps).toBe(300 / 100);
      expect(ratios.roe).toBe(300 / 500); // netIncome / (revenue * 0.5)

      expect(ratios.currentRatio).toBe(2.0); // Hardcoded placeholder
      expect(ratios.debtToEquity).toBe(0.5); // Hardcoded placeholder
    });
  });

  describe('3M Score', () => {
    it('should calculate total score and recommendation', () => {
      const scores = {
        market: { size: 8, cagr: 7, acquisitionFriction: 3 }, // marketScore = (8 + 7 + 7) / 3 = 7.33
        management: { execution: 9, domainExpertise: 8 }, // managementScore = (9 + 8) / 2 = 8.5
        money: { capitalIntensity: 4, timeToProfitability: 5 } // moneyScore = (6 + 5) / 2 = 5.5
      };

      const res = calcThreeM(scores);
      expect(res.marketScore).toBeCloseTo(7.33, 2);
      expect(res.managementScore).toBe(8.5);
      expect(res.moneyScore).toBe(5.5);

      const expectedTotal = (7.333333333333333 + 8.5 + 5.5) / 3; // 7.11
      expect(res.totalScore).toBeCloseTo(expectedTotal, 2);
      expect(res.recommendation).toBe('Strong invest/launch signal');
    });

    it('should give proceed with caution recommendation', () => {
      const scores = {
        market: { size: 5, cagr: 5, acquisitionFriction: 5 }, // 5
        management: { execution: 5, domainExpertise: 5 }, // 5
        money: { capitalIntensity: 5, timeToProfitability: 5 } // 5
      };
      const res = calcThreeM(scores);
      expect(res.totalScore).toBe(5);
      expect(res.recommendation).toBe('Proceed with caution — address gaps');
    });

    it('should give reconsider recommendation', () => {
      const scores = {
        market: { size: 2, cagr: 2, acquisitionFriction: 8 }, // 2
        management: { execution: 2, domainExpertise: 2 }, // 2
        money: { capitalIntensity: 8, timeToProfitability: 8 } // 2
      };
      const res = calcThreeM(scores);
      expect(res.totalScore).toBe(2);
      expect(res.recommendation).toBe('Reconsider or pivot');
    });
  });

  describe('CVP Analysis', () => {
    it('should calculate break even correctly', () => {
      const res = calcCVP({
        sellingPrice: 100,
        variableCost: 40,
        fixedCost: 6000
      });

      // CM = 100 - 40 = 60
      expect(res.contributionMargin).toBe(60);

      // BE Units = 6000 / 60 = 100
      expect(res.breakEvenUnits).toBe(100);

      // BE Revenue = 100 * 100 = 10000
      expect(res.breakEvenRevenue).toBe(10000);

      expect(res.marginOfSafety).toBe(0.25); // Hardcoded placeholder
    });
  });

  describe('NPV / IRR', () => {
    it('should calculate NPV and simple IRR appropriately', () => {
      const input = {
        initialInvestment: 1000,
        cashFlows: [500, 500, 500],
        discountRate: 10
      };
      const res = calcNPV(input);

      // NPV: -1000 + 500/1.1 + 500/1.21 + 500/1.331 = -1000 + 454.54 + 413.22 + 375.66 = 243.43
      expect(res.npv).toBe(243.43);

      // IRR: roughly 23.38%
      expect(res.irr).toBeGreaterThan(20);
      expect(res.irr).toBeLessThan(25);

      // Payback period
      // Year 1: -500
      // Year 2: 0 -> payback period = 2
      expect(res.paybackPeriod).toBe(2);

      // PI: 1500 / 1000 = 1.5
      expect(res.profitabilityIndex).toBe(1.5);
    });
  });

  describe('Startup Metrics', () => {
    it('should calculate runway and LTV correctly', () => {
      const input = {
        seedInvestment: 100000,
        monthlyBurn: 15000,
        monthlyRevenue: 5000,
        growthRate: 10,
        churnRate: 5
      };

      const res = calcStartupMetrics(input);

      // Runway: 100000 / (15000 - 5000) = 10
      expect(res.runway).toBe(10);

      // ARPU = 5000 / max(1, 500) = 10
      // LTV = 10 / 0.05 = 200
      expect(res.ltv).toBe(200);

      // CAC = 50 (hardcoded)
      expect(res.cac).toBe(50);

      // LTV:CAC = 200 / 50 = 4
      expect(res.ltvCacRatio).toBe(4);

      // Break even month = runway (hardcoded currently)
      expect(res.breakEvenMonth).toBe(10);
    });

    it('should handle zero churn', () => {
      const input = {
        seedInvestment: 100000,
        monthlyBurn: 15000,
        monthlyRevenue: 5000,
        growthRate: 10,
        churnRate: 0
      };
      const res = calcStartupMetrics(input);
      expect(res.ltv).toBe(Infinity);
      expect(res.ltvCacRatio).toBe(Infinity);
    });
  });

  describe('VRIO Implication', () => {
    it('should determine competitive advantage correctly', () => {
      expect(calcVRIOImplication({ valuable: false, rare: true, inimitable: true, organized: true })).toBe('Competitive Disadvantage');
      expect(calcVRIOImplication({ valuable: true, rare: false, inimitable: true, organized: true })).toBe('Competitive Parity');
      expect(calcVRIOImplication({ valuable: true, rare: true, inimitable: false, organized: true })).toBe('Temporary Advantage');
      expect(calcVRIOImplication({ valuable: true, rare: true, inimitable: true, organized: false })).toBe('Temporary Advantage (unused)');
      expect(calcVRIOImplication({ valuable: true, rare: true, inimitable: true, organized: true })).toBe('Sustained Competitive Advantage');
    });
  });

  describe('Bias Risk', () => {
    it('should calculate risk correctly', () => {
      expect(calcBiasRisk({ a: false, b: false })).toEqual({ rating: 'Safe', count: 0 });
      expect(calcBiasRisk({ a: true, b: false })).toEqual({ rating: 'Moderate', count: 1 });
      expect(calcBiasRisk({ a: true, b: true, c: true, d: false })).toEqual({ rating: 'Moderate', count: 3 });
      expect(calcBiasRisk({ a: true, b: true, c: true, d: true })).toEqual({ rating: 'Critical', count: 4 });
    });
  });

  describe('7S Alignment', () => {
    it('should identify average alignment and weak nodes', () => {
      const input = {
        strategy: 5,
        structure: 4,
        systems: 3,
        sharedValues: 5,
        style: 2,
        staff: 4,
        skills: 5
      };
      const res = calcSevenSAlignment(input);
      expect(res.averageAlignment).toBe(28 / 7);
      expect(res.weakNodes).toEqual(['systems', 'style']);
    });
  });

  describe('CAGE Friction', () => {
    it('should calculate average CAGE friction', () => {
      const res = calcCAGEFriction({
        cultural: 8,
        administrative: 6,
        geographical: 4,
        economic: 7
      });
      // avg = 25 / 4 = 6.25 -> rounded = 6.3
      expect(res).toBe(6.3);
    });
  });

  describe('BSC Status', () => {
    it('should count statuses correctly', () => {
      const items = [
        { status: 'on_track' },
        { status: 'on_track' },
        { status: 'at_risk' },
        { status: 'delayed' },
        { status: 'done' }
      ];

      const res = calcBSCStatus(items);
      expect(res.onTrack).toBe(2);
      expect(res.atRisk).toBe(1);
      expect(res.delayed).toBe(1);
      expect(res.total).toBe(5);
    });
  });
});
