import os

from flask import Flask, request, jsonify, send_file 
from flask_cors import CORS
import nltk
import json

from utils.speechRecognition import SpeechToTextManager
from utils.sentimentAnalysis import SentimentAnalysisManager
from utils.sentimentAnalysisGPT import SentimentAnalysisGPTManager

app = Flask(__name__)
CORS(app)

nltk.download('punkt_tab')

UPLOAD_FOLDER = 'temp_audio'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

speech_to_text_manager = SpeechToTextManager()
sentiment_analysis_manager = SentimentAnalysisManager()
sentiment_analysis_manager_gpt = SentimentAnalysisGPTManager()

@app.route('/')
def hello_world():
    return 'Hello, World!'


@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']
    model = request.form.get('model', 'small')
    language = request.form.get('language', 'portuguese')
    sentiment_model = request.form.get('sentiment_model', 'llm') 
    
    if file:
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
        file.save(file_path)
        try:
            text = speech_to_text_manager.recognize_speech_split_in_chunks(file_path, 5, model)

            if sentiment_model == 'transformers':
                sentiment_analysis_result = sentiment_analysis_manager.analyze_transcript_by_phrases(text, language)
            elif sentiment_model == 'llm':
                sentiment_analysis_result = sentiment_analysis_manager_gpt.analyze_transcript_gpt(text)
                sentiment_analysis_result = json.loads(sentiment_analysis_result)

            overall_sentiment = sentiment_analysis_result["overall_sentiment"]
            sentiment_analysis = sentiment_analysis_result["sentiment_analysis"]

            os.remove(file_path)
            transcription_path = f"{file_path.rsplit('.', 1)[0]}.txt"
            with open(transcription_path, 'w') as f:
                f.write(text)
                
            return jsonify({
                        'text': text,
                        'overall_sentiment': overall_sentiment,
                        'sentiment_analysis': sentiment_analysis,
                        'transcription_path': transcription_path,
                        }), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    return jsonify({'error': 'File upload failed'}), 400


@app.route('/download/<path:filename>', methods=['GET'])
def download_file(filename):
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    if os.path.exists(file_path):
        return send_file(file_path, as_attachment=True)
    return jsonify({'error': 'File not found'}), 404


if __name__ == '__main__':
    app.run(debug=True)
