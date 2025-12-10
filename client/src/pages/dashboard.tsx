import { useState, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LayoutGrid, List, RefreshCw, Star, StarOff } from "lucide-react";
import { SearchBar } from "@/components/search-bar";
import { StockCard } from "@/components/stock-card";
import { StockTable } from "@/components/stock-table";
import { StockChart } from "@/components/stock-chart";
import { NewsCard } from "@/components/news-card";
import { AIPredictionPanel } from "@/components/ai-prediction-panel";
import { MarketIndices } from "@/components/market-indices";
import { cn } from "@/lib/utils";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Stock, NewsArticle, AIPrediction, MarketIndex, ChartDataPoint } from "@shared/schema";

interface DashboardProps {
  onSelectStock: (symbol: string) => void;
  selectedSymbol: string | null;
  watchlist: string[];
  onToggleWatchlist: (symbol: string) => void;
}

export function Dashboard({ 
  onSelectStock, 
  selectedSymbol, 
  watchlist,
  onToggleWatchlist 
}: DashboardProps) {
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  const { data: stocks = [], isLoading: stocksLoading } = useQuery<Stock[]>({
    queryKey: ["/api/stocks"],
  });

  const { data: indices = [], isLoading: indicesLoading } = useQuery<MarketIndex[]>({
    queryKey: ["/api/indices"],
  });

  const { data: news = [], isLoading: newsLoading } = useQuery<NewsArticle[]>({
    queryKey: ["/api/news"],
  });

  const { data: chartData = [], isLoading: chartLoading } = useQuery<ChartDataPoint[]>({
    queryKey: ["/api/stocks", selectedSymbol, "chart"],
    enabled: !!selectedSymbol,
  });

  const { 
    data: prediction, 
    isLoading: predictionLoading,
    error: predictionError,
    refetch: refetchPrediction
  } = useQuery<AIPrediction>({
    queryKey: ["/api/prediction", selectedSymbol],
    enabled: !!selectedSymbol,
  });

  const selectedStock = useMemo(() => 
    stocks.find(s => s.symbol === selectedSymbol),
    [stocks, selectedSymbol]
  );

  const isInWatchlist = selectedSymbol ? watchlist.includes(selectedSymbol) : false;

  const topGainers = useMemo(() => 
    [...stocks].sort((a, b) => b.changePercent - a.changePercent).slice(0, 5),
    [stocks]
  );

  const topLosers = useMemo(() => 
    [...stocks].sort((a, b) => a.changePercent - b.changePercent).slice(0, 5),
    [stocks]
  );

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 md:p-6 space-y-6 overflow-y-auto flex-1">
        <MarketIndices indices={indices} isLoading={indicesLoading} />

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 space-y-6 min-w-0">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <h2 className="text-xl font-semibold">Stocks</h2>
              <div className="flex items-center gap-2">
                <SearchBar
                  stocks={stocks}
                  onSelectStock={onSelectStock}
                  className="w-full sm:w-64"
                />
                <div className="flex gap-1">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="icon"
                    onClick={() => setViewMode("grid")}
                    data-testid="button-view-grid"
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "table" ? "default" : "ghost"}
                    size="icon"
                    onClick={() => setViewMode("table")}
                    data-testid="button-view-table"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {stocksLoading ? (
                  [...Array(6)].map((_, i) => (
                    <Skeleton key={i} className="h-32" />
                  ))
                ) : (
                  stocks.slice(0, 12).map((stock) => (
                    <StockCard
                      key={stock.symbol}
                      stock={stock}
                      onClick={() => onSelectStock(stock.symbol)}
                      isSelected={stock.symbol === selectedSymbol}
                    />
                  ))
                )}
              </div>
            ) : (
              <StockTable
                stocks={stocks}
                isLoading={stocksLoading}
                onSelectStock={onSelectStock}
                selectedSymbol={selectedSymbol || undefined}
              />
            )}

            {selectedSymbol && (
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <h2 className="text-xl font-semibold">{selectedSymbol} Chart</h2>
                  <Button
                    variant={isInWatchlist ? "default" : "outline"}
                    size="sm"
                    onClick={() => onToggleWatchlist(selectedSymbol)}
                    data-testid="button-toggle-watchlist"
                  >
                    {isInWatchlist ? (
                      <>
                        <StarOff className="h-4 w-4 mr-2" />
                        Remove from Watchlist
                      </>
                    ) : (
                      <>
                        <Star className="h-4 w-4 mr-2" />
                        Add to Watchlist
                      </>
                    )}
                  </Button>
                </div>
                <StockChart
                  symbol={selectedSymbol}
                  data={chartData}
                  isLoading={chartLoading}
                  currentPrice={selectedStock?.price}
                  priceChange={selectedStock?.change}
                />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-green-600 dark:text-green-400">
                    Top Gainers
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {stocksLoading ? (
                    [...Array(5)].map((_, i) => (
                      <Skeleton key={i} className="h-12" />
                    ))
                  ) : (
                    topGainers.map((stock) => (
                      <button
                        key={stock.symbol}
                        onClick={() => onSelectStock(stock.symbol)}
                        className="w-full flex items-center justify-between p-2 rounded-md hover-elevate active-elevate-2"
                        data-testid={`button-gainer-${stock.symbol}`}
                      >
                        <div className="text-left">
                          <div className="font-medium">{stock.symbol}</div>
                          <div className="text-sm text-muted-foreground">${stock.price.toFixed(2)}</div>
                        </div>
                        <span className="text-green-600 dark:text-green-400 font-medium">
                          +{stock.changePercent.toFixed(2)}%
                        </span>
                      </button>
                    ))
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-red-600 dark:text-red-400">
                    Top Losers
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {stocksLoading ? (
                    [...Array(5)].map((_, i) => (
                      <Skeleton key={i} className="h-12" />
                    ))
                  ) : (
                    topLosers.map((stock) => (
                      <button
                        key={stock.symbol}
                        onClick={() => onSelectStock(stock.symbol)}
                        className="w-full flex items-center justify-between p-2 rounded-md hover-elevate active-elevate-2"
                        data-testid={`button-loser-${stock.symbol}`}
                      >
                        <div className="text-left">
                          <div className="font-medium">{stock.symbol}</div>
                          <div className="text-sm text-muted-foreground">${stock.price.toFixed(2)}</div>
                        </div>
                        <span className="text-red-600 dark:text-red-400 font-medium">
                          {stock.changePercent.toFixed(2)}%
                        </span>
                      </button>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="w-full lg:w-80 xl:w-96 space-y-6 shrink-0">
            <AIPredictionPanel
              prediction={prediction || null}
              isLoading={predictionLoading}
              onRefresh={() => refetchPrediction()}
              error={predictionError ? "Failed to load prediction. Please try again." : undefined}
            />

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Latest News</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-4">
                    {newsLoading ? (
                      [...Array(4)].map((_, i) => (
                        <Skeleton key={i} className="h-32" />
                      ))
                    ) : news.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">
                        No news available
                      </p>
                    ) : (
                      news.slice(0, 6).map((article) => (
                        <NewsCard key={article.id} article={article} />
                      ))
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
