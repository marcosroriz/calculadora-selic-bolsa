import React from 'react';
import { Info, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-slate-950 border-t border-slate-800/80 py-10 px-4 sm:px-6 lg:px-8 mt-12">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-400">
        
        {/* Left Disclaimer */}
        <div className="flex flex-col gap-2 max-w-2xl text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 text-slate-300 font-bold">
            <Info className="w-4 h-4 text-emerald-400" />
            <span>Nota Educacional & Isenção de Responsabilidade</span>
          </div>
          <p className="leading-relaxed text-slate-400">
            Esta aplicação tem caráter exclusivamente educacional e simulatório para fins de estudo financeiro.
            Rentabilidade passada não é garantia de rentabilidade futura. Os cálculos da Selic aplicam a tabela regressiva de IR (22,5% a 15,0%), e os cálculos de ações consideram isenção de dividendos sob a legislação brasileira atual.
          </p>
        </div>

        {/* Right Badges */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-300 font-semibold">Deploy Pronto na Vercel</span>
          </div>

          <a
            href="https://www.bcb.gov.br/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors flex items-center gap-1.5"
          >
            <span>Dados Banco Central</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </a>
        </div>

      </div>
    </footer>
  );
};
