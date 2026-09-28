import type {
  CalculationInput,
  CalculationResult,
  MonthlyDataPoint,
  StockItem,
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

/**
 * Main Calculation Engine
 */
export function calculateComparison(input: CalculationInput): CalculationResult {
  const stockInfo: StockItem = getStockInfo(input.ticker);
  const totalMonths = input.windowYears * 12;

  // Get effective CAGR and Dividend Yield based on selected window or custom overrides
  const windowPerf = stockInfo.performance[input.windowYears] || stockInfo.performance[5];
  const stockCagrAnnual = input.customStockCagr ?? windowPerf.cagr;
  const stockDivYieldAnnual = input.customDividendYield ?? windowPerf.dividendYield;

  // Monthly Interest Rates
  // Selic monthly rate: (1 + R_annual)^(1/12) - 1
  const selicMonthlyRate = Math.pow(1 + input.selicRateAnnual / 100, 1 / 12) - 1;

  // Stock price monthly appreciation rate
  const stockMonthlyAppreciation = Math.pow(1 + Math.max(-99, stockCagrAnnual) / 100, 1 / 12) - 1;
  
  // Stock monthly dividend rate
  const stockMonthlyDivRate = (stockDivYieldAnnual / 100) / 12;

  let currentTotalInvested = input.initialInvestment;
  
  // Selic Tracking
  let selicGrossBalance = input.initialInvestment;

  // Stock Tracking
  let stockPriceBalance = input.initialInvestment; // Principal invested in stock share value
  let stockDividendsCash = 0; // Accumulated dividends if not reinvested
  let stockDividendsTotal = 0; // All dividends earned (reinvested or not)

  const monthlyData: MonthlyDataPoint[] = [];

  // Initial Month 0 / Start
  const selicTaxRateInitial = getSelicTaxRate(0);
  const selicInitialProfit = Math.max(0, selicGrossBalance - currentTotalInvested);
  const selicInitialNet = selicGrossBalance - (input.applySelicTax ? selicInitialProfit * selicTaxRateInitial : 0);

  monthlyData.push({
    month: 0,
    monthLabel: 'Início',
    yearLabel: '0 ano',
    totalInvested: currentTotalInvested,
    selicGross: Math.round(selicGrossBalance * 100) / 100,
    selicNet: Math.round(selicInitialNet * 100) / 100,
    stockGross: Math.round(stockPriceBalance * 100) / 100,
    stockNet: Math.round(stockPriceBalance * 100) / 100,
    stockDividendsAccumulated: 0,
  });

  // Calculate month by month
  for (let m = 1; m <= totalMonths; m++) {
    // 1. Selic Growth
    // Yield on existing balance
    selicGrossBalance = selicGrossBalance * (1 + selicMonthlyRate);
    // Add monthly contribution at month end
    selicGrossBalance += input.monthlyContribution;

    // 2. Stock Growth
    // Price appreciation on existing stock portfolio
    stockPriceBalance = stockPriceBalance * (1 + stockMonthlyAppreciation);

    // Dividends generated this month based on portfolio value
    const monthDividendEarned = stockPriceBalance * stockMonthlyDivRate;
    stockDividendsTotal += monthDividendEarned;

    if (input.reinvestDividends) {
      // Reinvest dividend back into buying more shares
      stockPriceBalance += monthDividendEarned;
    } else {
      // Accumulate dividend in cash
      stockDividendsCash += monthDividendEarned;
    }

    // Add monthly contribution to buy more shares
    stockPriceBalance += input.monthlyContribution;

    // Track total capital invested
    currentTotalInvested += input.monthlyContribution;

    // Current Selic Net calculation (Regressive Tax)
    const currentTaxRate = getSelicTaxRate(m);
    const selicProfit = Math.max(0, selicGrossBalance - currentTotalInvested);
    const selicTaxPaid = input.applySelicTax ? selicProfit * currentTaxRate : 0;
    const selicNetBalance = selicGrossBalance - selicTaxPaid;

    // Stock Net calculation (Total value = stock share value + dividends accumulated)
    const stockTotalGrossValue = stockPriceBalance + stockDividendsCash;
    // Dividends are tax-exempt in Brazil. Capital gain tax (15% if applicable, or 0% for long term exempt < R$20k/mo)
    // We treat stock net as total value since buy & hold under limit is tax exempt, or light capital tax.
    const stockNetBalance = stockTotalGrossValue;

    const yearNumber = Math.floor(m / 12);
    const monthInYear = m % 12;
    const monthLabel = `Mês ${m}`;
    const yearLabel = monthInYear === 0 ? `${yearNumber} ano${yearNumber > 1 ? 's' : ''}` : `Mês ${m}`;

    monthlyData.push({
      month: m,
      monthLabel,
      yearLabel,
      totalInvested: Math.round(currentTotalInvested * 100) / 100,
      selicGross: Math.round(selicGrossBalance * 100) / 100,
      selicNet: Math.round(selicNetBalance * 100) / 100,
      stockGross: Math.round(stockTotalGrossValue * 100) / 100,
      stockNet: Math.round(stockNetBalance * 100) / 100,
      stockDividendsAccumulated: Math.round(stockDividendsTotal * 100) / 100,
    });
  }

  // Final Results
  const selicFinalGross = selicGrossBalance;
  const selicTaxRateApplied = getSelicTaxRate(totalMonths);
  const selicProfitGross = Math.max(0, selicFinalGross - currentTotalInvested);
  const selicTaxPaid = input.applySelicTax ? selicProfitGross * selicTaxRateApplied : 0;
  const selicFinalNet = selicFinalGross - selicTaxPaid;
  const selicNetProfit = selicFinalNet - currentTotalInvested;
  const selicProfitPercentage = (selicNetProfit / currentTotalInvested) * 100;

  const stockFinalGross = stockPriceBalance + stockDividendsCash;
  const stockFinalNet = stockFinalGross; // dividends exempt in BR
  const stockNetProfit = stockFinalNet - currentTotalInvested;
  const stockProfitPercentage = (stockNetProfit / currentTotalInvested) * 100;

  // Winner logic
  let winner: 'selic' | 'stock' | 'draw' = 'draw';
  const diff = Math.abs(stockFinalNet - selicFinalNet);
  
  if (Math.abs(stockFinalNet - selicFinalNet) < 1.0) {
    winner = 'draw';
  } else if (stockFinalNet > selicFinalNet) {
    winner = 'stock';
  } else {
    winner = 'selic';
  }

  const minVal = Math.min(stockFinalNet, selicFinalNet);
  const winnerPercentageDiff = minVal > 0 ? (diff / minVal) * 100 : 0;

  return {
    totalMonths,
    totalInvested: Math.round(currentTotalInvested * 100) / 100,

    selicFinalGross: Math.round(selicFinalGross * 100) / 100,
    selicFinalNet: Math.round(selicFinalNet * 100) / 100,
    selicNetProfit: Math.round(selicNetProfit * 100) / 100,
    selicProfitPercentage: Math.round(selicProfitPercentage * 100) / 100,
    selicTaxPaid: Math.round(selicTaxPaid * 100) / 100,
    selicTaxRateApplied: selicTaxRateApplied * 100,

    stockFinalGross: Math.round(stockFinalGross * 100) / 100,
    stockFinalNet: Math.round(stockFinalNet * 100) / 100,
    stockNetProfit: Math.round(stockNetProfit * 100) / 100,
    stockProfitPercentage: Math.round(stockProfitPercentage * 100) / 100,
    stockTotalDividends: Math.round(stockDividendsTotal * 100) / 100,
    stockTaxPaid: 0,

    winner,
    winnerDifference: Math.round(diff * 100) / 100,
    winnerPercentageDiff: Math.round(winnerPercentageDiff * 100) / 100,

    monthlyData,
  };
}
