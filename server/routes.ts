import type { Express } from "express";
import { createServer, type Server } from "http";
import { getQuote, getMultipleQuotes, getHistoricalData, getStockDetails, getMarketIndices as getRealMarketIndices, searchStocks as searchRealStocks, getTrendingStocks, getSparklineData, getDefaultSymbols } from "./services/stockData";
import { getNews, getNewsBySymbol } from "./data/news";
import { generateStockPrediction, analyzeSentiment, generateComprehensiveAnalysis } from "./services/gemini";
import { analyzeFinancialSentiment, analyzeMultipleTexts } from "./services/huggingface";
import { stockSearchSchema, sentimentAnalysisSchema } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.get("/api/stocks", async (req, res) => {
    try {
      const stocks = await getTrendingStocks();
      const stocksWithSparkline = await Promise.all(
        stocks.map(async (stock) => {
          const sparklineData = await getSparklineData(stock.symbol);
          return { ...stock, sparklineData };
        })
      );
      res.json(stocksWithSparkline);
    } catch (error) {
      console.error("Error fetching stocks:", error);
      res.status(500).json({ error: "Failed to fetch stocks" });
    }
  });

  app.get("/api/symbols", (req, res) => {
    try {
      const symbols = getDefaultSymbols();
      res.json(symbols);
    } catch (error) {
      console.error("Error fetching symbols:", error);
      res.status(500).json({ error: "Failed to fetch symbols" });
    }
  });

  app.get("/api/stocks/search", async (req, res) => {
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
      
      const stocks = await searchRealStocks(query);
      res.json(stocks);
    } catch (error) {
      console.error("Error searching stocks:", error);
      res.status(500).json({ error: "Failed to search stocks" });
    }
  });

  app.get("/api/stocks/:symbol", async (req, res) => {
    try {
      const { symbol } = req.params;
      const stock = await getQuote(symbol.toUpperCase());
      
      if (!stock) {
        res.status(404).json({ error: "Stock not found" });
        return;
      }
      
      const sparklineData = await getSparklineData(symbol.toUpperCase());
      res.json({ ...stock, sparklineData });
    } catch (error) {
      console.error("Error fetching stock:", error);
      res.status(500).json({ error: "Failed to fetch stock" });
    }
  });

  app.get("/api/stocks/:symbol/fundamentals", async (req, res) => {
    try {
      const { symbol } = req.params;
      const fundamentals = await getStockDetails(symbol.toUpperCase());
      
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

  app.get("/api/stocks/:symbol/chart", async (req, res) => {
    try {
      const { symbol } = req.params;
      const range = (req.query.range as string) || "1M";
      
      const chartData = await getHistoricalData(symbol.toUpperCase(), range);
      if (chartData.length === 0) {
        res.status(404).json({ error: "Chart data not found" });
        return;
      }
      
      res.json(chartData);
    } catch (error) {
      console.error("Error fetching chart data:", error);
      res.status(500).json({ error: "Failed to fetch chart data" });
    }
  });

  app.get("/api/indices", async (req, res) => {
    try {
      const indices = await getRealMarketIndices();
      res.json(indices);
    } catch (error) {
      console.error("Error fetching indices:", error);
      res.status(500).json({ error: "Failed to fetch indices" });
    }
  });

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

  app.get("/api/prediction/:symbol", async (req, res) => {
    try {
      const { symbol } = req.params;
      const stock = await getQuote(symbol.toUpperCase());
      
      if (!stock) {
        res.status(404).json({ error: "Stock not found" });
        return;
      }
      
      const sparklineData = await getSparklineData(symbol.toUpperCase());
      const stockWithData = { ...stock, sparklineData };
      const prediction = await generateStockPrediction(stockWithData);
      res.json(prediction);
    } catch (error) {
      console.error("Error generating prediction:", error);
      res.status(500).json({ error: "Failed to generate prediction" });
    }
  });

  app.get("/api/analysis/:symbol", async (req, res) => {
    try {
      const { symbol } = req.params;
      const fundamentals = await getStockDetails(symbol.toUpperCase());
      
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

  app.post("/api/sentiment/batch", async (req, res) => {
    try {
      const { texts } = req.body;
      if (!Array.isArray(texts) || texts.length === 0) {
        res.status(400).json({ error: "texts array is required" });
        return;
      }
      
      const results = await analyzeMultipleTexts(texts.slice(0, 10));
      res.json(results.map(r => ({ ...r, model: "ProsusAI/finbert" })));
    } catch (error) {
      console.error("Error batch analyzing sentiment:", error);
      res.status(500).json({ error: "Failed to analyze sentiment" });
    }
  });

  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "healthy", 
      timestamp: new Date().toISOString(),
      services: {
        gemini: !!process.env.GEMINI_API_KEY,
        yahooFinance: true,
      }
    });
  });

  return httpServer;
}
