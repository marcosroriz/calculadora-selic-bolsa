import type {
  CalculationInput,
  CalculationResult,
  MonthlyDataPoint,
  StockItem,
  StockResult,
} from '../types/calculator';
import { getStockInfo } from '../data/stocksData';

/**
 * Calculates Income Tax rate for Selic (Fixed Income Regressive Tax Table in Brazil)
 * - Up to 180 days (6 months): 22.5%
 * - 181 to 360 days (12 months): 20.0%
 * - 361 to 720 days (24 months): 17.5%
 * - Over 720 days (>24 months): 15.0%
 */
export function getSelicTaxRate(totalMonths: number): number {
  const days = totalMonths * 30;
  if (days <= 180) return 0.225;
  if (days <= 360) return 0.20;
  if (days <= 720) return 0.175;
  return 0.15;
}

/**
 * Format BRL Currency (R$ 10.000,00)
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(value);
}

/**
 * Format Percentages (10,50%)
 */
export function formatPercent(value: number, decimals: number = 2): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value / 100);
}

export const MAX_SELECTED_STOCKS = 5;

// Distinct series colors for the dark theme (Selic uses cyan, invested uses slate)
export const STOCK_SERIES_COLORS = ['#10b981', '#a78bfa', '#f472b6', '#fb923c', '#facc15'];

const round2 = (value: number) => Math.round(value * 100) / 100;
const percentOf = (value: number, base: number) => (base > 0 ? (value / base) * 100 : 0);

const MONTH_NAMES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

// Calendar label for month m of a simulation that started at startDate, e.g. "set/2021"
function formatMonthYear(startDate: Date, m: number) {
  const date = new Date(startDate.getFullYear(), startDate.getMonth() + m, 1);
  return `${MONTH_NAMES[date.getMonth()]}/${date.getFullYear()}`;
}

function monthLabels(m: number, startDate: Date) {
  const dateLabel = formatMonthYear(startDate, m);
  if (m === 0) return { monthLabel: 'Início', yearLabel: '0 ano', dateLabel };
  const yearNumber = Math.floor(m / 12);
  const yearLabel = m % 12 === 0 ? `${yearNumber} ano${yearNumber > 1 ? 's' : ''}` : `Mês ${m}`;
  return { monthLabel: `Mês ${m}`, yearLabel, dateLabel };
}

/**
 * Simulates the Selic path month by month. Returns net balance per month (index = month).
 */
function simulateSelic(input: CalculationInput, totalMonths: number) {
  // Selic monthly rate: (1 + R_annual)^(1/12) - 1
  const selicMonthlyRate = Math.pow(1 + input.selicRateAnnual / 100, 1 / 12) - 1;

  let gross = input.initialInvestment;
  let invested = input.initialInvestment;
  const grossByMonth = [gross];
  const netByMonth = [gross];
  const investedByMonth = [invested];

  for (let m = 1; m <= totalMonths; m++) {
    // Yield on existing balance, then monthly contribution at month end
    gross = gross * (1 + selicMonthlyRate) + input.monthlyContribution;
    invested += input.monthlyContribution;

    // Regressive tax on profit if redeemed at this month
    const profit = Math.max(0, gross - invested);
    const tax = input.applySelicTax ? profit * getSelicTaxRate(m) : 0;

    grossByMonth.push(gross);
    netByMonth.push(gross - tax);
    investedByMonth.push(invested);
  }

  return { grossByMonth, netByMonth, investedByMonth };
}

/**
 * Simulates one stock month by month. Returns net value per month (index = month).
 */
function simulateStock(input: CalculationInput, stockInfo: StockItem, totalMonths: number) {
  const windowPerf = stockInfo.performance[input.windowYears] || stockInfo.performance[5];
  const cagrAnnual = input.cagrOverrides[stockInfo.ticker] ?? windowPerf.cagr;
  const dividendYieldAnnual = windowPerf.dividendYield;

  // Stock price monthly appreciation rate and monthly dividend rate
  const monthlyAppreciation = Math.pow(1 + Math.max(-99, cagrAnnual) / 100, 1 / 12) - 1;
  const monthlyDivRate = dividendYieldAnnual / 100 / 12;

  let priceBalance = input.initialInvestment; // Value of shares held
  let dividendsCash = 0; // Accumulated dividends if not reinvested
  let dividendsTotal = 0; // All dividends earned (reinvested or not)
  const netByMonth = [priceBalance];

  for (let m = 1; m <= totalMonths; m++) {
    priceBalance *= 1 + monthlyAppreciation;

    const dividend = priceBalance * monthlyDivRate;
    dividendsTotal += dividend;
    if (input.reinvestDividends) {
      priceBalance += dividend;
    } else {
      dividendsCash += dividend;
    }

    // Monthly contribution buys more shares
    priceBalance += input.monthlyContribution;

    // Dividends are tax-exempt in Brazil; buy & hold under the monthly sales limit is exempt too,
    // so net value is the total gross value.
    netByMonth.push(priceBalance + dividendsCash);
  }

  return { netByMonth, cagrAnnual, dividendYieldAnnual, dividendsTotal };
}

