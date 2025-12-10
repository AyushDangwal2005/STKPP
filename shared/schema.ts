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

// Stock data types (in-memory, not persisted)
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

export type StockSearchRequest = z.infer<typeof stockSearchSchema>;
export type PredictionRequest = z.infer<typeof predictionRequestSchema>;
export type SentimentAnalysisRequest = z.infer<typeof sentimentAnalysisSchema>;
