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

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']
    model = request.form.get('model', 'small')
    language = request.form.get('language', 'portuguese')
    sentiment_model = request.form.get('sentiment_model', 'llm')
    format_enabled = request.form.get('format_enabled', 'false')
    
    if not file:
        return jsonify({'error': 'No file uploaded or file is empty'}), 400
    
    try:
        file_path = save_uploaded_file(file)

        text = transcribe_audio(file_path, model)

        sentiment_analysis_result = analyze_sentiment(text, sentiment_model, language)
        overall_sentiment = sentiment_analysis_result["overall_sentiment"]
        sentiment_analysis = sentiment_analysis_result["sentiment_analysis"]

        formatted_text, formatted_transcription_path = format_text_if_enabled(text, file_path, format_enabled)

        os.remove(file_path)

        transcription_path = save_transcription_to_file(text, file_path)

        return jsonify({
                    'text': text,
                    'overall_sentiment': overall_sentiment,
                    'sentiment_analysis': sentiment_analysis,
                    'transcription_path': transcription_path,
                    'formatted_transcription_path': formatted_transcription_path,
                    'formatted_text': formatted_text,
                    }), 200
    except FileNotFoundError as e:
        return jsonify({'error': f"File error: {str(e)}"}), 400
    except ValueError as e:
        return jsonify({'error': f"Value error: {str(e)}"}), 400
    except Exception as e:
        return jsonify({'error': f"Unexpected error: {str(e)}"}), 500


@app.route('/download/<path:filename>', methods=['GET'])
def download_file(filename):
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    if os.path.exists(file_path):
        return send_file(file_path, as_attachment=True)
    return jsonify({'error': 'File not found'}), 404


@app.route('/set_api_key', methods=['POST'])
def set_api_key():
    try:
        data = request.json
        api_key = data.get('api_key')

        if not api_key:
            return jsonify({'error': 'API key is required'}), 400

        os.environ['OPENAI_API_KEY'] = api_key

        global sentiment_analysis_manager_gpt
        global text_formatter_manager

        sentiment_analysis_manager_gpt = SentimentAnalysisGPTManager()
        text_formatter_manager = TextFormatterManager()

        return jsonify({'message': 'API key updated successfully and managers restarted'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400


def save_uploaded_file(file):
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
    file.save(file_path)
    return file_path


def analyze_sentiment(text, sentiment_model, language):
    if sentiment_model == 'transformers':
        return sentiment_analysis_manager.analyze_transcript_by_phrases(text, language)
    elif sentiment_model == 'llm':
        return sentiment_analysis_manager_gpt.analyze_transcript_gpt(text)
    else:
        raise ValueError(f"Unknown sentiment model: {sentiment_model}")


def format_text_if_enabled(text, file_path, format_enabled):
    if not format_enabled:
        return '', '' 
    formatted_text = text_formatter_manager.format_text(text)
    formatted_transcription_path = f"{file_path.rsplit('.', 1)[0]}_formatted.txt"
    with open(formatted_transcription_path, 'w') as f:
        f.write(str(formatted_text))
    return formatted_text, formatted_transcription_path


if __name__ == '__main__':
    app.run(debug=True)
