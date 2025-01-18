export interface SentimentAnalysisItem {
    phrase: string;
    sentiment: string;
    score: number;
}
  
export interface ProcessingResult {
    text: string;
    overall_sentiment: string;
    sentiment_analysis?: SentimentAnalysisItem[];
    transcription_path: string;

    formatted_transcription_path?: string;
    formatted_text?: string;
}
