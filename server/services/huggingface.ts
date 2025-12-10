const HF_API_URL = "https://api-inference.huggingface.co/models/ProsusAI/finbert";

interface SentimentResult {
  label: string;
  score: number;
}

export async function analyzeFinancialSentiment(text: string): Promise<{ sentiment: "positive" | "negative" | "neutral"; score: number }> {
  const apiKey = process.env.HUGGINGFACE_API_KEY;
  
  if (!apiKey) {
    console.warn("Hugging Face API key not configured, using fallback");
    return fallbackSentiment(text);
  }

  try {
    const response = await fetch(HF_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputs: text }),
    });

    if (!response.ok) {
      if (response.status === 503) {
        // Model is loading, use fallback
        console.log("FinBERT model loading, using fallback");
        return fallbackSentiment(text);
      }
      throw new Error(`HuggingFace API error: ${response.status}`);
    }

    const results: SentimentResult[][] = await response.json();
    
    if (!results || !results[0] || results[0].length === 0) {
      return fallbackSentiment(text);
    }

    // FinBERT returns results sorted by score, first is highest
    const topResult = results[0].reduce((prev, curr) => 
      curr.score > prev.score ? curr : prev
    );

    const sentiment = topResult.label.toLowerCase() as "positive" | "negative" | "neutral";
    const score = sentiment === "positive" ? topResult.score : 
                  sentiment === "negative" ? -topResult.score : 0;

    return { sentiment, score };
  } catch (error) {
    console.error("HuggingFace API error:", error);
    return fallbackSentiment(text);
  }
}

function fallbackSentiment(text: string): { sentiment: "positive" | "negative" | "neutral"; score: number } {
  const positiveWords = ["growth", "profit", "beat", "surge", "gain", "rise", "strong", "positive", "upgrade", "outperform", "bullish", "record", "success"];
  const negativeWords = ["loss", "drop", "fall", "decline", "miss", "weak", "negative", "downgrade", "underperform", "bearish", "concern", "risk", "cut"];
  
  const lowerText = text.toLowerCase();
  
  let positiveCount = 0;
  let negativeCount = 0;
  
  positiveWords.forEach(word => {
    if (lowerText.includes(word)) positiveCount++;
  });
  
  negativeWords.forEach(word => {
    if (lowerText.includes(word)) negativeCount++;
  });
  
  if (positiveCount > negativeCount + 1) {
    return { sentiment: "positive", score: Math.min(0.9, 0.5 + positiveCount * 0.1) };
  } else if (negativeCount > positiveCount + 1) {
    return { sentiment: "negative", score: Math.max(-0.9, -0.5 - negativeCount * 0.1) };
  }
  
  return { sentiment: "neutral", score: (positiveCount - negativeCount) * 0.1 };
}

export async function analyzeMultipleTexts(texts: string[]): Promise<Array<{ text: string; sentiment: "positive" | "negative" | "neutral"; score: number }>> {
  const results = await Promise.all(
    texts.map(async (text) => {
      const result = await analyzeFinancialSentiment(text);
      return { text, ...result };
    })
  );
  
  return results;
}
