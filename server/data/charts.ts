import type { ChartDataPoint } from "@shared/schema";

export function generateChartData(symbol: string, range: string = "1M"): ChartDataPoint[] {
  const data: ChartDataPoint[] = [];
  
  // Base price varies by symbol (deterministic based on symbol hash)
  const symbolHash = symbol.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const basePrice = 50 + (symbolHash % 500);
  
  let points: number;
  let timeFormat: (i: number, total: number) => string;
  
  switch (range) {
    case "1D":
      points = 78; // Trading minutes in a day
      timeFormat = (i) => {
        const hour = Math.floor(9.5 + i / 12);
        const minute = (i % 12) * 5;
        return `${hour}:${minute.toString().padStart(2, "0")}`;
      };
      break;
    case "1W":
      points = 35; // 5 days * 7 intervals
      timeFormat = (i) => {
        const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
        return days[Math.floor(i / 7)] || "Fri";
      };
      break;
    case "1M":
      points = 22; // Trading days in a month
      timeFormat = (i, total) => {
        const date = new Date();
        date.setDate(date.getDate() - (total - i));
        return `${date.getMonth() + 1}/${date.getDate()}`;
      };
      break;
    case "3M":
      points = 65; // ~3 months of trading days
      timeFormat = (i, total) => {
        const date = new Date();
        date.setDate(date.getDate() - (total - i));
        return `${date.getMonth() + 1}/${date.getDate()}`;
      };
      break;
    case "1Y":
      points = 252; // Trading days in a year
      timeFormat = (i) => {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const monthIndex = Math.floor(i / 21) % 12;
        return months[monthIndex];
      };
      break;
    case "ALL":
      points = 500; // ~2 years
      timeFormat = (i) => {
        const date = new Date();
        date.setMonth(date.getMonth() - Math.floor((500 - i) / 21));
        return `${date.getFullYear()}`;
      };
      break;
    default:
      points = 22;
      timeFormat = (i, total) => {
        const date = new Date();
        date.setDate(date.getDate() - (total - i));
        return `${date.getMonth() + 1}/${date.getDate()}`;
      };
  }
  
  let currentPrice = basePrice;
  const volatility = 0.02 + Math.random() * 0.03;
  
  for (let i = 0; i < points; i++) {
    const change = (Math.random() - 0.5) * 2 * currentPrice * volatility;
    const open = currentPrice;
    const close = currentPrice + change;
    const high = Math.max(open, close) + Math.random() * Math.abs(change) * 0.5;
    const low = Math.min(open, close) - Math.random() * Math.abs(change) * 0.5;
    
    data.push({
      time: timeFormat(i, points),
      open: Math.round(open * 100) / 100,
      high: Math.round(high * 100) / 100,
      low: Math.round(low * 100) / 100,
      close: Math.round(close * 100) / 100,
      volume: Math.floor(Math.random() * 10000000) + 1000000,
    });
    
    currentPrice = close;
  }
  
  return data;
}
