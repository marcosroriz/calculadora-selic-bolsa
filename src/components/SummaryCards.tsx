import React from 'react';
import type { CalculationResult } from '../types/calculator';
import { formatCurrency } from '../utils/financeCalculations';
import { Wallet, TrendingUp, ShieldCheck, DollarSign, PiggyBank, ArrowUpRight } from 'lucide-react';

interface SummaryCardsProps {
  result: CalculationResult;
  stockTicker: string;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ result, stockTicker }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      
      {/* Card 1: Valor Total Investido */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl backdrop-blur-md flex flex-col justify-between relative overflow-hidden group hover:border-slate-700 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Total Investido
          </span>
          <div className="w-10 h-10 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
            <Wallet className="w-5 h-5 text-slate-400" />
          </div>
        </div>

        <div className="mt-4">
          <span className="text-2xl sm:text-3xl font-mono font-extrabold text-white block">
            {formatCurrency(result.totalInvested)}
          </span>
          <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
            <PiggyBank className="w-3.5 h-3.5 text-slate-500" />
            <span>Do seu bolso em {result.totalMonths} meses</span>
          </p>
        </div>
      </div>

      {/* Card 2: Rendimento Selic (Líquido) */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl backdrop-blur-md flex flex-col justify-between relative overflow-hidden group hover:border-cyan-500/30 transition-all">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Selic Líquida
            </span>
            <span className="text-[10px] bg-cyan-500/10 text-cyan-400 px-1.5 py-0.5 rounded font-mono">
              -IR {result.selicTaxRateApplied}%
            </span>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="mt-4">
          <span className="text-2xl sm:text-3xl font-mono font-extrabold text-cyan-400 block">
            {formatCurrency(result.selicFinalNet)}
          </span>
          <div className="flex items-center justify-between text-xs mt-1">
            <span className="text-slate-400">Lucro Líquido:</span>
            <span className="font-mono font-bold text-cyan-300">
              +{formatCurrency(result.selicNetProfit)} ({result.selicProfitPercentage.toFixed(1)}%)
            </span>
          </div>
        </div>
      </div>

      {/* Card 3: Rendimento Ação (Líquido) */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl backdrop-blur-md flex flex-col justify-between relative overflow-hidden group hover:border-emerald-500/30 transition-all">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Ação {stockTicker}
            </span>
            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded font-mono">
              Isento IR
            </span>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        <div className="mt-4">
          <span className="text-2xl sm:text-3xl font-mono font-extrabold text-emerald-400 block">
            {formatCurrency(result.stockFinalNet)}
          </span>
          <div className="flex items-center justify-between text-xs mt-1">
            <span className="text-slate-400">Lucro Líquido:</span>
            <span className="font-mono font-bold text-emerald-300">
              +{formatCurrency(result.stockNetProfit)} ({result.stockProfitPercentage.toFixed(1)}%)
            </span>
          </div>
        </div>
      </div>

      {/* Card 4: Comparativo / Lucro Extra */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl backdrop-blur-md flex flex-col justify-between relative overflow-hidden group hover:border-purple-500/30 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Diferença de Retorno
          </span>
          <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="mt-4">
          <span
            className={`text-2xl sm:text-3xl font-mono font-extrabold block ${
              result.winner === 'stock'
                ? 'text-emerald-400'
                : result.winner === 'selic'
                ? 'text-amber-400'
                : 'text-slate-300'
            }`}
          >
            {formatCurrency(result.winnerDifference)}
          </span>
          <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5 text-purple-400" />
            <span>
              {result.winner === 'stock'
                ? `${stockTicker} rendeu ${result.winnerPercentageDiff.toFixed(1)}% a mais que Selic`
                : result.winner === 'selic'
                ? `Selic rendeu ${result.winnerPercentageDiff.toFixed(1)}% a mais que ${stockTicker}`
                : 'Performance idêntica'}
            </span>
          </p>
        </div>
      </div>

    </div>
  );
};
