import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  TrendingDown, 
  Building2, 
  Users, 
  Globe, 
  DollarSign,
  BarChart3,
  PieChart,
  Activity,
  Target,
  AlertTriangle,
  Lightbulb,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Minus
} from "lucide-react";
import { StockChart } from "@/components/stock-chart";
import type { 
  StockFundamentals, 
  ChartDataPoint, 
  AIAnalysis, 
  EarningsData, 
  DividendHistory, 
  InsiderTransaction, 
  InstitutionalHolder,
  NewsArticle 
} from "@shared/schema";

function formatNumber(value: number, decimals: number = 2): string {
  return value.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

function formatLargeNumber(value: number): string {
  if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
  return `$${value.toLocaleString()}`;
}

function formatPercent(value: number): string {
  return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
}

function MetricRow({ label, value, suffix = "" }: { label: string; value: string | number; suffix?: string }) {
  return (
    <div className="flex justify-between py-2 border-b border-border/50 last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}{suffix}</span>
    </div>
  );
}

function MetricCard({ title, value, change, icon: Icon }: { title: string; value: string; change?: number; icon?: any }) {
  return (
    <Card>
      <CardContent className="pt-4">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm text-muted-foreground">{title}</span>
          {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
        </div>
        <div className="mt-2">
          <span className="text-2xl font-bold">{value}</span>
          {change !== undefined && (
            <span className={`ml-2 text-sm ${change >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
              {formatPercent(change)}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function StockDetails() {
  const params = useParams<{ symbol: string }>();
  const symbol = params.symbol?.toUpperCase() || "";

  const { data: fundamentals, isLoading: fundamentalsLoading } = useQuery<StockFundamentals>({
    queryKey: ["/api/stocks", symbol, "fundamentals"],
    enabled: !!symbol,
  });

  const { data: chartData = [], isLoading: chartLoading } = useQuery<ChartDataPoint[]>({
    queryKey: ["/api/stocks", symbol, "chart"],
    enabled: !!symbol,
  });

  const { data: analysis, isLoading: analysisLoading, refetch: refetchAnalysis } = useQuery<AIAnalysis>({
    queryKey: ["/api/analysis", symbol],
    enabled: !!symbol,
  });

  const { data: earnings = [] } = useQuery<EarningsData[]>({
    queryKey: ["/api/stocks", symbol, "earnings"],
    enabled: !!symbol,
  });

  const { data: dividends = [] } = useQuery<DividendHistory[]>({
    queryKey: ["/api/stocks", symbol, "dividends"],
    enabled: !!symbol,
  });

  const { data: insiders = [] } = useQuery<InsiderTransaction[]>({
    queryKey: ["/api/stocks", symbol, "insiders"],
    enabled: !!symbol,
  });

  const { data: institutions = [] } = useQuery<InstitutionalHolder[]>({
    queryKey: ["/api/stocks", symbol, "institutions"],
    enabled: !!symbol,
  });

  const { data: news = [] } = useQuery<NewsArticle[]>({
    queryKey: ["/api/news", symbol],
    enabled: !!symbol,
  });

  if (!symbol) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Select a stock to view details</p>
      </div>
    );
  }

  if (fundamentalsLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-32 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-24" />)}
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!fundamentals) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Stock not found</p>
      </div>
    );
  }

  const priceChangeColor = fundamentals.changePercent >= 0 
    ? "text-green-600 dark:text-green-400" 
    : "text-red-600 dark:text-red-400";

  const recommendationColors: Record<string, string> = {
    strong_buy: "bg-green-600",
    buy: "bg-green-500",
    hold: "bg-yellow-500",
    sell: "bg-red-500",
    strong_sell: "bg-red-600",
  };

  return (
    <ScrollArea className="h-full">
      <div className="p-4 md:p-6 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl md:text-3xl font-bold" data-testid="text-stock-symbol">{fundamentals.symbol}</h1>
              <Badge variant="secondary">{fundamentals.exchange}</Badge>
              <Badge variant="outline">{fundamentals.sector}</Badge>
            </div>
            <p className="text-lg text-muted-foreground mt-1" data-testid="text-stock-name">{fundamentals.name}</p>
            <p className="text-sm text-muted-foreground mt-2 max-w-2xl">{fundamentals.description}</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold" data-testid="text-stock-price">
              ${formatNumber(fundamentals.price)}
            </div>
            <div className={`flex items-center justify-end gap-1 ${priceChangeColor}`}>
              {fundamentals.change >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
              <span className="font-medium">
                {fundamentals.change >= 0 ? "+" : ""}{formatNumber(fundamentals.change)} ({formatPercent(fundamentals.changePercent)})
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard title="Market Cap" value={formatLargeNumber(fundamentals.marketCap)} icon={DollarSign} />
          <MetricCard title="P/E Ratio" value={formatNumber(fundamentals.peRatio)} icon={BarChart3} />
          <MetricCard title="EPS" value={`$${formatNumber(fundamentals.eps)}`} change={fundamentals.epsGrowth} icon={TrendingUp} />
          <MetricCard title="Dividend Yield" value={`${formatNumber(fundamentals.dividendYield)}%`} icon={PieChart} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Price Chart</CardTitle>
              </CardHeader>
              <CardContent>
                <StockChart
                  symbol={symbol}
                  data={chartData}
                  isLoading={chartLoading}
                  currentPrice={fundamentals.price}
                  priceChange={fundamentals.change}
                />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between gap-2">
                <CardTitle className="text-lg">AI Analysis</CardTitle>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => refetchAnalysis()}
                  data-testid="button-refresh-analysis"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {analysisLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ) : analysis ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge className={recommendationColors[analysis.recommendation] || "bg-gray-500"}>
                      {analysis.recommendation.replace("_", " ").toUpperCase()}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {analysis.confidenceScore}% confidence
                    </span>
                  </div>
                  <p className="text-sm">{analysis.summary}</p>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-4 w-4 text-amber-500" />
                      <span className="text-sm font-medium">Risks</span>
                    </div>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {analysis.risks.slice(0, 3).map((risk, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-amber-500">-</span>
                          {risk}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Lightbulb className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium">Opportunities</span>
                    </div>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {analysis.opportunities.slice(0, 3).map((opp, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-green-500">+</span>
                          {opp}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">Analysis not available</p>
              )}
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="flex flex-wrap h-auto gap-1">
            <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
            <TabsTrigger value="valuation" data-testid="tab-valuation">Valuation</TabsTrigger>
            <TabsTrigger value="financials" data-testid="tab-financials">Financials</TabsTrigger>
            <TabsTrigger value="dividends" data-testid="tab-dividends">Dividends</TabsTrigger>
            <TabsTrigger value="ownership" data-testid="tab-ownership">Ownership</TabsTrigger>
            <TabsTrigger value="earnings" data-testid="tab-earnings">Earnings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    Price Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <MetricRow label="Previous Close" value={`$${formatNumber(fundamentals.previousClose)}`} />
                  <MetricRow label="Open" value={`$${formatNumber(fundamentals.open)}`} />
                  <MetricRow label="Day High" value={`$${formatNumber(fundamentals.dayHigh)}`} />
                  <MetricRow label="Day Low" value={`$${formatNumber(fundamentals.dayLow)}`} />
                  <MetricRow label="52-Week High" value={`$${formatNumber(fundamentals.fiftyTwoWeekHigh)}`} />
                  <MetricRow label="52-Week Low" value={`$${formatNumber(fundamentals.fiftyTwoWeekLow)}`} />
                  <MetricRow label="52-Week Change" value={formatPercent(fundamentals.fiftyTwoWeekChange)} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Volume & Shares
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <MetricRow label="Volume" value={fundamentals.volume.toLocaleString()} />
                  <MetricRow label="Avg Volume" value={fundamentals.avgVolume.toLocaleString()} />
                  <MetricRow label="Avg Vol (10D)" value={fundamentals.avgVolume10Day.toLocaleString()} />
                  <MetricRow label="Shares Outstanding" value={(fundamentals.sharesOutstanding / 1e9).toFixed(2)} suffix="B" />
                  <MetricRow label="Float" value={(fundamentals.sharesFloat / 1e9).toFixed(2)} suffix="B" />
                  <MetricRow label="Short Interest" value={(fundamentals.sharesShort / 1e6).toFixed(2)} suffix="M" />
                  <MetricRow label="Short Ratio" value={formatNumber(fundamentals.shortRatio)} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    Company Info
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <MetricRow label="Industry" value={fundamentals.industry} />
                  <MetricRow label="Exchange" value={fundamentals.exchange} />
                  <MetricRow label="Country" value={fundamentals.country} />
                  <MetricRow label="Currency" value={fundamentals.currency} />
                  <MetricRow label="Employees" value={fundamentals.employees.toLocaleString()} />
                  <MetricRow label="CEO" value={fundamentals.ceo} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Analyst Targets
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <MetricRow label="Target High" value={`$${formatNumber(fundamentals.targetHighPrice)}`} />
                  <MetricRow label="Target Mean" value={`$${formatNumber(fundamentals.targetMeanPrice)}`} />
                  <MetricRow label="Target Median" value={`$${formatNumber(fundamentals.targetMedianPrice)}`} />
                  <MetricRow label="Target Low" value={`$${formatNumber(fundamentals.targetLowPrice)}`} />
                  <MetricRow label="# of Analysts" value={fundamentals.numberOfAnalysts} />
                  <MetricRow label="Rating" value={fundamentals.recommendationKey.replace("_", " ")} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Technical Indicators</CardTitle>
                </CardHeader>
                <CardContent>
                  <MetricRow label="Beta" value={formatNumber(fundamentals.beta)} />
                  <MetricRow label="50-Day MA" value={`$${formatNumber(fundamentals.fiftyDayMA)}`} />
                  <MetricRow label="200-Day MA" value={`$${formatNumber(fundamentals.twoHundredDayMA)}`} />
                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>52-Week Range</span>
                    </div>
                    <div className="relative h-2 bg-muted rounded-full">
                      <div 
                        className="absolute h-2 w-2 bg-primary rounded-full top-0 -translate-x-1/2"
                        style={{ 
                          left: `${((fundamentals.price - fundamentals.fiftyTwoWeekLow) / (fundamentals.fiftyTwoWeekHigh - fundamentals.fiftyTwoWeekLow)) * 100}%` 
                        }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>${formatNumber(fundamentals.fiftyTwoWeekLow)}</span>
                      <span>${formatNumber(fundamentals.fiftyTwoWeekHigh)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="valuation" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Valuation Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <MetricRow label="P/E Ratio (TTM)" value={formatNumber(fundamentals.peRatio)} />
                  <MetricRow label="Forward P/E" value={formatNumber(fundamentals.forwardPE)} />
                  <MetricRow label="PEG Ratio" value={formatNumber(fundamentals.pegRatio)} />
                  <MetricRow label="Price/Sales" value={formatNumber(fundamentals.priceToSales)} />
                  <MetricRow label="Price/Book" value={formatNumber(fundamentals.priceToBook)} />
                  <MetricRow label="Enterprise Value" value={formatLargeNumber(fundamentals.enterpriseValue)} />
                  <MetricRow label="EV/Revenue" value={formatNumber(fundamentals.evToRevenue)} />
                  <MetricRow label="EV/EBITDA" value={formatNumber(fundamentals.evToEbitda)} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Profitability</CardTitle>
                </CardHeader>
                <CardContent>
                  <MetricRow label="Profit Margin" value={formatNumber(fundamentals.profitMargin)} suffix="%" />
                  <MetricRow label="Operating Margin" value={formatNumber(fundamentals.operatingMargin)} suffix="%" />
                  <MetricRow label="Gross Margin" value={formatNumber(fundamentals.grossMargin)} suffix="%" />
                  <MetricRow label="Return on Assets" value={formatNumber(fundamentals.returnOnAssets)} suffix="%" />
                  <MetricRow label="Return on Equity" value={formatNumber(fundamentals.returnOnEquity)} suffix="%" />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="financials" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Income Statement</CardTitle>
                </CardHeader>
                <CardContent>
                  <MetricRow label="Revenue (TTM)" value={formatLargeNumber(fundamentals.revenue)} />
                  <MetricRow label="Revenue/Share" value={`$${formatNumber(fundamentals.revenuePerShare)}`} />
                  <MetricRow label="Revenue Growth" value={formatPercent(fundamentals.revenueGrowth)} />
                  <MetricRow label="Gross Profit" value={formatLargeNumber(fundamentals.grossProfit)} />
                  <MetricRow label="EBITDA" value={formatLargeNumber(fundamentals.ebitda)} />
                  <MetricRow label="Net Income" value={formatLargeNumber(fundamentals.netIncome)} />
                  <MetricRow label="EPS (TTM)" value={`$${formatNumber(fundamentals.eps)}`} />
                  <MetricRow label="EPS Growth" value={formatPercent(fundamentals.epsGrowth)} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Balance Sheet</CardTitle>
                </CardHeader>
                <CardContent>
                  <MetricRow label="Total Cash" value={formatLargeNumber(fundamentals.totalCash)} />
                  <MetricRow label="Total Debt" value={formatLargeNumber(fundamentals.totalDebt)} />
                  <MetricRow label="Debt/Equity" value={formatNumber(fundamentals.debtToEquity)} />
                  <MetricRow label="Current Ratio" value={formatNumber(fundamentals.currentRatio)} />
                  <MetricRow label="Quick Ratio" value={formatNumber(fundamentals.quickRatio)} />
                  <MetricRow label="Book Value/Share" value={`$${formatNumber(fundamentals.bookValue)}`} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="dividends" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Dividend Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <MetricRow label="Dividend Rate" value={`$${formatNumber(fundamentals.dividendRate)}`} />
                  <MetricRow label="Dividend Yield" value={formatNumber(fundamentals.dividendYield)} suffix="%" />
                  <MetricRow label="Payout Ratio" value={formatNumber(fundamentals.payoutRatio)} suffix="%" />
                  <MetricRow label="5Y Avg Yield" value={formatNumber(fundamentals.fiveYearDividendYield)} suffix="%" />
                  <MetricRow label="Ex-Dividend Date" value={fundamentals.exDividendDate || "N/A"} />
                  <MetricRow label="Next Dividend Date" value={fundamentals.dividendDate || "N/A"} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Dividend History</CardTitle>
                </CardHeader>
                <CardContent>
                  {dividends.length > 0 ? (
                    <div className="space-y-2">
                      {dividends.slice(0, 6).map((div, i) => (
                        <div key={i} className="flex justify-between py-2 border-b border-border/50 last:border-0">
                          <span className="text-muted-foreground">{div.date}</span>
                          <span className="font-medium">${formatNumber(div.amount)}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm">No dividend history available</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="ownership" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Ownership Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <MetricRow label="Institutional Ownership" value={formatNumber(fundamentals.institutionalOwnership)} suffix="%" />
                  <MetricRow label="Insider Ownership" value={formatNumber(fundamentals.insiderOwnership)} suffix="%" />
                  <div className="mt-4">
                    <div className="h-4 bg-muted rounded-full overflow-hidden flex">
                      <div 
                        className="bg-primary h-full" 
                        style={{ width: `${fundamentals.institutionalOwnership}%` }} 
                      />
                      <div 
                        className="bg-primary/60 h-full" 
                        style={{ width: `${fundamentals.insiderOwnership}%` }} 
                      />
                    </div>
                    <div className="flex gap-4 mt-2 text-xs">
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-primary rounded" />
                        <span>Institutional</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-primary/60 rounded" />
                        <span>Insider</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Top Institutional Holders</CardTitle>
                </CardHeader>
                <CardContent>
                  {institutions.length > 0 ? (
                    <div className="space-y-2">
                      {institutions.slice(0, 5).map((holder, i) => (
                        <div key={i} className="flex justify-between py-2 border-b border-border/50 last:border-0">
                          <span className="text-sm truncate max-w-[60%]">{holder.holder}</span>
                          <span className="text-sm font-medium">{formatNumber(holder.percentHeld)}%</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm">No institutional holder data available</p>
                  )}
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Recent Insider Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                  {insiders.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2 font-medium">Name</th>
                            <th className="text-left py-2 font-medium">Title</th>
                            <th className="text-left py-2 font-medium">Date</th>
                            <th className="text-left py-2 font-medium">Type</th>
                            <th className="text-right py-2 font-medium">Shares</th>
                            <th className="text-right py-2 font-medium">Value</th>
                          </tr>
                        </thead>
                        <tbody>
                          {insiders.slice(0, 5).map((tx, i) => (
                            <tr key={i} className="border-b border-border/50 last:border-0">
                              <td className="py-2">{tx.name}</td>
                              <td className="py-2 text-muted-foreground">{tx.title}</td>
                              <td className="py-2">{tx.transactionDate}</td>
                              <td className="py-2">
                                <Badge variant={tx.transactionType === "buy" ? "default" : "secondary"}>
                                  {tx.transactionType === "buy" ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                                  {tx.transactionType}
                                </Badge>
                              </td>
                              <td className="py-2 text-right">{tx.shares.toLocaleString()}</td>
                              <td className="py-2 text-right">{formatLargeNumber(tx.value)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm">No insider transaction data available</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="earnings" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Earnings Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <MetricRow label="Next Earnings Date" value={fundamentals.earningsDate || "TBD"} />
                  <MetricRow label="EPS (TTM)" value={`$${formatNumber(fundamentals.eps)}`} />
                  <MetricRow label="EPS Growth (QoQ)" value={formatPercent(fundamentals.earningsQuarterlyGrowth)} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Earnings History</CardTitle>
                </CardHeader>
                <CardContent>
                  {earnings.length > 0 ? (
                    <div className="space-y-3">
                      {earnings.slice(0, 4).map((earn, i) => (
                        <div key={i} className="p-3 bg-muted/50 rounded-md">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium">{earn.quarter}</span>
                            <Badge variant={earn.surprise >= 0 ? "default" : "destructive"}>
                              {earn.surprise >= 0 ? "Beat" : "Miss"} ({formatPercent(earn.surprisePercent)})
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="text-muted-foreground">Actual EPS:</span>
                              <span className="ml-2 font-medium">${formatNumber(earn.actualEPS)}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Est. EPS:</span>
                              <span className="ml-2">${formatNumber(earn.estimatedEPS)}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm">No earnings history available</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ScrollArea>
  );
}
