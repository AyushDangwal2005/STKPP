import { TrendingUp, TrendingDown, ArrowUpDown } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { Stock } from "@shared/schema";

interface StockTableProps {
  stocks: Stock[];
  isLoading: boolean;
  onSelectStock: (symbol: string) => void;
  selectedSymbol?: string;
}

function formatMarketCap(value: number): string {
  if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
  return `$${value.toLocaleString()}`;
}

function formatVolume(value: number): string {
  if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M`;
  if (value >= 1e3) return `${(value / 1e3).toFixed(2)}K`;
  return value.toLocaleString();
}

export function StockTable({ stocks, isLoading, onSelectStock, selectedSymbol }: StockTableProps) {
  if (isLoading) {
    return (
      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="sticky left-0 bg-card z-10">Symbol</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Change</TableHead>
              <TableHead className="hidden md:table-cell">Volume</TableHead>
              <TableHead className="hidden lg:table-cell">Market Cap</TableHead>
              <TableHead className="hidden xl:table-cell">Sector</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(10)].map((_, i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-16" /></TableCell>
                <TableCell className="hidden lg:table-cell"><Skeleton className="h-5 w-20" /></TableCell>
                <TableCell className="hidden xl:table-cell"><Skeleton className="h-5 w-24" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-md border" data-testid="table-stocks">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="sticky left-0 bg-card z-10 min-w-[120px]">
              <Button variant="ghost" size="sm" className="p-0 h-auto font-medium">
                Symbol
                <ArrowUpDown className="ml-1 h-3 w-3" />
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" size="sm" className="p-0 h-auto font-medium">
                Price
                <ArrowUpDown className="ml-1 h-3 w-3" />
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" size="sm" className="p-0 h-auto font-medium">
                Change
                <ArrowUpDown className="ml-1 h-3 w-3" />
              </Button>
            </TableHead>
            <TableHead className="hidden md:table-cell">
              <Button variant="ghost" size="sm" className="p-0 h-auto font-medium">
                Volume
                <ArrowUpDown className="ml-1 h-3 w-3" />
              </Button>
            </TableHead>
            <TableHead className="hidden lg:table-cell">
              <Button variant="ghost" size="sm" className="p-0 h-auto font-medium">
                Market Cap
                <ArrowUpDown className="ml-1 h-3 w-3" />
              </Button>
            </TableHead>
            <TableHead className="hidden xl:table-cell">Sector</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stocks.map((stock) => {
            const isPositive = stock.change >= 0;
            const isSelected = stock.symbol === selectedSymbol;
            
            return (
              <TableRow
                key={stock.symbol}
                onClick={() => onSelectStock(stock.symbol)}
                className={cn(
                  "cursor-pointer hover-elevate",
                  isSelected && "bg-muted/50"
                )}
                data-testid={`row-stock-${stock.symbol}`}
              >
                <TableCell className="sticky left-0 bg-card z-10 font-medium">
                  <div>
                    <div className="font-semibold">{stock.symbol}</div>
                    <div className="text-xs text-muted-foreground truncate max-w-[150px]">
                      {stock.name}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-medium">
                  ${stock.price.toFixed(2)}
                </TableCell>
                <TableCell>
                  <div className={cn(
                    "flex items-center gap-1",
                    isPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                  )}>
                    {isPositive ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : (
                      <TrendingDown className="h-4 w-4" />
                    )}
                    <span>
                      {isPositive ? "+" : ""}{stock.changePercent.toFixed(2)}%
                    </span>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {formatVolume(stock.volume)}
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  {formatMarketCap(stock.marketCap)}
                </TableCell>
                <TableCell className="hidden xl:table-cell">
                  <span className="text-sm text-muted-foreground">
                    {stock.sector}
                  </span>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
