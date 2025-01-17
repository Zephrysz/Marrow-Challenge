from collections import defaultdict

from transformers import pipeline
import nltk
from nltk.tokenize import sent_tokenize
import re

class SentimentAnalysisManager():
    def __init__(self):
        self.model = pipeline('sentiment-analysis', model="lxyuan/distilbert-base-multilingual-cased-sentiments-student")
        #"distilbert": pipeline('sentiment-analysis', model="tabularisai/multilingual-sentiment-analysis")
        #"pt-BR": pipeline('sentiment-analysis', model="neuralmind/bert-base-portuguese-cased")
        #"distilbert": pipeline('sentiment-analysis', model="lxyuan/distilbert-base-multilingual-cased-sentiments-student")
        # https://huggingface.co/models?other=sentiment-analysis
        
    
    def preprocess_text(self, text):
        text = re.sub(r"\s+", " ", text)
        text = re.sub(r"[^a-zA-Zá-úÁ-Ú0-9\s,.!?-]", "", text) 
        return text.strip()


    def analyze_transcript_by_phrases(self, transcript, language='portuguese'):
        transcript = self.preprocess_text(transcript)
        
        phrases = sent_tokenize(transcript, language)

        # phrases = transcript.split(". ")
        sentiment_analysis = []

        for phrase in phrases:
            if phrase.strip():
                sentiment_result = self.model(phrase)
                sentiment_analysis.append({
                    "phrase": phrase,
                    "sentiment": sentiment_result[0]["label"],
                    "score": sentiment_result[0]["score"]
                })
                
        overall_sentiment = self.compute_overall_sentiment(sentiment_analysis)

        return {
            "sentiment_analysis": sentiment_analysis,
            "overall_sentiment": overall_sentiment
        }
    
    def compute_overall_sentiment(self, sentiment_analysis):
        weighted_scores = defaultdict(float)

        for result in sentiment_analysis:
            sentiment = result["sentiment"]
            score = result["score"]
            weighted_scores[sentiment] += score

        overall_sentiment = max(weighted_scores, key=weighted_scores.get)

        return overall_sentiment
