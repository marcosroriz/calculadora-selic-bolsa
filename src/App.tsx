import { useState, useMemo } from 'react';
import type { CalculationInput } from './types/calculator';
import { calculateComparison } from './utils/financeCalculations';
import { Header } from './components/Header';
import { InputPanel } from './components/InputPanel';
import { WinnerBanner } from './components/WinnerBanner';
import { SummaryCards } from './components/SummaryCards';
import { ComparisonChart } from './components/ComparisonChart';
import { StockInfoCard } from './components/StockInfoCard';
import { BreakdownTable } from './components/BreakdownTable';
import { Footer } from './components/Footer';

export function App() {
  const initialDefaultInput: CalculationInput = {
    ticker: 'PETR4',
    windowYears: 5,
    initialInvestment: 10000,
    monthlyContribution: 500,
    selicRateAnnual: 10.75,
    reinvestDividends: true,
    applySelicTax: true,
  };

  const [input, setInput] = useState<CalculationInput>(initialDefaultInput);

  // Compute metrics automatically on state change
  const result = useMemo(() => {
    return calculateComparison(input);
  }, [input]);

  const handleReset = () => {
    setInput(initialDefaultInput);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Top Header */}
      <Header />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
        
        {/* 1. Winner Banner */}
        <WinnerBanner result={result} stockTicker={input.ticker} />

        {/* 2. Summary Metric Cards */}
        <SummaryCards result={result} stockTicker={input.ticker} />

        {/* 3. Input Controls Panel */}
        <InputPanel
          input={input}
          onChange={setInput}
          onReset={handleReset}
        />

        {/* 4. Interactive Wealth Evolution Chart */}
        <ComparisonChart result={result} stockTicker={input.ticker} />

        {/* 5. Detailed Stock Info & Breakdown Table Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-1">
            <StockInfoCard ticker={input.ticker} windowYears={input.windowYears} />
          </div>
          <div className="lg:col-span-2">
            <BreakdownTable result={result} stockTicker={input.ticker} />
          </div>
        </div>

      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
