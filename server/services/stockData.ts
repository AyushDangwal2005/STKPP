import yahooFinance from "yahoo-finance2";
import type { Stock, MarketIndex, StockFundamentals, ChartDataPoint } from "@shared/schema";

const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL = 60000;

function getCachedData<T>(key: string): T | null {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data as T;
  }
  return null;
}

function setCachedData(key: string, data: unknown): void {
  cache.set(key, { data, timestamp: Date.now() });
}

export async function getQuote(symbol: string): Promise<Stock | null> {
  try {
    const cacheKey = `quote_${symbol}`;
    const cached = getCachedData<Stock>(cacheKey);
    if (cached) return cached;

    const quote: any = await yahooFinance.quote(symbol);
    if (!quote) return null;

    const stock: Stock = {
      symbol: quote.symbol || symbol,
      name: quote.shortName || quote.longName || symbol,
      price: quote.regularMarketPrice || 0,
      change: quote.regularMarketChange || 0,
      changePercent: quote.regularMarketChangePercent || 0,
      volume: quote.regularMarketVolume || 0,
      marketCap: quote.marketCap || 0,
      sector: quote.sector || "Unknown",
      exchange: quote.exchange || "Unknown",
      sparklineData: [],
    };

    setCachedData(cacheKey, stock);
    return stock;
  } catch (error) {
    console.error(`Error fetching quote for ${symbol}:`, error);
    return null;
  }
}

export async function getMultipleQuotes(symbols: string[]): Promise<Stock[]> {
  try {
    const results = await Promise.all(
      symbols.map(async (symbol) => {
        try {
          return await getQuote(symbol);
        } catch {
          return null;
        }
      })
    );
    return results.filter((s): s is Stock => s !== null);
  } catch (error) {
    console.error("Error fetching multiple quotes:", error);
    return [];
  }
}

export async function getHistoricalData(symbol: string, period: string = "1mo"): Promise<ChartDataPoint[]> {
  try {
    const cacheKey = `historical_${symbol}_${period}`;
    const cached = getCachedData<ChartDataPoint[]>(cacheKey);
    if (cached) return cached;

    const periodMap: Record<string, { period1: Date; interval: "1d" | "1wk" | "1mo" }> = {
      "1D": { period1: new Date(Date.now() - 24 * 60 * 60 * 1000), interval: "1d" },
      "1W": { period1: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), interval: "1d" },
      "1M": { period1: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), interval: "1d" },
      "3M": { period1: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), interval: "1d" },
      "6M": { period1: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000), interval: "1wk" },
      "1Y": { period1: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000), interval: "1wk" },
      "5Y": { period1: new Date(Date.now() - 5 * 365 * 24 * 60 * 60 * 1000), interval: "1mo" },
    };

    const config = periodMap[period] || periodMap["1M"];
    const historical: any = await yahooFinance.chart(symbol, {
      period1: config.period1,
      interval: config.interval,
    });

    const chartData: ChartDataPoint[] = (historical.quotes || []).map((item: any) => ({
      time: new Date(item.date).toISOString(),
      open: item.open || 0,
      high: item.high || 0,
      low: item.low || 0,
      close: item.close || 0,
      volume: item.volume || 0,
    }));

    setCachedData(cacheKey, chartData);
    return chartData;
  } catch (error) {
    console.error(`Error fetching historical data for ${symbol}:`, error);
    return [];
  }
}

