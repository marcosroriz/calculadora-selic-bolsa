import React, { useState } from 'react';
import type { CalculationResult } from '../types/calculator';
import { formatCurrency } from '../utils/financeCalculations';
import { Table, Download, Calendar } from 'lucide-react';

interface BreakdownTableProps {
  result: CalculationResult;
  stockTicker: string;
}

export const BreakdownTable: React.FC<BreakdownTableProps> = ({ result, stockTicker }) => {
  const [viewMode, setViewMode] = useState<'annual' | 'monthly'>('annual');

  // Filter rows for annual view (month % 12 === 0 or last month)
  const displayedRows = result.monthlyData.filter((d) => {
    if (viewMode === 'monthly') return true;
    return d.month === 0 || d.month % 12 === 0 || d.month === result.totalMonths;
  });

  const exportCSV = () => {
    const headers = [
      'Mes',
      'Rotulo',
      'Total Investido (R$)',
      'Selic Bruto (R$)',
      'Selic Liquido (R$)',
      `Acao ${stockTicker} Liquido (R$)`,
      'Diferenca Acao-Selic (R$)',
    ];

    const rows = result.monthlyData.map((d) => [
      d.month,
      d.monthLabel,
      d.totalInvested.toFixed(2),
      d.selicGross.toFixed(2),
      d.selicNet.toFixed(2),
      d.stockNet.toFixed(2),
      (d.stockNet - d.selicNet).toFixed(2),
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(';'), ...rows.map((e) => e.join(';'))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `comparativo-selic-vs-${stockTicker.toLowerCase()}-${result.totalMonths}meses.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md flex flex-col gap-6">
      
      {/* Table Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Table className="w-5 h-5 text-cyan-400" />
            Tabela Detalhada do Rendimento
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Acompanhe a progressão detalhada do patrimônio investido, imposto e lucro acumulado
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          {/* Mode toggle */}
          <div className="flex items-center gap-1 bg-slate-950/60 p-1 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => setViewMode('annual')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'annual'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Visão Anual
            </button>
            <button
              type="button"
              onClick={() => setViewMode('monthly')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'monthly'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Visão Mensal
            </button>
          </div>

          {/* Export CSV button */}
          <button
            type="button"
            onClick={exportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 transition-all shadow-md"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            CSV
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/60 max-h-[440px] overflow-y-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead className="bg-slate-950 text-slate-400 font-bold sticky top-0 z-10 border-b border-slate-800">
            <tr>
              <th className="p-3.5 pl-4">Período</th>
              <th className="p-3.5">Total Investido</th>
              <th className="p-3.5">Selic Bruto</th>
              <th className="p-3.5 text-cyan-400">Selic Líquido</th>
              <th className="p-3.5 text-emerald-400">Ação {stockTicker}</th>
              <th className="p-3.5 pr-4 text-right">Vantagem Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
            {displayedRows.map((row) => {
              const stockAdvantage = row.stockNet - row.selicNet;
              const isPositive = stockAdvantage >= 0;

              return (
                <tr key={row.month} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3.5 pl-4 font-sans font-bold text-white flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>{row.month === 0 ? 'Início' : row.yearLabel}</span>
                  </td>
                  <td className="p-3.5">{formatCurrency(row.totalInvested)}</td>
                  <td className="p-3.5 text-slate-400">{formatCurrency(row.selicGross)}</td>
                  <td className="p-3.5 font-bold text-cyan-300">{formatCurrency(row.selicNet)}</td>
                  <td className="p-3.5 font-bold text-emerald-300">{formatCurrency(row.stockNet)}</td>
                  <td
                    className={`p-3.5 pr-4 text-right font-bold ${
                      isPositive ? 'text-emerald-400' : 'text-amber-400'
                    }`}
                  >
                    {isPositive ? '+' : ''}
                    {formatCurrency(stockAdvantage)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
};
