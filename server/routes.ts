import type { Express } from "express";
import { createServer, type Server } from "http";
import { getStocks, getStockBySymbol, getMarketIndices, searchStocks, getStockFundamentals, getEarningsHistory, getDividendHistory, getInsiderTransactions, getInstitutionalHolders, getSectorPerformance, getAllSymbols } from "./data/stocks";
import { getNews, getNewsBySymbol } from "./data/news";
import { generateChartData } from "./data/charts";
import { generateStockPrediction, analyzeSentiment, generateComprehensiveAnalysis } from "./services/gemini";
import { analyzeFinancialSentiment, analyzeMultipleTexts } from "./services/huggingface";
import { stockSearchSchema, predictionRequestSchema, sentimentAnalysisSchema, analysisRequestSchema } from "@shared/schema";

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

  // Get all stock symbols
  app.get("/api/symbols", (req, res) => {
    try {
      const symbols = getAllSymbols();
      res.json(symbols);
    } catch (error) {
      console.error("Error fetching symbols:", error);
      res.status(500).json({ error: "Failed to fetch symbols" });
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

  // Get stock fundamentals (ALL details)
  app.get("/api/stocks/:symbol/fundamentals", (req, res) => {
    try {
      const { symbol } = req.params;
      const fundamentals = getStockFundamentals(symbol.toUpperCase());
      
      if (!fundamentals) {
        res.status(404).json({ error: "Stock not found" });
        return;
      }
      
      res.json(fundamentals);
    } catch (error) {
      console.error("Error fetching fundamentals:", error);
      res.status(500).json({ error: "Failed to fetch fundamentals" });
    }
  });

  // Get stock earnings history
  app.get("/api/stocks/:symbol/earnings", (req, res) => {
    try {
      const { symbol } = req.params;
      const quarters = parseInt(req.query.quarters as string) || 4;
      const earnings = getEarningsHistory(symbol.toUpperCase(), quarters);
      
      if (earnings.length === 0) {
        res.status(404).json({ error: "Stock not found" });
        return;
      }
      
      res.json(earnings);
    } catch (error) {
      console.error("Error fetching earnings:", error);
      res.status(500).json({ error: "Failed to fetch earnings" });
    }
  });

  // Get stock dividend history
  app.get("/api/stocks/:symbol/dividends", (req, res) => {
    try {
      const { symbol } = req.params;
      const count = parseInt(req.query.count as string) || 8;
      const dividends = getDividendHistory(symbol.toUpperCase(), count);
      
      if (dividends.length === 0) {
        res.status(404).json({ error: "Stock not found" });
        return;
      }
      
      res.json(dividends);
    } catch (error) {
      console.error("Error fetching dividends:", error);
      res.status(500).json({ error: "Failed to fetch dividends" });
    }
  });

  // Get insider transactions
  app.get("/api/stocks/:symbol/insiders", (req, res) => {
    try {
      const { symbol } = req.params;
      const count = parseInt(req.query.count as string) || 10;
      const transactions = getInsiderTransactions(symbol.toUpperCase(), count);
      
      if (transactions.length === 0) {
        res.status(404).json({ error: "Stock not found" });
        return;
      }
      
      res.json(transactions);
    } catch (error) {
      console.error("Error fetching insider transactions:", error);
      res.status(500).json({ error: "Failed to fetch insider transactions" });
    }
  });

  // Get institutional holders
  app.get("/api/stocks/:symbol/institutions", (req, res) => {
    try {
      const { symbol } = req.params;
      const holders = getInstitutionalHolders(symbol.toUpperCase());
      
      if (holders.length === 0) {
        res.status(404).json({ error: "Stock not found" });
        return;
      }
      
      res.json(holders);
    } catch (error) {
      console.error("Error fetching institutional holders:", error);
      res.status(500).json({ error: "Failed to fetch institutional holders" });
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

  // Get sector performance
  app.get("/api/sectors", (req, res) => {
    try {
      const sectors = getSectorPerformance();
      res.json(sectors);
    } catch (error) {
      console.error("Error fetching sectors:", error);
      res.status(500).json({ error: "Failed to fetch sector performance" });
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

  // Get AI prediction for a stock (Gemini)
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

  // Get comprehensive AI analysis (Gemini)
  app.get("/api/analysis/:symbol", async (req, res) => {
    try {
      const { symbol } = req.params;
      const fundamentals = getStockFundamentals(symbol.toUpperCase());
      
      if (!fundamentals) {
        res.status(404).json({ error: "Stock not found" });
        return;
      }
      
      const analysis = await generateComprehensiveAnalysis(fundamentals);
      res.json(analysis);
    } catch (error) {
      console.error("Error generating analysis:", error);
      res.status(500).json({ error: "Failed to generate analysis" });
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
      res.json({ ...sentiment, model: "ProsusAI/finbert" });
    } catch (error) {
      console.error("Error analyzing sentiment:", error);
      res.status(500).json({ error: "Failed to analyze sentiment" });
    }
  });

  // Batch sentiment analysis using HuggingFace
  app.post("/api/sentiment/batch", async (req, res) => {
    try {
      const { texts } = req.body;
      if (!Array.isArray(texts) || texts.length === 0) {
        res.status(400).json({ error: "texts array is required" });
        return;
      }
      
      const results = await analyzeMultipleTexts(texts.slice(0, 10)); // Limit to 10
      res.json(results.map(r => ({ ...r, model: "ProsusAI/finbert" })));
    } catch (error) {
      console.error("Error batch analyzing sentiment:", error);
      res.status(500).json({ error: "Failed to analyze sentiment" });
    }
  });

  // Health check endpoint for deployment
  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "healthy", 
      timestamp: new Date().toISOString(),
      services: {
        gemini: !!process.env.GEMINI_API_KEY,
        huggingface: !!process.env.HUGGINGFACE_API_KEY,
      }
    });
  });

  return httpServer;
}
