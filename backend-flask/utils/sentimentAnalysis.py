from transformers import pipeline

class SentimentAnalysisManager():
    def __init__(self):
        self.model = pipeline('sentiment-analysis', model="lxyuan/distilbert-base-multilingual-cased-sentiments-student")
        #"distilbert": pipeline('sentiment-analysis', model="tabularisai/multilingual-sentiment-analysis")
        #"pt-BR": pipeline('sentiment-analysis', model="neuralmind/bert-base-portuguese-cased")\
        #"distilbert": pipeline('sentiment-analysis', model="lxyuan/distilbert-base-multilingual-cased-sentiments-student")
        # https://huggingface.co/models?other=sentiment-analysis
        
    
    def preprocess_text(text):
        text = re.sub(r"\s+", " ", text)  # Remove espaços extras
        text = re.sub(r"[^a-zA-Zá-úÁ-Ú0-9\s,.!?-]", "", text)  # Remove caracteres especiais
        return text.strip()



    def analyze_transcript_by_phrases(self, transcript):

        phrases = transcript.split(". ")
        sentiment_results = []

        for phrase in phrases:
            if phrase.strip():
                sentiment_result = self.model(phrase)
                sentiment_results.append({
                    "phrase": phrase,
                    "sentiment": sentiment_result[0]["label"],
                    "score": sentiment_result[0]["score"]
                })

        return sentiment_results