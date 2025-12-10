# Stock Intelligence Dashboard

A comprehensive stock intelligence dashboard powered by AI for real-time market analysis, stock predictions, and sentiment analysis.

## Features

### Core Features
- **Real-time Stock Data**: View comprehensive stock information including price, volume, market cap, and more
- **Detailed Fundamentals**: Access complete fundamental data including P/E ratios, EPS, dividend yields, 52-week ranges, beta, and technical indicators
- **AI-Powered Predictions**: Get stock price predictions using Google's Gemini API
- **Sentiment Analysis**: Analyze market sentiment using HuggingFace's FinBERT model
- **Earnings History**: View past earnings reports with beat/miss analysis
- **Dividend Tracking**: Monitor dividend history and yields
- **Insider Transactions**: Track insider buying and selling activity
- **Institutional Holdings**: See major institutional investors and their positions

### Technical Features
- Full-stack TypeScript application
- React frontend with TailwindCSS and shadcn/ui components
- Express.js backend with RESTful API
- Real-time data updates
- Dark/Light theme support
- Responsive design for all devices

## Tech Stack

### Frontend
- React 18
- TypeScript
- Vite
- TailwindCSS
- shadcn/ui Components
- TanStack Query
- Recharts
- Wouter (routing)

### Backend
- Node.js
- Express.js
- TypeScript
- Google Gemini API
- HuggingFace Inference API

## Project Structure

```
├── client/                 # Frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── lib/            # Utility functions
│   │   └── hooks/          # Custom React hooks
│   └── index.html
├── server/                 # Backend application
│   ├── routes.ts           # API routes
│   ├── services/           # External service integrations
│   │   ├── gemini.ts       # Google Gemini API service
│   │   └── huggingface.ts  # HuggingFace API service
│   └── data/               # Data generators
├── shared/                 # Shared types and schemas
│   └── schema.ts           # TypeScript interfaces
├── vercel.json             # Vercel deployment config
├── render.yaml             # Render deployment config
├── railway.json            # Railway deployment config
└── Procfile                # Process file for deployment
```

## API Endpoints

### Stocks
- `GET /api/stocks` - Get all stocks
- `GET /api/stocks/:symbol` - Get single stock
- `GET /api/stocks/:symbol/fundamentals` - Get comprehensive fundamentals
- `GET /api/stocks/:symbol/chart` - Get chart data
- `GET /api/stocks/:symbol/earnings` - Get earnings history
- `GET /api/stocks/:symbol/dividends` - Get dividend history
- `GET /api/stocks/:symbol/insiders` - Get insider transactions
- `GET /api/stocks/:symbol/institutions` - Get institutional holders
- `GET /api/stocks/search?q=query` - Search stocks

### Market Data
- `GET /api/indices` - Get market indices
- `GET /api/sectors` - Get sector performance
- `GET /api/news` - Get market news
- `GET /api/news/:symbol` - Get news for specific stock

### AI Services
- `GET /api/prediction/:symbol` - Get AI stock prediction (Gemini)
- `GET /api/analysis/:symbol` - Get comprehensive AI analysis (Gemini)
- `POST /api/sentiment/gemini` - Analyze sentiment (Gemini)
- `POST /api/sentiment/huggingface` - Analyze sentiment (FinBERT)
- `POST /api/sentiment/batch` - Batch sentiment analysis

### Health
- `GET /api/health` - Health check endpoint

## Environment Variables

### Required for Backend
```env
GEMINI_API_KEY=your_gemini_api_key
HUGGINGFACE_API_KEY=your_huggingface_api_key
PORT=3000
CORS_ORIGIN=https://your-frontend-domain.com
```

### Required for Frontend (Vercel)
```env
VITE_API_URL=https://your-backend-domain.com
```

## Local Development

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/stock-intelligence-dashboard.git
cd stock-intelligence-dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with your API keys:
```env
GEMINI_API_KEY=your_gemini_api_key
HUGGINGFACE_API_KEY=your_huggingface_api_key
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## Deployment

### Option 1: Vercel (Frontend) + Render (Backend)

#### Deploy Backend to Render

1. Create a new Web Service on [Render](https://render.com)
2. Connect your GitHub repository
3. Configure:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Environment**: Node
4. Add environment variables:
   - `GEMINI_API_KEY`
   - `HUGGINGFACE_API_KEY`
   - `CORS_ORIGIN` (your Vercel frontend URL)
   - `NODE_ENV=production`
5. Deploy

Or use the `render.yaml` blueprint for automatic configuration.

#### Deploy Frontend to Vercel

1. Create a new project on [Vercel](https://vercel.com)
2. Import your GitHub repository
3. Configure:
   - **Framework Preset**: Vite
   - **Build Command**: `cd client && npm run build`
   - **Output Directory**: `client/dist`
4. Add environment variable:
   - `VITE_API_URL=https://your-render-backend.onrender.com`
5. Deploy

### Option 2: Vercel (Frontend) + Railway (Backend)

#### Deploy Backend to Railway

1. Create a new project on [Railway](https://railway.app)
2. Connect your GitHub repository
3. Railway will auto-detect the configuration from `railway.json`
4. Add environment variables:
   - `GEMINI_API_KEY`
   - `HUGGINGFACE_API_KEY`
   - `CORS_ORIGIN` (your Vercel frontend URL)
5. Deploy

#### Deploy Frontend to Vercel

Same as Option 1, but set `VITE_API_URL` to your Railway backend URL.

### Option 3: Single Deployment (Replit/Heroku)

For platforms that support full-stack deployments:

1. Set environment variables:
   - `GEMINI_API_KEY`
   - `HUGGINGFACE_API_KEY`
2. Build and start:
```bash
npm install
npm run build
npm start
```

## GitHub Setup

### Setting up the Repository

1. Create a new repository on GitHub
2. Initialize git and push:
```bash
git init
git add .
git commit -m "Initial commit: Stock Intelligence Dashboard"
git branch -M main
git remote add origin https://github.com/yourusername/stock-intelligence-dashboard.git
git push -u origin main
```

### GitHub Actions (Optional)

Create `.github/workflows/deploy.yml` for CI/CD:

```yaml
name: Deploy

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run build
```

## Getting API Keys

### Google Gemini API
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Create a new API key
3. Add to your environment as `GEMINI_API_KEY`

### HuggingFace API
1. Create an account at [HuggingFace](https://huggingface.co)
2. Go to Settings > Access Tokens
3. Create a new token with read permissions
4. Add to your environment as `HUGGINGFACE_API_KEY`

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/your-feature`
5. Submit a Pull Request

## License

MIT License - see LICENSE file for details.

## Support

For issues and feature requests, please use the GitHub Issues page.
