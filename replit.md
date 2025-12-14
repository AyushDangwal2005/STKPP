# Market Seer

## Overview

Market Seer is a financial stock market dashboard application that provides real-time stock data visualization, AI-powered market predictions, and financial news with sentiment analysis. The platform draws design inspiration from professional financial tools like Bloomberg and TradingView, focusing on data clarity and professional trust-building.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state caching and synchronization
- **UI Components**: Shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens for theming (light/dark mode support)
- **Charts**: Recharts library for interactive stock price visualization
- **Build Tool**: Vite with HMR support

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **API Pattern**: RESTful endpoints under `/api/*` prefix
- **Data Layer**: In-memory mock data for stocks, news, and market indices (designed for easy database integration)
- **Database ORM**: Drizzle ORM configured for PostgreSQL (schema defined, ready for connection)

### Data Flow
1. Frontend components use React Query to fetch data from Express API endpoints
2. Backend generates deterministic mock stock data, news articles, and chart data
3. AI services (Gemini, Hugging Face) provide stock predictions and sentiment analysis
4. WebSocket support available for real-time updates

### Key Design Patterns
- **Component Architecture**: Modular, reusable components with clear separation (UI primitives, feature components, pages)
- **Path Aliases**: `@/` for client source, `@shared/` for shared types/schemas
- **Schema Validation**: Zod schemas shared between frontend and backend via `drizzle-zod`
- **Theme System**: CSS custom properties with HSL color values for consistent theming

### Project Structure
```
client/           # React frontend
  src/
    components/   # UI and feature components
    pages/        # Route components
    lib/          # Utilities, query client, theme provider
    hooks/        # Custom React hooks
server/           # Express backend
  data/           # Mock data generators
  services/       # External API integrations (Gemini, HuggingFace)
shared/           # Shared types and schemas
```

## External Dependencies

### AI Services
- **Google Gemini API** (`@google/genai`): Powers stock prediction generation with structured JSON output
- **Hugging Face Inference API**: FinBERT model for financial sentiment analysis on news articles

### Database
- **PostgreSQL**: Configured via `DATABASE_URL` environment variable
- **Drizzle ORM**: Schema management and type-safe queries
- **connect-pg-simple**: Session storage (when authentication is enabled)

### Required Environment Variables
- `GEMINI_API_KEY`: Google Gemini API key for AI predictions (required)
- `DATABASE_URL`: PostgreSQL connection string (optional, for user features)
- `HUGGINGFACE_API_KEY`: Hugging Face API key for sentiment analysis (optional, has fallback)

### Deployment
The project is configured for Replit autoscale deployment:
- Build command: `npm run build`
- Run command: `node dist/index.cjs`

### Real-Time Data Features
- Stock quotes and market indices: Yahoo Finance API via yahoo-finance2
- Auto-refresh: Stocks every 30 seconds, news every 60 seconds
- AI predictions: Gemini API for stock price forecasting
- Note: Market indices show 0 when US stock markets are closed (weekends/holidays)

### Key Frontend Libraries
- Radix UI primitives for accessible components
- Recharts for data visualization
- React Hook Form with Zod validation
- Embla Carousel for image/content carousels
- Lucide React for icons