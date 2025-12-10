import type { Stock, MarketIndex } from "@shared/schema";

// Comprehensive list of major stocks across different sectors
const stockData = [
  // Technology
  { symbol: "AAPL", name: "Apple Inc.", sector: "Technology", exchange: "NASDAQ", basePrice: 178.50 },
  { symbol: "MSFT", name: "Microsoft Corporation", sector: "Technology", exchange: "NASDAQ", basePrice: 378.90 },
  { symbol: "GOOGL", name: "Alphabet Inc.", sector: "Technology", exchange: "NASDAQ", basePrice: 141.25 },
  { symbol: "AMZN", name: "Amazon.com Inc.", sector: "Technology", exchange: "NASDAQ", basePrice: 178.35 },
  { symbol: "META", name: "Meta Platforms Inc.", sector: "Technology", exchange: "NASDAQ", basePrice: 505.75 },
  { symbol: "NVDA", name: "NVIDIA Corporation", sector: "Technology", exchange: "NASDAQ", basePrice: 875.50 },
  { symbol: "TSLA", name: "Tesla Inc.", sector: "Technology", exchange: "NASDAQ", basePrice: 245.80 },
  { symbol: "AMD", name: "Advanced Micro Devices", sector: "Technology", exchange: "NASDAQ", basePrice: 165.40 },
  { symbol: "INTC", name: "Intel Corporation", sector: "Technology", exchange: "NASDAQ", basePrice: 43.25 },
  { symbol: "CRM", name: "Salesforce Inc.", sector: "Technology", exchange: "NYSE", basePrice: 267.80 },
  { symbol: "ORCL", name: "Oracle Corporation", sector: "Technology", exchange: "NYSE", basePrice: 125.60 },
  { symbol: "ADBE", name: "Adobe Inc.", sector: "Technology", exchange: "NASDAQ", basePrice: 578.90 },
  { symbol: "CSCO", name: "Cisco Systems Inc.", sector: "Technology", exchange: "NASDAQ", basePrice: 48.75 },
  { symbol: "IBM", name: "IBM Corporation", sector: "Technology", exchange: "NYSE", basePrice: 168.45 },
  { symbol: "NFLX", name: "Netflix Inc.", sector: "Technology", exchange: "NASDAQ", basePrice: 485.30 },
  
  // Finance
  { symbol: "JPM", name: "JPMorgan Chase & Co.", sector: "Finance", exchange: "NYSE", basePrice: 195.40 },
  { symbol: "V", name: "Visa Inc.", sector: "Finance", exchange: "NYSE", basePrice: 278.90 },
  { symbol: "MA", name: "Mastercard Inc.", sector: "Finance", exchange: "NYSE", basePrice: 458.25 },
  { symbol: "BAC", name: "Bank of America Corp.", sector: "Finance", exchange: "NYSE", basePrice: 37.80 },
  { symbol: "WFC", name: "Wells Fargo & Co.", sector: "Finance", exchange: "NYSE", basePrice: 57.45 },
  { symbol: "GS", name: "Goldman Sachs Group", sector: "Finance", exchange: "NYSE", basePrice: 385.60 },
  { symbol: "MS", name: "Morgan Stanley", sector: "Finance", exchange: "NYSE", basePrice: 98.75 },
  { symbol: "AXP", name: "American Express Co.", sector: "Finance", exchange: "NYSE", basePrice: 215.30 },
  { symbol: "BLK", name: "BlackRock Inc.", sector: "Finance", exchange: "NYSE", basePrice: 785.40 },
  { symbol: "SCHW", name: "Charles Schwab Corp.", sector: "Finance", exchange: "NYSE", basePrice: 72.15 },
  
  // Healthcare
  { symbol: "JNJ", name: "Johnson & Johnson", sector: "Healthcare", exchange: "NYSE", basePrice: 158.90 },
  { symbol: "UNH", name: "UnitedHealth Group", sector: "Healthcare", exchange: "NYSE", basePrice: 528.45 },
  { symbol: "PFE", name: "Pfizer Inc.", sector: "Healthcare", exchange: "NYSE", basePrice: 28.65 },
  { symbol: "ABBV", name: "AbbVie Inc.", sector: "Healthcare", exchange: "NYSE", basePrice: 175.80 },
  { symbol: "MRK", name: "Merck & Co. Inc.", sector: "Healthcare", exchange: "NYSE", basePrice: 125.40 },
  { symbol: "LLY", name: "Eli Lilly and Co.", sector: "Healthcare", exchange: "NYSE", basePrice: 785.60 },
  { symbol: "TMO", name: "Thermo Fisher Scientific", sector: "Healthcare", exchange: "NYSE", basePrice: 565.25 },
  { symbol: "ABT", name: "Abbott Laboratories", sector: "Healthcare", exchange: "NYSE", basePrice: 108.90 },
  { symbol: "DHR", name: "Danaher Corporation", sector: "Healthcare", exchange: "NYSE", basePrice: 248.75 },
  { symbol: "BMY", name: "Bristol-Myers Squibb", sector: "Healthcare", exchange: "NYSE", basePrice: 52.30 },
  
  // Consumer
  { symbol: "WMT", name: "Walmart Inc.", sector: "Consumer", exchange: "NYSE", basePrice: 165.80 },
  { symbol: "PG", name: "Procter & Gamble Co.", sector: "Consumer", exchange: "NYSE", basePrice: 158.45 },
  { symbol: "KO", name: "Coca-Cola Company", sector: "Consumer", exchange: "NYSE", basePrice: 62.75 },
  { symbol: "PEP", name: "PepsiCo Inc.", sector: "Consumer", exchange: "NASDAQ", basePrice: 178.90 },
  { symbol: "COST", name: "Costco Wholesale", sector: "Consumer", exchange: "NASDAQ", basePrice: 725.60 },
  { symbol: "MCD", name: "McDonald's Corporation", sector: "Consumer", exchange: "NYSE", basePrice: 298.45 },
  { symbol: "NKE", name: "Nike Inc.", sector: "Consumer", exchange: "NYSE", basePrice: 98.75 },
  { symbol: "SBUX", name: "Starbucks Corporation", sector: "Consumer", exchange: "NASDAQ", basePrice: 95.40 },
  { symbol: "HD", name: "Home Depot Inc.", sector: "Consumer", exchange: "NYSE", basePrice: 385.60 },
  { symbol: "LOW", name: "Lowe's Companies", sector: "Consumer", exchange: "NYSE", basePrice: 248.90 },
  
  // Energy
  { symbol: "XOM", name: "Exxon Mobil Corp.", sector: "Energy", exchange: "NYSE", basePrice: 108.75 },
  { symbol: "CVX", name: "Chevron Corporation", sector: "Energy", exchange: "NYSE", basePrice: 155.40 },
  { symbol: "COP", name: "ConocoPhillips", sector: "Energy", exchange: "NYSE", basePrice: 118.25 },
  { symbol: "SLB", name: "Schlumberger Ltd.", sector: "Energy", exchange: "NYSE", basePrice: 52.80 },
  { symbol: "EOG", name: "EOG Resources Inc.", sector: "Energy", exchange: "NYSE", basePrice: 128.45 },
  
  // Industrial
  { symbol: "CAT", name: "Caterpillar Inc.", sector: "Industrial", exchange: "NYSE", basePrice: 345.60 },
  { symbol: "BA", name: "Boeing Company", sector: "Industrial", exchange: "NYSE", basePrice: 215.80 },
  { symbol: "GE", name: "General Electric Co.", sector: "Industrial", exchange: "NYSE", basePrice: 158.45 },
  { symbol: "MMM", name: "3M Company", sector: "Industrial", exchange: "NYSE", basePrice: 108.75 },
  { symbol: "UPS", name: "United Parcel Service", sector: "Industrial", exchange: "NYSE", basePrice: 148.90 },
  { symbol: "HON", name: "Honeywell International", sector: "Industrial", exchange: "NASDAQ", basePrice: 205.60 },
  { symbol: "RTX", name: "RTX Corporation", sector: "Industrial", exchange: "NYSE", basePrice: 98.45 },
  { symbol: "LMT", name: "Lockheed Martin Corp.", sector: "Industrial", exchange: "NYSE", basePrice: 465.80 },
  
  // Communications
  { symbol: "VZ", name: "Verizon Communications", sector: "Communications", exchange: "NYSE", basePrice: 42.75 },
  { symbol: "T", name: "AT&T Inc.", sector: "Communications", exchange: "NYSE", basePrice: 17.85 },
  { symbol: "TMUS", name: "T-Mobile US Inc.", sector: "Communications", exchange: "NASDAQ", basePrice: 165.40 },
  { symbol: "DIS", name: "Walt Disney Company", sector: "Communications", exchange: "NYSE", basePrice: 108.90 },
  { symbol: "CMCSA", name: "Comcast Corporation", sector: "Communications", exchange: "NASDAQ", basePrice: 42.65 },
  
  // Crypto-related
  { symbol: "COIN", name: "Coinbase Global Inc.", sector: "Crypto", exchange: "NASDAQ", basePrice: 245.80 },
  { symbol: "MARA", name: "Marathon Digital", sector: "Crypto", exchange: "NASDAQ", basePrice: 24.65 },
  { symbol: "RIOT", name: "Riot Platforms Inc.", sector: "Crypto", exchange: "NASDAQ", basePrice: 12.85 },
];

