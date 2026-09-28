import type { StockItem } from '../types/calculator';

export const POPULAR_STOCKS: StockItem[] = [
  {
    ticker: 'PETR4',
    name: 'Petrobras PN',
    sector: 'Petróleo, Gás e Biocombustíveis',
    description: 'Maior petroleira do Brasil, reconhecida pelo alto pagamento de dividendos nos últimos anos.',
    color: '#008542',
    badge: 'Alta Dividend Yield',
    performance: {
      1: { cagr: 18.5, dividendYield: 14.2 },
      2: { cagr: 24.8, dividendYield: 16.5 },
      5: { cagr: 28.2, dividendYield: 18.1 },
      10: { cagr: 19.4, dividendYield: 12.8 },
    },
  },
  {
    ticker: 'VALE3',
    name: 'Vale ON',
    sector: 'Mineração e Siderurgia',
    description: 'Líder global na produção de minério de ferro e níquel, exportadora de commodities.',
    color: '#005b60',
    badge: 'Exportadora / Commodities',
    performance: {
      1: { cagr: -8.4, dividendYield: 8.5 },
      2: { cagr: -4.2, dividendYield: 9.1 },
      5: { cagr: 14.6, dividendYield: 10.4 },
      10: { cagr: 16.2, dividendYield: 8.2 },
    },
  },
  {
    ticker: 'ITUB4',
    name: 'Itaú Unibanco PN',
    sector: 'Serviços Financeiros / Bancos',
    description: 'Maior banco privado da América Latina, histórico de consistência e lucros crescentes.',
    color: '#ec7000',
    badge: 'Consistência Histórica',
    performance: {
      1: { cagr: 16.2, dividendYield: 7.8 },
      2: { cagr: 18.4, dividendYield: 7.2 },
      5: { cagr: 12.8, dividendYield: 6.9 },
      10: { cagr: 14.5, dividendYield: 6.5 },
    },
  },
  {
    ticker: 'BBAS3',
    name: 'Banco do Brasil ON',
    sector: 'Serviços Financeiros / Bancos',
    description: 'Banco público mais antigo do país, com forte atuação no agronegócio e múltiplos atraentes.',
    color: '#f9d200',
    badge: 'Agro & Dividendos',
    performance: {
      1: { cagr: 21.4, dividendYield: 9.8 },
      2: { cagr: 27.5, dividendYield: 10.2 },
      5: { cagr: 18.9, dividendYield: 9.4 },
      10: { cagr: 17.1, dividendYield: 8.6 },
    },
  },
  {
    ticker: 'WEGE3',
    name: 'WEG ON',
    sector: 'Bens de Capital / Motores',
    description: 'Multinacional brasileira referência em motores elétricos, automação e energia renovável.',
    color: '#005596',
    badge: 'Crescimento Compounder',
    performance: {
      1: { cagr: 32.1, dividendYield: 2.1 },
      2: { cagr: 22.4, dividendYield: 2.3 },
      5: { cagr: 31.5, dividendYield: 2.5 },
      10: { cagr: 28.9, dividendYield: 2.4 },
    },
  },
  {
    ticker: 'TAEE11',
    name: 'Taesa Unit',
    sector: 'Energia Elétrica / Transmissão',
    description: 'Uma das maiores transmissoras privadas de energia elétrica, preferida por investidores focados em renda.',
    color: '#2a875a',
    badge: 'Defensiva / Renda Mensal',
    performance: {
      1: { cagr: 4.8, dividendYield: 9.9 },
      2: { cagr: 8.1, dividendYield: 10.5 },
      5: { cagr: 15.2, dividendYield: 11.2 },
      10: { cagr: 16.8, dividendYield: 10.8 },
    },
  },
  {
    ticker: 'MGLU3',
    name: 'Magazine Luiza ON',
    sector: 'Varejo / E-commerce',
    description: 'Gigante do varejo físico e digital no Brasil, alta volatilidade influenciada pela taxa de juros.',
    color: '#0086ff',
    badge: 'Alta Volatilidade / Varejo',
    performance: {
      1: { cagr: -22.5, dividendYield: 0.2 },
      2: { cagr: -35.0, dividendYield: 0.1 },
      5: { cagr: -14.2, dividendYield: 0.5 },
      10: { cagr: 18.4, dividendYield: 0.8 },
    },
  },
  {
    ticker: 'IVVB11',
    name: 'iShares S&P 500 ETF',
    sector: 'ETF Internacional (EUA em R$)',
    description: 'ETF que replica o índice S&P 500 das 500 maiores empresas dos EUA em reais com variação cambial.',
    color: '#6b21a8',
    badge: 'Dolarizado / S&P 500',
    performance: {
      1: { cagr: 26.4, dividendYield: 1.2 },
      2: { cagr: 21.1, dividendYield: 1.1 },
      5: { cagr: 19.8, dividendYield: 1.3 },
      10: { cagr: 20.5, dividendYield: 1.4 },
    },
  },
  {
    ticker: 'BOVA11',
    name: 'iShares Ibovespa ETF',
    sector: 'ETF Mercado Brasileiro',
    description: 'ETF que busca replicar o desempenho da carteira teórica do índice Ibovespa da B3.',
    color: '#15803d',
    badge: 'Índice Geral B3',
    performance: {
      1: { cagr: 8.5, dividendYield: 3.4 },
      2: { cagr: 11.2, dividendYield: 3.8 },
      5: { cagr: 9.4, dividendYield: 3.6 },
      10: { cagr: 10.8, dividendYield: 3.5 },
    },
  },
  {
    ticker: 'RENT3',
    name: 'Localiza ON',
    sector: 'Aluguel de Carros e Gestão de Frotas',
    description: 'Líder sul-americana em locação de veículos e gestão de frotas corporativas.',
    color: '#0284c7',
    badge: 'Mobilidade & Frotas',
    performance: {
      1: { cagr: 11.4, dividendYield: 3.1 },
      2: { cagr: 14.2, dividendYield: 2.9 },
      5: { cagr: 16.5, dividendYield: 2.8 },
      10: { cagr: 21.3, dividendYield: 2.6 },
    },
  }
];

// Helper to find preset stock or generate estimated metrics for custom ticker
export function getStockInfo(ticker: string): StockItem {
  const normalized = ticker.trim().toUpperCase();
  const found = POPULAR_STOCKS.find((s) => s.ticker === normalized);
  
  if (found) return found;

  // Generic stock fallback for unlisted tickers
  return {
    ticker: normalized,
    name: `${normalized} (Ação B3)`,
    sector: 'Mercado de Ações',
    description: `Ação customizada ${normalized}. Rentabilidade estimada com base em médias históricas do mercado.`,
    color: '#4f46e5',
    badge: 'Personalizada',
    performance: {
      1: { cagr: 12.0, dividendYield: 5.0 },
      2: { cagr: 13.5, dividendYield: 5.2 },
      5: { cagr: 15.0, dividendYield: 5.5 },
      10: { cagr: 14.0, dividendYield: 5.0 },
    },
  };
}
