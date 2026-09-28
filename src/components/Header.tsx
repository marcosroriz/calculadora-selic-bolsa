import React from 'react';
import { TrendingUp, ShieldCheck, Zap, Layers } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="w-full bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand & Title */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 p-0.5 shadow-lg shadow-emerald-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-emerald-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-sans">
                Calculadora <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Selic vs Bolsa</span>
              </h1>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                B3 & BCB
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              Simulador financeiro de rentabilidade real com juros compostos & impostos
            </p>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="flex items-center gap-2 sm:gap-4 text-xs font-medium text-slate-300">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/50">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>IR Regressivo</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/50">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Dividendos Isentos</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/50">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>Pronto p/ Vercel</span>
          </div>
        </div>

      </div>
    </header>
  );
};
