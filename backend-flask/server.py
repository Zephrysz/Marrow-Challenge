import os

from flask import Flask, request, jsonify, send_file 
from flask_cors import CORS
import nltk
import json

from utils.speechRecognition import SpeechToTextManager
from utils.sentimentAnalysis import SentimentAnalysisManager
from utils.sentimentAnalysisGPT import SentimentAnalysisGPTManager
from utils.formatText import TextFormatterManager

app = Flask(__name__)
CORS(app)

nltk.download('punkt_tab')

UPLOAD_FOLDER = 'audios'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

speech_to_text_manager = SpeechToTextManager()
sentiment_analysis_manager = SentimentAnalysisManager()
sentiment_analysis_manager_gpt = SentimentAnalysisGPTManager()
text_formatter_manager = TextFormatterManager()

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
    format_enabled = request.form.get('format_enabled', 'false')
    
    if file:
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
        file.save(file_path)
        # try:
        text = speech_to_text_manager.recognize_speech_split_in_chunks(file_path, 5, model)

        if sentiment_model == 'transformers':
            sentiment_analysis_result = sentiment_analysis_manager.analyze_transcript_by_phrases(text, language)
        elif sentiment_model == 'llm':
            sentiment_analysis_result = sentiment_analysis_manager_gpt.analyze_transcript_gpt(text)

        overall_sentiment = sentiment_analysis_result["overall_sentiment"]
        sentiment_analysis = sentiment_analysis_result["sentiment_analysis"]

        formatted_transcription_path = ''
        formatted_text = ''
        if format_enabled == 'true':
            formatted_text = text_formatter_manager.format_text(text)
            formatted_transcription_path = f"{file_path.rsplit('.', 1)[0]}_formatted.txt"
            with open(formatted_transcription_path, 'w') as f:
                f.write(str(formatted_text))
            

        os.remove(file_path)

        transcription_path = f"{file_path.rsplit('.', 1)[0]}.txt"
        with open(transcription_path, 'w') as f:
            f.write(text)

        return jsonify({
                    'text': text,
                    'overall_sentiment': overall_sentiment,
                    'sentiment_analysis': sentiment_analysis,
                    'transcription_path': transcription_path,
                    'formatted_transcription_path': formatted_transcription_path,
                    'formatted_text': formatted_text,
                    }), 200
        # except Exception as e:
        #     return jsonify({'error': str(e)}), 500

    return jsonify({'error': 'File upload failed'}), 400


@app.route('/download/<path:filename>', methods=['GET'])
def download_file(filename):
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    if os.path.exists(file_path):
        return send_file(file_path, as_attachment=True)
    return jsonify({'error': 'File not found'}), 404


if __name__ == '__main__':
    app.run(debug=True)
