import type { Stock, MarketIndex, StockFundamentals, SectorPerformance, EarningsData, DividendHistory, InsiderTransaction, InstitutionalHolder } from "@shared/schema";

// Comprehensive list of major stocks across different sectors
const stockData = [
  // Technology
  { symbol: "AAPL", name: "Apple Inc.", sector: "Technology", industry: "Consumer Electronics", exchange: "NASDAQ", basePrice: 178.50, employees: 164000, ceo: "Tim Cook", description: "Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide." },
  { symbol: "MSFT", name: "Microsoft Corporation", sector: "Technology", industry: "Software - Infrastructure", exchange: "NASDAQ", basePrice: 378.90, employees: 221000, ceo: "Satya Nadella", description: "Microsoft Corporation develops, licenses, and supports software, services, devices, and solutions worldwide." },
  { symbol: "GOOGL", name: "Alphabet Inc.", sector: "Technology", industry: "Internet Content & Information", exchange: "NASDAQ", basePrice: 141.25, employees: 186779, ceo: "Sundar Pichai", description: "Alphabet Inc. provides various products and platforms in the United States, Europe, the Middle East, Africa, the Asia-Pacific, Canada, and Latin America." },
  { symbol: "AMZN", name: "Amazon.com Inc.", sector: "Technology", industry: "Internet Retail", exchange: "NASDAQ", basePrice: 178.35, employees: 1541000, ceo: "Andy Jassy", description: "Amazon.com, Inc. engages in the retail sale of consumer products and subscriptions through online and physical stores in North America and internationally." },
  { symbol: "META", name: "Meta Platforms Inc.", sector: "Technology", industry: "Internet Content & Information", exchange: "NASDAQ", basePrice: 505.75, employees: 67317, ceo: "Mark Zuckerberg", description: "Meta Platforms, Inc. engages in the development of products that enable people to connect and share with friends and family through mobile devices, personal computers, virtual reality headsets, and wearables worldwide." },
  { symbol: "NVDA", name: "NVIDIA Corporation", sector: "Technology", industry: "Semiconductors", exchange: "NASDAQ", basePrice: 875.50, employees: 29600, ceo: "Jensen Huang", description: "NVIDIA Corporation provides graphics, and compute and networking solutions in the United States, Taiwan, China, and internationally." },
  { symbol: "TSLA", name: "Tesla Inc.", sector: "Technology", industry: "Auto Manufacturers", exchange: "NASDAQ", basePrice: 245.80, employees: 140473, ceo: "Elon Musk", description: "Tesla, Inc. designs, develops, manufactures, leases, and sells electric vehicles, and energy generation and storage systems in the United States, China, and internationally." },
  { symbol: "AMD", name: "Advanced Micro Devices", sector: "Technology", industry: "Semiconductors", exchange: "NASDAQ", basePrice: 165.40, employees: 26000, ceo: "Lisa Su", description: "Advanced Micro Devices, Inc. operates as a semiconductor company worldwide." },
  { symbol: "INTC", name: "Intel Corporation", sector: "Technology", industry: "Semiconductors", exchange: "NASDAQ", basePrice: 43.25, employees: 124800, ceo: "Pat Gelsinger", description: "Intel Corporation designs, develops, manufactures, markets, and sells computing and related products worldwide." },
  { symbol: "CRM", name: "Salesforce Inc.", sector: "Technology", industry: "Software - Application", exchange: "NYSE", basePrice: 267.80, employees: 79390, ceo: "Marc Benioff", description: "Salesforce, Inc. provides customer relationship management technology that brings companies and customers together worldwide." },
  { symbol: "ORCL", name: "Oracle Corporation", sector: "Technology", industry: "Software - Infrastructure", exchange: "NYSE", basePrice: 125.60, employees: 164000, ceo: "Safra Catz", description: "Oracle Corporation offers products and services that address enterprise information technology environments worldwide." },
  { symbol: "ADBE", name: "Adobe Inc.", sector: "Technology", industry: "Software - Application", exchange: "NASDAQ", basePrice: 578.90, employees: 30581, ceo: "Shantanu Narayen", description: "Adobe Inc. operates as a diversified software company worldwide." },
  { symbol: "CSCO", name: "Cisco Systems Inc.", sector: "Technology", industry: "Communication Equipment", exchange: "NASDAQ", basePrice: 48.75, employees: 84900, ceo: "Chuck Robbins", description: "Cisco Systems, Inc. designs, manufactures, and sells Internet Protocol based networking and other products related to the communications and information technology industry worldwide." },
  { symbol: "IBM", name: "IBM Corporation", sector: "Technology", industry: "Information Technology Services", exchange: "NYSE", basePrice: 168.45, employees: 297900, ceo: "Arvind Krishna", description: "International Business Machines Corporation provides integrated solutions and services worldwide." },
  { symbol: "NFLX", name: "Netflix Inc.", sector: "Technology", industry: "Entertainment", exchange: "NASDAQ", basePrice: 485.30, employees: 13000, ceo: "Ted Sarandos", description: "Netflix, Inc. provides entertainment services. It offers TV series, documentaries, feature films, and mobile games across various genres and languages." },
  
  // Finance
  { symbol: "JPM", name: "JPMorgan Chase & Co.", sector: "Finance", industry: "Banks - Diversified", exchange: "NYSE", basePrice: 195.40, employees: 309926, ceo: "Jamie Dimon", description: "JPMorgan Chase & Co. operates as a financial services company worldwide." },
  { symbol: "V", name: "Visa Inc.", sector: "Finance", industry: "Credit Services", exchange: "NYSE", basePrice: 278.90, employees: 30800, ceo: "Ryan McInerney", description: "Visa Inc. operates as a payments technology company worldwide." },
  { symbol: "MA", name: "Mastercard Inc.", sector: "Finance", industry: "Credit Services", exchange: "NYSE", basePrice: 458.25, employees: 33400, ceo: "Michael Miebach", description: "Mastercard Incorporated, a technology company, provides transaction processing and other payment-related products and services in the United States and internationally." },
  { symbol: "BAC", name: "Bank of America Corp.", sector: "Finance", industry: "Banks - Diversified", exchange: "NYSE", basePrice: 37.80, employees: 217000, ceo: "Brian Moynihan", description: "Bank of America Corporation, through its subsidiaries, provides banking and financial products and services for individual consumers, small and middle-market businesses, institutional investors, large corporations, and governments worldwide." },
  { symbol: "WFC", name: "Wells Fargo & Co.", sector: "Finance", industry: "Banks - Diversified", exchange: "NYSE", basePrice: 57.45, employees: 225000, ceo: "Charles Scharf", description: "Wells Fargo & Company, a financial services company, provides diversified banking, investment, mortgage, consumer, and commercial finance products and services in the United States and internationally." },
  { symbol: "GS", name: "Goldman Sachs Group", sector: "Finance", industry: "Capital Markets", exchange: "NYSE", basePrice: 385.60, employees: 45400, ceo: "David Solomon", description: "The Goldman Sachs Group, Inc., a financial institution, provides a range of financial services for corporations, financial institutions, governments, and individuals worldwide." },
  { symbol: "MS", name: "Morgan Stanley", sector: "Finance", industry: "Capital Markets", exchange: "NYSE", basePrice: 98.75, employees: 82000, ceo: "James Gorman", description: "Morgan Stanley, a financial holding company, provides various financial products and services to corporations, governments, financial institutions, and individuals in the Americas, Europe, the Middle East, Africa, and Asia." },
  { symbol: "AXP", name: "American Express Co.", sector: "Finance", industry: "Credit Services", exchange: "NYSE", basePrice: 215.30, employees: 77300, ceo: "Stephen Squeri", description: "American Express Company, together with its subsidiaries, operates as integrated payments company in the United States, Europe, the Middle East and Africa, the Asia Pacific, Australia, New Zealand, Latin America, Canada, the Caribbean, and internationally." },
  { symbol: "BLK", name: "BlackRock Inc.", sector: "Finance", industry: "Asset Management", exchange: "NYSE", basePrice: 785.40, employees: 20100, ceo: "Larry Fink", description: "BlackRock, Inc. is a publicly owned investment manager." },
  { symbol: "SCHW", name: "Charles Schwab Corp.", sector: "Finance", industry: "Capital Markets", exchange: "NYSE", basePrice: 72.15, employees: 36300, ceo: "Walter Bettinger", description: "The Charles Schwab Corporation, together with its subsidiaries, operates as a savings and loan holding company that provides wealth management, securities brokerage, banking, asset management, custody, and financial advisory services in the United States and internationally." },
  
  // Healthcare
  { symbol: "JNJ", name: "Johnson & Johnson", sector: "Healthcare", industry: "Drug Manufacturers - General", exchange: "NYSE", basePrice: 158.90, employees: 134000, ceo: "Joaquin Duato", description: "Johnson & Johnson researches and develops, manufactures, and sells various products in the healthcare field worldwide." },
  { symbol: "UNH", name: "UnitedHealth Group", sector: "Healthcare", industry: "Healthcare Plans", exchange: "NYSE", basePrice: 528.45, employees: 400000, ceo: "Andrew Witty", description: "UnitedHealth Group Incorporated operates as a diversified health care company in the United States." },
  { symbol: "PFE", name: "Pfizer Inc.", sector: "Healthcare", industry: "Drug Manufacturers - General", exchange: "NYSE", basePrice: 28.65, employees: 88000, ceo: "Albert Bourla", description: "Pfizer Inc. discovers, develops, manufactures, markets, distributes, and sells biopharmaceutical products worldwide." },
  { symbol: "ABBV", name: "AbbVie Inc.", sector: "Healthcare", industry: "Drug Manufacturers - General", exchange: "NYSE", basePrice: 175.80, employees: 50000, ceo: "Richard Gonzalez", description: "AbbVie Inc. discovers, develops, manufactures, and sells pharmaceuticals worldwide." },
  { symbol: "MRK", name: "Merck & Co. Inc.", sector: "Healthcare", industry: "Drug Manufacturers - General", exchange: "NYSE", basePrice: 125.40, employees: 69000, ceo: "Robert Davis", description: "Merck & Co., Inc. operates as a healthcare company worldwide." },
  { symbol: "LLY", name: "Eli Lilly and Co.", sector: "Healthcare", industry: "Drug Manufacturers - General", exchange: "NYSE", basePrice: 785.60, employees: 43000, ceo: "David Ricks", description: "Eli Lilly and Company discovers, develops, and markets human pharmaceuticals worldwide." },
  { symbol: "TMO", name: "Thermo Fisher Scientific", sector: "Healthcare", industry: "Diagnostics & Research", exchange: "NYSE", basePrice: 565.25, employees: 125000, ceo: "Marc Casper", description: "Thermo Fisher Scientific Inc. serves science by providing analytical instruments, equipment, reagents and consumables, software and services for research, analysis, discovery, and diagnostics." },
  { symbol: "ABT", name: "Abbott Laboratories", sector: "Healthcare", industry: "Medical Devices", exchange: "NYSE", basePrice: 108.90, employees: 115000, ceo: "Robert Ford", description: "Abbott Laboratories, together with its subsidiaries, discovers, develops, manufactures, and sells health care products worldwide." },
  { symbol: "DHR", name: "Danaher Corporation", sector: "Healthcare", industry: "Diagnostics & Research", exchange: "NYSE", basePrice: 248.75, employees: 79000, ceo: "Rainer Blair", description: "Danaher Corporation designs, manufactures, and markets professional, medical, industrial, and commercial products and services worldwide." },
  { symbol: "BMY", name: "Bristol-Myers Squibb", sector: "Healthcare", industry: "Drug Manufacturers - General", exchange: "NYSE", basePrice: 52.30, employees: 34000, ceo: "Giovanni Caforio", description: "Bristol-Myers Squibb Company discovers, develops, licenses, manufactures, markets, distributes, and sells biopharmaceutical products worldwide." },
  
  // Consumer
  { symbol: "WMT", name: "Walmart Inc.", sector: "Consumer", industry: "Discount Stores", exchange: "NYSE", basePrice: 165.80, employees: 2100000, ceo: "Doug McMillon", description: "Walmart Inc. engages in the operation of retail, wholesale, and other units worldwide." },
  { symbol: "PG", name: "Procter & Gamble Co.", sector: "Consumer", industry: "Household & Personal Products", exchange: "NYSE", basePrice: 158.45, employees: 107000, ceo: "Jon Moeller", description: "The Procter & Gamble Company provides branded consumer packaged goods worldwide." },
  { symbol: "KO", name: "Coca-Cola Company", sector: "Consumer", industry: "Beverages - Non-Alcoholic", exchange: "NYSE", basePrice: 62.75, employees: 79000, ceo: "James Quincey", description: "The Coca-Cola Company, a beverage company, manufactures, markets, and sells various nonalcoholic beverages worldwide." },
  { symbol: "PEP", name: "PepsiCo Inc.", sector: "Consumer", industry: "Beverages - Non-Alcoholic", exchange: "NASDAQ", basePrice: 178.90, employees: 315000, ceo: "Ramon Laguarta", description: "PepsiCo, Inc. manufactures, markets, distributes, and sells various beverages and convenient foods worldwide." },
  { symbol: "COST", name: "Costco Wholesale", sector: "Consumer", industry: "Discount Stores", exchange: "NASDAQ", basePrice: 725.60, employees: 316000, ceo: "Craig Jelinek", description: "Costco Wholesale Corporation, together with its subsidiaries, engages in the operation of membership warehouses in the United States, Puerto Rico, Canada, the United Kingdom, Mexico, Japan, Korea, Australia, Spain, France, Iceland, China, and Taiwan." },
  { symbol: "MCD", name: "McDonald's Corporation", sector: "Consumer", industry: "Restaurants", exchange: "NYSE", basePrice: 298.45, employees: 150000, ceo: "Chris Kempczinski", description: "McDonald's Corporation operates and franchises McDonald's restaurants in the United States and internationally." },
  { symbol: "NKE", name: "Nike Inc.", sector: "Consumer", industry: "Footwear & Accessories", exchange: "NYSE", basePrice: 98.75, employees: 83700, ceo: "John Donahoe", description: "NIKE, Inc., together with its subsidiaries, designs, develops, markets, and sells athletic footwear, apparel, equipment, accessories, and services worldwide." },
  { symbol: "SBUX", name: "Starbucks Corporation", sector: "Consumer", industry: "Restaurants", exchange: "NASDAQ", basePrice: 95.40, employees: 402000, ceo: "Laxman Narasimhan", description: "Starbucks Corporation, together with its subsidiaries, operates as a roaster, marketer, and retailer of specialty coffee worldwide." },
  { symbol: "HD", name: "Home Depot Inc.", sector: "Consumer", industry: "Home Improvement Retail", exchange: "NYSE", basePrice: 385.60, employees: 475000, ceo: "Ted Decker", description: "The Home Depot, Inc. operates as a home improvement retailer." },
  { symbol: "LOW", name: "Lowe's Companies", sector: "Consumer", industry: "Home Improvement Retail", exchange: "NYSE", basePrice: 248.90, employees: 270000, ceo: "Marvin Ellison", description: "Lowe's Companies, Inc., together with its subsidiaries, operates as a home improvement retailer in the United States." },
  
  // Energy
  { symbol: "XOM", name: "Exxon Mobil Corp.", sector: "Energy", industry: "Oil & Gas Integrated", exchange: "NYSE", basePrice: 108.75, employees: 64000, ceo: "Darren Woods", description: "Exxon Mobil Corporation explores for and produces crude oil and natural gas in the United States and internationally." },
  { symbol: "CVX", name: "Chevron Corporation", sector: "Energy", industry: "Oil & Gas Integrated", exchange: "NYSE", basePrice: 155.40, employees: 44000, ceo: "Mike Wirth", description: "Chevron Corporation, through its subsidiaries, engages in the integrated energy and chemicals operations in the United States and internationally." },
  { symbol: "COP", name: "ConocoPhillips", sector: "Energy", industry: "Oil & Gas E&P", exchange: "NYSE", basePrice: 118.25, employees: 10500, ceo: "Ryan Lance", description: "ConocoPhillips explores for, produces, transports, and markets crude oil, bitumen, natural gas, liquefied natural gas, and natural gas liquids worldwide." },
  { symbol: "SLB", name: "Schlumberger Ltd.", sector: "Energy", industry: "Oil & Gas Equipment & Services", exchange: "NYSE", basePrice: 52.80, employees: 92000, ceo: "Olivier Le Peuch", description: "Schlumberger Limited, together with its subsidiaries, engages in the provision of technology for the energy industry worldwide." },
  { symbol: "EOG", name: "EOG Resources Inc.", sector: "Energy", industry: "Oil & Gas E&P", exchange: "NYSE", basePrice: 128.45, employees: 2850, ceo: "Ezra Yacob", description: "EOG Resources, Inc., together with its subsidiaries, explores for, develops, produces, and markets crude oil, natural gas liquids, and natural gas primarily in producing basins in the United States, the Republic of Trinidad and Tobago, and internationally." },
  
  // Industrial
  { symbol: "CAT", name: "Caterpillar Inc.", sector: "Industrial", industry: "Farm & Heavy Construction Machinery", exchange: "NYSE", basePrice: 345.60, employees: 113200, ceo: "Jim Umpleby", description: "Caterpillar Inc. manufactures and sells construction and mining equipment, diesel and natural gas engines, industrial gas turbines, and diesel-electric locomotives worldwide." },
  { symbol: "BA", name: "Boeing Company", sector: "Industrial", industry: "Aerospace & Defense", exchange: "NYSE", basePrice: 215.80, employees: 156000, ceo: "David Calhoun", description: "The Boeing Company, together with its subsidiaries, designs, develops, manufactures, sells, services, and supports commercial jetliners, military aircraft, satellites, missile defense, human space flight and launch systems, and services worldwide." },
  { symbol: "GE", name: "General Electric Co.", sector: "Industrial", industry: "Specialty Industrial Machinery", exchange: "NYSE", basePrice: 158.45, employees: 125000, ceo: "Larry Culp", description: "General Electric Company operates as a high-tech industrial company in Europe, China, Asia, the Americas, the Middle East, and Africa." },
  { symbol: "MMM", name: "3M Company", sector: "Industrial", industry: "Conglomerates", exchange: "NYSE", basePrice: 108.75, employees: 92000, ceo: "Mike Roman", description: "3M Company provides diversified technology company that operates through four segments: Safety and Industrial, Transportation and Electronics, Health Care, and Consumer." },
  { symbol: "UPS", name: "United Parcel Service", sector: "Industrial", industry: "Integrated Freight & Logistics", exchange: "NYSE", basePrice: 148.90, employees: 500000, ceo: "Carol Tome", description: "United Parcel Service, Inc., a package delivery company, provides transportation and delivery, distribution, contract logistics, ocean freight, airfreight, customs brokerage, and insurance services." },
  { symbol: "HON", name: "Honeywell International", sector: "Industrial", industry: "Conglomerates", exchange: "NASDAQ", basePrice: 205.60, employees: 100000, ceo: "Vimal Kapur", description: "Honeywell International Inc. operates as a diversified technology and manufacturing company worldwide." },
  { symbol: "RTX", name: "RTX Corporation", sector: "Industrial", industry: "Aerospace & Defense", exchange: "NYSE", basePrice: 98.45, employees: 185000, ceo: "Greg Hayes", description: "RTX Corporation, an aerospace and defense company, provides systems and services for the commercial, military, and government customers worldwide." },
  { symbol: "LMT", name: "Lockheed Martin Corp.", sector: "Industrial", industry: "Aerospace & Defense", exchange: "NYSE", basePrice: 465.80, employees: 116000, ceo: "James Taiclet", description: "Lockheed Martin Corporation, a security and aerospace company, engages in the research, design, development, manufacture, integration, and sustainment of technology systems, products, and services worldwide." },
  
  // Communications
  { symbol: "VZ", name: "Verizon Communications", sector: "Communications", industry: "Telecom Services", exchange: "NYSE", basePrice: 42.75, employees: 105400, ceo: "Hans Vestberg", description: "Verizon Communications Inc., through its subsidiaries, provides communications, technology, information, and entertainment products and services to consumers, businesses, and governmental entities worldwide." },
  { symbol: "T", name: "AT&T Inc.", sector: "Communications", industry: "Telecom Services", exchange: "NYSE", basePrice: 17.85, employees: 140000, ceo: "John Stankey", description: "AT&T Inc. provides telecommunications and technology services worldwide." },
  { symbol: "TMUS", name: "T-Mobile US Inc.", sector: "Communications", industry: "Telecom Services", exchange: "NASDAQ", basePrice: 165.40, employees: 80000, ceo: "Mike Sievert", description: "T-Mobile US, Inc., together with its subsidiaries, provides mobile communications services in the United States, Puerto Rico, and the United States Virgin Islands." },
  { symbol: "DIS", name: "Walt Disney Company", sector: "Communications", industry: "Entertainment", exchange: "NYSE", basePrice: 108.90, employees: 220000, ceo: "Robert Iger", description: "The Walt Disney Company operates as an entertainment company worldwide." },
  { symbol: "CMCSA", name: "Comcast Corporation", sector: "Communications", industry: "Telecom Services", exchange: "NASDAQ", basePrice: 42.65, employees: 186000, ceo: "Brian Roberts", description: "Comcast Corporation operates as a media and technology company worldwide." },
  
  // Crypto-related
  { symbol: "COIN", name: "Coinbase Global Inc.", sector: "Crypto", industry: "Financial Data & Stock Exchanges", exchange: "NASDAQ", basePrice: 245.80, employees: 5000, ceo: "Brian Armstrong", description: "Coinbase Global, Inc. provides financial infrastructure and technology for the cryptoeconomy in the United States and internationally." },
  { symbol: "MARA", name: "Marathon Digital", sector: "Crypto", industry: "Capital Markets", exchange: "NASDAQ", basePrice: 24.65, employees: 67, ceo: "Fred Thiel", description: "Marathon Digital Holdings, Inc. operates as a digital asset technology company that mines cryptocurrencies with a focus on the blockchain ecosystem and the generation of digital assets in the United States." },
  { symbol: "RIOT", name: "Riot Platforms Inc.", sector: "Crypto", industry: "Capital Markets", exchange: "NASDAQ", basePrice: 12.85, employees: 474, ceo: "Jason Les", description: "Riot Platforms, Inc., together with its subsidiaries, focuses on bitcoin mining operations in the United States." },
];

