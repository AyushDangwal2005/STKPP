import { TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Stock } from "@shared/schema";

interface StockCardProps {
  stock: Stock;
  onClick?: () => void;
  isSelected?: boolean;
}

export function StockCard({ stock, onClick, isSelected }: StockCardProps) {
  const isPositive = stock.change >= 0;

  return (
    <Card
      className={cn(
        "cursor-pointer transition-all hover-elevate active-elevate-2",
        isSelected && "ring-2 ring-primary"
      )}
      onClick={onClick}
      data-testid={`card-stock-${stock.symbol}`}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="min-w-0">
            <h3 className="font-semibold text-lg">{stock.symbol}</h3>
            <p className="text-sm text-muted-foreground truncate">{stock.name}</p>
          </div>
          <div className={cn(
            "flex items-center gap-1 px-2 py-1 rounded-md text-sm font-medium shrink-0",
            isPositive 
              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" 
              : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
          )}>
            {isPositive ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            <span>{isPositive ? "+" : ""}{stock.changePercent.toFixed(2)}%</span>
          </div>
        </div>

        <div className="flex items-end justify-between gap-2">
          <div>
            <span className="text-2xl font-bold">${stock.price.toFixed(2)}</span>
            <p className={cn(
              "text-sm",
              isPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
            )}>
              {isPositive ? "+" : ""}{stock.change.toFixed(2)}
            </p>
          </div>

          <div className="h-10 w-20 flex items-end gap-[2px]">
            {stock.sparklineData.map((value, idx) => {
              const min = Math.min(...stock.sparklineData);
              const max = Math.max(...stock.sparklineData);
              const range = max - min || 1;
              const height = ((value - min) / range) * 100;
              
              return (
                <div
                  key={idx}
                  className={cn(
                    "flex-1 rounded-t-sm min-h-[2px]",
                    isPositive ? "bg-green-500" : "bg-red-500"
                  )}
                  style={{ height: `${Math.max(height, 5)}%` }}
                />
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
