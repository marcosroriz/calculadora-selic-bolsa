import React, { useEffect } from 'react';
import type { CalculationResult } from '../types/calculator';
import { Trophy, ShieldAlert, Award, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { formatCurrency } from '../utils/financeCalculations';
import confetti from 'canvas-confetti';

interface WinnerBannerProps {
  result: CalculationResult;
}

export const WinnerBanner: React.FC<WinnerBannerProps> = ({ result }) => {
  const best = result.bestStock;
  const stockTicker = best.ticker;
  const totalStocks = result.stocks.length;
  const isStockWinner = result.winner === 'stock';
  const isSelicWinner = result.winner === 'selic';

  useEffect(() => {
    if (isStockWinner) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10b981', '#06b6d4', '#3b82f6'],
        });
      } catch (e) {
        // ignore if confetti fails
      }
    }
  }, [result.winner, stockTicker, result.totalInvested]);

  return (
    <div
      className={`w-full rounded-3xl p-6 sm:p-8 border shadow-2xl relative overflow-hidden transition-all ${
        isStockWinner
          ? 'bg-gradient-to-r from-emerald-950/80 via-slate-900 to-cyan-950/80 border-emerald-500/40 shadow-emerald-500/10'
          : isSelicWinner
          ? 'bg-gradient-to-r from-amber-950/80 via-slate-900 to-slate-900 border-amber-500/40 shadow-amber-500/10'
          : 'bg-slate-900 border-slate-700'
      }`}
    >
      {/* Background glow overlay */}
      <div
        className={`absolute -right-12 -bottom-12 w-64 h-64 rounded-full blur-3xl pointer-events-none ${
          isStockWinner ? 'bg-emerald-500/15' : isSelicWinner ? 'bg-amber-500/15' : 'bg-slate-700/10'
        }`}
      />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Left Info */}
        <div className="flex items-center gap-4 text-center md:text-left">
          <div
            className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 shadow-xl ${
              isStockWinner
                ? 'bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 shadow-emerald-500/30'
                : isSelicWinner
                ? 'bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 shadow-amber-500/30'
                : 'bg-slate-800 text-slate-300'
            }`}
          >
            {isStockWinner ? (
              <Trophy className="w-8 h-8" />
            ) : isSelicWinner ? (
              <ShieldAlert className="w-8 h-8" />
            ) : (
              <Award className="w-8 h-8" />
            )}
          </div>

          <div>
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="text-xs uppercase font-extrabold tracking-widest text-slate-400">
                Resultado do Confronto
              </span>
              <span
                className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                  isStockWinner
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : isSelicWinner
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-slate-800 text-slate-300 border-slate-700'
                }`}
              >
                {isStockWinner
                  ? `Vencedor: Ação ${stockTicker}`
                  : isSelicWinner
                  ? 'Vencedor: Taxa Selic'
                  : 'Empate Técnico'}
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              {isStockWinner ? (
                <>
                  <span className="text-emerald-400">{stockTicker}</span> superou a Selic por{' '}
                  <span className="text-cyan-400">{formatCurrency(result.winnerDifference)}</span>
                </>
              ) : isSelicWinner ? (
                <>
                  <span className="text-amber-400">Selic</span> superou a ação {stockTicker} por{' '}
                  <span className="text-amber-300">{formatCurrency(result.winnerDifference)}</span>
                </>
              ) : (
                'Rendimentos praticamente idênticos'
              )}
            </h3>

            {totalStocks > 1 && (
              <p className="text-xs font-semibold text-slate-200 mt-1">
                {result.stocksBeatingSelic} de {totalStocks} ações selecionadas superaram a Selic
                {' '}— melhor ação: <span style={{ color: best.color }}>{stockTicker}</span>
              </p>
            )}

            <p className="text-xs text-slate-300 mt-1">
              {isStockWinner
                ? `Investindo em ${stockTicker} você teria obtido um retorno ${result.winnerPercentageDiff.toFixed(
                    1
                  )}% maior do que na taxa Selic no período.`
                : isSelicWinner
                ? `A estabilidade da Selic superou a ação ${stockTicker} em ${result.winnerPercentageDiff.toFixed(
                    1
                  )}% no intervalo analisado.`
                : 'Ambas as opções apresentaram rentabilidade equivalente.'}
            </p>
          </div>
        </div>

        {/* Right Metric Quick Compare Pills */}
        <div className="flex items-center gap-3 shrink-0">
          
          {/* Stock Box */}
          <div
            className={`p-4 rounded-2xl border text-center transition-all ${
              isStockWinner
                ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300 ring-2 ring-emerald-500/20'
                : 'bg-slate-900/60 border-slate-800 text-slate-300'
            }`}
          >
            <span className="text-[11px] font-semibold text-slate-400 block">
              {totalStocks > 1 ? `Melhor: ${stockTicker}` : `${stockTicker} Líquido`}
            </span>
            <span className="text-lg font-mono font-extrabold" style={{ color: best.color }}>
              {formatCurrency(best.finalNet)}
            </span>
            <div className="flex items-center justify-center gap-1 text-[11px] font-bold mt-0.5" style={{ color: best.color }}>
              <ArrowUpRight className="w-3 h-3" />
              <span>{best.profitPercentage >= 0 ? '+' : ''}{best.profitPercentage.toFixed(1)}%</span>
            </div>
          </div>

          <span className="text-slate-600 font-bold text-xs">VS</span>

          {/* Selic Box */}
          <div
            className={`p-4 rounded-2xl border text-center transition-all ${
              isSelicWinner
                ? 'bg-amber-950/60 border-amber-500/50 text-amber-300 ring-2 ring-amber-500/20'
                : 'bg-slate-900/60 border-slate-800 text-slate-300'
            }`}
          >
            <span className="text-[11px] font-semibold text-slate-400 block">Selic Líquida</span>
            <span className="text-lg font-mono font-extrabold text-cyan-400">
              {formatCurrency(result.selicFinalNet)}
            </span>
            <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-cyan-400 mt-0.5">
              <CheckCircle2 className="w-3 h-3" />
              <span>+{result.selicProfitPercentage.toFixed(1)}%</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
