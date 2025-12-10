# Market Seer Design Guidelines

## Design Approach
**System-Based Approach** inspired by financial platforms (Bloomberg, Robinhood, Yahoo Finance, TradingView) with focus on data clarity and professional trust-building. This is a utility-focused financial dashboard requiring precision and information hierarchy.

## Typography
- **Primary Font**: Inter or IBM Plex Sans (Google Fonts)
- **Hierarchy**:
  - Stock prices/numbers: 2xl-4xl, font-semibold to font-bold
  - Section headers: xl-2xl, font-semibold
  - Labels/metadata: sm-base, font-medium
  - Body/news text: base, font-normal
  - Captions/timestamps: xs-sm, text-gray-600

## Layout System
**Spacing Primitives**: Use Tailwind units of 2, 4, 6, and 8 (e.g., p-4, gap-6, space-y-8)
- Mobile: p-4, gap-4
- Tablet/Desktop: p-6 to p-8, gap-6

**Grid System**:
- Desktop: 3-column layout (sidebar navigation 280px, main content area, info panel 320px)
- Tablet: 2-column (collapsible sidebar, main content)
- Mobile: Single column, bottom navigation

## Core Components

### Navigation & Header
- Fixed top header (h-16) with logo, search bar, and user menu
- Sidebar navigation with stock watchlist, market indices, and category filters
- Mobile: Bottom tab navigation with 4-5 primary actions

### Stock Cards
- Compact card design showing: Symbol, company name, current price, change percentage, mini sparkline chart
- Grid layout: 1 column mobile, 2 columns tablet, 3-4 columns desktop
- Card height: auto with consistent padding (p-4)

### Search Bar
- Prominent placement in header (width: full on mobile, max-w-md on desktop)
- Autocomplete dropdown with stock symbols, company names, and recent searches
- Display: Symbol in bold, company name in gray, current price on right

### Charts & Data Visualization
- Primary chart area: Full-width with responsive height (h-64 md:h-80 lg:h-96)
- Use established charting libraries (Chart.js, Recharts, or TradingView widget)
- Time range selectors: 1D, 1W, 1M, 3M, 1Y, ALL (horizontal tabs below chart)

### News Section
- Card-based layout with thumbnail image (if available), headline, source, timestamp, sentiment indicator
- Sentiment badges: Small pills showing Positive/Negative/Neutral with appropriate styling
- Grid: 1 column mobile, 2 columns tablet, 3 columns desktop
- Truncate headlines to 2 lines with overflow ellipsis

### AI Predictions Panel
- Dedicated section with prominent heading "AI Market Analysis"
- Display prediction confidence as percentage with visual indicator (progress bar or gauge)
- Key insights as bullet points with icons
- Timestamp showing last update
- "Powered by Gemini AI" attribution

### Stock Data Tables
- Responsive tables with horizontal scroll on mobile
- Sticky headers for long lists
- Columns: Symbol, Price, Change, Volume, Market Cap (hide less critical columns on mobile)
- Alternating row backgrounds for readability

## Responsive Breakpoints
- Mobile: < 768px (sm)
- Tablet: 768px - 1024px (md)
- Desktop: > 1024px (lg)

**Key Responsive Behaviors**:
- Sidebar: Drawer on mobile/tablet, fixed on desktop
- Charts: Maintain aspect ratio, reduce height on mobile
- Cards: Stack vertically on mobile, grid on larger screens
- Tables: Horizontal scroll with fixed first column on mobile

## Overflow Management
- Charts: Use `overflow-x-auto` with `min-w-full` for mobile
- News cards: `line-clamp-2` for headlines, `line-clamp-3` for descriptions
- Tables: `overflow-x-auto` wrapper with sticky first column
- Long stock names: Truncate with ellipsis using `truncate` utility

## Functional Requirements

### Search Implementation
- Real-time filtering as user types
- Support for: Stock symbols (AAPL), company names (Apple), partial matches
- Recently viewed stocks at top of results
- Clear button to reset search

### Stock Coverage
Include major indices and comprehensive stock list:
- US Markets: S&P 500, NASDAQ 100, Dow Jones components
- Global indices: Major international stocks
- Crypto: BTC, ETH, top 20 by market cap
- Database: Store symbols, names, exchange, sector metadata

### Data Display Standards
- Positive changes: Green with up arrow (↑)
- Negative changes: Red with down arrow (↓)
- Percentage changes: Always show sign (+/-)
- Price precision: 2 decimal places for stocks, 8 for crypto
- Large numbers: Format with K, M, B suffixes (e.g., 1.2M, 5.3B)

## Images
No hero images needed for this application. This is a data-focused dashboard where real-time information takes precedence. Use icons and data visualizations instead.

## Accessibility
- Maintain WCAG AA contrast ratios for all text
- Color-blind friendly: Use icons alongside color for positive/negative indicators
- Keyboard navigation: Full support for search, navigation, and interactive elements
- Screen reader labels for charts and data points

## Performance Considerations
- Lazy load stock cards and news items
- Virtualize long lists (stock tables with 100+ rows)
- Debounce search input (300ms)
- Cache API responses appropriately
- Show loading skeletons during data fetches