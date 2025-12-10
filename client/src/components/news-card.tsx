import { ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { NewsArticle } from "@shared/schema";

interface NewsCardProps {
  article: NewsArticle;
}

export function NewsCard({ article }: NewsCardProps) {
  const sentimentConfig = {
    positive: {
      label: "Positive",
      className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    },
    negative: {
      label: "Negative",
      className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    },
    neutral: {
      label: "Neutral",
      className: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
    },
  };

  const config = sentimentConfig[article.sentiment];
  const timeAgo = getTimeAgo(article.timestamp);

  return (
    <Card 
      className="overflow-hidden hover-elevate active-elevate-2 cursor-pointer"
      data-testid={`card-news-${article.id}`}
    >
      <a href={article.url} target="_blank" rel="noopener noreferrer" className="block">
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <Badge variant="secondary" className={cn("text-xs shrink-0", config.className)}>
              {config.label}
            </Badge>
            <ExternalLink className="h-4 w-4 text-muted-foreground shrink-0" />
          </div>
          
          <h3 className="font-semibold text-base mb-2 line-clamp-2">
            {article.title}
          </h3>
          
          <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
            {article.summary}
          </p>
          
          <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
            <span className="truncate">{article.source}</span>
            <span className="shrink-0">{timeAgo}</span>
          </div>
          
          {article.relatedSymbols.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {article.relatedSymbols.slice(0, 3).map((symbol) => (
                <Badge key={symbol} variant="outline" className="text-xs">
                  {symbol}
                </Badge>
              ))}
              {article.relatedSymbols.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{article.relatedSymbols.length - 3}
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </a>
    </Card>
  );
}

function getTimeAgo(timestamp: string): string {
  const now = new Date();
  const date = new Date(timestamp);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}
