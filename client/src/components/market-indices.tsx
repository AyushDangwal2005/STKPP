import { TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { MarketIndex } from "@shared/schema";

interface MarketIndicesProps {
  indices: MarketIndex[];
  isLoading: boolean;
}

export function MarketIndices({ indices, isLoading }: MarketIndicesProps) {
  if (isLoading) {
    return (
      <div className="flex gap-4 overflow-x-auto pb-2">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-20 min-w-[180px]" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-2" data-testid="section-market-indices">
      {indices.map((index) => {
        const isPositive = index.change >= 0;
        
        return (
          <Card 
            key={index.symbol} 
            className="shrink-0 min-w-[180px] hover-elevate"
            data-testid={`card-index-${index.symbol}`}
          >
            <CardContent className="p-3">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-sm font-medium text-muted-foreground truncate">
                  {index.name}
                </span>
                {isPositive ? (
                  <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400 shrink-0" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400 shrink-0" />
                )}
              </div>
              <div className="flex items-end justify-between gap-2">
                <span className="text-lg font-bold">
                  {index.value.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </span>
                <span className={cn(
                  "text-sm font-medium",
                  isPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                )}>
                  {isPositive ? "+" : ""}{index.changePercent.toFixed(2)}%
                </span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