export async function getStockDetails(symbol: string): Promise<StockFundamentals | null> {
  try {
    const cacheKey = `details_${symbol}`;
    const cached = getCachedData<StockFundamentals>(cacheKey);
    if (cached) return cached;

    const quote: any = await yahooFinance.quote(symbol);
    let quoteSummary: any = null;
    
    try {
      quoteSummary = await yahooFinance.quoteSummary(symbol, {
        modules: ["summaryProfile", "financialData", "defaultKeyStatistics"],
      });
    } catch {
      quoteSummary = {};
    }

    if (!quote) return null;

    const profile = quoteSummary?.summaryProfile || {};
    const financial = quoteSummary?.financialData || {};
    const keyStats = quoteSummary?.defaultKeyStatistics || {};

    const fundamentals: StockFundamentals = {
      symbol: quote.symbol || symbol,
      name: quote.shortName || quote.longName || symbol,
      description: profile.longBusinessSummary || "",
      sector: profile.sector || "Unknown",
      industry: profile.industry || "Unknown",
      exchange: quote.exchange || "Unknown",
      currency: quote.currency || "USD",
      country: profile.country || "Unknown",
      website: profile.website || "",
      employees: profile.fullTimeEmployees || 0,
      ceo: "",
      price: quote.regularMarketPrice || 0,
      change: quote.regularMarketChange || 0,
      changePercent: quote.regularMarketChangePercent || 0,
      previousClose: quote.regularMarketPreviousClose || 0,
      open: quote.regularMarketOpen || 0,
      dayHigh: quote.regularMarketDayHigh || 0,
      dayLow: quote.regularMarketDayLow || 0,
      fiftyTwoWeekHigh: quote.fiftyTwoWeekHigh || 0,
      fiftyTwoWeekLow: quote.fiftyTwoWeekLow || 0,
      fiftyTwoWeekChange: keyStats.fiftyTwoWeekChange || 0,
      volume: quote.regularMarketVolume || 0,
      avgVolume: quote.averageDailyVolume3Month || 0,
      avgVolume10Day: quote.averageDailyVolume10Day || 0,
      marketCap: quote.marketCap || 0,
      sharesOutstanding: keyStats.sharesOutstanding || 0,
      sharesFloat: keyStats.floatShares || 0,
      sharesShort: keyStats.sharesShort || 0,
      shortRatio: keyStats.shortRatio || 0,
      peRatio: quote.trailingPE || 0,
      forwardPE: quote.forwardPE || 0,
      pegRatio: keyStats.pegRatio || 0,
      priceToSales: quote.priceToSalesTrailing12Months || 0,
      priceToBook: quote.priceToBook || 0,
      enterpriseValue: keyStats.enterpriseValue || 0,
      evToRevenue: keyStats.enterpriseToRevenue || 0,
      evToEbitda: keyStats.enterpriseToEbitda || 0,
      profitMargin: financial.profitMargins ? financial.profitMargins * 100 : 0,
      operatingMargin: financial.operatingMargins ? financial.operatingMargins * 100 : 0,
      grossMargin: financial.grossMargins ? financial.grossMargins * 100 : 0,
      returnOnAssets: financial.returnOnAssets ? financial.returnOnAssets * 100 : 0,
      returnOnEquity: financial.returnOnEquity ? financial.returnOnEquity * 100 : 0,
      revenue: financial.totalRevenue || 0,
      revenuePerShare: financial.revenuePerShare || 0,
      revenueGrowth: financial.revenueGrowth ? financial.revenueGrowth * 100 : 0,
      grossProfit: financial.grossProfits || 0,
      ebitda: financial.ebitda || 0,
      netIncome: 0,
      eps: quote.epsTrailingTwelveMonths || 0,
      epsGrowth: keyStats.earningsQuarterlyGrowth ? keyStats.earningsQuarterlyGrowth * 100 : 0,
      totalCash: financial.totalCash || 0,
      totalDebt: financial.totalDebt || 0,
      debtToEquity: financial.debtToEquity || 0,
      currentRatio: financial.currentRatio || 0,
      quickRatio: financial.quickRatio || 0,
      bookValue: keyStats.bookValue || 0,
      dividendRate: quote.trailingAnnualDividendRate || 0,
      dividendYield: quote.trailingAnnualDividendYield ? quote.trailingAnnualDividendYield * 100 : 0,
      payoutRatio: keyStats.payoutRatio ? keyStats.payoutRatio * 100 : 0,
      exDividendDate: keyStats.exDividendDate ? new Date(keyStats.exDividendDate).toISOString() : null,
      dividendDate: null,
      fiveYearDividendYield: keyStats.fiveYearAvgDividendYield || 0,
      beta: keyStats.beta || 0,
      fiftyDayMA: quote.fiftyDayAverage || 0,
      twoHundredDayMA: quote.twoHundredDayAverage || 0,
      targetHighPrice: financial.targetHighPrice || 0,
      targetLowPrice: financial.targetLowPrice || 0,
      targetMeanPrice: financial.targetMeanPrice || 0,
      targetMedianPrice: financial.targetMedianPrice || 0,
      recommendationMean: financial.recommendationMean || 0,
      recommendationKey: financial.recommendationKey || "hold",
      numberOfAnalysts: financial.numberOfAnalystOpinions || 0,
      institutionalOwnership: keyStats.heldPercentInstitutions ? keyStats.heldPercentInstitutions * 100 : 0,
      insiderOwnership: keyStats.heldPercentInsiders ? keyStats.heldPercentInsiders * 100 : 0,
      earningsDate: null,
      earningsQuarterlyGrowth: keyStats.earningsQuarterlyGrowth ? keyStats.earningsQuarterlyGrowth * 100 : 0,
      lastUpdated: new Date().toISOString(),
    };

    setCachedData(cacheKey, fundamentals);
    return fundamentals;
  } catch (error) {
    console.error(`Error fetching stock details for ${symbol}:`, error);
    return null;
  }
}

