import { TrendingUp, TrendingDown, Minus, Sparkles, RefreshCw, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { AIPrediction } from "@shared/schema";

interface AIPredictionPanelProps {
  prediction: AIPrediction | null;
  isLoading: boolean;
  onRefresh: () => void;
  error?: string;
}

export function AIPredictionPanel({ prediction, isLoading, onRefresh, error }: AIPredictionPanelProps) {
  if (error) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Sparkles className="h-5 w-5 text-primary" />
              AI Market Analysis
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <AlertTriangle className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={onRefresh} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Sparkles className="h-5 w-5 text-primary animate-pulse" />
              AI Market Analysis
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <div className="space-y-2">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!prediction) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Market Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
            <Sparkles className="h-12 w-12 mb-4 opacity-50" />
            <p>Select a stock to get AI-powered analysis</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const sentimentConfig = {
    bullish: {
      label: "Bullish",
      icon: TrendingUp,
      className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    },
    bearish: {
      label: "Bearish",
      icon: TrendingDown,
      className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    },
    neutral: {
      label: "Neutral",
      icon: Minus,
      className: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
    },
  };

  const config = sentimentConfig[prediction.sentiment];
  const SentimentIcon = config.icon;
  const priceChange = prediction.predictedPrice - prediction.currentPrice;
  const priceChangePercent = (priceChange / prediction.currentPrice) * 100;

  return (
    <Card data-testid="panel-ai-prediction">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Market Analysis
          </CardTitle>
          <Button 
            onClick={onRefresh} 
            variant="ghost" 
            size="sm"
            data-testid="button-refresh-prediction"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h3 className="text-2xl font-bold">{prediction.symbol}</h3>
            <p className="text-sm text-muted-foreground">
              {prediction.timeframe} Prediction
            </p>
          </div>
          <Badge className={cn("text-sm", config.className)}>
            <SentimentIcon className="h-4 w-4 mr-1" />
            {config.label}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-muted/50 rounded-md p-3">
            <p className="text-xs text-muted-foreground mb-1">Current Price</p>
            <p className="text-xl font-semibold">${prediction.currentPrice.toFixed(2)}</p>
          </div>
          <div className="bg-muted/50 rounded-md p-3">
            <p className="text-xs text-muted-foreground mb-1">Predicted Price</p>
            <p className={cn(
              "text-xl font-semibold",
              priceChange >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
            )}>
              ${prediction.predictedPrice.toFixed(2)}
            </p>
            <p className={cn(
              "text-xs",
              priceChange >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
            )}>
              {priceChange >= 0 ? "+" : ""}{priceChangePercent.toFixed(2)}%
            </p>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Confidence</span>
            <span className="text-sm font-semibold">{prediction.confidence}%</span>
          </div>
          <Progress value={prediction.confidence} className="h-2" />
        </div>

        <div>
          <p className="text-sm font-medium mb-2">Key Insights</p>
          <ul className="space-y-2">
            {prediction.reasoning.map((reason, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="shrink-0 w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-medium">
                  {idx + 1}
                </span>
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center justify-between pt-2 border-t text-xs text-muted-foreground">
          <span>Powered by Gemini AI</span>
          <span>Updated: {new Date(prediction.lastUpdated).toLocaleTimeString()}</span>
        </div>
      </CardContent>
    </Card>
  );
}
