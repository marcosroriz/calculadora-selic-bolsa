import React from 'react';
import { getStockInfo } from '../data/stocksData';
import type { TimeWindow } from '../types/calculator';
import { Building2, PieChart, Info, TrendingUp } from 'lucide-react';

interface StockInfoCardProps {
  ticker: string;
  windowYears: TimeWindow;
}

export const StockInfoCard: React.FC<StockInfoCardProps> = ({ ticker, windowYears }) => {
  const stock = getStockInfo(ticker);

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl backdrop-blur-md flex flex-col gap-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-white shadow-lg text-lg"
            style={{ backgroundColor: stock.color }}
          >
            {stock.ticker.slice(0, 4)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-white">{stock.name}</h3>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                {stock.ticker}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-slate-500" />
              <span>Setor: {stock.sector}</span>
            </p>
          </div>
        </div>

        <span className="inline-flex items-center px-3 py-1 rounded-xl text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 self-start sm:self-auto">
          {stock.badge}
        </span>
      </div>

      {/* Description */}
      <div className="flex items-start gap-3 bg-slate-950/60 p-4 rounded-2xl border border-slate-800 text-xs text-slate-300 leading-relaxed">
        <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <p>{stock.description}</p>
      </div>

      {/* Historic Performance Window Grid */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
          <PieChart className="w-4 h-4 text-cyan-400" />
          Métricas Históricas por Janela ({windowYears} Anos Selecionados)
        </h4>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {([1, 2, 5, 10] as TimeWindow[]).map((w) => {
            const perf = stock.performance[w];
            const isSelected = w === windowYears;
            return (
              <div
                key={w}
                className={`p-3 rounded-2xl border text-center transition-all ${
                  isSelected
                    ? 'bg-emerald-500/15 border-emerald-500/60 ring-2 ring-emerald-500/20'
                    : 'bg-slate-950/50 border-slate-800'
                }`}
              >
                <span className="text-[11px] font-bold text-slate-400 block mb-1">
                  {w} {w === 1 ? 'Ano' : 'Anos'}
                </span>
                <div className="text-xs font-mono font-bold text-emerald-400 flex items-center justify-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  <span>{perf.cagr > 0 ? `+${perf.cagr.toFixed(1)}%` : `${perf.cagr.toFixed(1)}%`}</span>
                </div>
                <div className="text-[10px] font-mono text-cyan-400 mt-0.5">
                  DY: {perf.dividendYield.toFixed(1)}%
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
