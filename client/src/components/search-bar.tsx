import { useState, useRef, useEffect, useCallback } from "react";
import { Search, X, TrendingUp, TrendingDown, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Stock } from "@shared/schema";

interface SearchBarProps {
  onSelectStock: (symbol: string) => void;
  stocks: Stock[];
  className?: string;
}

export function SearchBar({ onSelectStock, stocks, className }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    const stored = localStorage.getItem("recent-searches");
    return stored ? JSON.parse(stored) : [];
  });
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredStocks = stocks.filter(
    (stock) =>
      stock.symbol.toLowerCase().includes(query.toLowerCase()) ||
      stock.name.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 8);

  const handleSelect = useCallback((symbol: string) => {
    onSelectStock(symbol);
    setQuery("");
    setIsOpen(false);
    
    const newRecent = [symbol, ...recentSearches.filter(s => s !== symbol)].slice(0, 5);
    setRecentSearches(newRecent);
    localStorage.setItem("recent-searches", JSON.stringify(newRecent));
  }, [onSelectStock, recentSearches]);

  const clearQuery = () => {
    setQuery("");
    inputRef.current?.focus();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const showDropdown = isOpen && (query.length > 0 || recentSearches.length > 0);

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="search"
          placeholder="Search stocks by symbol or name..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          className="pl-10 pr-10 h-10"
          data-testid="input-stock-search"
        />
        {query && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
            onClick={clearQuery}
            data-testid="button-clear-search"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-popover border border-popover-border rounded-md shadow-lg z-50 overflow-hidden">
          {query.length === 0 && recentSearches.length > 0 && (
            <div className="p-2">
              <div className="flex items-center gap-2 px-2 py-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                Recent Searches
              </div>
              {recentSearches.map((symbol) => {
                const stock = stocks.find(s => s.symbol === symbol);
                return (
                  <button
                    key={symbol}
                    onClick={() => handleSelect(symbol)}
                    className="w-full flex items-center justify-between gap-2 px-3 py-2 hover-elevate active-elevate-2 rounded-md text-left"
                    data-testid={`button-recent-${symbol}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-semibold">{symbol}</span>
                      <span className="text-sm text-muted-foreground truncate">
                        {stock?.name || ""}
                      </span>
                    </div>
                    {stock && (
                      <span className={cn(
                        "text-sm font-medium",
                        stock.change >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                      )}>
                        ${stock.price.toFixed(2)}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {query.length > 0 && (
            <div className="p-2">
              {filteredStocks.length === 0 ? (
                <div className="px-3 py-6 text-center text-muted-foreground">
                  No stocks found for "{query}"
                </div>
              ) : (
                filteredStocks.map((stock) => (
                  <button
                    key={stock.symbol}
                    onClick={() => handleSelect(stock.symbol)}
                    className="w-full flex items-center justify-between gap-2 px-3 py-2 hover-elevate active-elevate-2 rounded-md text-left"
                    data-testid={`button-search-result-${stock.symbol}`}
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <span className="font-semibold shrink-0">{stock.symbol}</span>
                      <span className="text-sm text-muted-foreground truncate">
                        {stock.name}
                      </span>
                      <Badge variant="secondary" className="shrink-0 text-xs">
                        {stock.sector}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-medium">${stock.price.toFixed(2)}</span>
                      <div className={cn(
                        "flex items-center gap-1 text-sm",
                        stock.change >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                      )}>
                        {stock.change >= 0 ? (
                          <TrendingUp className="h-3 w-3" />
                        ) : (
                          <TrendingDown className="h-3 w-3" />
                        )}
                        <span>{stock.changePercent >= 0 ? "+" : ""}{stock.changePercent.toFixed(2)}%</span>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