export async function getMarketIndices(): Promise<MarketIndex[]> {
  const indexSymbols = [
    { symbol: "^GSPC", name: "S&P 500" },
    { symbol: "^DJI", name: "Dow Jones" },
    { symbol: "^IXIC", name: "NASDAQ" },
    { symbol: "^RUT", name: "Russell 2000" },
    { symbol: "^VIX", name: "Volatility Index" },
  ];

  try {
    const cacheKey = "market_indices";
    const cached = getCachedData<MarketIndex[]>(cacheKey);
    if (cached) return cached;

    const results = await Promise.all(
      indexSymbols.map(async (idx) => {
        try {
          const quote: any = await yahooFinance.quote(idx.symbol);
          return {
            symbol: idx.symbol.replace("^", ""),
            name: idx.name,
            value: quote.regularMarketPrice || 0,
            change: quote.regularMarketChange || 0,
            changePercent: quote.regularMarketChangePercent || 0,
          };
        } catch {
          return { symbol: idx.symbol.replace("^", ""), name: idx.name, value: 0, change: 0, changePercent: 0 };
        }
      })
    );

    setCachedData(cacheKey, results);
    return results;
  } catch (error) {
    console.error("Error fetching market indices:", error);
    return [];
  }
}

export async function searchStocks(query: string): Promise<Stock[]> {
  try {
    const results: any = await yahooFinance.search(query, { newsCount: 0 });
    const symbols = (results.quotes || [])
      .filter((q: any) => q.quoteType === "EQUITY")
      .slice(0, 10)
      .map((q: any) => q.symbol);

    if (symbols.length === 0) return [];
    return await getMultipleQuotes(symbols);
  } catch (error) {
    console.error("Error searching stocks:", error);
    return [];
  }
}

export async function getTrendingStocks(): Promise<Stock[]> {
  const popularSymbols = [
    "AAPL", "MSFT", "GOOGL", "AMZN", "NVDA", "META", "TSLA",
    "JPM", "JNJ", "V", "UNH", "HD", "PG", "MA", "NFLX",
    "AMD", "INTC", "CRM", "BA", "GS", "XOM", "CVX"
  ];
  return await getMultipleQuotes(popularSymbols);
}

export async function getSparklineData(symbol: string): Promise<number[]> {
  try {
    const historical = await getHistoricalData(symbol, "1M");
    return historical.slice(-12).map((d) => d.close);
  } catch {
    return [];
  }
}

export function getDefaultSymbols(): string[] {
  return [
    "AAPL", "MSFT", "GOOGL", "AMZN", "NVDA", "META", "TSLA",
    "JPM", "JNJ", "V", "UNH", "HD", "PG", "MA", "NFLX"
  ];
}