const indexData = [
  { symbol: "SPX", name: "S&P 500", baseValue: 5125.40 },
  { symbol: "DJI", name: "Dow Jones", baseValue: 38875.50 },
  { symbol: "IXIC", name: "NASDAQ", baseValue: 16245.80 },
  { symbol: "RUT", name: "Russell 2000", baseValue: 2045.60 },
  { symbol: "VIX", name: "Volatility Index", baseValue: 14.25 },
];

function generateRandomChange(base: number, volatility: number = 0.03): { value: number; change: number; changePercent: number } {
  const changePercent = (Math.random() - 0.5) * 2 * volatility * 100;
  const change = base * (changePercent / 100);
  const value = base + change;
  return { value: Math.round(value * 100) / 100, change: Math.round(change * 100) / 100, changePercent: Math.round(changePercent * 100) / 100 };
}

function generateSparklineData(basePrice: number, points: number = 12): number[] {
  const data: number[] = [];
  let currentPrice = basePrice * 0.98;
  
  for (let i = 0; i < points; i++) {
    currentPrice = currentPrice + (Math.random() - 0.5) * (basePrice * 0.02);
    data.push(Math.round(currentPrice * 100) / 100);
  }
  
  return data;
}

export function getStocks(): Stock[] {
  return stockData.map(stock => {
    const { value, change, changePercent } = generateRandomChange(stock.basePrice);
    const marketCapMultiplier = Math.random() * 900 + 100;
    
    return {
      symbol: stock.symbol,
      name: stock.name,
      price: value,
      change,
      changePercent,
      volume: Math.floor(Math.random() * 50000000) + 1000000,
      marketCap: Math.floor(stock.basePrice * marketCapMultiplier * 1000000),
      sector: stock.sector,
      exchange: stock.exchange,
      sparklineData: generateSparklineData(stock.basePrice),
    };
  });
}