const indexData = [
  { symbol: "SPX", name: "S&P 500", baseValue: 5125.40 },
  { symbol: "DJI", name: "Dow Jones", baseValue: 38875.50 },
  { symbol: "IXIC", name: "NASDAQ", baseValue: 16245.80 },
  { symbol: "RUT", name: "Russell 2000", baseValue: 2045.60 },
];

function generateRandomChange(base: number, volatility: number = 0.03): { value: number; change: number; changePercent: number } {
  const changePercent = (Math.random() - 0.5) * 2 * volatility * 100;
  const change = base * (changePercent / 100);
  const value = base + change;
  return { value: Math.round(value * 100) / 100, change: Math.round(change * 100) / 100, changePercent: Math.round(changePercent * 100) / 100 };
}

function generateSparklineData(basePrice: number, points: number = 12): number[] {
  const data: number[] = [];
  let currentPrice = basePrice * 0.98;
  
  for (let i = 0; i < points; i++) {
    currentPrice = currentPrice + (Math.random() - 0.5) * (basePrice * 0.02);
    data.push(Math.round(currentPrice * 100) / 100);
  }
  
  return data;
}

export function getStocks(): Stock[] {
  return stockData.map(stock => {
    const { value, change, changePercent } = generateRandomChange(stock.basePrice);
    const marketCapMultiplier = Math.random() * 900 + 100; // Random market cap between 100M and 1T
    
    return {
      symbol: stock.symbol,
      name: stock.name,
      price: value,
      change,
      changePercent,
      volume: Math.floor(Math.random() * 50000000) + 1000000,
      marketCap: Math.floor(stock.basePrice * marketCapMultiplier * 1000000),
      sector: stock.sector,
      exchange: stock.exchange,
      sparklineData: generateSparklineData(stock.basePrice),
    };
  });
}

