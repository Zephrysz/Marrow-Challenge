import speech_recognition as sr
from pydub import AudioSegment

import os

language_to_iso = {
    'czech': 'cs',
    'danish': 'da',
    'dutch': 'nl',
    'english': 'en',
    'estonian': 'et',
    'finnish': 'fi',
    'french': 'fr',
    'german': 'de',
    'greek': 'el',
    'italian': 'it',
    'norwegian': 'no',
    'polish': 'pl',
    'portuguese': 'pt',
    'slovene': 'sl',
    'spanish': 'es',
    'swedish': 'sv',
    'turkish': 'tr'
}


class SpeechToTextManager():
    def __init__(self):
        self.recognizer = sr.Recognizer()
        

    def recognize_speech(self, audio_file_path : str, model : str = "small", language : str = "portuguese") -> str:
        with sr.AudioFile(audio_file_path) as source:
            audio_data = self.recognizer.record(source)
            try:
                if model == 'whisper_api':
                    text = self.recognizer.recognize_openai(audio_data, language=language_to_iso.get(language) )
                else: # whisper local
                    text = self.recognizer.recognize_faster_whisper(audio_data, model, language=language_to_iso.get(language))
            except sr.UnknownValueError:
                return "Could not understand audio"
            except sr.RequestError as e:
                return f"Could not request results; {e}"
        return text


    def recognize_speech_split_in_chunks(self, audio_file_path : str, minutes : int = 2, model : str = "small", language : str = "portuguese") -> str:
        sound = AudioSegment.from_file(audio_file_path)

        chunk_length_ms = 1000 * 60 * minutes
        chunks = [sound[i:i + chunk_length_ms] for i in range(0, len(sound), chunk_length_ms)]
        folder_name = "audio-fixed-chunks-temp"
        os.makedirs(folder_name, exist_ok=True)
        whole_text = ""
 
        for i, audio_chunk in enumerate(chunks, start=1):

            chunk_filename = os.path.join(folder_name, f"chunk{i}.wav")
            audio_chunk.export(chunk_filename, format="wav")
            try:
                text = self.recognize_speech(chunk_filename, model, language)
            except sr.UnknownValueError as e:
                print("Error:", str(e))
            else:
                whole_text += text
            finally:
                os.remove(chunk_filename)

        return whole_text
