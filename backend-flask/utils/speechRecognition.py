import speech_recognition as sr
from pydub import AudioSegment

import os

class SpeechToTextManager():
    def __init__(self):
        self.recognizer = sr.Recognizer()


    def recognize_speech(self, audio_file_path : str, model : str = "small"):
        with sr.AudioFile(audio_file_path) as source:
            audio_data = self.recognizer.record(source)
            try:
                text = self.recognizer.recognize_faster_whisper(audio_data, model)
            except sr.UnknownValueError:
                return "Could not understand audio"
            except sr.RequestError as e:
                return f"Could not request results; {e}"
        return text


    def recognize_speech_split_in_chunks(self, audio_file_path : str, minutes : int = 5, model : str = "small") -> str:
        # maybe this can be optimized (a lot of write/read from os)
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
                text = self.recognize_speech(chunk_filename, model)
            except sr.UnknownValueError as e:
                print("Error:", str(e))
            else:
                whole_text += text
            finally:
                os.remove(chunk_filename)

        return whole_text