/**
 * Main Calculation Engine: Selic vs each selected stock, all with the same contributions.
 */
export function calculateComparison(input: CalculationInput): CalculationResult {
  const totalMonths = input.windowYears * 12;
  const tickers = input.tickers.length > 0 ? input.tickers : ['PETR4'];

  // Historical windows end at the current month, so the simulation starts N years ago
  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth() - totalMonths, 1);

  const selic = simulateSelic(input, totalMonths);
  const totalInvested = selic.investedByMonth[totalMonths];

  const selicFinalGross = selic.grossByMonth[totalMonths];
  const selicFinalNet = selic.netByMonth[totalMonths];
  const selicTaxRateApplied = getSelicTaxRate(totalMonths);
  const selicTaxPaid = selicFinalGross - selicFinalNet;
  const selicNetProfit = selicFinalNet - totalInvested;

  const simulations = tickers.map((ticker, index) => {
    const info = getStockInfo(ticker);
    return { info, color: STOCK_SERIES_COLORS[index % STOCK_SERIES_COLORS.length], ...simulateStock(input, info, totalMonths) };
  });

  const stocks: StockResult[] = simulations.map((sim) => {
    const finalNet = sim.netByMonth[totalMonths];
    const netProfit = finalNet - totalInvested;
    const diffVsSelic = finalNet - selicFinalNet;
    return {
      ticker: sim.info.ticker,
      name: sim.info.name,
      color: sim.color,
      cagrAnnual: sim.cagrAnnual,
      dividendYieldAnnual: sim.dividendYieldAnnual,
      finalGross: round2(finalNet),
      finalNet: round2(finalNet),
      netProfit: round2(netProfit),
      profitPercentage: round2(percentOf(netProfit, totalInvested)),
      totalDividends: round2(sim.dividendsTotal),
      diffVsSelic: round2(diffVsSelic),
      diffVsSelicPercentage:
        Math.min(finalNet, selicFinalNet) > 0
          ? round2((Math.abs(diffVsSelic) / Math.min(finalNet, selicFinalNet)) * 100)
          : 0,
    };
  });

  const monthlyData: MonthlyDataPoint[] = [];
  for (let m = 0; m <= totalMonths; m++) {
    monthlyData.push({
      month: m,
      ...monthLabels(m, startDate),
      totalInvested: round2(selic.investedByMonth[m]),
      selicGross: round2(selic.grossByMonth[m]),
      selicNet: round2(selic.netByMonth[m]),
      stocks: Object.fromEntries(simulations.map((sim) => [sim.info.ticker, round2(sim.netByMonth[m])])),
    });
  }

  // Winner logic: best stock vs Selic
  const bestStock = stocks.reduce((best, s) => (s.finalNet > best.finalNet ? s : best), stocks[0]);
  let winner: 'selic' | 'stock' | 'draw' = 'draw';
  if (Math.abs(bestStock.diffVsSelic) >= 1.0) {
    winner = bestStock.diffVsSelic > 0 ? 'stock' : 'selic';
  }

  return {
    totalMonths,
    totalInvested: round2(totalInvested),

    selicFinalGross: round2(selicFinalGross),
    selicFinalNet: round2(selicFinalNet),
    selicNetProfit: round2(selicNetProfit),
    selicProfitPercentage: round2(percentOf(selicNetProfit, totalInvested)),
    selicTaxPaid: round2(selicTaxPaid),
    selicTaxRateApplied: selicTaxRateApplied * 100,

    stocks,

    winner,
    bestStock,
    winnerDifference: Math.abs(bestStock.diffVsSelic),
    winnerPercentageDiff: bestStock.diffVsSelicPercentage,
    stocksBeatingSelic: stocks.filter((s) => s.diffVsSelic >= 1.0).length,

    monthlyData,
  };
}
