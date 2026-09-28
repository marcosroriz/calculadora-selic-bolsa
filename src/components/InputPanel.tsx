import React, { useState } from 'react';
import type { CalculationInput, TimeWindow } from '../types/calculator';
import { POPULAR_STOCKS, getStockInfo } from '../data/stocksData';
import { DollarSign, Calendar, Search, Settings2, RotateCcw, ChevronDown, ChevronUp, X, Check } from 'lucide-react';
import { formatCurrency, MAX_SELECTED_STOCKS, STOCK_SERIES_COLORS } from '../utils/financeCalculations';

interface InputPanelProps {
  input: CalculationInput;
  onChange: (newInput: CalculationInput) => void;
  onReset: () => void;
}

export const InputPanel: React.FC<InputPanelProps> = ({ input, onChange, onReset }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [customTickerInput, setCustomTickerInput] = useState('');

  const windowOptions: { label: string; value: TimeWindow }[] = [
    { label: '1 Ano', value: 1 },
    { label: '2 Anos', value: 2 },
    { label: '5 Anos', value: 5 },
    { label: '10 Anos', value: 10 },
  ];

  const isFull = input.tickers.length >= MAX_SELECTED_STOCKS;

  const handleStockToggle = (ticker: string) => {
    if (input.tickers.includes(ticker)) {
      // Keep at least one stock selected
      if (input.tickers.length === 1) return;
      const { [ticker]: _removed, ...cagrOverrides } = input.cagrOverrides;
      onChange({ ...input, tickers: input.tickers.filter((t) => t !== ticker), cagrOverrides });
    } else if (!isFull) {
      onChange({ ...input, tickers: [...input.tickers, ticker] });
    }
  };

  const handleCustomTickerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTicker = customTickerInput.trim().toUpperCase();
    if (cleanTicker && !input.tickers.includes(cleanTicker) && !isFull) {
      onChange({ ...input, tickers: [...input.tickers, cleanTicker] });
      setCustomTickerInput('');
    }
  };

  const colorOf = (ticker: string) =>
    STOCK_SERIES_COLORS[input.tickers.indexOf(ticker) % STOCK_SERIES_COLORS.length];

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
              Escolha uma ou mais ações, prazo e aportes para comparar a evolução do seu patrimônio
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
              <span>Selecione as Ações (B3)</span>
              <span className="text-[11px] font-normal text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                {input.tickers.length}/{MAX_SELECTED_STOCKS} selecionadas
              </span>
            </label>

            {/* Selected chips */}
            <div className="flex flex-wrap gap-2">
              {input.tickers.map((ticker) => (
                <span
                  key={ticker}
                  className="inline-flex items-center gap-1.5 pl-2.5 pr-1 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-xs font-bold text-white"
                >
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: colorOf(ticker) }} />
                  {ticker}
                  <button
                    type="button"
                    onClick={() => handleStockToggle(ticker)}
                    disabled={input.tickers.length === 1}
                    aria-label={`Remover ${ticker}`}
                    className="p-0.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            {/* Presets Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {POPULAR_STOCKS.map((stock) => {
                const isSelected = input.tickers.includes(stock.ticker);
                const isDisabled = !isSelected && isFull;
                return (
                  <button
                    key={stock.ticker}
                    type="button"
                    onClick={() => handleStockToggle(stock.ticker)}
                    disabled={isDisabled}
                    aria-pressed={isSelected}
                    className={`relative flex flex-col items-center justify-center p-2.5 rounded-2xl border text-xs font-bold transition-all ${
                      isSelected
                        ? 'bg-emerald-500/15 border-emerald-500/80 text-emerald-300 shadow-lg shadow-emerald-500/10'
                        : isDisabled
                        ? 'bg-slate-800/30 border-slate-800 text-slate-600 cursor-not-allowed'
                        : 'bg-slate-800/50 border-slate-700/60 text-slate-300 hover:bg-slate-800 hover:border-slate-600 hover:text-white'
                    }`}
                  >
                    {isSelected && (
                      <Check
                        className="w-3 h-3 absolute top-1.5 right-1.5"
                        style={{ color: colorOf(stock.ticker) }}
                      />
                    )}
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
                  placeholder={isFull ? `Limite de ${MAX_SELECTED_STOCKS} ações atingido` : 'Ou adicione outro ticker (ex: PRIO3)...'}
                  value={customTickerInput}
                  disabled={isFull}
                  onChange={(e) => setCustomTickerInput(e.target.value.toUpperCase())}
                  className="w-full pl-9 pr-3 py-2 bg-slate-950/70 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
              <button
                type="submit"
                disabled={isFull}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 disabled:text-slate-400 disabled:shadow-none text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-600/20"
              >
                Adicionar
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

          {/* 5. Selected Stocks Quick Summary */}
          <div className="flex flex-col bg-slate-950/50 p-4 rounded-2xl border border-slate-800/80 lg:col-span-2">
            <div className="grid grid-cols-[1fr_auto_auto] gap-x-4 gap-y-2 text-xs items-center">
              <span className="text-[11px] text-slate-400">Ação</span>
              <span className="text-[11px] text-slate-400 text-right">CAGR ({input.windowYears}a)</span>
              <span className="text-[11px] text-slate-400 text-right">Dividend Yield</span>
              {input.tickers.map((ticker) => {
                const stock = getStockInfo(ticker);
                const perf = stock.performance[input.windowYears];
                const cagr = input.cagrOverrides[ticker] ?? perf.cagr;
                return (
                  <React.Fragment key={ticker}>
                    <span className="flex items-center gap-2 min-w-0">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: colorOf(ticker) }} />
                      <span className="font-bold text-white truncate">{stock.name}</span>
                    </span>
                    <span className="font-mono font-bold text-emerald-400 text-right">{cagr.toFixed(2)}% aa</span>
                    <span className="font-mono font-bold text-cyan-400 text-right">{perf.dividendYield.toFixed(2)}% aa</span>
                  </React.Fragment>
                );
              })}
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

              {/* Custom CAGR Override per selected stock */}
              <div className="sm:col-span-2 lg:col-span-4 border-t border-slate-800 pt-4">
                <span className="text-xs text-slate-300 block mb-2">Override do CAGR por Ação (% aa)</span>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                  {input.tickers.map((ticker) => (
                    <label key={ticker} className="flex flex-col gap-1">
                      <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: colorOf(ticker) }} />
                        {ticker}
                      </span>
                      <input
                        type="number"
                        step={0.5}
                        placeholder={`Padrão: ${getStockInfo(ticker).performance[input.windowYears].cagr}%`}
                        value={input.cagrOverrides[ticker] ?? ''}
                        onChange={(e) => {
                          const { [ticker]: _removed, ...rest } = input.cagrOverrides;
                          onChange({
                            ...input,
                            cagrOverrides: e.target.value !== '' ? { ...rest, [ticker]: Number(e.target.value) } : rest,
                          });
                        }}
                        className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-cyan-400 focus:outline-none"
                      />
                    </label>
                  ))}
                </div>
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
};
