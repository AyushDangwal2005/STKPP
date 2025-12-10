import type { NewsArticle } from "@shared/schema";

const newsTemplates = [
  {
    titleTemplate: "{company} Reports Strong Q4 Earnings, Beats Estimates",
    summaryTemplate: "{company} announced quarterly earnings that exceeded analyst expectations, with revenue growth driven by strong demand in its core business segments. The company also raised its full-year guidance.",
    sentiment: "positive" as const,
    sentimentScore: 0.85,
  },
  {
    titleTemplate: "{company} Announces Major Partnership with Tech Giant",
    summaryTemplate: "In a strategic move, {company} has entered into a significant partnership that analysts believe will strengthen its market position and open new revenue streams in the coming quarters.",
    sentiment: "positive" as const,
    sentimentScore: 0.78,
  },
  {
    titleTemplate: "Analysts Upgrade {company} Stock on Growth Prospects",
    summaryTemplate: "Multiple Wall Street analysts have upgraded their ratings on {company}, citing improved fundamentals and positive market momentum. Price targets have been revised upward by an average of 15%.",
    sentiment: "positive" as const,
    sentimentScore: 0.72,
  },
  {
    titleTemplate: "{company} Faces Regulatory Scrutiny Over Business Practices",
    summaryTemplate: "Federal regulators have announced an investigation into {company}'s business practices, raising concerns among investors about potential fines and operational restrictions.",
    sentiment: "negative" as const,
    sentimentScore: -0.65,
  },
  {
    titleTemplate: "{company} Stock Drops After Missing Revenue Targets",
    summaryTemplate: "Shares of {company} fell sharply after the company reported quarterly revenue below expectations. Management cited challenging market conditions and supply chain issues.",
    sentiment: "negative" as const,
    sentimentScore: -0.72,
  },
  {
    titleTemplate: "{company} Announces Workforce Reduction Amid Restructuring",
    summaryTemplate: "{company} revealed plans to cut approximately 5% of its workforce as part of a broader cost-cutting initiative. The company expects to save $500 million annually.",
    sentiment: "negative" as const,
    sentimentScore: -0.55,
  },
  {
    titleTemplate: "Market Watch: {company} Trading Sideways Amid Economic Uncertainty",
    summaryTemplate: "{company} shares remained relatively flat as investors await more clarity on economic conditions and the company's strategic direction for the coming year.",
    sentiment: "neutral" as const,
    sentimentScore: 0.05,
  },
  {
    titleTemplate: "{company} Expands Into New Markets with Product Launch",
    summaryTemplate: "{company} has announced the expansion of its product line into new geographic markets, signaling confidence in long-term growth despite near-term headwinds.",
    sentiment: "positive" as const,
    sentimentScore: 0.68,
  },
  {
    titleTemplate: "Investors Eye {company} as Sector Rotation Continues",
    summaryTemplate: "Institutional investors are increasingly looking at {company} as market dynamics shift. Trading volume has increased significantly over the past week.",
    sentiment: "neutral" as const,
    sentimentScore: 0.15,
  },
  {
    titleTemplate: "{company} CEO Discusses AI Strategy in Investor Call",
    summaryTemplate: "During the latest investor call, {company}'s CEO outlined ambitious plans for artificial intelligence integration across the company's product portfolio.",
    sentiment: "positive" as const,
    sentimentScore: 0.62,
  },
];

const companies = [
  { name: "Apple", symbol: "AAPL" },
  { name: "Microsoft", symbol: "MSFT" },
  { name: "Google", symbol: "GOOGL" },
  { name: "Amazon", symbol: "AMZN" },
  { name: "Tesla", symbol: "TSLA" },
  { name: "NVIDIA", symbol: "NVDA" },
  { name: "Meta", symbol: "META" },
  { name: "Netflix", symbol: "NFLX" },
  { name: "JPMorgan", symbol: "JPM" },
  { name: "Goldman Sachs", symbol: "GS" },
];

const sources = [
  "Reuters",
  "Bloomberg",
  "CNBC",
  "Wall Street Journal",
  "Financial Times",
  "MarketWatch",
  "Yahoo Finance",
  "Barron's",
  "Investor's Business Daily",
  "The Motley Fool",
];

function generateTimeAgo(hoursAgo: number): string {
  const date = new Date();
  date.setHours(date.getHours() - hoursAgo);
  return date.toISOString();
}

export function getNews(limit: number = 20): NewsArticle[] {
  const news: NewsArticle[] = [];
  
  for (let i = 0; i < limit; i++) {
    const template = newsTemplates[Math.floor(Math.random() * newsTemplates.length)];
    const company = companies[Math.floor(Math.random() * companies.length)];
    const source = sources[Math.floor(Math.random() * sources.length)];
    
    news.push({
      id: `news-${i}-${Date.now()}`,
      title: template.titleTemplate.replace("{company}", company.name),
      source,
      timestamp: generateTimeAgo(Math.floor(Math.random() * 48)),
      summary: template.summaryTemplate.replace(/{company}/g, company.name),
      sentiment: template.sentiment,
      sentimentScore: template.sentimentScore + (Math.random() - 0.5) * 0.2,
      url: `https://example.com/news/${i}`,
      relatedSymbols: [company.symbol, ...companies.filter(c => c.symbol !== company.symbol).slice(0, Math.floor(Math.random() * 2)).map(c => c.symbol)],
    });
  }
  
  return news.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export function getNewsBySymbol(symbol: string, limit: number = 10): NewsArticle[] {
  const allNews = getNews(limit * 3);
  return allNews.filter(article => article.relatedSymbols.includes(symbol)).slice(0, limit);
}
