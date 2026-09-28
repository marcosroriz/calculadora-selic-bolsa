export type TimeWindow = 1 | 2 | 5 | 10;

export interface StockPeriodPerformance {
  cagr: number; // Annual price appreciation percentage (e.g. 15.5 = 15.5%)
  dividendYield: number; // Annual dividend yield percentage (e.g. 6.2 = 6.2%)
}

export interface StockItem {
  ticker: string;
  name: string;
  sector: string;
  description: string;
  color: string;
  badge: string;
  // Performance for each window: 1y, 2y, 5y, 10y
  performance: {
    1: StockPeriodPerformance;
    2: StockPeriodPerformance;
    5: StockPeriodPerformance;
    10: StockPeriodPerformance;
  };
}

export interface CalculationInput {
  ticker: string;
  windowYears: TimeWindow;
  initialInvestment: number;
  monthlyContribution: number;
  selicRateAnnual: number; // e.g. 10.75
  customStockCagr?: number;
  customDividendYield?: number;
  reinvestDividends: boolean;
  applySelicTax: boolean;
}

export interface MonthlyDataPoint {
  month: number;
  monthLabel: string;
  yearLabel: string;
  totalInvested: number;
  selicGross: number;
  selicNet: number;
  stockGross: number;
  stockNet: number;
  stockDividendsAccumulated: number;
}

export interface CalculationResult {
  totalMonths: number;
  totalInvested: number;
  
  // Selic metrics
  selicFinalGross: number;
  selicFinalNet: number;
  selicNetProfit: number;
  selicProfitPercentage: number;
  selicTaxPaid: number;
  selicTaxRateApplied: number;
  
  // Stock metrics
  stockFinalGross: number;
  stockFinalNet: number;
  stockNetProfit: number;
  stockProfitPercentage: number;
  stockTotalDividends: number;
  stockTaxPaid: number;
  
  // Comparison metrics
  winner: 'selic' | 'stock' | 'draw';
  winnerDifference: number;
  winnerPercentageDiff: number;
  
  monthlyData: MonthlyDataPoint[];
}
