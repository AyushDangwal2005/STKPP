import { sql } from "drizzle-orm";
import { pgTable, text, varchar, real, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Comprehensive Stock data types
export interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  sector: string;
  exchange: string;
  sparklineData: number[];
}

// Extended stock fundamentals with ALL details
export interface StockFundamentals {
  symbol: string;
  name: string;
  description: string;
  sector: string;
  industry: string;
  exchange: string;
  currency: string;
  country: string;
  website: string;
  employees: number;
  ceo: string;
  
  // Price metrics
  price: number;
  change: number;
  changePercent: number;
  previousClose: number;
  open: number;
  dayHigh: number;
  dayLow: number;
  
  // 52-week range
  fiftyTwoWeekHigh: number;
  fiftyTwoWeekLow: number;
  fiftyTwoWeekChange: number;
  
  // Volume metrics
  volume: number;
  avgVolume: number;
  avgVolume10Day: number;
  
  // Market cap and shares
  marketCap: number;
  sharesOutstanding: number;
  sharesFloat: number;
  sharesShort: number;
  shortRatio: number;
  
  // Valuation metrics
  peRatio: number;
  forwardPE: number;
  pegRatio: number;
  priceToSales: number;
  priceToBook: number;
  enterpriseValue: number;
  evToRevenue: number;
  evToEbitda: number;
  
  // Profitability metrics
  profitMargin: number;
  operatingMargin: number;
  grossMargin: number;
  returnOnAssets: number;
  returnOnEquity: number;
  
  // Income statement
  revenue: number;
  revenuePerShare: number;
  revenueGrowth: number;
  grossProfit: number;
  ebitda: number;
  netIncome: number;
  eps: number;
  epsGrowth: number;
  
  // Balance sheet
  totalCash: number;
  totalDebt: number;
  debtToEquity: number;
  currentRatio: number;
  quickRatio: number;
  bookValue: number;
  
  // Dividends
  dividendRate: number;
  dividendYield: number;
  payoutRatio: number;
  exDividendDate: string | null;
  dividendDate: string | null;
  fiveYearDividendYield: number;
  
  // Technical indicators
  beta: number;
  fiftyDayMA: number;
  twoHundredDayMA: number;
  
  // Analyst recommendations
  targetHighPrice: number;
  targetLowPrice: number;
  targetMeanPrice: number;
  targetMedianPrice: number;
  recommendationMean: number;
  recommendationKey: string;
  numberOfAnalysts: number;
  
  // Ownership
  institutionalOwnership: number;
  insiderOwnership: number;
  
  // Earnings
  earningsDate: string | null;
  earningsQuarterlyGrowth: number;
  
  // Dates
  lastUpdated: string;
}

// Earnings data
export interface EarningsData {
  symbol: string;
  quarter: string;
  date: string;
  actualEPS: number;
  estimatedEPS: number;
  surprise: number;
  surprisePercent: number;
  revenue: number;
  estimatedRevenue: number;
}

// Dividend history
export interface DividendHistory {
  symbol: string;
  date: string;
  amount: number;
  type: string;
}

// Insider transaction
export interface InsiderTransaction {
  symbol: string;
  name: string;
  title: string;
  transactionDate: string;
  transactionType: "buy" | "sell";
  shares: number;
  price: number;
  value: number;
}

// Institutional holder
export interface InstitutionalHolder {
  symbol: string;
  holder: string;
  shares: number;
  dateReported: string;
  percentHeld: number;
  value: number;
}

export interface NewsArticle {
  id: string;
  title: string;
  source: string;
  timestamp: string;
  summary: string;
  sentiment: "positive" | "negative" | "neutral";
  sentimentScore: number;
  url: string;
  relatedSymbols: string[];
  imageUrl?: string;
}

export interface AIPrediction {
  symbol: string;
  currentPrice: number;
  predictedPrice: number;
  predictedChange: number;
  confidence: number;
  timeframe: string;
  reasoning: string[];
  lastUpdated: string;
  sentiment: "bullish" | "bearish" | "neutral";
}

// AI Analysis from Gemini
export interface AIAnalysis {
  symbol: string;
  summary: string;
  technicalAnalysis: string;
  fundamentalAnalysis: string;
  risks: string[];
  opportunities: string[];
  recommendation: "strong_buy" | "buy" | "hold" | "sell" | "strong_sell";
  confidenceScore: number;
  lastUpdated: string;
}

// Sentiment analysis from HuggingFace
export interface SentimentResult {
  text: string;
  sentiment: "positive" | "negative" | "neutral";
  score: number;
  model: string;
}

export interface MarketIndex {
  symbol: string;
  name: string;
  value: number;
  change: number;
  changePercent: number;
}

export interface ChartDataPoint {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

// Sector performance
export interface SectorPerformance {
  sector: string;
  change: number;
  changePercent: number;
  marketCap: number;
  volume: number;
}

// Market summary
export interface MarketSummary {
  indices: MarketIndex[];
  sectors: SectorPerformance[];
  topGainers: Stock[];
  topLosers: Stock[];
  mostActive: Stock[];
  marketStatus: "open" | "closed" | "pre-market" | "after-hours";
  lastUpdated: string;
}

// Watchlist for future persistence
export const watchlist = pgTable("watchlist", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  symbol: text("symbol").notNull(),
  addedAt: timestamp("added_at").defaultNow(),
});

export const insertWatchlistSchema = createInsertSchema(watchlist).pick({
  userId: true,
  symbol: true,
});

export type InsertWatchlist = z.infer<typeof insertWatchlistSchema>;
export type Watchlist = typeof watchlist.$inferSelect;

// API request/response schemas
export const stockSearchSchema = z.object({
  query: z.string().min(1).max(100),
});

export const predictionRequestSchema = z.object({
  symbol: z.string().min(1).max(10),
  includeNews: z.boolean().optional(),
});

export const sentimentAnalysisSchema = z.object({
  text: z.string().min(1).max(5000),
});

export const analysisRequestSchema = z.object({
  symbol: z.string().min(1).max(10),
  includeNews: z.boolean().optional(),
  includeSentiment: z.boolean().optional(),
});

export type StockSearchRequest = z.infer<typeof stockSearchSchema>;
export type PredictionRequest = z.infer<typeof predictionRequestSchema>;
export type SentimentAnalysisRequest = z.infer<typeof sentimentAnalysisSchema>;
export type AnalysisRequest = z.infer<typeof analysisRequestSchema>;
