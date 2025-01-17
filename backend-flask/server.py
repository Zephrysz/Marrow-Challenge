import os

from flask import Flask, request, jsonify
from flask_cors import CORS

from utils.speechRecognition import SpeechToTextManager
from utils.sentimentAnalysis import SentimentAnalysisManager

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'temp_audio'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

speech_to_text_manager = SpeechToTextManager()
sentiment_analysis_manager = SentimentAnalysisManager()

@app.route('/')
def hello_world():
    return 'Hello, World!'


@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']
    model = request.form.get('model', 'small')
    
    if file:
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
        file.save(file_path)
        try:
            text = speech_to_text_manager.recognize_speech_split_in_chunks(file_path, 5, model)

            sentiment_results = sentiment_analysis_manager.analyze_transcript_by_phrases(text)


            os.remove(file_path)
            with open(f"{file_path.rsplit('.', 1)[0]}.txt", 'w') as f:
                f.write(text)
            return jsonify({
                            'text': text,
                            'sentiment_analysis': sentiment_results,
                            }), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    return jsonify({'error': 'File upload failed'}), 400

if __name__ == '__main__':
    app.run(debug=True)