export function getStockBySymbol(symbol: string): Stock | undefined {
  const stockInfo = stockData.find(s => s.symbol === symbol);
  if (!stockInfo) return undefined;
  
  const { value, change, changePercent } = generateRandomChange(stockInfo.basePrice);
  const marketCapMultiplier = Math.random() * 900 + 100;
  
  return {
    symbol: stockInfo.symbol,
    name: stockInfo.name,
    price: value,
    change,
    changePercent,
    volume: Math.floor(Math.random() * 50000000) + 1000000,
    marketCap: Math.floor(stockInfo.basePrice * marketCapMultiplier * 1000000),
    sector: stockInfo.sector,
    exchange: stockInfo.exchange,
    sparklineData: generateSparklineData(stockInfo.basePrice),
  };
}

export function getMarketIndices(): MarketIndex[] {
  return indexData.map(index => {
    const { value, change, changePercent } = generateRandomChange(index.baseValue, 0.015);
    
    return {
      symbol: index.symbol,
      name: index.name,
      value,
      change,
      changePercent,
    };
  });
}

export function searchStocks(query: string): Stock[] {
  const normalizedQuery = query.toLowerCase();
  const allStocks = getStocks();
  
  return allStocks.filter(stock => 
    stock.symbol.toLowerCase().includes(normalizedQuery) ||
    stock.name.toLowerCase().includes(normalizedQuery) ||
    stock.sector.toLowerCase().includes(normalizedQuery)
  );
}
