export interface SentimentAnalysisItem {
    phrase: string;
    sentiment: string;
    score: number;
}
  
export interface ProcessingResult {
    text: string;
    sentiment_analysis?: SentimentAnalysisItem[];
}
