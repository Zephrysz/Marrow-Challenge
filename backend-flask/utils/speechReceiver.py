import os

import speech_recognition as sr

class SpeechReceiverManager():
    def __init__(self):
        self.recognizer = sr.Recognizer()
        self.recognizer.energy_threshold = 4000
        self.recognizer.dynamic_energy_threshold = False
        self.recognizer.pause_threshold = 1.5
        self.microphone = sr.Microphone()


    def speech_receiver(self):
        with self.microphone as source:
            self.recognizer.adjust_for_ambient_noise(source, duration=1)
            print("Say something!")
            folder_name = "audio-fixed-chunks-temp"
            os.makedirs(folder_name, exist_ok=True)  # Ensure the folder exists
            audio_name = os.path.join(folder_name, 'temp.wav')
            try:
                audio = self.recognizer.listen(source=source, timeout=100, phrase_time_limit=100)

                with open(audio_name, "wb") as f:
                    f.write(audio.get_wav_data())

                print("Audio recorded successfully.")
                return audio_name

            except sr.WaitTimeoutError:
                print("No speech detected within the time limit.")
                return None

            except sr.RequestError as e:
                print(f"Error with the speech recognition service: {e}")
                return None

            except Exception as e:
                print(f"Unexpected error occurred: {e}")
                return None


