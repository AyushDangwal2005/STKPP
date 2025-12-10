import { BarChart3, Home, TrendingUp, Newspaper, Settings, Star, Search } from "lucide-react";
import { Link, useLocation } from "wouter";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import type { Stock } from "@shared/schema";

interface AppSidebarProps {
  watchlist: Stock[];
  onSelectStock: (symbol: string) => void;
  selectedSymbol?: string;
}

const mainNavItems = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "Markets", url: "/markets", icon: BarChart3 },
  { title: "News", url: "/news", icon: Newspaper },
];

export function AppSidebar({ watchlist, onSelectStock, selectedSymbol }: AppSidebarProps) {
  const [location] = useLocation();

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-md bg-primary text-primary-foreground">
            <TrendingUp className="h-5 w-5" />
          </div>
          <span className="font-bold text-lg">Market Seer</span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location === item.url}
                  >
                    <Link href={item.url} data-testid={`link-nav-${item.title.toLowerCase()}`}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            Watchlist
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {watchlist.length === 0 ? (
                <div className="px-3 py-4 text-sm text-muted-foreground text-center">
                  No stocks in watchlist
                </div>
              ) : (
                watchlist.map((stock) => {
                  const isPositive = stock.change >= 0;
                  const isSelected = stock.symbol === selectedSymbol;
                  
                  return (
                    <SidebarMenuItem key={stock.symbol}>
                      <SidebarMenuButton
                        onClick={() => onSelectStock(stock.symbol)}
                        isActive={isSelected}
                        data-testid={`button-watchlist-${stock.symbol}`}
                      >
                        <div className="flex items-center justify-between w-full gap-2">
                          <div className="flex flex-col min-w-0">
                            <span className="font-medium truncate">{stock.symbol}</span>
                            <span className="text-xs text-muted-foreground truncate">
                              ${stock.price.toFixed(2)}
                            </span>
                          </div>
                          <span className={cn(
                            "text-xs font-medium shrink-0",
                            isPositive 
                              ? "text-green-600 dark:text-green-400" 
                              : "text-red-600 dark:text-red-400"
                          )}>
                            {isPositive ? "+" : ""}{stock.changePercent.toFixed(2)}%
                          </span>
                        </div>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/settings" data-testid="link-nav-settings">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
