from pydub import AudioSegment

class AudioToWavManager():
    def __init__(self):
        pass
    
    def convert_to_wav(self, audio_file_path):
        # not sure abt every audio file
        if audio_file_path.lower().endswith(('.ogg', )): # can add more extensions here
            audio = AudioSegment.from_file(audio_file_path)
            new_audio_file_path = audio_file_path.rsplit('.', 1)[0] + ".wav"
            audio.export(new_audio_file_path, format='wav')
            return new_audio_file_path
        return audio_file_path