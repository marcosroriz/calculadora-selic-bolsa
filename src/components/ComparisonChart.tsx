import React, { useState } from 'react';
import type { CalculationResult } from '../types/calculator';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { formatCurrency } from '../utils/financeCalculations';
import { LineChart as LineChartIcon } from 'lucide-react';

interface ComparisonChartProps {
  result: CalculationResult;
  stockTicker: string;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-950/95 border border-slate-700/80 p-4 rounded-2xl shadow-2xl backdrop-blur-xl text-xs flex flex-col gap-2 min-w-[220px]">
        <div className="font-bold text-white border-b border-slate-800 pb-1.5 flex justify-between items-center">
          <span>{data.monthLabel}</span>
          <span className="text-slate-400 font-mono text-[11px]">{data.yearLabel}</span>
        </div>

        <div className="flex justify-between items-center text-slate-300">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-500 inline-block" />
            Investido:
          </span>
          <span className="font-mono font-bold text-slate-200">
            {formatCurrency(data.totalInvested)}
          </span>
        </div>

        <div className="flex justify-between items-center text-cyan-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block" />
            Selic (Líquida):
          </span>
          <span className="font-mono font-bold">{formatCurrency(data.selicNet)}</span>
        </div>

        <div className="flex justify-between items-center text-emerald-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
            Ação ({data.ticker || 'B3'}):
          </span>
          <span className="font-mono font-bold">{formatCurrency(data.stockNet)}</span>
        </div>

        <div className="mt-1 pt-1.5 border-t border-slate-800 text-[11px] text-slate-400 flex justify-between">
          <span>Lucro Ação vs Selic:</span>
          <span className={`font-mono font-bold ${data.stockNet >= data.selicNet ? 'text-emerald-400' : 'text-amber-400'}`}>
            {data.stockNet >= data.selicNet ? '+' : ''}{formatCurrency(data.stockNet - data.selicNet)}
          </span>
        </div>
      </div>
    );
  }
  return null;
};

export const ComparisonChart: React.FC<ComparisonChartProps> = ({ result, stockTicker }) => {
  const [chartType, setChartType] = useState<'area' | 'line'>('area');

  // Filter data for cleaner x-axis if total months > 24
  const chartData = result.monthlyData.map((d) => ({
    ...d,
    ticker: stockTicker,
  }));

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md flex flex-col gap-6">
      
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <LineChartIcon className="w-5 h-5 text-emerald-400" />
            Evolução do Patrimônio ao Longo do Tempo
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Comparativo mês a mês do acúmulo de capital: Total Investido vs Selic vs Ação {stockTicker}
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-950/60 p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setChartType('area')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              chartType === 'area'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Área
          </button>
          <button
            type="button"
            onClick={() => setChartType('line')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              chartType === 'line'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Linhas
          </button>
        </div>
      </div>

      {/* Recharts Container */}
      <div className="h-[360px] sm:h-[420px] w-full pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
          >
            <defs>
              <linearGradient id="colorStock" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorSelic" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorInvested" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#64748b" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#64748b" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
            
            <XAxis
              dataKey="month"
              tickFormatter={(m) => (m === 0 ? 'Mês 0' : m % 12 === 0 ? `${m / 12} ano${m / 12 > 1 ? 's' : ''}` : `M${m}`)}
              stroke="#94a3b8"
              fontSize={11}
              tickLine={false}
              dy={10}
            />

            <YAxis
              tickFormatter={(val) =>
                val >= 1000000
                  ? `R$ ${(val / 1000000).toFixed(1)}M`
                  : val >= 1000
                  ? `R$ ${(val / 1000).toFixed(0)}k`
                  : `R$ ${val}`
              }
              stroke="#94a3b8"
              fontSize={11}
              tickLine={false}
              dx={-5}
            />

            <Tooltip content={<CustomTooltip />} />

            <Legend
              verticalAlign="top"
              height={36}
              iconType="circle"
              formatter={(value) => {
                if (value === 'totalInvested') return <span className="text-slate-300 text-xs font-semibold">Total Investido</span>;
                if (value === 'selicNet') return <span className="text-cyan-300 text-xs font-semibold">Selic (Líquido)</span>;
                if (value === 'stockNet') return <span className="text-emerald-300 text-xs font-semibold">Ação {stockTicker}</span>;
                return <span className="text-slate-300 text-xs">{value}</span>;
              }}
            />

            {/* Total Invested */}
            <Area
              type="monotone"
              dataKey="totalInvested"
              stroke="#64748b"
              strokeWidth={2}
              fillOpacity={1}
              fill={chartType === 'area' ? 'url(#colorInvested)' : 'none'}
              strokeDasharray="4 4"
            />

            {/* Selic Net */}
            <Area
              type="monotone"
              dataKey="selicNet"
              stroke="#06b6d4"
              strokeWidth={3}
              fillOpacity={1}
              fill={chartType === 'area' ? 'url(#colorSelic)' : 'none'}
            />

            {/* Stock Net */}
            <Area
              type="monotone"
              dataKey="stockNet"
              stroke="#10b981"
              strokeWidth={3.5}
              fillOpacity={1}
              fill={chartType === 'area' ? 'url(#colorStock)' : 'none'}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
};
