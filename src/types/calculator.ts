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
  tickers: string[]; // One or more selected stocks, each simulated independently
  windowYears: TimeWindow;
  initialInvestment: number;
  monthlyContribution: number;
  selicRateAnnual: number; // e.g. 10.75
  cagrOverrides: Record<string, number>; // Optional CAGR override per ticker
  reinvestDividends: boolean;
  applySelicTax: boolean;
}

export interface MonthlyDataPoint {
  month: number;
  monthLabel: string;
  yearLabel: string;
  dateLabel: string; // Calendar month/year, e.g. "set/2021"
  totalInvested: number;
  selicGross: number;
  selicNet: number;
  stocks: Record<string, number>; // Net portfolio value per ticker
}

export interface StockResult {
  ticker: string;
  name: string;
  color: string; // Series color used in charts and tables
  cagrAnnual: number;
  dividendYieldAnnual: number;
  finalGross: number;
  finalNet: number;
  netProfit: number;
  profitPercentage: number;
  totalDividends: number;
  diffVsSelic: number; // finalNet - selicFinalNet
  diffVsSelicPercentage: number;
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

  // Stock metrics, in selection order
  stocks: StockResult[];

  // Comparison metrics: best stock vs Selic
  winner: 'selic' | 'stock' | 'draw';
  bestStock: StockResult;
  winnerDifference: number;
  winnerPercentageDiff: number;
  stocksBeatingSelic: number;

  monthlyData: MonthlyDataPoint[];
}
