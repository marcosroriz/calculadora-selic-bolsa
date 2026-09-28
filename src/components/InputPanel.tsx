import React, { useState } from 'react';
import type { CalculationInput, TimeWindow } from '../types/calculator';
import { POPULAR_STOCKS, getStockInfo } from '../data/stocksData';
import { DollarSign, Calendar, Search, Settings2, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';
import { formatCurrency } from '../utils/financeCalculations';

interface InputPanelProps {
  input: CalculationInput;
  onChange: (newInput: CalculationInput) => void;
  onReset: () => void;
}

export const InputPanel: React.FC<InputPanelProps> = ({ input, onChange, onReset }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [customTickerInput, setCustomTickerInput] = useState('');
  const [isCustomMode, setIsCustomMode] = useState(false);

  const windowOptions: { label: string; value: TimeWindow }[] = [
    { label: '1 Ano', value: 1 },
    { label: '2 Anos', value: 2 },
    { label: '5 Anos', value: 5 },
    { label: '10 Anos', value: 10 },
  ];

  const handleStockSelect = (ticker: string) => {
    setIsCustomMode(false);
    onChange({
      ...input,
      ticker,
      customStockCagr: undefined,
      customDividendYield: undefined,
    });
  };

  const handleCustomTickerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customTickerInput.trim()) {
      const cleanTicker = customTickerInput.trim().toUpperCase();
      onChange({
        ...input,
        ticker: cleanTicker,
      });
    }
  };

  const selectedStockObj = getStockInfo(input.ticker);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-slate-950/50 backdrop-blur-xl relative overflow-hidden">
      {/* Decorative ambient background blur */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col gap-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-400" />
              Parâmetros da Simulação
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Escolha a ação, prazo e aportes para comparar a evolução do seu patrimônio
            </p>
          </div>
          
          <button
            type="button"
            onClick={onReset}
            className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition-all border border-slate-700/60"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Restaurar Padrões
          </button>
        </div>

        {/* Grid Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

          {/* 1. Seleção de Ação */}
          <div className="flex flex-col gap-2.5 lg:col-span-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center justify-between">
              <span>Selecione a Ação (B3)</span>
              <span className="text-[11px] font-normal text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                {input.ticker}
              </span>
            </label>

            {/* Presets Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {POPULAR_STOCKS.map((stock) => {
                const isSelected = input.ticker === stock.ticker && !isCustomMode;
                return (
                  <button
                    key={stock.ticker}
                    type="button"
                    onClick={() => handleStockSelect(stock.ticker)}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border text-xs font-bold transition-all ${
                      isSelected
                        ? 'bg-emerald-500/15 border-emerald-500/80 text-emerald-300 shadow-lg shadow-emerald-500/10 scale-[1.02]'
                        : 'bg-slate-800/50 border-slate-700/60 text-slate-300 hover:bg-slate-800 hover:border-slate-600 hover:text-white'
                    }`}
                  >
                    <span className="text-sm font-extrabold">{stock.ticker}</span>
                    <span className="text-[10px] text-slate-400 truncate max-w-full font-normal">
                      {stock.name.split(' ')[0]}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Custom Ticker Input Toggle */}
            <form onSubmit={handleCustomTickerSubmit} className="flex gap-2 mt-1">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Ou digite outro ticker (ex: BOVA11, PRIO3)..."
                  value={customTickerInput}
                  onChange={(e) => {
                    setCustomTickerInput(e.target.value.toUpperCase());
                    setIsCustomMode(true);
                  }}
                  className="w-full pl-9 pr-3 py-2 bg-slate-950/70 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-600/20"
              >
                Buscar
              </button>
            </form>
          </div>

          {/* 2. Janela de Tempo (1 ano, 2 anos, 5 anos, 10 anos) */}
          <div className="flex flex-col gap-2.5 lg:col-span-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-cyan-400" />
                Janela de Tempo
              </span>
              <span className="text-[11px] font-normal text-cyan-400">
                {input.windowYears} {input.windowYears === 1 ? 'ano' : 'anos'} ({input.windowYears * 12} meses)
              </span>
            </label>

            <div className="grid grid-cols-4 gap-2 h-full">
              {windowOptions.map((opt) => {
                const isActive = input.windowYears === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => onChange({ ...input, windowYears: opt.value })}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-sm font-bold transition-all ${
                      isActive
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-lg shadow-cyan-500/10 scale-[1.02]'
                        : 'bg-slate-800/50 border-slate-700/60 text-slate-400 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <span>{opt.label}</span>
                    <span className="text-[10px] font-normal text-slate-400 mt-0.5">
                      {opt.value * 12}m
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Valor da Aplicação Inicial */}
          <div className="flex flex-col gap-2 bg-slate-950/50 p-4 rounded-2xl border border-slate-800/80">
            <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
              <span>Aplicação Inicial</span>
              <span className="text-emerald-400 font-mono font-bold text-sm">
                {formatCurrency(input.initialInvestment)}
              </span>
            </label>

            <input
              type="number"
              min={0}
              max={1000000}
              step={500}
              value={input.initialInvestment}
              onChange={(e) =>
                onChange({ ...input, initialInvestment: Math.max(0, Number(e.target.value)) })
              }
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-sm font-mono text-white focus:outline-none focus:border-emerald-500"
            />

            <input
              type="range"
              min={0}
              max={200000}
              step={1000}
              value={input.initialInvestment}
              onChange={(e) =>
                onChange({ ...input, initialInvestment: Number(e.target.value) })
              }
              className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>R$ 0</span>
              <span>R$ 200k</span>
            </div>
          </div>

          {/* 4. Valor do Aporte Mensal */}
          <div className="flex flex-col gap-2 bg-slate-950/50 p-4 rounded-2xl border border-slate-800/80">
            <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
              <span>Aporte Mensal</span>
              <span className="text-cyan-400 font-mono font-bold text-sm">
                {formatCurrency(input.monthlyContribution)}
              </span>
            </label>

            <input
              type="number"
              min={0}
              max={100000}
              step={50}
              value={input.monthlyContribution}
              onChange={(e) =>
                onChange({ ...input, monthlyContribution: Math.max(0, Number(e.target.value)) })
              }
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-sm font-mono text-white focus:outline-none focus:border-cyan-500"
            />

            <input
              type="range"
              min={0}
              max={10000}
              step={100}
              value={input.monthlyContribution}
              onChange={(e) =>
                onChange({ ...input, monthlyContribution: Number(e.target.value) })
              }
              className="w-full accent-cyan-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>R$ 0</span>
              <span>R$ 10k/mês</span>
            </div>
          </div>

          {/* 5. Ticker Performance Quick Summary Card */}
          <div className="flex flex-col justify-between bg-slate-950/50 p-4 rounded-2xl border border-slate-800/80 lg:col-span-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: selectedStockObj.color }}
                />
                <span className="text-sm font-bold text-white">{selectedStockObj.name}</span>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                {selectedStockObj.badge}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-800/60">
              <div>
                <span className="text-[11px] text-slate-400 block">CAGR Histórico ({input.windowYears}a)</span>
                <span className="text-sm font-mono font-bold text-emerald-400">
                  {input.customStockCagr !== undefined
                    ? `${input.customStockCagr.toFixed(2)}% aa`
                    : `${selectedStockObj.performance[input.windowYears].cagr.toFixed(2)}% aa`}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block">Dividend Yield Estimado</span>
                <span className="text-sm font-mono font-bold text-cyan-400">
                  {input.customDividendYield !== undefined
                    ? `${input.customDividendYield.toFixed(2)}% aa`
                    : `${selectedStockObj.performance[input.windowYears].dividendYield.toFixed(2)}% aa`}
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Advanced Settings Drawer */}
        <div className="border-t border-slate-800/80 pt-4">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
          >
            <Settings2 className="w-4 h-4 text-emerald-400" />
            <span>Configurações Avançadas & Impostos</span>
            {showAdvanced ? (
              <ChevronUp className="w-4 h-4 ml-1 text-slate-500" />
            ) : (
              <ChevronDown className="w-4 h-4 ml-1 text-slate-500" />
            )}
          </button>

          {showAdvanced && (
            <div className="mt-4 p-4 rounded-2xl bg-slate-950/70 border border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Selic Rate Override */}
              <div>
                <label className="text-xs text-slate-300 block mb-1">Taxa Selic Anual (% aa)</label>
                <input
                  type="number"
                  step={0.25}
                  value={input.selicRateAnnual}
                  onChange={(e) =>
                    onChange({ ...input, selicRateAnnual: Number(e.target.value) })
                  }
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-emerald-400 focus:outline-none"
                />
              </div>

              {/* Custom Stock CAGR Override */}
              <div>
                <label className="text-xs text-slate-300 block mb-1">Overide CAGR da Ação (% aa)</label>
                <input
                  type="number"
                  step={0.5}
                  placeholder={`Padrão: ${selectedStockObj.performance[input.windowYears].cagr}%`}
                  value={input.customStockCagr ?? ''}
                  onChange={(e) =>
                    onChange({
                      ...input,
                      customStockCagr: e.target.value !== '' ? Number(e.target.value) : undefined,
                    })
                  }
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-cyan-400 focus:outline-none"
                />
              </div>

              {/* Dividend Reinvestment Toggle */}
              <div className="flex flex-col justify-center">
                <label className="text-xs text-slate-300 block mb-1">Reinvestir Dividendos?</label>
                <button
                  type="button"
                  onClick={() => onChange({ ...input, reinvestDividends: !input.reinvestDividends })}
                  className={`w-full py-1.5 px-3 rounded-xl text-xs font-bold border transition-all ${
                    input.reinvestDividends
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                      : 'bg-slate-800 border-slate-700 text-slate-400'
                  }`}
                >
                  {input.reinvestDividends ? 'Sim (Juros Compostos)' : 'Não (Acumular no Caixa)'}
                </button>
              </div>

              {/* Selic Tax Toggle */}
              <div className="flex flex-col justify-center">
                <label className="text-xs text-slate-300 block mb-1">Aplicar IR Regressivo Selic?</label>
                <button
                  type="button"
                  onClick={() => onChange({ ...input, applySelicTax: !input.applySelicTax })}
                  className={`w-full py-1.5 px-3 rounded-xl text-xs font-bold border transition-all ${
                    input.applySelicTax
                      ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300'
                      : 'bg-slate-800 border-slate-700 text-slate-400'
                  }`}
                >
                  {input.applySelicTax ? 'Sim (Conforme Tabela Regressiva)' : 'Não (Rendimento Bruto)'}
                </button>
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
};
