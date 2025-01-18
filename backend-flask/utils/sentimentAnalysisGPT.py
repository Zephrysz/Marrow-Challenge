from openai import OpenAI
import json

class SentimentAnalysisGPTManager():
    def __init__(self):
        self.client = OpenAI()
        
    
    def analyze_transcript_gpt(self, transcript):
        try:
            response = self.client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": '''You will receive a transcription of a audio. 
                    Your job is to detect and flag abusive or toxic expression in the text, if it exists. 
                    You need to be aware that any kind of abusive behaviour is not allowed, 
                    and should check for subtle or variations of insults or ways of undermining someone.
                    If there are no issues in regards of toxicity and abusive behaviour in the transcript, 
                    you may return only the overall sentiment of the transcript
                    The following are the attributes that the phrase should be classified if they are
                    considered to be abusive or toxic:
                    "TOXICITY" : A rude, disrespectful, or unreasonable comment;
                    "IDENTITY_ATTACK" : Negative or hateful comments targeting someone because of their identity;
                    "INSULT" : Insulting, inflammatory, or negative comment towards a person or a group of people;
                    "PROFANITY" : Swear words, curse words, or other obscene or profane language;
                    "THREAT" : Describes an intention to inflict pain, injury, or violence against an individual or group;
                    "SEXUALLY_EXPLICIT" : Contains references to sexual acts, body parts, or other lewd content;
                    "FLIRTATION" : Pickup lines, complimenting appearance, subtle sexual innuendos, etc.
                    "OTHER" : if they are toxic or abusive and not categorized in any of the previous
                    '''
                },
                {   "role": "user", "content": f"{transcript}"},
                ],
                response_format={
                "type": "json_schema",
                "json_schema":
                    {
                    "name": "transcript_evaluation",
                    "schema": {
                        "type": "object",
                        "properties": {
                        "overall_sentiment": {
                            "type": "string",
                            "description": "The overall sentiment of the whole transcription, indicating positive, neutral, or negative.",
                            "enum": [
                            "positive",
                            "neutral",
                            "negative"
                            ]
                        },
                        "sentiment_analysis": {
                            "type": "array",
                            "description": "An array of phrases that are toxic or abusive in the transcription along with their individual sentiments and scores. You should be aware of subtle toxic/abusive behaviour.",
                            "items": {
                            "type": "object",
                            "properties": {
                                "phrase": {
                                "type": "string",
                                "description": "A specific phrase extracted from the transcription."
                                },
                                "sentiment": {
                                "type": "string",
                                "description": "The sentiment associated with the phrase, indicating various categories of toxicity.",
                                "enum": [
                                    "TOXICITY",
                                    "IDENTITY_ATTACK",
                                    "INSULT",
                                    "PROFANITY",
                                    "THREAT",
                                    "SEXUALLY_EXPLICIT",
                                    "FLIRTATION",
                                    "OTHER"
                                ]
                                },
                                "score": {
                                "type": "number",
                                "description": "A numerical score from 0 to 1 representing the strength of the sentiment, where higher values represent stronger sentiments."
                                }
                            },
                            "required": [
                                "phrase",
                                "sentiment",
                                "score"
                            ],
                            "additionalProperties": False
                            }
                        }
                        },
                        "required": [
                        "overall_sentiment",
                        "sentiment_analysis"
                        ],
                        "additionalProperties": False
                    },
                    "strict": True
                    }
                }
            )
            return json.loads(response.choices[0].message.content)
        except Exception as e:
            return {"error": str(e)}
