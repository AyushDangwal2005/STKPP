import type { Express } from "express";
import { createServer, type Server } from "http";
import { getStocks, getStockBySymbol, getMarketIndices, searchStocks } from "./data/stocks";
import { getNews, getNewsBySymbol } from "./data/news";
import { generateChartData } from "./data/charts";
import { generateStockPrediction, analyzeSentiment } from "./services/gemini";
import { analyzeFinancialSentiment } from "./services/huggingface";
import { stockSearchSchema, predictionRequestSchema, sentimentAnalysisSchema } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Get all stocks
  app.get("/api/stocks", (req, res) => {
    try {
      const stocks = getStocks();
      res.json(stocks);
    } catch (error) {
      console.error("Error fetching stocks:", error);
      res.status(500).json({ error: "Failed to fetch stocks" });
    }
  });

  // Search stocks
  app.get("/api/stocks/search", (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        res.status(400).json({ error: "Query parameter 'q' is required" });
        return;
      }
      
      const result = stockSearchSchema.safeParse({ query });
      if (!result.success) {
        res.status(400).json({ error: "Invalid search query" });
        return;
      }
      
      const stocks = searchStocks(query);
      res.json(stocks);
    } catch (error) {
      console.error("Error searching stocks:", error);
      res.status(500).json({ error: "Failed to search stocks" });
    }
  });

  // Get single stock
  app.get("/api/stocks/:symbol", (req, res) => {
    try {
      const { symbol } = req.params;
      const stock = getStockBySymbol(symbol.toUpperCase());
      
      if (!stock) {
        res.status(404).json({ error: "Stock not found" });
        return;
      }
      
      res.json(stock);
    } catch (error) {
      console.error("Error fetching stock:", error);
      res.status(500).json({ error: "Failed to fetch stock" });
    }
  });

  // Get stock chart data
  app.get("/api/stocks/:symbol/chart", (req, res) => {
    try {
      const { symbol } = req.params;
      const range = (req.query.range as string) || "1M";
      
      const stock = getStockBySymbol(symbol.toUpperCase());
      if (!stock) {
        res.status(404).json({ error: "Stock not found" });
        return;
      }
      
      const chartData = generateChartData(symbol.toUpperCase(), range);
      res.json(chartData);
    } catch (error) {
      console.error("Error fetching chart data:", error);
      res.status(500).json({ error: "Failed to fetch chart data" });
    }
  });

  // Get market indices
  app.get("/api/indices", (req, res) => {
    try {
      const indices = getMarketIndices();
      res.json(indices);
    } catch (error) {
      console.error("Error fetching indices:", error);
      res.status(500).json({ error: "Failed to fetch indices" });
    }
  });

  // Get news
  app.get("/api/news", (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 20;
      const news = getNews(limit);
      res.json(news);
    } catch (error) {
      console.error("Error fetching news:", error);
      res.status(500).json({ error: "Failed to fetch news" });
    }
  });

  // Get news by symbol
  app.get("/api/news/:symbol", (req, res) => {
    try {
      const { symbol } = req.params;
      const limit = parseInt(req.query.limit as string) || 10;
      const news = getNewsBySymbol(symbol.toUpperCase(), limit);
      res.json(news);
    } catch (error) {
      console.error("Error fetching news:", error);
      res.status(500).json({ error: "Failed to fetch news" });
    }
  });

  // Get AI prediction for a stock
  app.get("/api/prediction/:symbol", async (req, res) => {
    try {
      const { symbol } = req.params;
      const stock = getStockBySymbol(symbol.toUpperCase());
      
      if (!stock) {
        res.status(404).json({ error: "Stock not found" });
        return;
      }
      
      const prediction = await generateStockPrediction(stock);
      res.json(prediction);
    } catch (error) {
      console.error("Error generating prediction:", error);
      res.status(500).json({ error: "Failed to generate prediction" });
    }
  });

  // Analyze sentiment using Gemini
  app.post("/api/sentiment/gemini", async (req, res) => {
    try {
      const result = sentimentAnalysisSchema.safeParse(req.body);
      if (!result.success) {
        res.status(400).json({ error: "Invalid request body" });
        return;
      }
      
      const sentiment = await analyzeSentiment(result.data.text);
      res.json(sentiment);
    } catch (error) {
      console.error("Error analyzing sentiment:", error);
      res.status(500).json({ error: "Failed to analyze sentiment" });
    }
  });

  // Analyze sentiment using HuggingFace FinBERT
  app.post("/api/sentiment/huggingface", async (req, res) => {
    try {
      const result = sentimentAnalysisSchema.safeParse(req.body);
      if (!result.success) {
        res.status(400).json({ error: "Invalid request body" });
        return;
      }
      
      const sentiment = await analyzeFinancialSentiment(result.data.text);
      res.json(sentiment);
    } catch (error) {
      console.error("Error analyzing sentiment:", error);
      res.status(500).json({ error: "Failed to analyze sentiment" });
    }
  });

  return httpServer;
}
