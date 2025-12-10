import { useState, useCallback, useMemo } from "react";
import { Switch, Route, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { ThemeProvider } from "@/lib/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { SearchBar } from "@/components/search-bar";
import { AppSidebar } from "@/components/app-sidebar";
import { Dashboard } from "@/pages/dashboard";
import { StockDetails } from "@/pages/stock-details";
import NotFound from "@/pages/not-found";
import type { Stock } from "@shared/schema";

function AppContent() {
  const [, setLocation] = useLocation();
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);
  const [watchlistSymbols, setWatchlistSymbols] = useState<string[]>(() => {
    const stored = localStorage.getItem("watchlist");
    return stored ? JSON.parse(stored) : ["AAPL", "GOOGL", "MSFT", "AMZN", "TSLA"];
  });

  const { data: stocks = [] } = useQuery<Stock[]>({
    queryKey: ["/api/stocks"],
  });

  const watchlistStocks = useMemo(() => 
    stocks.filter(s => watchlistSymbols.includes(s.symbol)),
    [stocks, watchlistSymbols]
  );

  const handleSelectStock = useCallback((symbol: string) => {
    setSelectedSymbol(symbol);
    setLocation(`/stock/${symbol}`);
  }, [setLocation]);

  const handleToggleWatchlist = useCallback((symbol: string) => {
    setWatchlistSymbols(prev => {
      const newList = prev.includes(symbol)
        ? prev.filter(s => s !== symbol)
        : [...prev, symbol];
      localStorage.setItem("watchlist", JSON.stringify(newList));
      return newList;
    });
  }, []);

  const sidebarStyle = {
    "--sidebar-width": "280px",
    "--sidebar-width-icon": "3rem",
  } as React.CSSProperties;

  return (
    <SidebarProvider style={sidebarStyle}>
      <div className="flex h-screen w-full">
        <AppSidebar
          watchlist={watchlistStocks}
          onSelectStock={handleSelectStock}
          selectedSymbol={selectedSymbol || undefined}
        />
        <SidebarInset className="flex flex-col flex-1 min-w-0">
          <header className="sticky top-0 z-40 flex items-center justify-between gap-4 px-4 py-3 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex items-center gap-4">
              <SidebarTrigger data-testid="button-sidebar-toggle" />
              <h1 className="text-lg font-semibold hidden sm:block">Market Seer</h1>
            </div>
            <div className="flex items-center gap-2">
              <SearchBar
                stocks={stocks}
                onSelectStock={handleSelectStock}
                className="hidden md:block w-64 lg:w-80"
              />
              <ThemeToggle />
            </div>
          </header>
          <main className="flex-1 overflow-hidden">
            <Switch>
              <Route path="/">
                <Dashboard
                  onSelectStock={handleSelectStock}
                  selectedSymbol={selectedSymbol}
                  watchlist={watchlistSymbols}
                  onToggleWatchlist={handleToggleWatchlist}
                />
              </Route>
              <Route path="/stock/:symbol">
                <StockDetails />
              </Route>
              <Route path="/markets">
                <Dashboard
                  onSelectStock={handleSelectStock}
                  selectedSymbol={selectedSymbol}
                  watchlist={watchlistSymbols}
                  onToggleWatchlist={handleToggleWatchlist}
                />
              </Route>
              <Route path="/news">
                <Dashboard
                  onSelectStock={handleSelectStock}
                  selectedSymbol={selectedSymbol}
                  watchlist={watchlistSymbols}
                  onToggleWatchlist={handleToggleWatchlist}
                />
              </Route>
              <Route component={NotFound} />
            </Switch>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="market-seer-theme">
        <TooltipProvider>
          <Toaster />
          <AppContent />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