export function getStockBySymbol(symbol: string): Stock | undefined {
  const stockInfo = stockData.find(s => s.symbol === symbol);
  if (!stockInfo) return undefined;
  
  const { value, change, changePercent } = generateRandomChange(stockInfo.basePrice);
  const marketCapMultiplier = Math.random() * 900 + 100;
  
  return {
    symbol: stockInfo.symbol,
    name: stockInfo.name,
    price: value,
    change,
    changePercent,
    volume: Math.floor(Math.random() * 50000000) + 1000000,
    marketCap: Math.floor(stockInfo.basePrice * marketCapMultiplier * 1000000),
    sector: stockInfo.sector,
    exchange: stockInfo.exchange,
    sparklineData: generateSparklineData(stockInfo.basePrice),
  };
}

export function getStockFundamentals(symbol: string): StockFundamentals | undefined {
  const stockInfo = stockData.find(s => s.symbol === symbol);
  if (!stockInfo) return undefined;
  
  const { value: price, change, changePercent } = generateRandomChange(stockInfo.basePrice);
  const marketCapMultiplier = Math.random() * 900 + 100;
  const marketCap = Math.floor(stockInfo.basePrice * marketCapMultiplier * 1000000);
  
  // Generate realistic fundamentals
  const sharesOutstanding = Math.floor(marketCap / price);
  const eps = (Math.random() * 10 + 1) * (Math.random() > 0.2 ? 1 : -1);
  const peRatio = eps > 0 ? price / eps : 0;
  const revenue = marketCap * (Math.random() * 0.5 + 0.1);
  const netIncome = revenue * (Math.random() * 0.2 + 0.05);
  const dividendYield = Math.random() * 4;
  const beta = Math.random() * 1.5 + 0.5;
  
  // 52-week range
  const fiftyTwoWeekHigh = price * (1 + Math.random() * 0.3);
  const fiftyTwoWeekLow = price * (1 - Math.random() * 0.3);
  
  return {
    symbol: stockInfo.symbol,
    name: stockInfo.name,
    description: stockInfo.description,
    sector: stockInfo.sector,
    industry: stockInfo.industry,
    exchange: stockInfo.exchange,
    currency: "USD",
    country: "United States",
    website: `https://www.${stockInfo.symbol.toLowerCase()}.com`,
    employees: stockInfo.employees,
    ceo: stockInfo.ceo,
    
    // Price metrics
    price,
    change,
    changePercent,
    previousClose: price - change,
    open: price + (Math.random() - 0.5) * price * 0.01,
    dayHigh: price * (1 + Math.random() * 0.02),
    dayLow: price * (1 - Math.random() * 0.02),
    
    // 52-week range
    fiftyTwoWeekHigh,
    fiftyTwoWeekLow,
    fiftyTwoWeekChange: (Math.random() - 0.3) * 50,
    
    // Volume metrics
    volume: Math.floor(Math.random() * 50000000) + 1000000,
    avgVolume: Math.floor(Math.random() * 40000000) + 2000000,
    avgVolume10Day: Math.floor(Math.random() * 45000000) + 1500000,
    
    // Market cap and shares
    marketCap,
    sharesOutstanding,
    sharesFloat: Math.floor(sharesOutstanding * (0.7 + Math.random() * 0.25)),
    sharesShort: Math.floor(sharesOutstanding * Math.random() * 0.05),
    shortRatio: Math.random() * 5 + 0.5,
    
    // Valuation metrics
    peRatio: Math.round(peRatio * 100) / 100,
    forwardPE: Math.round((peRatio * (0.8 + Math.random() * 0.4)) * 100) / 100,
    pegRatio: Math.round((peRatio / (10 + Math.random() * 20)) * 100) / 100,
    priceToSales: Math.round((marketCap / revenue) * 100) / 100,
    priceToBook: Math.round((2 + Math.random() * 8) * 100) / 100,
    enterpriseValue: Math.floor(marketCap * (1 + Math.random() * 0.2)),
    evToRevenue: Math.round((3 + Math.random() * 7) * 100) / 100,
    evToEbitda: Math.round((10 + Math.random() * 15) * 100) / 100,
    
    // Profitability metrics
    profitMargin: Math.round((Math.random() * 30 + 5) * 100) / 100,
    operatingMargin: Math.round((Math.random() * 35 + 10) * 100) / 100,
    grossMargin: Math.round((Math.random() * 40 + 20) * 100) / 100,
    returnOnAssets: Math.round((Math.random() * 15 + 2) * 100) / 100,
    returnOnEquity: Math.round((Math.random() * 30 + 5) * 100) / 100,
    
    // Income statement
    revenue: Math.floor(revenue),
    revenuePerShare: Math.round((revenue / sharesOutstanding) * 100) / 100,
    revenueGrowth: Math.round((Math.random() * 30 - 5) * 100) / 100,
    grossProfit: Math.floor(revenue * (0.3 + Math.random() * 0.3)),
    ebitda: Math.floor(revenue * (0.15 + Math.random() * 0.2)),
    netIncome: Math.floor(netIncome),
    eps: Math.round(eps * 100) / 100,
    epsGrowth: Math.round((Math.random() * 40 - 10) * 100) / 100,
    
    // Balance sheet
    totalCash: Math.floor(marketCap * (0.05 + Math.random() * 0.15)),
    totalDebt: Math.floor(marketCap * (0.1 + Math.random() * 0.3)),
    debtToEquity: Math.round((Math.random() * 100 + 10) * 100) / 100,
    currentRatio: Math.round((1 + Math.random() * 2) * 100) / 100,
    quickRatio: Math.round((0.5 + Math.random() * 1.5) * 100) / 100,
    bookValue: Math.round((price / (2 + Math.random() * 8)) * 100) / 100,
    
    // Dividends
    dividendRate: Math.round((dividendYield * price / 100) * 100) / 100,
    dividendYield: Math.round(dividendYield * 100) / 100,
    payoutRatio: Math.round((Math.random() * 60 + 10) * 100) / 100,
    exDividendDate: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    dividendDate: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    fiveYearDividendYield: Math.round((dividendYield * (0.8 + Math.random() * 0.4)) * 100) / 100,
    
    // Technical indicators
    beta: Math.round(beta * 100) / 100,
    fiftyDayMA: Math.round(price * (0.95 + Math.random() * 0.1) * 100) / 100,
    twoHundredDayMA: Math.round(price * (0.9 + Math.random() * 0.2) * 100) / 100,
    
    // Analyst recommendations
    targetHighPrice: Math.round(price * (1.2 + Math.random() * 0.3) * 100) / 100,
    targetLowPrice: Math.round(price * (0.7 + Math.random() * 0.2) * 100) / 100,
    targetMeanPrice: Math.round(price * (1 + Math.random() * 0.15) * 100) / 100,
    targetMedianPrice: Math.round(price * (1 + Math.random() * 0.12) * 100) / 100,
    recommendationMean: Math.round((1 + Math.random() * 3) * 10) / 10,
    recommendationKey: ["strong_buy", "buy", "hold", "sell"][Math.floor(Math.random() * 4)],
    numberOfAnalysts: Math.floor(Math.random() * 40) + 5,
    
    // Ownership
    institutionalOwnership: Math.round((60 + Math.random() * 30) * 100) / 100,
    insiderOwnership: Math.round((Math.random() * 15) * 100) / 100,
    
    // Earnings
    earningsDate: new Date(Date.now() + Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    earningsQuarterlyGrowth: Math.round((Math.random() * 50 - 10) * 100) / 100,
    
    // Dates
    lastUpdated: new Date().toISOString(),
  };
}

export function getEarningsHistory(symbol: string, quarters: number = 4): EarningsData[] {
  const stockInfo = stockData.find(s => s.symbol === symbol);
  if (!stockInfo) return [];
  
  const earnings: EarningsData[] = [];
  const now = new Date();
  
  for (let i = 0; i < quarters; i++) {
    const quarterDate = new Date(now.getTime() - (i * 90 * 24 * 60 * 60 * 1000));
    const year = quarterDate.getFullYear();
    const quarter = Math.floor(quarterDate.getMonth() / 3) + 1;
    
    const estimatedEPS = Math.random() * 3 + 0.5;
    const actualEPS = estimatedEPS * (0.9 + Math.random() * 0.2);
    const surprise = actualEPS - estimatedEPS;
    const estimatedRevenue = stockInfo.basePrice * 1000000000 * (0.8 + Math.random() * 0.4);
    const revenue = estimatedRevenue * (0.95 + Math.random() * 0.1);
    
    earnings.push({
      symbol,
      quarter: `Q${quarter} ${year}`,
      date: quarterDate.toISOString().split("T")[0],
      actualEPS: Math.round(actualEPS * 100) / 100,
      estimatedEPS: Math.round(estimatedEPS * 100) / 100,
      surprise: Math.round(surprise * 100) / 100,
      surprisePercent: Math.round((surprise / estimatedEPS) * 10000) / 100,
      revenue: Math.floor(revenue),
      estimatedRevenue: Math.floor(estimatedRevenue),
    });
  }
  
  return earnings;
}

export function getDividendHistory(symbol: string, count: number = 8): DividendHistory[] {
  const stockInfo = stockData.find(s => s.symbol === symbol);
  if (!stockInfo) return [];
  
  const dividends: DividendHistory[] = [];
  const now = new Date();
  const baseAmount = stockInfo.basePrice * 0.005 + Math.random() * stockInfo.basePrice * 0.01;
  
  for (let i = 0; i < count; i++) {
    const divDate = new Date(now.getTime() - (i * 90 * 24 * 60 * 60 * 1000));
    
    dividends.push({
      symbol,
      date: divDate.toISOString().split("T")[0],
      amount: Math.round(baseAmount * (0.95 + Math.random() * 0.1) * 100) / 100,
      type: "Cash",
    });
  }
  
  return dividends;
}

export function getInsiderTransactions(symbol: string, count: number = 10): InsiderTransaction[] {
  const stockInfo = stockData.find(s => s.symbol === symbol);
  if (!stockInfo) return [];
  
  const titles = ["CEO", "CFO", "COO", "Director", "VP of Engineering", "General Counsel", "VP of Sales"];
  const names = ["John Smith", "Sarah Johnson", "Michael Chen", "Emily Davis", "Robert Wilson", "Jennifer Brown", "David Lee"];
  
  const transactions: InsiderTransaction[] = [];
  const now = new Date();
  
  for (let i = 0; i < count; i++) {
    const transDate = new Date(now.getTime() - (i * 15 * 24 * 60 * 60 * 1000 + Math.random() * 10 * 24 * 60 * 60 * 1000));
    const isBuy = Math.random() > 0.6;
    const shares = Math.floor(Math.random() * 50000) + 1000;
    const price = stockInfo.basePrice * (0.95 + Math.random() * 0.1);
    
    transactions.push({
      symbol,
      name: names[Math.floor(Math.random() * names.length)],
      title: titles[Math.floor(Math.random() * titles.length)],
      transactionDate: transDate.toISOString().split("T")[0],
      transactionType: isBuy ? "buy" : "sell",
      shares,
      price: Math.round(price * 100) / 100,
      value: Math.round(shares * price),
    });
  }
  
  return transactions;
}

export function getInstitutionalHolders(symbol: string): InstitutionalHolder[] {
  const stockInfo = stockData.find(s => s.symbol === symbol);
  if (!stockInfo) return [];
  
  const institutions = [
    "Vanguard Group Inc.",
    "BlackRock Inc.",
    "State Street Corporation",
    "Fidelity Investments",
    "Capital Research & Management",
    "Geode Capital Management",
    "Northern Trust Corporation",
    "Bank of America Corporation",
    "Morgan Stanley",
    "JPMorgan Chase & Co.",
  ];
  
  const now = new Date();
  const marketCap = stockInfo.basePrice * (Math.random() * 900 + 100) * 1000000;
  
  return institutions.map((holder, index) => {
    const percentHeld = (10 - index) * 0.8 + Math.random() * 2;
    const value = marketCap * (percentHeld / 100);
    const shares = Math.floor(value / stockInfo.basePrice);
    
    return {
      symbol,
      holder,
      shares,
      dateReported: new Date(now.getTime() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      percentHeld: Math.round(percentHeld * 100) / 100,
      value: Math.floor(value),
    };
  });
}

export function getSectorPerformance(): SectorPerformance[] {
  const sectors = ["Technology", "Finance", "Healthcare", "Consumer", "Energy", "Industrial", "Communications", "Crypto"];
  
  return sectors.map(sector => {
    const sectorStocks = stockData.filter(s => s.sector === sector);
    const avgPrice = sectorStocks.reduce((sum, s) => sum + s.basePrice, 0) / sectorStocks.length;
    const { change, changePercent } = generateRandomChange(avgPrice, 0.02);
    
    return {
      sector,
      change,
      changePercent,
      marketCap: sectorStocks.reduce((sum, s) => sum + s.basePrice * 1000000000, 0),
      volume: sectorStocks.reduce((sum) => sum + Math.floor(Math.random() * 50000000), 0),
    };
  });
}

export function getMarketIndices(): MarketIndex[] {
  return indexData.map(index => {
    const { value, change, changePercent } = generateRandomChange(index.baseValue, 0.015);
    
    return {
      symbol: index.symbol,
      name: index.name,
      value,
      change,
      changePercent,
    };
  });
}

export function searchStocks(query: string): Stock[] {
  const normalizedQuery = query.toLowerCase();
  const allStocks = getStocks();
  
  return allStocks.filter(stock => 
    stock.symbol.toLowerCase().includes(normalizedQuery) ||
    stock.name.toLowerCase().includes(normalizedQuery) ||
    stock.sector.toLowerCase().includes(normalizedQuery)
  );
}

export function getAllSymbols(): string[] {
  return stockData.map(s => s.symbol);
}
