import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { ChartDataPoint } from "@shared/schema";

interface StockChartProps {
  symbol: string;
  data: ChartDataPoint[];
  isLoading: boolean;
  currentPrice?: number;
  priceChange?: number;
}

const timeRanges = ["1D", "1W", "1M", "3M", "1Y", "ALL"] as const;
type TimeRange = typeof timeRanges[number];

export function StockChart({ symbol, data, isLoading, currentPrice, priceChange }: StockChartProps) {
  const [selectedRange, setSelectedRange] = useState<TimeRange>("1M");

  const isPositive = priceChange !== undefined ? priceChange >= 0 : true;
  const gradientColor = isPositive ? "#22c55e" : "#ef4444";
  const lineColor = isPositive ? "#22c55e" : "#ef4444";

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <Skeleton className="h-8 w-32" />
            <div className="flex gap-1">
              {timeRanges.map((range) => (
                <Skeleton key={range} className="h-8 w-10" />
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 md:h-80 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card data-testid="chart-stock-price">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <CardTitle className="text-xl">{symbol}</CardTitle>
            {currentPrice !== undefined && (
              <div className="flex items-center gap-2 mt-1">
                <span className="text-2xl font-bold">${currentPrice.toFixed(2)}</span>
                {priceChange !== undefined && (
                  <span className={cn(
                    "text-sm font-medium",
                    isPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                  )}>
                    {isPositive ? "+" : ""}{priceChange.toFixed(2)} ({isPositive ? "+" : ""}{((priceChange / currentPrice) * 100).toFixed(2)}%)
                  </span>
                )}
              </div>
            )}
          </div>
          <div className="flex gap-1 flex-wrap">
            {timeRanges.map((range) => (
              <Button
                key={range}
                variant={selectedRange === range ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedRange(range)}
                data-testid={`button-range-${range}`}
              >
                {range}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64 md:h-80 w-full overflow-x-auto">
          <div className="min-w-full h-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={gradientColor} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={gradientColor} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="time"
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                  className="text-muted-foreground"
                />
                <YAxis
                  domain={["auto", "auto"]}
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                  className="text-muted-foreground"
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--popover-border))",
                    borderRadius: "0.375rem",
                    color: "hsl(var(--popover-foreground))",
                  }}
                  formatter={(value: number) => [`$${value.toFixed(2)}`, "Price"]}
                  labelFormatter={(label) => `Time: ${label}`}
                />
                <Area
                  type="monotone"
                  dataKey="close"
                  stroke={lineColor}
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorPrice)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
